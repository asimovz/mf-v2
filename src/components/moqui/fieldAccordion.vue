<template>
  <m-collapse v-model="openPanel" :type="type">
    <slot></slot>
  </m-collapse>
</template>

<script>
export default {
  name: "field-accordion",
  props: {
    activeName: String,
    type: {
      type: String,
      default: "default"
    },
    panels: String
  },
  data: function() {
    return {
      openPanel: this.getOpenPanels()
    };
  },
  methods: {
    getOpenPanels: function() {
      if (this.panels) {
        if (this.panels.indexOf(",") > 0) {
          return this.panels.split(",").map(it => this.activeName + it);
        } else {
          return this.activeName + this.panels;
        }
      }
    }
  },
  mounted: function() {}
};
</script>
