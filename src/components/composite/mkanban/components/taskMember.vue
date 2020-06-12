<template>
	<span data-popover="addTask" @click="selectPerson">
		<span v-if="executor.length==0" class="icon" ><Icon type="android-person"></Icon></span>
		<template v-for="(member,index) in executor">
			<span  :class="['text','noText',{'noHandle':!handle||!del}]">
				<span  class="user-avatar" :style="{'backgroundColor':member.background}">
					<span class="avatar-name">{{moqui.shortName(member.name)}}</span>
				</span>
				<a v-if="del" @click.stop="delMember(index)"><Icon  class="del" type="close-round"  ></Icon></a>
			</span>
		</template>
	</span>
</template>
<script>
import member from './member'
export default {
	name:'task-select-member',
	props: {
		executor: Array,
		multi:{
			type: Boolean,
			default: false
		},
		handle:{
			type: Boolean,
			default: true
        },
		del:{
			type: Boolean,
			default: true
        },
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

	},
	watch: {

	},
	methods: {
		selectPerson(event) {

			if(this.handle) {
				//添加新任务的时候，点击禁止任务表单消息
				// this.$parent.isHandle = true

				this.$popover(event,{
					component:member,
					data: {
						multi:this.multi,
						executor:this.executor,
						eventId: this.parentId,
						projectId: this.$parent.projectId,
						transition: this.$parent.transition,
						add: this.setMember,
						del: this.on_del
					}
				})
			}

		},
		setMember(value) {
			this.$emit("on-set",value)
		},

		delMember(index) {
			let data = this.executor[index]
			this.executor.splice(index,1)
			this.on_del(data)
		},

		on_del(value) {
			this.$emit("on-del",value)
		},
	}
}
</script>
<style>
	
</style>