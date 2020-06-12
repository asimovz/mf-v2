<template>
	<Tooltip :content="status.alt" placement="top" v-if="!status.nohandle">
		<span class="icon" :style="styles" v-if="!status.nohandle"  @click="changeSubTaskStatus">
			<Icon :type="status.icon"></Icon>
		</span>
	</Tooltip>
</template>
<script>
import {statusIcon} from '../config'
export default {
	name:'subtask-status',
	props: {
		type: String
	},
	data() {
		return {
			
		}
	},
	computed: {
		status() {
			return  statusIcon[this.type]
		},
		styles() {
			return {
				borderColor:this.status.color,
				color:this.status.color
			}
		}
	},
	created: function() {

	},
	mounted: function() {
	},
	methods: {
		changeSubTaskStatus() {
			// this.status = this.status.next
			let data = {
				status:this.status.next,
				time:this.status.time
			}
			this.$emit("changeSubTaskStatus",data)
		},
	}
}
</script>
<style>
	
</style>