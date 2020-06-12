<template>
  <Panel ref="panel" :name="name" :hide-arrow="hideArrow">
		<slot></slot>
		<slot name="content" slot="content"></slot>
	</Panel>
</template>

<script>
export default {
  name: "m-colPanel",
  props: {
    name: {
      type: String,
		},
		hideArrow: {
			type: Boolean,
			default: false
		}
	},
	inject:['toggle'],
	data() {
		return {
			isActive:false
		}
	},
	watch: {
		isActive(newVal) {
			this.$refs.panel.isActive = newVal
		}
	}
};
</script>
