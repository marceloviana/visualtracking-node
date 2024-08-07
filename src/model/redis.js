const { createClient } = require('redis');

const globalStatusRedis = {
  status: true,
  message: null
}

const redis = createClient({
  url: process.env.REDIS_ENDPOINT
}).on('error', err => {
  console.log('Redis Client Error', err)
  globalStatusRedis.status = false
  globalStatusRedis.message = `Redis Client Error`
}).connect();

/*
  'instance' is promise from 'createClient'
*/

module.exports = {

    get: (socketid) => {
        redis.then((instance) => {
          instance.get(`websocket_${socketid}`)
        })        
    },
    set: (socketid) => {
        redis.then((instance) => {
          instance.set(`websocket_${socketid}`, socketid)
          instance.expire(`websocket_${socketid}`, process.env.REDIS_EXPIRE)
        })        
    },
    delete: (socketid) => {
        redis.then((instance) => {
          instance.del(`websocket_${socketid}`)
        })
    },
    status: () => globalStatusRedis
}