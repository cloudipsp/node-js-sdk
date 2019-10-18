'use strict'

const CloudIpsp = require('../lib')

const fondy = new CloudIpsp(
  {
    merchantId: 1396424,
    secretKey: 'test'
  }
)
const data = {
  order_desc: 'test order',
  currency: 'USD'
}
fondy.Verification(data).then(data => {
  console.log(data)
}).catch((error) => {
  console.log(error)
})
