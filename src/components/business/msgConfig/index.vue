<template>
  <div class="SceneConfig">
    <div>
      <m-step class="scene-step" :data="steps" :current="currentStep" direction="vertical">
      </m-step>
    </div>
    <div>
      <m-form
        name="MsgConfigForm"
        id="MsgConfigForm"
        :action="action"
      >

      <input type="hidden" name="messageTemplateId" :value="data.fields.messageTemplateId.value" />
        <!-- 选择短信模板 -->
        <div v-show="currentStep === 0" class="scene-template">
          <m-form-item label="短信模板编码">
            <m-input type="text" :value="data.fields.messageTemplateCode.value" :disabled="true"></m-input>
          </m-form-item>
          <m-form-item label="短信模板">
            <m-input type="textarea" :value="data.fields.messageTemplate.value" :disabled="true"></m-input>
          </m-form-item>
          <m-form-item label="短信样例">
            <m-input type="textarea" :value="data.fields.messageTemplateExample.value" :disabled="true"></m-input>
          </m-form-item>
          <m-form-item label="卡片名称">
            <m-input type="text" :value="data.fields.cardName.value" :disabled="true"></m-input>
          </m-form-item>
          <div class="btn-wrap">
            <m-link class="m-link-button" :href="cancelHerf" ref="cancel">取消</m-link>
            <m-button  @click.native="next">下一步</m-button>
          </div>
        </div>

        <!-- 配置卡片字段 -->
        <div v-show="currentStep === 1" class="scene-field">
          <m-row gutter="20">
            <m-col span="6">
              <div class="upload-file" :style="`background-image:url('${previewUrl}')`">
                <div class="btn">
                  <span class="close-item" @click="del(index)">×</span>
                  <p>上传白名单截图</p>
                  <span v-show="uploadValidateErr" class="m-form-error-tip">请上传白名单截图</span>
                </div>
                <input type="file" name="whiteImgUrl" accept="image/*" @change="changeImg" />
              </div>
            </m-col>
            <m-col span="18">
              <m-form-item class="field-add" label="提取字段">
                <m-button size="small" type="default" style="width: 100%" @click.native="add_identifySceneWords">+</m-button>
              </m-form-item>
              <template v-for="(item, index) in identifySceneWords">
                <m-form-item  class="field-item" :key="index">
                  <m-input
                    class="item-mr"
                    ref="identifySceneWords_key"
                    type="text"
                    name="_NA_"
                    v-model="item.key"
                    placeholder="请输入提取字段"
                    :validate="{'required':true}"
                    validateMsg="请输入提取字段"
                  ></m-input> 
                  <m-input
                    class="item-mr"
                    ref="identifySceneWords_value"
                    type="text"
                    name="_NA_"
                    v-model="item.value"
                    placeholder="请输入提取字段"
                    :validate="{'required':true}"
                    validateMsg="请输入提取字段"
                  ></m-input>
                  <m-button type="default" @click.native="del_identifySceneWords(index)">删除</m-button>
                </m-form-item>
              </template>
              <div class="btn-wrap">
                <input type="hidden" name="identifySceneWords" :value="identifySceneWords_value" />
                <m-link class="m-link-button" :href="cancelHerf" ref="cancel">取消</m-link>
                <m-button
                  ref="saveBtn"
                  type="primary"
                  name="submitButton"
                  value="submitButton"
                  id="MsgConfigForm_submitButton"
                  size="default"
                  toggle="linkFormForm"
                >保存并退出</m-button>
              </div>
            </m-col>
          </m-row>
        </div>
      </m-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'msg-config',
  data () {
    return {
      data: this.configData,
      noValidate: false,
      steps: [
        { title: '选择短信模板' },
        { title: '配置卡片字段' }
      ],
      btnTypes: [
        { value: 'Call', label: '拨打电话' },
        { value: 'SendMessage', label: '发送短信' },
        { value: 'APP', label: '打开APP' },
        { value: 'H5', label: '打开H5' },
        { value: 'QuickApp', label: '打开快应用' }
      ],
      // 卡片字段要提取的字段
      identifySceneWords: [],
      previewUrl: '',
      uploadValidateErr: false,
      // 短信模板通道号
      messageTemplateNumber: '',
      // 短信模板
      messageTemplate: '',
      // 短信样例
      messageTemplateExample: '',
      currentStep: 0,
      btnBaseItem: {
        linkId: '',
        btnMfrId: '',
        buttonArea: '',
        receiveNum: '',
        sendMessage: '',
        sendNum: '',
        h5Link: '',
        btnName: '',
        btnType: '',
        // 选择后展现的主数据
        value: '',
        btnRule: '',
        // 下面可选
        deeplink: '',
        packageName: ''
      },
      cancelHerf: window.location.pathname
    }
  },
  props: {
    configData: {
      type: Object

    },
    action: {
      type: String,
      default: ''
    }
  },
  computed: {
    btnsValue () {
      return JSON.stringify(this.btns)
    },
    identifySceneWords_value () {
      return JSON.stringify(this.identifySceneWords)
    }
  },
  created () {
    this.previewUrl = this.data.fields.whiteImgUrl.value
    this.identifySceneWords = this.data.fields.identifySceneWords
  },
  provide () {
    return {
      form: {
        labelWidth: 90
      }
    }
  },
  methods: {
    tplChange (data) {
      if (!data[0]) return
      this.messageTemplateNumber = data[0].messageTemplateNumber
      this.messageTemplate = data[0].messageTemplate
      this.messageTemplateExample = data[0].messageTemplateExample
    },
    mSelectCange (data, item) {
      if (!data[0]) {
        // item.receiveNum = "";
        // item.sendNum = "";
        // item.deeplink = "";
        // item.h5Url = "";
        // item.packageName = "";
        // item.sendMessage = "";
      } else {
        item.receiveNum = data[0].receiveNum
        item.sendNum = data[0].sendNum
        item.linkName = data[0].linkName
        item.deeplink = data[0].deeplink
        item.h5Url = data[0].h5Url
        item.packageName = data[0].packageName
        item.sendMessage = data[0].sendMessage
        item.linkId = data[0].linkId
      }
    },
    add_identifySceneWords () {
      let item = {
        key: '',
        value: ''
      }
      this.identifySceneWords.push(item)
    },
    del_identifySceneWords (index) {
      this.identifySceneWords.splice(index, 1)
    },
    
    async next (type) {

      if (type !== 'skip') {
        // if (this.currentStep === 0) {
        //   const valiState = await _v(["messageTemplateCode"]);
        //   if (!valiState) return;
        // }

        if (this.currentStep === 1) {
          this.uploadValidateErr = this.data.fields.whiteImgUrl.value === ''
          // const valiState = await _v(["identifySceneWords"]);
          // 校验 提取字段所有值不为空
          const valiState = await this.identifySceneWords.every((item, index) => {
            return item.key.length > 0 && item.value.length > 0
          })
          if (!valiState || this.uploadValidateErr) return
        }
      } else {
        this.noValidate = true
        this.uploadValidateErr = false
      }

      if (this.currentStep === 2) return
      this.currentStep++
    },
    changeImg (e) {
      let previewUrl = ''
      let file = e.target.files[0]

      if (window.createObjectURL !== undefined) {
        previewUrl = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        previewUrl = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        previewUrl = window.webkitURL.createObjectURL(file)
      }
      this.uploadValidateErr = false
      this.previewUrl = previewUrl
    },
  },
  beforeDestroy () {
    this.back()
  }
}
</script>
<style lang='less' scoped>
.SceneConfig {
  display: flex;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  & > div {
    &:last-child {
      padding-left: 30px;
      flex: 1;
    }
  }
  .form-horizontal {
    padding: 0;
    margin: 0;
  }
  // .ivu-form-item,
  .btn-push {
    margin-bottom: 15px;
  }
  .scene-template {
    .btn-wrap {
      width: 45%;
      min-width: 410px;
      text-align: right;
    }
  }
  .scene-field {
    .btn-wrap {
      width: 66.7%;
      padding-right: 20px;
      min-width: 300px;
      text-align: right;
    }
  }
  .scene-button {
    .btn-wrap {
      text-align: right;
    }
  }
  .upload-file {
    font-size: 12px;
    background: #f2f2f2;
    position: relative;
    min-height: 450px;
    text-align: center;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    p {
      margin-bottom: 1em;
    }
    &:hover {
      opacity: 0.8;
    }
    .btn {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
    }
    i {
      font-size: 2em;
    }
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0;
    }
  }
  .img-preview {
    background: #f2f2f2;
    min-height: 450px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .btn-push-item {
    margin-bottom: 15px;
    border: 1px solid #ccc;
    padding: 15px 15px 0 15px;
    border-radius: 5px;
    position: relative;
    .close-item {
      position: absolute;
      top: 0;
      right: 0;
      padding: 5px 8px;
      cursor: pointer;
      font-size: 18px;
      background: #f1f1f1;
      border-radius: 0 5px 0 0;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  // 自定义按钮样式   防止m-button的默认提交
  .btnClass {
    display: inline-block;
    margin-bottom: 0;
    outline: 0;
    font-weight: 500;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    line-height: 1.5;
    user-select: none;
    padding: 5px 15px 6px;
    font-size: 12px;
    border-radius: 4px;
    background-color: #fff;
    border-color: #dcdee2;
  }
  .btnClass:hover {
    color: #747b8b;
    background-color: #fff;
    border-color: #e3e5e8;
  }
  .btn-primary {
    color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .btn-primary:hover {
    color: #fff;
    background-color: #57a3f3;
    border-color: #57a3f3;
  }
  .field-del {
    color: #57a3f3;
    padding: 3px 0 0 12px;
  }
  .field-del:hover {
    cursor: pointer;
  }
}
</style>
<style lang='less'>
.scene-template .aw-form-item_label {
  width: 10% !important;
  min-width: 120px;
}
.scene-template .aw-form-item_content {
  width: 36% !important;
  min-width: 300px;
}
.scene-button .aw-form-item_label {
  width: 100px !important;
}
.scene-button .aw-form-item_content {
  // width: 500px !important;
}
.scene-button .scene-two {
  display: flex;
}
.scene-button .scene-two>.aw-form-item_label {
  width: 0 !important;
  padding: 0;
}
.scene-button .scene-two .scene-left .aw-form-item_label{
  width: 100px !important;
}
.scene-button .scene-two .scene-right .aw-form-item_label{
  width: 70px !important;
}
.scene-button  .scene-two>.aw-form-item_content {
  width: 700px  !important;
}
.scene-button  .scene-two .aw-form-item>.aw-form-item_content {
  width: 47% !important;
}
.scene-button .aw-form-item_content .m-select-wrap{
  width: 98%;
}


.field-add {
  .aw-form-item_label {
    text-align: left !important;
    width: auto !important;
  }

}
.item-mr {
  margin-right: 10px;
}
// .field-item .aw-form-item_label {
//   width: 0;
// }
// .field-item .aw-form-item_content {
//   display: flex;
//   .field-key {
//     width: 30%;
//     padding-right: 30px;
//   }
//   .item-mr {
//     flex: 1;
//   }
// }
// .field-item .m-form-error-tip {
//   top: 0;
// }
</style>