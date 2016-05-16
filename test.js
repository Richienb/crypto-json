'use strict'

var cryptoJSON = require('./')
var assert = require('assert')
var cipher = 'aes256'

var object = {
  first_name: 'Miles',
  last_name: 'Davis',
  instrument: 'Trumpet',
  birth_year: 1926,
  albums: [
    {title: 'Birth of the Cool', year: 1957},
    {title: 'Bitches Brew', year: 1970}
  ]
}

var encoding = 'base64'
var passKey = require('randomr')(64)
var keys = ['birth_year']

var encrypted = cryptoJSON.encrypt(object, passKey, {
  algorithm: cipher,
  encoding: encoding,
  keys: keys
})

var decrypted = cryptoJSON.decrypt(encrypted, passKey, {
  algorithm: cipher,
  encoding: encoding,
  keys: keys
})

function testNotEqual (a, b) {
  for (var i in a) {
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
  for (var i in a) {
    if (typeof a[i] !== 'object') {
      assert(a[i] === b[i])
    } else {
      testEqual(a[i], b[i])
    }
  }
}

testNotEqual(object, encrypted)
testEqual(decrypted, object)

