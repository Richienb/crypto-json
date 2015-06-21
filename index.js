'use strict'

var crypto = require('crypto')

function decryptValue (value, password, algorithm, enc) {
  var decipher = crypto.createDecipher(algorithm, password)
  return JSON.parse(decipher.update(value, enc, 'utf8') + decipher.final('utf8'))
}

function encryptValue (value, password, algorithm, enc) {
  var cipher = crypto.createCipher(algorithm, password)
  return cipher.update(JSON.stringify(value), 'utf8', enc) + cipher.final(enc)
}

function decryptObject (object, password, algorithm, enc, keys) {
  var output = {}
  for (var key in object) {
    if (keys.indexOf(key) !== -1) {
      output[key] = decryptValue(object[key], password, algorithm, enc)
    } else {
      output[key] = object[key]
    }
  }
  return output
}

function encryptObject (object, password, algorithm, enc, keys) {
  var output = {}
  for (var key in object) {
    if (keys.indexOf(key) !== -1) {
      output[key] = encryptValue(object[key], password, algorithm, enc)
    } else {
      output[key] = object[key]
    }
  }
  return output
}

exports.encrypt = function (object, password, config) {
  var encoding = config ? (config.encoding || 'hex') : 'hex'
  var algorithm = config ? (config.algorithm || 'aes256') : 'aes256'
  var keys = config.keys || []
  return encryptObject(object, password, algorithm, encoding, keys)
}

exports.decrypt = function (object, password, config) {
  var encoding = config ? (config.encoding || 'hex') : 'hex'
  var algorithm = config ? (config.algorithm || 'aes256') : 'aes256'
  var keys = config.keys || []
  return decryptObject(object, password, algorithm, encoding, keys)
}
