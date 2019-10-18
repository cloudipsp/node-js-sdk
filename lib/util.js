'use strict'

const crypto = require('crypto')
const querystring = require('querystring')

/**
 * Generate sha1 sign
 * @param data
 * @param secret
 * @returns {string}
 */
function genSignatureV2 (data, secret) {
  const signString = secret + '|' + data
  return crypto.createHash('sha1').update(signString).digest('hex')
}
/**
 * Generate sha1 sign
 * @param data
 * @param secret
 * @returns {string}
 */
function genSignature (data, secret) {
  const ordered = {}
  Object.keys(data).sort().forEach(function (key) {
    if (data[key] !== '' && key !== 'signature' && key !== 'response_signature_string') {
      ordered[key] = data[key]
    }
  })
  const signString = secret + '|' + Object.values(ordered).join('|')
  return crypto.createHash('sha1').update(signString).digest('hex')
}

/**
 * Generate random order id
 */
function generateOrderId () {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (var i = 0; i < 40; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/**
 * Get content type
 */
function getContentHeader (type) {
  switch (type) {
    case 'json':
      return 'Content-type: application/json; charset=utf-8'
    case 'form':
      return 'Content-type: application/x-www-form-urlencoded'
    default:
      throw new Error('Type not supported')
  }
}

/**
 * Get converted request
 */
function getConvertedData (type, data, protocol, secret) {
  if (protocol === '2.0') {
    const base64data = Buffer.from(JSON.stringify({ order: data })).toString('base64')
    const body = {
      version: '2.0',
      data: base64data,
      signature: genSignatureV2(base64data, secret)
    }
    return JSON.stringify({ request: body })
  }
  data.signature = genSignature(data, secret)
  switch (type) {
    case 'json':
      return JSON.stringify({ request: data })
    case 'form':
      return querystring.stringify(data)
    default:
      throw new Error('Type not supported')
  }
}

/**
 * Get converted response
 */
function getConvertedResponse (type, data, protocol) {
  if (protocol === '2.0') {
    try {
      const decoded = JSON.parse(data).response.data
      const text = Buffer.from(decoded, 'base64').toString('utf-8')
      return JSON.parse(text).order
    } catch (e) {
      return JSON.parse(data).response
    }
  }
  switch (type) {
    case 'json':
      return JSON.parse(data).response
    case 'form':
      return querystring.parse(data)
    default:
      throw new Error('Type not supported')
  }
}

/**
 * Format date
 * @param date
 * @param fstr
 * @param utc
 * @returns {string}
 */
function dateFormat (date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get'
  return fstr.replace(/%[YmdHMS]/g, function (m) {
    switch (m) {
      case '%Y': return date[utc + 'FullYear']()
      case '%m': m = 1 + date[utc + 'Month'](); break
      case '%d': m = date[utc + 'Date'](); break
      case '%H': m = date[utc + 'Hours'](); break
      case '%M': m = date[utc + 'Minutes'](); break
      case '%S': m = date[utc + 'Seconds'](); break
      default: return m.slice(1)
    }
    return ('0' + m).slice(-2)
  })
}

/**
 * Validate Response object
 */
function validateResponse (data, secret) {
  if (!data.signature) {
    return false
  }
  if (!data.merchant_id) {
    return false
  }

  const originSign = data.signature
  const calculatedSign = genSignature(data, secret)

  return originSign === calculatedSign
}

module.exports = {
  genSignature,
  getConvertedData,
  generateOrderId,
  getContentHeader,
  getConvertedResponse,
  validateResponse,
  dateFormat
}
