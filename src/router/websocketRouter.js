const { checkOnlineUserController } = require('../controller/')
const { jwtCheck, preJwtCheck } = require('../middleware/checkToken')

module.exports = (app) => {
    /*
        endpoint for delivery rooms before authenticate middleware.
    */
    app.get('/br-websocket/getAllRooms', preJwtCheck, jwtCheck, (req, res) => {

        let envList = process.env.ROOMS.split(",")
        let rooms = envList.filter(item => item != 'ALL_USER_ROOM')
        return res.json(rooms)
    })
    /*
    endpoint for delivery connected user.
    */
   app.get(['/br-websocket/check-online-user/', '/br-websocket/check-online-user/:email'], async (req, res) => {
       
       let response = await checkOnlineUserController(req)
       return res.status(200).json(response)
    })
    /*
        endpoint for delivery the socket.io library.
    */
    app.get('/br-websocket/socketIoLib', (req, res) => {
 
        res.download(`${__dirname}/lib/socket.io.js`)
    }) 
}