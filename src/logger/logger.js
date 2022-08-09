const path = require('path')
const WinstonDaily = require('winston-daily-rotate-file')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, json } = format

const logDir = path.join('..', '..', 'logs')

const debugLogger = () => {
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })

  return createLogger({
    level: 'debug',
    format: combine(format.colorize(), timestamp({ format: 'HH:mm:ss' }), myFormat),
    transports: [new transports.Console()],
  })
}


const productionLogger = () => {
  return createLogger({
    level: 'debug',
    format: combine(timestamp(), json()),
    transports: [
      new transports.Console(),
      // error 레벨 로그 - 파일저장
      new WinstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: path.join(__dirname, logDir, '/error'),
        filename: '%DATE%.error.log',
        maxFiles: 30,
        zippedArchive: true,
      }),
      // 모든 레벨 로그 - 파일저장
      new WinstonDaily({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: path.join(__dirname, logDir, '/all'),
        filename: '%DATE%.all.log',
        maxFiles: 7,
        zippedArchive: true,
      }),
    ],
  })
}


if (process.env.NODE_ENV !== 'production') {
  logger = debugLogger()
} else {
  logger = productionLogger()
}

const stream = {
  write: message => {
    logger.info(message)
  }
}

module.exports = { logger, stream }