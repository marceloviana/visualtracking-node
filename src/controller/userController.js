const { createUser, login, deleteUser, updateUser } = require('../model/User')
const bcrypt = require('bcryptjs');
const { setCookie } = require('../utils/cookie')

const createUserController = async (user) => {
    let {username, email, password } = user

    let senhaHash = await bcrypt.hash(password, 10)

    let documents = {
        username: username,
        email: email,
        password: senhaHash
    }

    return createUser(documents)
}

const loginController = async (req, res) => {   
    let userDoc = await login(req.body)
    if (userDoc.username) setCookie(req, res, JSON.stringify(userDoc))
    return userDoc
}

const deleteController = async (user) => {
    return await deleteUser(user)
}

const updateUserController = async (user) => {
    return await updateUser(user)
}

module.exports = {
    createUserController,
    loginController,
    deleteController,
    updateUserController
}