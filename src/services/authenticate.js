const authAsSocket = (socket, next) => {

    console.log(socket.handshake.headers.authorization)

    if (socket.handshake.headers.authorization == process.env.TOKEN_AUTHENTICATION) {
        next()
        console.log(`New user connected: ${socket.id}`)
        return
    }

    console.log(`Use ${socket.id} Unauthorized`)
    next(new Error("Unauthorized"))
}

const authAsMiddleware = (req, res, next) => {

    if (req.headers.authorization == process.env.TOKEN_AUTHENTICATION) {
        next()
        return
    }
   res.status(401).end()
}

module.exports = {
    authAsSocket,
    authAsMiddleware
}