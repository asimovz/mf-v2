<template>
	<DatePicker
        :open="open"
        :value="date"
        :type="dateType"
        @on-change="handleChange"
        >
        <span @click="handleClick">
        	<span v-if="date==''" :class="['icon',{'active':date!=''}]" >
        	    <Icon type="android-calendar"></Icon>
        	</span>
        	<span :title="title" class="text" v-if="date!=''">
        		{{showTitle}}{{date | format('yyyy-MM-dd')}}
        		<Icon class="del" type="close-round" @click.native.stop="delDueDate"></Icon>
        	</span>
        </span>
    </DatePicker>
</template>
<script>
export default {
	name:'task-date',
	props: {
		title: String,
		date: String,
		dateType:{
			type:String,
			default:'date'
        },
        handle:{
			type: Boolean,
			default: true
        },
	},
	data() {
		return {
			open: false,
			showTitle: this.title?this.title+"：":''
		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {
		
	},
	methods: {
		handleClick () {
            if(!this.handle) return
		    this.open = !this.open;
		},
		handleChange (date) {
			this.$emit("changeDate",date)
		    this.open = false;
		},
		delDueDate() {
			this.$emit("on-del")
		}
	}
}
</script>
<style>
	
</style>