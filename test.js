'use strict'

var cryptoJSON = require('./')
var assert = require('assert')

var ciphers = [
  'aes128',
  'aes192',
  'aes256',
  'bf',
  'bf-cbc',
  'bf-cfb',
  'bf-ecb',
  'bf-ofb',
  'blowfish',
  'camellia-128-cbc',
  'camellia-128-cfb',
  'camellia-128-cfb1',
  'camellia-128-cfb8',
  'camellia-128-ecb',
  'camellia-128-ofb',
  'camellia-192-cbc',
  'camellia-192-cfb',
  'camellia-192-cfb1',
  'camellia-192-cfb8',
  'camellia-192-ecb',
  'camellia-192-ofb',
  'camellia-256-cbc',
  'camellia-256-cfb',
  'camellia-256-cfb1',
  'camellia-256-cfb8',
  'camellia-256-ecb',
  'camellia-256-ofb',
  'camellia128',
  'camellia192',
  'camellia256',
  'rc2',
  'rc2-40-cbc',
  'rc2-64-cbc',
  'rc2-cbc',
  'rc2-cfb',
  'rc2-ecb',
  'rc2-ofb',
  'rc4',
  'rc4-40',
  'rc4-hmac-md5'
]

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

var i = 0
var encoding = 'base64'

;(function eachCipher (n) {
  n = n || i

  var cipher = ciphers[n]
  if (!cipher) return process.exit(0)

  console.log('[%d] cipher: %s', i, cipher)

  var passKey = require('randomr')(64)
  console.log('passKey = ' + passKey)
  var encrypted = cryptoJSON.encrypt(object, passKey, {
    algorithm: cipher,
    encoding: encoding
  })

  var decrypted = cryptoJSON.decrypt(encrypted, passKey, {
    algorithm: cipher,
    encoding: encoding
  })

  function testNotEqual (a, b) {
    for (var i in a) {
      if (typeof a[i] !== 'object') assert(a[i] !== b[i])
      else testNotEqual(a[i], b[i])
    }
  }

  function testEqual (a, b) {
    for (var i in a) {
      if (typeof a[i] !== 'object') assert(a[i] === b[i])
      else testEqual(a[i], b[i])
    }
  }

  testNotEqual(object, encrypted)
  testEqual(decrypted, object)

  console.log('....ok....\n')

  setImmediate(function () {
    eachCipher(i++)
  })
}())
