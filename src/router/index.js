const { healthCheckValidations } = require('./health-check')
const { jwtCheck, preJwtCheck } = require('../middleware/checkToken')
const websocketRouter = require('./websocketRouter')
const trackRouter = require('./trackRouter')
const user = require('./user')
const userApp = require('./userApp')

module.exports = (app, websocketInstance) => {

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

    /*
        JWT validate
    */
    app.post('/br-websocket/cookie/', (req, res) => {
        req.body.forEach(cookie => {
            res.cookie(cookie.name, cookie.value, cookie.param);
        })
        return res.status(200).json(req.headers)

    
    })

    // Modules
    websocketRouter(app)
    user(app)
    userApp(app)
    trackRouter(app, websocketInstance)
}