<template>
  <div class="msgCardList">
    <ul class="list-wrap">
      <li class="item btn-add">
        <div class="control"><i class="el-icon-plus"></i> 新建消息</div>
      </li>
      <li class="item" v-for="(item, index) in items" :key="index">
        <div class="preview">
          <img class="img" :src="item.thumb">
        </div>
        <div class="main">
          <div class="title" :title="item.title">{{item.title}}</div>
          <div class="other">
            <p><label>消息ID：</label>{{item.msgId}}</p>
            <p><label>场景名称：</label>{{item.sceneName}}</p>
          </div>
        </div>

        <div class="mask">
          <div class="control">
            <div class="btns">
              <i class="el-icon-edit"></i>
              <i class="el-icon-delete"></i>
            </div>
            <div>
              <m-button>提交审核</m-button>
            </div>
            <div>
              <m-button>预 览</m-button>
            </div>
          </div>
        </div>

        <div class="flag" :class="item.state | stateFormat">
          待审核
          <m-tooltip class="tooltip" v-if="item.desc" :title="item.desc">
              <span class="el-icon-warning-outline"></span>
          </m-tooltip>
        </div>
      </li>
    </ul>
    <div class="pagination_box">
      <m-page 
        :enable-all="false"
        :max-allowed-count="30"
        :paginate="{count: page.total, pageIndex: page.pageIndex, pageSize: page.pageSize, pageMaxIndex: pageMaxIndex}"
        :show-total="true"
        :pageSizeOpts="[30,60,90]"
        page-change="pageChangeByMsgCardList" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'msgCardList',
  data () {
    return {
      page: {
        count: 10,
        pageIndex: 0,
        pageSize: 30
      },
      items: []
    }
  },
  props: {
    transition: {
      type: String,
      default: ''
    }
  },
  computed: {
    pageMaxIndex () {
      let p = this.page.count / this.page.pageSize
      return p < 1 ? 1 : Math.ceil(p) + 1
    },
    params () {
      if (!this.transition) return {}

      const searchArr = this.transition.split('?')[1].split('&')
      const res = {}

      searchArr.forEach(item => {
        const tmp = item.split('=')
        res[tmp[0]] = tmp[1]
      })

      return res
    }
  },
  created () {
    this.getData()
    this.$root.eventBus.$on('pageChangeByMsgCardList', data => {
      this.getData()
    })
  },
  filters: {
    stateFormat (v) {
      if (v === 1) {
        return 'success'
      }
      if (v === 2) {
        return 'warning'
      }

      if (v === 3) {
        return 'danger'
      }
    }
  },
  methods: {
    async getData () {
      try {
        const { data } = await this.$root.$http.get(this.transition, {...this.params})
        this.items = data
      } catch (err) {
        console.log('request err', err)
      }
    }
  },
  beforeDestroy () {

  }
}
</script>
<style lang='less'>
.msgCardList {
  .list-wrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item{
      flex: 0 0 19%;
      background: #fff;
      margin-bottom: 20px;
      position: relative;
      &:hover{
        .mask{
          visibility:visible;
        }
      }
    }

    .btn-add{
      cursor: pointer;
    }

    .preview{
      font-size: 14px;
      position: relative;
      height: 120px;
      overflow: hidden;
      background: #F2F6FC;
      .img{
        width: 100%;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        vertical-align: bottom;
      }
    }

    .title{
      height: 3em;
      margin-bottom: 1em;
      overflow: hidden;
      text-overflow: ellipsis;
      display:-webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient:vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp:2; //显示的行
    }

    .main{
      padding:1em;
    }

    .other{
      line-height: 1.75;
      label{
        color:#909399;
        display: inline-block;
        width:5em;
        text-align:justify;
        text-align-last: justify;
        margin-right: .5em;
      }
    }

    .flag{
      font-size: 12px;
      color: #fff;
      position: absolute;
      top:0;
      left:0;
      padding:.5em 1em;
      .tooltip{
        font-size: 1.2em;
        position: absolute;
        top:50%;
        right:.6em;
        transform: translate(0, -50%);
      }
      &.warning{
        background: #E6A23C;
      }
      &.danger{
        background: #F56C6C;
        padding-right: 2.2em;
      }
      &.success{
        background: #67C23A;
      }
    }

    .mask{
      position: absolute;
      width:100%;
      height: 100%;
      top:0;
      right:0;
      bottom:0;
      left:0;
      padding:10px;
      background: rgba(0, 0, 0, .2);
      visibility:hidden;
      text-align: center;
      i{
        cursor: pointer;
        color: #fff;
        font-size: 1.2em;
        width:30px;
        line-height:30px;
        margin: 0 5px;
        border-radius: 50%;
        background: rgba(255, 255, 255, .3);
        transform: scale(1);
        &:hover{
          transform: scale(1.2);
          transition: transform .3s;
        }
      }
      button{
        width:10em;
        margin-bottom: 5px;
      }
    }

    .control{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
      .btns{
        padding-bottom: 40px;
      }
    }
  }
}
</style>