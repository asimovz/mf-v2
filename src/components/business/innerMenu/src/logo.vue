<template>
  <div class="logo">
    <div class="logo-img" :style="styleObj">
      <template v-if="!data.img">
        {{word}}
      </template>
      <img v-else :src="data.img" />
    </div>
    <div class="logo-name">
      <div class="logo-title">{{data.name}}</div>
      <div class="logo-tel" v-show="data.tel">{{data.tel}}</div>
    </div>
  </div>
</template>

<script>
  function color16(){//十六进制颜色随机
    let r = Math.floor(Math.random()*256);
    let g = Math.floor(Math.random()*256);
    let b = Math.floor(Math.random()*256);
    let color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    return color;
  }

  function pickTextColorBasedOnBgColorSimple(bgColor, lightColor = '#fff', darkColor = '#000') {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16);
    var g = parseInt(color.substring(2, 4), 16);
    var b = parseInt(color.substring(4, 6), 16);
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ? darkColor : lightColor;
  }


  export default {
    name: 'preview-logo',
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    data(){
      return {
        styleObj: null
      }
    },
    watch: {
      data: {
        handler(val){
          this.setStyle(val.img)
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      word(){
        if(!this.data.img){
          return this.data.name.substr(0, 1)
        }
      }
    },
    methods: {
      setStyle(img){
        let bgColor = color16()
        this.styleObj = !img ? {
          backgroundColor: bgColor,
          color: pickTextColorBasedOnBgColorSimple(bgColor, '#fff', '#000')
        } : null
      }
    }
  }
</script>

<style scoped lang="less">
.logo{
  display: flex;align-items: center;
  &-img{width: 36px;height: 36px;line-height: 36px;text-align: center;border-radius: 50%;overflow: hidden;font-size: 16px;font-weight: 600;color: #fff
  }
  img{display: inline-block;height: inherit;width: inherit;vertical-align: middle;}
  &-name{flex: 1;margin-left: 10px;}
  &-title{font-weight: 600;font-size: 15px;}
  &-tel{margin-top: 3px;font-weight: 300;font-size: 12px;}
}
</style>