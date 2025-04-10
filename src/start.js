const express = require('express')
const { createServer } = require('node:http')
const app = express()
const serverApp = createServer(app)
const { authAsSocket } = require('./services')
var cors = require('cors')
const path = require('node:path')
const io = require("socket.io")(serverApp, {
  cors: {
    methods: ["GET", "POST"]
  }
})
app.use(cors({
  origin: ['http://localhost:5173', 'https://visualtracking.infsite.org'],
  credentials: true
}))
app.use(express.json());
// Routers
require('./router')(app)

// websocket namespace
const namespace = io.of('/br-websocket')

// websocket orchestration
require('./controller').orchestrationController(namespace)

serverApp.listen(PORT = process.env.PORT || 80, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
