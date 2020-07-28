<template>
	<div class="widget-image--wrapper">
  	<img class="image" :src="setUseCors(data.uri)" >
  </div>
</template>

<script>
export default {
  name:"widget-image",
  props: {
    data:Object
  },
  inject:['setUseCors'],
  methods: {

  }
}
</script>
<style lang="less">
.widget-image--wrapper{
	img{width: 100%;}
}
</style>