<template>
  <div>
    <DatePicker
      :id="id"
      :name="name"
      :type="type"
      v-model="value"
      :format="format"
      :disabled="disabled"
      :size="size"
      :placeholder="placeholder"
      :placement="placement"
      :class="dateTimeClasses"
      :options="{...options, ...dateTimeOpts}"
      :confirm="confirm"
      :open="open"
      :clearable="clearable"
      :editable="editable"
      :readonly="!editable || readonly"
      :transfer="transfer"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
    ></DatePicker>
    <span v-if="errors.has(name)" class="m-form-error-tip">
      {{ validateMsg?validateMsg:errors.first(name) }}
    </span>
  </div>
</template>
<script>
import Inputmask from "inputmask";
export default {
  name: "m-dateTime",
  props: {
    id: String,
    name: String,
    type: {
      type: String,
      default: "datetime"
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
    placement: {
      type: String,
      default: "bottom-start"
    },
    options: {
      type: Object
    },
    confirm: {
      type: Boolean,
      default: false
    },
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
    transfer: {
      type: Boolean,
      default: false
    },
    fieldTitle: {
      type: String,
      default: ""
    },
    form: String,
    validate:[String,Object],
    validateMsg: String,
    beforeDisabled: Boolean
  },

  data() {
    let that = this
    return {
      value : this.initValue,
      dateTimeOpts: {
        disabledDate(date) {
          return that.beforeDisabled ? date && date.valueOf() < Date.now() - 86400000 : null;
        }
      }
    };
  },

  computed: {
    dateTimeClasses: function(){
      return this.errors.has(this.name)?'ivu-form-item-error':''
    },
  },
  created() {
    if(this.form) {
      if(!this.$root.eventBus.hasOwnProperty(this.form)) {
        this.$root.eventBus[this.form] = []
      }
      this.$root.eventBus[this.form].push(this)
    }
  },
  mounted: function() {
    let root = this.$root
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