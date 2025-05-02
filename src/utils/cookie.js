
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const setCookie = async (req, res, user) => {

    const token = jwt.sign({user}, JWT_SECRET, { expiresIn: '1d' })
    console.log('host:::', req.headers)
    await res.cookie("auth_token", token, {
      "httpOnly": true,
      "secure": req.protocol == 'https'? true : false,
      "sameSite": "Lax",
      "maxAge": 60 * 60 * 1000,
      "domain": req.headers.origin.replace(`${req.protocol}://`, '')
    });
    await res.cookie("user_meta", user, {
      "httpOnly": false,
      "secure": req.protocol == 'https'? true : false,
      "sameSite": "Lax",
      "maxAge": 60 * 60 * 1000,
      "domain": req.headers.origin.replace(`${req.protocol}://`, '')
    });

}

const deleteCookie = async (req, res) => {

  await res.cookie("auth_token", token, {
    "httpOnly": true,
    "secure": req.protocol == 'https'? true : false,
    "sameSite": "Lax",
    "maxAge": 60 * 60 * 1000,
    "domain": req.headers.origin
  });
  await res.cookie("user_meta", user, {
    "httpOnly": false,
    "secure": req.protocol == 'https'? true : false,
    "sameSite": "Lax",
    "maxAge": 60 * 60 * 1000,
    "domain": req.headers.origin
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
