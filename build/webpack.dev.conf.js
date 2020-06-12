'use strict'
const utils = require('./utils')
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const portfinder = require('portfinder')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const baseThemeConfig = require('../config/theme.config')

console.log(baseThemeConfig);


const devWebpackConfig = merge(baseWebpackConfig, {
  entry: {
    'app':'./src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    chunkFilename:'[name].[hash:8].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    historyApiFallback: true,
    hot: true,
    host: process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true,
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    disableHostCheck: true
  },
  plugins: [
    new webpack.DefinePlugin({
      '$THEME': baseThemeConfig,
      'process.env': require('../config/dev.env'),
      '__webpack_define_cdn__': JSON.stringify(config.buildTo.assetsPublicPath)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      chunks:['app']
    }),
    // new HtmlWebpackPlugin({
    //   filename:'./signIn/index.html', //指定生成的html存放路径
    //   template:'./src/signIn/index.html', //指定html模板路径
    //   inject: true, //是否将js等注入页面,以及指定注入的位置'head'或'body'
    //   chunks:['signIn/index'] //需要引入的chunk(模块资源)，不配置就会引入所有页面的资源(js/css),这是个很重要的属性，你可以不配置试试效果
    // }),
    new FriendlyErrorsPlugin(),
    
    new BundleAnalyzerPlugin({
      //  可以是`server`，`static`或`disabled`。
      //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
      //  在`static`模式下，会生成带有报告的单个HTML文件。
      //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
      analyzerMode: 'disabled',
      //  将在“服务器”模式下使用的主机启动HTTP服务器。
      analyzerHost: '127.0.0.1',
      //  将在“服务器”模式下使用的端口启动HTTP服务器。
      analyzerPort: 8888,
      //  路径捆绑，将在`static`模式下生成的报告文件。
      //  相对于捆绑输出目录。
      reportFilename: path.resolve(__dirname, '../BundleAnalyzerReport.html') ,
      //  模块大小默认显示在报告中。
      //  应该是`stat`，`parsed`或者`gzip`中的一个。
      //  有关更多信息，请参见“定义”一节。
      defaultSizes: 'parsed',
      //  在默认浏览器中自动打开报告
      openAnalyzer: true,
      //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
      generateStatsFile: false,
      //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
      //  相对于捆绑输出目录。
      statsFilename: 'stats.json',
      //  stats.toJson（）方法的选项。
      //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
      //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      // 日志级别。可以是'信息'，'警告'，'错误'或'默认'。
      logLevel: 'info'
    }),
    // new OpenBrowserPlugin({ url: 'http://localhost:9090/coapps', browser: 'google chrome'})
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${config.dev.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
