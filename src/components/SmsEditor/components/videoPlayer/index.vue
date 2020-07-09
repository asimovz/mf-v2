<template>
  <div
    @mouseover="hoverOver"
    @mouseout="hoverOut"
    class="video-player">
    <video
      ref="videoPlayer"
      class="video-js"
      :class="{pointerEvents: pointerEvents}">
    </video>
    <slot />
    <div class="video-info" v-if="showMediaInfo">
      <div><label>视频大小</label> {{mediaInfo.size}}Kb</div>
      <div><label>视频码率</label> {{mediaInfo.videoBit}}Kbps</div>
      <div><label>音频码率</label> {{mediaInfo.musicBit}}Kbps</div>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js'
import zhCN from 'video.js/dist/lang/zh-CN.json'
import 'video.js/dist/video-js.css'
import './themes/custom.scss'
import './components'

export default {
  name: 'VideoPlayer',
  inject: {
    mmsConfig: 'mmsConfig'
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    hoverPlay: {
      type: Boolean,
      default: false
    },
    pointerEvents: {
      type: Boolean,
      default: true
    },
    showMediaInfo: {
      type: Boolean,
      default: false
    },
    showFastBtns: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default () {
        return {
          src: ''
        }
      }
    },
    extraData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      mediaInfo: {
        musicBit: 0,
        videoBit: 0,
        size: 0,
        playerWidth: 0,
        playerHeight: 0,
        videoWidth: 0,
        videoHeight: 0,
        renderWidth: 0,
        renderHeight: 0,
        duration: 0,
        currentTime: 0,
        uri: '',
        poster: ''
      },
      baseOpts: {
        autoplay: 'play', // 自动播放（非静音情况下，无效， chrome默认禁止在非用户允许的情况下播放声音）
        muted: true, // 静音
        controls: true, // 显示控件
        preload: 'metadata', // 预加载
        fluid: true, // 流式布局（自适应）
        aspectRatio: '16:9',
        languages: {
          'zh-CN': zhCN
        },
        language: 'zh-CN',
        userActions: {
          doubleClick: false
        }
      },
      player: null,
      PosterImage: null
    }
  },
  computed: {
    sourceStr () {
      return this.mediaInfo.uri + JSON.stringify(this.options.sources)
    },
    currentTime () {
      return this.value.currentTime
    },
    videoSize(){
      const {playerWidth, playerHeight, videoHeight, videoWidth} = this.mediaInfo
      return `${playerWidth}${playerHeight}${videoHeight}${videoWidth}`
    },
  },
  watch: {
    sourceStr (v,ov) {
      this.replay()
    },
    currentTime (v) {
      this.gotoTime(v)
    },
    videoSize(){
      this.getRenderSize()
    },
    mediaInfo: {
      deep: true,
      handler (v) {
        this.$emit('input', v)
      }
    }
  },
  created () {
    // 注册钩子
    videojs.hook('beforesetup', this.beforesetup)
    videojs.hook('setup', this.setup)

    this.mediaInfo.uri = this.options.sources[0].src
    this.mediaInfo.poster = this.options.poster
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const _this = this
      this.player = videojs(this.$refs.videoPlayer, this.baseOpts, function () {
        _this.mediaInfo.playerWidth = parseInt(this.currentWidth())
        _this.mediaInfo.playerHeight = parseInt(this.currentHeight())
      })

      // 注册缓冲完成事件
      this.player.on('loadedmetadata', this.loadedmetadataHandler)

      this.PosterImage = this.player.getChild('PosterImage')

      // 添加按钮
      if (this.showFastBtns) {
        this.player.getChild('controlBar').addChild('NextTimeButton', {}, 1)
        this.player.getChild('controlBar').addChild('PrevTimeButton', {}, 1)
      }
    },
    pause(){
      this.player.pause()
    },
    /**
     * 跳转到时间节点
     * @param {number} - 时间点
     */
    gotoTime (time) {
      if (!this.player) return
      this.player.pause()
      this.player.currentTime(time)
    },
    /**
     * 缓冲完成事件
     */
    loadedmetadataHandler () {
      this.mediaInfo.videoWidth = this.player.videoWidth()
      this.mediaInfo.videoHeight = this.player.videoHeight()
      this.mediaInfo.duration = parseInt(this.player.duration())
    },
    /**
     * 预览裁剪区域
     * @param {array} - 裁剪区域的时间范围数组
     */
    cropPreview (range) {
      const [startTime, endTime] = range

      this.player.currentTime(startTime)
      this.player.play()

      const timer = setInterval(() => {
        const currentTime = this.player.currentTime()
        if (currentTime >= endTime) {
          this.player.pause()
          clearInterval(timer)
        }
      }, 500)
    },
    /**
     * 重新读取配置播放
     */
    replay () {
      this.player.src(this.options.sources)
      this.player.autoplay(this.options.autoplay)
      this.player.poster(this.options.poster)
      this.player.load()

      // 重新获取视频信息
      this.showMediaInfo && this.getVideoInfo()
    },
    /**
     * 显示隐藏封面
     */
    showPoster () {
      this.$nextTick(() => {
        this.player.pause()
        this.player.poster(this.options.poster)
        this.PosterImage.show()
        // this.player.load()
      })
    },
    hidePoster () {
      this.PosterImage.hide()
    },
    // 钩子函数
    beforesetup (videoEl, options) {
      return Object.assign({}, options, this.options)
    },
    hoverOver(){
      if(!this.player || !this.hoverPlay) return
      this.player.play()
    },
    hoverOut(){
      if(!this.player || !this.hoverPlay) return
      this.player.pause()
    },
    setup (player) {
      // console.log(player)
    },
    getRenderSize(){
      // 增加实际渲染视频大小
      const {playerWidth, playerHeight, videoHeight, videoWidth} = this.mediaInfo

      const ratio = videoWidth / videoHeight

      if (playerWidth / ratio > playerHeight) {
        this.mediaInfo.renderWidth = parseInt(playerHeight * ratio)
        this.mediaInfo.renderHeight = playerHeight
      } else {
        this.mediaInfo.renderWidth = playerWidth
        this.mediaInfo.renderHeight = parseInt(playerWidth / ratio)
      }
    },
    async getVideoInfo(){
      try {
        let resData = {}
        const uri = this.options.sources[0].src

        const { dbs, currentData } = await this.getLocalVideoInfo(uri)

        if(currentData){
          resData = currentData
        } else {
          const {nodeUrl, videoInfo} = this.mmsConfig
          
          const { data } = await this._http(`${nodeUrl}${videoInfo}`,{
            uri,
            extra: this.extraData
          })
          resData = data

          dbs[uri] = data
          sessionStorage.setItem('localVideosInfo', JSON.stringify(dbs))
        }

        this.mediaInfo.size = parseInt(resData.size / 1024)
        this.mediaInfo.musicBit =  parseInt(resData.musicBit / 1000)
        this.mediaInfo.videoBit = parseInt(resData.videoBit / 1000)
        this.mediaInfo.duration = parseInt(resData.duration)
        this.mediaInfo.videoHeight = resData.height
        this.mediaInfo.videoWidth = resData.width

      } catch (err) {
        console.log(err)
      }
    },
    async getLocalVideoInfo(uri){
      const str = sessionStorage.getItem('localVideosInfo') || '{}'
      const dbs = JSON.parse(str)

      return {
        dbs: dbs,
        currentData: dbs[uri]
      }
    }
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style lang="scss">
.video-player{
  background: #fff;
  position: relative;
  overflow: hidden;
  .video-js{
    .vjs-control-bar{
      height: 30px;
    }
    .vjs-tech {
      pointer-events: none;
    }
    &.pointerEvents{
      .vjs-tech {
        pointer-events: auto;
      }
    }
    &.vjs-playing{
      .vjs-poster{
        display: none!important;
      }
    }
    &.vjs-has-started{
      .vjs-poster{
        display: inherit;
      }
    }
  }
  .video-info{
    font-size: 12px;
    color: #1f292e;
    display: flex;
    padding:1em 15px;
    align-items: center;
    background-color: #F2F6FC;
    box-shadow: 0 5px 10px rgba(0,0,0,.08);
    label{
      color:#999;
      padding-right: .2em;
    }
    div{
      padding-right: 3em;
    }
  }
}
</style>