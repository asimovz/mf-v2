<template>
  <div :contenteditable="isEdit" style="min-height:22px;-webkit-user-select:auto" @mousedown="mousedown" @focus="focus" @dblclick="edit" @blur="changeText" ref="text" v-html="data.content || placeholder"></div>
</template>

<script>
export default {
  name:"widget-text",
  props: {
    data:Object
  },
  data() {
    return {
      isEdit:false,
      placeholder: "请填写",
      // content: this.data.content == "" ? "请填写":this.data.content
    }
  },
  methods: {
    mousedown(e) {
      if(e.target.className === 'param-input') {
        e.stopPropagation()
        e.preventDefault()
        window._textParams.activeBtn(false)
      } else {
        if(window._textParams && this.isEdit) window._textParams.activeBtn(true)
      }
    },
    focus(e) {
      window._textParams.addParam = this.addParam
      window._textParams.activeBtn(true)
    },

    addParam() {
      let dom = this.$refs.text
      let param = '<input type="button" class="param-input" unselectable="on" readonly value="{#'+window._textParams.current.name+'#}"/>'
      let sel = window.getSelection()
      let range
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0)
        range.deleteContents()
        var el = document.createElement('div')
        el.innerHTML = param
        var frag = document.createDocumentFragment(), node, lastNode
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          range = range.cloneRange()
          range.setStartAfter(lastNode)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    },
    edit() {
      this.$emit("edit",true)
      this.isEdit = true
      if(this.data.content == "") this.placeholder = ""
      this.$nextTick(function(){
        this.$refs.text.focus()
        // 强制每次focus时，光标都在最后
        var range = window.getSelection()
        range.selectAllChildren(this.$refs.text)
        range.collapseToEnd()
      })
    },
    changeText() {
      this.isEdit = false
      window._textParams.activeBtn(false)
      let text = this.$refs.text.innerHTML
      this.data.content = text
      if(this.data.content === "")  this.placeholder = "请填写"
      this.$emit("edit",false)
    }
  }
};
</script>
<style lang="less">
  .param-input {
    margin-right: 8px;
    padding: 0;
    outline: none;
    border: none;
    background: transparent;
  }
  .param-input:hover {
    color: #66b1ff;
    cursor: pointer;
  }
</style>
<style lang="less">
.widget-text {
  textarea {
    border:none;
    width: 100%;
    outline: none;
    resize:none;
  }
}
</style>
