<template>
	<div class="widget-video--wrapper">
    <videoPlayer
      ref="videoPlayer"
      :hoverPlay="hoverPlay"
      :pointerEvents="false"
      :options="videoOptions" />
  </div>
</template>

<script>
import videoPlayer from '../videoPlayer'
export default {
  name:"widget-video",
  components:{
    videoPlayer
  },
  props: {
    data: {
      type: Object,
      default(){
        return {}
      }
    },
    showControls:{
      type: Boolean,
      default: true
    },
    hoverPlay:{
      type: Boolean,
      default: false
    }
  },
  mounted(){
    this.$refs.videoPlayer.replay()
  },
  computed:{
    videoOptions(){
      return {
        autoplay: false,
        controls:this.showControls,
        poster: this.data.poster,
        preload: 'metadata',
        muted: false,
        sources: [
          {src: this.data.uri, type: 'video/mp4'}
        ]
      }
    }
  }
}
</script>

<style lang="less">
.widget-video--wrapper {
  width: 100%;
}
</style>