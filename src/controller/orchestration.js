const { redis } = require('../model')
const rooms = process.env.ROOMS.split(",")
const { authAsSocketPostConnect } = require('../services/authenticate')

module.exports.orchestration = (io) => {
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

            console.log(data)
            
            if ( data['broadcast'] ) {
              io.emit(data['room'], data['message'])
            } else {
              // Retrieve all connections for user (browser tabs)
              let socketIdInRedis = await redis.getAllKeys(data['email'])
              for (let socket_name of socketIdInRedis) {
                // Retrieve socket.id by key name in redis
                let socket_id = await redis.get(socket_name)
                io.to(socket_id).emit(data['room'], data['message'])
              }
            }
    
        })
      }
    
      /* 
        disconnect and remove from Redis
      */
      socket.on("disconnect", (reason) => {
        redis.delete(socket.id)
      });  
    
    })
}
