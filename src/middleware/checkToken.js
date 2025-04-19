var request = require('request');
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const { auth } = require('express-oauth2-jwt-bearer');
const { checkCardinalityController } = require('../controller/userAppController')
const JWT_SECRET = process.env.JWT_SECRET

const tokenValidate = async (token) => {

    /*
        Check the token validation on the localhost endpoint.
    */
    return new Promise(async (resolve) => {
        request.get({
            headers: {'authorization' : token},
            url:     `http://localhost:${process.env.PORT || 80}/br-websocket/token-validate`,
        }, function(error, response, body){
            resolve(response.statusCode)
        });
    })    

}

const preJwtCheck = (req, res, next) => {

    /*
        Removes any string (AccessToken and etc.) before hash token and replaces it with Bearer.
    */
    let authorization = req.headers.authorization.split(" ")[1]
    req.headers.authorization = `Bearer ${authorization}`
    next()
}

/*
    JWT validate
*/
const auth0 = auth({
    audience: process.env.JWT_AUDIENCE,
    issuerBaseURL: process.env.JWT_ISSUER_BASE_URL
});

/*
    Checks the origin of the request and determines whether to allow it to proceed without authentication.
    Backend applications only.
*/
const jwtCheck = (req, res, next) => {
    const remoteIP = (req.connection.remoteAddress || req.socket.remoteAddress).slice(7, 11)
    // Range IP in cloud AWS
    const skipAuthentication = ["127.", "10.", "172.", "192."]
    console.log("remoteIP::::", remoteIP)

    if (skipAuthentication.includes(remoteIP)) {
        next()
    } else {
        auth0(req, res, next)
    }
}

const protectedMiddleware = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.auth_token

  try {
    if (jwt.verify(token, JWT_SECRET)) next()
  } catch {
    return res.status(401).json('Token failed')
  }
}  

const protectedApiMiddleware = async (req, res, next) => {
    if (await checkCardinalityController(req)) {
        next()
        return
    }
    return res.status(401).json('Token failed')
}

module.exports = {
    tokenValidate,
    jwtCheck,
    preJwtCheck,
    protectedMiddleware,
    protectedApiMiddleware
}