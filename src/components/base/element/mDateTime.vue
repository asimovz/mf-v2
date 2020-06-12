<template>
  <div>
    <el-date-picker
      :id="id"
      :name="name"
      :type="type"
      v-model="value"
      :format="format"
      :disabled="disabled"
      :size="currentSize"
      :placeholder="strPlaceholder"
      :start-placeholder="placeholder[0]"
      :end-placeholder="placeholder[1]"
      :placement="placement"
      :class="dateTimeClasses"
      :picker-options="{...options, ...dateTimeOpts}"
      :confirm="confirm"
      :open="open"
      :clearable="clearable"
      :editable="editable"
      :readonly="!editable || readonly"
      :transfer="transfer"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
      @change="change"
    ></el-date-picker>
    <span v-if="errors.has(name)" class="m-form-error-tip">
      {{ validateMsg?validateMsg:errors.first(name) }}
    </span>
  </div>
</template>
<script>
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
      default: "small"
    },
    placeholder: {
      type: [String, Array],
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
  model: {
    event: 'on-change'
  },
  computed: {
    dateTimeClasses: function(){
      return this.errors.has(this.name)?'ivu-form-item-error':''
    },
    currentSize(){
      if(this.size && this.size != "") {
        if(this.size == "default") return "small"
        if(this.size == "small") return "mini"
      } else {
        return "small"
      }
    },
    strPlaceholder(){
      return typeof this.placeholder === 'string' ? this.placeholder : this.placeholder.join()
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
  mounted: function() {
    let root = this.$root
    //绑定提交的form属性，用于表单字段提交
    if(this.form) {
      this.$el.querySelector("input").setAttribute("form",this.form)
    }
  },

  methods: {
    change(data) {
      this.$emit('on-change', data)
    }
  }

};
</script>
<style lang="less">
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
</style>