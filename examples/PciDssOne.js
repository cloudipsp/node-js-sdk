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
  card_number: '4444555511116666',
  cvv2: '333',
  expiry_date: '1232',
  client_ip: '127.2.2.1'
}
fondy.PciDssOne(data).then(data => {
  console.log(data)
  console.log(fondy.isValidResponse(data))
}).catch((error) => {
  console.log(error)
})
