const withCss = require('@zeit/next-css')

const configs = {
    //编译文件的输出目录
    distDir: 'dest',
    //是否给每个路由生成Etag，第二次请求同一个页面时，若Etag相同，服务端可以不返回内容，让浏览器使用缓存
    generateEtags: true,
    //页面内容缓存配置
    onDemandEntries: {
        //内容缓存的时长
        maxInactiveAge: 25 * 1000,
        //同时缓存多少个页面
        pagesBufferLength: 2
    },
    //pages下哪些后缀名的文件会被认为是页面
    pageExtensions: ['jsx', 'js'],
    //配置buildId
    generateBuildId: async() => {
        if (process.env.YOUR_BUILD_ID) {
            return process.eventNames.YOUR_BUILD_ID
        }
        //null使用默认的unique id
        return null
    },
    //手动修改webpack config
    webpack(config, options) {
        return config
    },
    //修改webpackDevMiddleware配置
    webpackDevMiddleware: config => {
        return config
    },
    //可以在页面上通过process.env.customKey获取value
    env: {
        customKey: 'value'
    },
    //下面两个通过‘next/config’来读取
    //只有在服务端渲染时才会获取的配置
    serverRuntimeConfig: {
        mySecret: 'secret',
        secondSecret: process.env.SECOND_SECRET
    },
    //在服务端渲染和客户端渲染都可以获取的配置
    publicRuntimeConfig: {
        staticFolder: '/static'
    }
}

if (typeof require !== 'undefined') {
    require.extensions['.css'] = file => {}
}

module.exports = withCss({})
