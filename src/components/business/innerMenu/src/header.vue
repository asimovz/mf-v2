<template>
  <div class="header" inline>
    <div class="header-item">
      <span>厂商</span>
      <div style="flex: 1">
        <drop-down v-model="value.firm" placeholder="请选择厂商" name="firm" :options="value.firmList"></drop-down>
      </div>
    </div>
    <div class="header-item">
      <span>区域</span>
      <m-tree-select style="flex: 1;min-width: 200px;max-width: 640px;"
        :items="value.areaUrl"
        :show-checkbox="true"
        :multiple="true"
        open-path=""
        v-model="value.area"
        :searchable="true"
        :parameters="{}"
      >
      </m-tree-select>
    </div>
    <div class="header-item">
      <input style="display: none;" ref="file" type="file" accept=".xls, .xlsx" @change="fileChange" />

      <m-button type="primary" @click.native="$refs.file.click()">上传通道号</m-button>
      <div class="list">
        <div v-if="!fileUrl" style="opacity: .7">(若需区分通道号配置菜单，请上传通道号文件)</div>
        <template v-else>
          <m-tooltip style="line-height: 1" title="点击下载"><a :href="fileUrl || value.channel" target="_blank" :download="filename">{{filename}}</a></m-tooltip>
          <Icon type="ios-close-circle" @click="remove" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>


  function funDownload(content, filename) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  };

  /** {{ headerData }} ==>> firm, firmList, area, areaUrl, actions, channel
   * firm:          厂商默认值
   * firmList:      厂商列表
   * area:          区域默认值
   * areaUrl:       区域接口
   * actions:       上传地址
   * channel:       通道号文件路径
   */
  export default {
    name: 'top-header',
    props: {
      value: {
        type: Object,
        default: () => ({
          firm: '',
          firmList: [],
          area: '',
          areaUrl: '',
          actions: '',
          channel: ''
        }),
      },
    },
    model: {
      event: 'on-change'
    },
    data(){
      return {
        filename: '',
        fileUrl: ''
      }
    },
    watch: {
      'value.channel': {
        handler(file){
          if(!file) return
          let [ , ...rest ] = file.split('_')
          this.filename = rest.join('_')
          this.fileUrl = file
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      upload(){
        this.$refs.file.click()
      },
      fileChange(evt){
        let inputDOM = event.target
        let file = inputDOM.files[0]

        this.filename = file.name
        this.fileUrl = URL.createObjectURL(file)

        let formData = new FormData()
        formData.append('channel', file, file.name)

        this.uploadFile(formData)
      },
      uploadFile(formData){
        this.$http.post(this.value.actions, formData).then(res => {
          if(res.status === 200){
            this.value.channel = res.data.url
          }
        }).catch(err => {
          this.fileUrl = ''
        })
      },
      remove(){
        this.value.channel = null
        this.$refs.file.value = this.filename = this.fileUrl = ''
      },
    }
  }
</script>

<style scoped lang="less">
.header{background-color: #fff;display: flex;align-items: center;padding: 5px 15px 10px;
  &-item{display: inline-flex;align-items: center;
    > span{width: 68px;margin-right: 12px;text-align: right;}
    &+.header-item{margin-left: 20px;}
  }
}
.ivu-form-item{margin-bottom: 0}

.ivu-upload{display: inline-flex;}
.upload{display: inline-flex;}
.list{display: inline-flex;align-items: center;margin-left: 5px;
  &:hover{i{opacity: 1}}
  a{padding: 0 5px 0 10px;}
  i{margin-left: 3px;padding: 3px;border-radius: 20px;line-height: 1;opacity: 0;color: #f39898;cursor: pointer;transition: all .2s ease;
    &:hover{transform: scale(1.2);}
  }
}

/deep/ .ivu-input-hide-icon .ivu-input-icon{right: 50px;}

</style>