<template>
  <div class="msgCardList">
    <ul class="list-wrap">
      <li class="item btn-add" @click="edit()">
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
            <div>
              <m-button type="default" size="small" @click.native="edit(item)">编辑</m-button>
            </div>
            <div>
              <m-button type="default" size="small" @click.native="verifyBefore(item)">提交</m-button>
            </div>
            <div v-show="true">
              <m-button type="default" size="small" @click.native="preview">预览</m-button>
            </div>
          </div>
        </div>

        <div class="flag" :class="item.state | stateFormat">
          {{item.state | stateName}}
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

    <msgCardPreview
      v-model="previewVisible" />

    <m-modal
      id="confirmModal"
      :width="300"
      :title="confirmModal.title"
      v-model="confirmModal.visible">
      <p>{{confirmModal.desc}}</p>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button size="mini" @click="confirmModal.visible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="del">确认</el-button>
      </div>
    </m-modal>
  </div>
</template>
<script>
import msgCardPreview from './components/preview'

export default {
  name: 'msgCardList',
  components: {
    msgCardPreview
  },
  data () {
    return {
      previewVisible: false,
      confirmModal: {
        visible: false,
        title: '',
        desc: ''
      },
      activeData: {},
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
    },
    createApi: {
      type: String,
      default: ''
    },
    previewApi: {
      type: String,
      default: ''
    },
    verifyApi: {
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
      if (!this.transition || this.transition.indexOf('?') < 0) return {}

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
    // MmsOpen 待提交， MmsSubmit 待审核， MmsApproved 审核通过， MmsReject 审核不通过
    stateFormat (v) {
      if (v === 'MmsOpen') {
        return 'warning'
      } else if (v === 'MmsSubmit') {
        return 'info'
      } else if (v === 'MmsApproved') {
        return 'success'
      } else if (v === 'MmsReject') {
        return 'danger'
      }
    },
    stateName (v) {
      let name
      switch (v) {
        case 'MmsOpen':
          name = '待提交'
          break
        case 'MmsSubmit':
          name = '待审核'
          break
        case 'MmsApproved':
          name = '审核通过'
          break
        case 'MmsReject':
          name = '审核不通过'
          break
      }
      return name
    }
  },
  methods: {
    async getData () {
      try {
        const { data } = await this.$root.$http.get(this.transition, {...this.params})
        this.items = data.data
      } catch (err) {
        console.log('request err', err)
      }
    },
    preview () {
      this.previewVisible = true
    },
    edit (item) {
      location.href = item ? `${this.createApi}?msgId=${item.msgId}` : this.createApi
    },
    verifyBefore (item) {
      this.confirmModal = {
        title: '提交审核',
        desc: '确认提交审核',
        visible: true
      }

      this.activeData = item
    },
    async verify () {
      try {
        await this.$root.$http.post(this.verifyApi, {
          msgId: this.activeData.msgId
        })

        this.confirmModal.visible = false
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
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,0.15);
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
      .img{
        width: 100%;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        vertical-align: bottom;
        border-radius: 8px 8px 0 0;
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
      top:-1px;
      left:-1px;
      padding:.5em 1em;
      width: 108px;
      text-align: center;
      border-radius: 8px 0 4px 0;
      .tooltip{
        font-size: 1.2em;
        position: absolute;
        top:50%;
        right:.6em;
        transform: translate(0, -50%);
      }
      &.warning{
        background: #e6a23c;
      }
      &.info{
        background: #3c64b9;
      }
      &.danger{
        background: #d35656;
        padding-right: 2.2em;
      }
      &.success{
        background: #52bb90;
      }
    }

    .mask{
      position: absolute;
      top:-1px;
      right:-1px;
      bottom:-1px;
      left:-1px;
      padding:10px;
      background: rgba(0, 0, 0, .4);
      visibility:hidden;
      text-align: center;
      border-radius: 8px;
      button{
        width: 95px;
        margin-bottom: 15px;
        vertical-align: bottom;
      }
    }

    .control{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>