<template>
	<el-button
    :class="ghost?'ghostClass':''"
		:id="id"
		:type="typeStr"
		:toggle="toggle"
		:round="round"
		:targetModal="targetModal"
    :targetDrawer="targetDrawer"
		:size="currentSize"
		:icon="icon"
    :form="form"
    :native-type="htmlType"
    :confirmation="confirmation"
    :disabled="disabled"
		@click.stop="handleClick"
		> 
      <i class="el-icon-loading" v-if="loading && (toggle === 'linkFormLink' || toggle === 'linkFormForm')"></i>
      <slot>{{text}}</slot>
    </el-button>
</template>
<script>
/*
toggle属性
linkFormLink 按钮表单外部
linkFormForm 按钮在表单中
modal 模态框
*/
const EL_SIZE = {
  default: 'small',
  large: 'medium',
  small: 'mini'
}
export default {
  name: 'm-button',
  props: {
    id: {
      type: String
    },
    type: {
      default: 'primary'
    },
    text: {
      type: String,
      default: ''
    },
    toggle: {
      type: String
    },
    targetModal: {
      type: String
    },
    targetDrawer: {
      type: String
    },
    size: {
      type: String,
      default: 'default'
    },
    form: {
      type: String
    },
    confirmation: {
      type: String
    },
    icon: {
      type: String
    },
    htmlType: {
      type: String
    },
    targetList: {
      type: String,
      default: ''
    },
    multiSubmitUrl: {
      type: String,
      default: ''
    },
    submitRows: {
      type: String,
      default: 'selected'
    },
    formParam: Object,
    round: {
      type: Boolean,
      default: false
    },
    ghost: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fields: String
  },

  data () {
    let outTarget = this.targetModal || this.targetDrawer
    return {
      typeStr: this.type == 'danger' ? 'danger' : this.type,
      submitType: this.form && this.toggle == 'linkFormForm' ? "submit" : this.htmlType,
      outEventName: `dynamic_visible_change_${outTarget}`,
      tableEvent: this.targetList ? this.targetList + '_table_multi_submit' : '',
      loading: false
    }
  },
  inject: {
    FormInstance: {
      default: null
    },
    BoxInstance: {
      default: null
    }
  },
  computed: {
    currentSize () {
      if (Object.keys(EL_SIZE).includes(this.size)) {
        return EL_SIZE[this.size]
      } else {
        return 'default'
      }
    }
  },
  mounted() {
    this.$root.eventBus.$on("loading_button_flag" , result => {
			this.loading = result
		})
  },
  methods: {
    getFieldData() {
      let fields = this.fields.split(",");
      let param = {};
      fields.forEach(function(value, key) {
        let obj = document.querySelector(`input[name='${value}']`)
        param[value] = obj.value;
      });
      return Object.assign(param,this.formParam)
    },
    confirm (callback) {
      this.handleConfirm({
        title: this.text,
        content: '<p>' + this.confirmation + '</p>',
        onOk: () => {
          callback()
        },
        onCancel: () => {}
      })
    },
    handleClick: function (event) {
      let self = this
      if (this.toggle == 'resetForm') {
        this.FormInstance.resetForm()
        return
      }
      if (this.toggle == 'close') {
        this.BoxInstance && this.BoxInstance.close()
        return
      }

      // 关联表格的multi操作
      if (this.targetList) {
        let params = {
          multiSubmitUrl: this.multiSubmitUrl,
          submitRows: this.submitRows
        }
        if (this.confirmation) {
          this.confirm(() => {
            this.$root.eventBus.$emit(this.tableEvent, params)
          })
        } else {
          this.$root.eventBus.$emit(this.tableEvent, params)
        }
      } else {
        if (this.FormInstance && this.toggle == 'linkFormForm') {
          this.confirmation ? this.confirm(this.handleSubmitForm) : this.handleSubmitForm()
        } else {
          this.toggle == 'linkFormLink' && this.$root.eventBus.$emit('m_form_submit_' + this.form)
          if (this.targetModal || this.targetDrawer) this.$root.eventBus.$emit(this.outEventName)
        }
        if (this.fields && this.fields != '') {
          let fieldData = this.getFieldData()
          this.$nextTick(function(){
            this.$root.eventBus.$emit("m_send_fields_data",fieldData)
          })
        }

      }
    },

    handleSubmitForm: function () {
      this.FormInstance.submitForm(this.formParam)
    },

    beforeDestroy: function () {
      if (this.targetList) this.$root.eventBus.$off(this.tableEvent)
      if (this.targetModal != '' || this.targetDrawer != '') {
        this.$root.eventBus.$off(this.outEventName)
      }
      this.$root.eventBus.$emit('m_form_submit_' + this.form)
      this.$root.eventBus.$off('loading_button_flag')
    }
  }
}
</script>
<style lang="scss">
.ghostClass {
  background: 0 0;
}
.el-button {
  font-weight: 400;
}
.aw-content {
  .el-button+.el-button{margin-left:0}
}


</style>