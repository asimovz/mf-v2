<template>
    <div id="current-page-root"><h4>Screen not found at {{currentPath}}</h4></div>
</template>

<script>
export default {
	name: 'notFound',
	data () {
		return {
			currentPath: this.$root.currentPath
		}
	}
}
</script>
