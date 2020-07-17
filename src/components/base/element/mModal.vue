<template>
  <el-dialog
    class="aw-modal"
    ref="modal"
    :id="id"
    :title="title"
    :show-close="showClose"
    :width="width+`px`"
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="maskClosable"
    v-modal-ext="{ modal: true, drag: true, escClose: true }"
    @open="dynamicUrlChange"
    @close="dynamicUrlChange"
  >
    <slot v-if="isDynamic == false"></slot>
    <component v-else :is="curComponent"></component>
    <div slot="footer">
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>

<script>
import mLoad from "./mLoad";

export default {
  name: "m-modal",
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
      type: String
    },
    value: {
      type: Boolean,
      default: false
    },
    isDynamic: {
      type: Boolean,
      default: false
    },
    dynamicParams: {
      type: Object,
      default: null
    },
    openDialog: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },

  },
  provide() {
    return { boxInstance: this }
  },
  data: function() {
    return {
      visible: false,
      curComponent: mLoad
    };
  },
  watch: {
    value: function(val) {
      this.visible = val;
    },
    url: {
      handler(newUrl) {
        if (!newUrl || newUrl.length === 0) {
          this.curComponent = mLoad;
          return;
        }
        var vm = this;
        if (this.$root.moqui.isPlainObject(this.dynamicParams)) {
          var dpStr = "";
          $.each(this.dynamicParams, function(key, value) {
            var dynVal = $("#" + value).val();
            if (dynVal && dynVal.length)
              dpStr = dpStr + (dpStr.length > 0 ? "&" : "") + key + "=" + dynVal;
          });
          if (dpStr.length)
            newUrl = newUrl + (newUrl.indexOf("?") > 0 ? "&" : "?") + dpStr;
        }
        this.$root.loadComponent(newUrl, comp => {
            this.curComponent = comp;
        },this.id)
      },
      immediate: true
    }
  },

  mounted: function() {

  },

  methods: {
    dynamicUrlChange: function() {
      this.$emit("input", this.visible);
      this.$emit("on-change", this.visible);
    }
  }
};
</script>
<style>
.el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  padding:5px 15px 0;
  /* padding-top: 0 !important;
  padding-bottom: 0 !important; */
}
.el-dialog__footer {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>