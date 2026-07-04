const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const cache = (ttl = 60) => async (req, res, next) => {
    const key = `cache:${req.originalUrl}`
    try {
        const cached = await redis.get(key)
        if (cached) {
            return res.json(JSON.parse(cached))
        }
        const originalJson = res.json.bind(res)
        res.json = (data) => {
            redis.setex(key, ttl, JSON.stringify(data))
            return originalJson(data)
        }
        next()
    } catch {
        next()
    }
}

const clearCache = async (pattern) => {
    const keys = await redis.keys(`cache:*${pattern}*`)
    if (keys.length) await redis.del(...keys)
}

module.exports = { cache, clearCache }