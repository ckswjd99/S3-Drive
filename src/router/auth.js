const isLogined = require('../util/isLogined')

const genRouter = (dbAccessor) => {
  const router = require('express').Router()

  router.post('/', isLogined, (req, res) => {
    // user info
  })

  router.post('/login', (req, res) => {
    // login
  })

  router.post('/logout', isLogined, (req, res) => {
    // logout
  })

  router.post('/signup', (req, res) => {
    // sign up
  })

  router.delete('/withdraw', isLogined, (req, res) => {
    // withdraw
  })

  router.post('/email', (req, res) => {
    // verify email
  })

  router.put('/password', (req, res) => {
    // reset password
  })

  return router
}

module.exports = genRouter