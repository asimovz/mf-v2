<template>
  <div class="library library--wrapper">
    <div class="header">
      <span>我的{{typeLabel}}</span>
      <span class="close" @click="$emit('on-close')"><i class="el-icon-close"></i></span>
    </div>
    <div class="operation">
      <!-- 选择模式 -->
      <template v-if="isCheckAble">
        <el-checkbox :indeterminate="isIndeterminate" style="float: left;margin-top: 5px;" :value="checkAll" @change="checkChanged">全选</el-checkbox>
        <el-button size="small" type="danger" :disabled="!checkedId.length " @click="libRemove(checkedId)">删除</el-button>
        <el-button size="small" type="primary" @click="isCheckAble = false">取消</el-button>
      </template>
      <!-- 编辑模式 -->
      <template v-else>
        <el-button size="small" :disabled="isUpLoading" @click="isCheckAble = true">批量操作</el-button>
        <el-popover style="margin-left: 10px;" placement="bottom" trigger="hover" :content="popoverContent">
          <el-button slot="reference" type="primary" size="small" :disabled="isUpLoading" :icon="`el-icon-${isUpLoading ? 'loading' : 'upload'}`" @click="$refs.file.click()">上传{{ typeLabel }}</el-button>
        </el-popover>
        <input style="display: none;" ref="file" type="file" :accept="currentAccept" name="upload" @change="fileChanged" />
      </template>
    </div>
    <div class="library--content scrollbar"
      :class="{'no-data': !dataList.length}"
      v-loading="fetchLoading || isUpLoading"
      :element-loading-text="isUpLoading ? `${type['type'] === 'video' ? '转码' : ''}上传中，请稍后...` : ''"
      :element-loading-spinner="isUpLoading ? 'el-icon-loading' : ''"
      :element-loading-background="isUpLoading ? 'rgba(0, 0, 0, 0.8)' : ''"
    >
      <transition-group name="fade" tag="div" class="lib-list" :class="{'isCheckable': isCheckAble}">
        <div :title="isCheckAble ? '选中' : type.type !== 'audio' ? `添加${typeLabel}` : ''" v-for="(item, index) in dataList" :key="item.resourceId" :class="[
            'lib-item',
            {
              'lib-item--checked': item.checked,
              'lib-item--audio': type.type === 'audio',
            },
          ]" @click="libAdd(item, index, $event)">
          <span class="lib-remove el-icon-error" @click.stop="libRemove(item.resourceId)"></span>
          <div class="lib-preview">
            <img :src="item.uri" v-if="type['type'] === 'image'" />
            <template v-else-if="type['type'] === 'video'">
              <img v-if="item.poster" :src="item.poster" />
              <video v-else :src="item.uri"></video>
              <!-- <widget-video v-else :data="{...item, uri: item.src}" :showControls="false"></widget-video> -->
            </template>
            <template v-else>
              <widget-audio :showPlusBtn="true" :data="{ uri: item.uri }" @click.native="audioClick">
                <div class="lib-add el-icon-plus" :title="`${isCheckAble ? '选中' : '添加音频素材'}`" @click.stop="libAdd(item, index)"></div>
              </widget-audio>
            </template>
          </div>
          <!-- :title="isCheckAble || !isEditAble ? '' : '双击可编辑'" -->
          <div class="lib-name" v-if="item.name" :title="item.name">
            <!-- @dblclick="nameEdit" -->
            <div class="lib-name-word">{{ item.name }}</div>
            <span title="重新命名" class="lib-name-icon el-icon-edit" @click.stop="nameEdit"></span>
            <input class="lib-name-input" :value="item.name" @blur="(evt) => nameEdited(evt, item)" />
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
/*<div class="lib-name" :title="isCheckAble ? '' : '双击可编辑'"
  :contenteditable="isEditAble"
  @dblclick="evt => libNameFocus(evt, item)"
  @blur="evt => libNameBlur(evt, item)"
>{{item.name}}</div>*/

import widgetVideo from '../components/widget-comps/video.vue'
import widgetAudio from '../components/widget-comps/audio.vue'
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

function getRandomId() {
  return Math.ceil(Math.random() * 100000)
}

function movetoEnd(el){
  let range = window.getSelection()
  range.selectAllChildren(el)
  range.collapseToEnd()
  el.select()
}

export default {
  components: {
    widgetVideo,
    widgetAudio
  },
  props: {
    type: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fetchLoading: false,
      dataList: [],

      pager: {
        pageSize: 20,
        total: '',
        pageCount: '',
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
      return this.dataList.filter(item => item.checked).map(item => item.resourceId)
    },
    // 半选
    isIndeterminate() {
      return this.dataList.some(item => item.checked) && !this.dataList.every(item => item.checked)
    }
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
          if (val.length === this.dataList.length) {
            this.checkAll = true
          }
        } else {
          this.checkAll = false
        }

      },
      deep: true
    },

    isCheckAble(visible) {
      this.checkAll = false

      this.dataList = this.dataList.map(item => {
        return {
          ...item,
          checked: false
        }
      })
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
        total: '',
        pageCount: '',
        pageIndex: 1
      }
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

        let fd = new FormData()
        fd.append('actionType', 'delete')
        fd.append('resourceIds', id)
        await this.updateLib(fd)


        this.dataList = this.dataList.filter(item =>
          Array.isArray(id) ? !id.includes(item.resourceId) : item.resourceId !== id
        )
      })
    },
    // 处理点击音频
    audioClick(event) {
      if (!this.isCheckAble) event.stopPropagation()
    },
    // 选中/选择
    libAdd(item, index, evt) {
      if (evt && evt.target.tagName === 'INPUT') return

      if (this.isCheckAble) {
        item.checked = !item.checked
      } else {
        this.$emit('on-add', item)
      }
    },

    // 设置是否全选
    checkChanged(val) {
      this.dataList.forEach(item => {
        item.checked = val
      })
    },

    // 文件名编辑
    nameEdit(evt) {
      // if (!this.isEditAble) return

      let target = evt.target
      let parent = target.offsetParent

      parent.classList.add('isEdit')

      let input = target.parentElement.querySelector('input')
      input.focus()

      this.$nextTick(() => {
        movetoEnd(input)
      })
    },

    // 文件名编辑结束
    nameEdited(evt, item) {
      let target = evt.target
      let parent = target.offsetParent

      parent.classList.remove('isEdit')

      let value = target.value
      if (value !== item.name) {
        console.log('名称修改过')

        let fd = new FormData()
        fd.append('actionType', 'rename')
        fd.append('resourceId', item.resourceId)
        fd.append('newFileName', value)

        this.updateLib(fd)

        item.name = value
      }
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

      if(!this.isTypeValidated(_fileType)) {
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

      this.isUpLoading = true
      let fd = new FormData()

      fd.append('type', this.type['type'])
      fd.append('saveResource', 'Y')
      fd.append('file', file)
      fd.append('actionType', 'upload')
      if (this.type['type'] === 'video') {
        fd.append('thumbnailGenratedUrl', this.mmsConfig.nodeUrl + this.mmsConfig.videoThumbnail)
      }

      this.updateLib(fd)
    },

    // 验证文件大小
    isSizeValidated(size) {
      return this.type['size'] * 1024 * 1024 > size
    },

    // 验证文件格式
    isTypeValidated(type){
      return this.currentAccept.includes(type)
    },


    // 更新素材
    updateLib(fd) {
      this._http(this.mmsConfig.file, fd, { timeout: 90000 })
        .then(res => {
          let actionType = fd.get('actionType')

          switch (actionType) {
            case 'upload':
              this.$message({
                type: res.type || 'warning',
                message: res.messages
              });
              res.type === 'success' && this.dataList.unshift(res)
              break;
            case 'delete':
            case 'rename':
              this.$message({
                type: res.error === '0' ? 'success' : 'error',
                message: res.message
              });
              break;
            default:
              break;
          }

        }).finally(cb => {
          this.isUpLoading = false
          if (this.$refs.file) this.$refs.file.value = ''
        })
    },

    // 获取素材库数据
    async fetchData(type) {
      this.dataList = []
      this.fetchLoading = true

      let { pageIndex, pageSize } = this.pager

      this._http(this.mmsConfig.library, { type, pageIndex: pageIndex - 1, pageSize })
        .then(res => {
          if (res.error === 0) {
            this.dataList = [...res.data]
          }
        }).finally(end => {
          this.fetchLoading = false
        })
    }
  },
};

</script>
