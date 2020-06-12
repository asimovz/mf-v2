<template>
  <div>
    <el-time-picker
      v-if="type === 'time'"
      :id="id"
      :name="name"
      :picker-options="pickerOptions"
      v-model="value"
      :disabled="disabled"
      :size="sizeType"
      :class="timeClasses"
      :placeholder="placeholder"
      :options="options"
      :open="open"
      :clearable="clearable"
      :editable="editable"
      :readonly="!editable || readonly"
      :transfer="transfer"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
      @change="change"
	  ></el-time-picker>
    <el-time-picker
      v-else
      is-range
      :id="id"
      :name="name"
      :picker-options="pickerOptions"
      v-model="value"
      :disabled="disabled"
      :size="sizeType"
      :class="timeClasses"
      :placeholder="placeholder"
      :options="options"
      :open="open"
      :clearable="clearable"
      :editable="editable"
      :readonly="!editable || readonly"
      :transfer="transfer"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
      @change="change"
	  ></el-time-picker>
    <span v-if="errors.has(name)" class="m-form-error-tip">
      {{ validateMsg?validateMsg:errors.first(name) }}
    </span>
  </div>
</template>
<script>
export default {
  name: "m-timePicker",
  props: {
    id: String,
    name: String,
    // !! el组件没有type
    type: {
      type: String,
      default: "time"
    },
    initValue: {
      type: [String, Array]
    },
    format: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "default"
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    // !! el组件没有placement,为自动识别
    placement: {
      type: String,
      default: "bottom-start"
    },
    options: {
      type: Object
    },
    // !! el组件默认都加上确认，取消按钮，不能单独配置
    confirm: {
      type: Boolean,
      default: false
    },
    // !! el组件没有手动控制显示，隐藏的控制
    open: {
      type: Boolean,
      default: null
    },

    clearable: {
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    form: String,
    // !! el组件没有控制是否插入根节点的控制 默认都是直接在根节点上
    transfer: {
      type: Boolean,
      default: false
    },
    fieldTitle: {
      type: String,
      default: ""
    },
    validate:[String,Object],
    validateMsg: String
  },

  data() {
    return {
      value: this.value,
      //!! 映射element配置
      sizeConfig:{
        small: "mini",
        default: "small",
        large: "medium"
      }
    };
  },

  computed: {
    pickerOptions: function(){
      return {
        format: this.format
      }
    },
    sizeType: function(){
      if(!isNaN(this.size) || !['large', 'small', 'default'].includes(this.size)){
        return this.sizeConfig.default;
      }else{
        return this.sizeConfig[this.size];
      }
    },
    timeClasses: function(){
      return this.errors.has(this.name)?'ivu-form-item-error':''
    }
  },
  created() {
    if(this.form) {
      if(!this.$root.eventBus.hasOwnProperty(this.form)) {
        this.$root.eventBus[this.form] = []
      }
      this.$root.eventBus[this.form].push(this)
    }
  },
  mounted: function(){
    let root = this.$root;
    // if(this.validate){
    //   //监听form的验证消息
    //   if(this.form){
    //     root.eventBus.$on('form_validate'+this.form,()=>{
    //       this.$validator.validate()
    //     })
    //   }else{
    //     let idInfoArray = this.id.split('_')
    //     let formId = null
    //     if(idInfoArray.length>2){
    //       formId = idInfoArray[0]+'_'+idInfoArray[1]
    //     }
    //     else{
    //       formId = idInfoArray[0]
    //     }
    //     root.eventBus.$on('form_validate'+formId,()=>{
    //       this.$validator.validate()
    //     })
    //   }
    // }

    //绑定提交的form属性，用于表单字段提交
    if(this.form) {
      this.$el.querySelector("input").setAttribute("form",this.form)
    }
  },
  methods: {
    change(data) {
      this.$emit('on-change', data)
    }
  },
  beforeDestroy: function() {
    // if(this.validate){
    //   if(this.form){
    //     this.$root.eventBus.$off('form_validate'+this.form)
    //   }else{
    //     this.$root.eventBus.$off('form_validate'+this.id.split('_')[0])
    //   }
    // }
	}
};
</script>