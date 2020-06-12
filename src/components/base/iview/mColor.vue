<template>
  <div style="display: inline-block;">
      <ColorPicker 
        :id="id" 
        :name="name" 
        :value="colorValue" 
        :colors="Selected" 
        :recommend="recommend"
        :size="size"
        :transfer="true"
        @on-change="handleChange" />
        <input v-if="form != undefined " type="hidden" :value="colorValue" :form="form" :name="name">
  </div>
</template>
<script>
//标准色
const standardColor = ['#B12318','#EB3223','#F6C143','#FFFD54','#A0CD63','#4EAC5B','#4BAFEA','#2B70BA','#05215C','#67379A']
export default {
  name: 'm-color',
  props: {
		id:String,
  	name: String,
		value: String,
		recommend: Boolean,
  	size: {
  		type:String,
  		default:null
		},
		colors: Array,
    form: String
  },
  data() {
    return {
			colorValue: this.value,
			Selected: this.recommend ?[] : [...standardColor]
    }
  },
  methods:{
  	handleChange (value) {
      // console.log(value,"======")
  		this.colorValue = value
  		if(this.Selected.indexOf(value)== -1 ){
  			this.Selected.unshift(value)
  		}
  		this.$emit("on-change",value)
  	}
  },
  mounted: function() {

  }
}

</script>
<style>
.ivu-color-picker-transfer {
  z-index: 1111
}
</style>
