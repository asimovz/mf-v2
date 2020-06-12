<template>
	<div class="event-detail">
		<m-loading v-if="isLoading"></m-loading>
		{{content}}
	</div>
</template>
<script>
export default {
	name:'',
	props: {
		data: Object
	},
	data() {
		return {
			isLoading: true,
			content:''
		}
	},
	computed: {

	},
	created: function() {

	},
	mounted: function() {
		let http = this.$http
		let url = this.data.url
		http.get(url).then(response => {
			this.content = response.data
			this.isLoading = false
		},error => {

		})
		
	},
	methods: {

	}
}
</script>
<style>
.event-detail {
	width: 400px;
	line-height: 22px;
	padding:10px;
}
.event-detail h5 {
	margin-bottom: 10px
}
</style>