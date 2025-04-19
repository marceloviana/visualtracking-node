const { redis } = require('../model')
const { tokenValidate } = require('../middleware/checkToken')

/*
    Websocket connect validate
*/
const authAsSocketPostConnect = async(socket) => {

    const keyName = `${socket.handshake.auth.email}_${socket.id}`
    // const keyName = `${socket.handshake.auth.email}`
    if (await tokenValidate(socket.handshake.auth.token) === 200) {

        console.log(`New user connected: ${socket.handshake.auth.email}`)
        /* 
          register in Redis
        */
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
    authAsSocketPostConnect
}