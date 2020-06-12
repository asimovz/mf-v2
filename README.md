# COMIX_FE

#### 项目介绍
comix 基于Vue的独立前端工程项目

#### 编译设置
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9090
npm run dev

# build for production with minification
npm run build

# build for production with lib
npm run build:prodLib

# build for production and upload to ftp server
sudo npm run build:to
```

#### 参与贡献

1. Fork 本项目
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request


#### 安装提示
1、切换 npm下载源
   npm config set registry https://registry.npm.taobao.org
2、切换 chromedriver下载源
   npm config set chromedriver_cdnurl https://npm.taobao.org/mirrors/chromedriver

修改ag-gird源码，支持复制粘贴功能
修改文件地址：node-module/ag-gird-community/dist/lib/gridPanel/gridPanel.js
注释 onCtrlAndV 方法中的
    this.clipboardService.pasteFromClipboard();