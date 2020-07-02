<template>
  <a :href="href" class="m-link" :target="target" v-if="this.target" ><slot></slot></a>
  <a :href="linkHref" class="m-link" v-else @click.prevent="go"><slot></slot></a>
</template>

<script>
export default {
  name: 'm-link',
  props: {
    href: {type: String, required: true},
    loadId: String,
    target:"",
    targetList: {
      type: String,
      default: ""
    },
    toggle: {
      type: String
    }
  },
  inject: {
    BoxInstance: {
      default: null
    }
  },
  methods: {
    go: function (event) {

      
      if (this.toggle == "close") {
        this.BoxInstance && this.BoxInstance.close();
        return
      }

      if (event.button !== 0) { return }
      if (this.loadId && this.loadId.length > 0) {
        this.$root.loadContainer(this.loadId, this.href)
      }else if(this.targetList){
        //通知mTable去下载
        this.$root.eventBus.$emit(this.targetList+"_table_data_download",this.linkHref)
      } else {
        if (event.ctrlKey || event.metaKey) {
          window.open(this.linkHref, '_blank')
        } else {
          this.$root.setUrl(this.linkHref)
          if(this.toggle != "menu") {
            this.$root.eventBus.$emit("updateAsideMenu", true, this.linkHref)
            window.history.pushState(null, 'title', this.linkHref)
          }
          //页面跳转，取消之前的请求
          this.$root.axiosRequest.map((ax,index) => {
            ax.cancel()
          })
          this.$root.axiosRequest = []
        }
      }
    }
  },
  computed: {
    linkHref: function () {
      return this.$root.getLinkPath(this.href)
    }
  },
  beforeDestroy: function () {
    if (this.targetList) {
      this.$root.eventBus.$off(this.targetList+"_table_data_download")
    }
  }

}
</script>
<style lang="less">

.m-link-button{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFF;
  border: 1px solid #DCDFE6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 3px;
  &:hover, &:active {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  &-primary{
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    &:hover, &:active{
      background: #66b1ff;
      border-color: #66b1ff;
      color: #FFF;
    }
  }
  &-danger{
    color: #FFF;
    background-color: #F56C6C;
    border-color: #F56C6C;
    &:hover, &:active{
      background: #f78989;
      border-color: #f78989;
      color: #FFF;
    }
  }
  &-success{
    color: #FFF;
    background-color: #67C23A;
    border-color: #67C23A;
    &:hover, &:active{
      background: #85ce61;
      border-color: #85ce61;
      color: #FFF;
    }
  }
  &-info{
    color: #fff;
    background-color: #909399;
    border-color: #909399;
    &:hover, &:active{
      background: #a6a9ad;
      border-color: #a6a9ad;
      color: #fff;
    }
  }
}
.m-link-button+.m-link-button {
  margin-left:10px;
}
.m-link-button+.m-link-button {
  margin-left:10px;
}
.m-link-button+button {
  margin-left:10px;
}
</style>