const { redis } = require('../model')
const rooms = process.env.ROOMS.split(",")
const { authAsSocketPostConnect } = require('../services/authenticate')
const sendMessageinSocketController = require('./sendMessageInSocketController')

const updateAllUsersConnected =  (io) => {
  setTimeout(async()=> {
    let userProfile = await redis.getAllKeys('@')
    let payload = JSON.stringify({type: 'usersConnected', data: userProfile})
    // console.log('Updating users...', payload)
    io.emit("GERAL", payload)
    // socket.emit("GERAL", payload)
  }, 1000)
  // socket.broadcast.emit('GERAL', payload)
}

module.exports.orchestrationController = (io) => {
  io.on('connection', async (socket) => {
        
      /*
        websocket authentication
      */
      authAsSocketPostConnect(socket)

      /*
        message orchestration
      */
      for (i of rooms) {
        // Input method by socket user
        socket.on(i, async (data) => {
          sendMessageinSocketController(io, data)
        })
      }

      /*
        Update all users connected
      */
      // updateAllUsersConnected(io)

      /* 
        disconnect and remove from Redis
      */
      socket.on("disconnect", async (reason) => {
        
        // console.warn("Disconnecting socket.id:", socket.id)
        let socketIdInRedis = await redis.getAllKeys(socket.id)
        // console.warn("Searching for socket.id in Redis:", socketIdInRedis)
        for (let socket_name of socketIdInRedis) {
          console.warn("Removing socket_name from Redis: ", socket_name)
          redis.delete(socket_name)
        } 
      });  
    
    })
}
