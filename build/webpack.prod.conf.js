'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const baseThemeConfig = require('../config/theme.config')

var SSHWebpackPlugin = require('ssh-webpack-plugin');

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: './src/main.js'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      extract: true,
      usePostCSS: true
    })
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: config.build.isHash ? '[name].[hash].min.js' : '[name].min.js',
    chunkFilename: config.build.isHash ? '[name].[hash].js' : '[name].min.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      '$THEME': baseThemeConfig,
      'process.env': env,
      '__webpack_define_cdn__': JSON.stringify(config.build.assetsPublicPath)
    }),
    new webpack.optimize.UglifyJsPlugin({
      //是否启用文件缓存，用来加快压缩速度。启用后js文件名不变并且内容不变就会读取缓存文件，不重新压缩。
      cache: true,
      //去掉注释
      comments: false,
      //打包过滤console，debugger等配置
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
      },
      sourceMap: false,
      //使用多进程并行运行来提高构建速度
      parallel: true
    }),
    new ExtractTextPlugin({
      filename: config.build.isHash ? utils.assetsPath('[name].[hash].css') : utils.assetsPath('[name].css')
    }),
    // Compress extracted CSS. e are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),

    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: './static',
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.versionJson || config.build.isQiniu) {
  const versionPlugin = require('./resource-file')
  webpackConfig.plugins.push(
    new versionPlugin({
      versionDirectory: config.build.assetsRoot,
      fileName: config.build.versionName,
    })
  )
}

if (config.build.isQiniu) {
  const QiniuUpload = require('./qiniu-upload')
  webpackConfig.plugins.push(
    new QiniuUpload(config.build.qiniuConfig)
  )
}

if (config.build.productionGzip) {
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      //压缩成功后的目标资源名称，默认[path].gz[query]，[file]被替换为原始资源。[path]被替换为原始资源的路径。[query]为查询。
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      //只有大于这个大小的资源才会被处理。以字节为单位，默认为0。
      threshold: 10240,
      //压缩比例，默认为0.8
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
