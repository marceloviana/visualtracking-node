const { addTrack, getTrack } = require('../model/Tracking')
const { getDataUserAppToken } = require('../utils/token')
const { sendMessageInSocketController } = require('./sendMessageInSocketController')

const trackController = async (req, websocketInstance) => {
    let requestBody = req.body

    // Save in Database
    let dataUserAppToken = await getDataUserAppToken(req)
    requestBody = {appName: dataUserAppToken.appName, userApp: dataUserAppToken.email, ...requestBody}
    console.log(requestBody)
    let responseBody = await addTrack(requestBody)

    if (responseBody) {
        // send to socket
        requestBody.tracking.forEach( async (item) => {
            let data = {
                email: dataUserAppToken.email,
                sender: dataUserAppToken.email,
                appName: dataUserAppToken.appName,
                message: item.phaseName
            }
            await sendMessageInSocketController(websocketInstance, data)
        })

    }
    return responseBody
}

const getTrackController = async (req, websocketInstance) => {
    let requestBody = req.body

    // Save in Database
    let dataUserAppToken = await getDataUserAppToken(req)
    requestBody = {appName: dataUserAppToken.appName, userApp: dataUserAppToken.email, ...requestBody}
    let responseBody = await getTrack(requestBody)
    return responseBody
}

module.exports = {
    trackController,
    getTrackController
}