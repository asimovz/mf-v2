<template>
	<div class="task" :data-id="data.id" @click="showTaskModal">
		<span :class="['task-priority',classPriority]" :data-popover="data.id"  @click.stop="setTaskPriority"></span>
		<div class="task-progress">
			<i-Circle :size="28" :stroke-color="circleColor" :stroke-width="10" :percent="data.percentComplete">
				<span class="inner-text">{{data.percentComplete}}</span>
			</i-Circle>
		</div>
		<div class="task-title">{{data.content}}</div>
		<div class="task-main" >
			<div class="task-pic">
				<img :src="imgUrl" alt="">
			</div>
			<div class="task-content">
				<!-- <span>任务类型：{{data.taskType}}</span> -->
				<span>设计编号：{{designNumber}}</span>
				<span>款号：{{pseudoId}}</span>
				<span>款式名称：{{productName}}</span>
			</div>
		</div>
		<div class="task-tags">
			<div>{{data.desc}}</div>
			<div class="iconTitle" v-if="data.estimatedStartDate!=''">
				计划时间：<span class="work-time">{{data.estimatedStartDate}} <span v-if="data.estimatedCompletionDate!=''">~</span> {{data.estimatedCompletionDate}}</span>
			</div>
			<div class="iconTitle" v-if="data.actualStartDate!=''">
				实际时间：<span class="work-time">{{data.actualStartDate}} <span>~</span> {{data.actualCompletionDate}}</span>
			</div>

		</div>

		<div class="task-footer clearfix" style="color:#cbcbcb; display:; margin-top: 8px">
			<div class="task-creator fl" >
				<span class="item">
					<Icon class="icon" type="android-person" size="15"></Icon>{{data.executor.name}}
				</span>
			</div>
			<div class="task-info fr tr">
				<span class="item">
					<Icon class="icon" type="social-buffer" size="15"></Icon>{{data.finishedSubCount}}/{{data.allSubTaskCount}}
				</span>
<!-- 				<span class="item">
					<Icon class="icon" type="android-attach" size="15"></Icon>1
				</span> -->
<!-- 				<span class="item">
					<Icon :class="['icon',{'task-like':data.islike}]" type="android-favorite" size="15"></Icon>
					<span :class="[{'task-like':data.islike}]" v-show="data.likeCount>0">{{data.likeCount}}</span>
				</span>  -->
				<!-- <span class="item" @click.stop="setTaskMenu" :data-popover="data.id">
					<Icon class="icon" type="more" size="18"></Icon>
				</span> -->
			</div>
		</div>
		
	</div>
</template>

<script>
import priority from './components/priority'
import taskMenu from './components/taskMenu'
import menu from './components/menu'

export default {
	name:'board-task',
	props: {
		data:Object,
		index:Number
	},
	data() {
		return {

		}
	},
	inject:['setCircleColor'],
	computed: {
		classPriority() {
			return 'task-priority-' + this.data.priority
		},
		circleColor() {
			return this.setCircleColor(this.data.percentComplete)
		},
		designNumber() {
			return this.data.product ? this.data.product.designNumber : ''
		},
		pseudoId() {
			return this.data.product ? this.data.product.pseudoId : ''
		},
		productName() {
			return this.data.product ? this.data.product.productName : ''
		},
		imgUrl() {
			return this.data.product && this.data.product.imgLocation ? this.getImageUrlPath('displayImageByLocation',this.data.product.imgLocation):'/images/noPic.png'
		},
	},
	created: function() {
	},
	mounted: function() {
		this.$root.eventBus.$on("kb_task_like_"+this.data.id,(data)=>{
			this.data.islike = data
			if(this.data.islike) {
				this.data.likeCount++
			} else {
				this.data.likeCount--
			}
		})
		this.$root.eventBus.$on("kb_task_priority_"+this.data.id,(data)=>{
			this.data.priority = data
		})
		this.$root.eventBus.$on("kb_task_executor_set"+this.data.id,(data)=>{
			this.data.executor = data
		})			
		this.$root.eventBus.$on("kb_task_executor_del"+this.data.id,(data)=>{
			this.data.executor = {}
		})
		this.$root.eventBus.$on("kb_task_content_set"+this.data.id,(data)=>{
			this.data.content = data
		})
		this.$root.eventBus.$on("kb_task_percent_set"+this.data.id,(data)=>{
			this.data.percentComplete = data
		})

	},
	methods: {
		ajaxHandler(postParams,opt) {
			this.$root.$http.post(this.$parent.transition,postParams).then(response => {
				if(response.data && response.data.result=='success'){
					let message = ''
					switch(opt) {
						case 'saveTaskPriority':
							message = '优先级保存成功！'
						break;
						case 'setTaskLike':
							message = '点赞成功！'
						break;
						case 'setTaskUnlike':
							message = '取消点赞成功！'
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

		showTaskModal() {
			
			let param = {
				taskId: this.data.id,
				taskListId: this.data.taskListId,
				projectName: this.$parent.parentTilte,
				taskListName: this.$parent.name,
				index:this.index,
				taskCard: this.data
			}
			this.$root.eventBus.$emit("kb_edit_task",param)
		},

		setTaskMenu(event) {
			this.$popover(event,{
				component:taskMenu,
				data: {
					priority:this.data.priority,
					taskListId: this.data.taskListId,
					taskId:this.data.id
				}
			})
		},

		getImageUrlPath(transition ,imgLocation){
			let url = document.location.toString()
			let arrUrl = url.split("//")
			let start = arrUrl[1].indexOf("/")
			//stop省略，截取从start开始到结尾的所有字符
			let relUrl = arrUrl[1].substring(start)
			let orginParams = ''
			if(relUrl.indexOf("?") != -1){
				orginParams = relUrl.split("?")[1];
				relUrl = relUrl.split("?")[0];
			}
			relUrl = relUrl.replace('coapps','apps')
			relUrl += '/' + transition + '?' + orginParams + '&imgLocation='+imgLocation
			return relUrl;
		},

		setTaskPriority(event) {
			this.$popover(event,{
				component:priority,
				data: {
					priority:this.data.priority,
					taskListId: this.data.taskListId,
					taskId:this.data.id,
					add: this.saveTaskPriority
				}
			})
		},

		saveTaskPriority(value) {
			this.data.priority = value
			let postParams = {
				"cmd":"storeWorkEffort",
				"workEffortId": this.data.id,
				"priority": value
			}
			this.ajaxHandler(postParams,'saveTaskPriority')
		}
	},

	destroyed:function(){
		this.$root.eventBus.$off("kb_task_like_"+this.data.id)
		this.$root.eventBus.$off("kb_task_priority_"+this.data.id)
		this.$root.eventBus.$off("kb_task_executor_set"+this.data.id)
		this.$root.eventBus.$off("kb_task_executor_del"+this.data.id)
		this.$root.eventBus.$off("kb_task_content_set"+this.data.id)
		this.$root.eventBus.$off("kb_task_percent_set"+this.data.id)
	}
}
</script>
<style>


</style>














