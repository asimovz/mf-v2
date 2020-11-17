<template>
  <m-collapse v-model="isBodyOpen" :type="type" :allowFold="allowFold">
    <m-colPanel name="p1">
      <!-- <slot slot="title" name="header" class="panelTitle">
        <span>{{ title }}</span>
        <span class="panelToolbar">
          <slot name="toolbar"></slot>
        </span>
      </slot> -->
      <template slot="title">
        <div  class="panelTitle">
          <slot name="header"></slot>
          <div><slot name="toolbar"></slot></div>
        </div>
      </template>
      <slot></slot>
    </m-colPanel>
  </m-collapse>
</template>

<style>
.panelTitle {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 10px;
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
