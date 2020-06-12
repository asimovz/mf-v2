<template>
	<div class="kb-priority">
		<div class="title">优先级</div>
		<ul class="priority-list">
			<template v-for="item in list">
				<li @click="changPriority(item.value)"><span>{{item.name}}</span><Icon v-if="currentValue == item.value" size="16" color="#999" class="current" type="checkmark"></Icon></li>
			</template>

		</ul>
	</div>
</template>
<script>
export default {
	props: {
		data:Object
	},
	data() {
		return {
			currentValue: this.data.priority,
			list: [{name:'高',value:3},{name:'中',value:2},{name:'低',value:1}]
		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {

	},
	methods: {
		changPriority(num) {
			// let _root = moquiVue
			let _root = this.$parent.vueRoot
			this.currentValue = num
			this.data.add(num)
			this.$parent.handleClose()
		}
	},
	destroyed:function() {
		let _root = this.$parent.vueRoot
		_root.eventBus.$off('kb_changPriority_'+this.data.tasklistId)
	}
}
</script>
<style>
.kb-priority {
	min-width: 150px;
	padding-bottom: 15px;
}
.kb-priority .title {
	padding:10px;
	font-size: 14px;
	font-weight: 700;
	display: block
}
.priority-list li{
	height: 40px;
	line-height: 40px;
	list-style: none;
	position: relative;
	cursor: pointer;
}
.priority-list li:hover{
	background-color:#F1F1F1
}

.priority-list  .current {
	position: absolute;
	right: 10px;
	top: 13px
}

.priority-list span {
	display: inline-block;
	padding: 4px 8px;
    font-size: 12px;
    line-height: 16px;
    border:1px solid #ccc;
    text-align: center;
    margin-left: 15px;
}

</style>