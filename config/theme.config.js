'use strict'
let compArgv = process.env.component
let themeConfig = {
  "iview": `{
    theme: "dark",
    component: "iview",
    isTabNav: false
  }`,
  "element":` {
    theme: "blue",
    component: "element",
    isTabNav: true
  }`
}

module.exports = themeConfig[compArgv]