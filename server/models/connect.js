const redis = require('redis')
const client = redis.createClient(6379)
const { promisify } = require('util')
const lpush = promisify(client.lpush).bind(client)
const lrange = promisify(client.lrange).bind(client)
const hset = promisify(client.hset).bind(client)
const hgetall = promisify(client.hgetall).bind(client)
const hget = promisify(client.hget).bind(client)
const lrem = promisify(client.lrem).bind(client)
const lindex = promisify(client.lindex).bind(client)
const hdel = promisify(client.hdel).bind(client)

module.exports = { lpush, lrange, hset, hget, hgetall, lrem, lindex, hdel }
