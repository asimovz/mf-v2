<template>
  <el-popover class="aw-poptip"  placement="bottom" trigger="click" @on-popper-hide="hide" :popper-class="popperClass">
    <slot slot="reference"></slot>
    <slot name="content"></slot>
  </el-popover>
</template>

<script>
export default {
  name: "m-popover",
  props: {
    popperClass: {
      type: String
    }
  },
  methods: {
    hide() {
      this.$emit("on-hide")
    }
  }
}
</script>

<style lang="less">
.el-popover {
  padding:10px 0;
}
</style>