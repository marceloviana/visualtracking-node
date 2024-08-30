const { redis } = require('../model')

module.exports.checkOnlineUserController = async (req) => {
    let email = req.params.email
    let socket_names = undefined
    if (email) {
        socket_names = await redis.getAllKeys(email)
    } else {
        socket_names = await redis.getAllKeys("nutrien.com")
    }
    let emails = socket_names.map(name => name.replace(/.nutrien.com.*/g, "@nutrien.com"))
    let response = []
    for (email of emails) {
        if (!response.includes(email)) {
            response.push(email)
        }
    }
    return response
}