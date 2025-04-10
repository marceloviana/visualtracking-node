const { Base64 } = require('js-base64')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const { createAppToken, checkCardinality } = require('../model/UserApp')

const createAppTokenController = async (req) => {
    let cookies = cookie.parse(req.headers.cookie || '')
    let accessToken = cookies.auth_token
    let decoded = undefined
    // O uso do JWT aqui é apenas para recuperar o email do usuário contido no cookie de accesso.
    // Isso evita que o usuário tente criar um token para uma aplicação que não é dele.
    try {
        decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    } catch (error) {
        return false
    }

    let dataToken = {
        appName: req.body.appName,
        email: JSON.parse(decoded.user).email,
        createdAt: new Date().getTime()/1000
    }
    
    const token = Base64.encode( JSON.stringify(dataToken) );
    // const decoded = Base64.decode(encoded);
    return await createAppToken(dataToken, token)
}

const checkCardinalityController = async (req) => {
    
    let token = req.headers.token || ''
    let tokenAppName = undefined
    let tokenEmail = undefined

    try {
        tokenAppName = JSON.parse(Base64.decode( token )).appName
        tokenEmail = JSON.parse(Base64.decode( token )).email
    } catch (error) {
        return false
    }
    
    let userApp = await checkCardinality(token)
    if (userApp) {
        if (userApp.appName == tokenAppName && userApp.userApp == tokenEmail) {
            return true
        }
    }

    return false

}

module.exports = {
    createAppTokenController,
    checkCardinalityController
}