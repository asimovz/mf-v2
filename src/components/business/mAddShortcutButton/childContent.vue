<template>
  <div class="childContent">
    <div class="defaultContent">
      <m-select :options="btnList" @on-change="handleChange" v-model="btn.type" size="small" class="childSelect"></m-select>
      <m-input class="childInput text-required" v-model="btn.description" size="small" placeholder="按钮文案（必填）" :maxlength="10" name="_NA_" :validate="'required'" validate-msg="请输入按钮文案" />
      <i class="el-icon-delete" @click="deleteBtn"></i>
    </div>

    <div class="btnMatch" v-if="btn.type=='url'">
      <m-input class="matchInput" v-model="btn.url" size="small" placeholder="链接需以http(s)://开头（必填）" name="_NA_" :validate="{regex:/^(http[s]{0,1}:\/\/)/i}" validate-msg="请输入正确链接" />
    </div>

    <div class="btnMatch" v-if="btn.type=='openApp'">
      <m-input class="matchInput" v-model="btn.openAppAndroid" size="small" placeholder="[Android]请输入正确调起地址（必填）" name="_NA_" :validate="'required'" validate-msg="请输入正确调起地址" />
    </div>

    <div class="btnMatch" v-if="btn.type=='call'">
      <m-input class="matchInput" v-model="btn.phoneNum" size="small" placeholder="请输入电话号码（必填）" name="_NA_" :validate="{regex:/^[\d\-\s\+]+$/}" validate-msg="请输入正确电话号码" />
    </div>

    <div class="btnMatch" v-if="btn.type=='addressLocation'">
      <m-input class="matchInput" data-name="longInput" v-model="btn.sendAddressPlaceName" size="small" placeholder="位置名称（必填）" name="_NA_" :maxlength="20" :validate="'required'" validate-msg="请输入位置名称" />
      <m-input class="matchInput" v-model="btn.sendAddressLongitude" size="small" placeholder="经度（必填）" name="_NA_" :validate="'required'" validate-msg="请输入经度" />
      <m-input class="matchInput" v-model="btn.sendAddressLatitude" size="small" placeholder="纬度（必填）" name="_NA_" :validate="'required'" validate-msg="请输入纬度" />
    </div>

    <div class="btnMatch" v-if="btn.type=='screen'">
      <m-input class="matchInput" v-model="btn.targetContact" size="small" placeholder="目标联系人（必填）" name="_NA_" :validate="'required'" validate-msg="请输入目标联系人" />
    </div>

    <div class="btnMatch" v-if="btn.type=='bringUp'">
      <m-input class="matchInput" v-model="btn.targetContact" size="small" placeholder="目标联系人（必填）" name="_NA_" :validate="'required'" validate-msg="请输入目标联系人" />
      <m-input class="matchInput" data-name="longInput" v-model="btn.presendContent" size="small" name="_NA_" placeholder="预发送内容" :maxlength="100" />
    </div>
    <input type="hidden" name="addshortcutbutton" :value="data"/>
  </div>
</template>
<script>
export default {
  props: {
    data:{},
    index: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      default: Array
    }
  },
  data(){
    return {
      required:true,
      btnList: [
        {
          value: 'reply',
          label: '回复按钮'
        },
        {
          value: 'url',
          label: '跳转按钮'
        },
        {
          value: 'openApp',
          label: '打开app按钮'
        },
        {
          value: 'call',
          label: '打电话按钮'
        },
        {
          value: 'sendAddress',
          label: '发送地址按钮'
        },
        {
          value: 'addressLocation',
          label: '地址定位按钮'
        },
        {
          value: 'screen',
          label: '拍摄按钮'
        },
        {
          value: 'bringUp',
          label: '调起指定联系人'
        },
      ],
      btn:{
        type:'reply',
        description:'',
        url:'',
        openAppAndroid:'',
        openAppIos:'',
        phoneNum:'',
        sendAddressPlaceName:'',
        sendAddressLongitude:'',
        sendAddressLatitude:'',
        targetContact:'',
        presendContent:''
      }
    }
  },
  created(){
    this.btn = this.data
  },
  computed: {

  },
  watch: {
    btn: {
      handler (newV, oldV) {
        this.$emit('uploadData', {index: this.index, data: newV})
      },
      deep: true
    },
    items: {
      handler (newV, oldV) {
        if (newV.length !== 0) {
          this.btn = {...newV[this.index]}
        }
      },
      deep: true
    }
  },
  methods: {
    handleChange(){
      Object.keys(this.btn).forEach(key => {
        if(key!='type'){
          (this.btn)[key] = ''
        }
      })
    },
    deleteBtn(){
      this.$emit('deleteIndex', this.index)
    }
  }
}
</script>
<style lang='less' scoped>
  .childContent{
    width: 100%;
    min-height: 65px;
    padding: 16px;
    box-sizing: border-box;
  }
  .defaultContent{
    display: flex;
    flex-direction: row;
  }
  .childInput{
    margin-left: 10px;
    width: 300px !important;
  }
  .el-icon-delete{
    margin: 8px 0 0 0;
    cursor: pointer;
  }
</style>
