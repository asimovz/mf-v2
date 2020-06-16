<template>
  <m-card>
    <div class="container-card-header"  slot="header">
        <span>{{title}}</span>
        <slot name="toolbar"></slot>
    </div>
    <slot></slot>
  </m-card>
</template>

<script>
export default {
  name: "container-card",
  props: {
    title: {
      type: String
    }
  }
}
</script>
<style lang="less">
.container-card-header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}
</style>