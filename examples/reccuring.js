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
  currency: 'USD',
  amount: '1000',
  rectoken: 'b037ba5501956289d7a2094dee020e6560de04'
}
fondy.Recurring(data).then(data => {
  console.log(data)
}).catch((error) => {
  console.log(error)
})
