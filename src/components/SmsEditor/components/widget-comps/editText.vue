<template>
  <div class="box">
    <div
      class="text"
      :style="{
        'fontSize': fontSize+'px',
        'color': color,
        'fontWeight': fontWeight,
        'textAlign': align,
        'font-family': fontFamily,
        }"
      ref="edit"
      :contenteditable="edit"
      @mousedown="stopClick"
      @click="stopClick"
      @keydown="stopClick"
      @blur ="change"
    >
      <span
        ref="span"
        style="display: inline-block;width: 100%;"
      >{{value}}</span>
    </div>
  </div>
  
</template>

<script>
export default {
  name: "edit-text",

  props: {
    value: {
      type: String,
      default: "文字"
    },
    fontSize: {
      type: String,
      default: '14'
    },
    color: {
      type: String,
      default: "#000"
    },
    fontWeight: {
      type: String,
      default: '100'
    },
    fontFamily: {
      type: String,
      default: 'Simsun'
    },
    align: {
      type: String,
      default: "left"
    },
    width: {
      type: Number,
      default: 100
    },
    edit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  watch: {
    edit: {
      handler(val) {
        this.edit = val;
        if (this.edit) {
          this.$nextTick(() => {
            this.$refs.edit.focus();
            // 强制每次focus时，光标都在最后
            var range = window.getSelection()
            range.selectAllChildren(this.$refs.edit)
            range.collapseToEnd()
          });
        }
      },
      immediate: true
    }
  },

  methods: {
    change() {
      this.$emit("textChange", this.$refs.edit.innerHTML, this.$refs.edit.offsetHeight)
    },
    stopClick(event) {
      if (event && this.edit){
        event.stopPropagation(); 
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 2px;
}
.text {
  height: auto !important;
  -webkit-user-select:auto;
}
</style>