<template>
  <div
    class="msgPreview"
    :style="{
      margin: alignCenter !== undefined ? '0 auto' : 0
    }">
    <div class="title">消息名称</div>
    <m-carousel class="carousel" height="445px" trigger="click" :loop="false" :autoplay="false" :indicator-position="cards.length > 1 ? 'outside' : 'none'" v-loading="loading">
      <m-carousel-item v-for="(card, index) in cards" :key="index">
        <div class="scroll-wrap">
          <div v-for="(item, index) in card" :key="index">
            <div :class="{
              card: item.replyType,
              horizontal: item.cardOrientation === 'HORIZONTAL'
            }">
              <div class="main">
                <div class="resources">
                  <p v-if="item.type === 'text'">{{item.content}}</p>
                  <div v-if="item.type === 'image' || item.type === 'pic'">
                    <img :src="item.content" />
                  </div>
                  <div v-if="item.type === 'video'" class="media-bg">
                    <img v-if="item.cardOrientation === 'HORIZONTAL'" src="./video.svg" />
                    <video v-else controls :src="item.content" preload="metadata" :poster="item.poster"></video>
                  </div>
                  <div v-if="item.type === 'audio' || item.type === 'voice'" class="media-bg">
                    <img v-if="item.cardOrientation === 'HORIZONTAL'" src="./audio.svg" />
                    <audio v-else controls :src="item.content"></audio>
                  </div>
                </div>

                <div class="desc" v-if="item.title">
                  <h3>{{item.title}}</h3>
                  <p>{{item.desc}}</p>
                </div>
              </div>

              <div class="inner-btns" v-if="item.buttons">
                <span v-for="(btn, index) in item.buttons" :key="index">{{btn.description || btn.originalDescription}}</span>
              </div>
            </div>
          </div>
        </div>
      </m-carousel-item>
    </m-carousel>
    
    <div class="btns">
      <span v-for="(btn, index) in buttons" :key="index">{{btn.description}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'msgPreview',
  data () {
    return {
      loading: false,
      standard: true,
      cards: [],
      buttons: []
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
    this.$root.eventBus.$on('m_send_fields_data', data => {
      this.getData(data)
    })
    this.$once('hook:beforeDestroy', function () {
      this.$root.eventBus.$off('m_send_fields_data')
    })

    this.api && this.getData()
  },
  methods: {
    async getData (data) {
      this.loading = true
      this.cards = []
      this.buttons = []

      try {
        if (data) {
          this.standard = data.messageType === 'standard'
          this.cards = this.filterData(data)
        } else {
          const { data } = await this.$root.$http.get(this.api, {
            params: {
              messageId: this.messageId
            }
          })
          this.standard = data.messageType === 'standard'
          this.cards = this.standard ? this.filterData(data.data) : this.filterData(data.result.massMessage)
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log('request err', err)
      }
    },
    filterData (massMessage) {
      let [cards, dataJson] = [[], {}]

      if (typeof massMessage === 'object') {
        massMessage.replyCollection = JSON.parse(massMessage.replyCollection)
        dataJson = massMessage
      } else {
        dataJson = JSON.parse(massMessage)
      }

      if (this.standard) {
        let card = dataJson.map(item => {
          return {
            content: item.content,
            type: item.type,
            poster: item.poster
          }
        })
        cards.push(card)
      } else {
        this.buttons = typeof dataJson.buttons === 'string' ? JSON.parse(dataJson.buttons) : dataJson.buttons

        dataJson.replyCollection.forEach(item => {
          if (['text', 'voice', 'video', 'image'].includes(item.replyType)) {
            cards.push([
              {
                content: item.replyType === 'text'
                  ? (item.originalMessage || (item.reply && item.reply.content) || '')
                  : item.reply.imosMediaUrl || item.reply.mediaUrl,
                type: item.replyType,
                poster: item.reply.imosThumbnailMediaUrl || item.reply.thumbnailMediaUrl
              }
            ])
          } else if (item.replyType === 'singleCard') {
            const {originalTitle, description, buttons, originalDescription} = item.reply.card
            const {mediaUrl, imosMediaUrl, mediaType, thumbnailMediaUrl, imosThumbnailMediaUrl} = item.reply.card.media
            cards.push([{
              content: imosMediaUrl || mediaUrl,
              title: originalTitle,
              desc: description || originalDescription,
              buttons,
              replyType: item.replyType,
              type: mediaType,
              poster: imosThumbnailMediaUrl || thumbnailMediaUrl,
              cardOrientation: item.reply.cardOrientation
            }])
          } else {
            item.reply.cards.forEach(card => {
              const {mediaUrl, imosMediaUrl, mediaType, thumbnailMediaUrl, imosThumbnailMediaUrl} = card.media
              cards.push([
                {
                  content: imosMediaUrl || mediaUrl,
                  title: card.originalTitle,
                  desc: card.description || card.originalDescription,
                  buttons: card.buttons,
                  replyType: item.replyType,
                  type: mediaType,
                  poster: imosThumbnailMediaUrl || thumbnailMediaUrl
                }
              ])
            })
          }
        })
      }

      return cards
    }
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
  position: relative;
  .media-bg, audio::-webkit-media-controls-panel{
    background: #f1f3f4;
  }
  .media-bg{
    text-align: center;
    img{
      width: 60%;
    }
  }
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

  .card{
    background: #fff;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, .1);
    .desc{
      padding:.5em 1em;
    }
    h3{
      font-weight: normal;
    }

    &.horizontal{
      .main{
        display: flex;
        flex-direction: row-reverse;
      }
      .desc{
        flex:1;
      }
      .resources{
        width: 80px;
      }
    }
  }

  .btns{
    position: absolute;
    bottom: 45px;
    right: 15px;
    padding-right: 10px;
    padding-bottom: 5px;
    z-index: 5;
    overflow: auto;
    white-space: nowrap;
    width: 250px;
    z-index: 5;
    text-align: right;
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 0 2px #dedede;
      border-radius: 20px;
    }
    &::-webkit-scrollbar-track {
      background: none;
    }
    span{
      display: inline-block;
      padding: 0 8px;
      background: #f1f1f1;
      border-radius: 4px;
      line-height: 30px;
      font-size: 12px;
      color: #4a90e2;
      margin-right: 10px;
    }
  }
  .inner-btns{
    font-size: 15px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    margin-bottom: 8px;
    span{
      display: block;
      padding: 5px 10px;
      cursor: pointer;
      color: #4a90e2;
    }
  }
}
</style>