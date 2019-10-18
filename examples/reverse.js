'use strict'

const CloudIpsp = require('../lib')

const fondy = new CloudIpsp(
  {
    merchantId: 1396424,
    secretKey: 'test',
    contentType: 'form'
  }
)
const data = {
  order_desc: 'test order',
  currency: 'USD',
  amount: '1000',
  card_number: '4444555511116666',
  cvv2: '333',
  expiry_date: '1232',
  preauth: 'Y'
}
fondy.PciDssOne(data).then(data => {
  const reverseData = {
    currency: 'USD',
    amount: '1000',
    order_id: data.order_id
  }
  fondy.Reverse(reverseData).then(data => {
    console.log(data)
  })
})
