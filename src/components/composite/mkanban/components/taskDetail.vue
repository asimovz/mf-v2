<template>
	<div class="task-detail-wrap">
		<div slot="header" class="header">
			<h5>{{data.projectName}} - {{data.taskListName}}</h5>
			<div class="header-right">
<!-- 				<span class="icon-box" v-if="taskStatus">
					<Tooltip :content="taskStatus.alt" placement="bottom" v-if="!taskStatus.nohandle">
						<Icon :class="['icon']" :style="statusStyles" :type="taskStatus.icon" size="18" @click.native="saveTaskStatus" ></Icon>
					</Tooltip>
				</span> -->
				<span v-if="isHandle" class="icon-box">
					<Icon :class="['icon',classPriority]" :data-popover="data.taskId" @click.native="setTaskPriority" type="lightbulb" size="18"></Icon>
				</span>
<!-- 				<span class="icon-box">
					<Icon :class="['icon',{'task-like':taskData.islike}]" @click.native="setTaskLike" type="android-favorite" size="18"></Icon>
					<span :class="[{'task-like':taskData.islike}]" v-show="taskData.likeCount>0">{{taskData.likeCount}}</span>
				</span> -->
				<span v-if="isHandle" class="icon-box"  @click.stop="setTaskMenu" :data-popover="data.taskId">
					<Icon class="icon" type="more" size="18"></Icon>
				</span>
			</div>
		</div>

		<div class="task-detail-content new-scrollbar" ref="detail">
			<div class="flex" style="justify-content: space-between;">
				<div style="width:85%">
					<div class="task-content-icon-box" style="margin-bottom: 10px">
						<span class="iconTitle" v-if="estimatedStartDate!=''">计划时间：<span class="work-time">{{estimatedStartDate}} <span v-if="estimatedCompletionDate!=''">~</span> {{estimatedCompletionDate}}</span></span>
						<span class="iconTitle">工作时间：<task-date :handle="isHandle" :date="actualStartDate" @changeDate="changeActualStartDate" @on-del="delActualStartDate"></task-date> ~ <task-date :handle="isHandle" :date="actualCompletionDate" @changeDate="changeActualCompletionDate" @on-del="delActualCompletionDate"></task-date></span>
						
<!-- 						<span class="iconTitle" v-if="actualStartDate!=''">工作时间：<span class="work-time">{{actualStartDate}} <span v-if="actualCompletionDate!=''">~</span> {{actualCompletionDate}}</span></span> -->
<!-- 						<task-date :date="actualCompletionDate" @changeDate="changeDate" @on-del="delActualCompletionDate"></task-date> -->
						<span class="iconTitle ml">执行人：</span>
						<task-member :executor="executor" @on-set="setExecutor" @on-del="delExecutor" :del="false" :handle="isHandle"></task-member>
						<span class="iconTitle ml">参与人：</span>
						<task-member :executor="memberList" @on-set="setMember"  @on-del="delMember" :multi="true" :handle="isHandle"></task-member>
					</div>
					<div class="content">
						<span style="display: block" v-show="!is_edit_content" >
							{{taskData.content}}
							<Icon v-if="isHandle" @click.native="editContent"  size="17" class="icon edit-icon-content" type="compose"></Icon>
						</span>
						<div class="content-edit" v-if="is_edit_content">
							<input class="input-text" v-model="taskData.content"/>
							<Button  size="small" type="primary" @click.native="saveContent">保存</Button> &nbsp;<Button size="small" type="text" @click.native="cancelContent">取消</Button> 
						</div>
						
					</div>

					<div class="desc">
						<div v-show="!is_edit_desc">
							{{taskData.desc}}
							<div v-if="isHandle"><a @click="editDesc">{{descEditText}}</a></div>
						</div>
						<div class="desc-edit" v-if="is_edit_desc">
							<textarea  class="input-desc" v-model="taskData.desc"></textarea>
							<div class="edit-handle">
								<Button type="primary" size="small" @click.native="saveDesc">保存</Button>
								<Button type="text"  size="small" @click.native="cancelDesc">取消</Button> 
							</div>
						</div>
					</div>
				</div>
				<div v-if="actualStartDate!=''">
					<Tooltip content="点击编辑" placement="bottom" >
					<i-Circle :size="80" @click.native="editPercent"  @mouseleave.native="savePercent" :stroke-color="circleColor" :stroke-width="5" :percent="taskData.percentComplete" target="-1">
						<span v-if="!isEditPercent" class="inner-text">{{taskData.percentComplete}}%</span>
						<InputNumber  v-if="isEditPercent&&isHandle" size="small" style="width:70%" :max="100" :min="0" v-model="taskData.percentComplete" @keyup.enter.native="savePercent"></InputNumber>
					</i-Circle>
					</Tooltip>
				</div>

			</div>

			<task-tag :data="tagData" :handle="isHandle"></task-tag>

			<div class="divider" style="margin:3px 0 10px"></div>
			
			<sub-task :data="subTaskData" :task="executor" @kb_task_actual_time_change="changeActualTime"></sub-task>

			<div class="divider" style="margin:10px 0 10px"></div>

			<div class="task-detail-comments">
				<div class="title"><Icon type="chatbox-working"></Icon> 评论</div>
				<ul class="task-detail-comment-list" v-if="isComment">
					<template  v-for="(comment,index) in commentData">
					<li class="comment-item" :key="index">
						<span class="user-avatar" :style="{backgroundColor:comment.creator.background}"><span class="avatar-name">{{moqui.shortName(comment.creator.name)}}</span></span>
						<div class="comment-box">
							<div class="comment-meta">
								<span class="comment-name">{{comment.creator.name}}</span>
								<span class="comment-time">{{comment.createTime}}</span>
								<a class="comment-reply" @click.stop.prevent="replyComment(index)"><Icon type="reply" class="icon" size="18"></Icon></a>
								<a class="comment-del" @click="delComment(index)"><Icon type="trash-a" class="icon" size="15" ></Icon></a>
							</div>
							<div class="comment-content" v-html="replaceContent(comment.content)"></div>
						</div>
					</li>
					<ul class="task-comment-reply-list">
						<template v-for="(reply,replyIndex) in comment.reply">
						<li :key="replyIndex">
							<span class="user-avatar" :style="{backgroundColor:reply.creator.background}"><span class="avatar-name">{{moqui.shortName(reply.creator.name)}}</span></span>
						    <div class="comment-box">
						        <div class="comment-meta">
						        	<span class="comment-name">{{reply.creator.name}} 回复: &nbsp;{{reply.mention.name}}</span>
						        	<span class="comment-time">{{reply.createTime}}</span>
									<a class="reply-reply" @click.stop.prevent="replyComment(index,replyIndex)"><Icon type="reply" class="icon" size="18"></Icon></a>
									<!-- <a class="reply-del" @click="delReply(replyIndex)"><Icon type="trash-a" class="icon" size="15" ></Icon></a> -->
						        </div>
						        <div class="comment-content" v-html="replaceContent(reply.content)"></div>
						    </div>
						</li>
						</template>
					</ul>
					<div class="divider" style="margin:10px 0"></div>
					</template>
				</ul>
				<div class="comment-no-content" v-if="!isComment">
					<Icon type="chatbox-working" size="30"></Icon>
					<p>暂时没有评论</p>
				</div>
			</div>
		</div>
	</div>

</template>
<script>
//测试项目任务数据载入
// import {taskArr} from './jsonData'
import {statusIcon} from '../config'
import priority from './priority'
import taskMember from './taskMember'
import taskDate from './taskDate'
import subTask from './subTask'
import taskTag from './taskTag'
import subtaskStatus from './subTaskStatus'
import taskMenu from './taskMenu'

export default {
	name:'task-detail',
	components:{
		taskDate,taskMember,subTask,taskTag,subtaskStatus
	},

	props: {
		data: Object,
		transition: String,
		projectId: String,
		columnData: Array,
		dropRule: Object
	},
	inject:['setCircleColor'],
	data() {
		return {
			edit_content_icon: false,
			is_edit_content: false,
			is_edit_desc: false,
			oldTaskData:null,
			taskData:{},
			executor:[],
			memberList:[],
			estimatedStartDate: '',
			estimatedCompletionDate: '',
			actualStartDate: '',
			actualCompletionDate:'',
			// percentComplete:0,
			subTaskData:[],
			commentData:[],
			tagData:[],
			toReplyID:null,

            isEditPercent:false,
            isHandle:false
		}
	},

	computed: {
		descEditText() {
			return this.taskData.desc == '' ? '添加描述' : '编辑'
		},
		isComment() {
			return this.taskData.comments?(this.taskData.comments.length > 0):false
		},
		classPriority() {
			return 'task-priority-' + this.taskData.priority
		},
		taskStatus() {
			return  statusIcon[this.taskData.statusId]
		},
		statusStyles() {
			return {
				color:this.taskStatus.color
			}
		},
		circleColor() {
			return this.setCircleColor(this.taskData.percentComplete)
        },

	},
	created: function() {

		// this.taskData = taskArr
		// this.dueDate = this.taskData.dueDate
		// this.executor = this.taskData.executor
		// this.memberList = this.taskData.members
		// this.subTaskData = this.taskData.subtasks
		// this.commentData = this.taskData.comments
		// this.tagData = this.taskData.tags

		//get remote taskDetail data
		let urlParams = {
			params:{
				cmd: 'getTaskArr',
				taskId: this.data.taskId
			}
		}
		this.$root.$http.get(this.transition,urlParams).then(response => {
			// console.log('taskDetail data => ',response.data)
			this.taskData = response.data
			this.estimatedStartDate = this.taskData.estimatedStartDate
			this.estimatedCompletionDate = this.taskData.estimatedCompletionDate
			this.actualStartDate = this.taskData.actualStartDate
			this.actualCompletionDate = this.taskData.actualCompletionDate
			// this.percentComplete = this.taskData.percentComplete
			this.executor = this.taskData.executor
			this.memberList = this.taskData.members
			this.subTaskData = this.taskData.subtasks
			this.commentData = this.taskData.comments
			this.tagData = this.taskData.tags
			this.setUserHandle()
		}, error => {
			// error callback
		})
	},

	mounted: function() {
		this.$root.eventBus.$on("kb_task_comment_add",(data)=>{
			this.saveComment(data)
		})		
		this.$root.eventBus.$on("kb_task_progress_change",(data)=>{
			this.taskData.percentComplete = data
			this.$root.eventBus.$emit("kb_task_percent_set"+this.taskData.id,data)
			let postParams = {
				"cmd": "storeWorkEffort",
				'workEffortId': this.taskData.id,
				'percentComplete': data
			}
			//默认100时，修改任务实际结束时间 
			if(data == 100) {
				let currentDate = this.moqui.getNowDate()
				this.actualCompletionDate = currentDate
				postParams['actualCompletionDate'] = currentDate
			}
			if(data < 100) {
				this.actualCompletionDate = ''
				postParams['actualCompletionDate'] = null
			}

			this.ajaxHandler(postParams,'saveCardPercent')
		})
	},

	methods: {
        setUserHandle() {
            let loginUserId = this.$root.operator.uid
            let executorId = this.executor.length > 0 ? this.executor[0].uid : 0
            this.isHandle =  loginUserId == executorId
        },
		ajaxHandler(postParams,opt) {
			this.$root.$http.post(this.transition,postParams).then(response => {
				if(response.data && response.data.result=='success'){
					let message = ''
					switch(opt) {
						case 'saveDesc':
							message = '任务描述保存成功！'
							break;
						case 'saveContent':
							message = '任务标题保存成功！'
							break;
						case 'saveComment':
							message = '评论保存成功'
							break;
						case 'delActualStartDate':
							message = '实际开始日期删除成功！'
							break;
						case 'changeActualStartDate':
							message = '实际开始日期保存成功！'
							break;
						case 'delActualCompletionDate':
							message = '实际完成日期删除成功！'
							break;
						case 'changeActualCompletionDate':
							message = '实际完成日期保存成功！'
							break;
						case 'setExecutor':
							message = '执行人保存成功！'
							break;
						case 'delExecutor':
							message = '执行人删除成功！'
							break;
						case 'setMember':
							message = '参与人保存成功！'
							break;
						case 'delMember':
							message = '参与人删除成功！'
							break;
						case 'saveComment':
							message = '评论成功！'
							break;
						case 'delComment':
							message = '评论删除成功！'
							break;
						case 'saveTaskPriority':
							message = '优先级保存成功！'
							break;
						case 'setTaskLike':
							message = '点赞成功！'
							break;
						case 'setTaskUnlike':
							message = '取消点赞成功！'
							break;
						case 'savePercent':
							message = '工作进度保存成功！'
							break;
						case 'startTask':
							message = '卡片任务已启动！'
							break;
						case 'completeTask':
							message = '卡片任务已完成！'
							break;
						default:
							message = '保存成功！'
					}
					if(opt!='saveCardPercent'){
        		this.handleNotice(message, 'success')
					}
				}
			}, error => {
				// error callback
			})
		},
		editPercent() {
			this.oldTaskData = Object.assign({},this.taskData)
			this.isEditPercent = true

		},
		savePercent() {
			if(this.isEditPercent) {
				let percentComplete = this.taskData.percentComplete
				let postParams = {
					"cmd":"storeWorkEffort",
					"workEffortId": this.taskData.id,
					"percentComplete": percentComplete
				}
				//默认100时，修改任务实际结束时间 
				if(percentComplete == 100) {
					this.actualCompletionDate = this.moqui.getDate()
					postParams['actualCompletionDate'] = this.moqui.getNowDate()
				}
				if(percentComplete < 100) {
					this.actualCompletionDate = ''
					postParams['actualCompletionDate'] = null
				}
				let oldPercent = this.oldTaskData.percentComplete
				if(percentComplete!=oldPercent) {
					this.ajaxHandler(postParams,'savePercent')
					this.$root.eventBus.$emit("kb_task_percent_set"+this.taskData.id,percentComplete)
					this.oldTaskData = null
				}
				this.isEditPercent = false

			}
		},

		saveDesc() {
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.taskData.id,
				"description": this.taskData.desc
			}
			this.ajaxHandler(postParams,'saveDesc')
			this.cancelEdit()
		},

		cancelDesc() {
			this.taskData.desc = this.oldTaskData.desc
			this.cancelEdit()
		},

		editDesc() {
			this.oldTaskData = Object.assign({},this.taskData)
			this.is_edit_desc = true
		},

		saveContent() {
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.taskData.id,
				"workEffortName": this.taskData.content
			}
			this.ajaxHandler(postParams,'saveContent')
			this.cancelEdit()
			this.$root.eventBus.$emit("kb_task_content_set"+this.taskData.id,this.taskData.content)
		},

		cancelContent() {
			this.taskData.content = this.oldTaskData.content
			this.cancelEdit()
		},

		editContent() {
			this.oldTaskData = Object.assign({},this.taskData)
			this.is_edit_content = true
		},

		cancelEdit() {
			this.is_edit_content = false
			this.is_edit_desc = false
			this.oldTaskData = null
		},

		setMember(data) {
			let partyIdList = []
			data.forEach(element => {
				partyIdList.push(element.uid)
			});
			let postParams = {
				"cmd":'storeWorkEffortParty',
				"workEffortId": this.taskData.id,
				"partyIdList": partyIdList,
				"roleTypeId": 'Assignee'
			}
			this.ajaxHandler(postParams,'setMember')
		},	

		delMember(data) {
			let postParams = {
				"cmd":'deleteWorkEffortParty',
				"workEffortId": this.taskData.id,
				"partyId": data.uid,
				"roleTypeId": 'Assignee'
			}
			this.ajaxHandler(postParams,'delMember')
		},

		setExecutor(data) {

			this.executor = data
			let partyIdList = []
			partyIdList.push(data[0].uid)
			let postParams = {
				"cmd":'storeWorkEffortParty',
				"workEffortId": this.taskData.id,
				"partyIdList": partyIdList,
				"roleTypeId": 'Manager'
			}
			this.ajaxHandler(postParams,'setExecutor')
			this.$root.eventBus.$emit("kb_task_executor_set"+this.taskData.id,data[0])
		},

		delExecutor(data) {
			let postParams = {
				"cmd":'deleteWorkEffortParty',
				"workEffortId": this.taskData.id,
				"partyId": data.uid,
				"roleTypeId": 'Manager'
			}
			this.ajaxHandler(postParams,'delExecutor')
			this.$root.eventBus.$emit("kb_task_executor_del"+this.taskData.id)
		},

		changeActualStartDate (date) {
			this.actualStartDate = date;
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.taskData.id,
				"actualStartDate": date
			}
			this.ajaxHandler(postParams,'changeActualStartDate')
		},
		delActualStartDate() {
			this.actualStartDate = ''
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.taskData.id,
				"actualStartDate": null
			}
			this.ajaxHandler(postParams,'delActualCompletionDate')
		},
		changeActualCompletionDate (date) {
			this.actualCompletionDate = date;
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.taskData.id,
				"actualCompletionDate": date
			}
			this.ajaxHandler(postParams,'changeActualCompletionDate')
		},
		delActualCompletionDate() {
			this.actualCompletionDate = ''
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.taskData.id,
				"actualCompletionDate": null
			}
			this.ajaxHandler(postParams,'delActualCompletionDate')
		},

		replaceContent(strs) {
			return strs.replace(/\n/g,'<br/>')
		},

		replyComment(index,replyIndex) {
			let data
			if(typeof replyIndex == "undefined"){
				data = this.commentData[index]
			} else {
				data = this.commentData[index].reply[replyIndex]
			}
			let params = {
				index:index,
				parentCommEventId:data.id,
				rootCommEventId:this.commentData[index].id,
				comment:data.creator
			}
			this.$root.eventBus.$emit('kb_comment_reply',params)
		},

		saveComment(data) {
			let postParams = {
				"cmd":"storeCommunication",
				"taskId":data.taskId,
				"parentCommEventId":data.parentCommEventId,
				"rootCommEventId":data.rootCommEventId,
				"toPartyId":data.mention.uid,
				"contentType":"text/plain",
				"body": data.content
			}

			this.$root.$http.post(this.transition,postParams).then(response => {
				if(response.data && response.data.result=='success'){
					data.id = response.data.commentId
					if(typeof data.index == "undefined") {
						this.commentData.push(data)
					} else {
						this.commentData[data.index].reply.push(data)
					}
					let h = this.$refs.detail.offsetHeight
					setTimeout(()=>{
						this.$refs.detail.scrollTop = h+1000
					},0)
        			this.handleNotice('评论成功！', 'success')
				}
			}, error => {
				// error callback
			})



		},

		delComment(index) {
			let data = this.commentData[index]
			this.commentData.splice(index,1)
			let postParams = {
				"cmd":"deleteCommunications",
				"communicationEventId": data.id
			}
			this.ajaxHandler(postParams,'delComment')
		},

		setTaskPriority(event) {
			this.$popover(event,{
				component:priority,
				data: {
					priority:this.taskData.priority,
					taskId:this.taskData.taskId,
					add: this.saveTaskPriority
				}
			})
		},

		saveTaskPriority(value) {
			this.taskData.priority = value
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.taskData.id,
				"priority": value
			}
			this.ajaxHandler(postParams,'saveTaskPriority')
			this.$root.eventBus.$emit("kb_task_priority_"+this.taskData.id,value)
		},

		setTaskLike() {
			this.taskData.islike = !this.taskData.islike
			if(this.taskData.islike) {
				this.taskData.likeCount++
			} else {
				this.taskData.likeCount--
			}
			let postParams = {
				"cmd":"storeWorkEffortLike",
				"workEffortId": this.taskData.id,
				"isLike": this.taskData.islike
			}
			if(this.taskData.islike) {
				this.ajaxHandler(postParams,'setTaskLike')
			} else {
				this.ajaxHandler(postParams,'setTaskUnlike')
			}
			this.$root.eventBus.$emit("kb_task_like_"+this.taskData.id,this.taskData.islike)
		},
		saveTaskStatus() {
			let postParams = {
				"cmd":"storeWorkEffortStatus",
				'workEffortId':this.taskData.id,
				'hitTime': this.moqui.getNowDate(),
				'statusId': this.taskStatus.next
			}
			if(this.taskStatus.next == 'WeInProgress'){
				this.ajaxHandler(postParams,'startTask')
			}else if(this.taskStatus.next == 'WeComplete'){
				this.ajaxHandler(postParams,'completeTask')
			}
			console.log(this.taskStatus.time,this.taskData)
			this[this.taskStatus.time] = this.moqui.getNowDate()
			this.taskData.statusId = this.taskStatus.next
		},
		//子任务开始触发任务开始时间
		changeActualTime(value) {
			if(this.actualStartDate == "") {
				this.actualStartDate = value
			}
		},
		setTaskMenu(event) {
			this.$popover(event,{
				component:taskMenu,
				data: {
					taskData:this.data.taskCard,
					columnData: this.columnData,
					dropRule: this.dropRule,
					index:this.data.index,
					transition: this.transition
				}
			})
		},
	},
	destroyed:function(){
		this.$root.eventBus.$off("kb_task_comment_add")
		this.$root.eventBus.$off("kb_task_progress_change")
	}
}
</script>

<style>
.task-detail-wrap {
	margin: -16px;
	color:#505050;
}
.task-detail-wrap .header {
	width: 100%;
	border-bottom:1px solid #E6E6E6;
	padding: 16px 16px 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.task-detail-wrap .header .header-right {
	display: flex;
	margin-right: 20px;
	color:#d0d0d0;
}
.task-detail-wrap .header .icon-box {
	padding: 0 10px;
	cursor: pointer;
	display: flex;
}
.task-detail-wrap .header .icon {
	margin-right: 5px;
	transition: scale .25s;
}
.task-detail-wrap .header .icon:hover {
	transform: scale(1.2);
}


.task-detail-wrap .icon {
	cursor: pointer;
}




.task-detail-content {
	max-height: 470px;
	overflow-y: auto;
	overflow-x: hidden;
	padding:10px 16px;
}

.task-detail-content .work-time {
	line-height: 24px;
	display: inline-block;
	background: #f1f1f1;
	border-radius: 10px;
	padding: 0 8px;
	font-size: 12px;
	position: relative;
	margin-right: 5px;
}


.task-detail-content .content {
	font-size: 16px;
}
.task-detail-content .content:hover{
	background: #f9f9f9;
}

.task-detail-content .content input {
	border-color:#dddee1;
	font-size: 14px;
}
.task-detail-content .desc .input-desc {
	width: 100%;
	height: 150px;
	display: block;
	text-align: left;
	line-height: 24px;
	border-color:#dddee1;
	padding:5px;
	border-radius: 4px;
	outline: none;
	resize: none;
}

.task-detail-content .desc .edit-handle {
	text-align: right;
	margin:10px auto;
}

.task-detail-content .info {
	margin:5px 0;
}
.task-detail-content .desc {
	line-height: 22px;
	margin:5px 0;
}


.task-detail-content .edit-icon-content {
	color: #ccc;
	margin-left: 10px
}

.task-detail-content .content-edit {
	display: flex;
}
.task-detail-content .content-edit .input-text {
	margin-right: 10px;
	width: 100%;
	outline: none
}


.task-detail-content .tag-list {
	flex: 1
}
.task-detail-content .title {
	margin-right: 15px;
	line-height: 20px;
}

.task-detail-content .tag-list .tag {
	display: inline-block;
	margin-bottom: 10px;
	color:#FFF;
	border-radius: 10px;
	padding:1px 8px;
	font-size: 12px;
	position: relative;
	margin-right: 3px;
	transition: padding-right 218ms ease
}

.task-detail-content .tag-list .tag:hover {
  padding-right:22px
}
.task-detail-content .tag-list .tag:hover .del {
	display: inline-block;
	opacity: 1
}
.task-detail-content .tag-list .tag-add {
	background: #F1F1F1;
	color:#505050;
}
.task-detail-content .tag-list .tag-add:hover {
	padding-right:8px;
	background-color: #288bf5;
	color: #FFF;
}

.task-detail-content .tag-list .tag .del{
	display: none;
	opacity: 0;
	color: rgba(255,255,255,.8);
	background-color: rgba(0,0,.0,.3);
	width: 18px;
	height: 18px;
	text-align: center;
	line-height: 18px;
	border-radius: 100%;
	position:absolute;
	right:1px;
	top:1px;
	transform: scale(.8,.8);
	cursor: pointer;
}
.task-content-icon-box .icon {
  display: inline-block;
  border: 1px #ccc dashed;
  width: 24px;
  height: 24px;
  text-align: center;
  border-radius: 100%;
  color:#ccc;
  line-height: 23px;
}
.task-content-icon-box .icon:hover{
	color:#22d7bb;
	border-color: #22d7bb
}

.task-content-icon-box .active {
  color: #22d7bb; 
  border-color: #22d7bb
}



.task-detail-comments .title {
  font-weight: 700;
  font-size: 14px;
}

.task-detail-comment-list {

}
.task-detail-comment-list li {
	display: flex;
	padding:10px 0;
	
}


.task-detail-comment-list .comment-box {
	flex: 1 1;
	margin-left: 10px;
}
.task-detail-comment-list .comment-meta {
	position: relative;
	margin-bottom: 5px;
}
.task-detail-comment-list .comment-meta .comment-time {
	color:#aaa;
	margin-left: 10px;
}
.task-detail-comment-list .comment-meta .comment-del {
	position: absolute;
	right: 10px;
	top:2px;
	display: none
}
.task-detail-comment-list .comment-meta .comment-reply {
	position: absolute;
	right: 45px;
	top:0px;
	display: none
}

.task-detail-comment-list .comment-item:hover .comment-del,
.task-detail-comment-list .comment-item:hover .comment-reply {
	display: inline-block;
}

.task-detail-comments .comment-no-content {
	padding:50px 0;
	text-align: center; 
	color:#D4D5D6
}
.task-comment-reply-list {
	background-color: #f9f9f9;
	padding:0 10px;
	margin-left: 30px;
}
.task-comment-reply-list li {
	border-bottom: 1px dashed #e5e5e5
}
.task-comment-reply-list li:last-child{
	border-bottom: none
}

.task-comment-reply-list .comment-meta .reply-del {
	position: absolute;
	right: 10px;
	top:2px;
	display: none
}
.task-comment-reply-list .comment-meta .reply-reply {
	position: absolute;
	right: 45px;
	top:0px;
	display: none
}
.task-comment-reply-list li:hover .reply-reply,
.task-comment-reply-list li:hover .reply-del {
	display: inline-block;
}
</style>






