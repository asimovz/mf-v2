<template>
  <m-drawer
    :id="id"
    :title="title"
    :width="width"
    v-model="visible"
    :placement="placement"
    :isDynamic="false"
  >
    <slot></slot>
  </m-drawer>
</template>
<script>
export default {
  name: "container-drawer",
  props: {
    id: {
      type: String,
      required: true
    },
    title: String,
    width: {
      type: Number | String,
      default: 500
    },
    placement: {
      type: String,
      default: "right"
    },
    openDrawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.openDrawer
    }
  },
  mounted: function() {
    this.$root.eventBus.$on("dynamic_visible_change_" + this.id, () => {
      this.visible = true
    })
  },
  beforeDestroy() {
    this.$root.eventBus.$off("dynamic_visible_change_" + this.id)
  }
};
</script>
