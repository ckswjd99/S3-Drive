const isLogined = require('../util/isLogined')

const genRouter = (dbAccessor) => {
  const router = require('express').Router()
  router.use(isLogined)

  router.get('/', (req, res) => {
    // get user's storage list & info
  })

  router.get('/:storageName', (req, res) => {
    // get storage's info
  })

  router.post('/:storageName', (req, res) => {
    // create new storage
  })

  router.put('/:storageName', (req, res) => {
    // edit storage info
  })

  router.delete('/:storageName', (req, res) => {
    // delete storage
  })
  

  return router
}

module.exports = genRouter