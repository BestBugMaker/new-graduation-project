const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');

const dev = process.env.NODE_ENV != 'production'
const app = next({
    dev
});
//处理http请求
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
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
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    })
    server.listen(3000, () => {
        console.log("koa server listening on 3000")
    })
})
