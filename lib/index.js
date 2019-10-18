'use strict'

const util = require('./util')
const request = require('./requester')

class CloudIpsp {
  /**
     * Base class
     * @param protocol
     * @param merchantId
     * @param baseUrl
     * @param secretKey
     * @param creditKey
     * @param contentType
     * @param timeout
     */
  constructor ({
    protocol = '1.0',
    merchantId,
    baseUrl = 'api.fondy.eu',
    secretKey,
    creditKey,
    contentType = 'json',
    timeout = 60 * 1000
  }) {
    this.config = {
      protocol,
      merchantId,
      baseUrl,
      secretKey,
      creditKey,
      contentType,
      timeout
    }
    if (!this.config.merchantId || isNaN(this.config.merchantId)) throw new Error('Merchant id incorrect')
    if (!this.config.secretKey) throw new Error('Secret Key is empty')
  }

  /**
   * Check data
   * @param data
   * @returns {*}
   */
  getImportantParams (data) {
    data.merchant_id = this.config.merchantId
    return data
  }

  /**
     * Gen order id
     */
  getOrderId () {
    return `${this.config.merchantId}_${util.generateOrderId()}`
  }

  /**
   *
   * @param path
   * @param body
   * @param credit
   * @returns {Promise<any|ParsedUrlQuery>}
   * @private
   */
  async _request ({ path, body = null, credit = false }) {
    const type = this.config.contentType
    const secret = credit ? this.config.creditKey : this.config.secretKey

    const headers = {
      'User-Agent': 'cloudipsp-nodejs-sdk',
      'Content-Type': util.getContentHeader(type)
    }

    const options = {
      hostname: this.config.baseUrl,
      port: 443,
      path: `/api/${path}`,
      method: 'POST',
      headers,
      body: util.getConvertedData(type, body, this.config.protocol, secret),
      timeout: this.config.timeout
    }
    const data = await request(options)
    const response = util.getConvertedResponse(type, data, this.config.protocol)
    if (response.error_code) {
      throw new Error(
        'Response status is failure\n' +
         `error_code: ${response.error_code}\n` +
         `request_id: ${response.request_id}\n` +
         `error_message: ${response.error_message}\n`
      )
    } else {
      return response
    }
  }
}

CloudIpsp.prototype.isValidResponse = function (data, credit = false) {
  return util.validateResponse(data, credit ? this.config.creditKey : this.config.secretKey)
}

CloudIpsp.prototype.Checkout = function (data) {
  if (!data.order_id) { data.order_id = this.getOrderId() }
  const request = this.getImportantParams(data)

  const options = {
    path: 'checkout/url/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.CheckoutToken = function (data) {
  if (!data.order_id) { data.order_id = this.getOrderId() }

  const request = this.getImportantParams(data)

  const options = {
    path: 'checkout/token/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.Verification = function (data) {
  if (!data.order_id) { data.order_id = this.getOrderId() }

  data.verification = 'Y'
  if (!data.verification_type) {
    data.verification_type = 'amount'
  }
  if (!data.amount) {
    data.amount = 0
  }
  const request = this.getImportantParams(data)
  const options = {
    path: 'checkout/url/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.Capture = function (data) {
  const request = this.getImportantParams(data)
  const options = {
    path: 'capture/order_id/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.Recurring = function (data) {
  if (!data.order_id) { data.order_id = this.getOrderId() }

  const request = this.getImportantParams(data)
  const options = {
    path: 'recurring/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.Reverse = function (data) {
  const request = this.getImportantParams(data)
  const options = {
    path: 'reverse/order_id/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.Status = function (data) {
  const request = this.getImportantParams(data)
  const options = {
    path: 'status/order_id/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.P2pcredit = function (data) {
  if (!data.order_id) { data.order_id = this.getOrderId() }

  const request = this.getImportantParams(data)
  const options = {
    path: 'p2pcredit/',
    body: request,
    credit: true
  }

  return this._request(options)
}

CloudIpsp.prototype.TransactionList = function (data) {
  this.config.protocol = '1.0'
  const request = this.getImportantParams(data)
  const options = {
    path: 'transaction_list/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.Reports = function (data) {
  data.date_from = util.dateFormat(data.date_from, '%d.%m.%Y %H:%M:%S', true)
  data.date_to = util.dateFormat(data.date_to, '%d.%m.%Y %H:%M:%S', true)

  const request = this.getImportantParams(data)
  const options = {
    path: 'reports/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.PciDssOne = function (data) {
  if (!data.order_id) { data.order_id = this.getOrderId() }

  const request = this.getImportantParams(data)
  const options = {
    path: '3dsecure_step1/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.PciDssTwo = function (data) {
  const request = this.getImportantParams(data)
  const options = {
    path: '3dsecure_step2/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.Settlement = function (data) {
  this.config.protocol = '2.0'
  const request = this.getImportantParams(data, false)
  const options = {
    path: 'settlement/',
    body: request
  }

  return this._request(options)
}

CloudIpsp.prototype.Subscription = function (data) {
  this.config.protocol = '2.0'
  this.config.contentType = 'json'
  data.subscription = 'Y'
  const request = this.getImportantParams(data, false)
  const options = {
    path: 'checkout/url/',
    body: request
  }

  return this._request(options)
}

module.exports = CloudIpsp
