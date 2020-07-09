'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const vueLoaderConfig = require('./vue-loader.conf')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  // entry: {
  //   'app':'./src/main.js',
  //   'signIn/index': './src/signIn/index.js', //配置signIn页面入口
  // },
  output: {
    // path: config.build.assetsRoot,
    // filename: '[name].js',
    // publicPath: process.env.NODE_ENV === 'production'
    //   ? config.build.assetsPublicPath
    //   : config.dev.assetsPublicPath
    libraryTarget: "umd"
  },
  externals: {
    jquery: "jQuery"
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'static': resolve('static'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'utils': path.resolve(__dirname, '../src/components/baseComponent/iview/utils') ,
      'node_modules': path.resolve(__dirname, '../node_modules'),
      'accredit': process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '../src/assets/js/accredit.js'):path.resolve(__dirname, '../src/assets/js/accredit_dev.js'),
    }
  },
  module: {
    rules: [
      // ...(config.dev.useEslint? [{
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src'), resolve('test')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter'),
      //     emitWarning: !config.dev.showEslintErrorsInOverlay
      //   }
      // }] : []),
      {
         test: /iview.src.*?js$/,
         loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'), 
          resolve('test'), 
          resolve('node_modules/vue-echarts'), 
          resolve('node_modules/resize-detector')
        ],
        options: {
           presets: ['es2015']
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('./img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('./media/[ame].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('./fonts/[name].[ext]')
        }
      }
    ]
  },

  plugins: [
    // moment 排除 locale 国际化语言包
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new VueLoaderPlugin(),
  ]
}
