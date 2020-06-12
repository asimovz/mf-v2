<template>
	<div class="popover-page prject-tag">
		<div class="title"><a class="back" @click="back"><Icon type="chevron-left"></Icon></a> 添加新标签</div>
		<div style="margin:10px;display: flex">
			<div style="margin-right: 5px;"><m-color name="color" @on-change="selectColor" :value="tagColor"></m-color></div>
			<Input  placeholder="标签名" class="tag-name" v-model="tagName"/>
		</div>
		<div style="margin:0 10px 10px">
			<Button type="primary" size="small" long @click.native="saveTag">添加</Button>
		</div>
	</div>
</template>
<script>
import menu from "./menu"
export default {
	name: 'delTask',
	props: {
		data: Object,
	},
	data() {
		return {
			tagColor: '',
			tagName: ''

		}
	},
	computed: {

	},
	created: function() {
		

	},
	mounted: function() {
	},
	methods: {
		saveTag() {
			let postParams = {
				"cmd":'newWorkEffortTag',
				//"isShared":'Y',
				"tagName": this.tagName,
				"tagColor": this.tagColor
			}
			if(this.tagColor ==''){
				this.handleNotice('必须选择标签颜色!', 'error')
				return
			}
			if(this.tagName ==''){
				this.handleNotice('标签名不能为空!', 'error')
				return
			}
			// console.log("====todo 新建任务标签====",postParams)
			this.$root.$http.post(this.data.transition,postParams).then(response => {
				if(response.data && response.data.result=='success'){
					this.handleNotice('新建标签成功！', 'success')
					this.back()
				}
			}, error => {
				// error callback
			})
		},
		selectColor(value) {
			this.tagColor = value
		},
		back() {
			this.$parent.backComponent()
		},
		del() {
			this.setComponent(menu)
		},
		setComponent(comp) {
			this.$emit("changeComponent",comp)
		},
	}
}
</script>
<style>
.prject-tag .title {
	font-size: 14px;
	padding:5px 10px;
	border-bottom: 1px solid #F1F1F1;
}
</style>