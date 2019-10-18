'use strict'

const CloudIpsp = require('../lib')

const fondy = new CloudIpsp(
  {
    merchantId: 1396424,
    secretKey: 'test',
    creditKey: 'testcredit'
  }
)
const data = {
  order_desc: 'test order',
  currency: 'USD',
  amount: '1000',
  receiver_card_number: '4444555511116666'
}
fondy.P2pcredit(data).then(data => {
  console.log(data)
  console.log(fondy.isValidResponse(data, true))
}).catch((error) => {
  console.log(error)
})
