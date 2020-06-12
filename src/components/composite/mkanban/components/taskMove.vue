<template>
	<div class="popover-page kb-menu">
		<h3 class="title">移动到</h3>
		<a class="divider"></a>	
		<div style="margin:10px 10px 0;">
			<Select v-model="value">
			    <Option v-for="item in column" :value="item.id" :key="item.id">{{ item.name }}</Option>
			</Select>
			<Button type="error" size="small" long style="margin:10px 0" @click.native="move">确定</Button>
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
			value:'',
			column: [],
			task: this.data.taskData,
			dropRule: this.data.dropRule
		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {
		let rule = this.dropRule[this.task.taskListId].to
		this.column = this.data.columnData.filter(item => {
			return rule.includes(item.id)
		})

	},
	methods: {
		back() {
			this.$parent.backComponent()
		},
		move() {
			if(this.column.length == 0) return
			let _root = this.$parent.vueRoot
			let data = this.data
			if(this.value != this.task.taskListId) {
				_root.eventBus.$emit("kb_move_remove_task_"+this.task.taskListId,{
					index:this.data.index
				})
				_root.eventBus.$emit("kb_move_add_task_"+this.value,this.task)
			}
			this.$parent.handleClose()
		}
	}
}
</script>
<style>

</style>