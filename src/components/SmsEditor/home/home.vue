<template>
  <div style="display:flex">
    <div class="aw-editor-root" style="flex:1">
      <div class="editor-title">
        <span class="editor-title-back el-icon-arrow-left" title="返回" @click="goBack"></span> 消息名称:{{initParams.messageTitle}}
      </div>
      <div class="editor-pane-left">
        <ul class="basic-widgets">
          <li :class="['widget', {active: currentItemType === item.type && currentItemType !== 'text'}]" v-for="item in compList" @click="addDragItem(item)">
            <editor-icon :name="item.icon" size="20" />
            <span>{{item.title}}</span>
          </li>
        </ul>
        <div class="widget-pane-wrapper" v-show="widgetPaneShow">
          <sms-library :type="currentAddDragItem" @on-close="widgetPaneShow = false" @on-add="onLibAdd"></sms-library>
        </div>
      </div>
      <div class="editor-body">
        <div class="toolbar-wrapper" style="margin-bottom:20px">
          <!-- <div class="toolbar-item">撤销</div>
          <div class="toolbar-item">恢复</div> -->
          <div :class="['toolbar-item',{'disabled':!isComposeDisabled}]" @click="composeGroup">
            <editor-icon name="zuhe" size="20" />&nbsp;组合
          </div>
          <div :class="['toolbar-item',{'disabled':!isSplitDisabled}]" @click="splitGroup">
            <editor-icon name="chaisan1" size="20" />&nbsp;打散
          </div>
          <div class="toolbar-item" @click="reset" :class="{disabled: !mmsData.list.length}">
            <editor-icon name="shanchu" size="16" />&nbsp;清空
          </div>
          <!-- <div class="toolbar-item">
            <editor-icon name="yulan" size="16" />&nbsp;预览
          </div> -->
          <!-- style="justify-content: 'space-evenly';width: 86px;" -->
          <div class="toolbar-item" :class="{'disabled': saveLoading || !mmsData.list.length}" @click="save">
            <editor-icon v-if="!saveLoading" name="baocun" size="16" />
            <i v-else class="el-icon-loading" style="font-size: 16px;"></i>&nbsp;保存<font v-if="saveLoading">中</font>
          </div>
          <el-popover placement="top" width="200" trigger="click">
            <div class="toolbar-item" slot="reference">
              <editor-icon name="bangzhu" size="20" />&nbsp;帮助
            </div>
            <div class="shortcut_title">
              <div class="title">快捷键</div>
            </div>
            <div class="shortcut">
              <div class="name">文本编辑</div>
              <div class="key">
                <div><kbd>鼠标双击</kbd></div>
              </div>
            </div>
            <div class="shortcut">
              <div class="name">多选</div>
              <div class="key">
                <div><kbd>Shift</kbd>+<kbd>鼠标单击</kbd></div>
              </div>
            </div>
            <div class="shortcut">
              <div class="name">拖动画布</div>
              <div class="key">
                <div><kbd>Space</kbd>+<kbd>鼠标拖拽</kbd></div>
              </div>
            </div>
          </el-popover>
        </div>
        <div class="editor-canvas" ref="canvas">
          <!-- 画布 -->
          <!-- phone窗口 -->
          <div class="phone-window">
            <div :class="['phone-window_body',''] " ref="windowBody">
              <!--body--empty -->
              <div class="body-content scrollbar">
                <editor-draggable style="padding-bottom: 15px" :data="mmsData" :select-widget-id="selectWidgetId" @on-del-group="deleteGroup"></editor-draggable>
                <div v-show="!mmsData.list" class="widget-empty">asdasda</div>
              </div>
            </div>
          </div>
        </div>
        <div class="toolbar-wrapper" style="margin-top:20px">
          <div class="file-size">
            <p class="fileSize-process-word" v-if="fileStatus === 'exception'">超过最大限制</p>
            <el-progress class="progress" :stroke-width="6" :percentage="filePercentage" :status="fileStatus"></el-progress>
            <div class="size-info">
              <span>文件大小： {{fileSize}}K</span>
              <span>{{maxFileSize}} K</span>
            </div>
          </div>
        </div>
      </div>
      <div class="editor-pane-right" :class="{eidtorPaneShow: isEditorShow}">
        <edit-pane :item="currentEditItem" @on-remove="onEditRemove" @on-close="isEditorShow = false"></edit-pane>
      </div>
      <!-- 画布拖动 -->
      <div :class="['space-key-mask',{'cursor-grabbing':isMouseDown}]" v-if="isDownSpacebar" @mousedown="dropCanvas"></div>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import { typesList, fileMaxSize } from "../config"
import smsLibrary from './library'
import editPane from './editPane'
import saveConfirm from './saveConfirm'
import '../assets/css/home.less'

function getRandomId() {
  let maxNumber = 99999999
  let minNumber = 1000000
  let range = maxNumber - minNumber; //取值范围的差
  let random = Math.random(); //小于1的随机数
  return minNumber + Math.round(random * range);
}



function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function getAllData(arr) {
  return arr.map(ar => {
    if (ar.type === 'group' && ar.list.length) {
      return getAllData(ar.list)
    } else {
      return ar
    }
  })
}

export default {
  name: "mms-editor",
  components: {
    smsLibrary,
    editPane,
    saveConfirm
  },
  props: {
    initParams: { //初始化参数
      type: Object,
      default: () => ({})
    },
    resourceInit: String, //素材库接口
    resourceAction: String, //素材操作接口
    mmsTemplate: String, //模板数据接口
    mmsSave: String, //模板保存接口
    nodeUrl: String, //node服务接口
  },
  data() {
    return {
      config: {
        nodeUrl: this.nodeUrl,
        mmsSave: this.mmsSave,
        mmsTemplate: this.mmsTemplate,
        library: this.resourceInit,
        file: this.resourceAction,
        videoInfo: '/video/info', //视频信息接口
        videoCut: '/video/cut', //视频剪切接口
        videoThumbnail: '/video/thumbnail', //视频封面接口
        videoCompress: '/video/compress', //视频转码压缩接口
        videoWaterMark: '/video/waterMark', //视频水印接口
      },
      isDownSpacebar: false, //是否按下space
      isComposeGroup: false, //是否合并
      isMouseDown: false, // 鼠标是否按下
      widgetPaneShow: false,
      mmsData: {
        list: [] //dragList
      },
      compList: typesList,
      currentAddDragItem: {},
      currentItemType: '',
      selectWidgetId: -1,
      composeGroupList: {},
      splitGroupList: {},
      currentGroupIndex: -1,
      compStauts: {
        select: "item-selected",
        shiftSelect: "item-shift-selected"
      },

      isEditorShow: false,
      currentEditItem: {},
      saveLoading: false, // 保存的loading
    }
  },
  provide() {
    let _self = this
    return {
      setSelectWidget(data, param) {
        _self.setSelectWidget(data, param)
      },
      setSelectGroup(data, param) {
        _self.setSelectGroup(data, param)
      },
      delGroup(index) {
        _self.deleteGroup(index)
      },
      delWidget() {
        _self.deleteWidget()
      },
      mmsConfig: this.config
    }
  },
  watch: {
    widgetPaneShow(visible) {
      if (!visible) this.currentItemType = ''
    }
  },
  async created() {
    if (this.mmsTemplate && this.initParams.messageId) await this.getTemplate()
  },
  mounted() {
    this.listenerPhone()
  },
  computed: {
    isComposeDisabled() {
      return Object.keys(this.composeGroupList).length >= 2
    },
    isSplitDisabled() {
      return Object.keys(this.splitGroupList).length > 0
    },
    maxFileSize() {
      return fileMaxSize.split('M')[0] * 1024
    },
    fileSize() {
      let list = this.mmsData.list
      let size = 0
      let textContent = ""
      let getSzie = function g(data) {
        data.map(item => {
          if (item.list && item.list.length > 0) g(item.list)
          if (item.type == "text") {
            textContent += item.content
            // size += Math.ceil(item.content.length/1024)
          } else if (item.type != "group") {
            size += Math.ceil(item.size / 1024)
          }
        })
      }
      getSzie(list)
      textContent = this.replaceTextContent(textContent)
      let newContent = textContent
      let textLength = newContent.replace(/[^\x00-\xFF]/g, '**').length;
      size += Math.ceil(textLength / 1024)
      return size
    },

    filePercentage() {
      return this.fileSize / this.maxFileSize > 1 ? 100 : Math.floor(this.fileSize / this.maxFileSize * 100)
    },
    fileStatus() {
      return this.fileSize / this.maxFileSize > 1 ? 'exception' : 'success'
    },

    toolbarDisabled() {
      return !this.mmsData.list.length
    }
  },
  methods: {
    getTemplate() {
      this._http(this.mmsTemplate, {
        messageId: this.initParams.messageId
      }).then(res => {
        if (res.error !== 0) {
          this.$message.warning('请求错误')
        } else {
          this.mmsData.list = JSON.parse(res.data)
        }
      }).catch(err => {
        this.$message.error('请求失败')
      })
    },
    goBack() {
      this.$confirm('即将丢失所有修改，确认返回?', '提示', {
        type: 'warning'
      }).then(res => {
        window.history.back()
      })
    },
    replaceTextContent(val) {
      return val.replace(/<div>/g, "").replace(/(<\/div>|<br>)/g, "\n").replace(/&nbsp;/g, " ")
    },
    listenerPhone() {
      const _self = this
      const onkeydown = e => {
        if (e.keyCode == 16) {
          this.isComposeGroup = true
          console.log("按下了shift");
        }
        if (e.keyCode == 32) {
          this.isDownSpacebar = true
          console.log("按下了space");
        }
      }
      const onkeyup = e => {
        if (e.keyCode == 16) {
          this.isComposeGroup = false
          document.onclick = (evt) => {
            this.removeElClassName(this.compStauts.shiftSelect)
            this.composeGroupList = {}
            document.onclick = null
          }
        }
        if (e.keyCode == 32) {
          this.isDownSpacebar = false
        }
      }
      document.addEventListener("keydown", onkeydown)
      document.addEventListener("keyup", onkeyup)

    },
    //添加彩信组件
    addDragItem(data) {

      // 点击素材库类型，关闭编辑区
      this.isEditorShow = false
      let _data = JSON.parse(JSON.stringify(data))

      if (_data.type == "text") {
        if (this.widgetPaneShow) {
          this.widgetPaneShow = false
        }
        this.mmsData.list.push({ ..._data, id: getRandomId() })
      } else {
        this.handleWidget(_data)
      }

      this.currentItemType = _data.type
    },

    onLibAdd(data) {
      // 点击素材添加，关闭编辑区
      this.isEditorShow = false
      let item = JSON.parse(JSON.stringify(this.currentAddDragItem))
      item = Object.assign(
        item, {
          ...data,
          id: getRandomId()
        },
        item.type === 'image' ? { imgConf: {} } : null,
      )
      this.mmsData.list.push(item)
      // 添加素材后中间区域显示最底部
      this.$nextTick(() => {
        let wrapper = document.querySelector('.body-content')
        wrapper.scrollTop = wrapper.scrollHeight - wrapper.clientHeight
      })
    },

    //打散组合
    splitGroup() {
      this.mmsData.list.splice(this.currentGroupIndex, 1, ...this.splitGroupList.list)
      this.splitGroupList = {}
      this.currentGroupIndex = -1
    },
    //组合组件
    composeGroup() {
      if (this.isObjectEmpty(this.composeGroupList)) return
      let list = this.mmsData.list
      let newGroup = []
      let firstSelectedItem = list[this.currentGroupIndex]
      for (const key in this.composeGroupList) {
        let item = this.composeGroupList[key]
        newGroup.push(item)
        if (firstSelectedItem.id != item.id) {
          list.splice(list.indexOf(item), 1)
        }
      }
      this.composeGroupList = {}
      this.currentGroupIndex = -1
      list.splice(list.indexOf(firstSelectedItem), 1, {
        id: getRandomId(),
        type: "group",
        list: newGroup
      })
    },
    //选择组合
    setSelectGroup(data, param) {
      let el = param.evt
      if (this.selectWidgetId == data.id) {
        this.splitGroupList = {}
        this.selectWidgetId = -1
      } else {
        this.splitGroupList = data
        this.currentGroupIndex = param.index
        this.selectWidgetId = data.id
      }
    },
    //选择组件
    setSelectWidget(data, param) {
      if (this.isComposeGroup) {
        if (!param.isGroup) {
          let el = param.evt
          let elClassArr = Array.from(el.classList)
          if (elClassArr.indexOf(this.compStauts.shiftSelect) > -1) {
            el.classList.remove(this.compStauts.shiftSelect)
            // delete this.composeGroupList[param.index]
            this.$delete(this.composeGroupList, param.index)
          } else {
            el.classList.add(this.compStauts.shiftSelect)
            if (this.isObjectEmpty(this.composeGroupList)) {
              this.currentGroupIndex = param.index
            }
            this.$set(this.composeGroupList, param.index, data)
            // this.composeGroupList[data.id] = data
          }
        }
      } else {
        this.selectWidgetId = data.id
        this.currentEditItem = data
        this.isEditorShow = true
      }
    },
    deleteGroup(index) {
      this.mmsData.list.splice(index, 1)
    },
    deleteWidget() {
      this.currentEditItem = {}
      this.isEditorShow = false
    },
    // 移除素材
    onEditRemove(data, param) {
      let groupIndex
      let getDataIndex = function g(dataList) {
        let listIndex
        dataList.map((item, index) => {
          if (item.list && item.list.length > 0) {
            let resp = g(item.list)
            if (resp != undefined) {
              groupIndex = [index, resp]
            }
          } else {
            if (item.id == data.id) {
              listIndex = index
              groupIndex = [index]
            }
          }
        })
        return listIndex
      }
      getDataIndex(this.mmsData.list)
      this.$confirm(`确定删除此${data.title}?`, '提示', {
        type: 'warning'
      }).then(async () => {
        if (groupIndex.length > 1) {
          this.mmsData.list[groupIndex[0]].list.splice(groupIndex[1], 1)
          if (this.mmsData.list[groupIndex[0]].list.length == 0) {
            this.mmsData.list.splice(groupIndex[0], 1)
          }
        } else {
          this.mmsData.list.splice(groupIndex[0], 1)
        }
        this.currentEditItem = {}
        this.isEditorShow = false
        this.$message.success('删除成功');
      })
    },

    handleWidget(item) {
      if (!this.widgetPaneShow) {
        this.currentAddDragItem = item
        this.widgetPaneShow = true
      } else {
        if (this.currentAddDragItem.type !== item.type) {
          this.currentAddDragItem = item
        } else {
          this.widgetPaneShow = false
        }
      }
    },
    isObjectEmpty(obj) {
      return JSON.stringify(obj) == "{}"
    },
    removeElClassName(cName) {
      let allEl = Array.from(document.querySelectorAll(`.${cName}`))
      allEl.map(item => {
        item.classList.remove(cName)
      })
    },
    //拖动画布 按住空格
    dropCanvas(evt) {
      this.isMouseDown = true
      let canvasEl = this.$refs.canvas
      let transform = canvasEl.style.transform.replace(/[^0-9\-,]/g, "").split(",")
      let pos = {
        x: transform.length == 1 ? 0 : parseInt(transform[0]),
        y: transform.length == 1 ? 0 : parseInt(transform[1])
      }
      let mousePos = {
        x: evt.pageX,
        y: evt.pageY
      }
      document.onmousemove = (e) => {
        let x = e.pageX - mousePos.x + pos.x
        let y = e.pageY - mousePos.y + pos.y
        canvasEl.style.transform = `translate(${x}px,${y}px)`

      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        this.isMouseDown = false
      }
    },
    //拖动容器
    dropWindown(evt) {
      let dropEl = evt.target.parentNode
      let gapX = evt.pageX - dropEl.offsetLeft
      let gapY = evt.pageY - dropEl.offsetTop
      dropEl.style.cursor = "grabbing"

      document.onmousemove = (e) => {
        let x = e.pageX - gapX
        let y = e.pageY - gapY

        dropEl.style.left = x + "px"
        dropEl.style.top = y + "px"
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        dropEl.style.cursor = ""
      }
    },

    // 清空
    reset() {
      this.$confirm('是否清空已添加的全部素材?', '提示', {
        type: 'warning'
      }).then(() => {
        this.mmsData.list = []
        this.currentEditItem = {}
        this.isEditorShow = false
      })
    },



    save() {
      this.widgetPaneShow = this.isEditorShow = false

      if (!this.mmsData.list.length) return

      if (this.fileSize > this.maxFileSize) {
        this.$message.warning(`文件大小不能超过 ${this.maxFileSize}K`)
        return false
      }

      // 获取扁平模板数据
      let flatList = getAllData(this.mmsData.list).flat(3)

      // 提交参数 mmsResourceIds
      let ids = []

      // 提取需要字段
      let newList = flatList.map(item => {
        let _item = {}
        let { type, content, name = '', uri, size, resourceId, poster } = item

        _item = { type, name, size }
        if (poster) _item.poster = poster

        if (item.type === 'text') {
          let newContent = this.replaceTextContent(content)

          _item.name = this.initParams.messageName
          _item.content = newContent
          _item.size = 1
        } else {
          ids.push(resourceId)
          _item.content = uri
        }

        return _item
      })

      if(!this.submitValidate(newList)){
        this.$message.warning('模板必须包含文本');
        return
      }

      let _data = { initParams: this.initParams, mmsTemplate: newList, mmsResourceIds: ids }

      this.captrue(_data)
    },

    submitValidate(datas){
      return datas.some(data => data.type === 'text')
    },

    // 截图前处理
    beforeCaptrue() {
      this.$refs.windowBody.classList.add('isCapture')
      document.querySelector('.body-content').scrollTop = 0
    },

    async captrue(sData) {
      this.saveLoading = true

      await this.beforeCaptrue()

      let wBody = this.$refs.windowBody
      let height = wBody.clientHeight
      let width = wBody.clientWidth

      html2canvas(wBody, {
        width,
        height,
        useCORS: true
      }).then(canvas => {
        let dataURL = canvas.toDataURL('image/png')
        let file = dataURLtoFile(dataURL, getRandomId() + '.png')

        // this.mmsData.list = oldList

        let fdata = new FormData()
        fdata.append('mmsTemplateCover', file)

        // 提交字段 initParams、mmsTemplate、mmsTemplate
        fdata.append('initParams', JSON.stringify(this.initParams))
        fdata.append('mmsTemplate', JSON.stringify(sData.mmsTemplate))
        fdata.append('mmsResourceIds', sData.mmsResourceIds)
        fdata.append('mmsOriginalTemplate', JSON.stringify(this.mmsData.list))

        this.submit(fdata)

      })
    },
    submit(fd) {
      this._http(this.mmsSave, fd).then(res => {
        this.$message.success('保存成功')
      }).catch(err => {
        this.$message.error('请求失败')
      }).finally(end => {
        this.$refs.windowBody.classList.remove('isCapture')
        this.saveLoading = false
      })
    }
  },

}

</script>
<style lang="less">
.file-size {
  position: relative;
}

.fileSize-process-word {
  position: absolute;
  top: -13px;
  right: 0;
  color: #F56C6C;
  font-size: 12px;
}

.editor-title {
  position: absolute;
  font-size: 14px;
  line-height: 40px;
  z-index: 2;

  .editor-title-back {
    padding: 4px;
    vertical-align: middle;
    font-size: 16px;
    color: #409EFF;
    font-weight: bold;
    cursor: pointer;
  }
}

</style>
