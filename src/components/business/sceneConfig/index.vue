<template>
  <div class="SceneConfig">
    <div>
      <m-step class="scene-step" :data="steps" :current="currentStep" direction="vertical">
      </m-step>
    </div>
    <div>
      <m-form
        name="SceneConfigForm"
        id="SceneConfigForm"
        :action="action"
      >
        <!-- 选择短信模板 -->
        <div v-show="currentStep === 0" class="scene-template">
          <m-form-item label="所属活动组">
            <m-input type="text" :value="data.fields.marketingName.value" :disabled="true"></m-input>
          </m-form-item>
          <m-form-item label="所属活动">
            <m-input type="text" :value="data.fields.campaignName.value" :disabled="true"></m-input>
          </m-form-item>
          <m-form-item label="短信模板编码">
            <m-input type="text" :value="data.fields.messageTemplateCode.value" :disabled="true"></m-input>
            <!-- <m-select-table
              ref="messageTemplateCode"
              id="messageTemplateCode"
              name="messageTemplateCode"
              :data="data.fields.messageTemplateCode.url"
              keyField="messageTemplateId"
              valueField="messageTemplateId"
              placeholder="选择短信模板编码"
              searchField="messageTemplateCode"
              v-model="data.fields.messageTemplateCode.value"
              :column="[{title:'短信模板编码',data:'messageTemplateCode'},{title:'通道号',data:'messageTemplateNumber'}]"
              :page-size="20"
              :max-select="10"
              :pagination="true"
              @change="tplChange"
              :validate="'required'"
              :disabled="true"
              validateMsg="请选择短信模板编码"
            ></m-select-table> -->
          </m-form-item>
          <!-- <m-form-item label="通道号">
            <m-input type="text" :value="messageTemplateNumber" :disabled="true"></m-input>
          </m-form-item> -->
          <m-form-item label="短信模板">
            <m-input type="textarea" :value="data.fields.messageTemplate.value" :disabled="true"></m-input>
          </m-form-item>
          <m-form-item label="短信样例">
            <m-input type="textarea" :value="data.fields.messageTemplateExample.value" :disabled="true"></m-input>
          </m-form-item>
          <m-form-item label="所属场景组">
            <m-input type="text" :value="data.fields.scenesGroupName.value" :disabled="true"></m-input>
          </m-form-item>
          <m-form-item label="所属场景">
            <m-input type="text" :value="data.fields.scenesName.value" :disabled="true"></m-input>
          </m-form-item>
          <div class="btn-wrap">
            <m-button type="default" @click.native="back">取消</m-button>
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
                <span class="m-link-button" style="padding:6px 8px;" @click="add_identifySceneWords">+</span>
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
                  <span class="m-link-button" style="height:33px;" @click="del_identifySceneWords(index)">删除</span>
                </m-form-item>
              </template>
              <div class="btn-wrap">
                <m-button type="default" @click.native="back">取消</m-button>
                <m-button  @click.native="next('skip')">跳过</m-button>
                <m-button  @click.native="next">下一步</m-button>
              </div>
            </m-col>
          </m-row>
        </div>

        <!-- 配置按钮 -->
        <div v-show="currentStep === 2" class="scene-button">
          <m-row gutter="20">
            <m-col span="6">
              <div class="img-preview" :style="`background-image:url('${previewUrl}')`"></div>
            </m-col>
            <m-col span="12">
              <div class="btn-push">
                <m-button  @click.native="btnPush">添加按钮</m-button>
                <span>相同厂商和区域最多只能配置两个按钮</span>
              </div>

              <!-- 新增按钮组 -->
              <div class="btn-push-item" v-for="(btnItem, index) in btns" :key="index">
                <div class="">
                  <m-form-item class="scene-two">
                    <m-form-item label="按钮名称" class="scene-left">
                      <m-input
                        name="_NA_"
                        type="text"
                        v-model="btnItem.btnName"
                        :validate="'required'"
                        validateMsg="请输入按钮名称"
                        placeholder="输入按钮名称"
                      ></m-input>
                    </m-form-item>
                    <m-form-item label="按钮功能" class="scene-right">
                      <m-select
                        name="_NA_"
                        v-model="btnItem.btnType"
                        :options="btnTypes"
                        :validate="'required'"
                        validateMsg="请选择按钮功能"
                        placeholder="选择按钮功能"
                      ></m-select>
                    </m-form-item>
                  </m-form-item>
                  <!-- <m-form-item class="scene-two"> -->
                    <m-form-item label="厂商" :label-width="40">
                      <m-select
                        id="btnMfrId"
                        name="_NA_"
                        v-model="btnItem.btnMfrId"
                        :options="data.menuUrl.ManufacturerList.data"
                        :validate="'required'"
                        validateMsg="请选择厂商"
                        placeholder="选择厂商"
                      ></m-select>
                    </m-form-item>
                    <m-form-item label="区域" :label-width="40">
                      <m-tree-select
                        v-model="btnItem.buttonArea"
                        id="buttonArea"
                        name="_NA_"
                        :items="data.menuUrl.AreaList.url"
                        :show-checkbox="true"
                        :cascade-children="true"
                        :multiple="true"
                        :searchable="true"
                        :parameters="{}"
                        character=","
                        :validate="'required'"
                        validateMsg="请选择区域"
                        placeholder="选择区域"
                      ></m-tree-select>
                    </m-form-item>
                  <!-- </m-form-item> -->
                </div>
                <m-form-item label="电话号码" v-show="btnItem.btnType === 'Call'">
                  <m-select-table
                    name="_NA_"
                    :data="data.menuUrl.Call.url"
                    keyField="linkId"
                    valueField="receiveNum"
                    placeholder="选择电话号码"
                    searchField="receiveNum"
                    v-model="btnItem.linkId"
                    :column="[{title:'电话号码',data:'receiveNum'}]"
                    :page-size="20"
                    :max-select="10"
                    :pagination="true"
                    @change="mSelectCange($event, btnItem,'电话号码')"
                    :validate="'required'"
                    validateMsg="请选择电话号码"
                  ></m-select-table>
                  <!-- <m-input
                    type="text"
                    name="_NA_"
                    v-model="btnItem.receiveNum"
                    placeholder="输入电话号码"
                    :validate="'required'"
                    validateMsg="请输入电话号码"
                  ></m-input> -->
                </m-form-item>
                <m-form-item label="发送号码" v-show="btnItem.btnType === 'SendMessage'">
                  <m-select-table
                    name="_NA_"
                    :data="data.menuUrl.SendMessage.url"
                    keyField="linkId"
                    valueField="sendNum"
                    placeholder="选择发送号码"
                    searchField="sendNum"
                    v-model="btnItem.linkId"
                    :column="[{title:'发送号码',data:'sendNum'}]"
                    :page-size="20"
                    :max-select="10"
                    :pagination="true"
                    @change="mSelectCange($event, btnItem)"
                    :validate="'required'"
                    validateMsg="请选择发送号码"
                  ></m-select-table>
                  <!-- <m-input
                    type="text"
                    name="_NA_"
                    v-model="btnItem.sendNum"
                    :validate="'required'"
                    validateMsg="请输入发送号码"
                    placeholder="输入发送号码"
                  ></m-input> -->
                </m-form-item>
                <m-form-item label="短信内容" v-if="btnItem.btnType === 'SendMessage'">
                  <m-input
                    type="textarea"
                    name="_NA_"
                    v-model="btnItem.sendMessage"
                    :disabled="true"
                  ></m-input>
                </m-form-item>
                <m-form-item label="跳转APP" v-show="btnItem.btnType === 'APP'">
                  <m-select-table
                    name="_NA_"
                    :data="data.menuUrl.App.url"
                    keyField="linkId"
                    valueField="linkName"
                    placeholder="选择跳转APP"
                    searchField="linkName"
                    v-model="btnItem.linkId"
                    :column="[{title:'App',data:'linkName'},{title:'deeplink',data:'deeplink'}]"
                    :page-size="20"
                    :max-select="10"
                    :pagination="true"
                    @change="mSelectCange($event, btnItem)"
                    :validate="'required'"
                    validateMsg="请选择跳转APP"
                  ></m-select-table>
                </m-form-item>
                <m-form-item label="跳转链接" v-show="btnItem.btnType === 'H5'">
                  <m-select-table
                    name="_NA_"
                    :data="data.menuUrl.H5.url"
                    keyField="linkId"
                    valueField="h5Url"
                    placeholder="选择链接"
                    searchField="h5Url"
                    v-model="btnItem.linkId"
                    :column="[{title:'链接',data:'h5Url'},{title:'ID',data:'linkId'}]"
                    :page-size="20"
                    :max-select="10"
                    :pagination="true"
                    @change="mSelectCange($event, btnItem)"
                    :validate="'required'"
                    validateMsg="请选择跳转链接"
                  ></m-select-table>
                </m-form-item>
                <m-form-item label="链接地址" v-if="btnItem.btnType === 'H5'">
                  <m-input type="text" v-model="btnItem.h5Url" :disabled="true"></m-input>
                </m-form-item>
                <m-form-item label="跳转快应用" v-show="btnItem.btnType === 'QuickApp'">
                  <m-select-table
                    name="_NA_"
                    :data="data.menuUrl.QuickApp.url"
                    keyField="linkId"
                    valueField="linkName"
                    placeholder="选择快应用"
                    searchField="linkName"
                    v-model="btnItem.linkId"
                    :column="[{title:'链接名',data:'linkName'},{title:'deeplink',data:'deeplink'}]"
                    :page-size="20"
                    :max-select="10"
                    :pagination="true"
                    @change="mSelectCange($event, btnItem)"
                    :validate="'required'"
                    validateMsg="请选择跳转快应用"
                  ></m-select-table>
                </m-form-item>
                <m-form-item
                  label="deeplink"
                  v-if="btnItem.btnType === 'APP' || btnItem.btnType === 'QuickApp'"
                >
                  <m-input type="text" v-model="btnItem.deeplink" :disabled="true"></m-input>
                </m-form-item>
                <m-form-item label="包名" v-if="btnItem.btnType === 'APP'">
                  <m-input type="text" v-model="btnItem.packageName" :disabled="true"></m-input>
                </m-form-item>
                <m-form-item label="按钮规则" v-show="btnItem.btnType">
                  <m-input
                    type="textarea"
                    name="_NA_"
                    v-model="btnItem.btnRule"
                    :validate="'required'"
                    validateMsg="请输入按钮规则"
                    placeholder="输入按钮规则"
                  ></m-input>
                </m-form-item>
                <span class="close-item" @click="del(index)">×</span>
              </div>

              <div class="btn-wrap">
                <input type="hidden" name="scenesBtns" :value="btnsValue" />
                <input type="hidden" name="identifySceneWords" :value="identifySceneWords_value" />
                <input
                  type="hidden"
                  name="scenesProgramId"
                  :value="data.fields.scenesProgramId.value"
                />
                <m-button
                  style="visibility: hidden;"
                  ref="saveBtn"
                  type="primary"
                  name="submitButton"
                  value="submitButton"
                  id="SceneConfigForm_submitButton"
                  size="default"
                  toggle="linkFormForm"
                ></m-button>
                <m-link :href="cancelHerf" ref="cancel" style="visibility: hidden;"></m-link>
                <m-button type="default"  @click.native="back">取消</m-button>
                <m-button @click.native="save">保存并退出</m-button>
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
  name: 'scene-config',
  data () {
    return {
      data: this.configData,
      noValidate: false,
      steps: [
        { title: '选择短信模板' },
        { title: '配置卡片字段' },
        { title: '配置按钮' }
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
      btns: [],
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
    this.btns = this.data.fields.scenesBtns
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
    btnPush () {
      // if (this.btns.length === 2) return;

      this.btns.push(JSON.parse(JSON.stringify(this.btnBaseItem)))
    },
    del (index) {
      this.btns.splice(index, 1)
    },
    async next (type) {
      const _v = async fields => {
        const allValid = fields.map(field => {
          return this.$refs[field].$validator.validate()
        })

        const states = await Promise.all(allValid)
        return states.every(state => state)
      }

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
    back () {
      // this.currentStep = 0;
      this.$refs.cancel.$el.click()
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
    save () {
      let arr = {}
      for (let i = 0; i < this.btns.length; i++) {
        let name = this.btns[i].btnMfrId + '-' + this.btns[i].buttonArea
        if (!arr[name]) {
          arr[name] = 1
        } else if (arr[name] === 1) {
          arr[name] = 2
        } else {
          this.handleNotice('相同的城市和区域，最多只能配置两个按钮!', 'info')
          return
        }
      }
      this.$nextTick(() => {
        this.$refs.saveBtn.$el.click()
      })
    }
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