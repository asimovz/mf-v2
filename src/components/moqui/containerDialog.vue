<template>
  <m-modal
    :id="id"
    :title="title"
    :width="width"
    :height="height"
    v-model="visible"
  >
    <slot></slot>
  </m-modal>
</template>
<script>
export default {
  name: "container-dialog",
  props: {
    id: {
      type: String,
      required: true
    },
    title: String,
    width: {
      type: Number | String,
      default: 760
    },
    height: {
      type: Number | String,
      default: 600
    },
    openDialog: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      visible: this.openDialog
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
