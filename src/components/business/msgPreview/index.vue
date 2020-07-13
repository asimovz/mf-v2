<template>
  <div
    class="msgPreview"
    :style="{
      margin: alignCenter !== undefined ? '0 auto' : 0
    }">
    <div class="title">消息名称</div>
    <m-carousel class="carousel" height="445px" trigger="click" :loop="false" :autoplay="false" indicator-position="outside">
      <m-carousel-item v-for="(card, index) in cards" :key="index">
        <div class="scroll-wrap">
          <div v-for="(item, index) in card" :key="index">
            <div v-if="item.type === 'card'" class="card">
              <img :src="item.content" />
              <div class="desc" v-if="card.title">
                <h3>{{card.title}}</h3>
                <p>{{card.desc}}</p>
              </div>
              <div class="btns" v-if="card.buttons">
                <span v-for="(btn, index) in card.buttons" :key="index">{{btn.description}}</span>
              </div>
            </div>
            <p v-if="item.type === 'text'">{{item.content}}</p>
            <div v-if="item.type === 'image'">
              <img :src="item.content" />
            </div>
            <div v-if="item.type === 'video'">
              <video controls :src="item.content" preload="metadata"></video>
            </div>
            <div v-if="item.type === 'audio' || item.type === 'voice'">
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
      cards: []
    }
  },
  props: {
    api: {
      type: String,
      default: ''
    },
    data: String,
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
        if (this.data) {
          this.cards = this.filterData(this.data)
        } else {
          const { data } = await this.$root.$http.get(this.api, {
            params: {
              messageId: this.messageId
            }
          })
          this.cards = this.filterData(data)
        }
      } catch (err) {
        console.log('request err', err)
      }
    },
    filterData (data) {
      let cards = []
      if (this.standard) {
        let card = data.data.map(item => {
          return {
            content: item.content,
            type: item.type
          }
        })
        cards.push(card)
      } else {
        const dataJson = JSON.parse(data.result.massMessage)

        dataJson.replyCollection.forEach(item => {
          if (['text', 'voice', 'video', 'image'].includes(item.replyType)) {
            cards.push([
              {
                content: item.replyType === 'text' ? item.reply.content : item.reply.mediaUrl,
                type: item.replyType
              }
            ])
          } else if (item.replyType === 'singleCard') {
            const {originalTitle, mediaUrl, description, buttons} = item.reply.card
            cards.push([{
              content: mediaUrl,
              title: originalTitle,
              desc: description,
              buttons,
              type: 'card'
            }])
          } else {
            item.reply.cards.forEach(card => {
              cards.push([
                {
                  content: card.media.mediaUrl,
                  title: card.originalTitle,
                  desc: card.description,
                  buttons: card.buttons,
                  type: 'card'
                }
              ])
            })
          }
        })
      }

      return cards
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

  .card{
    background: #fff;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, .1);
    .desc{
      padding:.5em 1em;
    }
    h3{
      font-weight: normal;
    }
    .btns{
      position: absolute;
      bottom:0;
      right:0;
      padding:10px;
      span{
        display: inline-block;
        padding: 0 12px;
        background: #f1f1f1;
        border-radius: 4px;
        height: 36px;
        line-height: 36px;
        font-size: 12px;
        color: #4a90e2;
        margin-left: 10px;
      }
    }
  }
}
</style>