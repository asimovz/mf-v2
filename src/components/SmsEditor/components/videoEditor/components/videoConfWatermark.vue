<template>
  <el-form class="videoConfWatermark" :model="markOpts" label-width="70px" label-position="left">
    <el-form-item label="水印设置">
      <el-radio-group size="small" v-model="markOpts.type">
        <el-radio-button label="text">文字水印</el-radio-button>
        <el-radio-button label="image">图片水印</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <div v-show="markOpts.type === 'text'">
      <el-form-item label="文本">
        <el-input size="small" placeholder="请输入文本" v-model="markOpts.text"></el-input>
      </el-form-item>
      <div class="font-control">
        <div>
          <el-select
            size="small"
            placeholder="字体"
            v-model="markOpts.fontFamily">
            <el-option v-for="family in familys" :key="family.value" :label="family.label" :value="family.value"></el-option>
          </el-select>
        </div>
        <div>
          <el-select
            size="small"
            v-model="markOpts.fontSize">
            <el-option v-for="size in sizes" :key="size" :label="`${size}px`" :value="size"></el-option>
          </el-select>
        </div>
        <div>
          <el-color-picker @active-change="colorChange" v-model="markOpts.fontColor"></el-color-picker>
        </div>
      </div>
    </div>
    <div v-show="markOpts.type === 'pic'">
      <upLoadImage v-model="markOpts.img" />
    </div>

    <div style="margin-top:20px">
      <el-button size="small" :loading="loading" type="primary" plain @click="launch">添加水印</el-button>
    </div>
  </el-form>
</template>

<script>
import upLoadImage from './upLoadImage'

function isEmpty(val){
  return ['', '{}', '[]'].includes(JSON.stringify(val))
}
// 水印配置项可能包含的项目
const defaultOpts = {
  type: 'text',
  text: '',
  img: '',
  fontFamily: 'Microsoft YaHei',
  fontSize: 14,
  fontColor: '#333333'
}

export default {
  name: 'videoConfWatermark',
  inject: {
    parent: 'confContainer',
    mmsConfig: 'mmsConfig'
  },
  components:{
    upLoadImage
  },
  props: {
    value: {
      type: Object,
      default(){
        return {}
      }
    },
    dragRect: {
      type: Object,
      default(){
        return {}
      }
    },
    imgRect: {
      type: Object,
      default(){
        return {
          width: 0,
          height: 0
        }
      }
    }
  },
  data () {
    return {
      loading: false,
      familys: [
        {label: '宋体', value: 'SimSun', rvalue: 'simsun'},
        {label: '黑体', value: 'SimHei', rvalue: 'simhei'},
        {label: '微软雅黑', value: 'Microsoft YaHei', rvalue: 'msyh'}
      ],
      sizes: [14, 16, 18, 20, 24, 26, 28, 32],
      markOpts: {}
    }
  },
  computed: {
    mediaInfo () {
      return this.parent.mediaInfo
    },
    videoSrc(){
      return this.mediaInfo.uri
    }
  },
  watch: {
    videoSrc(){
      this.init()
    },
    markOpts: {
      deep: true,
      handler (v) {
        this.$emit('input', v)
      }
    }
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      this.markOpts = isEmpty(this.value)
        ? {...defaultOpts}
        : Object.assign({}, defaultOpts, this.value)
    },
    colorChange (e) {
      this.markOpts.fontColor = e
    },
    async launch () {
      this.loading = true
      try {
        const {type, text, img, fontFamily, fontSize, fontColor} = this.markOpts
        const {top, left, width, height} = this.dragRect
        const {uri, renderWidth, renderHeight, videoHeight, videoWidth} = this.mediaInfo

        const realTop = parseInt(top / renderHeight * videoHeight)
        const realLeft = parseInt(left / renderWidth * videoWidth)

        const agrv = {
          top: realTop, // 水印top位置 | Number
          left: realLeft // 水印left位置 | Number
        }
        const multiples = videoWidth / renderWidth

        if (type === 'text') {
          agrv.content = text // 文字水印内容 | String
          agrv.size = Math.ceil(fontSize * multiples) // 文字水印大小(取整) | Number | 14
          agrv.font = this.familys.find(family => family.value === fontFamily).rvalue // 文字字体 | String | 微软雅黑
          agrv.color = fontColor // 文字颜色 | String | #000000
        } else {
          agrv.uri = img
          agrv.width = width * multiples // 图片水印宽 | Number
          agrv.height = parseInt(agrv.width / (this.imgRect.width / this.imgRect.height)) // 图片水印高 | Number
        }

        const {nodeUrl, videoWaterMark} = this.mmsConfig

        const { data } = await this._http(`${nodeUrl}${videoWaterMark}`, {
          uri,
          type,
          agrv
        }, {timeout: 20000})

        this.markOpts.text = ''
        this.markOpts.img = ''

        this.loading = false

        this.$emit('complete', {
          uri: data.uri
        })
      } catch(err) {
        this.loading = false
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss">
.videoConfWatermark{
  .font-control{
    display: flex;
    align-items: center;
    & > div{
      margin-right: 10px;
      &:last-child{
        margin:0;
      }
    }
    .el-color-picker{
      height: 32px;
      width: 32px;
      vertical-align: bottom;
      .el-color-picker__trigger{
        padding: 2px;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>