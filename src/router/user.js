const { createUserController, loginController, deleteController, updateUserController, logoutController } = require('../controller/userController')

module.exports = (app) => {
        /*
            Create user
        */
        app.post('/br-websocket/create-user/', async (req, res) => {
            let user = await createUserController(req.body)
            return res.status(user.username ? 200 : 409).json(user)
        })
        /*
            Login
        */
        app.post('/br-websocket/login/', async (req, res) => {
            let user = await loginController(req, res)
            return res.status(user.username ? 200 : 401).json(user)
        })
        /*
            Login
        */
        app.post('/br-websocket/logout/', async (req, res) => {
            let user = await logoutController(req, res)
            return res.status(200).json(user)
        })        
        /*
            Delete
        */
        app.post('/br-websocket/delete-user/', async (req, res) => {
            let user = await deleteController(req.body)
            return res.status(200).json(user)
        })
        /*
            Update
        */
        app.post('/br-websocket/update-user/', async (req, res) => {
            let user = await updateUserController(req.body)
            return res.status(200).json(user)
        })
        
}