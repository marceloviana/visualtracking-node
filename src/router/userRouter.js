const { createUserController, loginController, deleteController, updateUserController } = require('../controller/userController')

module.exports = (app) => {
        /*
            Create user
        */
        app.post('/br-websocket/create-user/', async (req, res) => {
            user = await createUserController(req.body)
            return res.status(200).json(user)
        })
        /*
            Login
        */
        app.post('/br-websocket/login/', async (req, res) => {
            user = await loginController(req, res)
            return res.status(user.username ? 200 : 401).json(user)
        })
        /*
            Delete
        */
        app.post('/br-websocket/delete-user/', async (req, res) => {
            user = await deleteController(req.body)
            return res.status(200).json(user)
        })
        /*
            Update
        */
        app.post('/br-websocket/update-user/', async (req, res) => {
            user = await updateUserController(req.body)
            return res.status(200).json(user)
        })
        
}