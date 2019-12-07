async function test() {
    const Redis = require('ioredis');

    //连接redis
    const redis = new Redis({
        port: 6379,
        host: '127.0.0.1',
        password: 'ad12346224'
    });

    /**
     * redis.get()
     * redis.set()
     * redis.setex()
     */
    const keys = await redis.keys('*');
    console.log(keys);
}

test();
