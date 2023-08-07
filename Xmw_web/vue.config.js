const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const CompressionPlugin = require('compression-webpack-plugin')
function resolve(dir) {
    return path.join(__dirname, dir)
}

// check Git
function getGitHash() {
    try {
        return GitRevision.version()
    } catch (e) { }
    return 'unknown'
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
    // webpack build externals
    externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios'
    },
    css: [],
    // https://unpkg.com/browse/vue@2.6.10/
    js: [
        '//cdn.baiwumm.com/project/vue2-admin/js/vue@2.6.10.min.js',
        '//cdn.baiwumm.com/project/vue2-admin/js/vue-router@3.1.3.min.js',
        '//cdn.baiwumm.com/project/vue2-admin/js/vuex@3.1.1.min.js',
        '//cdn.baiwumm.com/project/vue2-admin/js/axios@0.19.0.min.js'
    ]
}

// vue.config.js
const vueConfig = {
    configureWebpack: {
        // webpack plugins
        plugins: [
            // Ignore all locale files of moment.js
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.DefinePlugin({
                APP_VERSION: `"${require('./package.json').version}"`,
                GIT_HASH: JSON.stringify(getGitHash()),
                BUILD_DATE: buildDate
            }),
            //gzip压缩
            new CompressionPlugin({
                algorithm: 'gzip', // 使用gzip压缩
                test: /\.js$|\.html$|\.css$/, // 匹配文件名
                filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
                minRatio: 1, // 压缩率小于1才会压缩
                threshold: 10240, // 对超过10k的数据压缩
                deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
            })
        ],
        // if prod, add externals
        externals: isProd ? assetsCDN.externals : {}
    },

    chainWebpack: (config) => {
        // config.resolve.alias
        //     .set('@$', resolve('src'))
        config.resolve.alias
            .set('@$', resolve('src'))

        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule
            .oneOf('inline')
            .resourceQuery(/inline/)
            .use('vue-svg-icon-loader')
            .loader('vue-svg-icon-loader')
            .end()
            .end()
            .oneOf('external')
            .use('file-loader')
            .loader('file-loader')
            .options({
                name: 'assets/[name].[hash:8].[ext]'
            })

        // if prod is on
        // assets require on cdn
        if (isProd) {
            config.plugin('html').tap(args => {
                args[0].cdn = assetsCDN
                return args
            })
        }
    },

    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    // less vars，customize ant design theme

                    // 'primary-color': '#F5222D',
                    // 'link-color': '#F5222D',
                    'border-radius-base': '2px'
                },
                // DO NOT REMOVE THIS LINE
                javascriptEnabled: true
            }
        }
    },

    devServer: {
        port: 8000,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:7001',
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/baiduApi': {
                target: 'https://aip.baidubce.com', //访问地址
                changeOrigin: true,
                secure: false, //只有代理https 地址需要次选项
                pathRewrite: {
                    '^/baiduApi': ''
                }
            }
        }
    },

    // disable source map in production
    productionSourceMap: false,
    lintOnSave: false,
    // babel-loader no-ignore node_modules/*
    transpileDependencies: []
}


vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())

module.exports = vueConfig
