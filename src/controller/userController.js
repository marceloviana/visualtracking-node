const { createUser, login, deleteUser, updateUser } = require('../model/User')
const bcrypt = require('bcryptjs');
const { setCookie, deleteCookie } = require('../utils/cookie')

const createUserController = async (user) => {
    let {username, email, password } = user
    if (!username || !email || !password) return "Bad request - The fields must be filled correctly"
    let senhaHash = await bcrypt.hash(password, 10)

    let documents = {
        username: username,
        email: email,
        password: senhaHash
    }

    return createUser(documents)
}

const loginController = async (req, res) => {
    if (!req.body.email || !req.body.password) return "Email or password not provided"
    let userDoc = await login(req.body)
    if (userDoc.username) await setCookie(req, res, JSON.stringify(userDoc))
    return userDoc
}

const logoutController = async (req, res) => {
    return await deleteCookie(req, res)
}

const deleteController = async (user) => {
    return await deleteUser(user)
}

const updateUserController = async (user) => {
    if (user.password) user.password = await bcrypt.hash(user.password, 10)
    return await updateUser(user)
}

module.exports = {
    createUserController,
    loginController,
    deleteController,
    updateUserController,
    logoutController
}