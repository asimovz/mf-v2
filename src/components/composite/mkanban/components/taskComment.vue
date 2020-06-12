<template>
	<div style="margin:-12px -18px;padding:12px 18px">
	<div :class="['task-comment-add-body',{'task-comment-add-body-height':isComment}]">
		<div class="comment-height">
			<span class="user-avatar" :style="{'backgroundColor':operator.background}">
				<span class="avatar-name">{{moqui.shortName(operator.name)}}</span>
			</span>
		</div>
		
		<div class="comment-edit wrap comment-height" >
			<textarea v-model="content" class="edit-text" ref="comment" type="textarea" :placeholder="placeholder" @focus="editComment"></textarea>
			<div style="margin-top: 10px" v-if="isComment">
				<Button type="text" size="small" @click.native="cancelComment">取消</Button> <Button size="small" type="primary"  @click.native="saveComment">保存</Button> 
			</div>
		</div>
	</div>
	</div>
</template>
<script>
export default {
	name:'task-comment',
	props: {
		data: Object
	},
	data() {
		return {
			isComment: false,
			content:'',
			isReply: false,
			replyData: null,
			reContent:'',
			operator: this.$root.operator
		}
	},
	computed: {
		placeholder: {
			get() {
				return this.reContent == '' ? '评论内容' : this.reContent
			},
			set(value) {
				return value
			}
			
		}
	},
	created: function() {

	},
	mounted: function() {

		this.$root.eventBus.$on('kb_comment_reply',(data)=>{
			this.isComment = true
			this.isReply = true
			this.replyData = data
			this.reContent = '回复：' + data.comment.name
			setTimeout(()=>{
				this.$refs.comment.focus()
				document.addEventListener('click', this.documentHandle)
			},10)
		})
	},
	methods: {
		editComment(event) {
			this.isComment = true
			document.addEventListener('click', this.documentHandle)
		},
		cancelComment(event) {
			this.isComment = false
			this.content = ''
			this.reContent = ''
			this.isReply = false
			this.replyData = null
			document.removeEventListener('click', this.documentHandle)

		},
		saveComment() {
			let params = {
				taskId:this.data.taskId,
				content:this.content,
				createTime:this.moqui.getNowDate(),
				creator:{
					"uid":this.$root.operator.uid,
					"name":this.$root.operator.name,
					"background": this.operator.background
				},
				reply:[],
				mention:{}
			}
			if(this.isReply) {
				params.rootCommEventId = this.replyData.rootCommEventId
				params.parentCommEventId = this.replyData.parentCommEventId
				params.index = this.replyData.index
				params.mention = this.replyData.comment
			} 
			this.$root.eventBus.$emit("kb_task_comment_add",params)
			this.cancelComment()
		},
		documentHandle(event) {
			let isOf = this.$el.contains(event.target)
			if(!isOf) {
				this.cancelComment()
			}
		}
	},
	destroyed:function(){
		this.$root.eventBus.$off("kb_comment_reply")
	}
}
</script>
<style>

.task-comment-add-body {
	display: flex;
	align-items: flex-end;
	height: 30px;

}
.task-comment-add-body-height {
	height: 120px;
	transition: height .2s
}
.task-comment-add-body .wrap {
	width: 94%;
}
.task-comment-add-body .comment-height {
	height: 100%
}
.task-comment-add-body .user-avatar {
	margin-top: 3px;
	margin-right: 10px;
}
.task-comment-add-body .comment-text {
	padding:5px;
	border: 1px solid #dddee1;
	border-radius: 3px;
	height: 30px;
	text-align: left;
}
.task-comment-add-body .edit-text {
	width: 100%;
	height: 100%;
	padding:5px;
	border: 1px solid #dddee1;
	border-radius: 3px;
	text-align: left;
	outline: none;
	resize: none;
}
.task-comment-add-body .edit-text:focus {
	background: none
}
.task-comment-add-body-height .edit-text {
	height: 70%;
}
</style>