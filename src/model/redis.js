const { createClient } = require('redis')

const globalStatusRedis = {
  status: true,
  message: null
}

const client = createClient({
  url: process.env.REDIS_ENDPOINT,
  socket: {
    tls: process.env.REDIS_ENDPOINT.includes("localhost") ? false : true
  }
}).on('error', err => {
  console.log('Redis Client Error', err)
  globalStatusRedis.status = false
  globalStatusRedis.message = `Redis Client Error`
}).connect();

/*
  'instance' is promise from 'createClient'
*/

module.exports = {

    getAllKeys: async (key) => (await client).sendCommand(['KEYS', `*${key}*`]),
    get: async (key) => (await client).get(key),
    set: (key, value) => {
      
      if (!key || !value) {
        return
      }

      client.then(async (instance) => {
          let setItem = instance.set(key, value)
          let expireItem = instance.expire(key, process.env.REDIS_EXPIRE)
          console.log('....', await setItem, await expireItem)
        })

    },
    delete: (key) => {
      client.then((instance) => {
          instance.del(key)
        })
    },
    status: () => globalStatusRedis
}