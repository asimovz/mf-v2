<template>
  <el-form class="videoConfTranscode" :model="form" label-width="100px" label-position="left">
    <el-row>
      <el-col>
        <el-form-item label="视频参数设置" style="margin-bottom:10px;">
            <el-radio-group size="small" v-model="form.sizeType">
              <el-radio-button label="size">指定预估大小(MB)</el-radio-button>
              <el-radio-button label="rate">指定码率</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-input-number size="small" style="width: 215px;" v-show="form.sizeType === 'size'" v-model="form.videoSize" :min="0.1" :max="maxSize" :precision="1" :step="0.1" label="预估大小"></el-input-number>

          <el-select
            size="small"
            v-model="form.videoBit"
            v-show="form.sizeType === 'rate'">
            <el-option
              v-for="bit in validateVideoBits"
              :key="bit"
              :label="`${bit} kbps`"
              :value="bit"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="音频码率设置">
          <el-select
            size="small"
            v-model="form.musicBit">
            <el-option
              v-for="bit in validateMusicBits"
              :key="bit"
              :label="`${bit} kbps`"
              :value="bit"
              ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-button size="small" :loading="loading" type="primary" plain @click="launch">开始转码</el-button>
  </el-form>
</template>

<script>

export default {
  name: 'videoConfTranscode',
  inject: {
    parent: 'confContainer',
    mmsConfig: 'mmsConfig'
  },
  data () {
    return {
      loading: false,
      videoSizes: [0.1, 0.5, 1, 1.5, 2],
      videoBits: [348, 464, 512, 768, 1024, 1536],
      musicBits: [48, 64, 96, 128, 192, 256],
      maxSize: undefined,
      form: {
        sizeType: 'size',
        videoSize: 1,
        videoBit: 348,
        musicBit: 48
      }
    }
  },
  computed: {
    musicBit(){
      return parseInt(this.parent.mediaInfo.musicBit / 1000)
    },
    videoBit(){
      return parseInt(this.parent.mediaInfo.videoBit / 1000)
    },
    videoSize(){
      return (this.parent.mediaInfo.size / 1024 / 1024).toFixed(1)
    },
    videoSrc(){
      return this.parent.mediaInfo.uri
    },
    validateVideoBits(){
      return this.videoBits.filter(bit => bit < this.videoBit)
    },
    validateMusicBits(){
      return this.musicBits.filter(bit => bit < this.musicBit)
    }
  },
  watch: {
    musicBit(v){
      if(v !==0 && !this.musicBits.includes(v)){
        this.musicBits.push(v)
        this.musicBits.sort((x, y) => x - y)
      }
      
      this.form.musicBit = v
    },
    videoBit(v){
      if(v !== 0 && !this.videoBits.includes(v)){
        this.videoBits.push(v)
        this.videoBits.sort((x, y) => x - y)
      }

      this.form.videoBit = v
    },
    videoSize(v){
      if(v !== 0 && !this.videoSizes.includes(v)){
        this.videoSizes.push(v)
        this.videoSizes.sort((x, y) => x - y)
      }

      this.maxSize = +v
      this.form.videoSize = +v
    },
  },
  methods: {
    async launch () {
      this.loading = true
      try {
        const {sizeType, videoSize, videoBit, musicBit} = this.form
        const requestData = {
          uri: this.videoSrc,
          musicBitrate: musicBit
        }

        if(sizeType === 'size'){
          requestData.size = videoSize
        }else{
          requestData.videoBitrate = videoBit
        }

        const {nodeUrl, videoCompress} = this.mmsConfig

        const { data } = await this._http(`${nodeUrl}${videoCompress}`, requestData, {timeout: 20000})
          .then(res => {
            this.$message({
              type: res.error === 0 ? 'success' : 'error',
              message: res.message
            })
            return {
              data: res.data
            }
          })

        this.loading = false

        let _data = {
          musicBit: musicBit * 1000,
          videoBit: videoBit * 1000,
        }
        this.$emit('complete', {
          data: _data,
          uri: data.uri
        })
      } catch(err) {
        this.loading = false
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss">
.videoConfTranscode{
}
</style>