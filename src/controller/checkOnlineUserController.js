const { redis } = require('../model')

module.exports.checkOnlineUserController = async (req) => {
    let email = req.params.email
    let userProfile = undefined
    let response = []

    if (email) {
        userProfile = await redis.getAllKeys(email)
    } else {
        userProfile = await redis.getAllKeys("@")
    }

    for (let socket_name of userProfile) {
        // Retrieve socket.id by key name in redis
        let userProfile = JSON.parse(await redis.get(socket_name))
        response.push(userProfile)
    }

    return response
}