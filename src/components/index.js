const currentComp = $THEME['component']
let baseComponent
//基础功能组件
if(currentComp == "iview") {
  baseComponent = require('./base/iview').default
} else {
  baseComponent = require('./base/element').default
}


//复合组件
let compositeComp = require("./composite").default

// moqui框架前端组件
import moquiComp from './moqui'

//业务组件
let businessComponent = require("./business/").default

//主题
import themes from './themes/index.js'

let VueComponentsLib = [
  ...baseComponent,
  ...compositeComp,
  ...moquiComp,
  ...businessComponent,
]

const install = function (Vue, opts = {}) {
  Object.keys(VueComponentsLib).forEach((key) => {
    Vue.component(VueComponentsLib[key].name, VueComponentsLib[key])
  })
  Vue.component("m-charts",() => import(/* webpackChunkName: "mCharts" */'./composite/mChart'))
  if(currentComp == "iview") {
    Vue.component("m-table",() => import(/* webpackChunkName: "agGrid" */'./agTable'))
  }
  if(currentComp == "element") {
    Vue.component("m-ag-table",() => import(/* webpackChunkName: "agGrid" */'./agTable'))
  }
  Vue.use(themes)
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
// 把 install方法添加到 VueComponentsLib 中
export default Object.assign(VueComponentsLib, {install})
