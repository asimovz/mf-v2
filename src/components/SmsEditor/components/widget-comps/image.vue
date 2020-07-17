<template>
	<div class="widget-image--wrapper">
  	<img class="image" :src="data.uri" crossorigin="*">
  </div>
</template>

<script>
export default {
  name:"widget-image",
  props: {
    data:Object
  },
}
</script>
<style lang="less">
.widget-image--wrapper{
	img{width: 100%;}
}
</style>