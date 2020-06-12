<template>
	<div class="column-creator">
		<a @click="isAdd=!isAdd" class="add" v-show="!isAdd">新建任务列表...</a>
		<div class="creator-wrap" v-show="isAdd">
			<Input v-model="value" placeholder="新建任务列表..." class="column-name"></Input>
			<div class="buttons"><Button @click="isAdd=false" type="text" size="small">取消</Button> <Button size="small" type="primary" @click.native="saveColumn">保存</Button></div>
		</div>
	</div>
</template>
<script>
export default {
	name:'add-column',
	props: {

	},
	data() {
		return {
			value:'',
			isAdd: false
		}
	},
	computed: {

	},
	created: function() {
		

	},
	mounted: function() {
	},
	methods: {
		saveColumn() {
			if(this.value == "") return
			let parent = this.$parent
			let projectID = parent.id
			let maxLength = parent.columnList.length-1
			let column = document.getElementById(parent.board_view).getElementsByClassName(parent.class_board_column)[maxLength]
			let newPosition = Number(column.dataset.position) + 1
			let param = {
				projectId:projectID,
				name:this.value,
				position:newPosition,
				isNew: true
			}
			parent.columnList.push(param)
			this.value = ""
			this.isAdd = false
		}
	}
}
</script>
<style>

</style>