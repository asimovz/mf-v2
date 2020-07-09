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
var SSHWebpackPlugin = require('ssh-webpack-plugin');

const env = process.env.NODE_ENV === 'testing' ? require('../config/test.env') : require('../config/prod.env')
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
        path: config.buildTo.assetsRoot,
        publicPath: config.buildTo.assetsPublicPath,
        filename: config.buildTo.isHash ? '[name].[hash].min.js' : '[name].min.js',
        chunkFilename:'[name].[hash:8].js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env,
            '__webpack_define_cdn__': JSON.stringify(config.buildTo.assetsPublicPath)
        }),
        new webpack.optimize.UglifyJsPlugin({
            //打包过滤console，debugger等配置
            compress: {
                warnings: false,
                drop_console: false,
                drop_debugger: false
            },
            sourceMap: false,
            parallel: true
        }),
        new ExtractTextPlugin({
            filename: config.buildTo.isHash ? utils.assetsPath('[name].[hash].css') : utils.assetsPath('[name].css')
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
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks: function(module) {
        //         // any required modules inside node_modules are extracted to vendor
        //         return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0)
        //     }
        // }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'manifest',
        //     chunks: ['vendor']
        // }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: './static',
            ignore: ['.*']
        }]),
        // new HtmlWebpackPlugin({
        //   filename: 'signIn.html',
        //   template: './src/signIn/index.html',
        //   inject: true,
        //   minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: true
        //   },
        //   chunksSortMode: 'dependency'
        // }),
        // new SSHWebpackPlugin({
        //   host: '39.106.112.73',
        //   port: '22',
        //   zip: false,
        //   username: 'cdnok',
        //   password: 'cdb@1130!',
        //   cover: true,
        //   // privateKey: require('fs').readFileSync('/Users/.ssh/xx'),
        //   // before:'rm  -f ./dist',
        //   // after:'Commands to run on the server before and after deploy directory is created',
        //   from: './dist',
        //   to: './cdn'
        // })
    ]
})

//生成版本json文件，供后端读取
if (config.build.versionJson) {
    const versionPlugin = require('./version-build')
    webpackConfig.plugins.push(
      new versionPlugin({
        versionDirectory: 'dist'
      })
    )
}
// if (config.build.productionGzip) {
//   const CompressionWebpackPlugin = require('compression-webpack-plugin')
//
//   webpackConfig.plugins.push(
//     new CompressionWebpackPlugin({
//       asset: '[path].gz[query]',
//       algorithm: 'gzip',
//       test: new RegExp(
//         '\\.(' +
//         config.build.productionGzipExtensions.join('|') +
//         ')$'
//       ),
//       threshold: 10240,
//       minRatio: 0.8
//     })
//   )
// }
if (config.buildTo.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
module.exports = webpackConfig