<template>
  <div class="watermarkHandler" :style="videoRect">
    <vue-drag-resize
      class="drag"
      :aspectRatio="false"
      :h="h"
      :w="w"
      :x="x"
      :y="y"
      :isResizable="options.type === 'image'"
      :minh="30"
      :minw="30"
      :parentW="mediaInfo.renderWidth || 609"
      :parentH="mediaInfo.renderHeight || 343"
      :isActive="true"
      :parentLimitation="true"
      @rectChange="rectChange">
      <div
        class="mark-text"
        :style="{
          fontSize: `${options.fontSize}px`,
          color: options.fontColor,
          fontFamily: options.fontFamily,
          fontWeight: options.fontWeight,
        }"
        v-show="options.type === 'text'"
        >{{options.text}}
      </div>
      <img
        class="mark-img"
        v-show="options.type === 'image'"
        :src="options.img">
    </vue-drag-resize>
  </div>
  
</template>

<script>
import vueDragResize from '../../vue-drag-resize/vue-drag-resize'

export default {
  name: 'watermarkHandler',
  components: {
    vueDragResize
  },
  inject: {
    parent: 'confContainer'
  },
  props: {
    value:{
      type: Object,
      default(){
        return {}
      }
    },
    options: Object
  },
  data () {
    return {
      rect: {
        top:0,
        left:0,
        width:0,
        height:0
      },
      w: 30,
      h: 30,
      x: 0,
      y: 15,
      defaultImgW: 100,
      aspectRatio: false
    }
  },
  computed: {
    mediaInfo(){
      return this.parent.mediaInfo
    },
    videoRect(){
      const {playerWidth, playerHeight, renderWidth, renderHeight} = this.mediaInfo

      return {
        // width: `${renderWidth}px`,
        // height: `${renderHeight}px`,
        top: `${(playerHeight - renderHeight) / 2}px`,
        left: `${(playerWidth - renderWidth) / 2}px`
        // right: 'auto',
        // bottom: 'auto'
      }
    }
  },
  watch: {
    rect:{
      deep:true,
      handler(v){
        this.$emit('input', v)
      }
    },
    playerWidth () {
      this.reset()
    },
    options: {
      deep: true,
      async handler (v, o) {
        this.$nextTick(() => {
          this.reset()
        })
      }
    }
  },
  async created () {
    this.reset()
  },
  methods: {
    rectChange(rect){
      let { width, height, left, top } = rect

      this.w = width
      this.h = height
      this.x = left
      this.y = top

      this.rect = rect
    },
    async reset () {
      if(this.options)
      this.h = await this.getH()
      this.aspectRatio = false
      this.w = this.getW()
      this.x = this.getX()
      this.$nextTick(() => {
        this.aspectRatio = true
      })

      this.rect.top = this.y
      this.rect.left = this.x
      this.rect.width = this.w
      this.rect.height = this.h
    },
    /**
     * 按资源类型，计算实际占用空间
     */
    async getH () {
      const {type, img, fontSize} = this.options

      return new Promise((resolve, reject) => {
        if (type === 'image') {
          if(!this.tempImg){
            this.tempImg = new Image()
          }
          
          this.tempImg.src = img
          this.tempImg.onload = () => {
            const {width, height} = this.tempImg

            this.imgW = width
            this.imgH = height
            
            this.$emit('img-rect-change', {
              width,
              height
            })

            const imgH = Math.round(this.defaultImgW * (height / width))
            resolve(imgH < 30 ? 30 : imgH)
          }
        } else {
          resolve(fontSize < 30 ? 30 : fontSize)
        }
      })
    },
    /**
     * @returns {number} 返回全半角字符总长度
     */
    getW () {
      const {type, text, fontSize} = this.options
      const cnChar = text.match(/[^\x00-\xff]/g)
      const cnCharNum = cnChar ? cnChar.length : 0

      const textW = text
        ? cnCharNum * fontSize + (text.length - cnCharNum) * fontSize / 2 + 2
        : 30

      return type === 'text' ? Math.round(textW) : Math.round(this.defaultImgW)
    },
    getX () {
      // return Math.round(this.mediaInfo.playerWidth - this.w - 20)
      return this.x
    }
  }
}
</script>

<style lang="scss">
.watermarkHandler{
  position: absolute;
  // width: 100%;
  // height: 100%;
  // top:0;
  // right: 0;
  // bottom: 0;
  // left: 0;
  .drag{
    cursor: pointer;
  }
  .mark-text{
    line-height: 1;
  }
  .mark-img{
    max-width: 100%;
    max-height: 100%;
  }
}
</style>