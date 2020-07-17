<template>
  <div :contenteditable="isEdit" style="min-height:22px;-webkit-user-select:auto;color:#606266;" @mousedown="mousedown" @focus="focus" @dblclick="edit" @blur="changeText" @keyup.delete="delParam" ref="text" v-html="data.text || placeholder"></div>
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
    }
  },
  methods: {
    mousedown(e) {
      if(e.target.className === 'param-input') {
        e.stopPropagation()
        e.preventDefault()
        setTimeout(()=>{
          this.$root.TEXT_PARAM.activeBtn(false)
          this.$root.TEXT_PARAM.changeCurrent({
            name: e.target.value
          })
        },200)
      } else {
        if(this.$root.TEXT_PARAM && this.isEdit) {
          this.$root.TEXT_PARAM.changeCurrent({
            name: this.$root.TEXT_PARAM.nameList.length>0?this.$root.TEXT_PARAM.nameList[0]:'text1'
          })
          this.$root.TEXT_PARAM.activeBtn(true)
        }
      }
    },
    focus(e) {
      this.$root.TEXT_PARAM.addParam = this.addParam
      this.$root.TEXT_PARAM.activeBtn(true)
      this.$root.TEXT_PARAM.changeCurrent({
        name: this.$root.TEXT_PARAM.nameList.length>0?this.$root.TEXT_PARAM.nameList[0]:'text1'
      })

      document.addEventListener("paste",this.handlePaste)

    },
    delParam(e) {
      this.$root.TEXT_PARAM.checkMax()
      this.$root.TEXT_PARAM.delParam()
    },

    addParam() {
      let dom = this.$refs.text
      let param = '<input type="button" class="param-input" unselectable="on" readonly value="{'+this.$root.TEXT_PARAM.current.name+'}">'
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
      this.$root.TEXT_PARAM.current = null
    },
    edit() {
      this.$emit("edit",true)
      this.isEdit = true
      if(this.data.text == ""||this.data.content == "") this.placeholder = ""
      this.$nextTick(function(){
        this.$refs.text.focus()
        // 强制每次focus时，光标都在最后
        var range = window.getSelection()
        range.selectAllChildren(this.$refs.text)
        range.collapseToEnd()
      })
    },
    changeText() {
      document.removeEventListener("paste",this.handlePaste)

      this.isEdit = false
      this.$root.TEXT_PARAM.activeBtn(false)
      let text = this.$refs.text.innerHTML
      this.data.text = text
      text = text.replace(/<input(([\s\S])*?)>/g, function(data,p1) {
        let r =/value="(.*?)(?=">)/
        return data.match(r)[1]
      })

      this.data.content = text
      if(this.data.text === "")  this.placeholder = "请填写"
      this.$emit("edit",false)
    },
    handlePaste(e){
      e.stopPropagation();
      e.preventDefault();
      var text = '', event = (e.originalEvent || e);
      if (event.clipboardData && event.clipboardData.getData) {
        text = event.clipboardData.getData('text/plain');
      } else if (window.clipboardData && window.clipboardData.getData) {
        text = window.clipboardData.getData('Text');
      }

      let sel = window.getSelection()
      let range
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0)
        range.deleteContents()
        var el = document.createElement('div')
        el.innerHTML = text
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
    }
  }
};
</script>
<style lang="less">
  .param-input {
    margin: 0 8px;
    padding: 0;
    outline: none;
    border: none;
    color: #9eb2dc !important;
    background: transparent;
  }
  .param-input:hover {
    color: #66b1ff !important;
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
