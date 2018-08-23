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

* `algorithm` - select any supported by the version of Node you are using _(default: `aes256`)_
* `encoding` - `hex`, `base64`, `binary` _(default: `hex`)_
* `keys` - specify which keys to ignore when encrypting/decrypting _(default: `[]`, i.e. encrypt/decrypt everything)_

### Example

```javascript
const cryptoJSON = require('crypto-json')
const algorithm = 'camellia-128-cbc'
const encoding = 'hex'

const input = {
  hello: {
    bar: ['hello', 'world'],
    baz: {
      a: {
        b: ['a', {test: 1}]
      }
    }
  }
}

const password = 'some random password'

// keys act like a white list, so for example if you want to encrypt a nested
// key "test" you also need to specify its parent keys,
// i.e. "b", "a", "baz", "hello" in the above input object

const keys = ['hello', 'bar', 'baz', 'a', 'b', 'test']
const algorithm = 'aes256'
const encoding = 'hex'

const output = cryptoJSON.encrypt(
  input, password, {encoding, keys, algorithm}
)

/*

{
    "hello": {
        "bar": ["297b274fcedbe37524bed6994d790eee", "7ab91684f3ab910423d724560205ac56"],
        "baz": {
            "a": {
                "b": ["79ca248dc3c51388ef923acea1397384", {
                    "test": "03f9900f6f7b5bbfb9be3be6d985faa5"
                }]
            }
        }
    }
}

*/

```