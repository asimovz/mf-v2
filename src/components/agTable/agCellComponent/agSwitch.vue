<template>
    <m-switch
      v-model="value"
      :name="name"
      :size="size"
      :disabled="disabled"
      :true-value="trueValue"
      :false-value="falseValue"
      :true-text="trueDisplay"
      :false-text="falseDisplay"
      @on-change="valueChange"
    />
</template>
<script>
	export default {
		name: 'ag-switch',
		data() {
    		return {
          name: null,
          showType: null,
          value: null,
          size: null,
          trueValue: null,
          falseValue: null,
          trueDisplay: null,
          falseDisplay: null,
          disabled: false,
          value: null,
          parent: null
    		};
  		},
		beforeMount(){
      this.value = this.params.value
      this.parent = this.params.context
      this.name = this.params.props.name
      this.size = this.params.props.size?this.params.props.size:'default'
      this.showType = this.params.props.showType?this.params.props.showType:'label'
      this.disabled = this.params.props.disabled === 'true'
      this.trueValue = this.params.props.trueValue?this.params.props.trueValue:'Y'
      this.falseValue = this.params.props.falseValue?this.params.props.falseValue:'N'
      if(this.showType == 'label'){
        this.trueDisplay = this.params.props.trueDisplay?this.params.props.trueDisplay: undefined
        this.falseDisplay = this.params.props.falseDisplay?this.params.props.falseDisplay: undefined
      }else{
        this.trueDisplay = this.params.props.trueDisplay?this.params.props.trueDisplay:'checkmark'
        this.falseDisplay = this.params.props.falseDisplay?this.params.props.falseDisplay:'close'
      }
		},
		mounted(){

    },
		methods:{
      valueChange() {
        this.params.setValue ? this.params.setValue(this.value) : null
      },
      getValue() {
        return this.value
      }
		}
	}
</script>