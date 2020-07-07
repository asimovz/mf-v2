<template>
  <el-form class="videoConfPoster" :model="form" label-width="70px" label-position="left">
    <el-form-item label="水印设置">
      <el-radio-group size="small" v-model="form.type">
        <el-radio-button label="recommend">推荐封面</el-radio-button>
        <el-radio-button label="custom">自定义封面</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <div class="recommend" v-loading="loading" v-show="form.type === 'recommend'">
      <el-scrollbar>
        <el-button size="small" class="reload-btn" v-show="loadErr" @click="getPoster" type="text">重新加载</el-button>
        <el-row :gutter="10">
          <el-col :span="12" class="item-img" :class="{active: currentPoster === item}" v-for="item in imgs" :key="item" @click.native="currentPoster = item">
            <img :src="item" />
            <i class="el-icon-success"></i>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    
    <div v-show="form.type === 'custom'">
      <upLoadImage v-model="currentPoster" />
    </div>
  </el-form>
</template>

<script>
import upLoadImage from './upLoadImage'

export default {
  name: 'videoConfPoster',
  inject: {
    parent: 'confContainer',
    mmsConfig: 'mmsConfig'
  },
  components:{
    upLoadImage
  },
  data () {
    return {
      imgs: [],
      currentPoster: '',
      loading: false,
      loaded: false,
      loadErr: false,
      form: {
        type: 'recommend'
      }
    }
  },
  computed:{
    duration(){
      return this.parent.mediaInfo.duration
    },
    tabName(){
      return this.parent.activeName
    },
    videoSrc(){
      return this.parent.mediaInfo.uri
    }
  },
  watch: {
    currentPoster (v) {
      this.$emit('poster-change', {
        poster: v
      })
    },
    videoSrc (){
      this.init()
    },
    tabName(v){
      v === 'poster' && this.getPoster()
    }
  },
  methods: {
    init(){
      this.imgs = []
      this.currentPoster = ''
      this.loaded = false
      this.loadErr = false
      this.form.type = 'recommend'
    },
    async getPoster () {
      if(this.loaded) return
      this.loadErr = false
      this.loading = true

      try {
        const timestamps = this.getTimestamps()
        const {nodeUrl, videoThumbnail} = this.mmsConfig

        const { data } = await this._http(`${nodeUrl}${videoThumbnail}`, {
          uri: this.parent.mediaInfo.uri,
          timestamps,
          size: '640x?'
        }, {timeout: 20000})

        this.loaded = true
        this.loading = false
        
        this.currentPoster = this.parent.mediaInfo.poster || data.thumbnail[0]
        this.imgs = data.thumbnail
      } catch (err) {
        this.loadErr = true
        this.loading = false
        console.log(err)
      }
    },
    /**
     * 获取多少张
     */
    getTimestamps(page = 6){
      let times = []

      if(this.duration <= 6) {
          page = this.duration
          for(let i = 1; i <= page; i++){
            times.push(i)
          }
      }else if(this.duration > 6 && this.duration < 10){
        times = [1,2,3,4,5,6]
      }else{
        const padding = 2
        const duration = this.duration
        const step = parseInt((duration - padding * 2) / page)

        for(let i = 0; i < page; i++){
          times.push(step * i + padding)
        }
      }
      return times
    }
  }
}
</script>

<style lang="scss">
.videoConfPoster{
  .el-scrollbar{
    height: 100%;
    overflow: hidden;
  }
  .el-scrollbar__wrap{
    overflow-x: hidden;
    padding:0 10px;
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: .1) inset;
  }
  .recommend{
    height: 310px;
    overflow:hidden;
    border:1px solid #EBEEF5;
    border-radius: 5px;
    .reload-btn{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
    }
    .item-img{
      margin:10px 0;
      opacity: .75;
      cursor: pointer;
      position: relative;
      &:hover,&.active{
        opacity: 1;
      }
      &.active{
        .el-icon-success{
          visibility:visible;
        }
      }
      .el-icon-success{
        visibility:hidden;
        opacity: .9;
        color:#409eff;
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3em;
        &::after{
          content: '';
          position: absolute;
          width:80%;
          height: 80%;
          background-color: #fff;
          left:50%;
          top:50%;
          transform: translate(-50%, -50%);
          border-radius: 100%;
        }
        &::before{
          position: relative;
          z-index: 1;
        }
      }
    }
    img{
      max-width: 100%;
      vertical-align: bottom;
      border-radius: 5px;
      border:1px solid #F2F6FC;
    }
  }
}
</style>