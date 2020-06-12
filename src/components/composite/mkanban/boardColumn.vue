<template>
	<div :class="[className,{'noDrop':isNoDrop}]" :data-position="data.position" :data-key-index="columnIndex" :style="style">
		
		<div class="column-header">
			<div class="scope"><Icon type="android-apps"></Icon> {{data.name}} [{{taskList.length}}]</div>
<!-- 			<span class="handle" :data-popover="data.id" @click="columnMenu"><Icon type="navicon-round" size="16" style="padding:0 0 0 10px"></Icon></span> -->
		</div>
		<div :class="taskClass" ref="taskList" :id="data.id">
			<m-loading v-if="loadingShow"></m-loading>
			<template v-for="(task,taskIndex) in taskList">
				<board-task v-show="!loadingShow" :key="taskIndex" :index="taskIndex"  :data="task"></board-task>
			</template>
<!-- 			<div>
				<pre>
					{{JSON.stringify(taskList, null, 2)}}
				</pre>
			</div> -->
			<add-task v-if="isBottomTask" v-show="isTaskShow" :column-data="{projectId:data.projectId,taskListId:data.id,position:maxPosition}"></add-task>
		</div>
<!-- 		<div class="column-footer" v-show="!isTaskShow" @click="addTaskShow">
			<a href="javascript:"><Icon type="plus-round"></Icon>  添加新任务</a>
		</div> -->
	</div>
</template>

<script>
//测试项目任务列数据载入
// import {column} from './components/jsonData'

import Sortable from 'assets/js/Sortable'
import boardTask from './task'
import columnMenu from './components/columnMenu'
import addTask from './components/addTask'

var dropFormId
// const dropRule = {
// 	'WeInPlanning':{
// 		'to':['WeApproved'],
// 	},
// 	'WeApproved':{
// 		'to':['WeInProgress']
// 	},
// 	'WeInProgress':{
// 		'to':['WeOnHold']
// 	},

// }



export default {
	name:'board-column',
	components: {
		boardTask,addTask
	},
	props: {
		data: [Object,Number],
		className: String,
		taskClass:String,
		width: Number,
		columnIndex: Number,
		parentTilte: String
	},

	data() {
		return {
			transition: this.$parent.kanbanAjaxController,
			loadingShow: true,
			name: this.data.name,
			taskList: [],
			oldTaskList:[],
			style:{
				width:this.width+'px'
			},

			isBottomTask: false,
			isTaskShow: false,
			isNoDrop: false,
			isTaskButton: true,

			dropFormId:''
		}
	},
	computed: {
		minPosition() {
			return this.taskList.length == 0 ? 0 : this.taskList[0].position
		},
		maxPosition() {
			return this.taskList.length == 0 ? 0 : this.taskList[this.taskList.length-1].position
		}
	},
	created: function() {
		if(this.data.isNew) {
			this.loadingShow = false
			setTimeout(()=>{
				this.initDrop()
			},0)
		} else {
			//get remote column tasks data
			let that = this
			let urlParams = {
				params:{
					cmd: 'getKanbanColumnTaskDetail',
					projectId: this.data.projectId,
					id: this.data.id
				}
			}
			
			// this.taskList = column[this.data.id] || []
			// setTimeout(()=>{
			// 	this.loadingShow = false
			// 	this.initDrop()
			// },100)


			this.$root.$http.get(this.$parent.kanbanAjaxController,urlParams).then(response => {
				// console.log('ColumnTask.data => ',response.data)
				this.taskList = response.data || []
				this.oldTaskList = response.data
				this.loadingShow = false
				this.initDrop()
			}, error => {
				// error callback
			})
		}
	},

	mounted: function() {
		let _bus = this.$root.eventBus

		//任务卡片移动到别的列表处理
		_bus.$on("kb_removeColumnData_"+this.data.id,(data)=>{
			let taskData = [].concat(this.taskList[data.oldIndex])[0]
			let newList = [].concat(this.taskList)
			newList.splice(data.oldIndex,1)
			this.taskList = newList	

			//发送列表添加卡片消息	
			_bus.$emit("kb_addColumnData_"+data.toColumn,{
				data:taskData,
				newIndex:data.newIndex
			})

		})


		//任务卡片移动本列表处理
		_bus.$on("kb_addColumnData_"+this.data.id,(item)=>{
			item.data.tasklistId = this.data.id
			if(this.taskList.length > 0) {
				this.taskList.splice(item.newIndex,0,item.data)
			} else {
				this.taskList.push(item.data)	
			}
			item.data.statusId = this.data.id
			item.data.taskListId = this.data.id
			this.movePosition(item.newIndex)
			this.save(item.data,item.newIndex,true)

		})

		//任务卡片在本列改变排序
		_bus.$on("kb_changeColumnData_"+this.data.id,(item)=>{
			this.taskList.splice(item.newIndex, 0, this.taskList.splice(item.oldIndex, 1)[0])
			this.movePosition(item.newIndex)
			this.save(this.taskList[item.newIndex],item.newIndex,false)
			console.log(this.taskList)
		})

		//归档任务卡片
		this.$root.eventBus.$on("kb_archive_task_" + this.data.id,(data)=>{
			let taskIndex
			this.taskList.forEach((item,index) => {
				if(item.id == data.taskId){
					taskIndex = index
				}
			})
			this.taskList.splice(taskIndex,1)
      //this.handleMessage("卡片归档成功","success")
		})

		//删除任务卡片
		this.$root.eventBus.$on("kb_remove_task_" + this.data.id,(data)=>{
			let taskIndex
			this.taskList.forEach((item,index) => {
				if(item.id == data.taskId){
					taskIndex = index
				}
			})
			this.taskList.splice(taskIndex,1)
     
			//  this.handleMessage("卡片删除成功","success")
		})


		//任务卡片菜单 移动列表处理
		_bus.$on("kb_move_remove_task_"+this.data.id,(data)=>{
			this.taskList.splice(data,1)
			console.log(data)
		})
		//任务卡片菜单 移动列表处理
		_bus.$on("kb_move_add_task_"+this.data.id,(data)=>{
			let newIndex
			if(this.taskList.length > 0) {
				newIndex = this.taskList[this.taskList.length-1].position + 1
			} else {
				newIndex = 1
			}
			
			data.statusId = this.data.id
			data.taskListId = this.data.id
			data.position = newIndex
			this.taskList.push(data)
			this.save(data,newIndex,true)
		})

		// //任务卡片改变优先级
		// this.$root.eventBus.$on("kb_changPriority_" + this.data.id,(data)=>{
		// 	let taskIndex
		// 	this.taskList.forEach((item,index) => {
		// 		if(item.id == data.taskId){
		// 			taskIndex = index
		// 		}
		// 	})
		// 	this.taskList[taskIndex].priority = data.value
		// 	this.save(this.taskList[taskIndex])
		// })

	},
	methods: {
		save(taskData,index,isChange) {
			let postParams = {
				cmd: 'saveTaskPosition',
				projectId: this.data.projectId,
				colId: this.data.id,
				taskId: taskData.id,
				dateTime: this.moqui.getNowDate(),
				position: index,
				changeGroup: isChange
			}
			//console.log("==== 拖动任务 保存 ===",postParams)
			this.$root.$http.post(this.transition,postParams).then(response => {
				// console.log('response===',response)
				if(response.data && response.status == 200){
					let message = '任务信息保存成功！'
        	this.handleNotice(message, 'success')
				}
			}, error => {
				this.handleNotice(error.errors, 'error')
				// error callback
			})
		},

		addTaskShow() {
			if(!this.isTaskShow) {
				this.isBottomTask = true
				this.isTaskShow = true
			}else{
				this.isTaskShow = true
			}
		},

		columnMenu(event) {
			this.$popover(event,{
				width:250,
				component:columnMenu,
				data: {
					priority:this.data.priority,
					taskListId: this.data.id,
				}
			})
		},

		movePosition(nIndex) { //计算卡片排序序号 nIndex 卡片移动到的当前序号
			let list = this.taskList
			let prevPosition, nextPosition, newPosition
			let prev = nIndex - 1
			let next = nIndex + 1
			if (prev < 0) {
				prevPosition = 0.0
			} else {
				prevPosition = parseFloat(list[prev].position)
			}

			if (next >= list.length) {
				nextPosition = prevPosition + 2
			} else {
				nextPosition = parseFloat(list[next].position)
			}
			newPosition = (nextPosition - prevPosition) / 2 + prevPosition
			// console.log(prev,prevPosition,nextPosition,newPosition)
			list[nIndex].position = newPosition
		},

		initDrop() {
			var _self = this
			Sortable.create(this.$refs.taskList, {
				group: {
					name: 'group',
					pull: true,
					put: function(evt){
						return _self.$parent.dropRule[dropFormId].to.indexOf(evt.el.id) > -1
					}
				},
				animation: 150,
				draggable:'.task',
				filter: '.noDrop',
				onStart: function(evt) {
					dropFormId = evt.from.id
					// console.log(dropFormId)
				},
				onUpdate: function(evt) {
					let fromListID = evt.from.parentNode.dataset.id
					_self.removeNode(evt.item)
					_self.insertNodeAt(evt.from, evt.item, evt.oldIndex)
					_self.$root.eventBus.$emit("kb_changeColumnData_"+fromListID,{
						oldIndex:evt.oldIndex,
						newIndex:evt.newIndex
					})
				},
				onRemove: function(evt) {
					_self.insertNodeAt(evt.from, evt.item, evt.oldIndex)
					let listID = evt.from.parentNode.dataset.id
					let tolistID = evt.to.parentNode.dataset.id
					_self.$root.eventBus.$emit("kb_removeColumnData_" + listID,{
						toColumn:tolistID,
						oldIndex:evt.oldIndex,
						newIndex:evt.newIndex
					})
				},
				onEnd: function(evt) {
					_self.$parent.noDrop()
					_self.$parent.isDown = false
				}
			});
		},

		removeNode(node) {
		  node.parentElement.removeChild(node);
		},

		insertNodeAt(fatherNode, node, position) {
		  var refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
		  fatherNode.insertBefore(node, refNode);
		},
		filterData(value) {
			if(value != "") {
				value = value.toLowerCase()
				this.taskList = this.oldTaskList.filter(item => {
					let content = item.content ? item.content.toLowerCase() : ''
					let designNumber = item.product.designNumber ? item.product.designNumber.toLowerCase() : ''
					let pseudoId = item.product.pseudoId ? item.product.pseudoId.toLowerCase() : ''
					let productName = item.product.productName ? item.product.productName.toLowerCase() : ''
					return content.indexOf(value) >= 0 || designNumber.indexOf(value) >= 0 || pseudoId.indexOf(value) >= 0 || productName.indexOf(value) >= 0
				})
			} else {
				this.taskList = JSON.parse(JSON.stringify(this.oldTaskList))
			}

		}
	},

	beforeDestroy: function() {
		let _bus = this.$root.eventBus
		_bus.$off("kb_removeColumnData_"+this.data.id)
		_bus.$off("kb_addColumnData_"+this.data.id)
		_bus.$off("kb_changeColumnData_"+this.data.id)
		_bus.$off("kb_remove_task_" + this.data.id)
		_bus.$off("kb_archive_task_" + this.data.id)
	}
}
</script>
<style>
	
</style>