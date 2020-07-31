<template>
  <div style="display:flex">
    <div class="aw-editor-root" style="flex:1">
      <div class="editor-title">
        <span class="editor-title-back el-icon-arrow-left" title="返回" @click="goBack"></span> 消息名称:{{initParams.messageTitle}}
        <m-link style="display: none;" ref="goBack" :href="backUrl" />
      </div>
      <div class="editor-pane-left">
        <ul class="basic-widgets">
          <li :class="['widget', {active: currentItemType === item.type && currentItemType !== 'text'}]" v-for="item in compList" @click="addDragItem(item)">
            <editor-icon :name="item.icon" size="20" />
            <span>{{item.title}}</span>
          </li>
        </ul>
        <div class="widget-pane-wrapper" v-show="widgetPaneShow">
          <sms-library ref="library" :type="currentAddDragItem" @on-close="widgetPaneShow = false" @on-add="onLibAdd"></sms-library>
        </div>
      </div>
      <div class="editor-body">
        
        <btn-tools
          :isComposeDisabled="isComposeDisabled"
          :isSplitDisabled="isSplitDisabled"
          :resetDisabled="!mmsData.list.length"
          :saveDisabled="saveLoading || !mmsData.list.length"
          :saveLoading="saveLoading"
          @on-compose-group="composeGroup"
          @on-split-group="splitGroup"
          @on-reset="reset"
          @on-save="save"
        ></btn-tools>

        <div class="editor-canvas" ref="canvas">
          <!-- 画布 -->
          <!-- phone窗口 -->
          <div class="phone-window">
            <div :class="['phone-window_body',''] " ref="windowBody">
              <!--body--empty -->
              <div class="body-content scrollbar">
                 <!-- v-show="mmsData.list.length" -->
                <editor-draggable class="body-scrollbar" style="padding-bottom: 15px" :data="mmsData" :select-widget-id="selectWidgetId" @on-del-group="deleteGroup"></editor-draggable>
                <!-- <div v-show="!mmsData.list.length" class="widget-empty">请添加素材</div> -->
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
        <edit-pane
          :item="currentEditItem"
          :params-text="textParamsStr"
          @on-remove="onEditRemove"
          @on-close="isEditorShow = false"
          @on-add-lib="onAddLib"
        ></edit-pane>
      </div>
      <!-- 画布拖动 -->
      <div :class="['space-key-mask',{'cursor-grabbing':isMouseDown}]" v-if="isDownSpacebar" @mousedown="dropCanvas"></div>
    </div>

    <el-dialog width="400px" class="videoConf" title="资源上传中" :visible.sync="uploadProgressVisible" :close-on-click-modal="false">
      <div style="font-size:12px">
        <el-progress style="margin: 10px 0" :text-inside="true" :stroke-width="2" :show-text="false" :percentage="uploadPercentage" status="success"></el-progress>
        <p>当前进度：{{`${totalUpload - uploadPendings.length} / ${totalUpload}`}}</p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import { typesList, fileMaxSize } from '../config'
import smsLibrary from './library'
import editPane from './editPane'
import btnTools from './btnTools'
import '../assets/css/home.less'
import { getRandomId, dataURLtoFile } from '../utils.js'

function getAllData (arr) {
  return arr.map(ar => {
    if (ar.type === 'group' && ar.list.length) {
      return getAllData(ar.list)
    } else {
      return ar
    }
  })
}

function replaceTextContent(str){
  return str.replace(/<div>/g, '').replace(/(<\/div>|<br>)/g, '\n').replace(/&nbsp;/g, ' ')
}

export default {
  name: 'mms-editor',
  components: {
    smsLibrary,
    editPane,
    btnTools
  },
  props: {
    initParams: { // 初始化参数
      type: Object,
      default: () => ({})
    },
    resourceInit: String, // 素材库接口
    resourceAction: String, // 素材操作接口
    mmsTemplate: String, // 模板数据接口
    mmsSave: String, // 模板保存接口
    nodeUrl: String, // node服务接口
    backUrl: String,
    useCors: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      config: {
        nodeUrl: this.nodeUrl,
        mmsSave: this.mmsSave,
        mmsTemplate: this.mmsTemplate,
        library: this.resourceInit,
        file: this.resourceAction,
        clearFile: '/file/clear',
        uploadFile: '/upload/file',
        videoInfo: '/video/info', // 视频信息接口
        videoCut: '/video/cut', // 视频剪切接口
        videoThumbnail: '/video/thumbnail', // 视频封面接口
        videoCompress: '/video/compress', // 视频转码压缩接口
        videoWaterMark: '/video/waterMark' // 视频水印接口
      },
      isDownSpacebar: false, // 是否按下space
      isComposeGroup: false, // 是否合并
      isMouseDown: false, // 鼠标是否按下
      widgetPaneShow: false,
      mmsData: {
        list: [] // dragList
      },
      compList: typesList,
      currentAddDragItem: {},
      currentItemType: '',
      selectWidgetId: -1,
      composeGroupList: {},
      splitGroupList: {},
      currentGroupIndex: -1,
      compStauts: {
        select: 'item-selected',
        shiftSelect: 'item-shift-selected'
      },
      textParamsLen: 0,
      isEditorShow: false,
      currentEditItem: {},
      saveLoading: false, // 保存的loading
      uploadPendings: [], // 保存模板时进行中的上传
      totalUpload: 0, // 需要上传的资源数量
      uploadProgressVisible: false // 显示上传进度
    }
  },
  provide () {
    let _self = this
    return {
      setSelectWidget (data, param) {
        _self.setSelectWidget(data, param)
      },
      setSelectGroup (data, param) {
        _self.setSelectGroup(data, param)
      },
      delGroup (index) {
        _self.deleteGroup(index)
      },
      delWidget () {
        _self.deleteWidget()
      },
      setUseCors(url) {
        if(_self.useCors && url.indexOf(_self.nodeUrl) < 0 && url.substr(0, 5) !== 'blob:') {
          let newUrl = url.replace(/(http|https):\/\//gi,"").split("/")
          newUrl[0] = _self.nodeUrl + "/oss"
          return newUrl.join("/")
        } else {
          return url
        }
      },
      mmsConfig: this.config
    }
  },
  watch: {
    widgetPaneShow (visible) {
      if (!visible) this.currentItemType = ''
    },
  },
  async created () {
    if (this.mmsTemplate && this.initParams.messageId) await this.getTemplate()
  },
  mounted () {
    this.listenerPhone()
  },

  beforeDestroy(){
    this.handleClear()
  },
  computed: {
    isComposeDisabled () {
      return Object.keys(this.composeGroupList).length >= 2
    },
    isSplitDisabled () {
      return Object.keys(this.splitGroupList).length > 0
    },
    maxFileSize () {
      return fileMaxSize.split('M')[0] * 1024
    },
    fileSize () {
      let list = this.mmsData.list
      let size = 0
      let textContent = ''
      let getSzie = function g (data) {
        data.map(item => {
          if (item.list && item.list.length > 0) g(item.list)
          if (item.type == 'text') {
            textContent += item.content
            // size += Math.ceil(item.content.length/1024)
          } else if (item.type != 'group') {
            size += Math.ceil(item.size / 1024)
          }
        })
      }
      getSzie(list)
      textContent = replaceTextContent(textContent)
      let newContent = textContent
      let textLength = newContent.replace(/[^\x00-\xFF]/g, '**').length
      size += Math.ceil(textLength / 1024)
      return size
    },

    filePercentage () {
      return this.fileSize / this.maxFileSize > 1 ? 100 : Math.floor(this.fileSize / this.maxFileSize * 100)
    },
    fileStatus () {
      return this.fileSize / this.maxFileSize > 1 ? 'exception' : 'success'
    },

    toolbarDisabled () {
      return !this.mmsData.list.length
    },
    uploadPercentage(){
      return this.totalUpload === 0 ? 0 : parseInt((this.totalUpload - this.uploadPendings.length) / this.totalUpload * 100)
    },

    flatMmsList(){
      return getAllData(this.mmsData.list)
    },
    textParamsStr(){
      return this.flatMmsList.filter(item => item.type === 'text')
        .map(item => replaceTextContent(item.content)).join('')
    }
  },
  methods: {
    handleClear(){
      let localData = this.$refs.library.localData
      let { video, audio } = localData
      let localList = [...video, ...audio].map(item => item.name)

      this.clearNodeLibrary(localList)
    },
    clearNodeLibrary(data){
      this._http(this.config.nodeUrl + this.config.clearFile, data)
    },
    getTemplate () {
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
    goBack () {
      this.$confirm('未保存修改将丢失，确认返回?', '提示', {
        type: 'warning'
      }).then(res => {
        this.$refs.goBack.$el.click()
      })
    },
    listenerPhone () {
      const _self = this
      const onkeydown = e => {
        if (e.keyCode == 16) {
          this.isComposeGroup = true
          console.log('按下了shift')
        }
        if (e.keyCode == 32) {
          this.isDownSpacebar = true
          console.log('按下了space')
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
      document.addEventListener('keydown', onkeydown)
      document.addEventListener('keyup', onkeyup)
    },
    // 添加彩信组件
    addDragItem (data) {
      // 点击素材库类型，关闭编辑区
      this.isEditorShow = false
      let _data = JSON.parse(JSON.stringify(data))

      if (_data.type == 'text') {
        if (this.widgetPaneShow) {
          this.widgetPaneShow = false
        }
        this.mmsData.list.push({ ..._data, id: getRandomId() })
      } else {
        this.handleWidget(_data)
      }

      this.currentItemType = _data.type
    },

    onLibAdd (data) {
      // 点击素材添加，关闭编辑区
      this.isEditorShow = false
      let item = JSON.parse(JSON.stringify(this.currentAddDragItem))
      item = Object.assign(
        item, {
          ...data,
          id: getRandomId()
        },
        item.type === 'image' ? { imgConf: {} } : null
      )
      this.mmsData.list.push(item)
      // 添加素材后中间区域显示最底部
      this.$nextTick(() => {
        let wrapper = document.querySelector('.body-content')
        wrapper.scrollTop = wrapper.scrollHeight - wrapper.clientHeight
      })
    },

    // 打散组合
    splitGroup () {
      this.mmsData.list.splice(this.currentGroupIndex, 1, ...this.splitGroupList.list)
      this.splitGroupList = {}
      this.currentGroupIndex = -1
    },
    // 组合组件
    composeGroup () {
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
        type: 'group',
        list: newGroup
      })
    },
    // 选择组合
    setSelectGroup (data, param) {
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
    // 选择组件
    setSelectWidget (data, param) {
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
    deleteGroup (index) {
      this.mmsData.list.splice(index, 1)
    },
    deleteWidget () {
      this.currentEditItem = {}
      this.isEditorShow = false
    },
    // 移除素材
    onEditRemove (data, param) {
      let groupIndex
      let getDataIndex = function g (dataList) {
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
        this.$message.success('删除成功')
      })
    },

    handleWidget (item) {
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
    isObjectEmpty (obj) {
      return JSON.stringify(obj) == '{}'
    },
    removeElClassName (cName) {
      let allEl = Array.from(document.querySelectorAll(`.${cName}`))
      allEl.map(item => {
        item.classList.remove(cName)
      })
    },
    // 拖动画布 按住空格
    dropCanvas (evt) {
      this.isMouseDown = true
      let canvasEl = this.$refs.canvas
      let transform = canvasEl.style.transform.replace(/[^0-9\-,]/g, '').split(',')
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
    // 拖动容器
    dropWindown (evt) {
      let dropEl = evt.target.parentNode
      let gapX = evt.pageX - dropEl.offsetLeft
      let gapY = evt.pageY - dropEl.offsetTop
      dropEl.style.cursor = 'grabbing'

      document.onmousemove = (e) => {
        let x = e.pageX - gapX
        let y = e.pageY - gapY

        dropEl.style.left = x + 'px'
        dropEl.style.top = y + 'px'
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        dropEl.style.cursor = ''
      }
    },

    // 清空
    reset () {
      this.$confirm('是否清空已添加的全部素材?', '提示', {
        type: 'warning'
      }).then(() => {
        this.mmsData.list = []
        this.currentEditItem = {}
        this.isEditorShow = false
      })
    },

    onAddLib(data){
      this.$refs.library.add2Local(data)
    },

    async save () {
      this.textParamsLen = 0
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

      flatList = await this.pretreatment(flatList)

      // 提取需要字段
      let newList = flatList.map(item => {
        let _item = {}
        let { type, text, content, name = '', uri, size, resourceId, poster, duration, width, height} = item

        _item = { type, name, size }
        if (poster) _item.poster = poster
        if (duration) _item.duration = duration
        // if (width) _item.width = width
        // if (height) _item.height = height

        if (type === 'text') {
          let newContent = text || ''
          let texts = newContent.match(/<input(([\s\S])*?)>/g) || []
          for(let i = 0; i < texts.length; i++){
            this.textParamsLen ++
            newContent = newContent.replace(/<input(([\s\S])*?)>/,`{text${this.textParamsLen}}`)
          }
          _item.name = this.initParams.messageName
          _item.content = newContent.replace(/&nbsp;/g, ' ')
          _item.size = 1
        } else {
          ids.push(resourceId)
          _item.content = uri
        }
        return _item
      })

      if (!this.submitValidate(newList)) {
        this.$message.warning('模板必须包含文本')
        return
      }
      
      newList = newList.concat({ type: 'text', content: '本条短信免流量，退订回复T', size: 1 })
      let _data = { initParams: this.initParams, mmsTemplate: newList, mmsResourceIds: ids }

      this.captrue(_data)
    },
    async pretreatment (list) {
      // 黑名单，匹配未上传资源
      const blacklist = new RegExp(`(^blob:)|(^${this.config.nodeUrl})`)
      // 上传中的资源
      const pendings = []
      // 转换Blob对象的请求
      const blobCalls = []
      // 上传中的Promise队列
      const uploadCalls = []

      // Blob to File
      const blobToFile = (Blob, fileName) => {
        return new File([Blob], fileName, {lastModified: Date.now()})
      }

      /**
       * 上传方法
       * @param {Object} item - 当然资源信息对象
       * @param {File, String} file - 待上传的资源文件
       * @returns {Promise}
       */
      const upload = async (item, file) => {
        const fd = new FormData()

        fd.append('type', item.type)
        fd.append('saveResource', 'Y')
        fd.append(typeof file === 'string' ? 'fileUrl' : 'file', file)
        fd.append('actionType', 'upload')
        fd.append('size', item.size)
        // if (item.type === 'image') {
        //   fd.append('width', item.width)
        //   fd.append('height', item.height)
        // }
        if (item.type === 'video') {
          fd.append('poster', item.poster)
          fd.append('duration', item.duration)
        }

        return this._http(this.config.file, fd, { timeout: 90000 }).then(res => {
          this.$message({ type: res.type, message: res.messages })
          return res
        })
      }

      // 遍历预览区域内容，将需要上传的资源加入待上传队列
      list.forEach(item => {
        if (item.type === 'text' || !blacklist.test(item.uri)) return

        const pending = {
          source: item,
          file: null
        }

        if (item.type === 'image') {
          const blobCall = this._http(item.uri, {}, { baseURL: '', method: 'get', responseType: 'blob' }).then(res => {
            pending.file = blobToFile(res, item.name + item.fileSuffix)
            pendings.push(pending)
          })

          blobCalls.push(blobCall)
        } else {
          pending.file = item.uri
          pendings.push(pending)
        }
      })

      try {
        // 等待所有图片类型转化工作完成
        await Promise.all(blobCalls)

        if (pendings.length === 0) return list

        // 更新用于UI渲染的部分数据
        this.totalUpload = pendings.length
        this.uploadPendings = pendings.map(item => JSON.parse(JSON.stringify(item)))
        this.uploadProgressVisible = true

        // 启动队列，开始上传
        pendings.forEach((item, index) => {
          const pm = upload(item.source, item.file).then(res => {
            const { data, type } = res
            if(type !== 'success') Promise.reject('上传遇到错误，终止上传')

            // 修改资源地址及信息
            item.source.name = data.name
            item.source.size = data.size
            item.source.uri = item.source.type == "image" ? encodeURI(data.uri) : data.uri
            item.source.resourceId = data.resourceId
            item.source.poster !== undefined && (item.source.poster = data.poster)

            // 剔除上传成功的资源

            this.uploadPendings = this.uploadPendings.filter(pendingItem => pendingItem.source.id !== item.source.id)

            if(this.uploadPendings.length === 0){
              this.uploadProgressVisible = false
            }
          }).catch(res => {
            this.$message.error(res)
          })

          // 存储Promise，用于检测是否全部完成
          uploadCalls.push(pm)
        })
      } catch (err) {
        throw new Error(err)
      }
      
      try {
        await Promise.all(uploadCalls)
        return list
      } catch(err){
        console.log(err)
      }
    },

    submitValidate (datas) {
      return datas.some(data => data.type === 'text')
    },

    // 截图前处理
    beforeCaptrue () {
      this.$refs.windowBody.classList.add('isCapture')
    },

    async captrue (sData) {
      this.saveLoading = true

      await this.beforeCaptrue()

      let bodyScrollbar = document.querySelector('.body-scrollbar')
      let height = this.$refs.windowBody.offsetHeight
      let width = bodyScrollbar.offsetWidth

      html2canvas(bodyScrollbar, {
        width,
        height,
        windowWidth: document.body.clientWidth,
        windowHeight: document.body.clientHeight,
        scrollY: -window.pageYOffset, // fix: 截图时由于窗口滚动造成截图偏移， 设置为 0 不生效？？？
        scrollX: -window.pageXOffset,
        useCORS: true
      }).then(canvas => {
        let dataURL = canvas.toDataURL('image/png')
        let file = dataURLtoFile(dataURL, getRandomId() + '.png')

        let fdata = new FormData()
        fdata.append('mmsTemplateCover', file)

        // 提交字段 initParams、mmsTemplate、mmsTemplate
        fdata.append('initParams', JSON.stringify(this.initParams))
        fdata.append('mmsTemplate', JSON.stringify(sData.mmsTemplate))
        fdata.append('mmsResourceIds', sData.mmsResourceIds)
        fdata.append('mmsOriginalTemplate', JSON.stringify(this.mmsData.list))
        fdata.append('placeholderNum', this.textParamsLen)

        this.submit(fdata)
      })
    },
    submit (fd) {
      this._http(this.mmsSave, fd).then(res => {
        // 保存后的处理
        this.handleRes(res)
      }).catch(err => {
        this.$message.error('请求失败')
      }).finally(end => {
        this.$refs.windowBody.classList.remove('isCapture')
        this.saveLoading = false
      })
    },

    handleRes (resp) {
      if (resp && this.$root.moqui.isPlainObject(resp)) {
        this.$root.moqui.notifyMessages(resp.messageInfos, resp.errors)

        this.initParams.messageId = resp.screenParameters.messageId
        // 保存后将素材 type 清空，实现再次点击素材库刷新
        this.currentAddDragItem = {}
      } else {
        this.$message.error('保存错误')
        console.warn('m-form no response or non-JSON response: ' + JSON.stringify(resp))
      }
    }
  }

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
