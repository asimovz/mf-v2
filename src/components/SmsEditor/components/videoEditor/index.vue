<template>
<el-dialog width="1100px" class="videoConf" title="视频编辑" :visible.sync="_visible" @close="close" @open="dialogOpened" append-to-body>
  <el-row :gutter="20">
    <el-col class="player-wrap" :span="14">
      <videoPlayer
        ref="videoPlayer"
        showMediaInfo
        showFastBtns
        v-model="mediaInfo"
        :options="videoOptions"
        :extraData="extraData"
      >
          <watermarkHandler
          v-model="dragRect"
          v-if="watermarkVisible"
          :options="watermarkOpts"
          @img-rect-change="imgRectChange" />
      </videoPlayer>
    </el-col>

    <el-col :span="10">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 视频剪辑 -->
        <el-tab-pane label="视频剪辑" name="crop">
          <videoConfCrop
            @range-change="rangeChange"
            @complete="cropComplete"
          />
        </el-tab-pane>

        <!-- 转码压缩 -->
        <el-tab-pane label="转码压缩" name="transcode">
          <videoConfTranscode @complete="transComplete" />
        </el-tab-pane>

        <!-- 水印设置 -->
        <el-tab-pane label="水印设置" name="watermark">
          <videoConfWatermark
            ref="refWatermark"
            v-model="watermarkOpts"
            :dragRect="dragRect"
            :imgRect="imgRect"
            @complete="watermarkComplete" />
        </el-tab-pane>

        <!-- 封面设置 -->
        <el-tab-pane label="封面设置" name="poster">
          <videoConfPoster @poster-change="posterChange" />
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
  <div slot="footer" class="dialog-footer" style="padding: 10px 0 20px">
    <el-button size="small" @click="close">取消</el-button>
    <el-button size="small" type="primary" @click="save">保存</el-button>
  </div>
</el-dialog>
</template>

<script>
import videoPlayer from '../videoPlayer'
import {
  videoConfCrop,
  videoConfTranscode,
  videoConfWatermark,
  videoConfPoster,
  watermarkHandler
  } from './components'

export default {
  name: 'videoConf',
  components: {
    videoPlayer,
    videoConfCrop,
    videoConfTranscode,
    videoConfWatermark,
    videoConfPoster,
    watermarkHandler
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    videoDialogId: {
      default: ''
    },
    mediaData: {
      type: Object,
      default () {
        return {
          // src: 'mp4',
          // poster: ''
        }
      }
    }
  },
  data () {
    return {
      dragRect: {},
      imgRect: {},
      // 需要同步的媒体信息
      mediaInfo: {},
      watermarkOpts: {},
      activeName: 'crop',
      videoPlayer: null, // 播放器实例,

      extraData: null
    }
  },
  computed: {
    watermarkVisible(){
      if(this.activeName === 'watermark'){
        const {type, img, text} = this.watermarkOpts
        if(type === 'text' && text !== ''){
          return true
        } else if (type === 'image' && img !== ''){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    _visible: {
      get () {
        return this.visible
      },
      set () {}
    },
    videoOptions () {
      return {
        autoplay: false,
        poster: this.mediaInfo.poster,
        sources: [
          {src: this.mediaInfo.uri, type: 'video/mp4'}
        ]
      }
    },
    // src (){
    //   return this.mediaInfo.uri
    // }
  },
  watch:{
    // src(){
    //   // this.watermarkOpts = {} 
    // },
    _visible(v){
      if(!v || !this.$refs.refWatermark) return
      this.activeName = 'crop'
      this.watermarkOpts = {}
      this.$refs.refWatermark.init()
    },
    mediaData: {
      deep: true,
      handler(v){
        for(let key in v){
          this.$set(this.mediaInfo, key, v[key])
        }
      }
    }
  },
  provide () {
    return {
      confContainer: this
    }
  },
  methods: {
    imgRectChange(v){
      this.imgRect = v
    },
    dialogOpened(){
      this.$nextTick(() => {
        this.videoPlayer = this.$refs.videoPlayer
      })
    },
    handleClick (e) {
      if (e.name === 'poster') {
        this.videoPlayer.showPoster()
      } else {
        this.videoPlayer.hidePoster()
      }
    },
    rangeChange (res) {
      this.mediaInfo.currentTime = res.currentTime
    },
    cropComplete (res) {
      this.mediaInfo.uri = res.uri
    },
    transComplete ({data, uri}) {
      this.mediaInfo.uri = uri
      this.extraData = data
    },
    watermarkComplete (res) {
      console.log(res.uri)
      this.mediaInfo.uri = res.uri
    },
    posterChange (res) {
      if(!this.videoPlayer) return

      this.mediaInfo.poster = res.poster
      this.videoPlayer.showPoster()
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      this.$emit('on-save', {
        newData: this.mediaInfo
      })
      this.close()
    }
  }
}
</script>

<style lang="scss">
.videoConf{
  padding:16px;

  .player-wrap{
    position: relative;
  }
  
  .btn-wrap{
    padding-top: 20px;text-align: right;
    .el-button{
      margin-right: 8px;
      &+.el-button{
        margin-left: 0;
      }
    }
  }
}
</style>