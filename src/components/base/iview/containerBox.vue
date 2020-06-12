<template>
  <m-collapse v-model="isBodyOpen" :type="type" :allowFold="allowFold">
    <m-colPanel name="p1">
      <span class="panelTitle">
        <span>{{ title }}</span>
        <slot name="header"></slot>
        <span class="panelToolbar">
          <slot name="toolbar"></slot>
        </span>
      </span>
      <div slot="content">
        <slot></slot>
      </div>
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
