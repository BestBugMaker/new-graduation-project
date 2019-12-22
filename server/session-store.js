function getRedisSessionId(sid) {
    return `ssid:${sid}`
}

class RedisSessionStore {
    constructor(client) {
        this.client = client
    }

    //获取redis中存储的session数据
    async get(sid) {
        console.log("get session", sid)
        const id = getRedisSessionId(sid)
        const data = await this.client.get(id)
        if (!data) {
            return null
        }
        try {
            const result = JSON.parse(data)
            return result
        } catch (err) {
            console.log(err)
        }
    }

    //存储session数据
    async set(sid, session, ttl) {
        console.log("set session", sid)
        const id = getRedisSessionId(sid)
        if (typeof ttl == Number) {
            ttl = Math.ceil(ttl / 1000)
        }
        try {
            const sessStr = JSON.stringify(session)
            if (ttl) {
                await this.client.setex(id, ttl, sessStr)
            } else {
                await this.client.set(id, sessStr)
            }
        } catch (err) {
            console.log(err)
        }
    }

    //从redis删除某个session
    async destroy(sid) {
        console.log("delete session", sid)
        const id = getRedisSessionId(sid)
        await this.client.del(id)
    }
}

module.exports = RedisSessionStore
