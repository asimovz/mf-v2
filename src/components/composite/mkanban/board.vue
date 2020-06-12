<template>
 	<div>
<!--  		<div style="position: absolute;right: 0;z-index: 1919999;width: 200px; height: 80vh; overflow: auto">
 			<pre>
 				{{JSON.stringify(columnList, null, 2)}}
 			</pre>
 		</div> -->

 		<div class="loading-box">
 			<m-loading v-if="loadingShow"></m-loading>
 		</div>
 		<div class="tool-box">
 			<div class="tool-wrap">
 				<div class="flex">
 					<h2 class="title">{{name}}</h2>
 					<div style="margin-left: 15px;width:150px">
 					    <m-input ref="menuSearchBtn" class="menu-search" name="menuSearch"  icon="search" placeholder="搜索" @on-input-change="searchTask" :delay="500"></m-input>
 					</div>
 				</div>
 				<div class="right flex" style="align-items: center;">
<!--  					<ul class="kb_shortcut">
 						<li class="search">
 							<input type="text" v-model="searchKey" @keyup="searchTask">
 							<Icon class="icon" type="search" size="16"></Icon>
 						</li>
 					</ul> -->
 					<ul class="kb_shortcut kb_shortcut_more">
 						<li class="view hover active"><m-icon class="icon" name="view-kanban" size="12"></m-icon></li><li class="view hover" @click="toListView"><m-icon class="icon" name="view-list" size="12"></m-icon></li>
 					</ul>
 					<ul class="kb_shortcut">
 						<li class="back hover" @click="back"><Icon class="icon" type="chevron-left" size="12"></Icon></li>
 					</ul>
<!--  					<span><Icon type="android-options"></Icon> 筛选</span>
 					<span><Icon type="android-settings"></Icon> 设置</span> -->
<!--  					<span><m-icon name="view-kanban" size="14"></m-icon></span>
 					<span><m-icon name="view-list" size="14"></m-icon></span>
 					<span><Icon type="chevron-left" size="15"></Icon></span>
 					<m-link :href="goBackUrl" v-if="goBackUrl!=''">
 						<span><Icon type="chevron-left"></Icon> 返回</span>
 					</m-link> -->
 				</div>
 			</div>
 		</div>
		<div class="pageFixed" >
			<div :class="['page-view',{'grabbing':isMouseDown}]" id="page_view" @scroll="scroll1" @mousedown="Drop" @mouseup="noDrop" @wheel="wheel">
	 			<div id="board_view" :class="['board-view',{'grabbing':isMouseDown}]" >
					<template  v-for="(column,columnIndex) in columnList">
						<board-column :parentTilte="name" :columnIndex="columnIndex" :key="columnIndex" :data-id="column.id" :width="columnWidth" :data="column" :task-class="class_task_list" :class="class_board_column" @sortable="setSortable" ref="column"></board-column>
					</template>

				</div>
				<!-- <add-column v-if="!loadingShow"></add-column> -->
			</div>
		</div>


		<Modal v-model="isEditTask" class="task-modal" width="70%" :styles="{top: '40px'}">
			<task-detail :data="editTaskData" :projectId="id" :columnData="columnList" :dropRule="dropRule" :transition="kanbanAjaxController" v-if="isEditTask"></task-detail>
			<task-comment :data="editTaskData" slot="footer"></task-comment>
		</Modal>

	</div>
</template>
<script>
// 测试项目数据载入
// import {project} from './components/jsonData'

import '../mPopover'
import Sortable from 'assets/js/Sortable'
import boardColumn from './boardColumn'
import addColumn from './components/addColumn'
import taskDetail from './components/taskDetail'
import taskComment from './components/taskComment'

export default {
	name: 'm-kanban',
	components:{
		boardColumn,addColumn,taskDetail,taskComment
	},
	props: {
		id: [Number,String],
		name: String,
		desc: String,
		kanbanAjaxController: String,
		columnWidth: {
			type: Number,
			default: 300
		},
		goBackUrl: {
			type: String,
			default: ''
		}

	},
	data() {
		return {
			loadingShow:false, // loading
			isMouseDown: false, // 鼠标是否按下，显示手型
			drop_view: 'page_view', // 拖拽的外层DIV
			board_view: 'board_view', //卡片的容器ID
			class_board_column: 'board-column', //列容器的class
			class_task_list: 'task-list', //卡片容器的class
			class_drop_header: 'column-header',

			projectData: [], //项目任务列数据
			columnList: [], //已加载数据
			dropLoadCount:0, // 拖动加载个数
			loadNum:1,
			dropRule:{},
			isEditTask: false,
			editTaskData:{
				taskId:null,
				projectName: null,
				listName: null
			},
			searchKey:''
		}
	},
	computed: {
		dropBox: function() {
			return document.getElementById(this.drop_view)
		},
		boardBox: function() {
			return document.getElementById(this.board_view)
		},
		taskList: function() {
			return this.boardBox.getElementsByClassName(this.class_task_list)
		}
	},
	created: function() {
		//get remote project columns data
		let urlParams = {
			params:{
				cmd: 'getKanbanColumnDef',
				projectId: this.id
			}
		}

		// this.projectData = project[this.id]
		// setTimeout(()=>{
		// 	let srceenWidth = this.dropBox.offsetWidth
		// 	let showCount = Math.ceil(srceenWidth / this.columnWidth)+1
		// 	this.dropLoadCount = showCount
		// 	this.columnList = this.projectData.slice(0,showCount)
		// 	this.loadingShow = false
		// },100)

		this.$root.$http.get(this.kanbanAjaxController,urlParams).then(response => {
			// console.log('ColumnDef data => ',response.data)
			this.projectData = response.data
			setTimeout(()=>{
				let srceenWidth = this.dropBox.offsetWidth
				let showCount = Math.ceil(srceenWidth / this.columnWidth)+1
				this.dropLoadCount = showCount
				this.columnList = this.projectData.slice(0,showCount)
				this.loadingShow = false
			},100)
			// this.projectData = project[this.id]
		}, error => {
			// error callback
		})

		let urlRuleParams = {
			params:{
				cmd: 'getProjectStatusFlow',
				projectId: this.id
			}
		}
		this.$root.$http.get(this.kanbanAjaxController,urlRuleParams).then(response => {
			// console.log('getProjectStatusFlow.data => ',response.data)
			this.dropRule = response.data
		}, error => {
			// error callback
		})

	},

	mounted: function() {
		this.initDrop()
		this.$root.eventBus.$on("kb_edit_task",(data)=>{
			this.isEditTask = true
			this.editTaskData = data
		})
		this.$root.eventBus.$on("kb_task_close_modal",()=>{
			this.isEditTask = false
		})

	},
	methods: {
		searchTask(value) {
            this.$refs.column.map(item=>{
                item.filterData(value)
            })
		},
		addColumn(event) {
			event.preventDefault()
			setTimeout(() => {
				this.columnList.push({
					id:100111,
					creatorID:11111,
					projectId:1001,
					name:"简单了解",
					totalCount:4,
					progress:40,
					position:1
				})
				this.$nextTick(function() {
					this.dropBox.scrollLeft += 500
				})
			}, 500)
		},

		saveColumn(data) {
			console.log("==== 保存column数据===",this.columnList[data])
		},

		dropLoadData(box) {
			let project = this.projectData
			let first = this.loadNum > 1 ? this.dropLoadCount + this.loadNum : this.dropLoadCount
			let end = first + this.dropLoadCount
			if(box.scrollLeft > this.loadNum * this.columnWidth && this.columnList.length < project.length){
				this.columnList = this.columnList.concat(project.slice(first,end))
				this.loadNum += this.dropLoadCount
			}
		},

		handleBox(evt) { //设置可拖动、滚轮操作的DIV对象
			let e = evt || window.event
			let target = e.target || e.srcElement
			return {
				isBox: target.id == this.drop_view || target.id == this.board_view || target.className.indexOf(this.class_task_list) >= 0 || target.className.indexOf(this.class_board_column) >= 0,
				posX: this.dropBox.scrollLeft,
				box: this.dropBox
			}

		},

		setSortable (id) {
			// var _self = this
			// Sortable.create(document.getElementById(id), {
			// 	group: 'column',
			// 	animation: 150,
			// 	draggable:'.task',
			// 	onUpdate: function(evt) {
			// 		let fromListID = evt.from.parentNode.dataset.id
			// 		_self.removeNode(evt.item)
			// 		_self.insertNodeAt(evt.from, evt.item, evt.oldIndex)
			// 		_self.$root.eventBus.$emit("kb_changeColumnData_"+fromListID,{
			// 			oldIndex:evt.oldIndex,
			// 			newIndex:evt.newIndex
			// 		})
			// 	},
			// 	onRemove: function(evt) {
			// 		_self.insertNodeAt(evt.from, evt.item, evt.oldIndex)
			// 		let listID = evt.from.parentNode.dataset.id
			// 		let tolistID = evt.to.parentNode.dataset.id
			// 		_self.$root.eventBus.$emit("kb_removeColumnData_" + listID,{
			// 			toColumn:tolistID,
			// 			oldIndex:evt.oldIndex,
			// 			newIndex:evt.newIndex
			// 		})
			// 	},
			// 	onEnd: function(evt) {
			// 		_self.noDrop()
			// 		_self.isDown = false
			// 	}
			// });
		},

		initDrop() {
			var _self = this
			this.list = Sortable.create(this.boardBox, {
				animation: 150,
				draggable: '.' + _self.class_board_column,
				handle: '.'+_self.class_drop_header,
				filter: '.noDrop',
				onEnd: function(evt) {
					let keyIndex = Number(evt.item.dataset.keyIndex)
					console.log(keyIndex)
					_self.noDrop()
					_self.movePosition(evt.newIndex,keyIndex)

					_self.saveColumn(keyIndex)
				}
			});
		},

		Drop(event) { //开始拖动
			// 兼容火狐[拖动打开新页面BUG]
			document.body.ondrop = function(event) {
				event.preventDefault();
				event.stopPropagation();
			}
			//离开区域即停止拖动
			document.onclick = () => this.noDrop()

			let box_object = this.handleBox(event)
			let box = box_object.box
			let boxPositionX = box_object.posX

			let e = event || window.event
			let originX = e.clientX
			let originY = e.clientY
			if (box_object.isBox) {
				this.isMouseDown = true
				e.preventDefault()
				document.onmousemove = evt => {
					let x = evt.clientX
					let y = evt.clientY
					let scrollRange = evt.clientX - originX
					box.scrollLeft = boxPositionX - scrollRange
					//加载更多数据
					this.dropLoadData(box)
				}
			}
		},

		noDrop(event) { //停止拖动
			document.onmousemove = null
			document.body.ondrop = null
			this.isMouseDown = false
		},

		wheel(event) { //滚轮事件
			let box_object = this.handleBox(event)
			let box = box_object.box
			let boxPositionX = box_object.posX
			if (box_object.isBox) {
				box.scrollLeft = boxPositionX + event.deltaY
			}
			//加载更多数据
			this.dropLoadData(box)
		},

		scroll1(event) { //拖动滚动条
			let box_object = this.handleBox(event)
			let box = box_object.box
			//加载更多数据
			this.dropLoadData(box)
		},

		movePosition(nIndex,keyIndex) { //计算卡片排序序号 nIndex 卡片移动到的当前序号
			let list = this.columnList
			let prevPosition, nextPosition, newPosition, prev, next
			prev = nIndex
			next = nIndex+1

			if(prev == 0) {
				prevPosition = 0.0
				if(keyIndex == 1) next = 0
			} else {
				prevPosition = parseFloat(list[prev].position)
			}

			if (next >= list.length) {
				nextPosition = prevPosition + 2
			} else {
				nextPosition = parseFloat(list[next].position)
			}
			newPosition = (nextPosition - prevPosition) / 2 + prevPosition

			list[keyIndex].position = newPosition
			// console.log(prev,next,prevPosition,nextPosition,newPosition)
		},

		removeNode(node) {
		  node.parentElement.removeChild(node);
		},

		insertNodeAt(fatherNode, node, position) {
		  var refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
		  fatherNode.insertBefore(node, refNode);
		},
		back() {
			history.back()
		},
		toListView(){
			this.$root.setUrl('/coapps/process/WorkEffortCards')
		},
	},
	provide: function () {
	  return {
	    setCircleColor(value){
	    	let circleColor = ['#19be6b','#6EBEF4']
	    	if(value != 100) {
	    		return circleColor[0]
	    	} else {
	    		return circleColor[1]
	    	}
	    }
	  }
	},
	beforeDestroy: function() {
		this.$root.eventBus.$off("kb_edit_task")
	}
}

</script>

