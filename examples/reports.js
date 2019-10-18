'use strict'

const CloudIpsp = require('../lib')

const fondy = new CloudIpsp(
  {
    merchantId: 1396424,
    secretKey: 'test'
  }
)
const now = new Date()
const NotNow = new Date()
NotNow.setHours(NotNow.getHours() - 1)

const data = {
  date_from: NotNow,
  date_to: now
}

fondy.Reports(data).then(data => {
  console.log(data)
}).catch((error) => {
  console.log(error)
})
