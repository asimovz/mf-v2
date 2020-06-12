<template>
  <Poptip class="aw-poptip"  placement="bottom" trigger="click" @on-popper-hide="hide">
    <slot></slot>
    <slot slot="content" name="content"></slot>
  </Poptip>
</template>

<script>
export default {
  name: "m-popover",
  methods: {
    hide() {
      this.$emit("on-hide")
    }
  }
}
</script>

<style lang="less">
.aw-poptip {
  .ivu-poptip-body {
    padding:0
  }
}
</style>