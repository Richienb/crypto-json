'use strict'

/* global describe, it */

const cryptoJSON = require('../')
const assert = require('assert')
const cipher = 'aes256'

describe('basic tests', () => {
  it('should pass', () => {
    const object = {
      first_name: 'Miles',
      last_name: 'Davis',
      instrument: 'Trumpet',
      birth_year: 1926,
      albums: [
        {title: 'Birth of the Cool', year: 1957},
        {title: 'Bitches Brew', year: 1970}
      ]
    }

    const encoding = 'base64'
    const passKey = require('randomr')(64)
    const keys = ['birth_year']

    const encrypted = cryptoJSON.encrypt(object, passKey, {
      algorithm: cipher,
      encoding: encoding,
      keys: keys
    })

    const decrypted = cryptoJSON.decrypt(encrypted, passKey, {
      algorithm: cipher,
      encoding: encoding,
      keys: keys
    })

    function testNotEqual (a, b) {
      for (const i in a) {
        if (!Array.isArray(a[i]) && keys.indexOf(i) === -1) {
          if (typeof a[i] !== 'object') {
            assert(a[i] !== b[i])
          } else {
            testNotEqual(a[i], b[i])
          }
        }
      }
    }

    function testEqual (a, b) {
      for (const i in a) {
        if (typeof a[i] !== 'object') {
          assert(a[i] === b[i])
        } else {
          testEqual(a[i], b[i])
        }
      }
    }

    testNotEqual(object, encrypted)
    testEqual(decrypted, object)
  })
})
