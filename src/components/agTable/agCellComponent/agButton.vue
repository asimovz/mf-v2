<template>
  <m-button :type="type" size="small" @click.native.stop="handleSubmit" :disabled="disabled">{{text}}</m-button>
</template>

<script>

  export default {
    name: "ag-button",
    data() {
      return {
        type: "",
        text: "",
        submitUrl: "",
        disabled:undefined
      };
    },
    beforeMount() {
      if (this.params.props.type === "danger") {
        this.type = "error"
      } else {
        this.type = this.params.props.type
      }
      this.text = this.params.props.text
      this.thisParent = this.params.context.componentParent
      this.submitUrl = this.params.props.submitUrl
    },
    methods: {
      handleSubmit() {
        this.disabled = true
        let vm = this.$root
        var data = this.params.node.data
        vm.$http.post(this.submitUrl, data).then(response => {
          //显示返回成功消息
          var responseData = response.data
          this.handleNotice(responseData.messages || "操作成功!", responseData.type || 'success')
          //触发m-table重新获取数据事件
          this.thisParent.reLoadQueryData()
        }, response => {
          // 显示返回错误消息
          var responseData = response.data
          this.handleNotice(responseData.messages || "操作失败!" , responseData.type || 'danger')
          this.disabled = false
        })

      },
      getValue() {
        return this.text
      },
      isPopup() {
      },
      isCancelBeforeStart() {
      },
      isCancelAfterEnd() {
      }
    }
  };
</script>
