<template>
  <m-collapse v-model="isBodyOpen" :type="type" :allowFold="allowFold">
    <m-colPanel name="p1">
      <slot slot="title" name="header" class="panelTitle">
        <span>{{ title }}</span>
        <span class="panelToolbar">
          <slot name="toolbar"></slot>
        </span>
      </slot>
      <slot></slot>
    </m-colPanel>
  </m-collapse>
</template>

<style>
.panelTitle {
  width: 100%;
}
.panelTitle * {
  display: inline-block;
}
.panelToolbar {
  float: right;
  padding-right: 10px;
}
</style>

<script>
export default {
  name: "container-box",
  props: {
    type: {
      type: String,
      default: ""
    },
    allowFold: {
      type: Boolean,
      default: true
    },
    title: String,
    initialOpen: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      isBodyOpen: this.initialOpen ? ["p1"] : ""
    };
  }
};
</script>
