'use strict'

const CloudIpsp = require('../lib')

const fondy = new CloudIpsp(
  {
    merchantId: 700001,
    secretKey: 'test',
    protocol: '2.0'
  }
)

const receivers = [{
  requisites: {
    amount: 500,
    merchant_id: 600001
  },
  type: 'merchant'
},
{
  requisites: {
    amount: 500,
    merchant_id: 700001
  },
  type: 'merchant'
}

]
const data = {
  order_id: 'Your Order Id',
  order_desc: 'test order',
  currency: 'USD',
  amount: '1000',
  receiver: receivers
}
console.log(data)
fondy.Checkout(data).then(data => {
  console.log(data)
}).catch((error) => {
  console.log(error)
})
