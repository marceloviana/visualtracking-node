var request = require('request');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

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
const jwtCheck = auth({
    audience: process.env.JWT_AUDIENCE,
    issuerBaseURL: process.env.JWT_ISSUER_BASE_URL
});

module.exports = {
    tokenValidate,
    jwtCheck,
    preJwtCheck
}