'use strict'

module.exports = function (crypto) {
  const IV_LENGTH = 16 // For AES, this is always 16
  const output = {}

  let encryptValue, decryptValue, encryptObject, decryptObject

  const decrypt = (pw, algo, enc) => (value) => {
    const valueParts = value.split(':')
    const iv = Buffer.from(valueParts.shift(), enc)
    const encryptedText = Buffer.from(valueParts.join(':'), enc)
    const decipher = crypto.createDecipheriv(algo, Buffer.from(pw), iv)
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])

    return JSON.parse(decrypted.toString())
  }

  const encrypt = (pw, algo, enc) => (value) => {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(algo, Buffer.from(pw), iv)
    let encrypted = cipher.update(JSON.stringify(value))

    encrypted = Buffer.concat([encrypted, cipher.final()])

    return iv.toString(enc) + ':' + encrypted.toString(enc)
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

  /**
   * encrypt: recursively encrypt objects selectively by keys.
   *
   * @param {object} object - Object to be encrypted.
   * @param {string} password - Random password, length according to the selected algorithm, e.g. 32 bytes length with aes-256-cbc.
   * @param {object} config - Set of config parameters:
   *        algorithm - select any supported by the version of Node you are using (default: aes-256-cbc)
   *        encoding - hex, base64, binary (default: hex)
   *        keys - specify which keys to encrypting (default: [], i.e. encrypt nothing)
   */
  output.encrypt = (object, password, { algorithm = 'aes-256-cbc', encoding = 'hex', keys = [] } = {}) => {
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

  /**
   * decrypt: recursively decrypt objects selectively by keys.
   *
   * @param {object} object - Object to be encrypted.
   * @param {string} password - Random password, length according to the selected algorithm, e.g. 32 bytes length with aes-256-cbc.
   * @param {object} config - Set of config parameters:
   *        algorithm - select any supported by the version of Node you are using (default: aes-256-cbc)
   *        encoding - hex, base64, binary (default: hex)
   *        keys - specify which keys to decrypting (default: [], i.e. decrypt nothing)
   */
  output.decrypt = (object, password, { algorithm = 'aes-256-cbc', encoding = 'hex', keys = [] } = {}) => {
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

  return output
}
