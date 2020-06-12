<template>
	<div class="popover-page kb-menu">
		<h3 class="title">任务菜单</h3>
		<a class="divider"></a>	
		<a class="item" @click="move"><Icon class="icon" size="18" type="ios-download-outline"></Icon> 移动任务</a>
		<a class="item" @click="archive"><Icon type="ios-folder-outline" class="icon"></Icon> 归档任务</a>
	</div>
</template>
<script>
import taskMove from "./taskMove"
import taskArchive from "./taskArchive"
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
		move() {
			this.setComponent(taskMove)
		},
		archive() {
			this.setComponent(taskArchive)
		}
	}
}
</script>
