const path = require("path")
const webpack = require('webpack')
const baseThemeConfig = require('./config/theme.config')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const resolve = dir => path.join(__dirname, dir)

const host = 'http://10.0.81.220:8090/'
const compileDomain = 'http://op-fe.mfexcel.com/'

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? compileDomain : '/',
  outputDir: process.env.outputDir || 'dist', 
  // assetsDir: "static",
  productionSourceMap: false,
  filenameHashing:false,
  lintOnSave: false,
  configureWebpack: config => {
    config.context = path.resolve(__dirname, './')
    config.output.libraryTarget = "umd"
    config.externals= {
      jquery: "jQuery"
    }

    config.module.rules.push(
      {
        test: /iview.src.*?js$/,
        loader: 'babel-loader',
      }
    )
    config.module.rules.push(
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'), 
          resolve('test'), 
          resolve('node_modules/vue-echarts'), 
          resolve('node_modules/resize-detector')
        ]
      }
    )
    
    // 如果是开发环境，webpack配置
   if (process.env.NODE_ENV === 'production'){
      // 如果是生产环境，webpack配置
      config.output = Object.assign(config.output,{
        filename: '[name].min.js',
        chunkFilename:'[name].min.js'
      })
      config.optimization.usedExports = true
      config.optimization.runtimeChunk = {
        name: "manifest",
      },


      config.plugins.push(
        new CompressionWebpackPlugin({ //文件开启Gzip，也可以通过服务端
          algorithm: 'gzip',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
      config.plugins.push(
        new TerserWebpackPlugin({
          terserOptions: {
            compress: { drop_console: true }
          },
          extractComments: false,
          parallel: true,  // 启用并行压缩
          cache: true,    // 启用缓存
        })
      )

      config.plugins.push(
        new webpack.optimize.ModuleConcatenationPlugin()
      )
      config.plugins.push(
        new OptimizeCSSPlugin({
          cssProcessorOptions: {
            safe: true
          }
        })
      )
      config.plugins.push(
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, './static'),
            to: './static',
            ignore: ['.*']
          }
        ])
      )
      config.plugins.push(
        new webpack.HashedModuleIdsPlugin()
      )

    }

  },

  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production'){
      // 不生成html文件
      config.plugins.delete('html')
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
    }
    
    // 修复HMR
    config.resolve.symlinks(true)
    // 添加别名
    config.resolve.alias
      .set("vue$", "vue/dist/vue.esm.js")
      .set("@", resolve("src"))
      .set("static", resolve("static"))
      .set("assets", path.resolve(__dirname, './src/assets'),)
      .set("utils", path.resolve(__dirname, './src/components/baseComponent/iview/utils'))
      .set("node_modules", path.resolve(__dirname, './node_modules'))
      .set("accredit",process.env.NODE_ENV === 'production' ? path.resolve(__dirname, './src/assets/js/accredit.js'):path.resolve(__dirname, './src/assets/js/accredit_dev.js'));

      //定义环境变量
      config.plugin('define').tap(args => {
        args[0]['$THEME'] = baseThemeConfig
        return args
      })
  
  },

  css: {
    extract: {
      filename:"[name].css",
      chunkFilename: "[name].css"
    },
    sourceMap: false
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
    host: '0.0.0.0',
    port: 9090,
    progress: true,
    open: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    publicPath: '/',
    proxy: {
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
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    },
    disableHostCheck: true
  }
};
