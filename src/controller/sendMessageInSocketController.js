const { redis } = require('../model')

const sendMessageInSocketController = async (io, data) => {

    // fields validate
    if (!data.email && !data.message & !data.sender) {
      console.warn('Malformed payload')
      return
    }

    let payload = JSON.stringify({type: 'message', data: data['message'], email: data.email, sender: data.sender})

    if ( data['broadcast'] ) {
      io.emit(data['room'], payload)
    } else {
      try {
        // Retrieve all connections for user (browser tabs)
        let userProfiles = await redis.getAllKeys(data['email'])
        if (!userProfiles.length) return
        for (let socket_name of userProfiles) {
          // Retrieve socket.id by key name in redis
          let userProfile = JSON.parse(await redis.get(socket_name))
          console.warn("Sending message to : ", userProfile.socketId, '<--->', userProfile.email, '<--->', userProfile.userRoom)
          // If the sender does not inform the Room, then the Websocket will send to all user sockets registered in Redis.
          let userRoom = data['room'] === 'ALL_USER_ROOM' ? userProfile.userRoom : data['room'] || "GERAL"
          io.to(userProfile.socketId).emit(userRoom, payload)
        }
        // send back to sender
        let userProfileSender = JSON.parse(await redis.get(data.sender))
        io.to(userProfileSender.socketId).emit(data['room'], payload)
      } catch (e) {
        console.error(e)
      }
    }
  }

  module.exports = {
    sendMessageInSocketController
  }