<template>
  <Modal
    :id="id"
    :title="title"
    :width="width"
    :height="height"
    :url="url"
    v-model="visible"
    :mask-closable="false"
    v-modal-ext="{ modal: true, drag: true, escClose: true }"
    ref="modal"
    @on-visible-change="dynamicUrlChange"
  >
    <slot v-if="isDynamic == false"></slot>
    <component v-else :is="curComponent"></component>
    <div slot="footer"></div>
  </Modal>
</template>

<style>
.ivu-modal-footer {
  border-top: none;
}
.ivu-modal-body {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

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
    }
  },

  data: function() {
    return {
      visible: false,
      curUrl: "",
      curComponent: mLoad
    };
  },
  computed: {
    setZindex() {
      return 1002;
    }
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
    if (this.openDialog) {
      this.visible = this.openDialog;
    }
    // this.$root.eventBus.$on("modal_visible_change_" + this.id, result => {
    //   this.visible = !this.visible;
    // });
    // //如果是动态弹框
    // if (this.isDynamic) {
    //   this.$root.addContainer(this.id, this);
    // }
  },

  methods: {
    dynamicUrlChange: function() {
      this.$emit("input", this.visible);
      this.$emit("on-change", this.visible);
      // // iview Modal的z-index bug，修改为根据页面Modal个数增长
      // setTimeout(() => {
      //   let modal = document.querySelectorAll(".ivu-modal-wrap");
      //   let mask = document.querySelectorAll(".ivu-modal-mask");
      //   mask = Array.from(mask);
      //   Array.from(modal).map((item, index) => {
      //     mask[index].style.zIndex = 1010 + modal.length + index;
      //     item.style.zIndex = 1010 + modal.length + index;
      //   });
      // }, 200);
    }
  },

  beforeDestroy: function() {
    this.$refs.modal.$destroy();
    this.$root.eventBus.$off("modal_visible_change_" + this.id);
  }
};
</script>
