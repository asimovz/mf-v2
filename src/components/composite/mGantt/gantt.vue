<template>
	<div>
		<gantt-temp></gantt-temp>
		<ul class="ganttTool">
			<li @click="addTask"><span class="teamworkIcon">e</span><em>新增</em></li>
			<li @click="saveAllGantt" :class="{'nosave':isNoSave}"><span class="teamworkIcon">c</span><em>保存</em></li>
			<li @click="deleteTask"><span class="teamworkIcon">&cent;</span><em>删除</em></li>
			<li class="separator"></li>
			<li @click="outdentTask"><span class="teamworkIcon">.</span><em>升级</em></li>
			<li @click="indentTask"><span class="teamworkIcon">:</span><em>降级</em></li>
			<li class="separator"></li>
			<li @click="moveUpTask"><span class="teamworkIcon">k</span><em>上移</em></li>
			<li @click="moveDownTask"><span class="teamworkIcon">j</span><em>下移</em></li>
			<li class="separator"></li>
			<li @click="zoomPlus"><span class="teamworkIcon">(</span><em>放大</em></li>
			<li @click="zoomMinus"><span class="teamworkIcon">)</span><em>缩小</em></li>
			<li class="separator"></li>
			<!-- <li @click="showPath"><span class="teamworkIcon">&pound;</span></li> -->
			<li @click="showScreenType('right')"><span class="teamworkIcon">F</span></li>
			<li @click="showScreenType('mid')"><span class="teamworkIcon">O</span></li>
			<li @click="showScreenType('left')"><span class="teamworkIcon">R</span></li>
			<li class="separator"></li>
			<li @click="modal = true"><span class="teamworkIcon">M</span><em>项目成员管理</em></li>
		</ul>
		<div id="ganttWorkSpace"></div>
		<m-loading v-if="show"></m-loading>
		<Modal :width="400" v-model="modal" title="添加人员" :loading="true" class-name="ganttResources" @on-ok="saveResources" @on-cancel="cancelResources" v-modal-ext="{modal:true,drag:true,escClose:true}">
			<Row style="margin-bottom:10px">
				<Col span="18">
				<Select filterable remote :remote-method="loadResources" :loading="loading" :label-in-value="true" @on-change="searchSelectData" placeholder="请输入姓名进行搜索">
					<Option v-for="(option, index) in resourceLoadData" :value="option.value" :key="index">{{option.label}}</Option>
				</Select>
				</Col>
				<Col class="tc" span="6">
				<m-button @click.native="addResources" text="添加"></m-button>
				</Col>
			</Row>
			<template v-for=" (item,index) in resourcesData">
				<Row class="row">
					<Col span="7" class="item">{{item.name}}</Col>
					<Col span="13">
					<Select size="small" v-model="item.roleName" placeholder="请选择角色">
						<Option v-for="child in rolesLoadData" :value="child.value" :key="child.value">{{ child.label }}</Option>
					</Select>
					</Col>
					<Col class="item" span="4">
					<input type="hidden" name="roleID" :value="item.id">
					<Icon @click.native="delResources(index)" type="trash-a"></Icon>
					</Col>
				</Row>
			</template>
		</Modal>
	</div>
</template>
<style type="text/css">
.ganttResources .ivu-modal-body {
	height: 300px;
	overflow-y: auto;
}

.ganttResources .row {
	border-top: 1px solid #F1F1F1;
	padding: 10px 0
}

.ganttResources .item {
	text-align: center;
	line-height: 24px
}

.ganttResources .tc {
	text-align: center;
}



.gdfTable thead tr,
.ganttFixHead .ganttHead2 {
	box-shadow: 0px 4px 10px rgba(167, 167, 167, 0.25);
}
.ganttHead1, .ganttHead2 {
    height: 25px;
}

.gdfColHeader {
	background-color: #FFF;
	border-bottom: none;
	border-right: 1px solid #eff3f7;
	
}

.ganttHead1 th {
	background-color: #FFF;
	border-left: 1px solid #eff3f7;
	border-bottom: 1px solid #eff3f7;
}
.ganttHead2 th {
	background-color: #FFF;
	border-bottom: none;
	border-left: 1px solid #eff3f7;
}
</style>
<script>
/*
	绿色 active      ->   STATUS_ACTIVE     ->  活动状态 WeInProgress
	黄色 suspended   ->   STATUS_SUSPENDED  ->  暂停状态 WeOnHold
	橙色 waiting     ->   STATUS_WAITING    ->  等待状态 
	蓝色 completed   ->   STATUS_DONE       ->  完成状态 WeComplete
	紫色 failed      ->   STATUS_FAILED     ->  失败状态 WeCancelled
	灰色 undefined   ->   STATUS_UNDEFINED  ->  未开始状态 WeOnHold

	绿色 完成
	黄色 活动
	红色 暂停/等待
	灰色 未开始
	黑色 失败

*/
// import $S from './ganttJs'
import ganttTemp from './ganttTemp'
import ganttData from './ganttData'

var $S = require('assets/js/script.js')
const jsArr = [
	"/static/js/gantt/jqueryui.min.js",
	"/static/js/gantt/libs/jquery/jquery.livequery.1.1.1.min.js",
	"/static/js/gantt/libs/jquery/jquery.timers.js",
	"/static/js/gantt/libs/utilities.js",
	"/static/js/gantt/libs/forms.js",
	"/static/js/gantt/libs/date.js",
	"/static/js/gantt/libs/dialogs.js",
	"/static/js/gantt/libs/layout.js",
	"/static/js/gantt/libs/i18nJs.js",
	"/static/js/gantt/libs/jquery/dateField/jquery.dateField.js",
	"/static/js/gantt/libs/jquery/JST/jquery.JST.js",
	"/static/js/gantt/libs/jquery/svg/jquery.svg.min.js",
	"/static/js/gantt/libs/jquery/svg/jquery.svgdom.1.8.js",
	"/static/js/gantt/ganttUtilities.js",
	"/static/js/gantt/ganttDrawerSVG.js",
	"/static/js/gantt/ganttTask.js",
	// "/static/js/gantt/ganttZoom.js",
	"/static/js/gantt/ganttGridEditor.js",
	"/static/js/gantt/ganttMaster.js",
	"/static/js/gantt/ganttFun.js",
]

export default {
	name: 'gantt',
	components: {
		ganttTemp
	},
	props: {
		ganttAjaxController: String,
		rootWorkEffortId: String
	},
	data() {
		return {
			show: true,
			jsonData: ganttData,
			isNoSave: false,
			modal: false,
			loading: false,
			resourceLoadData: [], //服务端获取资源数据
			rolesLoadData: [], //服务端获取角色数据
			resourcesData: [], //项目新增资源数据
			oldResourcesData: [], //项目原始资源数据
			resourceName: '', //搜索选择返回资源数据
			statusRule:{},  //状态转换规则

			lastTime:null

		}
	},
	created: function() {
		$S(jsArr,'gantt')
		$S.ready('gantt', () => {
			this.show = false
			setTimeout(() => {
				this.showGantt()
			}, 0)
		})
	},
	mounted: function() {

	},
	destroyed: function() {
		console.log('============组件销毁')
	},
	methods: {
		searchSelectData(value) { //下拉搜索选择
			this.resourceName = value
		},

		loadResources(query) { //搜索服务端资源数据
			if (query != "") {
				this.debounce(()=>{
					this.loading = true
					let param = { 'CM': 'LOADPENDINGRES', 'term': query }
					let http = this.$root.$http
					http.post(this.ganttAjaxController, param).then(response => {
						this.loading = false
						let project = response.data
						let newData = []
						this.resourceLoadData = []
						project.availableResources.map(item => {
							this.resourceLoadData.push({
								'value': item.partyId,
								'label': item.partyName
							})
						})
					}, response => {
					})

				},300)
			}
		},

		addResources() { //弹框添加资源
			let data = this.resourceName
			if (data.length == 0) return
			this.resourcesData.push({
				id: data.value,
				name: data.label,
				roleName: ''
			})
			this.resourceLoadData = []
			this.resourceName = ''
		},
		delResources(index) { //删除添加的资源
			this.resourcesData.splice(index, 1)
		},
		filterResources(data) { // 保存资源之前转换服务端字段映射
			let newData = []
			data.map(item => {
				newData.push({
					partyId: item.id,
					roleTypeId: item.roleName
				})
			})
			return newData
		},
		cancelResources() { //弹窗取消操作
			this.resourcesData = JSON.parse(JSON.stringify(this.oldResourcesData))
			this.resourceLoadData = []
			this.resourceName = ''
		},
		saveResources() { //弹窗确定保存资源
			if (this.resourcesData.length == 0) return
			let data = this.filterResources(this.resourcesData)
			let param = { 'CM': 'SAVERES', 'rootWorkEffortId': this.rootWorkEffortId, 'projectResourceList': data }
			console.log(param)
			this.modal = false
			this.oldResourcesData = JSON.parse(JSON.stringify(this.resourcesData))
			let http = this.$root.$http
			http.post(this.ganttAjaxController, param).then(response => {
				this.modal = false
				this.oldResourcesData = this.resourcesData
				ge.resources = this.resourcesData
				ge.redraw()
			}, response => {

			})

		},
		saveAllGantt() { //甘特图数据整体保存
			if (!this.isNoSave) return
			let data = this.toFilterData(ge.tasks)
			let http = this.$root.$http
			let param = { 'CM': 'SVPROJECT', 'workEffortGanttList': data, 'toDeleteWorkEffortIdList': ge.deletedTaskIds }
			http.post(this.ganttAjaxController, param).then(response => {
        		this.handleNotice("保存成功!",'success')
				this.isNoSave = false
			}, response => {
				this.handleNotice("操作失败!",'danger')
			})
		},
		addTask() {
			ge.co_addNewTask()
		},
		deleteTask() {
			ge.co_deleteTask()
			this.isNoSave = true
		},
		outdentTask() {
			ge.outdentCurrentTask()
			this.isNoSave = this.isNoSave || ge.isSave
		},
		indentTask() {
			ge.indentCurrentTask()
			this.isNoSave = this.isNoSave || ge.isSave
		},
		moveUpTask() {
			ge.moveUpCurrentTask()
			this.isNoSave = this.isNoSave || ge.isSave
		},
		moveDownTask() {
			ge.moveDownCurrentTask()
			this.isNoSave = this.isNoSave || ge.isSave

		},
		zoomPlus() {
			ge.gantt.zoomGantt(true)
		},
		zoomMinus() {
			ge.gantt.zoomGantt(false)
		},
		showPath() {
			ge.co_showPath()
		},
		showScreenType(type) {
			let size
			switch (type) {
				case 'left':
					size = 100
					break;
				case 'mid':
					size = 50
					break;
				case 'right':
					size = 0.1
					break;
			}
			ge.splitter.resize(size)
		},
		editResources() {
			editResources()
		},
		showGantt() { //载入甘特图
			$.JST.loadDecorator('RESOURCE_ROW', function(resTr, res) {
				resTr.find('.delRes').click(function() { $(this).closest('tr').remove() })
			})

			$.JST.loadDecorator('ASSIGNMENT_ROW', function(assigTr, taskAssig) {
				var resEl = assigTr.find('[name=resourceId]')
				var opt = $('<option>')
				resEl.append(opt)
				for (var i = 0; i < taskAssig.task.master.resources.length; i++) {
					var res = taskAssig.task.master.resources[i]
					opt = $('<option>')
					opt.val(res.id).html(res.name)
					if (taskAssig.assig.resourceId == res.id) { opt.attr('selected', 'true') }
					resEl.append(opt)
				}
				var roleEl = assigTr.find('[name=roleId]')
				for (var i = 0; i < taskAssig.task.master.roles.length; i++) {
					var role = taskAssig.task.master.roles[i]
					var optr = $('<option>')
					optr.val(role.id).html(role.name)
					if (taskAssig.assig.roleId == role.id) { optr.attr('selected', 'true') }
					roleEl.append(optr)
				}

				if (taskAssig.task.master.permissions.canWrite && taskAssig.task.canWrite) {
					assigTr.find('.delAssig').click(function() {
						var tr = $(this).closest('[assId]').fadeOut(200, function() { $(this).remove() })
					})
				}
			})

			var canWrite = true // this is the default for test purposes

			// here starts gantt initialization
			window.ge = new GanttMaster()
			// window.ge.set100OnClose=true;
			window.ge.shrinkParent=true; //父节点跟随子节点收缩
			ge.postUrl = this.ganttAjaxController

			ge.init($('#ganttWorkSpace'))
			loadI18n() // overwrite with localized ones
			delete ge.gantt.zoom

			this.loadGanttFromServer() //载入服务端数据

			// this.loadProjectData(this.jsonData.project) //载入本地数据
		},
		loadProjectData(data) {
			let newProject = {
				'deletedTaskIds': [],
				'resources': [],
				'roles': [],
				'selectedRow': 0,
				'canWrite': data.canWrite,
				'canDelete': data.canDelete,
				'canWriteOnParent': data.canWriteOnParent,
                'canAdd': data.canAdd,
                'zoom':'1M' //设置右侧日期尺度
			}
			newProject['tasks'] = this.fromFilterTasks(data.tasks)
			newProject['resources'] = this.fromFilterResources(data.resources)
			newProject['roles'] = this.fromFilterRoles(data.roles)

			this.resourcesData = this.fromFilterResources(data.resources)
			this.oldResourcesData = JSON.parse(JSON.stringify(this.resourcesData))
			this.rolesLoadData = this.fromFilterProjectRoles(data.roles)
			ge.statusRule = data.statusRules
			ge.formCfg = this.filterFormCfg(data.formsCfg)
			ge.workTypes = this.filterWorkTypes(data.workTypes)
			ge.loadProject(newProject)
			ge.checkpoint() // empty the undo stack
		},

		loadGanttFromServer(callback) { //查询服务端数据
			var http = this.$root.$http
			var data = { CM: 'LOADPROJECT', rootWorkEffortId: this.rootWorkEffortId }
			http.post(this.ganttAjaxController, data).then(response => {
				var dataProject = response.data.project
				this.loadProjectData(dataProject)
			}, response => {
				// error callback
			})
		},
		fromFilterTasks(data) {
			let newTasks = []
			let statusArr = {
				'WeInPlanning': 'STATUS_UNDEFINED',
				'WeInProgress': 'STATUS_ACTIVE',
				'WeOnHold': 'STATUS_SUSPENDED',
				'WeComplete': 'STATUS_DONE',
				'WeClosed': 'STATUS_FAILED',
				'WeCancelled': 'STATUS_FAILED'
			}
			data.map(item => {
				let end = item.estimatedCompletionDate
				let start = item.estimatedStartDate
				let hours = getDurationInUnits(new Date(start),new Date(end))

				let assigns = []
				item.assigns.map(child => {
					assigns.push({
						'id': child.workEffortId,
						'resourceId': child.partyId,
						'roleId': child.roleTypeId,
						'effort': this.changeTimeStamp(child.fromDate)
					})
				})

				let isMilestone = item.workEffortTypeEnumId == 'WetMilestone'
				let isTask = item.workEffortTypeEnumId == 'WetTask'

				newTasks.push({
					'id': item.workEffortId,
					'taskType': item.workEffortTypeEnumId,
					'name': item.workEffortName,
					'progress': 0,
					'progressByWorklog': false,
					'description': item.description,
					'level': item.level,
					'status': statusArr[item.statusId],
					'depends': this.idToDepends(data,item.depends),
					'canWrite': item.canWrite,
					'start': this.changeTimeStamp(item.estimatedStartDate),
					'end': this.changeTimeStamp(item.estimatedStartDate),
					'duration': hours, // item.actualWorkDuration,
					'startIsMilestone': isMilestone,
					'endIsMilestone': isMilestone,
					'collapsed': item.collapsed,
					'assigs': assigns,
					'hasChild': item.hasChild,
					'parentID': item.parentWorkEffortId,
					"workTypeEnumId": item.workTypeEnumId,
          			"bizFormAssoc": item.bizFormAssoc,
					'milestoneID': item.milestoneWorkEffortId,
					'milestoneName': item.milestoneWorkEffortName,
					'isMilestone': isMilestone,
					"rootID": item.rootWorkEffortId,
					"isTask": isTask,
					"isAllot": item.estimatedStartDate == null ? false : true

				})
			})
			console.log(newTasks)
			return newTasks
		},
		//根据行号返回ID
		dependsToId(data,value) {
			let reStr = []
			value.split(",").map(item => {
				reStr.push(data[item-1].id)
			})
			return reStr
		},
		//根据workEffortID查对应的行数
		idToDepends (data,value) {
		    var newData = []
		    data.map(function(item,index){
		        if (value.indexOf(item.workEffortId)>=0) {
		            newData.push(index+1)
		        }
		    })
		    return newData.join(",")
		},
		fromFilterResources(data) {
			let newResources = []
			data.map(item => {
				newResources.push({
					'id': item.partyId,
					'name': item.partyName,
					'roleName': item.roleTypeId
				})
			})
			return newResources
		},
		fromFilterProjectRoles(data) {
			let newRoles = []
			data.map(item => {
				newRoles.push({
					'value': item.roleTypeId,
					'label': item.description
				})
			})
			return newRoles
		},
		fromFilterRoles(data) {
			let newRoles = []
			data.map(item => {
				newRoles.push({
					'id': item.roleTypeId,
					'name': item.description,
				})
			})
			return newRoles
		},
		toFilterData(data) {

			let newData = []
			let statusArr = {
				'STATUS_UNDEFINED': 'WeApproved',
				'STATUS_ACTIVE': 'WeInProgress',
				'STATUS_SUSPENDED': 'WeOnHold',
				'STATUS_DONE': 'WeComplete',
				'STATUS_FAILED': 'WeCancelled',
			}

			data.map(item => {
				let assigns = []
				item.assigs.map(child => {
					assigns.push({
						'partyId': child.resourceId,
						'roleTypeId': child.roleId,
					})
				})

				newData.push({
					'workEffortId': item.id,
					'workEffortName': item.name,
					'workEffortTypeEnumId': item.taskType,
					'progress': 0,
					'progressByWorklog': false,
					'description': item.description,
					'level': item.level,
					'statusId': statusArr[item.status],
					'depends': item.depends == '' ? [] : this.dependsToId(data,item.depends),
					'estimatedStartDate': this.changeDate(item.start),
					'estimatedCompletionDate': this.changeDate(item.end),
					'assigns': assigns,
					'hasChild': item.hasChild,
					'parentID': item.parentWorkEffortId,
					'milestoneID': item.milestoneWorkEffortId,
					'sequenceNum': item.getRow() + 1,
					"workTypeEnumId": item.workTypeEnumId,
          			"bizFormAssoc": item.bizFormAssoc,
					'parentWorkEffortId': item.parentID,
					'milestoneWorkEffortId': item.milestoneID,
					"rootWorkEffortId": item.rootID

				})
			})
			return newData
		},
		changeTimeStamp(value) {
			if (value == null) {
				value = new Date()
			}
			return new Date(value).getTime()
		},
		changeDate(value) {
			if (value != null) {
				return new Date(value).format('yyyy-MM-dd')
			}
		},
		debounce (action,time) {
		  clearTimeout(this.lastTime)
		  this.lastTime = setTimeout(function(){
		    action()
		  },time)
		},
		filterWorkTypes(data) {
			let newData = []
			data.map(item=>{
				newData.push({
					label:item.description,
					value:item.enumId
				})
			})
			return newData
		},
		filterFormCfg(data) {
			let newData = []
			data.map(item=>{
				newData.push({
					label:item.formName,
					value:item.formId
				})
			})
			return newData
		},
	}
}

</script>
