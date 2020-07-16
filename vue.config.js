const path = require("path")
const webpack = require('webpack')
const resolve = dir => path.join(__dirname, dir)
const baseThemeConfig = require('./config/theme.config')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const host = 'http://10.0.80.16:8082/'

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? 'http://op-fe.mfexcel.com/' : '/',
  outputDir: process.env.outputDir || 'dist', 
  assetsDir: "./public",
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: config => {
    config.output.libraryTarget = "umd"
    config.externals= {
      jquery: "jQuery"
    }
    config.module.rules.push(
      {
        test: /iview.src.*?js$/,
        loader: 'babel-loader',
      },
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
        ],
        // options: {
        //   presets: ['es2015']
        // }
      },
    )
    config.plugins.push(
      new webpack.DefinePlugin({
        '$THEME': baseThemeConfig,
        '__webpack_define_cdn__': 'http://op-fe.mfexcel.com/'
      }),
    )
    // 如果是开发环境，webpack配置
    if (process.env.NODE_ENV === 'development') {
      config.mode = 'development'
      config.output.filename = '[name].js'
      config.output.chunkFilename = '[name].[hash:8].js'
    }else if (process.env.NODE_ENV === 'production'){
      // 如果是生产环境，webpack配置
      config.mode = 'production'
      config.output.filename = '[name].min.js'
      config.output.chunkFilename = '[name].min.js'
      
      config.optimization.minimizer.push(
        new TerserWebpackPlugin({
          terserOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: true
            },
            output: {
              comments: false,
            },
          },
          extractComments: false,
          parallel: true,  // 启用并行压缩
          cache: true,    // 启用缓存
       })
        // new UglifyJSPlugin({
        //   // exclude: /node_modules/,
        //   uglifyOptions:{
        //     warnings: "verbose",
        //     output: {
        //       comments: false,
        //     },
        //     //是否启用文件缓存，用来加快压缩速度。启用后js文件名不变并且内容不变就会读取缓存文件，不重新压缩。
        //     cache: true,
        //     //去掉注释
        //     // comments: false,
        //     //打包过滤console，debugger等配置
        //     compress: {
        //       drop_console: true,
        //       drop_debugger: true
        //     },
        //     sourceMap: false,
        //     //使用多进程并行运行来提高构建速度
        //     parallel: true
        //     }
        // }),
      )
      config.plugins.push(
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, './public'),
            to: './static',
            ignore: ['.*']
          }
        ])
      )
      config.plugins.push(
        new CompressionWebpackPlugin({
          //压缩成功后的目标资源名称，默认[path].gz[query]，[file]被替换为原始资源。[path]被替换为原始资源的路径。[query]为查询。
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' +
            ['js', 'css'].join('|') +
            ')$'
          ),
          //只有大于这个大小的资源才会被处理。以字节为单位，默认为0。
          threshold: 10240,
          //压缩比例，默认为0.8
          minRatio: 0.8
        })
      )

    }
  },

  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true)
    // 添加别名
    config.resolve.alias
      .set("vue$", "vue/dist/vue.esm.js")
      .set("@", resolve("src"))
      .set("static", resolve("public"))
      .set("assets", path.resolve(__dirname, './src/assets'),)
      .set("utils", path.resolve(__dirname, './src/components/baseComponent/iview/utils'))
      .set("node_modules", path.resolve(__dirname, './node_modules'))
      .set("accredit",process.env.NODE_ENV === 'production' ? path.resolve(__dirname, './src/assets/js/accredit.js'):path.resolve(__dirname, './src/assets/js/accredit_dev.js'),);
  },

  css: {
    extract: process.env.NODE_ENV === 'production' ? true : false,
    sourceMap: false,
    // usePostCSS: true
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
    host: 'localhost',
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
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    },
    disableHostCheck: true
  },
};
