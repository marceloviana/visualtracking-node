const { Base64 } = require('js-base64')

const getDataUserAppToken = (req) => {
    
    let token = req.headers.token || ''

    try {
        return JSON.parse(Base64.decode( token ))
    } catch (error) {
        return undefined
    }

}

module.exports = {
    getDataUserAppToken
}