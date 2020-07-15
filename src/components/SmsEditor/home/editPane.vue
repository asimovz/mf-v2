<template>
  <div class="editPane editPane-wrapper">
    <div class="editPane-title">
      <span>{{label}}设置</span>
      <span class="close" @click="$emit('on-close')"><i class="el-icon-close"></i></span>
    </div>
    <div class="editPane-content">
      <div class="editPane-preview">
        <template v-if="currentData.type === 'image'">
          <img :src="currentData.uri" crossOrigin="*">
        </template>
        <template v-if="currentData.type === 'video'">
          <videoPlayer ref="videoPlayer" showMediaInfo :options="videoOptions" />
        </template>
        <template v-if="currentData.type === 'audio'">
          <audioPlayer style="flex:1" :options="audioOptions" />
        </template>
        <template v-if="currentData.type === 'text'">
          <text-editor></text-editor>
        </template>
      </div>
      <div class="editPane-operation">
        <el-button class="btn" v-if="showEditBtn" type="primary" size="small" @click="edit">编辑</el-button>
        <el-button v-if="showRemoveBtn" type="warning" class="btn" size="small" @click="remove">删除</el-button>
      </div>
    </div>
    <img-editor-modal :showEditor.sync="isImgEdit" :data="editDataImg" :configData="editDataImg.imgConf" @on-save="onSave">
    </img-editor-modal>
    <video-conf ref="videoConf" :visible.sync="isVideoEdit" :mediaData="editDataVideo" @on-save="onSave" @on-cancel="onCancel">
    </video-conf>
  </div>
</template>
<script>
import textEditor from '../components/textEditor'
import imgEditorModal from '../components/imgEditor/imgEditorModal.vue'
import videoConf from '../components/videoEditor/index.vue'
import videoPlayer from '../components/videoPlayer'
import audioPlayer from '../components/audioPlayer'
export default {
  components: {
    imgEditorModal,
    videoConf,
    videoPlayer,
    audioPlayer,
    textEditor
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      currentData: {},
      isImgEdit: false,
      isVideoEdit: false,
      editDataImg: {},
      editDataVideo: {}
    }
  },
  computed: {
    label() {
      return this.item.title
    },
    showEditBtn() {
      return this.currentData.type === 'image' || this.currentData.type === 'video'
    },
    showRemoveBtn() {
      return ['image', 'audio', 'video'].includes(this.currentData.type)
    },
    videoOptions() {
      return {
        autoplay: false,
        poster: this.currentData.poster,
        sources: [
          { src: this.currentData.uri, type: 'video/mp4' }
        ]
      }
    },
    audioOptions() {
      return {
        ...this.currentData,
        src: this.currentData.uri
      }
    },

  },
  watch: {
    item: {
      handler(val) {
        this.currentData = val
      },
      deep: true,
      immediate: true
    },
    isImgEdit(visible) {
      if (!visible) this.editDataImg = {}
    },
    isVideoEdit(visible) {
      if (!visible) this.editDataVideo = {}
    },
    'currentData.poster': {
      handler(nVal, oVal) {
        nVal && this.$refs.videoPlayer && this.$refs.videoPlayer.showPoster()
      }
    }
  },
  inject: ['mmsConfig'],
  methods: {

    remove() {
      this.$emit('on-remove', this.currentData)
    },
    edit() {
      let dt = JSON.parse(JSON.stringify(this.currentData))
      if (this.currentData.type === 'image') {
        this.editDataImg = dt
        this.isImgEdit = true
      }
      if (this.currentData.type === 'video') {
        delete dt.size
        this.editDataVideo = dt

        this.isVideoEdit = true
      }
    },

    onCancel() {
      if (this.isImgEdit) this.isImgEdit = false
      if (this.isVideoEdit) this.isVideoEdit = false
    },

    async onSave({ newData, imgConf = {} }) {
      if (this.currentData.type === 'video') {
        let { uri, duration, size, poster, videoHeight: height, videoWidth: width, } = newData
        // 视频被 裁剪、转码、水印设置 过， 需要重新上传
        if (newData.uri !== this.currentData.uri) {
          this.$refs.videoConf.showLoading()
          newData.uri = await this.uploadVideo({ uri, height, width, duration, size, poster })
        }

        this.isVideoEdit = false
        // 封面不会修改原视频
      } else {
        this.currentData.imgConf = imgConf
        this.isImgEdit = false
      }

      this.currentData = Object.assign(this.currentData, newData)
    },

    uploadVideo({ uri, height, width, duration, size, poster }) {
      let fd = new FormData()

      fd.append('type', 'video')
      fd.append('actionType', 'upload')
      fd.append('saveResource', 'Y')
      fd.append('fileUrl', uri)
      fd.append('poster', poster)
      fd.append('height', height)
      fd.append('width', width)
      fd.append('duration', duration)
      fd.append('size', size)

      return this._http(this.mmsConfig.file, fd).then(res => {
        this.$message({
          type: res.type || 'warning',
          message: res.messages
        })

        return res.type === 'success' ? res.data.uri : ''
      }).finally(end => {
        this.$refs.videoConf.hideLoading()
      })
    }
  },
}

</script>
<style lang="less">
.editPane {
  &-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 10px 0 20px;
    border-bottom: 1px solid #dcdcdc;

    .close {
      display: inline-block;
      width: 25px;
      line-height: 25px;
      text-align: center;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
    }
  }

  &-content {
    padding: 20px;
  }

  &-preview {
    display: flex;
    align-items: center;
    justify-content: center;

    img,
    video {
      width: 100%;
    }
  }

  &-operation {
    display: flex;
    justify-content: center;
    margin: 20px 0 15px;

    .btn {
      flex: 1;
      margin: 0 10px
    }
  }
}

</style>
