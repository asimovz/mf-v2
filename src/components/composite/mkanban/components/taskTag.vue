<template>
	<div class="tag-box flex">
		<div class="title"><Icon type="pricetag"></Icon> 标签</div>
		<ul class="tag-list">
			<template v-for="(tag,index) in data">
				<li class="tag" :style="{backgroundColor:tag.color}">{{tag.name}}<Icon class="del" type="close-round" @click.native="delTag(index)"></Icon></li>
			</template>
			<a v-if="handle" class="tag tag-add" data-popover="taskTag" @click="taskAdd"><Icon type="plus-round"></Icon> 添加标签</a>
		</ul>
	</div>
</template>
<script>



import tags from './tags'
export default {
	name:'task-tag',

	props: {
        data: Array,
        handle:{
			type: Boolean,
			default: true
        },
	},

	data() {
		return {
			transition: this.$parent.transition
		}
	},

	computed:{
	},

	created: function() {
	},

	mounted: function() {
	},

	methods: {
		taskAdd(event) {
			this.$parent.isHandle = true
			this.$popover(event,{
				component:tags,
				data: {
					taskId:this.$parent.taskData.id,
					tags:this.data,
					transition: this.transition,
					add:this.addTag,
					del:this.setTagData
				}
			})
		},

		addTag(data) {
			let postParams = {
				"cmd":'addWorkEffortTagAppl',
				"workEffortId": this.$parent.taskData.id,
				"tagId": data.id
			}
			// console.log("====todo 添加任务标签====",postParams)
			this.$root.$http.post(this.transition,postParams).then(response => {
				if(response.data && response.data.result=='success'){
        	this.handleNotice('标签添加成功！', 'success')
				}
			}, error => {
				// error callback
			})
		},

		delTag(index) {
			let tag = this.data[index]
			this.data.splice(index,1)
			this.setTagData(tag)
		},

		setTagData(data){
			let postParams = {
				"cmd":'deleteWorkEffortTagAppl',
				"workEffortId": this.$parent.taskData.id,
				"tagId": data.id
			}
			// console.log("====todo 删除任务标签====",postParams)
			this.$root.$http.post(this.transition,postParams).then(response => {
				if(response.data && response.data.result=='success'){
        	this.handleNotice('标签删除成功！', 'success')
				}
			}, error => {
				// error callback
			})
		}
	}
}
</script>
<style>

</style>