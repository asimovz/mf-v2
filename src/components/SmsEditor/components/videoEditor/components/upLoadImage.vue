<template>
  <el-upload
    class="upLoadImage"
    :action="uploadUrl"
    drag
    :show-file-list="false"
    accept=".png, .jpg, .jpeg, .gif, .bmp"
    :on-success="successHandler">
    <div v-show="value" class="preview-img" :style="`background-image: url(${value})`">
      <div class="btn">
        <i class="el-icon-circle-close" @click.stop="clean"></i>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">更换图片</div>
      </div>
      
    </div>
    <div v-show="!value">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </div>
  </el-upload>
</template>

<script>
export default {
  name: 'upLoadImage',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  inject: {
    mmsConfig: 'mmsConfig'
  },
  computed: {
    uploadUrl(){
      return `${this.mmsConfig.file}`
    }
  },
  methods: {
    successHandler (response, file, fileList) {
      this.$emit('input', response.data.uri)
    },
    clean(){
      this.$emit('input', '')
    }
  }
}
</script>

<style lang="scss">
.upLoadImage{
  .el-upload{
    display: block;
  }
  .el-upload-dragger{
    width: auto;
  }
  .preview-img{
    position: absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    background-size: 50% auto;
    background-position: center;
    background-repeat: no-repeat;
    .el-icon-circle-close{
      color: #409EFF;
      position: absolute;
      font-size: 1.5em;
      top:5px;
      right:5px;
      padding: 10px;
      background-color: transparent;
      &:hover{
        color: #66b1ff;
      }
    }
    .btn{
      position: absolute;
      top:0;
      right:0;
      bottom:0;
      left:0;
      background-color: rgba(255,255,255, .8);
      visibility: hidden;
    }
    &:hover{
      .btn{
        visibility: visible;
      }
    }
  }
}
</style>