<template>
    <el-dialog title="编辑图片" class="img-modal" width="1000px" :visible.sync="visible" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :before-close="beforeClose" @close="closedCb">
      <div class="editor-container">
        <div class="add">
          <div class="add-box" @click="addText">
            <editor-icon name="wenzi" />
            <span class="text">文本</span>
          </div>
          <label for="uploadsImg">
            <div class="add-box">
              <editor-icon name="tupian" />
              <span class="text">图片</span>
            </div>
          </label>
        </div>
        <div class="preview"   >
          <div class="wrapper" ref="imageWrapper">
            <div :style="previewResize">
              <template v-for="(item, index) in configList" contenteditable="true">
                <vue-drag-resize                
                  @click.native="itemClick(...arguments, index, item)"
                  @dblclick.native.stop="itemDblclick(...arguments, item)"
                  :preventActiveBehavior = "true"
                  ref="vdr"
                  :key="item.key"
                  :style="{zIndex: index+1,background:item.background,}" 
                  :parentLimitation="true"
                  :minw=50
                  :minh=50
                  :parentW="w"  
                  :parentH="h || 0"
                  :x="item.left"
                  :y="item.top"
                  :w="item.width"
                  :h="item.height"
                  :isActive="selectedItem && item.key === selectedItem.key && item.key !== textEditKey"
                  v-on:resizing="itemResize(...arguments, item)"
                  v-on:dragging="itemResize(...arguments, item)"
                  >
                  <editText 
                    v-if="item.type === 'text'"
                    v-bind="item"
                    :edit="item.key === textEditKey"
                    @textChange="textChange(...arguments, item)"
                    style="width:100%;height: 100%;">
                  </editText>
                  <img v-show="item.type === 'img'" style="width:100%;height: 100%" :src="item.url">
                </vue-drag-resize>
              </template>
            </div>
            
            <div :style="previewStyle" @click="editBaseImg" v-if="previews">
              <div :style="previews.div">
                <img :src="previews.url" :style="previews.img">
              </div>
            </div>
          </div>
        </div>
        <div class="config">
          <div class="img-editor" v-show="!selectedItem || (selectedItem && selectedItem.type==='img')">
            <div class="cropper">
              <!-- 底图编辑 -->
              <vueCropper
                v-show="!selectedItem"
                ref="cropper"
                :img="configData.baseImg"
                :autoCrop="true"
                :infoTrue="true"
                :full="true"
                :centerBox="true"
                :canScale="false"
                :canMove="false"
                autoCropWidth=3000
                autoCropHeight=3000
                @realTime="realTime"
              ></vueCropper>
              <!-- 底图上的图层编辑 -->
              <vueCropper
                v-if="selectedItem"
                ref="cropperItem"
                :img="selectedItem.baseUrl"
                :autoCrop="true"
                :infoTrue="true"
                :full="true"
                :centerBox="true"
                :canScale="false"
                :canMove="false"
                autoCropWidth=3000
                autoCropHeight=3000
                @imgLoad="imgLoad(data)"
                @realTime="realTime"
              ></vueCropper>
            </div>
            <div class="controllers">
              <el-tooltip content="放大">
                <div class="icon-button" @click="changeScale(1)">
                  <i class="el-icon-zoom-in" ></i>
                </div>
              </el-tooltip>
              <el-tooltip content="缩小">
                <div class="icon-button" @click="changeScale(-1)">
                  <i class="el-icon-zoom-out" ></i>
                </div>
              </el-tooltip>
              <el-tooltip content="左转90度">
                <div class="icon-button" @click="rotate('left')">
                  <i class="el-icon-refresh-left" ></i>
                </div>
              </el-tooltip>
              <el-tooltip content="右转90度">
                <div class="icon-button" @click="rotate('right')">
                  <i class="el-icon-refresh-right" ></i>
                </div>
              </el-tooltip>
              <el-tooltip content="替换图片">
                <label class="icon-button btn" for="uploads">
                  <i class="el-icon-sort" ></i>
                </label>
              </el-tooltip>
              <el-tooltip content="裁剪" v-if="selectedItem" >
                <div class="icon-button"  @click="cropItem">
                  <i class="el-icon-scissors" ></i>
                </div>
              </el-tooltip>
            </div>
          </div>
          <div v-if="selectedItem && selectedItem.type==='text'" class="text-editor">
            <!-- <div class="text-item">
              <label class="editor-label">文本</label>
              <el-input type="textarea" placeholder="请输入文本" v-model="selectedItem.value" @keydown.native="focus"></el-input>
            </div> -->
            <div class="text-item">
              <label class="editor-label">字体</label>
              <el-select
                style="width: 100%;"
                placeholder="字体"
                v-model="selectedItem.fontFamily">
                <el-option v-for="family in familys" :key="family.value" :label="family.label" :value="family.value"></el-option>
              </el-select>
            </div>
            <div class="text-item">
              <label class="editor-label">大小</label>
              <el-select v-model="selectedItem.fontSize" style="width: 100%;" placeholder="请选择">
                <el-option
                  v-for="item in fontSizeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <!-- <div class="text-item">
              <label class="editor-label">背景颜色</label>
              <el-color-picker v-model="selectedItem.background" size="mini" style="width: 100%;padding-top:6px;"></el-color-picker>
            </div> -->
            <div class="text-item font-control">
              <div>
                <el-dropdown trigger="click" @command="selectAlign">
                  <el-button size="small">
                    对齐<i class="el-icon-s-unfold"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item 
                    v-for="item in fontAlignList"
                    :key="item.value"
                    :command="item.value">{{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div>
                <el-dropdown trigger="click" @command="selectFontWeight">
                  <el-button size="small">
                    粗细<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item 
                    v-for="item in fontWeightList"
                    :key="item.value"
                    :command="item.value">{{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div>
                <el-color-picker  v-model="selectedItem.color" ></el-color-picker>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div  slot="footer" class="footer" style="padding: 10px 0 20px">
          <el-button size="small" @click="close">取 消</el-button>
          <el-button size="small" :icon="saveLoading ? 'el-icon-loading' : ''" type="primary" @click="saveImage">保 存</el-button>
      </div>
      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/jpg" @change="upload($event)">
      <input ref="addImg" type="file" id="uploadsImg" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/jpg" @change="addImg($event)">
    </el-dialog>
</template>

<script>
import VueCropper from '../vue-cropper/vue-cropper'

import vueDragResize from '../vue-drag-resize/vue-drag-resize'
import editText from '../widget-comps/editText'
import html2canvas from 'html2canvas'


function getRandomId() {
  let maxNumber = 99999999
  let minNumber = 1000000
  let range = maxNumber - minNumber; //取值范围的差
  let random = Math.random(); //小于1的随机数
  return minNumber + Math.round(random * range);
}

export default {
  components: {
    VueCropper,
    vueDragResize,
    editText
  },

  // 示例：
  // <imgEditorModal :showEditor.sync="showEditor" :data="data" :configData="configData"></imgEditorModal>
  // showEditor: true,
  // data:{
  //   props:{
  //     url: "要编辑的图片地址"
  //   }
  // }
  // 默认传个空对象就可以
  // configData: {
  // }

  props: {
    showEditor: {
      type: Boolean,
      default: false
    },
    data: Object,
    configData: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    visible: {
      get(){
        return this.showEditor
      },
      set(v){
      }
    }
  },

  watch: {
    showEditor: {
      handler (val) {
        // 每次进入时的初始化操作
        if(val) {
          if(!this.configData.baseImg) {
            this.$set(this.configData, 'baseImg', this.data.uri?this.data.uri:'')
          }
          if(!this.configData.list) {
            this.$set(this.configData, 'list', [])
          }
          this.configList = this.configData.list
          // selectedItem不存在即为底图
          this.selectedItem = null
          this.$nextTick(() => {
            this.$refs.cropper.reload()
            this.isChanged = false
          })
          
        }
      },
      immediate: true,
      deep: true
    }
  },
  inject: ['mmsConfig'],
  data () {
    return {
      isChanged: false,
      previews: null,
      previewStyle: null,
      previewResize: null,
      selectedItem: null,
      textEditKey: undefined,
      configList: [],
      familys: [
        {label: '宋体', value: 'Simsun'},
        {label: '黑体', value: 'SimHei'},
        {label: '微软雅黑', value: '‎Microsoft YaHei'}
      ],
      sizes: [14, 16, 18, 20, 24, 26, 28, 32],
      fontSizeList: [{
        value: '12',
        label: '12px'
      }, {
        value: '14',
        label: '14px'
      }, {
        value: '16',
        label: '16px'
      }, {
        value: '18',
        label: '18px'
      }, {
        value: '24',
        label: '24px'
      }, {
        value: '32',
        label: '32px'
      }, {
        value: '48',
        label: '48px'
      }],
      fontWeightList: [{
        value: '300',
        label: '细'
      }, {
        value: '500',
        label: '标准'
      }, {
        value: '900',
        label: '加粗'
      }],
      fontAlignList: [{
        value: 'left',
        label: '左对齐'
      }, {
        value: 'center',
        label: '居中'
      }, {
        value: 'right',
        label: '右对齐'
      }],
      // 去除底图上的图片在切换时，收到realtime的影响，发生闪现
      imgItemLoad: true,
      saveLoading: false
    }
  },

  methods: {
    closedCb(){
      window.onkeydown = null
    },
    selectAlign(val) {
      this.selectedItem.align = val
    },
    selectFontWeight(val) {
      this.selectedItem.fontWeight = val
    },

    imgLoad (data) {
      this.imgItemLoad = true
    },

    realTime (data) {
      if (!this.selectedItem) {        
        let h = 400
        let w = 560
        let zoom = 1
        // 计算zoom比例，确保图片不会超过区域的宽高
        h = (w * data.h) / data.w
        zoom = w / data.w
        if (h > 400) {
          h = 400
          w = (data.w * h) / data.h
        }
        zoom = h / data.h
        this.w = w
        this.h = h
        this.zoomW = w
        this.zoomH = h
        this.previewStyle = {
          width: data.w + 'px',
          height: data.h + 'px',
          overflow: 'hidden',
          position: 'relative',
          zoom: zoom
        }
        this.previewResize = {
          width: w + 'px',
          height: h + 'px',
          overflow: 'hidden',
          position: 'absolute',
        }
        this.previews = data
      } else {
        if(!this.imgItemLoad) return
        this.$refs.cropperItem.getCropData((data) => {
          this.selectedItem.url = data
        })
      }
    },

    changeScale (val) {
      if (this.selectedItem) {
        this.$refs.cropperItem.changeScale(val)
      } else {
        this.$refs.cropper.changeScale(val)
      }
    },

    rotate (val) {
      if (this.selectedItem) {
        if (val === 'left') this.$refs.cropperItem.rotateLeft()
        if (val === 'right') this.$refs.cropperItem.rotateRight()
        this.$refs.cropperItem.reload()
      } else {
        if (val === 'left') this.$refs.cropper.rotateLeft()
        if (val === 'right') this.$refs.cropper.rotateRight()
        this.$refs.cropper.reload()
      }
    },

    upload (event) {
      let files = Array.from(event.target.files)
      if (files.length > 0) {
        let url = URL.createObjectURL(files[0])
        if (this.selectedItem) {
          this.selectedItem.baseUrl = url
        } else {
          this.configData.baseImg = url
        }
        this.$forceUpdate()
      }
      event.target.value = null
    },

    cropItem () {
      this.$refs.cropperItem.getCropData((data) => {
        this.selectedItem.baseUrl = data
        this.selectedItem.url = data
      })
    },

    textChange (val, height, item) {
      // this.selectedItem.value = val
      // 当文字输入的高度高于resize时，自动改为文字高度
      if(height > item.height) item.height = height
    },

    addImg (event) {
      let key = getRandomId()
      let url,height
      let files = Array.from(event.target.files)
      if(files.length <= 0) return
      url = URL.createObjectURL(files[0])
      // 获取新增图片的宽高，并保证第一次是按照默认比例添加
      let imgObj = new Image()
      imgObj.src = url
      let _this = this
      imgObj.onload = function(){
        height = (imgObj.height*80)/imgObj.width
        let obj = {
          type: 'img',
          baseUrl: url,
          url: url,
          left: 50,
          top: 50,
          width: 80,
          height: height,
          key: key
        }
        _this.configData.list.unshift(obj)
        _this.imgItemLoad = false
        _this.selectedItem = obj
        _this.textEditKey = undefined
        _this.bindDelItem(0)
        //  重置value否则 input 不能上传相同的文件
        event.target.value = null
      }
    },

    addText () {
      let key = getRandomId()
      let obj = {
        type: 'text',
        value: '文字',
        left: 50,
        top: 50,
        width: 145,
        height: 30,
        fontSize: '14',
        fontFamily: 'Simsun',
        color: '#000',
        background: null,
        fontWeight: '500',
        align: 'left',
        key: key
      }
      this.configData.list.push(obj)
      this.selectedItem = obj
      let index = this.configData.list.length - 1
      this.textEditKey = undefined
      this.bindDelItem(index)
    },

    itemClick (e, index, item) {
      if(this.selectedItem && this.selectedItem.key === item.key) return
      this.selectedItem = item
      if(this.selectedItem.type === 'img') this.imgItemLoad = false
      this.textEditKey = undefined
      this.bindDelItem(index)
    },

    itemDblclick (evt, item) {
      if (this.selectedItem.type === 'text') {
        this.textEditKey = item.key
        this.selectedItem = item
        let fn = () => {
          this.textEditKey = undefined
          window.removeEventListener('click', fn)
        }
        window.addEventListener('click', fn)
      }
    },

    bindDelItem (index) {
      var _this = this
      window.onkeydown = function (e) {
        if (e && (e.keyCode === 8 || e.keyCode === 46)) {
          _this.configData.list.splice(index, 1)
          _this.selectedItem = null
        }
      }
    },

    itemResize (newRect, item) {
      item.left = newRect.left
      item.top = newRect.top
      item.width = newRect.width
      item.height = newRect.height
    },

    editBaseImg () {
      this.selectedItem = null
    },

    focus (event) {
      event.stopPropagation()
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    },

    close(){
      // this.$emit("update:showEditor", false)
      this.beforeClose()
    },

    beforeClose(done){
      this.$confirm('丢失编辑内容并关闭？', '提示', {type: 'warning'})
      .then(_ => {
        typeof done === 'function' && done()
        this.$emit("update:showEditor", false)
      })
    },
    saveImage () {
      if(this.w/this.h < 0.45) {
        this.$message({
          message: '图片裁剪比例不符合标准，请重新裁剪！',
          type: 'warning'
        });
        return
      }

      this.saveLoading = true

      this.selectedItem = undefined
      this.previewStyle = {
        width: this.w + 'px',
        height: this.h + 'px',
        overflow: 'hidden',
        position: 'relative'
      }
      this.previews.div = {
        width: '100%',
        height: '100%'
      }
      this.previews.img = {
        width: '100%',
        height: '100%'
      }
      this.$refs.cropper.getCropData((data) => {
        this.previews.url = data
        this.$nextTick(() => {
          html2canvas(this.$refs.imageWrapper, {
            // scale: 3,
            width: this.w,
            height: this.h,
            useCORS: true
          }).then(canvas => {
            let dataURL = canvas.toDataURL('image/png')
            let file = this.dataURLtoFile(dataURL, getRandomId() + '.png')
            // this.data.uri = dataURL
            this.configData.baseImg = data

            let formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'image')
            formData.append('actionType', 'upload')
            formData.append('saveResource', 'Y')

            this._http(this.mmsConfig.file, formData)
            .then(res => {
              if(res.type === 'success'){
                this.$emit('on-save', {
                  newData: res.data,
                  imgConf: this.configData
                })
              }
            }).finally(end => {
              this.saveLoading = false
            })
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.img-modal {
  .close-icon {
    position: absolute;
    right: 20px;
    top: 23px;
    font-size: 16px;
  }
  .close-icon:hover {
    cursor: pointer;
    color: #409eff;
  }
  .editor-container {
    display: flex;
    width: 100%;
    justify-content: space-between;

    .add {
      position: absolute;
      left: 0;
      width: 60px;
      
      .add-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 60px;
        overflow: hidden;
        cursor: pointer;

        &:hover{background-color: #409EFF;color: #fff}
      }
    }

    .preview {
      flex: 1;
      margin: 0 10px 0 40px;
      height: 400px;
      padding: 10px 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      background-color: #f5f4f9;
    }

    .config {
      width: 300px;
      text-align: center;

      .img-editor {
        .cropper {
          height: 370px;
        }

        .controllers {
          display: flex;
          justify-content: space-evenly;
          margin-top: 5px;
          padding: 6px 0;
          border: 1px solid #f0f0f0;
          border-radius: 4px;

          .icon-button {
            width: 30px;
            height: 30px;
            padding: 0 4px;
            border-radius: 50%;
            line-height: 36px;
            text-align: center;
            box-sizing: border-box;

            i {
              font-size: 20px;
            }
          }

          .icon-button:hover {
            background: #e3f1ff;
            color: #4EA5FF;
            cursor: pointer;
          }
        }
      }

      .text-editor {
        .text-item {
          display: flex;
          padding: 12px;

          .editor-label {
            width: 90px;
            text-align: right;
            padding-top: 6px;
            padding-right: 10px;
          }
        }
        .font-control{
          display: flex;
          justify-content: flex-end;
          align-items: center;
          & > div{
            margin-right: 10px;
            &:last-child{
              margin:0;
            }
          }
          .el-color-picker{
            width: 40px;
          }
          .font-bold{
            border-color: #409EFF;
            color: #409EFF;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.img-modal {
  .el-textarea__inner{ 
    resize: none;
  }
  .el-color-picker__trigger {
    width: 100%;
  }
}
</style>