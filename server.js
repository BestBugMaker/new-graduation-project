const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const session = require('koa-session')
const Redis = require('ioredis')
const koaBody = require('koa-body')

const RedisSessionStore = require('./server/session-store')

const auth = require('./server/auth')
const api = require('./server/api')
const atob = require('atob')

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

//设置nodejs全局增加atob方法
global.atob = atob

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    server.keys = ['Jason Dev github']

    server.use(koaBody())
    const SESSION_CONFIG = {
        key: "jid",
        store: new RedisSessionStore(redis)
    }

    server.use(session(SESSION_CONFIG, server))
        //配置处理github OAuth登陆
    auth(server)
        //github代理（代理发送github请求）
    api(server)

    router.get('/a/:id', async(ctx) => { //处理 /a/1 的路由映射问题
        const id = ctx.params.id;
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: {
                id
            }
        });
        ctx.respond = false;
    })

    router.get('/api/user/info', async(ctx) => {
        const user = ctx.session.userInfo
        if (!user) {
            ctx.status = 401
            ctx.body = "need login"
        } else {
            ctx.body = user
                //设置headers
            ctx.set("Content-Type", "application/json")
        }
    })
    server.use(router.routes()); //启动路由
    //中间件
    server.use(async(ctx, next) => {
        // ctx.cookies.set('id', "userId:xxxxxx")
        ctx.req.session = ctx.session
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    })
    server.listen(3000, () => {
        console.log("koa server listening on 3000")
    })
})
