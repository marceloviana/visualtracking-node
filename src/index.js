const express = require('express')
const { createServer } = require('node:http')
const app = express()
const serverApp = createServer(app)
const { authAsSocket } = require('./services/')
require('dotenv').config({ path: './.env' })
var cors = require('cors')
const io = require("socket.io")(serverApp, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
app.use(cors())

// Routers
require('./router')(app)
// websocket authentication
io.use(authAsSocket)
// websocket namespace
const namespace = io.of('/br-websocket')
// websocket orchestration
require('./controller/').orchestration(namespace)

serverApp.listen(process.env.PORT, () => {
  console.log(`server running at http://localhost:${process.env.PORT}`)
})
