<template>
  <div class="aw-subheader">
    <div class="aw-subheader-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
/*
<m-subheader></m-subheader>
flxed，是否固定顶部
transparent 是否透明 [此状态用于页面带顶部tab时，可以将子栏透明，内容居右显示。带tab时，透明设置为true,flxed也为true]
*/
export default {
  name: "m-subheader",
  props: {
    flxed: {
      type: Boolean,
      default: true
    },
    transparent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      classObj: null
    };
  },
  mounted() {
    this.classObj = document.body.classList;
    if (this.flxed) this.classObj.add("aw-subheader--fixed");
    if (this.transparent) this.classObj.add("aw-subheader--transparent");
  },
  destroyed() {
    this.classObj.remove("aw-subheader--fixed", "aw-subheader--transparent");
  }
};
</script>
<style lang="less">
.aw-subheader-content {
  width: 100%;
  .form-horizontal,
  .form-list,
  .aw-form {
    margin: 0;
    padding:0;
    .aw-form-item {
      margin-bottom: 0;
    }
  }
}
</style>