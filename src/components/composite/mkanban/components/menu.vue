<template>
	<div class="popover-page">
		<div class="kb-menu-wrap">
			<div class="kb-menu-box clearfix" :style="styles" ref="test">
				<div class="kb-menu">
					<a class="item" @click="backPage"><Icon type="arrow-left-a"></Icon> 返回</a>
					<a class="item" @click="move">移动任务</a>
					<a class="item" @click="copy">复制任务</a>
					<a class="item">归档已完成任务</a>
					<a class="divider"></a>
					<a class="item" @click="del">删除任务</a>
				</div>


				<div class="kb-menu" v-if="moveShow">
					<a class="item" @click="back"><Icon type="arrow-left-a"></Icon> 返回</a>
					<a class="divider"></a>
					<div>
						<h1>原班人马回归!《新乌龙院》曝先导预告</h1>
						<span>吴孟达携手郝劭文宋小宝 组成"乌龙天团"</span>
					</div>
				</div>

				<div class="kb-menu" v-if="copyShow">
					<a class="item" @click="back">返回</a>
					<a class="divider"></a>
					<div>
						<h1>"侏罗纪世界2"韩国10小时破百万人次</h1>
						<span>赶超《复仇者联盟3》 首日破百万史无前例</span>

					</div>
				</div>

				<div class="kb-menu" v-if="delShow">
					<h3 style="font-size: 14px;margin: 10px">确认删除任务</h3>
					<a class="divider"></a>	
					<div style="margin:10px">
						<p>确认要删除当前任务吗？删除后可以从回收站查看。</p>
						<Button type="error" size="small" long style="margin:10px 0" @click="delTask">删除</Button>
						<Button type="text" size="small" long @click="back">取消</Button>
					</div>


				</div>

			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'menu',
	props: {
		data:Object
	},
	data() {
		return {
			moveShow: true,
			copyShow: true,
			delShow: true,
			animate_width: 0
		}
	},
	computed: {
		styles() {
			return {
				transform: "translateX("+this.animate_width+")"
			}
		}
	},
	created: function() {

	},
	mounted: function() {

	},
	methods: {
		backPage() {
			this.$parent.backComponent()
		},
		delTask() {
			let _root = this.$parent.vueRoot
			let data = {
				taskListId: this.data.taskListId,
				taskId: this.data.taskId
			}
			_root.eventBus.$emit('kb_remove_task_'+this.data.taskListId,data)
			this.$parent.handleClose()
		},
		move() {
			this.moveShow = true
			this.animate_width = '-100%'
		},
		copy() {
			this.copyShow = true
			this.animate_width = '-100%'
		},
		del() {
			this.delShow = true
			this.animate_width = '-100%'
		},
		back() {
			this.animate_width = 0
			setTimeout(()=>{
				this.moveShow = false
				this.copyShow = false
				this.delShow = false
			},300)
		}
	}
}
</script>
<style>

.kb-menu-box {
	display: flex;
	flex-direction: row;
	transition: all .15s ease-out;
}
.kb-menu {
	width: 100%;
	display: block;
	flex-shrink: 0
}
.kb-menu .item {
	display: block;
	height: 36px;
	line-height: 36px;
	padding: 0 16px;
	color: #383838;
	cursor: pointer;
	transition: padding .2s ease-out
}
.kb-menu .item:hover {
	background-color:#F1F1F1;
	padding-left: 22px;
}
</style>