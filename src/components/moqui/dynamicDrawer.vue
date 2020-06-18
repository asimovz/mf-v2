<template>
  <m-drawer
    :id="id"
    :title="drawerTitle"
    :width="width"
    :url="loadUrl"
    :openDrawer="visible"
    :mask-closable="false"
    :placement="placement"
    :isDynamic="true"
    @on-change="change"
  >
  </m-drawer>
</template>

<script>

export default {
  name: "dynamic-drawer",

  props: {
    id: {
      type: String,
      required: true,
    },
    title: String,
    width: {
      type: Number | String,
      default: 500,
    },
    placement: {
      type: String,
      default: "right",
    },
    openDrawer: {
      type: Boolean,
      default: false,
    },
  },

  data: function () {
    return {
      visible: false,
      loadUrl: this.url,
      drawerTitle: this.title
    };
  },
  provide() {
    return {
      BoxInstance:this
    }
  },
  watch: {
    openDrawer: function (val) {
      this.visible = val;
    },
  },

  mounted: function () {
    if (this.openDrawer) {
      this.visible = this.openDrawer;
    }

    this.$root.eventBus.$on("dynamic_visible_change_" + this.id, resp => {
      if(resp && resp.href && resp.href != "") {
        this.dialogTitle = resp.title
        this.loadUrl = resp.href
      }
      this.visible = true
    });
  },

  methods: {
    close() {
      this.visible = false
    },
    change: function (val) {
      this.visible = val;
    },
  },

  beforeDestroy: function () {
    this.$root.eventBus.$off("dynamic_visible_change_" + this.id);
  },
};
</script>
