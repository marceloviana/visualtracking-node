const { healthCheckValidations } = require('./health-check')
const { jwtCheck, preJwtCheck } = require('../middleware/checkToken')
const userRouter = require('./userRouter')
const websocketRouter = require('./websocketRouter')
const trackRouter = require('./trackRouter')

module.exports = (app) => {

    /*
        Hello everyone
    */
    app.get(['/', '/br-websocket'], (req, res) => {

        res.json("Instant Messaging API by Socket Protocol.")
    
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
        JWT validate
    */
    app.get('/br-websocket/token-validate/', preJwtCheck, jwtCheck, (req, res) => {

        return res.status(200).json("Authorized!")
    
    })
    // Modules
    websocketRouter(app)
    userRouter(app)
    trackRouter(app)
}