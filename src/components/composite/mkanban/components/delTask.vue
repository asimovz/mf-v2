<template>
	<div class="popover-page kb-menu">
		<h3 style="font-size: 14px;margin: 10px">确认删除任务</h3>
		<a class="divider"></a>	
		<div style="margin:10px;">
			<p @click="del">确认要删除当前任务吗？删除后可以从回收站查看。</p>
			<Button type="error" size="small" long style="margin:10px 0">删除</Button>
			<Button type="text" size="small" long @click="back">取消</Button>
		</div>

	</div>
</template>
<script>
import menu from "./menu"
export default {
	name: 'delTask',
	props: {
		data:Object,
	},
	data() {
		return {

		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {
		console.log(this.data)
	},
	methods: {
		back() {
			this.$parent.backComponent()
		},
		setComponent(comp) {
			this.$emit("changeComponent",comp)
		},
		del() {
			this.setComponent(menu)
		}
	}
}
</script>
<style>

</style>