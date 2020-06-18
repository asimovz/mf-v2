<template>
  <m-modal
    :id="id"
    :title="title"
    :width="width"
    :height="height"
    :url="loadUrl"
    :dynamicParams="dynamicParams"
    :isDynamic="true"
    v-model="visible"
  >
  </m-modal>
</template>
<script>
export default {
  name: "dynamic-dialog",
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
    url: {
      type: String, 
    },
    dynamicParams: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      loadUrl: this.url,
      dialogTitle: this.title
    };
  },
  provide() {
    return {
      BoxInstance:this
    }
  },
  methods: {
    close() {
      this.visible = false
    }
  },
  mounted: function() {
    this.$root.eventBus.$on("dynamic_visible_change_" + this.id, resp => {
      if( resp && resp.href && resp.href != "") {
        this.dialogTitle = resp.title
        this.loadUrl = resp.href
      }
      this.visible = true
    })
  },
  beforeDestroy() {
    this.$root.eventBus.$off("dynamic_visible_change_" + this.id)
  }
};
</script>

