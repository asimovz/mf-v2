<template>
  <div class="upload-wrapper" @click="f_imgSrc && $refs.file.click()" :title="f_imgSrc ? '点击替换' : ''" v-loading="uploadLoing">
    <input ref="file" type="file" name="" style="display: none;" @change="fileChaned" accept=".png, .jpg, .jpeg, .gif" />
    <div class="upload-btn" v-show="!f_imgSrc" @click="$refs.file.click()">
      <i class="el-icon-upload" style="font-size: 50px;margin-bottom: 5px;"></i>
      <div>点击上传</div>
    </div>
    <div class="upload-btn" v-show="f_imgSrc">
      <img class="uploaded-img" :src="f_imgSrc" />
      <span class="img-remove el-icon-error" title="移除" @click="remove"></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'upLoadImage',
  props: {
    value: {
      type: String,
      default: ''
    },
    size: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      uploadLoing: false
    }
  },
  watch: {
    value(val){
      this.f_imgSrc = val
    }
  },
  inject: {
    mmsConfig: 'mmsConfig'
  },
  computed: {
    uploadUrl() {
      return `${this.mmsConfig.file}`
    },
    f_imgSrc: {
      get(){
        return this.value
      },
      set(val){
        this.$emit('input', val)
      }
    },
    maxSize(){
      if(typeof this.size === 'string'){
        let unit = this.size.slice(-1)
        if(['k', 'K'].includes(unit)){
          return parseInt(this.size)
        }
        if(['m', 'M'].includes(unit)){
          return parseInt(this.size) * 1024
        }
      }else{
        return this.zise
      }
    }
  },
  methods: {
    remove() {
      this.f_imgSrc = ''
      this.$emit('input', '')
    },
    fileChaned(evt) {
      this.uploadLoing = true

      let target = evt.target
      let file = target.files[0]

      if(this.size && !this.isSizeValidated(file.size)){
        this.$message.warning(`大小不得超过 ${typeof this.size === 'string' ? this.size : (this.maxSize + 'k')}`)
        this.uploadLoing = false
        return false
      }


      let fd = new FormData()
      fd.append('file', file)

      this.upload(fd)
    },

    isSizeValidated(size){
      return this.maxSize * 1024 >= size
    },

    upload(fd) {
      this._http(this.mmsConfig.nodeUrl + this.mmsConfig.uploadFile, fd).then(res => {
        
        this.$message({
          type: res.error === 0 ? 'success' : 'error',
          message: res.message
        })

        if(res.error === 0){
          this.$emit('input', res.data.uri)
        }
      }).finally(end => {
        this.$refs.file.value = ''
        this.uploadLoing = false
      })
    }

  }
}

</script>
<style lang="scss">
.upLoadImage {
  .el-upload {
    display: block;
  }

  .el-upload-dragger {
    width: auto;
  }

  .preview-img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: 50% auto;
    background-position: center;
    background-repeat: no-repeat;

    .el-icon-circle-close {
      color: #409EFF;
      position: absolute;
      font-size: 1.5em;
      top: 5px;
      right: 5px;
      padding: 10px;
      background-color: transparent;

      &:hover {
        color: #66b1ff;
      }
    }

    .btn {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(255, 255, 255, .8);
      visibility: hidden;
    }

    &:hover {
      .btn {
        visibility: visible;
      }
    }
  }
}

.upload-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 180px;
  border: 1px dashed #d9d9d9;

  &:hover {
    border-color: #3C64B9;

    .img-remove {
      display: block
    }
  }
}

.upload-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9a9a9a;
  font-size: 16px;
  cursor: pointer;
}

.img-remove {
  display: none;
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 30px;
  color: #aaa;
  cursor: pointer;
}

.uploaded-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>
