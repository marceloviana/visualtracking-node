
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const setCookie = (req, res, user) => {

    const token = jwt.sign({user}, JWT_SECRET, { expiresIn: '1h' })
    // controle de sessão e armazenamento do JWT transitado automaticamente (withcredentials)
    res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, {
      httpOnly: req.protocol == 'https'? true : false,
      secure: req.protocol == 'https'? true : false,
      sameSite: 'strict',
      maxAge: 3600,
      path: '/'
    }))

    // // apenas para ajudar no controler/manipulação de sessão no frontend (sem http-only).    
    // res.setHeader('Set-Cookie', cookie.serialize('user_meta', token, {
    //   httpOnly: false,
    //   secure: req.protocol == 'https'? true : false,
    //   sameSite: 'strict',
    //   maxAge: 3600,
    //   path: '/'
    // })) 
  
    return

   }

const verifyCookie = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.auth_token

  try {
    if (jwt.verify(token, JWT_SECRET)) next()
  } catch {
    return false
  }
}

module.exports = {
  setCookie,
  verifyCookie
}
