<template>
  <div class="audio-player">
    <audio ref="audioPlayer" v-bind="options"></audio>
    <div class="controls">
      <!-- 播放暂停 -->
      <div class="hd">
        <editor-icon class="audio-icon" :name="state.playpause === 'play' ? 'zanting' : 'bofang'" size="35" @click.native="play" />
      </div>

      <div class="bd">
        <p class="title-bar">{{options.name}}</p>
        <!-- 进度 -->
        <div
          class="progress-bar">
          <el-slider
            :show-tooltip="false"
            :step="0.001"
            :max="mediaInfo.duration"
            @input="progressChange"
            @mousedown.native="sliderMousedown"
            @mouseup.native="sliderMouseup"
            v-model="state.currentTime">
          </el-slider>
        </div>

        <!-- 时间 -->
        <div class="time-bar">
          {{state.currentTime | transTime}} / {{mediaInfo.duration | transTime}}
        </div>
      </div>

      <div
        v-show="showVolume"
        class="volume-bar">
        <div class="volume-slider">
          <el-slider
            vertical
            height="50px"
            :show-tooltip="false"
            :step="0.001"
            :max="mediaInfo.maxVolume"
            @input="volumeSlderChange"
            v-model="state.currentVolume">
          </el-slider>
        </div>
        <div>
          <editor-icon class="audio-icon" :name="state.muted ? 'yinliang' : 'yinliang'" size="16" @click.native="mutedHandler" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'AudioPlayer',
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    showVolume:{
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default () {
        return {
          src: '',
          name: ''
        }
      }
    }
  },
  data () {
    return {
      state:{
        playpausePrev: 'pause',
        playpause: 'pause',
        currentTime: 0,
        currentVolume: 1,
        muted: false
      },
      mediaInfo: {
        duration: 0,
        maxVolume: 1
      },
      timeBarInProgress:false,
      player: null
    }
  },
  filters: {
    transTime(time = 0){
      let m = parseInt(time / 60)
      let s = parseInt(time % 60)

      m = (m < 10) ? `0${m}` : m
      s = (s < 10) ? `0${s}` : s

      return `${m}:${s}`
    }
  },
  mounted () {
    this.player = this.$refs.audioPlayer
    this.player.addEventListener('play', this.playHandler, false)
    this.player.addEventListener('pause', this.pauseHandler, false)
    this.player.addEventListener('loadedmetadata', this.loadedmetadataHandler, false)
    this.player.addEventListener('canplaythrough', this.canplaythroughHandler, false)
    this.player.addEventListener('timeupdate', this.timeupdateHandler, false)

  },
  methods: {
    listenerCb(){
    },
    sliderMousedown(){
      this.timeBarInProgress = true
      this.state.playpausePrev = this.state.playpause
    },
    sliderMouseup(){
      this.timeBarInProgress = false
      // 恢复修改进度前的状态
      if(this.state.playpausePrev === 'play'){
        this.player.play()
      }
    },
    progressChange(e){
      if(this.timeBarInProgress){
        this.player.pause()
        this.player.currentTime = e
      }
    },
    play(){
      if (this.player.paused || this.player.ended){
        this.player.play()
      } else{
        this.player.pause()
      }
    },
    playHandler(){
      this.state.playpause = 'play'
    },
    pauseHandler(){
      this.state.playpause = 'pause'
    },
    mutedHandler(){
      if(this.state.currentVolume === 0) return

      this.player.muted = !this.player.muted
      this.state.muted = this.player.muted
    },
    loadedmetadataHandler(e){
      const muted = this.options.muted || false
      this.player.muted = muted
    },
    canplaythroughHandler(){
      this.state.muted = this.player.muted
      this.state.currentVolume = this.player.volume
      this.mediaInfo.duration = this.player.duration
    },
    timeupdateHandler(e){
      this.state.currentTime = this.player.currentTime
    },
    volumeSlderChange(e){
      this.state.currentVolume = e
      this.player.volume = e
      this.state.muted = this.player.muted = e === 0
    },
    dispose(){
      this.player.removeEventListener('play', this.playHandler)
      this.player.removeEventListener('pause', this.pauseHandler)
      this.player.removeEventListener('loadedmetadata', this.loadedmetadataHandler)
      this.player.removeEventListener('canplaythrough', this.canplaythroughHandler)
      this.player.removeEventListener('timeupdate', this.timeupdateHandler)
    }
  },
  beforeDestroy () {
    if (this.player) {
      this.dispose()
    }
  }
}
</script>
<style lang="scss">
.audio-player{
  width: 100%;
  color: #303133;
  background: #f3f6fe;
  position: relative;
  font-size: 14px;
  border-radius: 4px;
  .controls{
    display: flex;
    align-items: center;
    padding:10px;
    justify-content: space-between;
  }
  .title-bar{
    width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    position: absolute;
    top:0;
    left:0;
    right:0;
  }
  .time-bar{
    position: absolute;
    left:0px;
    bottom:0;
  }

  .bd{
    flex: 1;
    padding: 15px 0;
    text-align: left;
    position: relative;
    margin: 5px 15px;
  }

  .volume-bar{
    position: relative;
    &:hover{
      .volume-slider{
        display: block;
      }
    }
  }
  .volume-slider{
    display: none;
    position: absolute;
    top:0;
    transform: translate(0, -90%);
    z-index: 999;
  }
  

  .audio-icon{
    cursor: pointer;
  }

  .el-slider__runway{
    margin: 15px 0;
    background-color: #cdd1d9;
  }
  .el-slider__bar{
    background-color:#313234;
  }
  .el-slider__button-wrapper{
    top:-15px;
  }
  .el-slider__button{
    border:none;
    width:12px;
    height:12px;
    background:#313234;
  }
}
</style>