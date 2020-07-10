<template>
  <div class="msgCardList">
    <ul class="list-wrap">
      <li class="item btn-add">
        <div class="inner-wrap" v-if="standard" @click="standardCreate">
          <div class="control"><i class="el-icon-plus"></i> 新建消息</div>
        </div>
        <m-link v-else :href="editUrl">
          <div class="inner-wrap">
            <div class="control"><i class="el-icon-plus"></i> 新建消息</div>
          </div>
        </m-link>
      </li>
      <li class="item" v-for="(item, index) in items" :key="item.msgId">
        <div class="preview">
          <img class="img" :src="item.thumb">
        </div>
        <div class="main">
          <div class="title" :title="item.title">{{item.title}}</div>
          <div class="other">
            <p><label>消息ID：</label>{{item.msgId}}</p>
            <p><label>场景名称：</label>{{item.sceneName}}</p>
            <p v-show="item.botName"><label>机器人：</label>{{item.botName}}</p>
          </div>
        </div>

        <div class="mask">
          <div class="control">
            <div v-show="item.statusId !== 'MmsSubmit'">
              <m-link :href="editUrlItem(item)">
                <m-button type="default" size="small">编辑</m-button>
              </m-link>
            </div>
            <div v-show="item.statusId === 'MmsOpen'">
              <m-button type="default" size="small" @click.native="verifyBefore(item, index)">提交</m-button>
            </div>
            <div>
              <m-button type="default" size="small" @click.native="preview(item, index)">预览</m-button>
            </div>
            <div v-show="!standard">
              <m-button type="default" size="small" @click.native="delBefore(item, index)">删除</m-button>
            </div>
          </div>
        </div>

        <div class="flag" v-if="standard" :class="item.statusId | stateFormat">
          {{item.statusId | stateName}}
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
        :paginate="{count: page.count, pageIndex: page.pageIndex, pageSize: page.pageSize, pageMaxIndex: pageMaxIndex}"
        :show-total="true"
        :pageSizeOpts="[30,60,90]"
        page-change="pageChangeByMsgCardList" />
    </div>

    <m-modal
      title="预览"
      id="previewModal"
      v-model="previewVisible">
      <msgPreview align-center :message-id="activeData.msgId" :api="previewDataUrl" />
    </m-modal>
  </div>
</template>
<script>

export default {
  name: 'msgCardList',
  data () {
    return {
      previewVisible: false,
      confirmModal: {
        type: '',
        title: '',
        desc: ''
      },
      activeData: {},
      standard: true,
      page: {
        count: 10,
        pageIndex: 0,
        pageSize: 30
      },
      items: [],
      formParams: {}
    }
  },
  props: {
    transition: {
      type: String,
      default: ''
    },
    targetModal: {
      type: String,
      default: ''
    },
    editUrl: {
      type: String,
      default: ''
    },
    delUrl: {
      type: String,
      default: ''
    },
    previewDataUrl: {
      type: String,
      default: ''
    },
    verifyUrl: {
      type: String,
      default: ''
    },
    searchForm: String
  },
  computed: {
    pageMaxIndex () {
      let p = this.page.count / this.page.pageSize
      return p < 1 ? 1 : Math.ceil(p) + 1
    }
  },
  created () {
    this.standard = location.href.indexOf('StandardFiveGMessage') >= 0

    this.$root.eventBus.$on('pageChangeByMsgCardList', data => {
      this.page.pageIndex = data.pageIndex
      this.page.pageSize = data.pageSize
      this.getData()
    })

    if (this.searchForm) {
      this.$root.eventBus.$on('search_form_data_' + this.searchForm, data => {
        let formParams = {}
        if (typeof data.entries === 'function') {
          for (let pair of data.entries()) {
            let key = pair[0]
            let value = pair[1]
            if (value == '' || key === 'moquiSessionToken' || key === 'moquiFormName') continue
            formParams[key] = value
            if (value.split(',').length > 1) {
              formParams[pair[0] + '_op'] = 'in'
            } else {
              formParams[pair[0] + '_op'] = 'includes'
            }
          }
        } else {
          formParams = data
        }

        this.formParams = formParams

        this.getData()
      })
    }

    this.getQuery()
    this.getData()
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
    getQuery () {
      if (!this.transition || this.transition.indexOf('?') < 0) return

      const searchArr = this.transition.split('?')[1].split('&')

      searchArr.forEach(item => {
        const tmp = item.split('=')
        this.formParams[tmp[0]] = tmp[1]
      })
    },
    async getData () {
      try {
        const { data } = await this.$http.get(this.transition, {
          params: {
            ...this.formParams,
            pageIndex: this.page.pageIndex,
            pageSize: this.page.pageSize
          }
        })
        this.page.count = data.count
        this.items = data.data
      } catch (err) {
        console.log('request err', err)
      }
    },
    preview (item, index) {
      this.previewVisible = true
      this.activeIndex = index
      this.activeData = item
    },
    standardCreate () {
      this.$root.eventBus.$emit(`dynamic_visible_change_${this.targetModal}`)
    },
    editUrlItem (item) {
      return `${this.editUrl}?messageId=${item.msgId}`
    },
    verifyBefore (item, index) {
      this.confirmModal = {
        type: 'verify',
        title: '提交审核',
        desc: '确认提交审核'
      }

      this.activeIndex = index
      this.activeData = item
      this.alertConfirm()
    },
    delBefore (item, index) {
      this.confirmModal = {
        type: 'del',
        title: '删除',
        desc: '确认删除消息'
      }

      this.activeIndex = index
      this.activeData = item
      this.alertConfirm()
    },
    alertConfirm () {
      this.$confirm(this.confirmModal.desc, this.confirmModal.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirm()
      })
    },
    async confirm () {
      try {
        const { type } = this.confirmModal
        const api = type === 'del' ? this.delUrl : this.verifyUrl

        await this.$root.$http.post(api, {
          messageId: this.activeData.msgId
        })

        if (type === 'verify') {
          this.activeData.statusId = 'MmsSubmit'
        } else {
          this.page.pageIndex = 0
          this.getData()
          // this.items.splice(this.activeIndex, 1)
        }
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
      color:#303133;
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
      .inner-wrap{
        cursor: pointer;
        position: absolute;
        top:0;
        right:0;
        bottom:0;
        left:0;
      }
    }

    .preview{
      font-size: 14px;
      position: relative;
      height: 120px;
      overflow: hidden;
      border-radius: 8px 8px 0 0;
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
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .main{
      padding:8px 16px;
    }

    .other{
      color:#606266;
      font-size: 12px;
      line-height: 1.75;
      label{
        display: inline-block;
        // width:5em;
        // text-align:justify;
        // text-align-last: justify;
        // margin-right: .5em;
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