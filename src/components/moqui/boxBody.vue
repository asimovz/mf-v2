<template>
  <div class="panel-body" :style="dialogStyle"><slot></slot></div>
</template>
<script>
export default {
  name: "box-body",
  data: function() {
    return this.height
      ? {
          dialogStyle: {
            "max-height": this.height + "px",
            "overflow-y": "auto"
          }
        }
      : { dialogStyle: {} };
  },
  props: {
    height: String
  }
};
</script>
