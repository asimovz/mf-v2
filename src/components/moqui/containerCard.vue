<template>
  <m-card>
    <div class="container-card-header"  slot="header">
        <span>{{title}}</span>
        <div style="flex:1">
           <slot name="toolbar" ></slot>
        </div>
    </div>
    <div :style="style">
      <slot></slot>
    </div>
  </m-card>
</template>

<script>
export default {
  name: "container-card",
  props: {
    title: {
      type: String
    },
    style: {
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
  .form-link,.aw-form {
    margin: 0;
    padding:0
  }
}
</style>