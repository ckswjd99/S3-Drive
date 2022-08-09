const path = require('path')

const genRouter = (dbAccessor, bucketAccessor) => {
  const router = require('express').Router()

  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
  })

  router.get('/dir/*', async (req, res) => {
    const parsePathStart = req.path.indexOf('dir/')
    const path = req.path.slice(parsePathStart+'dir/'.length)
    const fileList = await bucketAccessor.directory(path)
    res.send(fileList)
  })

  router.get('/file/*', async (req, res) => {
    const parsePathStart = req.path.indexOf('file/')
    const path = req.path.slice(parsePathStart+'file/'.length)
    const filename = path.split('/')[path.split('/').length - 1]
    const stream = await bucketAccessor.downloadStream(path)
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    stream.pipe(res)
  })

  router.post('/file', bucketAccessor.uploadMiddleWare().single('uploadFile'), async (req, res) => {
    res.send({ state: 'success' })
  })

  return router
}

module.exports = genRouter