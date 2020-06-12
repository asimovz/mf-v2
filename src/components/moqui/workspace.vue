<template>
	<div class="workspace">
		<div v-for="item in modules">
			<div class="workspace-item" v-for="child in item">
				<component :is="child.module"></component>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name:'workspace',
	props: {
		option: Array
	},
	data() {
		return {
			modules: [
			    [
			        {
			            module:'tastOrder',
			            interface:'url'
			        },
			        {
			            module:'tastList',
			            interface:'url'
			        }
			    ],
			    [
			        {
			            module:'myProject',
			            interface:'url'
			        }
			    ]

			]
		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {

	},
	methods: {

	}
}
</script>
<style>
.workspace {
	display: flex;
	margin-top: -40px;
}
.workspace > div {
	flex: 1;
	height: 400px;
	margin-right: 15px;
}
.workspace > div:first-child {
	flex:1.5;
}
.workspace > div:last-child {
	margin-right: 0;
}
.workspace .workspace-item {
	box-shadow:2px 2px 7px rgba(239, 239, 239, 0.5);
	background: #FFF;
	margin-bottom: 15px;
	padding:30px;
}

</style>