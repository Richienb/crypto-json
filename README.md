[__Looking for a new maintainer__](https://github.com/roryrjb/crypto-json/issues/8)

# crypto-json [![Build Status](https://travis-ci.org/roryrjb/crypto-json.svg?branch=master)](https://travis-ci.org/roryrjb/crypto-json) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> Recursively encrypt/decrypt objects selectively by keys.

### Installation

```
$ npm install crypto-json --save
```

### Usage

```javascript
const cryptoJSON = require('crypto-json')
```

__cryptoJSON.encrypt(object, password, [config]) => encryptedObject__

__cryptoJSON.decrypt(encryptedObject, password, [config]) => object__

__config (optional)__

* `algorithm` - select any supported by the version of Node you are using _(default: `aes-256-cbc`)_
* `encoding` - `hex`, `base64`, `binary` _(default: `hex`)_
* `keys` - specify which keys to encrypting/decrypting _(default: `[]`, i.e. encrypt/decrypt nothing)_

### Example

```javascript
const util = require('util')
const cryptoJSON = require('crypto-json')
const algorithm = 'aes-256-cbc'
const encoding = 'hex'

const input = {
  hello: {
    bar: ['hello', 'world'],
    baz: {
      secret: 'hide a secret',
      b: {test: 1}
      }
    }
  }

const password = 'random password 32 bytes length.'

// keys act like a white list, so for example if you want to encrypt a nested
// key "secret" you also need to specify its parent keys,
// i.e. "secret", "baz", "hello" in the above input object

const keys = ['hello', 'baz', 'secret']

const output = cryptoJSON.encrypt(
  input, password, {encoding, keys, algorithm}
)
console.log(util.inspect(input ,{showHidden: false, depth: null, colors: true}))
console.log(util.inspect(output ,{showHidden: false, depth: null, colors: true}))

/*

{
  hello: {
    bar: [ 'hello', 'world' ],
    baz: {
      secret: 'b2114cc78fcee8c58a14ba2df511dd05:e5a58d9b9eaab60ca0830d1c7ad4fd41',
      b: { test: 1 }
    }
  }
}
*/

```
