const express = require('express')
const { createServer } = require('node:http')
const app = express()
const serverApp = createServer(app)
// const { authAsSocket } = require('./services')
var cors = require('cors')
// const path = require('node:path')
const io = require("socket.io")(serverApp, {
  cors: {
    methods: ["GET", "POST"]
  }
})
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://app.infsite.org:9000', 'http://app.infsite.org:8000', 'http://api.infsite.org:9000', 'http://api.infsite.org:8000', 'https://api.infsite.org', 'https://app.infsite.org'],
  credentials: true
}))
app.use(express.json());

// websocket namespace
const namespaceIo = io.of('/br-websocket')

// websocket orchestration
require('./controller').orchestrationController(namespaceIo)
// Routers
require('./router')(app, namespaceIo)

serverApp.listen(PORT = process.env.PORT || 80, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
