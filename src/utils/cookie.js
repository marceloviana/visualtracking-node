const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const domain = '.infsite.org'
const expiration = 60 * 60 * 12000

const setCookie = async (req, res, user) => {

    const token = jwt.sign({user}, JWT_SECRET, { expiresIn: '1d' })

    await res.cookie("auth_token", token, {
      "httpOnly": true,
      "secure": req.protocol == 'https'? true : false,
      "sameSite": "Lax",
      "maxAge": expiration,
      "domain": domain
    });
    await res.cookie("user_meta", user, {
      "httpOnly": false,
      "secure": req.protocol == 'https'? true : false,
      "sameSite": "Lax",
      "maxAge": expiration,
      "domain": domain
    });

}

const deleteCookie = async (req, res) => {

  await res.cookie("auth_token", token, {
    "httpOnly": true,
    "secure": req.protocol == 'https'? true : false,
    "sameSite": "Lax",
    "maxAge": 0,
    "domain": domain
  });
  await res.cookie("user_meta", user, {
    "httpOnly": false,
    "secure": req.protocol == 'https'? true : false,
    "sameSite": "Lax",
    "maxAge": 0,
    "domain": domain
  });

}

const getUserDataFromCookie = (req) => {
      let cookies = cookie.parse(req.headers.cookie || '')
      let accessToken = cookies.auth_token
      let decoded = undefined
      // O uso do JWT aqui é apenas para recuperar o email do usuário contido no cookie de accesso.
      // Isso evita que o usuário tente criar um token para uma aplicação que não é dele.
      try {
          decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
          return JSON.parse(decoded.user)
      } catch (error) {
          return false
      }
}

module.exports = {
  setCookie,
  deleteCookie,
  getUserDataFromCookie
}
