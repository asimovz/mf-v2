<template>
	<div class="widget-video--wrapper">
    <videoPlayer class="video-player"
      ref="videoPlayer"
      :hoverPlay="hoverPlay"
      :pointerEvents="false"
      :options="videoOptions" />

    <div class="video-poster">
      <img :src="data.poster">
      <span class="video-playBtn"></span>
    </div>
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
  watch: {
    'data.poster': {
      handler(val){
        this.$nextTick(() => {
          this.$refs.videoPlayer.showPoster()
        })
      }
    }
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
.video-poster{display: none;position: relative;
  img{width: 100%;max-height: 160px;object-fit: contain;background-color: #000;}
  .video-playBtn{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid #fff;
    border-radius: 100%;
    width: 50px;
    height: 50px;
    line-height: 50px;
    background: rgba(43, 51, 63, 0.7);
    &:before{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: "\F101";
      font-family: VideoJS;
      font-size: 30px;
      font-weight: normal;
      font-style: normal;
      text-align: center;
      color: #fff;
    }
  }
}
</style>