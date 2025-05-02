const { addTrack, getTrack } = require('../model/Tracking')
const { getDataUserAppToken } = require('../utils/token')
const { getUserDataFromCookie } = require('../utils/cookie')
const { sendMessageInSocketController } = require('./sendMessageInSocketController')

const trackController = async (req, websocketInstance) => {
    let requestBody = req.body

    // Save in Database
    let dataUserAppToken = await getDataUserAppToken(req)
    requestBody = {appName: dataUserAppToken.appName, userApp: dataUserAppToken.email, ...requestBody}
    let responseBody = await addTrack(requestBody)

    if (responseBody) {
        // get latest record
        let filter = {transactionId: requestBody.transactionId, userApp: dataUserAppToken.email, appName: dataUserAppToken.appName}
        let lastTracks = await getTrack(filter)
        lastTracks.forEach(track => {
            // send only the last track
            let onlyRecord = []
            onlyRecord.push(track.tracking.at(0))
            track.tracking = onlyRecord
            console.log(track)
            sendMessageInSocketController(websocketInstance, track)
        });
        return lastTracks
    }
    return responseBody
}

const getTrackController = async (req, websocketInstance) => {
    let requestBody = req.body

    // Save in Database
    let dataUserCookie = await getUserDataFromCookie(req)
    requestBody = {userApp: dataUserCookie.email, ...requestBody}
    let responseBody = await getTrack(requestBody)
    return responseBody
}

module.exports = {
    trackController,
    getTrackController
}