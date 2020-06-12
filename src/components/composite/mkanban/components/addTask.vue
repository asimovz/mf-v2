<template>

	<div class="task-creator-wrap">
		<Input v-model="value" type="textarea" placeholder="任务内容" class="column-name"></Input>
		<div class="task-content-icon-box" style="margin-top: 10px">
			<task-date title="截止日期" :date="dueDate" @changeDate="changeDate" @on-del="delDueDate"></task-date>
			<task-member :executor="executor"  @on-set="setExecutor" @on-del="delExecutor"></task-member>
		</div>
		<div class="buttons" style="text-align: right">
			<Button @click="cancel" type="text" size="small">取消</Button> <Button size="small" type="primary" @click.native="saveTask">保存</Button>
		</div>
	</div>

</template>
<script>
// import member from './member'
import taskMember from './taskMember'
import taskDate from './taskDate'
export default {
	name:'add-task',
	components:{
		taskDate,taskMember
	},
	props: {
		columnData: Object
	},

	data() {
		return {
			value:'',
			executor:[],
			dueDate:'',
			isHandle: false,
			projectId: this.columnData.projectId,
			transition: this.$parent.transition
		}
	},
	computed: {

	},
	created: function() {
		document.addEventListener('mousedown', this.documentHandler)
	},
	mounted: function() {
		let _bus = this.$root.eventBus

		//负责人选择
		// _bus.$on("kb_addTask_selectMember_"+this.columnData.taskListId,(data)=>{
		// 	console.log(data)
		// 	this.executor = data
		// })
		_bus.$on("kb_addTask_handle_"+this.columnData.taskListId,()=>{
			this.isHandle = false
		})


	},
	methods: {
		setExecutor(data) {
			this.executor = data
		},
		delExecutor(index) {
			this.executor.splice(index,1)
		},
		delDueDate() {
			this.dueDate = ''
		},
		changeDate (date) {
		    this.dueDate = date;
		},

		cancel() {
			this.$parent.isTaskShow = false
			this.$parent.isBottomTask = false
		},

		saveTask() {
			if(this.value == "") return
			let cData = this.columnData
			let data = {
				"id":997198235,
				"projectId":cData.projectId,
				"taskListId":cData.taskListId,
				"content":this.value, 
				"position":cData.position+1,
				"priority":0,
				"executor":{
					"uid":"e6710243a4124831ada48a1ac178fb77",
					"name":"张学友",
					"avatar":"default.png",
					"background":"#22d7bb"
				}
			}

			this.value = ""
			this.$parent.taskList.push(data)
			this.$parent.isBottomTask = false

		},
		documentHandler(event) {
			let isOf = this.$el.contains(event.target)
			let popID = event.target.dataset.popover
			if(this.isHandle) return
			if (!isOf){
				// document.removeEventListener('mousedown', this.documentHandler)
				// this.cancel()
				this.$parent.isTaskShow = false
			}
		
		}
	},
	destroyed:function() {
		_bus.$off("kb_addTask_handle_"+this.columnData.taskListId)
		document.removeEventListener('mousedown', this.documentHandler)
	}
}
</script>
<style>

</style>
