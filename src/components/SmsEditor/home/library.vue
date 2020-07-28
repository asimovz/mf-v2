<template>
  <div class="library library--wrapper">
    <div class="header">
      <span>我的{{typeLabel}}</span>
      <span class="close" @click="$emit('on-close')"><i class="el-icon-close"></i></span>
    </div>
    <div class="operation" :style="{'justify-content': libraryType === 'library' ? 'flex-end' : 'space-between'}">
      <!-- 工作区搜索框 与 上传按钮 -->
      <el-input v-show="libraryType === 'library'" class="op-input--search" size="small" suffix-icon="el-icon-search" placeholder="回车搜索素材库" @keyup.enter.native="handleSearch" v-model="searchStr" />

      <div v-show="libraryType === 'local'">
        <el-popover placement="bottom" trigger="hover" :content="popoverContent">
          <el-button style="width: 100%;" slot="reference" type="primary" size="small" :disabled="isUpLoading" :icon="`el-icon-${isUpLoading ? 'loading' : 'upload'}`" @click="$refs.file.click()">上传{{ typeLabel }}</el-button>
        </el-popover>
        <input style="display: none;" ref="file" type="file" multiple :accept="currentAccept" name="upload" @change="fileChanged" />
      </div>

      <div class="library-type--item">
        <span :class="{active: libraryType === 'local'}" @click="libraryType = 'local'">我的工作区</span>
        <span :class="{active: libraryType === 'library'}" @click="libraryType = 'library'">素材库素材</span>
      </div>
    </div>
    <!-- v-infinite-scroll="loadMore" -->
    <div ref="libraryContent" class="library--content scrollbar" :class="{'no-data': !currentDataList.length}" v-loading="fetchLoading || isUpLoading" :element-loading-text="isUpLoading ? `${type['type'] === 'video' ? '转码' : ''}上传中，请稍后...` : ''" :element-loading-spinner="isUpLoading ? 'el-icon-loading' : ''" :element-loading-background="isUpLoading ? 'rgba(0, 0, 0, 0.8)' : ''">
      <div class="lib-list">
        <lib-item :title="`添加${typeLabel}`" v-for="(item, index) in currentDataList" :key="item.id" :type="type['type']" :data="item" :show-remove="libraryType === 'local'" @on-add="libAdd(item)" @on-remove="libRemove(item.id, index)" @click.native="libAdd(item, $event)">
        </lib-item>
      </div>
      <transition name="el-fade-in">
        <div style="width: 100%;padding: 0 10px;" v-if="!canMore && showNoMore" ref="noMoreDom">
          <div class="bottom-deliver"><span>到底啦</span></div>
        </div>
      </transition>
    </div>
    <div class="library--pager" ref="opPager" v-show="currentDataList.length">
      <el-pagination :current-page.sync="pager.pageIndex" :page-size="pager.pageSize" :page-count="pager.pageCount" layout="prev, slot, next" @current-change="pageChange">
        <span style="text-align: center;">{{pager.pageIndex}} / {{pager.pageCount}}</span>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import libItem from './libItem.vue'
import { getObjectURL, getRandomId, debounce } from '../utils.js'

import '../assets/css/library.less'

function selectText(el) {
  if (document.body.createTextRange) {
    let range = document.body.createTextRange()
    let inText = el.target.innerHTML.trim()
    let len = inText.trim().length
    range.moveToElementText(el)
    range.select()
  } else if (window.getSelection) {
    let selection = window.getSelection()
    let range = document.createRange()
    range.selectNodeContents(el)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    console.log('不支持手动选择文本')
  }
}

function movetoEnd(el) {
  let range = window.getSelection()
  range.selectAllChildren(el)
  range.collapseToEnd()
  el.select()
}

export default {
  components: {
    libItem
  },
  props: {
    type: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {

      libraryType: 'library', // 素材类型

      fetchLoading: false,
      libraryList: [], // 素材库列表
      localData: { // 本地列表
        image: [],
        video: [],
        audio: []
      },

      searchStr: '', // 素材搜索

      canMore: true, // 是否加载更多
      showNoMore: true, // 是否显示无数据标识

      pager: {
        pageSize: 20,
        pageCount: 0,
        pageIndex: 1,
        total: 0
      },

      isUpLoading: false, // 上传loading
    }
  },
  computed: {
    // 当前 type 对应的 label
    typeLabel() {
      // return this.currentType['label']
      return this.type['title']
    },
    // 当前 type 对应的 accept
    currentAccept() {
      let accepts = this.type['accept'] || ''
      return accepts.split('、').map(ac => `.${ac}`).join()
    },
    // popover 内容
    popoverContent() {
      return `${this.typeLabel} 大小不超过 ${this.type.size}M，支持格式： ${this.type['accept']}`
    },
    

    currentLocalData() {
      return this.localData[this.type['type']]
    },

    // 当前数据源 ( 可定义在 data 中，切换 libraryType 时赋值， 两种方式有和不同（性能）？？？ )
    // Object.freeze 有无必要？？？ 外层 冻结 与 内层 冻结？？？
    currentDataList() {
      return this.libraryType === 'local' ? this.currentLocalData.map(item => Object.freeze(item)) :
        this.libraryList.map(item => Object.freeze(item))
    },
  },
  inject: ['mmsConfig'],
  watch: {
    'type.type': {
      handler(val) {
        this.init()
        if (!!val) this.fetchData(val)
      },
      immediate: true
    },

    checkedId: {
      handler(val) {
        if (val.length) {
          if (val.length === this.currentDataList.length) {
            this.checkAll = true
          }
        } else {
          this.checkAll = false
        }

      },
      deep: true,
    },


    canMore(val) {
      if (!val) {
        setTimeout(() => {
          this.showNoMore = false
        }, 1000)
      }
    },

    libraryType() {
      this.isUpLoading = false
    }
  },
  methods: {
    // 初始化数据
    init() {
      this.initPager()
    },

    // 初始化分页
    initPager() {
      this.pager = {
        pageSize: 20,
        pageCount: 0,
        total: 0,
        pageIndex: 1
      }
    },

    // 编辑中的素材添加至工作区
    add2Local(data){
      this.localData[data.type].unshift({
        ...data,
        id: getRandomId()
      })
    },

    /**
     * 移除素材
     * @param  {[type]} index [当前素材的索引]
     */
    libRemove(id, index) {
      if (!id.toString().length) return

      this.localData[this.type['type']].splice(index, 1)
    },

    // 选中/选择
    libAdd(item, evt) {
      if (evt && evt.target.tagName === 'INPUT') return

      this.$emit('on-add', item)
    },

    // 设置是否全选
    checkChanged(val) {
      this.currentDataList.forEach(item => {
        item.checked = val
      })
    },

    // 选择文件
    async fileChanged(evt) {
      let input = evt.target
      let files = Array.from(input.files)


      for (let i = 0; i < files.length; i++) {
        let file = files[i]

        // 文件的 格式
        let _fileType = file.name.split('.').slice(-1).join()
        // 允许上传的 格式
        let accepts = input.getAttribute('accept')

        if (!this.validatedType(_fileType)) {
          this.$message.warning(`${file.name} 格式不正确, 请上传正确格式的素材`)
          input.value = ''
          continue
        }

        if (!this.validatedSize(file.size)) {
          this.$message.warning(
            `${file.name} 大小超过限制 ${this.type['size']}M, 请重新选择`
          )
          input.value = ''
          continue
        }

        if (this.type['type'] === 'video') {
          this.isUpLoading = true
          let fd = new FormData()
          fd.append('file', file)

          await this.uploadFile(fd)
        } else {
          this.localData[this.type['type']].unshift({
            id: getRandomId(),
            name: file.name,
            size: file.size,
            uri: getObjectURL(file),
          })

          if (this.$refs.file) this.$refs.file.value = ''
        }
      }
    },

    // 验证文件大小
    validatedSize(size) {
      return this.type['size'] * 1024 * 1024 > size
    },

    // 验证文件格式
    validatedType(type) {
      return this.currentAccept.includes(type.toLowerCase())
    },

    // 上传素材
    uploadFile(fd) {
      return this._http(this.mmsConfig.nodeUrl + this.mmsConfig.uploadFile, fd, { timeout: 90000 })
        .then(res => {

          this.$message({
            type: res.error === 0 ? 'success' : 'error',
            message: res.message
          });

          if (this.type['type'] === 'video') {
            res.data.poster = res.data.thumbnail
            delete res.data.thumbnail
          }

          res.data.id = getRandomId()

          res.error === 0 && this.localData[this.type['type']].unshift(res.data)
        }).finally(cb => {
          this.isUpLoading = false
          if (this.$refs.file) this.$refs.file.value = ''
        })
    },

    pageChange(page) {
      this.fetchData()
    },

    // 素材搜索
    handleSearch: debounce(function() {
      let str = this.searchStr.trim()

      // if (!str.length) return

      this.pager.pageIndex = 1
      this.fetchData(this.type['type'], str)
    }, 500, true),

    // 获取素材库
    async fetchData(type = this.type['type'], str) {
      this.libraryType = 'library'
      this.libraryList = []
      this.fetchLoading = true

      let { pageIndex, pageSize } = this.pager

      let params = Object.assign({}, {
        type,
        pageIndex: pageIndex - 1,
        pageSize
      }, !!str ? { name: str } : null)

      this._http(this.mmsConfig.library, params)
        .then(res => {
          if (res.error === 0) {
            this.pager.total = res.count
            this.pager.pageCount = res.pageMaxIndex + 1
            this.libraryList = (res.data || []).map(item => ({
              ...item,
              uri: encodeURI(item.uri)
            }))

            this.$nextTick(() => {
              this.$refs.libraryContent.scrollTop = 0
            })
          }
        }).finally(end => {
          this.fetchLoading = false
        })
    }
  },
};

</script>
