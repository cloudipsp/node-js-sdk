'use strict'

const chai = require('chai')
const expect = chai.expect
const CloudIpsp = require('../lib')

const fondy = new CloudIpsp(
  {
    protocol: '1.0',
    merchantId: 1396424,
    baseUrl: 'api.fondy.eu',
    secretKey: 'test',
    creditKey: 'testcredit',
    contentType: 'json'
  }
)

describe('Main API', function () {
  this.timeout(15000)
  describe('API v1', function () {
    it('create subscription url', async () => {
      const date = "2050-05-05"
      const dataCheckout = {
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
      await fondy.Subscription(dataCheckout).then(data => {
        expect(data.checkout_url).to.contain('api.fondy.eu')
      })
    })
    it('create checkout url', async () => {
      const dataCheckout = {
        order_desc: 'order url',
        currency: 'USD',
        amount: '1000'
      }
      await fondy.Checkout(dataCheckout).then(data => {
        expect(data.checkout_url).to.contain('api.fondy.eu')
      })
    })
    it('reccuring', async () => {
      const data = {
        order_desc: 'test order',
        currency: 'USD',
        amount: '1000',
        rectoken: 'b037ba5501956289d7a2094dee020e6560de04'
      }
      await fondy.Recurring(data).then(data => {
        expect(data).to.not.be.empty
        expect(data.masked_card).equal('555566XXXXXX1111')
        expect(data.response_status).equal('success')
      })
    })
    it('reports', async () => {
      const now = new Date()
      const NotNow = new Date()
      NotNow.setHours(NotNow.getHours() - 1)

      const data = {
        date_from: NotNow,
        date_to: now
      }
      await fondy.Reports(data).then(data => {
        expect(data).to.not.be.empty
      })
    })
    it('create p2pcredit', async () => {
      const dataCheckout = {
        order_desc: 'test order',
        currency: 'USD',
        amount: '1000',
        receiver_card_number: '4444555511116666'
      }
      await fondy.P2pcredit(dataCheckout).then(data => {
        expect(data.response_status).equal('success')
      })
    })
    it('create checkout token', async () => {
      const dataCheckout = {
        order_desc: 'order token',
        currency: 'USD',
        amount: '1000'
      }
      await fondy.CheckoutToken(dataCheckout).then(data => {
        expect(data.token).to.not.be.empty
      })
    })
    it('create verification url', async () => {
      const dataVerification = {
        order_desc: 'order token',
        currency: 'USD'
      }
      await fondy.Verification(dataVerification).then(data => {
        expect(data.checkout_url).to.not.be.empty
      })
    })
    it('pci dss step one', async () => {
      const dataApprovedOrder = {
        order_desc: 'test order',
        currency: 'USD',
        amount: '1000',
        card_number: '4444555511116666',
        cvv2: '333',
        expiry_date: '1232',
        preauth: 'Y'
      }
      await fondy.PciDssOne(dataApprovedOrder).then(data => {
        expect(data.response_status).equal('success')
        expect(data.order_status).equal('approved')
      })
    })
    it('pci dss step two', async () => {
      const dataApprovedOrder = {
        order_desc: 'test order',
        currency: 'USD',
        amount: '1000',
        card_number: '4444555566661111',
        cvv2: '333',
        expiry_date: '1232',
        preauth: 'Y'
      }
      await fondy.PciDssOne(dataApprovedOrder).then(data => {
        expect(data.response_status).equal('success')
        expect(data.acs_url).equal('https://api.fondy.eu/test/testacs/')
      })
    })
    it('capture order', async () => {
      const dataApprovedOrder = {
        order_desc: 'test order',
        currency: 'USD',
        amount: '1000',
        card_number: '4444555511116666',
        cvv2: '333',
        expiry_date: '1232',
        preauth: 'Y'
      }
      const orderId = await fondy.PciDssOne(dataApprovedOrder).then(data => {
        return data.order_id
      })
      const captureData = {
        currency: 'USD',
        amount: '1000',
        order_id: orderId
      }
      await fondy.Capture(captureData).then(dataC => {
        expect(dataC.response_status).equal('success')
        expect(dataC.capture_status).equal('captured')
      })
    })
    it('reverse order', async () => {
      const dataApprovedOrder = {
        order_desc: 'test order',
        currency: 'USD',
        amount: '1000',
        card_number: '4444555511116666',
        cvv2: '333',
        expiry_date: '1232',
        preauth: 'Y'
      }
      const orderId = await fondy.PciDssOne(dataApprovedOrder).then(data => {
        return data.order_id
      })
      const reverseData = {
        currency: 'USD',
        amount: '1000',
        order_id: orderId
      }
      await fondy.Reverse(reverseData).then(dataC => {
        expect(dataC.response_status).equal('success')
        expect(dataC.reverse_status).equal('approved')
        expect(dataC.reversal_amount).equal('1000')
      })
    })
    it('status order', async () => {
      const dataApprovedOrder = {
        order_desc: 'test order',
        currency: 'USD',
        amount: '1000',
        card_number: '4444555511116666',
        cvv2: '333',
        expiry_date: '1232',
        preauth: 'Y'
      }
      const orderId = await fondy.PciDssOne(dataApprovedOrder).then(data => {
        return data.order_id
      })
      const statusData = {
        order_id: orderId
      }
      await fondy.Status(statusData).then(dataC => {
        expect(dataC.response_status).equal('success')
        expect(dataC.order_status).equal('approved')
        expect(dataC.amount).equal('1000')
      })
    })
    it('transaction list order', async () => {
      const dataApprovedOrder = {
        order_desc: 'test order',
        currency: 'USD',
        amount: '1000',
        card_number: '4444555511116666',
        cvv2: '333',
        expiry_date: '1232',
        preauth: 'Y'
      }
      const orderId = await fondy.PciDssOne(dataApprovedOrder).then(data => {
        return data.order_id
      })
      const listData = {
        order_id: orderId
      }
      await fondy.TransactionList(listData).then(dataC => {
        dataC.forEach(function (tr) {
          expect(tr.eci).equal('7')
          expect(tr.transaction_status).equal('approved')
        })
      })
    })
  })
})
