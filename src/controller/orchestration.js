const { redis } = require('../model')
const rooms = process.env.ROOMS.split(",")

module.exports.orchestration = (io) => {
    io.on('connection', (socket) => {
    
        /* 
          register in Redis
        */
        redis.set(socket.id)
        
        /*
          message orchestration
        */
        for (i of rooms) {
        
          socket.on(i, (data) => {

            console.log(data)

            if ( data['broadcast'] ) {
              io.emit(data['room'], data['message'])
            } else {
              io.to(data['socketId']).emit(data['room'], data['message'])
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
