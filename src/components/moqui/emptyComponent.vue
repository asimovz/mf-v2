<template>
    <m-loading v-if="loadingShow"></m-loading>
</template>

<script>
  export default {
    name: 'emptyComponent',
    data() {
      return {
        loadingShow:true
      }
    },
    mounted: function() {
      // this.loadingShow = false
      // DOM 更新完成，结束进度条
      // this.$Loading.finish();
    }
  }
</script>
