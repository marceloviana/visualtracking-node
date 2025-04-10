const { trackController, createAppTokenController } = require('../controller')
const { jwtCheck, preJwtCheck } = require('../middleware/checkToken')
const { protectedApiMiddleware } = require('../middleware')

module.exports = (app) => {
    /*
        endpoint for send message websocket by Rest.
    */
    app.post('/br-websocket/track', protectedApiMiddleware, async (req, res) => {

        let response = await trackController(req)
        return res.status(200).json(response)
    })
    /*
        endpoint for create token for application
    */
    app.post('/br-websocket/create-userApp', async (req, res) => {

        let response = await createAppTokenController(req, res)
        if (!response) return res.status(401).json('Token failed')
        return res.status(200).json(response)
    })    
}