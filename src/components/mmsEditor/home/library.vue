<template>
  <div class="library library--wrapper">
    <div class="header">
      <el-radio-group size="small" v-model="libraryType">
        <el-radio-button label="library">素材库</el-radio-button>
        <el-radio-button label="local">本地</el-radio-button>
      </el-radio-group>

      <span class="close" @click="$emit('on-close')"><i class="el-icon-close"></i></span>
    </div>
    <div class="operation">
      <div>
        <el-button v-if="!isCheckAble" size="small" :disabled="isUpLoading" @click="isCheckAble = true">批量操作</el-button>
        <el-checkbox v-else :indeterminate="isIndeterminate" :value="checkAll" @change="checkChanged">全选</el-checkbox>
      </div>

      <div>
        <template v-if="isCheckAble">
          <el-button size="small" type="danger" :disabled="!checkedId.length " @click="libRemove(checkedId)">删除</el-button>
          <el-button size="small" type="primary" @click="isCheckAble = false">取消</el-button>
        </template>

        <template v-else>
          <el-input class="op-input--search" v-show="libraryType === 'library'" size="small"suffix-icon="el-icon-search" placeholder="回车搜索素材库" v-model="resourceStr" @focus="libInput(true)" @blur="libInput(false)" />

          <template v-if="libraryType === 'local'">
            <el-popover style="margin-left: 10px;" placement="bottom" trigger="hover" :content="popoverContent">
              <el-button slot="reference" type="primary" size="small" :disabled="isUpLoading" :icon="`el-icon-${isUpLoading ? 'loading' : 'upload'}`" @click="$refs.file.click()">上传{{ typeLabel }}</el-button>
            </el-popover>
            <input style="display: none;" ref="file" type="file" :accept="currentAccept" name="upload" @change="fileChanged" />
          </template>

        </template>

      </div>
    </div>

     <!-- v-infinite-scroll="loadMore" -->
    <div ref="libraryContent" class="library--content scrollbar" :class="{'no-data': !currentDataList.length}" v-loading="fetchLoading || isUpLoading" :element-loading-text="isUpLoading ? `${type['type'] === 'video' ? '转码' : ''}上传中，请稍后...` : ''" :element-loading-spinner="isUpLoading ? 'el-icon-loading' : ''" :element-loading-background="isUpLoading ? 'rgba(0, 0, 0, 0.8)' : ''">
      <div class="lib-list" :class="{'isCheckable': isCheckAble}">
        <lib-item
          :title="isCheckAble ? '选中' : type.type !== 'audio' ? `添加${typeLabel}` : ''"
          v-for="(item, index) in currentDataList" :key="item.resourceId"
          :type="type['type']"
          :data="item"
          @on-add="libAdd(item)"
          @on-remove="libRemove(item.resourceId)"
          @click.native="libAdd(item, $event)"
        >
        </lib-item>
      </div>

      <transition name="el-fade-in">
        <div style="width: 100%;padding: 0 10px;" v-if="!canMore && showNoMore" ref="noMoreDom">
          <div class="bottom-deliver"><span>到底啦</span></div>
        </div>
      </transition>
    </div>

    <div class="library--pager" ref="opPager" v-show="!isCheckAble && libraryType === 'library'">
      <el-pagination
        :current-page.sync="pager.pageIndex"
        :page-size="pager.pageSize"
        :total="pager.total"
        :page-count="pager.pageCount"
        layout="prev, slot, next"
      >
        <span style="text-align: center;">{{pager.pageIndex}} / {{pager.pageCount}}</span>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import libItem from './libItem.vue'
import { getObjectURL, getRandomId } from '../utils.js'

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
      libraryList: [],  // 素材库列表
      localData: {      // 本地列表
        image: [],
        video: [],
        audio: []
      },

      resourceStr: '',  // 素材搜索

      canMore: true,  // 是否加载更多
      showNoMore: true, // 是否显示无数据标识

      pager: {
        pageSize: 20,
        total: 0,
        pageIndex: 1
      },

      isUpLoading: false, // 上传loading
      // isEditAble: false, // 可编辑名称
      isCheckAble: false, // 选择模式
      checkAll: false, // 全选
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
    // 选中的 id
    checkedId() {
      if(this.libraryType === 'local'){
        return this.localData[this.type['type']].filter(item => item.checked).map(item => item.resourceId)
      }else{
        return this.libraryList.filter(item => item.checked).map(item => item.resourceId)
      }
    },
    // 半选
    isIndeterminate() {
      if(this.libraryType === 'local'){
        return this.localData[this.type['type']].some(item => item.checked) && !this.localData[this.type['type']].every(item => item.checked)
      }else{
        return this.libraryList.some(item => item.checked) && !this.libraryList.every(item => item.checked)
      }

    },

    currentLocalData(){
      return this.localData[this.type['type']]
    },

    // 当前数据源 ( 可定义在 data 中，切换 libraryType 时赋值， 两种方式有和不同（性能）？？？ )
    // Object.freeze 有无必要？？？ 外层 冻结 与 内层 冻结？？？
    currentDataList(){
      return this.libraryType === 'local' ? this.currentLocalData.map(item => Object.freeze(item)) : this.libraryList.map(item => Object.freeze(item))
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

    isCheckAble(visible) {
      this.checkAll = false

      if(this.libraryType === 'local'){
        this.localData[this.type['type']] = this.localData[this.type['type']].map(item => {
          return {
            ...item,
            checked: false
          }
        })
      }else{
        this.libraryList = this.libraryList.map(item => {
          return {
            ...item,
            checked: false
          }
        })
      }
    },

    canMore(val){
      if(!val){
        setTimeout(() => {
          this.showNoMore = false
        }, 1000)
      }
    },

    libraryType(){
      this.isCheckAble = false
      this.isUpLoading = false
    }
  },
  methods: {
    // 初始化数据
    init() {
      this.isCheckAble = false
      this.initPager()
    },

    // 初始化分页
    initPager() {
      this.pager = {
        pageSize: 20,
        pageCount: 6,
        total: 100,
        pageIndex: 1
      }
    },

    libInput(boolean){
      this.$refs.opPager.style.display = boolean ? 'none' : 'block'
    },

    /**
     * 移除素材
     * @param  {[type]} index [当前素材的索引]
     */
    libRemove(id) {
      if (!id.toString().length) return

      this.$confirm(`确定删除此${this.typeLabel}?`, '提示', {
        type: 'warning'
      }).then(async () => {
        if(this.libraryType === 'local'){
          this.localData[this.type['type']] = this.localData[this.type['type']].filter(item =>
            Array.isArray(id) ? !id.includes(item.resourceId) : item.resourceId !== id
          )
        }else{
          let fd = new FormData()
          fd.append('actionType', 'delete')
          fd.append('resourceIds', id)

          await this.updateLib(fd)
          
          this.libraryList = this.libraryList.filter(item =>
            Array.isArray(id) ? !id.includes(item.resourceId) : item.resourceId !== id
          )  
        }
      })
    },
    // 处理点击音频
    audioClick(event) {
      if (!this.isCheckAble) event.stopPropagation()
    },
    // 选中/选择
    libAdd(item, evt) {
      if (evt && evt.target.tagName === 'INPUT') return

      if (this.isCheckAble) {
        item.checked = !item.checked
      } else {
        this.$emit('on-add', item)
      }
    },

    // 设置是否全选
    checkChanged(val) {
      this.currentDataList.forEach(item => {
        item.checked = val
      })
    },

    // 选择文件
    fileChanged(evt) {
      let input = evt.target
      let { files } = input
      let file = [...files][0]

      // 文件的 格式
      let _fileType = file.name.split('.').slice(-1).join()
      // 允许上传的 格式
      let accepts = input.getAttribute('accept')

      if (!this.isTypeValidated(_fileType)) {
        this.$message.warning('请上传正确格式的素材')
        input.value = ''
        return
      }

      if (!this.isSizeValidated(file.size)) {
        this.$message.warning(
          `${this.typeLabel} 上传大小不得超过 ${this.type['size']}M`
        )
        input.value = ''
        return
      }

      if(this.type['type'] === 'image'){
        this.localData[this.type['type']].unshift({
          resourceId: getRandomId(),
          name: file.name,
          size: file.size,
          uri: getObjectURL(file),
        })
      }else{
        this.isUpLoading = true
        let fd = new FormData()
        fd.append('file', file)
        
        this.upload(fd)
      }
    },

    // 验证文件大小
    isSizeValidated(size) {
      return this.type['size'] * 1024 * 1024 > size
    },

    // 验证文件格式
    isTypeValidated(type) {
      return this.currentAccept.includes(type.toLowerCase())
    },

    // 更新素材
    upload(fd) {
      return this._http(this.mmsConfig.nodeUrl + this.mmsConfig.uploadFile, fd, { timeout: 90000 })
        .then(res => {

          this.$message({
            type: res.error === 0 ? 'success' : 'error',
            message: res.message
          });

          if(this.type['type'] === 'video'){
            res.data.poster = res.data.thumbnail
            delete res.data.thumbnail
          }

          res.data.resourceId = getRandomId()
          
          res.error === 0 && this.localData[this.type['type']].unshift(res.data)
        }).finally(cb => {
          this.isUpLoading = false
          if (this.$refs.file) this.$refs.file.value = ''
        })
    },

    updateLib(fd){
      return this._http(this.mmsConfig.file, fd)
        .then(res => {
          this.$message({
            type: res.error === '0' ? 'success' : 'error',
            message: res.message
          });
          if (res.error !== '0') {
            throw new Error(res.message)
          }
        })
    },

    loadMore(){
      if(!this.libraryList.length || !this.canMore) return

      this.pager.pageIndex ++
      this.fetchData(this.type['type'], true)
    },

    // 获取素材库数据
    async fetchData(type, isMore) {
      // 非加载更多，清空数据 => 切换 type
      // 
      this.libraryType = 'library'

      if(!isMore) this.libraryList = []

      this.fetchLoading = true

      let { pageIndex, pageSize } = this.pager

      this._http(this.mmsConfig.library, { type, pageIndex: pageIndex - 1, pageSize })
        .then(res => {
          if (res.error === 0) {
            let _data = res.data || []

            if(isMore){
              this.libraryList = this.libraryList.concat(_data)

              if(!_data.length){
                this.pager.pageIndex --
                this.canMore = false
              }
            }else{
              this.libraryList = _data
            }

            
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
