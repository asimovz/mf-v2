'use strict'
// Template version: 1.2.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
let host = 'http://10.0.80.16:8082/' //http://tenanttest.mfexcel.com/
// let host = 'http://10.0.8.3:8080/' //http://tenanttest.mfexcel.com/
// http://10.0.200.42:8080/coapps/ChatbotManages
let buildTo = ''



module.exports = {
  buildProdLib: {
    env: require('./prod.lib.env.js'),
    assetsRoot: path.resolve(__dirname, '../lib'),
    productionSourceMap: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '../',
    filename: 'vueComponentsLib.min.js',
    library: 'vueComponentsLib',
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/coapps/*': {
        target: host,
        changeOrigin: true,
        "headers": {
          "x-custom-is-webpack": "true"
        }
      },

      '/getCustomMenuItemsByUserGroup': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/getCustomMenuItemsByUserGroup': '/getCustomMenuItemsByUserGroup'
        }
      },  
      '/getMenuItems': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/getMenuItems': '/getMenuItems'
        }
      },
      '/Login': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/Login': '/Login'
        }
      },
      '/menuData': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/menuData': '/menuData'
        }
      },
      '/getWebRootInitParameters': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/getWebRootInitParameters': '/getWebRootInitParameters'
        }
      },
      '/getCoappsThemeId': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/getCoappsThemeId': '/getCoappsThemeId'
        }
      },
      '/apps': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/apps': '/apps'
        }
      },
      '/images': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/images': '/images'
        }
      },
      '/ssstatic': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/ssstatic': '/ssstatic'
        }
      },
      '/learnstatic': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/learnstatic': '/learnstatic'
        }
      },
      '/js': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/js': '/js'
        }
      },
      '/libs': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/libs': '/libs'
        }
      },
      '/rest': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/rest': '/rest'
        }
      },
      '/ckEditorAttachUpload': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/ckEditorAttachUpload': '/ckEditorAttachUpload'
        }
      },
      '/rich-editor-attach': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/rich-editor-attach': '/rich-editor-attach'
        }
      },
      '/ureport': {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          '^/ureport': '/ureport'
        }
      },

    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 9090, // can be overwritten by process.env.HOST, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // index: path.resolve(__dirname, '../dist/index.html'),
    env: require('./prod.env.js'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: 'http://10.0.81.220:9988/',
    productionSourceMap: false,
    devtool: false,
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report,
    isHash: false, //是否生成文件hash名称
    versionJson: false, //是否生成版本json文件 【要开启文件哈希，isHash=true】
    versionName: "version.json"
  },
  buildTo: {
    env: require('./prod.env.js'),
    // publicPath: 'http://cdn.xxx.com',
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: 'http://op-fe.mfexcel.com/',
    productionSourceMap: false,
    devtool: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report,
    versionJson: false, //是否生成版本json文件
    isHash: false, //是否生成文件hash名称
  }
}
