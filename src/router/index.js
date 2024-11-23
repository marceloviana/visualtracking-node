const { healthCheckValidations } = require('./health-check')
const { checkOnlineUserController } = require('../controller/')
// const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const { jwtCheck, preJwtCheck } = require('../utils/checkToken')


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
        endpoint for delivery rooms before authenticate middleware.
    */
    app.get('/br-websocket/getAllRooms', preJwtCheck, jwtCheck, (req, res) => {
    
        let envList = process.env.ROOMS.split(",")
        let rooms = envList.filter(item => item != 'ALL_USER_ROOM')
        return res.json(rooms)
    })

    /*
        endpoint for delivery the socket.io library.
    */
    app.get('/br-websocket/socketIoLib', (req, res) => {

        res.download(`${__dirname}/lib/socket.io.js`)
    
    })  
    
    /*
        endpoint for delivery connected user.
    */
    app.get(['/br-websocket/check-online-user/', '/br-websocket/check-online-user/:email'], async (req, res) => {

        let response = await checkOnlineUserController(req)
        return res.status(200).json(response)
    
    })

    /*
        JWT validate
    */
        app.get('/br-websocket/token-validate/', preJwtCheck, jwtCheck, (req, res) => {

            return res.status(200).json("Authorized!")
        
        })    

}