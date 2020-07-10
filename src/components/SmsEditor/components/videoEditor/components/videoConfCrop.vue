<template>
  <div class="videoConfCrop">
    <div class="range-slider">
        <div>0s</div>
        <div class="hd">
          <el-slider v-model="timeRange" :max="duration" range></el-slider>
        </div>
        <div>{{duration}}s</div>
      </div>
      <el-alert title="提示：不设置截取时间，默认插入整个视频。" type="info" show-icon :closable="false">
      </el-alert>
      
      <div style="margin-top:20px">
        <el-button size="small" type="primary" plain @click="preview">播放截取片段</el-button>
        <el-button size="small" :loading="cutIng" type="primary" plain @click="launch">剪切</el-button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'videoConfCrop',
  inject: {
    parent: 'confContainer',
    mmsConfig: 'mmsConfig'
  },
  data () {
    return {
      currentTime: 0, // 当前进度所在时间
      timeRange: [0, 0],
      cutIng: false
    }
  },
  computed: {
    duration () {
      return this.parent.mediaInfo.duration
    },
    videoSrc(){
      return this.parent.mediaInfo.uri
    }
  },
  watch: {
    videoSrc(){
      this.currentTime = 0
      this.timeRange = [0, this.duration] 
    },
    duration (v) {
      this.timeRange[1] = v
    },
    timeRange (newVal, oldVal) {
      if (newVal[0] !== oldVal[0]) {
        this.currentTime = newVal[0]
      } else if (newVal[1] !== oldVal[1]) {
        this.currentTime = newVal[1]
      }

      this.$emit('range-change', {
        currentTime: this.currentTime
      })
    }
  },
  methods: {
    /**
     * 预览片段
     */
    preview () {
      this.parent.videoPlayer.cropPreview(this.timeRange)
    },
    async launch () {
      this.cutIng = true
      try {
        const {nodeUrl, videoCut} = this.mmsConfig

        const { data } = await this._http(`${nodeUrl}${videoCut}`, {
          uri: this.parent.mediaInfo.uri,
          seek: this.timeRange[0],
          duration: this.timeRange[1] - this.timeRange[0]
        }, {timeout: 20000}).then(res => {
          this.$message({
            type: res.error === 0 ? 'success' : 'error',
            message: res.message
          })
          return {
            data: res.data
          }
        })

        this.timeRange[0] = 0
        this.cutIng = false

        this.$emit('complete', {
          uri: data.uri
        })
      } catch(err) {
        this.cutIng = false
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss">
.videoConfCrop{
  .range-slider{
    color: #999;
    font-size: 14px;
    padding:20px 0;
    display: flex;
    align-items: center;
    .hd{
      flex: 1;
      margin: 0 10px;
    }
    .el-slider__button-wrapper{
      top: -17px;
    }
    .el-slider__button{
      border-width: 1px;
      width: 12px;
      height: 12px;
    }
    .el-slider__runway{
      margin: 0;
      height: 2px;
    }
    .el-slider__bar{
      height: 2px;
    }
  }
}
</style>