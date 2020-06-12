<template>
  <div>
    <TimePicker 
      :id="id"
      :name="name"
      :type="type"
      :format="format"
      v-model="value"
      :disabled="disabled"
      :size="size"
      :class="timeClasses"
      :placeholder="placeholder"
      :placement="placement"
      :options="options"
      :confirm="confirm"
      :open="open"
      :clearable="clearable"
      :editable="editable"
      :readonly="!editable || readonly"
      :transfer="transfer"
      v-validate="validate"
      :data-vv-as="fieldTitle"
      :data-vv-name="name"
	  ></TimePicker>
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
    form: String,
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
      value: this.value
    };
  },

  computed: {
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
    //绑定提交的form属性，用于表单字段提交
    if(this.form) {
      this.$el.querySelector("input").setAttribute("form",this.form)
    }
  },
};
</script>