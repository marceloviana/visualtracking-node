const { authAsMiddleware } = require('../services/')
const { healthCheckValidations } = require('./health-check')

module.exports = (app) => {

    /*
        Hello everyone
    */
    app.get(['/', '/br-websocket'], (req, res) => {

        res.json("Instant Messaging API by Socket Protocol. This application is sub-service from Notification-Center.")
    
    })
  
    /*
        Health-Check
    */
    app.get(['/health-check', '/br-websocket/health-check'], async (req, res) => {

        let validations = await healthCheckValidations()
        if (validations.status) {
            res.status(200).json("It's okay!")
            return
        }
        res.status(503).json(validations.message)
    })
    
    /*
        endpoint to delivery rooms before authenticate middleware.
    */
    app.get('/br-websocket/getAllRooms', authAsMiddleware, (req, res) => {
    
        res.json(process.env.ROOMS.split(","))
    
    })

}