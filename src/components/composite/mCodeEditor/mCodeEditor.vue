<template>
  <div>
    <template v-if="merge">
      <div ref="mergeview"></div>
    </template>
    <template v-else>
      <!-- 手动控制数据流，需要手动监听changed事件  -->
      <codemirror ref="myCm"
                  :value="code"
                  :options="cmOptions"
                  :merge="merge"
                  @ready="onCmReady"
                  @focus="onCmFocus"
                  @input="onCmCodeChange">
      </codemirror>
      <input type="hidden" :id="id" :value="code" :form="form" :name="name">
    </template>
  </div>
</template>

<style>
.CodeMirror {
  border: 1px solid;
  width: 100%;
  height: auto;
  font-size: 13px;
  line-height: 22px;
  -webkit-font-smoothing: auto!important;
  -moz-osx-font-smoothing: auto!important;
}
.CodeMirror-scroll {  
  min-height: 0px;
  min-width: 0px; 
}
</style>

<script>
// required component
import {codemirror} from 'vue-codemirror'
// required styles
import 'codemirror/lib/codemirror.css'

// language js
import 'codemirror/mode/q/q.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/groovy/groovy.js'
import 'codemirror/mode/sql/sql.js'
// Java代码高亮用这个
import 'codemirror/mode/clike/clike.js'

// theme list
// light style theme
import 'codemirror/theme/mdn-like.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/xq-light.css'

// dark style theme
import 'codemirror/theme/oceanic-next.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/lucario.css'
import 'codemirror/theme/zenburn.css'

// 引入js，绑定Vim
// import 'codemirror/addon/dialog/dialog.js'
// import 'codemirror/addon/search/searchcursor.js'
// import 'codemirror/keymap/vim.js'
// // 改善vim输入命令时的样式
// import 'codemirror/addon/dialog/dialog.css'

// 支持代码折叠
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/xml-fold.js'

// 全屏模式
import 'codemirror/addon/display/fullscreen.css'
import 'codemirror/addon/display/fullscreen.js'

// 括号匹配
import 'codemirror/addon/edit/matchbrackets.js'

// 自动补全
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/anyword-hint.js'
import 'codemirror/addon/hint/javascript-hint.js'
// import 'codemirror/addon/hint/xml-hint.js'

// 行注释
import 'codemirror/addon/comment/comment.js'

// 代码检查错误
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/json-lint.js'

// 代码格式化
import './code-format'


import CodeMirrorMode from 'codemirror'
import DiffMatchPatch from 'diff-match-patch'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/merge/merge.js'
import 'codemirror/addon/merge/merge.css'
window.diff_match_patch = DiffMatchPatch
window.DIFF_DELETE = -1
window.DIFF_INSERT = 1
window.DIFF_EQUAL = 0

export default {
  name: "m-codeEditor",
  components: {
    codemirror
  },
  props:{
    id: String,
    name: String,
    form: String,
    theme: {
      type: String,
      default:'default'
    },
    langMode: String,
    readOnlyMode:{
      type: Boolean,
      default: false
    },
    codeStr: String,
    diffCode: String,
    merge: {
      type: Boolean,
      default: false
    },
    height: String
  },
  data () {
    return {
      code :this.codeStr,
      cmOptions: {
        // codemirror options
        tabSize: 4,
        // 自动缩进，设置是否根据上下文自动缩进,默认为true
        smartIndent: true,  
        mode: this.langMode,
        theme: this.theme,
        // 显示行号
        styleActiveLine: true,
        lineNumbers: true,
        // 是否在初始化时自动获取焦点
        autofocus: true,
        // 编辑器是否只读,并且不能获得焦点。默认false，可以设置为true或者'nocursor'
        readOnly: this.readOnlyMode?'nocursor':this.readOnlyMode,
        // 在选择时是否显示光标，默认为false
        showCursorWhenSelecting:true,
        // autoresize
        viewportMargin: Infinity,
        line: true,
        // 代码折叠
        lineWrapping:true,
        foldGutter: true,
        //CodeMirror-lint-markers是实现语法报错功能
        gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
        // 全屏模式
        //fullScreen:false,
        // 括号匹配
        matchBrackets:true,
        // ctrl-alt 唤起智能提示
        extraKeys:{
          // 自动补全快捷键设定
          "Ctrl-Alt": "autocomplete",
          "Ctrl-/": "toggleComment",
          //undo
          "Ctrl-Z":function (editor) {
            editor.undo();
          },
          //Redo
          "F8":function (editor) {
            editor.redo();
          },
          //代码格式化
          "F7": function autoFormat(cm) {
            var totalLines = cm.lineCount();
            cm.autoFormatRange({line:0, ch:0}, {line:totalLines});
          },
          // "F11": function(cm) {  
          //   cm.setOption("fullScreen", !cm.getOption("fullScreen"));
          // },  
          // "Esc": function(cm) {  
          //    if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
          // }   
        },
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  methods: {
    onCmReady(cm) {
      //console.log('the editor is readied!', cm)
    },
    onCmFocus(cm) {
      //console.log('the editor is focus!', cm)
    },
    onCmCodeChange(newCode) {
      //console.log('this is new code', newCode)
      this.code = newCode
    }
  },
  computed: {
    codemirror: function() {
      if(!this.merge) {
        return this.$refs.myCm.codemirror
      }
    }
  },
  mounted() {
    let cm = this.$refs.myCm.$el
    let wrap = cm.querySelector(".CodeMirror")

    if(this.height){
      wrap.style.height = this.height
    }else{
      let bodyHeight = document.body.getBoundingClientRect().height
      let cmHeight = bodyHeight - cm.getBoundingClientRect().top - 60
      wrap.style.height = cmHeight + "px"
    }

    if(this.merge) {
      CodeMirrorMode.MergeView(this.$refs.mergeview, {
        value: this.codeStr,//上次内容
        origLeft: null,
        orig: this.diffCode,//本次内容
        lineNumbers: true,//显示行号
        mode: "text/html",
        highlightDifferences: true,
        connect: 'align',
        readOnly: true,//只读 不可修改
        theme: this.theme,
      });
    }
    //console.log('this is current codemirror object', this.codemirror)
    // you can use this.codemirror to do something...
  }
};
</script>
