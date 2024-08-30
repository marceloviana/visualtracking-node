const { redis } = require('../model')
const rooms = process.env.ROOMS.split(",")
const { authAsSocketPostConnect } = require('../services/authenticate')

module.exports.orchestrationController = (io) => {
    io.on('connection', (socket) => {
        
        /*
          websocket authentication
        */
        authAsSocketPostConnect(socket)

        /*
          message orchestration
        */
        for (i of rooms) {
        
          socket.on(i, async (data) => {

            console.warn(data)
            
            if ( data['broadcast'] ) {
              io.emit(data['room'], data['message'])
            } else {
              // Retrieve all connections for user (browser tabs)
              console.warn("Before Redis:", data['email'])
              let socketIdInRedis = await redis.getAllKeys(data['email'])
              console.warn("Searching for user in Redis:", socketIdInRedis)
              for (let socket_name of socketIdInRedis) {
                // Retrieve socket.id by key name in redis
                let socket_id = await redis.get(socket_name)
                console.warn("Sending message to : ", socket_id, '<--->', socket_name)
                io.to(socket_id).emit(data['room'], data['message'])
              }
            }
    
        })
      }
    
      /* 
        disconnect and remove from Redis
      */
      socket.on("disconnect", async (reason) => {
        
        console.warn("Disconnecting socket.id:", socket.id)
        let socketIdInRedis = await redis.getAllKeys(socket.id)
        console.warn("Searching for socket.id in Redis:", socketIdInRedis)
        for (let socket_name of socketIdInRedis) {
          console.warn("Removing socket_name: ", socket_name)
          redis.delete(socket_name)
        }        
        
      });  
    
    })
}
