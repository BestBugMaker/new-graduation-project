const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const session = require('koa-session')
const Redis = require('ioredis')

const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV != 'production'
const app = next({
    dev
});
//处理http请求
const handle = app.getRequestHandler();

//创建redis client
const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    password: 'ad12346224'
});

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    server.keys = ['Jason Dev github']
    const SESSION_CONFIG = {
        key: "jid",
        store: new RedisSessionStore(redis)
    }

    server.use(session(SESSION_CONFIG, server))

    server.use(async(ctx, next) => {
        // console.log(ctx.cookies.get('id'))
        // //获取用户数据
        // //比如调用model.getUserById(id)

        // ctx.session = ctx.session || {}
        // ctx.session.user = {
        //     username:"jack"
        // }
        // if (!ctx.session.user) {
        //     ctx.session.user = {
        //         name: "Jason",
        //         age: 18
        //     }
        // } else {
        console.log("session is " + ctx.session)
            // }
        await next()
    })
    router.get('/a/:id', async(ctx) => { //处理 /a/1 的路由映射问题
        const id = ctx.params.id;
        console.log(id)
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: {
                id
            }
        });
        ctx.respond = false;
    })

    router.get("/set/user", async(ctx) => {
        ctx.session.user = {
                name: "Jason",
                age: 18
            }
            // ctx.respond = false;
        ctx.body = "set session success"
    })
    router.get("/delete/user", async(ctx) => {
        ctx.session = null
        ctx.body = "delete session success"
    })
    server.use(router.routes()); //启动路由
    // const router = new Router();
    // router.get('/test', (ctx) => {
    //         ctx.body = '<p>request /test</p>'
    //     })
    //ctx: 请求的内容
    // server.use(async(ctx, next) => {
    //     // const path = ctx.path
    //     // const method = ctx.method
    //     // ctx.body = `<span>Koa Render ${path} ${method}</span>`
    //     //执行下一个中间件
    //     await next()
    // })

    // server.use(router.routes());

    // server.use(async(ctx, next) => {
    //         ctx.body = '<span>Koa Render2</span>'
    //     })
    //中间件
    server.use(async(ctx, next) => {
        // ctx.cookies.set('id', "userId:xxxxxx")
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    })
    server.listen(3000, () => {
        console.log("koa server listening on 3000")
    })
})
