const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

class S3Bucket {
  constructor(s3, bucketName, createdAt) {
    this.s3 = s3
    this.bucketName = bucketName
    this.createdAt = createdAt
  }

  directory(path) {
    const pathPostfixed = path[path.length-1] === '/' ? path : path+'/'
    const realPath = pathPostfixed[0] === '/' ? pathPostfixed.slice(1) : pathPostfixed

    const config = {
      Bucket: this.bucketName,
      Prefix: realPath,
      Delimiter: '/'
    }
    return new Promise((resolve, reject) => {
      this.s3.listObjects(config, (err, data) => {
        if(err) reject(err)
        const result = {
          bucket: data['Name'],
          prefix: data['Prefix'],
          delimiter: data['Delimiter'],
          files: data['Contents'].map(content => ({
            name: (realPath === '' ? content['Key'] : content['Key'].split(realPath)[1]),
            size: content['Size'],
            lastModified: content['LastModified'],
          })),
          folders: data['CommonPrefixes'].map(content => (realPath === '' ? content['Prefix'] : content['Prefix'].split(realPath)[1]))
        }
        resolve(result)
      })
    })
  }

  uploadMiddleWare() {
    const upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function(req, file, cb) {
          const path = `${file.originalname}`
          const realPath = path[0] === '/' ? path.slice(1) : path
          cb(null, file.originalname)
        }
      })
    })
    return upload
  }

  async downloadStream(path) {
    const realPath = path[0] === '/' ? path.slice(1) : path
    return await this.s3.getObject({Bucket: this.bucketName, Key: realPath}).createReadStream()
  }
}

class S3Accessor {
  constructor({accessKeyId, secretAccessKey, region}) {
    this.s3 = new AWS.S3({
      accessKeyId, secretAccessKey, region
    })
  }

  buckets() {
    return new Promise((resolve, reject) => {
      this.s3.listBuckets((err, data) => {
        if(err) reject(err)
        const buckets = data['Buckets'].map(bucketData => new S3Bucket(this.s3, bucketData['Name'], bucketData['CreationDate']))
        resolve(buckets)
      })
    })
  }

  getBucket(bucketName) {
    return new Promise((resolve, reject) => {
      this.s3.listBuckets((err, data) => {
        if(err) reject(err)
        const targetBucket = data['Buckets'].find(bucket => bucket['Name'] === bucketName)
        if(!targetBucket) reject('no such bucket')
        resolve(new S3Bucket(this.s3, targetBucket['Name'], targetBucket['creationDate']))
      })
    })
  }
}

module.exports = S3Accessor