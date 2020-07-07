<template>
	<div class="widget-audio--wrapper">
    <audioPlayer :options="audioOptions" />
    <slot></slot>
  </div>
</template>

<script>
import audioPlayer from '../audioPlayer'
export default {
  name:"widget-audio",
  components:{
    audioPlayer
  },
  props: {
    data: Object,
  },
  computed:{
    audioOptions() {
      return {
        muted: false,
        name: this.data.uri,
        src: this.data.uri
      }
    }
  }
}
</script>
<style lang="less">
.widget-audio--wrapper{
	width: 100%;
	display: flex;
	align-items: center;
	background-color: #f5f4f9;
	border-radius: 8px;
}
</style>