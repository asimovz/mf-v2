<template>
	<div class="detail-subtask">
		<div class="title"><Icon type="merge"></Icon> 子任务 ({{completeLength}}/{{dataLength}})</div>
		<Progress v-show="data.length > 0" :percent="progress" :stroke-width="5" :hide-info="true"></Progress>
		<ul class="subtask">
			<template v-for="(item,index) in data">
				<li>
					<div class="flex">
						<!-- <div v-show="editTaskIndex!=index" class="task-cell-check"><Checkbox v-model="item.complete"></Checkbox></div> -->
						<div class="task-cell-content">
							<div class="content-wrap" v-show="editTaskIndex!=index">
								<span :class="['content-box',{'task-complete':item.statusId=='WeComplete'}]">{{item.content}}</span>
								<span class="edit-sub-task" v-if="checkExecutor(index)">
									<Icon @click.native="editSubTask(index)" size="15" class="icon" type="compose"></Icon> 
									<!-- <Icon type="trash-a" class="icon" size="15"></Icon>  -->
								</span>
							</div>
							<div v-if="editTaskIndex==index">
								<input ref="input_text"  :class="['input-text',{'input-error':errorClass}]" :placeholder="errorText" v-model.trim="item.content"/>
								<div class="subtask-edit-box">
									<div class="subtask-edit-w70 flex">
										<span class="in-block" style="line-height: 36px">完成进度：</span>
										<Slider class="subtask-edit-w70 in-block" v-model="item.percentComplete"></Slider>									
									</div>
									<div class="handle">
										<Button size="small" type="primary" @click.native="submitSubTask(index)">保存</Button> <Button type="text" size="small"  @click.native="cancelEdit">取消</Button>
									</div>
								</div>

							</div>
							
						</div>

						<div class="date-user">
							<div class="task-content-icon-box">
								<subtask-status v-if="checkStatus(index)" :type="item.statusId" belong="subtask" @changeSubTaskStatus="saveSubTaskStatus(index,$event)"></subtask-status>
								<a v-if="item.bizForm.formUrl" class="icon" target="_blank" href="javascript:" @click="getBizFormPath(item.bizForm)">
									<Icon color="#5cadff" type="document-text" size="13"></Icon>
								</a>
								<!-- <task-date :date="item.dueDate" @click.native="changeEditTaskIndex(index)" @changeDate="changeDate" @on-del="delDueDate(index)"></task-date> -->
 
								<task-member :handle="checkExecutor(index)" :executor="item.executor" @click.native="changeEditTaskIndex(index)" @on-set="setExecutor"  @on-del="delExecutor(index,$event)"></task-member>
							</div>
						</div>
					</div>
					<div class="subtask-info">
						<div style="width:60px">
							<i-Circle :size="28" stroke-color="#288bf5"  :stroke-width="9" :percent="item.percentComplete" style="margin-top: 3px">
								<span class="inner-text">{{item.percentComplete}}</span>
							</i-Circle>

						</div>
						<div>
							<p>计划时间</p>
							<p>{{item.estimatedStartDate | format('yyyy-MM-dd')}} <span v-if="item.estimatedCompletionDate!=''">~</span> {{item.estimatedCompletionDate | format('yyyy-MM-dd')}}</p>
						</div>
						<div class="icon"><Icon type="android-calendar" size="20" color="#ccc"></Icon></div>
						<div>
							<p>工作时间</p>
							<p v-if="item.actualStartDate!=''">{{item.actualStartDate | format('yyyy-MM-dd')}} <span v-if="item.actualCompletionDate!=''">~</span> {{item.actualCompletionDate | format('yyyy-MM-dd')}}</p>
						</div>

					</div>
				</li>

			</template>

		</ul>
		<!-- <a class="subtask-addbtn" v-show="!isNew" @click="addSubTask">
			<Icon type="ios-plus-outline"></Icon>  添加子任务
		</a> -->
	</div>
</template>
<script>

//清除两端空格
function Trim(A){
  return A.replace(/^\s*|\s*$/g,"");
}

import qs from 'qs'
import taskMember from './taskMember'
import taskDate from './taskDate'
import subtaskStatus from './subTaskStatus'

export default {
	name:'sub-task',

	components:{
		taskDate,taskMember,subtaskStatus
	},
	props: {
		data: Array,
		task: Array
	},

	data() {
		return {
			editTaskIndex:null,
			taskIndex:null,
			isNew: false,
			oldData:null,
			errorClass:false,
			projectId: this.$parent.projectId,
			transition: this.$parent.transition,
			errorText: '',
            operator: '',


		}
	},

	computed: {
		dataLength() {
			return this.data?this.data.length:0
		},
		completeLength() {
			if(this.data){
				return this.data.filter((item)=>{
					 return item.statusId == 'WeComplete'
				}).length 
			} else {
				return 0
			}
		},
		progress() {
			let num = this.completeLength/this.dataLength*100

			return Math.floor(num)
		},
	},

	created: function() {
	},

	mounted: function() {
	},

	watch: {
		task() {
			if(this.task.length > 0) {
				this.operator = this.task[0].uid
			}
		}
	},

	methods: {
		getBizFormPath(bizForm){
			this.$root.eventBus.$emit("kb_task_close_modal")
			let path = bizForm.formUrl
			if(bizForm.parameters){
				let urlParams =  qs.stringify(bizForm.parameters)
				path += '?' + urlParams
			}
			window.open(path)
		},
        checkStatus(index) {
            let userData = this.data[index].executor
            let executorId = userData.length > 0 ? userData[0].uid : 0
            return executorId == this.$root.operator.uid
        },
		checkExecutor(index) {
            let userData = this.data[index].executor
            let executorId = userData.length > 0 ? userData[0].uid : 0
			return this.operator == this.$root.operator.uid || executorId == this.$root.operator.uid
		},

		ajaxHandler(postParams,opt) {
			this.$root.$http.post(this.$parent.transition, postParams).then(response => {
				if(response.data && response.data.result=='success'){
					let message = ''
					switch(opt)
					{
						case 'saveSubTask':
							message = '子任务信息保存成功！'
						break;
						case 'delDueDate':
							message = '完成日期删除成功！'
						break;
						case 'changeDate':
							message = '完成日期保存成功！'
						break;
						case 'setExecutor':
							message = '执行人保存成功！'
						break;
						case 'delExecutor':
							message = '执行人删除成功！'
						break;
						case 'startTask':
							message = '任务已启动！'
						break;
						case 'completeTask':
							message = '任务已完成！'
						break;
						default:
							message = '保存成功！'
					}
        	this.handleNotice(message, 'success')
				}
			}, error => {
				// error callback
			})
		},

		saveSubTask(taskData,index) {
			let _http = this.$root.$http
			this.data[index] = taskData
			this.isNew = false
			this.editTaskIndex = null

			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": taskData.id,
				"workEffortName": taskData.content,
				"percentComplete": taskData.percentComplete
			}			
			//默认100时，修改任务实际结束时间 
			if(taskData.percentComplete == 100) {
				this.data[index]['actualCompletionDate'] = this.moqui.getDate()
				postParams['actualCompletionDate'] = this.moqui.getNowDate()
				this.data[index]['statusId'] = 'WeComplete'
				postParams['statusId'] = 'WeComplete'
			}
			if(taskData.percentComplete < 100) {
				this.data[index]['actualCompletionDate'] = ''
				postParams['actualCompletionDate'] = null
				this.data[index]['statusId'] = 'WeInProgress'
				postParams['statusId'] = 'WeInProgress'
			}
			this.ajaxHandler(postParams,'saveSubTask')
		},

		submitSubTask(index) {
			let data = this.data[index]
			let content = Trim(data.content)
			if(content == "") {
				this.errorClass = true
				this.errorText = '内容不能为空'
				return
			}
			this.saveSubTask(data,index)
			this.oldData = null
		},

		addSubTask() {
			this.isNew = true
			let length = this.data.length
			this.data.push({
				"id":null,
				"parentId":200010,
				"creatorId":1111,
				"projectId":1001,
				"taskListId":10014,
				"content":'',
				"dueDate":'',
				"executor":[],
				"status":0
			})
			this.editTaskIndex = length
		},

		changeEditTaskIndex(index) {
			this.taskIndex = index
		},

		cancelEdit() {
			if(this.isNew){
				this.data.splice(-1)
				this.isNew = false
			} else {
				this.data[this.taskIndex].content = this.oldData.content
				this.data[this.taskIndex].percentComplete = this.oldData.percentComplete
			}
			this.editTaskIndex = null
		},

		editSubTask(index) {
			this.editTaskIndex = index
			this.taskIndex = index
			this.oldData = Object.assign({},this.data[index])
			
		},

		setExecutor(data) {
			this.data[this.taskIndex].executor = data
			let partyIdList = []
			partyIdList.push(data[0].uid)
			let postParams = {
				"cmd":'storeWorkEffortParty',
				"workEffortId": this.data[this.taskIndex].id,
				"partyIdList": partyIdList,
				"roleTypeId": 'Manager'
			}
			this.ajaxHandler(postParams,'setExecutor')
		},

		delExecutor(index,data) {
			let postParams = {
				"cmd":"deleteWorkEffortParty",
				"workEffortId": this.data[index].id,
				"partyId": data.uid,
				"roleTypeId": 'Manager'			
			}
			this.ajaxHandler(postParams,'delExecutor')
		},

		changeDate (date) {
			this.data[this.taskIndex].dueDate = date
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.data[this.taskIndex].id,
				"actualCompletionDate": date
			}
			this.ajaxHandler(postParams,'changeDate')
		},

		delDueDate(index) {
			this.data[index].dueDate = ''
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.data[index].id,
				"actualCompletionDate": null
			}
			this.ajaxHandler(postParams,'delDueDate')
		},

		saveSubTaskStatus(index,data) {
			let hitTime = this.moqui.getNowDate()
			let postParams = {
				"cmd":"storeWorkEffortStatus",
				'workEffortId':this.data[index].id,
				'hitTime': hitTime,
				'statusId': data.status
			}

			this.data[index].statusId = data.status
			this.data[index][data.time] = hitTime

			if(data.status == 'WeInProgress'){
				this.data[index]['actualCompletionDate'] = ''
				postParams["actualCompletionDate"] = null
				this.data[index]['percentComplete'] = 0
				postParams["percentComplete"] = 0
				this.ajaxHandler(postParams,'startTask')
				this.$emit("kb_task_actual_time_change",hitTime)
			}else if(data.status == 'WeComplete'){
				this.data[index]['percentComplete'] = 100
				postParams["percentComplete"] = 100
				this.ajaxHandler(postParams,'completeTask')
			}

			this.$nextTick(function(){
				this.$root.eventBus.$emit("kb_task_progress_change",this.progress)
			})

	
			
		},
	}
}
</script>








