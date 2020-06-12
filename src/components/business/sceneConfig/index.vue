<template>
  <div class="SceneConfig">
    <div>
      <Steps class="scene-step" :current="currentStep" direction="vertical">
        <Step :title="item.title" v-for="(item,index) in steps" :content="item.content" :key="index"></Step>
      </Steps>
    </div>
    <div>
      <m-form name="SceneConfigForm" id="SceneConfigForm" class="ivu-form ivu-form-label-left" :action="action">
        <!-- 选择短信模板 -->
        <div v-show="currentStep === 0">
          <FormItem label="短信模板编码">
            <m-select ref="messageTemplateCode" id="messageTemplateCode" name="messageTemplateCode" :data="data.fields.messageTemplateCode.url" keyField="messageTemplateId" valueField="messageTemplateId" placeholder="选择短信模板编码" searchField="messageTemplateCode" v-model="data.fields.messageTemplateCode.value" :column="[{title:'短信模板编码',data:'messageTemplateCode'},{title:'通道号',data:'messageTemplateNumber'}]" :page-size="20" :max-select="10" :pagination="true" @change="tplChange" :validate="'required'" validateMsg="请选择短信模板编码"></m-select>
          </FormItem>

          <FormItem label="通道号">
            <m-input type="text" :value="messageTemplateNumber" :disabled="true"></m-input>
          </FormItem>
          <FormItem label="短信模板">
            <m-input type="textarea" :value="messageTemplate" :disabled="true"></m-input>
          </FormItem>
          <FormItem label="短信样例">
            <m-input type="textarea" :value="messageTemplateExample" :disabled="true"></m-input>
          </FormItem>
          <div class="btn-wrap">
            <Button @click="back">取消</Button>
            <Button type="primary" @click="next">下一步</Button>
          </div>
        </div>

        <!-- 配置卡片字段 -->
        <div v-show="currentStep === 1">
          <Row :gutter="20">
            <Col span="6">
              <div class="upload-file" :style="`background-image:url('${previewUrl}')`">
                <div class="btn">
                  <Icon type="ios-cloud-upload-outline" />
                  <p>上传白名单截图</p>
                  <span v-show="uploadValidateErr" class="m-form-error-tip">请上传白名单截图</span>
                </div>
                <input type="file" name="whiteImgUrl" accept="image/*" @change="changeImg">
              </div>
            </Col>
            <Col span="18">
              <FormItem label="识别情景">
                <m-input ref="identifyScene" id="identifyScene" type="text" name="identifyScene" :value="data.fields.identifyScene.value" placeholder="输入识别情景" :validate="{'required':!noValidate}" validateMsg="请输入识别情景"></m-input>
              </FormItem>
              <FormItem label="提取字段">
                <m-input ref="identifySceneWords" id="identifySceneWords" type="textarea" name="identifySceneWords" :value="data.fields.identifySceneWords.value" placeholder="输入提取字段" :validate="'required'" validateMsg="请输入提取字段"></m-input>
              </FormItem>
              <div class="btn-wrap">
                <Button @click="back">取消</Button>
                <Button type="primary" @click="next('skip')">跳过</Button>
                <Button type="primary" @click="next">下一步</Button>
              </div>
            </Col>
          </Row>
        </div>

        <!-- 配置按钮 -->
        <div v-show="currentStep === 2">
          <Row :gutter="20">
            <Col span="6">
              <div class="img-preview" :style="`background-image:url('${previewUrl}')`"></div>
            </Col>
            <Col span="18">
              <div class="ivu-form-inline">
                <FormItem label="厂商" :label-width="40">
                  <drop-down id="manufacturerId" name="manufacturerId" v-model="data.fields.manufacturerId.value" :options="data.fields.manufacturerId.data" :validate="'required'" validateMsg="请选择厂商" placeholder="选择厂商"></drop-down>
                </FormItem>
                <FormItem label="区域" :label-width="40" style="width:500px">
                  <m-tree-select id="scenesArea" name="scenesArea" :items="data.fields.scenesArea.url" :show-checkbox="true" :cascade-children="true" :multiple="true" :value="data.fields.scenesArea.value" :searchable="true" :parameters="{}"  character="," :validate="'required'" validateMsg="请选择区域" placeholder="选择区域"></m-tree-select>
                </FormItem>
              </div>

              <div class="btn-push" >
                <Button  type="primary" @click.native="btnPush" :disabled="btns.length === 2" size="default">添加按钮</Button>
                <span>支持配置0-2个按钮</span>
              </div>

              <!-- 新增按钮组 -->
              <div class="btn-push-item" v-for="(btnItem, index) in btns" :key="index">
                <div class="ivu-form-inline">
                  <FormItem label="按钮名称">
                    <m-input name="_NA_" type="text" v-model="btnItem.btnName" :validate="'required'" validateMsg="请输入按钮名称" placeholder="输入按钮名称"></m-input>
                  </FormItem>
                  <FormItem label="按钮功能">
                    <drop-down name="_NA_" v-model="btnItem.btnType" :options="btnTypes" :validate="'required'" validateMsg="请选择按钮功能" placeholder="选择按钮功能"></drop-down>
                  </FormItem>
                </div>
                <FormItem label="电话号码" v-if="btnItem.btnType === 'Call'">
                  <m-input type="text" name="_NA_" v-model="btnItem.receiveNum" placeholder="输入电话号码" :validate="'required'" validateMsg="请输入电话号码"></m-input>
                </FormItem>
                <FormItem label="短信内容" v-if="btnItem.btnType === 'SendMessage'">
                  <m-input type="textarea" name="_NA_" v-model="btnItem.sendMessage" :validate="'required'" validateMsg="请输入短信内容" placeholder="输入短信内容"></m-input>
                </FormItem>
                <FormItem label="发送号码" v-if="btnItem.btnType === 'SendMessage'">
                  <m-input type="text" name="_NA_" v-model="btnItem.sendNum" :validate="'required'" validateMsg="请输入发送号码" placeholder="输入发送号码"></m-input>
                </FormItem>
                <FormItem label="跳转APP" v-if="btnItem.btnType === 'APP'">
                  <m-select name="_NA_" :data="data.menuUrl.App.url" keyField="linkId" valueField="linkId" placeholder="选择跳转APP" searchField="linkName" v-model="btnItem.linkId" :column="[{title:'App',data:'linkName'},{title:'deeplink',data:'deeplink'}]" :page-size="20" :max-select="10" :pagination="true" @change="mSelectCange($event, btnItem)" :validate="'required'" validateMsg="请选择跳转APP"></m-select>
                </FormItem>
                <FormItem label="跳转链接" v-if="btnItem.btnType === 'H5'">
                  <m-select name="_NA_" :data="data.menuUrl.H5.url" keyField="linkId" valueField="linkId" placeholder="选择链接" searchField="h5Url" v-model="btnItem.linkId" :column="[{title:'链接',data:'h5Url'},{title:'ID',data:'linkId'}]" :page-size="20" :max-select="10" :pagination="true" @change="mSelectCange($event, btnItem)" :validate="'required'" validateMsg="请选择跳转链接"></m-select>
                </FormItem>
                <FormItem label="链接地址" v-if="btnItem.btnType === 'H5'">
                  <m-input type="text"  v-model="btnItem.h5Url" :disabled="true"></m-input>
                </FormItem>
                <FormItem label="跳转快应用" v-if="btnItem.btnType === 'QuickApp'">
                  <m-select name="_NA_" :data="data.menuUrl.QuickApp.url" keyField="linkId" valueField="linkId" placeholder="选择快应用" searchField="linkName" v-model="btnItem.linkId" :column="[{title:'链接名',data:'linkName'},{title:'deeplink',data:'deeplink'}]" :page-size="20" :max-select="10" :pagination="true" @change="mSelectCange($event, btnItem)" :validate="'required'" validateMsg="请选择跳转快应用"></m-select>
                </FormItem>
                <FormItem label="deeplink" v-if="btnItem.btnType === 'APP' || btnItem.btnType === 'QuickApp'">
                  <m-input type="text" v-model="btnItem.deeplink" :disabled="true"></m-input>
                </FormItem>
                <FormItem label="包名" v-if="btnItem.btnType === 'APP'">
                  <m-input type="text" v-model="btnItem.packageName" :disabled="true"></m-input>
                </FormItem>
                <FormItem label="按钮规则" v-show="btnItem.btnType">
                  <m-input type="textarea" name="_NA_" v-model="btnItem.btnRule" :validate="'required'" validateMsg="请输入按钮规则" placeholder="输入按钮规则"></m-input>
                </FormItem>
                <Icon class="close-item" type="close" @click="del(index)" />
              </div>

              <div class="btn-wrap">
                <input type="hidden" name="scenesBtns" :value="btnsValue">
                <input type="hidden" name="scenesProgramId" :value="data.fields.scenesProgramId.value">
                <Button @click="back">取消</Button>
                <m-button text="保存并退出" type="primary" name="submitButton" value="submitButton" id="SceneConfigForm_submitButton" size="default" toggle="linkFormForm"></m-button>
              </div>
            </Col>
          </Row>
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
      steps: [{title: '选择短信模板'}, {title: '配置卡片字段'}, {title: '配置按钮'}],
      btnTypes: [
        {value: 'Call', label: '拨打电话'},
        {value: 'SendMessage', label: '发送短信'},
        {value: 'APP', label: '打开APP'},
        {value: 'H5', label: '打开H5'},
        {value: 'QuickApp', label: '打开快应用'},
        {value: 'SubMenu', label: '打开子菜单'}
      ],
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
      }
    }
  },
  props: {
    configData: {
      type: Object,
      default () {
        return {}
      }
    },
    action: {
      type: String,
      default: ''
    }
  },
  computed: {
    btnsValue() {
      return JSON.stringify(this.btns)
    }
  },
  created () {
    this.previewUrl = this.data.fields.whiteImgUrl.value
    this.btns = this.data.fields.scenesBtns
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
        item.deeplink = ''
        item.h5Url = ''
        item.packageName = ''
      } else {
        item.deeplink = data[0].deeplink
        item.h5Url = data[0].h5Url
        item.packageName = data[0].packageName
      }

    },
    btnPush () {
      if (this.btns.length === 2) return

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
        if (this.currentStep === 0) {
          const valiState = await _v(['messageTemplateCode'])
          if (!valiState) return
        }

        if (this.currentStep === 1) {
          this.uploadValidateErr = this.data.fields.whiteImgUrl.value === ''
          const valiState = await _v(['identifyScene', 'identifySceneWords'])
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
      this.currentStep = 0
      window.history.back()
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

    }
  }
}
</script>
<style lang='less' scoped>

.SceneConfig{
  display: flex;
  padding:20px;
  background: #fff;
  border-radius: 5px;
  &>div{
    &:last-child{
      padding-left: 30px;
      flex:1
    }
  }
  .form-horizontal{
    padding:0;
    margin: 0;
  }
  .ivu-form-item,.btn-push{
    margin-bottom:15px;
  }
  .btn-wrap{
    text-align: right;
  }
  .upload-file{
    font-size: 12px;
    background: #f2f2f2;
    position: relative;
    min-height:450px;
    text-align: center;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    p{
      margin-bottom: 1em;
    }
    &:hover{
      opacity: .8;
    }
    .btn{
      position: absolute;
      width: 100%;
      top:50%;
      left: 0;
      transform: translate(0, -50%);
    }
    i{
      font-size: 2em;
    }
    input{
      position: absolute;
      width: 100%;
      height: 100%;
      top:0;
      right:0;
      bottom:0;
      left:0;
      opacity: 0;
    }
  }
  .img-preview{
    background: #f2f2f2;
    min-height:450px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .btn-push-item{
    margin-bottom: 15px;
    border:1px solid #ccc;
    padding: 15px 15px 0 15px;
    border-radius: 5px;
    position: relative;
    .close-item{
      position: absolute;
      top:0;
      right: 0;
      padding:10px;
      cursor: pointer;
      &:hover{
        opacity: .8;
      }
    }
  }
}
</style>