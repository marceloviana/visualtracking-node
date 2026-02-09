const { trackController, getTrackController } = require('../controller')
const { protectedApiMiddleware, protectedMiddleware } = require('../middleware')

module.exports = (app, websocketInstance) => {
    /*
        endpoint for send message websocket by Rest.
    */
    app.post('/br-websocket/track', protectedApiMiddleware, async (req, res) => {

        let response = await trackController(req, websocketInstance)
        return res.status(200).json(response)
    })

    /*
        endpoint for send message websocket by Rest.
    */
    app.post('/br-websocket/getTrack', protectedMiddleware, async (req, res) => {

        let response = await getTrackController(req, websocketInstance)
        return res.status(200).json(response)
    })

    /*
        endpoint for send message websocket by Rest from Arduino - No athenticate.
    */
    app.post('/br-websocket/waterLevel', async (req, res) => {

        let response = await trackController(req, websocketInstance)
        return res.status(200).json(response)
    })    
}