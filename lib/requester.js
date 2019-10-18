'use strict'

const https = require('https')

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const request = https.request(options, (res) => {
      let body = ''
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        body = body + chunk
      })
      res.on('end', function () {
        resolve(body)
      })
    })
    request.on('error', (error) => reject(error))
    request.write(options.body)
    request.end()
  })
}
