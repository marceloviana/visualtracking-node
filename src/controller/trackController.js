const { addTrack } = require('../model/Tracking')

const trackController = async (req, res) => {
    return await addTrack(req.body)
}

module.exports = {
    trackController
}