'use strict'

const crypto = require('crypto')

let encryptValue, decryptValue, encryptObject, decryptObject

const decrypt = (pw, algo, enc) => (value) => {
  const decipher = crypto.createDecipher(algo, pw)

  return JSON.parse(decipher.update(value, enc, 'utf8') +
    decipher.final('utf8'))
}

const encrypt = (pw, algo, enc) => (value) => {
  const cipher = crypto.createCipher(algo, pw)

  return cipher.update(JSON.stringify(value), 'utf8', enc) +
    cipher.final(enc)
}

function cryptFunction (type) {
  return function (object, keys, isArray) {
    const cryptValue = (type === 'encrypt') ? encryptValue : decryptValue
    const cryptObject = (type === 'encrypt') ? encryptObject : decryptObject
    const output = isArray ? object.map(e => e) : Object.assign({}, object)
    const length = isArray ? object.length : keys.length

    if (keys.length === 0) {
      for (let i = 0, len = Object.keys(object).length; i < len; i++) {
        const key = isArray ? i : Object.keys(object)[i]

        if (typeof object[key] !== 'undefined') {
          output[key] = object[key]

          if (typeof object[key] !== 'object') {
            output[key] = cryptValue(object[key])
          } else if (Array.isArray(object[key])) {
            output[key] = cryptObject(object[key], keys, true)
          } else {
            output[key] = cryptObject(object[key], keys)
          }
        }
      }

      return output
    }

    for (let i = 0; i < length; i++) {
      const key = isArray ? i : keys[i]

      if (typeof object[key] !== 'undefined') {
        output[key] = object[key]

        if (typeof object[key] !== 'object') {
          output[key] = cryptValue(object[key])
        } else if (Array.isArray(object[key])) {
          output[key] = cryptObject(object[key], keys, true)
        } else {
          output[key] = cryptObject(object[key], keys)
        }
      }
    }

    return output
  }
}

exports.encrypt = function (object, password, config) {
  config = config || {}
  const encoding = config ? (config.encoding || 'hex') : 'hex'
  const algorithm = config ? (config.algorithm || 'aes256') : 'aes256'
  const keys = config.keys || []

  if (!object || typeof object !== 'object' || Array.isArray(object)) {
    throw new Error('First argument must be an object.')
  }

  if (!password) {
    throw new Error('Password is required.')
  }

  encryptValue = encrypt(password, algorithm, encoding)
  encryptObject = cryptFunction('encrypt')
  return encryptObject(object, keys)
}

exports.decrypt = function (object, password, config) {
  config = config || {}
  const encoding = config ? (config.encoding || 'hex') : 'hex'
  const algorithm = config ? (config.algorithm || 'aes256') : 'aes256'
  const keys = config.keys || []

  if (!object || typeof object !== 'object' || Array.isArray(object)) {
    throw new Error('First argument must be an object.')
  }

  if (!password) {
    throw new Error('Password is required.')
  }

  decryptValue = decrypt(password, algorithm, encoding)
  decryptObject = cryptFunction('decrypt')
  return decryptObject(object, keys)
}
