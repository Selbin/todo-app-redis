const asyncRedis = require('async-redis')
const client = asyncRedis.createClient(6379)

module.exports = { client }
