<template>
  <div style="display:inline-block" id="mFileRoot">
    <!-- <input class="hidden" ref="input" :form="form" :id="id" :name="name" type="file" :multiple="multiple" :accept="accept" @change="uploadSelect" /> -->
    <input name="isUploadedFile" type="hidden" size="100" v-model="fileList" v-validate="validate" :data-vv-as="fieldTitle" data-vv-name="isUploadedFile" />
    <input :form="form" :name="isUpFileDelName" type="hidden" v-model="isUpFileDel" />
    <template v-if="type=='button'">
      <template v-for="(file, index) in fileName">
        <span class="components_upload_list">{{file}} <i class="el-icon-close" @click="handleRemove(index)" /> </span>
      </template>
      <button v-show="multiple || !fileList.length" name="filebtn" class="m-link-button m-link-button-primary" @click="handleClick">
        <i class="el-icon-upload"/> {{text}}
      </button>
    </template>
    <template v-else>
      <div :class="fileClasses" :style="styles" v-show="multiple || !fileList.length">
        <div class="handleClick" @click="handleClick"></div>
      </div>

      <template v-if="fileList.length">
        <div class="previews" v-for="(file, index) in fileList" :key="index" :style="styles">
          <img :src="file" ref="uploadImg" :style="imgStyle">
          <span class="upload_files-actions" v-if="type === 'card'">
            <i class="el-icon-close" style="font-size:16px;" @click="handleRemove(index)"></i>
            <i class="el-icon-search"  style="font-size:16px;" @click="handleScale(index)"></i>
          </span>
        </div>
      </template>
    </template>
    <span v-if="errors.has('isUploadedFile')" class="m-form-error-tip">
      {{ validateMsg?validateMsg:errors.first('isUploadedFile') }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'm-file',
  props: {
    id: String,
    name: {
      type: String,
      default: 'file'
    },
    action: {
      type: String,
      default: 'null'
    },
    type: {
      type: String,
      default: 'button'
    },
    text: {
      type: String,
      default: '上传文件'
    },
    size: {
      type: String,
      default: '50'
    },
    maxSize: {
      type: Number,
      default: 1024
    },
    data: {
      type: Object
    },
    format: {
      type: String
    },
    accept: {
      type: String,
      default: 'image/gif,image/jpeg,image/jpg,image/png'
    },
    files: {
      type: String,
      default: null
    },
    form: String,
    fieldTitle: {
      type: String,
      default: ""
    },
    validate: [String, Object],
    validateMsg: String,
    multiple: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: [Number, String],
      default: 10
    }
  },

  data() {
    return {
      fileList: this.files != null ? this.files.split(",") : [],
      scaleStyle: '',
      imgStyle: '',
      fileName: [],
      isUpFileDelName: this.name + '_isUpFileDel',
      isUpFileDel: false
    }
  },

  computed: {
    styles() {
      let style = {};
      if (this.size) {
        style['width'] = `${this.size}px`;
        style['height'] = `${this.size}px`;
        style['line-height'] = `${this.size}px`;
      }
      return style;
    },

    fileClasses: function() {
      return this.errors.has('isUploadedFile') ? 'components_upload_box upload_box_error' : 'components_upload_box'
    }
  },

  methods: {
    handleClick(event) {
      event.stopPropagation()
      let fileInput = document.createElement("input")
      if(this.form) fileInput.setAttribute("form", this.form)
      fileInput.setAttribute("class", 'hidden')
      fileInput.setAttribute("ref", 'input')
      fileInput.setAttribute("id", this.id)
      fileInput.setAttribute("name", this.name)
      fileInput.setAttribute("type", 'file')
      fileInput.setAttribute("multiple", this.multiple)
      fileInput.setAttribute("accept", this.accept)
      fileInput.addEventListener('change', this.uploadSelect);
      let root = document.getElementById("mFileRoot")
      root.appendChild(fileInput)
      fileInput.click()
      // this.$refs.input.click()
    },

    uploadSelect(event) {
      console.log(101010,event)
      
      let inputDOM = event.target;
      // let file = Array.from(inputDOM.files)
      let files = Array.from(inputDOM.files)
      console.log(1111,event,files)
      if (files.some(file => !this.validateFile(file))) {
        return
      }

      if (this.type == "card") {
        var url = files.map(file => URL.createObjectURL(file))
        this.fileList = this.fileList.concat(url)
        setTimeout(() => {
          this.getImgOrigin()
        }, 20)
      } else {
        this.fileList = this.fileList.concat(files.map(file => file.name))
        this.fileName = this.fileName.concat(files.map(file => file.name))
      }
      if(this.fileList.length > this.maxLength){
        this.handleMessage(`最大上传数量为 ${this.maxLength}`,'warning')
        this.fileList = this.fileList.slice(0, this.maxLength)
        this.fileName = this.fileName.slice(0, this.maxLength)
      }

      this.isUpFileDel = false
      let root = document.getElementById("mFileRoot")
      let inputs = root.getElementsByClassName('hidden')
      for(var i in inputs){
        if(Array.from(inputs[i].files).length === 0) {
          root.removeChild(inputs[i])
        }
      }
    },
    handleRemove(index) {
      // let input = this.$refs.input
      // input.value = ""
      let root = document.getElementById("mFileRoot")
      root.removeChild(root.getElementsByClassName('hidden')[index])
      this.fileList.splice(index, 1)
      this.fileName.splice(index, 1)

      this.isUpFileDel = true
    },

    handleScale(index) {
      let scaleDiv = document.createElement("div")
      scaleDiv.className = "upload_scale"
      scaleDiv.innerHTML = "<img id='imgDrop'  src='" + this.fileList[index] + "' />"
      document.body.appendChild(scaleDiv)
      setTimeout(() => {
        scaleDiv.style.opacity = 1
      }, 0)
      scaleDiv.onclick = function() {
        document.body.removeChild(this)
      }

    },

    validateFile(file) {
      let index = this.fileList.findIndex(files => files.name === file.name)
      if (this.format) {
        const _file_format = file.name.split('.').pop().toLocaleLowerCase()
        const checked = this.format.split(",").some(item => item.toLocaleLowerCase() === _file_format);
        if (!checked) {
          this.handleMessage("请选择正确的格式进行上传，仅允许 " + this.format + " 文件格式",'info')
          this.handleRemove(index)
          return false
        }
      }

      if (this.maxSize) {
        if (file.size > Number(this.maxSize) * 1024) {
          this.handleMessage("上传文件大小超过最大限制(" + this.maxSize + " kb)",'info')
          this.handleRemove(index)
          return false
        }
      }
      return true
    },

    getImgOrigin() {
      let img = this.$refs.uploadImg
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (w >= h) {
        let posX = this.size / h * w
        posX = posX > this.size ? (this.size - posX) / 2 : 0
        this.imgStyle = {
          height: "100%",
          left: posX + "px"
        }
      } else {
        let posY = this.size / w * h
        posY = posY > this.size ? (this.size - posY) / 2 : 0
        this.imgStyle = {
          width: "100%",
          top: posY + "px",
          left: 0
        }
      }
    }
  },

  mounted: function() {
    let root = this.$root;
    if (this.fileList.length && this.type == "card")
      this.getImgOrigin()
    else if (this.fileList.length && this.type == "button" && this.fileList.indexOf("http://") != -1)
      this.fileName = this.fileList.split("%2").pop()

    if (this.validate) {
      //监听form的验证消息
      if (this.form) {
        root.eventBus.$on('form_validate' + this.form, () => {
          this.$validator.validate()
        })
      } else {
        let idInfoArray = this.id.split('_')
        let formId = null
        if (idInfoArray.length > 2) {
          formId = idInfoArray[0] + '_' + idInfoArray[1]
        } else {
          formId = idInfoArray[0]
        }
        root.eventBus.$on('form_validate' + formId, () => {
          this.$validator.validate()
        })
      }
    }
  },

  beforeDestroy: function() {
    if (this.validate) {
      if (this.form) {
        this.$root.eventBus.$off('form_validate' + this.form)
      } else {
        this.$root.eventBus.$off('form_validate' + this.id.split('_')[0])
      }
    }
  }
}

</script>
<style>
.upload_scale {
  position: fixed;
  width: 100%;
  height: 100%;
  line-height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity .3s ease;
}

.upload_zoom {
  opacity: 1
}

.upload_scale img {
  height: 80%;
}

.hidden {
  display: none
}

.components_upload_box {
  float: left;
  position: relative;
  margin-right: 9px;
  margin-bottom: 9px;
  border: 1px dashed #D9D9D9;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
}

.upload_box_error {
  float: left;
  position: relative;
  margin-right: 9px;
  margin-bottom: 9px;
  border: 1px dashed #ed3f14;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
}

.components_upload_box .handleClick {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3
}

.components_upload_box:before,
.components_upload_box:after {
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #D9D9D9;
  z-index: 1
}

.components_upload_box:before {
  width: 2px;
  height: 50%;
}

.components_upload_box:after {
  width: 50%;
  height: 2px;
}

.components_upload_box:hover {
  border-color: #c5c5c5
}

.components_upload_box img {
  position: absolute;
  z-index: 2;
}

.upload_files-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color: #FFF;
  background-color: rgba(0, 0, 0, .3);
  opacity: 0;
  z-index: 9;
  text-align: center;
  transition: opacity .3s;
}

.upload_files-actions i {
  line-height: inherit;
  display: inline;
  margin: 0 5px;
}

.upload_files-actions:hover {
  opacity: 1;
}

.components_upload_list {
  display: block;
  line-height: 20px;
  margin-top: 5px;
}

.components_upload_list i {
  display: none;
  cursor: pointer;
}
.components_upload_list:hover{color: #2d8cf0;}
.components_upload_list:hover i{display: inline-block;}

.previews{position: relative;float: left;margin: 0 9px 9px 0;}
.previews img{position: absolute;height: 100%}
.previews .ivu-icon{cursor: pointer;}
</style>
