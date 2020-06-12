<template>
	<div class="popover-page kb-menu">
		<a class="item">重命名</a>
		<a class="item">在此后新建列表</a>
		<a class="item">移动列表</a>
		<a class="item">复制列表</a>
		<a class="divider"></a>
		<a class="item">归档已完成任务</a>
		<a class="item">设置本列所有任务执行人</a>
		<a class="item">设置本列所有任务截止时间</a>
		<a class="item">设置本列所有任务标签</a>
		<a class="item">本列所有任务移到回收站</a>
		<a class="divider"></a>
		<a class="item"  @click="del">删除列表</a>
	</div>
</template>
<script>

export default {
	props: {
		data:Object
	},
	data() {
		return {
		}
	},
	methods: {
		setComponent(comp) {
			this.$emit("changeComponent",comp)
		},
		del() {
			this.setComponent(delTask)
		}
	}
}
</script>
<style>


</style>