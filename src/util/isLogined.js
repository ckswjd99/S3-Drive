const { STATE_SUCCESS, STATE_FAIL } = require('../config')

const isLogined = (req, res, next) => {
  if(req.user) next()
  else res.send({ status: STATE_FAIL, message: 'not logined' })
}

module.exports = isLogined