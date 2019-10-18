# IPSP NODEJS-SDK

<p align="center">
  <img width="200" height="200" src="https://avatars0.githubusercontent.com/u/15383021?s=200&v=4">
</p>
<p align="center">
	<a href="https://www.npmjs.com/package/cloudipsp-node-js-sdk"><img src="https://img.shields.io/npm/v/cloudipsp-node-js-sdk.svg" /></a>
	<a href="https://www.npmjs.com/package/cloudipsp-node-js-sdk"><img src="https://img.shields.io/npm/dt/cloudipsp-node-js-sdk.svg" /></a>
	<a href="https://www.npmjs.com/package/cloudipsp-node-js-sdk"><img src="https://img.shields.io/npm/dw/cloudipsp-node-js-sdk.svg" /></a>
</p>

## Payment service provider
A payment service provider (PSP) offers shops online services for accepting electronic payments by a variety of payment methods including credit card, bank-based payments such as direct debit, bank transfer, and real-time bank transfer based on online banking. Typically, they use a software as a service model and form a single payment gateway for their clients (merchants) to multiple payment methods. 
[read more](https://en.wikipedia.org/wiki/Payment_service_provider)

## Installation

```cmd
npm install cloudipsp-node-js-sdk
```

#### Manual installation
```cmd
git clone -b master https://github.com/has-well/cloudipsp-node-js-sdk.git
```

## Required
```
node >= 7
```
## Simple Start
```javascript
const CloudIpsp = require('cloudipsp-node-js-sdk')

const fondy = new CloudIpsp(
  {
    merchantId: 1396424,
    secretKey: 'test'
  }
)
const requestData = {
  order_desc: 'test order',
  currency: 'USD',
  amount: '1000'
}
fondy.Checkout(requestData).then(data => {
  console.log(data)
}).catch((error) => {
  console.log(error)
})

```
# Api

See [docs](https://docs.fondy.eu/)

## Examples
[Checkout examples](https://github.com/has-well/cloudipsp-node-js-sdk/tree/master/examples)
