const { redis } = require('../model')

const authAsMiddleware = (req, res, next) => {

    if (req.headers.authorization === process.env.TOKEN_AUTHENTICATION) {
        next()
        return
    }
   res.status(401).end()
}

const authAsSocketPostConnect = (socket) => {

    keyName = `${socket.handshake.auth.email}_${socket.id}`

    if (socket.handshake.auth.token === process.env.TOKEN_AUTHENTICATION) {
        console.log(`New user connected: ${socket.id}`)
        /* 
          register in Redis
        */
       console.log(socket.handshake.auth)
        redis.set(keyName, JSON.stringify({
            socketId: socket.id,
            userRoom: socket.handshake.auth.userRoom,
            email: socket.handshake.auth.email
        }))
        return true
    }

    console.log(`User ${socket.id} Unauthorized`)
    socket.disconnect()
}

module.exports = {
    authAsMiddleware,
    authAsSocketPostConnect
}