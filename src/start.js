const express = require('express')
const { createServer } = require('node:http')
const app = express()
const serverApp = createServer(app)
const { authAsSocket } = require('./services')
var cors = require('cors')
const io = require("socket.io")(serverApp, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  path: '/br-websocket/socket.io'
})
app.use(cors())

// Routers
require('./router')(app)
// websocket authentication
io.use(authAsSocket)
// websocket namespace
const namespace = io.of('/br-websocket')
// websocket orchestration
require('./controller').orchestration(namespace)

serverApp.listen(PORT = process.env.PORT || 80, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
