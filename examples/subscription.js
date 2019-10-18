'use strict'

const CloudIpsp = require('../lib')

const fondy = new CloudIpsp(
  {
    merchantId: 1396424,
    secretKey: 'test'
  }
)
const date = new Date().toISOString().slice(0, 10)

const data = {
  order_desc: 'test order',
  currency: 'USD',
  amount: 1000,
  recurring_data:
  {
    every: 5,
    period: 'day',
    amount: 1000,
    start_time: date,
    state: 'y',
    Readonly: 'n'
  }
}
fondy.Subscription(data).then(data => {
  console.log(data)
}).catch((error) => {
  console.log(error)
})
