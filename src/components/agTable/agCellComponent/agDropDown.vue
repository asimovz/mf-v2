<template>
  <drop-down :options="options"
             size="small"
             :transfer="true"
             :id="id"
             :value="value"
             :name="id"
             :allowEmpty="allowEmpty"
             :optionsUrl="optionsUrl"
             :valueField="valueField"
             :labelField="labelField"
             :dependsOptional="dependsOptional"
             :dependsOn="dependsOn"
             :optionsParameters="optionsParameters"
             :serverSearch="serverSearch"
             :serverDelay="serverDelay"
             :serverMinLength="serverMinLength"
             :optionsLoadInit="optionsLoadInit"
             placeholder="请选择" />
</template>
<script>
  export default {
    name: 'ag-drop-down',
    data: function () {
      return {
        eventBus: null,
        id: new Date().getTime() + '',
        options: [],
        value: null,
        multiple: null,
        allowEmpty: null,
        optionsUrl: '',
        valueField: null,
        labelField: null,
        dependsOptional: null,
        dependsOn: null,
        optionsParameters: null,
        serverSearch: null,
        serverDelay: null,
        serverMinLength: null,
        optionsLoadInit: null
      }
    },
    beforeMount() {
      this.eventBus = this.params.context.componentParent.$root.eventBus
      this.value = this.params.value
      this.multiple = this.params.props.multiple
      this.allowEmpty = this.params.props.allowEmpty
      this.optionsUrl = this.params.props.optionsUrl
      this.valueField = this.params.props.valueField
      this.labelField = this.params.props.labelField
      this.dependsOptional = this.params.props.dependsOptional
      this.dependsOn = this.params.props.dependsOn
      this.optionsParameters = this.params.props.optionsParameters
      this.serverSearch = this.params.props.serverSearch
      this.serverDelay = this.params.props.serverDelay
      this.serverMinLength = this.params.props.serverMinLength
      this.optionsLoadInit = this.params.props.optionsLoadInit
      this.options = this.params.props.options
    },
    mounted() {
      let that = this
      this.eventBus.$on(this.id + '_value_change', data => {
        that.params.setValue ? this.params.setValue(data[this.id]) : null
        this.value = data[this.id]
      })
    },
    methods: {
      getValue() {
        return this.value
      },
      isPopup() {
      },
      isCancelBeforeStart() {
      },
      isCancelAfterEnd() {
      },
      refresh() {
        return true
      }
    },
    beforeDestroy: function() {
      this.eventBus.$off(this.id + '_value_change')
	  }
  }

</script>
