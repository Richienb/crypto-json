const util = require('util')
const cryptoJSON = require('../')

const algorithm = 'aes-256-cbc'
const encoding = 'hex'

const input = {
  hello: {
    bar: ['hello', 'world'],
    baz: {
      secret: 'hide a secret',
      b: { test: 1 }
    }
  }
}

const password = 'random password 32 bytes length.'

// keys act like a white list, so for example if you want to encrypt a nested
// key "secret" you also need to specify its parent keys,
// i.e. "secret", "baz", "hello" in the above input object

const keys = ['hello', 'baz', 'secret']

const output = cryptoJSON.encrypt(
  input, password, { encoding, keys, algorithm }
)
console.log(util.inspect(input, { showHidden: false, depth: null, colors: true }))
console.log(util.inspect(output, { showHidden: false, depth: null, colors: true }))
