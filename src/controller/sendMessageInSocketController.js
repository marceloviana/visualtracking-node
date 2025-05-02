const { redis } = require('../model')

const sendMessageInSocketController = async (io, payload) => {

  try {
    // Retrieve all connections for user (browser tabs)
    let userProfiles = await redis.getAllKeys(payload['userApp'])
    if (!userProfiles.length) return
    for (let socket_name of userProfiles) {
      // Retrieve socket.id by key name in redis
      let userProfile = JSON.parse(await redis.get(socket_name))
      console.warn("Sending message to : ", userProfile.socketId, '<--->', userProfile.email, '<--->', userProfile.userRoom)
      // If the sender does not inform the Room, then the Websocket will send to all user sockets registered in Redis.
      io.to(userProfile.socketId).emit("GERAL", payload)
    }
  } catch (e) {
    console.error(e)
  }
}
  

  module.exports = {
    sendMessageInSocketController
  }