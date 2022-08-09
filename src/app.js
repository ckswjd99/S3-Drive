const express = require('express')
const http = require('http')
require('dotenv').config()

const main = async () => {
  const app = express()
  
  /********** LOGGER **********/
  const morgan = require('morgan')
  const { stream } = require('./logger/logger')
  app.use(morgan('combined', {stream}))
  
  
  /********** ACCESSORS **********/
  const MySqlAccessor = require('./accessor/mysql')
  const S3Accessor = require('./accessor/s3')

  const dbAccessor = new MySqlAccessor()
  
  const testS3 = new S3Accessor({
    accessKeyId: process.env.TEST_S3_ACCESSID,
    secretAccessKey: process.env.TEST_S3_SECRETKEY,
    region: process.env.TEST_S3_REGION
  })
  
  const testBucket = await testS3.getBucket('5iq.cc')


  /********** ROUTERS **********/
  const exploreRouter = require('./router/explore')
  const authRouter = require('./router/auth')
  const storageRouter = require('./router/storage')
  
  app.use('/explore', exploreRouter(dbAccessor, testBucket))
  app.use('/auth', authRouter(dbAccessor))
  app.use('/storage', storageRouter(dbAccessor))
  

  /********** RUN SERVER **********/
  app.set('port', process.env.SERVER_PORT)
  const server = http.createServer(app);
  server.listen(process.env.SERVER_PORT)

}

main()