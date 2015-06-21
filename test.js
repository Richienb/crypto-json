'use strict'

var cryptObject = require('./')
var passKey = '487qrojdhbiuqrehdgcpe9ifyhjw4qrpuiewghqp9rerdfsgarhts'
var assert = require('assert')

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

var encrypted = cryptObject.encrypt(object, passKey, {
  algorithm: 'aes192',
  encoding: 'hex',
  keys: ['instrument', 'birth_year', 'albums']
})

var decrypted = cryptObject.decrypt(encrypted, passKey, {
  algorithm: 'aes192',
  encoding: 'hex',
  keys: ['instrument', 'albums']
})

assert(encrypted.first_name === object.first_name)
assert(encrypted.last_name === object.last_name)
assert(encrypted.instrument !== object.instrument)
assert(encrypted.birth_year !== object.birth_year)
assert(decrypted.first_name === encrypted.first_name)
assert(decrypted.last_name === encrypted.last_name)
assert(decrypted.instrument === object.instrument)
assert(decrypted.birth_year === encrypted.birth_year)
