<template>
  <div style="text-align: center;">
    <img
      ref="img"
      @mouseenter="show"
      @mouseleave="hide"
      :src="imgUrl"
      :alt="alt"
      :id="id"
      :width="width"
      :height="height"
      :class="style"
    />
  </div>
</template>
<script>
export default {
  name: 'ag-image',
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      id: '',
      hover: false,
      imgUrl: '',
      alt: '',
      width: '',
      height: 28,
      style: '',
      imgDiv: null
    }
  },
  beforeMount () {
    this.id = this.params.props.id
    this.hover = this.params.props.hover
    this.alt = this.params.props.alt
    this.width = this.params.props.width
    this.height = this.params.props.height
    this.style = this.params.props.style
    if (this.params.props.urlType === 'plain') {
      this.imgUrl = this.params.value
    } else {
      this.imgUrl =
        this.params.props.transitionUrl +
        '?' +
        this.params.colName +
        '=' +
        this.params.value
    }
  },
  methods: {
    show (evt) {
      if (!this.hover) return
      // 原始宽高
      let imgHeight = this.$refs.img.naturalHeight
      let imgWidth = this.$refs.img.naturalWidth
      // 屏幕宽高
      let bodyRect = document.body.getBoundingClientRect()
      let bodyHeight = bodyRect.height
      let bodyWidth = bodyRect.width
      let scrollHeight = document.documentElement.scrollTop

      let el = evt.target
      let pos = el.getBoundingClientRect()
      let parentWidth = el.parentNode.getBoundingClientRect().width

      let offsetX = parentWidth > pos.width ? pos.width + 10 : parentWidth
      offsetX = offsetX + pos.x
      let offsetY = pos.top + scrollHeight
      if (offsetX + imgWidth > bodyWidth) {
        offsetX = pos.x - imgWidth - 10
      }
      if (offsetY + imgHeight > bodyHeight) {
        offsetY = offsetY - imgHeight + this.height
      }

      this.imgDiv = document.createElement('div')
      this.imgDiv.className = 'table-preview-img'
      this.imgDiv.style.cssText = `position: absolute;left:${offsetX}px;top:${offsetY}px;z-index: 99;`
      this.imgDiv.innerHTML = `<img src='${this.imgUrl}' />`
      document.body.appendChild(this.imgDiv)
    },
    hide () {
      this.hover && document.body.removeChild(this.imgDiv)
    }
  }
}
</script>
<style lang="scss">
.table-preview-img{
  background-color: #fff;
  border-radius: 8px;
  padding:5px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
  img{
    border-radius: 8px;
    vertical-align: bottom;
  }
}
</style>
