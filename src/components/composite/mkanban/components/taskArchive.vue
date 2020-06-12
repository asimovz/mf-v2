<template>
	<div class="popover-page kb-menu">
		<h3 class="title">确认操作</h3>
		<a class="divider"></a>	
		<div style="margin:10px 10px 0;">
			<p>确认要归档当前任务吗？归档后可以从归档中心查看。</p>
			<Button type="error" size="small" long style="margin:10px 0" @click.native="archive">确定</Button>
			<Button type="text" size="small" long @click="back">取消</Button>
		</div>
	</div>
</template>
<script>

export default {
	props: {
		data:Object,
	},
	data() {
		return {
			task: this.data.taskData,
			transition: this.data.transition
		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {
	},
	methods: {
		back() {
			this.$parent.backComponent()
		},
		archive() {
			//保存归档信息
			let _root = this.$parent.vueRoot
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.task.id,
				"isArchive": 1
			}

			_root.$http.post(this.transition,postParams).then(response => {
				if(response.data && response.status == 200){
					let message = '卡片归档成功！'
        			this.handleNotice(message, 'success')
        			_root.eventBus.$emit("kb_archive_task_"+this.task.taskListId,this.task.id)
        			this.$parent.handleClose()
				}
			}, error => {
				this.handleNotice(error.errors, 'error')
				// error callback
			})
		}
	}
}
</script>
<style>

</style>