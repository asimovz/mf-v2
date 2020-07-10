<template>
  <div
    class="msgPreview"
    :style="{
      margin: alignCenter !== undefined ? '0 auto' : 0
    }">
    <div class="title">消息名称</div>
    <m-carousel class="carousel" height="445px" trigger="click" :loop="false" :autoplay="false" indicator-position="outside">
      <m-carousel-item v-for="item in 1" :key="item">
        <div class="scroll-wrap">
          <div v-for="(item, index) in jsonData" :key="index">
            <p v-if="item.type === 'text'">{{item.content}}</p>
            <div v-if="item.type === 'image'">
              <img :src="item.content" />
            </div>
            <div v-if="item.type === 'video'">
              <video controls :src="item.content" preload="metadata"></video>
            </div>
            <div v-if="item.type === 'audio'">
              <audio :src="item.content"></audio>
            </div>
          </div>
        </div>
      </m-carousel-item>
    </m-carousel>
    
  </div>
</template>
<script>
export default {
  name: 'msgPreview',
  data () {
    return {
      standard: true,
      jsonData: []
    }
  },
  props: {
    api: {
      type: String,
      default: ''
    },
    messageId: {
      type: String,
      default: ''
    },
    alignCenter: {}
  },
  computed: {
    source () {
      return this.api + this.messageId
    }
  },
  watch: {
    source (v) {
      this.getData()
    }
  },
  created () {
    this.standard = location.href.indexOf('StandardFiveGMessage') >= 0
    this.getData()
  },
  methods: {
    async getData () {
      try {
        const { data } = await this.$root.$http.get(this.api, {
          params: {
            messageId: this.messageId
          }
        })
        this.jsonData = this.filterData(data.data)
        console.log(this.jsonData)
      } catch (err) {
        console.log('request err', err)
      }
    },
    filterData (data) {
      const dataArr = JSON.parse(data)
      if (this.standard) {
        return dataArr.map(item => {
          return {
            content: item.content,
            type: item.type
          }
        })
      } else {
        return dataArr.map(item => {
          return {
            content: item.content,
            type: item.type
          }
        })
      }
    }
  },
  beforeDestroy () {

  }
}
</script>
<style lang='less'>
.msgPreview {
  width:280px;
  height:560px;
  padding:40px 15px;
  background:url('./phone-bg.png') 0 0 no-repeat;
  background-size: cover;
  font-size: 12px;
  color:#606266;
  .title{
    padding: 0 10px 10px;
    border-bottom: 1px solid #ebeef5;
  }
  .scroll-wrap{
    width:100%;
    height:445px;
    padding:10px;
    overflow-x: hidden;
    overflow-y: auto;
    img{
      vertical-align: bottom;
    }
    video,audio,img{
      max-width: 100%;
    }
    &::-webkit-scrollbar {
      width: 4px;
      height: 1px;
    }

    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 0 2px #dedede;
      border-radius: 20px;
    }
    &::-webkit-scrollbar-track {
      background: none;
    }
  }

  .carousel{
    width:100%;
    .el-carousel__indicator--horizontal{
      padding: 8px 4px 12px;   
    }
  }
}
</style>