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
        <el-button size="small" @click="isCheckAble = true">批量操作</el-button>
        <el-popover style="margin-left: 10px;" placement="bottom" trigger="hover" :content="popoverContent">
          <el-button slot="reference" type="primary" size="small" :disabled="isUpLoading" :icon="`el-icon-${isUpLoading ? 'loading' : 'upload'}`" @click="$refs.file.click()">上传{{ typeLabel }}</el-button>
        </el-popover>
        <input style="display: none;" ref="file" type="file" :accept="currentAccept" name="upload" @change="fileChanged" />
      </template>
    </div>
    <div class="library--content scrollbar" :class="{'no-data': !dataList.length}" v-loading="fetchLoading">
      <!-- 图片/视频 -->
      <div class="lib-list" :class="{'isCheckable': isCheckAble}">
        <template>
          <div v-for="(item, index) in dataList" :key="item.resourceId" :class="[
              'lib-item',
              {
                'lib-item--checked': item.checked,
                'lib-item--audio': type.type === 'audio',
              },
            ]"

            @click="libAdd(item, index, $event)"
          >
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
            <div class="lib-name" v-if="item.name" :title="isCheckAble || !isEditAble ? '' : '双击可编辑'">
               <!-- @dblclick="nameEdit" -->
              <div class="lib-name-word">{{ item.name }}</div>
              <span class="lib-name-icon el-icon-edit" @click.stop="nameEdit"></span>
              <input class="lib-name-input" :value="item.name" @blur="(evt) => nameEdited(evt, item)" />
            </div>
          </div>
        </template>
       
      </div>
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
      isEditAble: false, // 可编辑名称
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
        await this.updateLib({ type: 'delete', id })

        this.dataList = this.dataList.filter(item => 
          Array.isArray(id) ? !id.includes(item.resourceId) : item.resourceId !== id
        )
      })
    },
    // 处理点击音频
    audioClick(event){
      if(!this.isCheckAble) event.stopPropagation()
    },
    // 选中/选择
    libAdd(item, index, evt) {
      if(evt.target.tagName === 'INPUT') return

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
      input.select()
    },

    // 文件名编辑结束
    nameEdited(evt, item) {
      let target = evt.target
      let parent = target.offsetParent

      parent.classList.remove('isEdit')

      let value = target.value
      if (value !== item.name) {
        console.log('名称修改过')
        this.updateLib({type: 'rename', id: item.resourceId, name: value})
        item.name = value
      }
    },

    /**
     * 更新素材库
     * @param  {[string/number/array]} id   [素材 id]
     * @param  {[string]} name [素材名]
     * 没有 name 则删除素材
     */
    updateLib({ type, id, name }) {
      let fd = new FormData()
      fd.append('actionType', type)
      name && fd.append('filename', name)

      this.beforeUpload(fd, id)
    },

    // 选择文件
    fileChanged(evt) {
      let input = evt.target
      let { files } = input
      let file = [...files][0]

      if (!this.isSizeValidated(file.size)) {
        input.value = ''
        return this.$message.warning(
          `${this.typeLabel} 上传大小不得超过 ${this.type['size']}M`
        )
      }

      this.isUpLoading = true
      let formData = new FormData()

      formData.append('file', file)
      formData.append('actionType', 'upload')

      this.beforeUpload(formData)
    },

    // 验证文件大小
    isSizeValidated(size) {
      return this.type['size'] * 1024 * 1024 > size
    },

    beforeUpload(fd, id){
      fd.append('type', this.type['type'])
      fd.append('saveResource', 'Y')
      
      if(this.type['type'] === 'video'){
        fd.append('thumbnailGenratedUrl', this.mmsConfig.nodeUrl + this.mmsConfig.videoThumbnail)
      }

      id && fd.append('resourceIds', id)

      this.handleUpload(fd)
    },

    // 上传、删除
    handleUpload(fd) {
      this._http(this.mmsConfig.file, fd)
      .then(res => {
        let actionType = fd.get('actionType')

        switch(actionType){
          case 'upload':
            this.dataList.unshift(res);
            this.$message.success('上传成功');
            break;
          case 'delete':
            this.$message({
              type: res.error === '0' ? 'success' : 'error',
              message: res.message
            });
            break;
          case 'renama':
            this.$message.success('文件名修改成功');
          default: break;
        }
        
      }).finally(cb => {
        this.isUpLoading = false
        if(this.$refs.file) this.$refs.file.value = ''
      })

    },
   
    // 获取素材库数据
    async fetchData(type) {
      this.dataList = []
      this.fetchLoading = true

      let {pageIndex, pageSize} = this.pager

      this._http(this.mmsConfig.library, { type, pageIndex: pageIndex - 1, pageSize })
      .then(res => {
        if(res.error === 0){
          this.dataList = [...res.data]
        }
        this.fetchLoading = false
      }).catch(err => {
        this.fetchLoading = false
      })
    }
  },
};
</script>