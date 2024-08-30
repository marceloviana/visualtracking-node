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
              let userProfile = await redis.getAllKeys(data['email'])
              console.warn("Searching for user in Redis:", userProfile)
              for (let socket_name of userProfile) {
                // Retrieve socket.id by key name in redis
                let userProfile = JSON.parse(await redis.get(socket_name))
                console.warn("Sending message to : ", userProfile.socketId, '<--->', userProfile.email, '<--->', userProfile.userRoom)
                // If the sender does not inform the Room, then the Websocket will send to all user sockets registered in Redis.
                let userRoom = data['room'] === 'ALL_USER_ROOM' ? userProfile.userRoom : data['room']
                io.to(userProfile.socketId).emit(userRoom, data['message'])
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
