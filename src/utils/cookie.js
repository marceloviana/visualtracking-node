
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const setCookieWithHTTPS = (res, user, token) => {
  console.log('HTTPS')
  res.cookie("auth_token", token, {
                                  "httpOnly": true,
                                  "secure": true,
                                  "sameSite": "Lax",
                                  "maxAge": 3600000,
                                  "domain": ".infsite.org"
                                });
  res.cookie("user_meta", user, {
                                  "httpOnly": false,
                                  "secure": true,
                                  "sameSite": "Lax",
                                  "maxAge": 3600000,
                                  "domain": ".infsite.org"
                                });                                
}

const setCookieWithoutHTTPS = (res, user, token) => {
  console.log('HTTP')
  res.setHeader('Set-Cookie', [
    `user_meta=${user}; SameSite=Lax; Path=/; Domain=localhost; Max-Age=86400`,
    `auth_token=${token}; HttpOnly; SameSite=Lax; Path=/; Domain=localhost; Max-Age=86400`
  ]);
}

const deleteCookieWithHTTPS = (res, user, token) => {
  res.setHeader('Set-Cookie', [
    `user_meta=${user}; HttpOnly; Secure; SameSite=Lax Path=/; Domain=.infsite.org; Max-Age=0`,
    `auth_token=${token}; HttpOnly; Secure; SameSite=Lax Path=/; Domain=.infsite.org; Max-Age=0`
  ]);  
}

const deleteCookieWithoutHTTPS = (res) => {
  res.setHeader('Set-Cookie', [
  `user_meta=${user}; SameSite=Lax; Path=/; Domain=localhost; Max-Age=0`,
  `auth_token=${token}; HttpOnly; SameSite=Lax; Path=/; Domain=localhost; Max-Age=0`
  ]);
}

const setCookie = async (req, res, user) => {

    const token = jwt.sign({user}, JWT_SECRET, { expiresIn: '1d' })
  
    // res.setHeader('Set-Cookie', [
    //   `user_meta=${user}; ${req.protocol == 'https'? 'HttpOnly': ''}; Path=/; Max-Age=86400`,
    //   `auth_token=${token}; ${req.protocol == 'https'? 'HttpOnly': ''}; Path=/; Max-Age=86400`
    // ]);
    if (req.protocol == 'https') {
      setCookieWithHTTPS(res, user, token)
    } else {
      setCookieWithoutHTTPS(res, user, token)
    }

}

const deleteCookie = async (req, res) => {

  // res.setHeader('Set-Cookie', [
  //   `user_meta=; ${req.protocol == 'https'? 'HttpOnly': ''}; Path=/; Max-Age=0`,
  //   `auth_token=; ${req.protocol == 'https'? 'HttpOnly': ''}; Path=/; Max-Age=0`
  // ]);
  if (req.protocol == 'https') {
    deleteCookieWithHTTPS(res)
  } else {
    deleteCookieWithoutHTTPS(res)
  }  

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
