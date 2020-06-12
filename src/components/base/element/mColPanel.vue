<template>
  <el-collapse-item ref="panel" :name="name">
		<slot name="title" slot="title"></slot>
		<slot></slot>
	</el-collapse-item>
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
	data() {
		return {
			isActive:false
		}
	}
};
</script>
