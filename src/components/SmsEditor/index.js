import editorDraggable from "./components/draggable"
import mIcon from './components/icon'
import mmsEditorComp from "./home"
import zh from './assets/lang/zh'
import en from './assets/lang/en'

//css样式
import './assets/css/main.less'; // 带后缀, 否则打包失败



//国际化配置
let localeType = localStorage.getItem('lang') || 'zh'
export const locale = {
  locale: localeType,    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh': zh,   // 中文语言包
    'en': en    // 英文语言包
  },
  addLocale(obj) {
    this.messages = {...this.messages,...obj}
  }
}

export const smsEditor = {
  install(Vue, options) {
    Vue.component(editorDraggable.name,editorDraggable)
    Vue.component(mmsEditorComp.name,mmsEditorComp)
    Vue.component(mIcon.name, mIcon)
    let { http, httpError } = options
    let methods = Object.assign({ _http: http }, typeof httpError === 'function' ? { _httpError: httpError } : {})
    if (http && typeof(http) === 'function'){
      Vue.mixin({
        methods
      })
    }
  }
}
