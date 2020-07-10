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
let _imgSrc = ''
export default {
  name: 'upLoadImage',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      f_imgSrc: '',
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

      _imgSrc = URL.createObjectURL(file)

      let fd = new FormData()
      fd.append('file', file)
      fd.append('actionType', 'upload')
      fd.append('saveResource', 'N')
      fd.append('type', 'image')

      this.upload(fd)
    },

    upload(fd) {
      this._http(this.mmsConfig.file, fd).then(res => {
        this.f_imgSrc = _imgSrc

        this.$emit('input', res.uri)
      }).finally(end => {
        _imgSrc = ''
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
