const { createAppTokenController, getUserAppController, deleteUserAppController } = require('../controller')
const { protectedMiddleware } = require('../middleware')

module.exports = (app, websocketInstance) => {
    /*
        endpoint for create token for application
    */
    app.post('/br-websocket/create-userApp', protectedMiddleware, async (req, res) => {

        let response = await createAppTokenController(req, res)
        if (!response) return res.status(401).json('Token failed')
        return res.status(200).json(response)
    }) 
    /*
        endpoint for get token for application
    */
    app.post('/br-websocket/getUserApp', protectedMiddleware, async (req, res) => {

        let response = await getUserAppController(req, res)
        if (!response) return res.status(204).json()
        return res.status(200).json(response)
    })
    /*
        endpoint for delete token for application
    */
    app.post('/br-websocket/delete-userApp', protectedMiddleware, async (req, res) => {

        let response = await deleteUserAppController(req, res)
        if (!response) return res.status(204).json()
        return res.status(200).json(response)
    })    
}