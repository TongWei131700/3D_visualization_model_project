'use strict'
const path = require('path')
    // const defaultSettings = require('./src/settings.js')
    // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
    // function resolve(dir) {
    //   return path.join(__dirname, dir)
    // }

const name = '广州定制' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9599 npm run dev OR npm run dev --port = 9599
const port = 9599 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: './', // 根域上下文目录
    outputDir: 'dist', // 构建输出目录
    assetsDir: 'static', // 静态资源目录 (js, css, img, fonts)
    lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    runtimeCompiler: true, // 开启运行时编译
    // lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    devServer: {
        inline: true, // 默认开启热更新
        open: true,
        port: port,
        historyApiFallback: true,
        proxy: {
            '/api': {
                // target: 'http://172.18.25.183:8281',
                // target: 'http://10.19.1.78:8083',
                // target: 'http://192.168.8.169:8081',
                // target: 'http://192.168.8.127:8281',
                // target: 'http://192.168.8.100:8083',
                // target: 'http://192.168.51.181:8083',
                // target: 'http://10.19.1.232:8082',
                // 本地地址
                // target: 'http://192.168.8.130:8281',
                // 服务器地址
                // target: 'http://175.178.56.233:8281',
                // target: 'http://43.136.182.91:8281',
                // target: 'http://43.136.216.235:8281',
              target: 'http://175.178.56.233:8281',
                // target: 'http://43.136.240.188:8281',
                // target: 'http://43.136.182.91:8281',
                // target: 'http://101.43.139.198:8281/',
                ws: true,
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@c': path.resolve(__dirname, './src/components')
            }
        }
        // plugins: [
        //   // new BundleAnalyzerPlugin()
        // ],
        // externals: {
        //   // CDN 的 Element 依赖全局变量 Vue， 所以 Vue 也需要使用 CDN 引入
        //   'vue': 'Vue',
        //   // 属性名称 element-ui, 表示遇到 import xxx from 'element-ui' 这类引入 'element-ui'的，
        //   // 不去 node_modules 中找，而是去找 全局变量 ELEMENT
        //   'element-ui': 'ELEMENT',
        //   'echarts': 'echarts' // 配置使用CDN
        // }
    }
    // chainWebpack(config) {
    //   // it can improve the speed of the first screen, it is recommended to turn on preload
    //   config.plugin('preload').tap(() => [
    //     {
    //       rel: 'preload',
    //       // to ignore runtime.js
    //       // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
    //       fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
    //       include: 'initial'
    //     }
    //   ])
    //
    //   // when there are many pages, it will cause too many meaningless requests
    //   config.plugins.delete('prefetch')
    //
    //   config
    //     .when(process.env.NODE_ENV !== 'development',
    //       config => {
    //         config
    //           .plugin('ScriptExtHtmlWebpackPlugin')
    //           .after('html')
    //           .use('script-ext-html-webpack-plugin', [{
    //             // `runtime` must same as runtimeChunk name. default is `runtime`
    //             inline: /runtime\..*\.js$/
    //           }])
    //           .end()
    //         config
    //           .optimization.splitChunks({
    //           chunks: 'all',
    //           cacheGroups: {
    //             libs: {
    //               name: 'chunk-libs',
    //               test: /[\\/]node_modules[\\/]/,
    //               priority: 10,
    //               chunks: 'initial' // only package third parties that are initially dependent
    //             },
    //             elementUI: {
    //               name: 'chunk-elementUI', // split elementUI into a single package
    //               priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //               test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
    //             },
    //             commons: {
    //               name: 'chunk-commons',
    //               test: resolve('src/components'), // can customize your rules
    //               minChunks: 3, //  minimum common number
    //               priority: 5,
    //               reuseExistingChunk: true
    //             }
    //           }
    //         })
    //         // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
    //         config.optimization.runtimeChunk('single')
    //       }
    //     )
    // }
}
