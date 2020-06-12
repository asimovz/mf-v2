<template>
  <div class="operation_box">
    <template v-for="(item, index) in agComponents">
      <div class="operation_element" v-if="isDisplayArray[index] && isShow">
        <m-button v-if="item.componentName === 'ag-button'"
                size="small"
                type="text"
                :icon="item.props.icon"
                :class="['ag-handle-button',`ag-button-`+item.props.type,{cellButtonNoText:item.props.text==''}]"
                :disabled="disabled"
                @click.native.stop="buttonClick(item.props)">{{item.props.text}}</m-button>
                
        <m-button v-if="item.componentName === 'ag-link' && ((item.props.targetDialog && item.props.targetDialog.length >0)||item.props.type)" 
                size="small"
                type="text" 
                :icon="item.props.icon"
                :class="['ag-handle-button',`ag-button-`+item.props.type,{cellButtonNoText:item.props.text==''}]"
                @click.native.prevent.stop="linkClick($event,item.props)">{{item.props.linkText}}</m-button>

        <a v-if="item.componentName === 'ag-link' && !item.props.targetDialog && !item.props.type"
          @click.prevent="linkClick($event,item.props)">{{item.props.linkText}}</a>
    </div>
    </template>
  </div>

</template>

<script>
  export default {
    name: "ag-operation-group",
    data() {
      return {
        agComponents: "",
        thisParent: null,
        isDisplayArray:[],
        isShow: true,
        disabled: undefined
      }
    },
    beforeMount() {
      this.agComponents = this.params.props.agComponents
      this.thisParent = this.params.context.componentParent
      if(this.params.hasOwnProperty("data")){
        for(let index in this.agComponents){
          let componentObj = this.agComponents[index]
          if(this.params.data[componentObj.props.isDisplayField] !=null){
            this.isDisplayArray.push(this.params.data[componentObj.props.isDisplayField])
          }else{
            this.isDisplayArray.push(true)
          }
        }
      }else{
        this.isShow = false
      }
    },
    methods: {
      buttonClick(props) {
        if(props.confirmation){
          this.handleConfirm({
            title: props.text,
            content: "<p>" + props.confirmation + "</p>",
            onOk: () => {
              this.submitButtonClick(props);
            },
            onCancel: () => {}
          });
        }else{
          this.submitButtonClick(props);
        }
      },
      submitButtonClick(props){
        this.disabled = true
        let that = this
        let rowData = this.params.node.data
        this.$http.post(props.submitUrl, rowData).then(response => {
          let responseData = response.data
          if (responseData.screenUrl && responseData.screenUrl.length > 0) {
            this.handleNotice(responseData.messages || "操作成功!", responseData.type || 'success')
						this.thisParent.$root.setUrl(responseData.screenUrl);
            this.thisParent.$root.eventBus.$emit("updateAsideMenu")
					} else if (responseData.redirectUrl && responseData.redirectUrl.length > 0) {
						window.location.href = responseData.redirectUrl;
					}else{
            //显示返回成功消息
            this.handleNotice(responseData.messages || "操作成功!", responseData.type || 'success')
            //触发m-table重新获取数据事件
            setTimeout(()=>{that.thisParent.reLoadQueryData()},300)
          }
        }, response => {
          // 显示返回错误消息
          this.handleNotice(response.errors || "操作失败!", 'danger')
          this.disabled = false
        })
      },
      linkClick(event, props) {
        if (event.button !== 0) {
          return
        }
        if(props.confirmation){
          this.handleConfirm({
            title: props.linkText,
            content: "<h4>" + props.confirmation + "</h4>",
            onOk: () => {
              if(props.targetDialog && props.targetDialog.length > 0){
                this.loadDialog(props);
              }else{
                this.go(event,props);
              }
            },
            onCancel: () => {}
          });
        }else{
          if(props.targetDialog && props.targetDialog.length > 0){
            this.loadDialog(props);
          }else{
            this.go(event,props);
          }
        }
      },
      go(event, props){
        let linkParams = props.linkParamField
        var param = []
        if(linkParams != null){
          for(let key in linkParams){
            param.push(key + '=' + this.params.data[linkParams[key]]);
          }
        }
        let href = param.length > 0 ? props.transitionUrl + '?' + param.join('&') : props.transitionUrl
        let loadId = props.loadId || null
        let linkHref = this.thisParent.$root.getLinkPath(href)

        if (loadId && loadId.length > 0) {
          this.thisParent.$root.loadContainer(loadId, href)
        } else {
          if (event.ctrlKey || event.metaKey || props.linkParamField.downloadPath) {
            window.open(linkHref, '_blank')
          } else {
            this.thisParent.$root.setUrl(linkHref)
          }
        }
      },
      loadDialog(props){
        let linkParams = props.linkParamField
        var param = []
        if(linkParams != null){
          for(let key in linkParams){
            param.push(key + '=' + this.params.data[linkParams[key]]);
          }
        }
        let href = param.length > 0 ? props.transitionUrl + '?' + param.join('&') : props.transitionUrl
        //上面代码可以抽到公用方法里？
        this.thisParent.$root.eventBus.$emit("dynamic_visible_change_"+props.targetDialog,{
          href: href,
          title: props.linkText
        });
      }
    }
  };
</script>
<style scoped>
.operation_box {
  display: flex;
  justify-content: space-around;
}
.operation_element{
  padding-left: 5px;
}
.ag-handle-button {
  padding:4px;
}
.ag-handle-button:hover{
  background-color: #F1F1F1F1;
}
</style>
