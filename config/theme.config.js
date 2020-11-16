'use strict'
let compArgv = process.env.component
let themeConfig = {
  "iview": `{
    theme: "dark",
    component: "iview",
    isTabNav: false
  }`,
  "element":` {
    theme: "dark",
    component: "element",
    isTabNav: false
  }`
}

module.exports = themeConfig[compArgv]