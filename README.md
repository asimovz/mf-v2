# MFBOS_FE

#### 项目介绍
MFBOS_FE 基于Vue的独立前端工程项目

项目内置了iview和element UI组件库。可以根据使用需要使用不同基础组件


#### 编译设置
``` bash
# install dependencies
npm install

#项目启动
npm run iview or npm run element

#打包命令
npm run build:iview or npm run build:element


```

#### 参与贡献



#### 安装提示
1、切换 npm下载源
   npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
   npm config set registry https://registry.npm.taobao.org


2、修改ag-gird源码，支持复制粘贴功能

   修改文件地址：node-module/ag-gird-community/dist/lib/gridPanel/gridPanel.js
   注释 onCtrlAndV 方法中的
    this.clipboardService.pasteFromClipboard();