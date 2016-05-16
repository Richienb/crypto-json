# crypto-json [![Build Status](https://travis-ci.org/roryrjb/crypto-json.svg?branch=master)](https://travis-ci.org/roryrjb/crypto-json) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> Recursively encrypt/decrypt objects selectively by keys.

### Installation

```
$ npm install crypto-json --save
```

__Tests__

```
$ npm test
```

### Usage

```javascript
var cryptoJSON = require('crypto-json')
```

__cryptoJSON.encrypt(object, password, [config]) => encryptedObject__

__cryptoJSON.decrypt(encryptedObject, password, [config]) => object__

__config (optional)__

* `algorithm` - select any supported by the version of Node you are using _(default: `aes256`)_
* `encoding` - `hex`, `base64`, `binary` _(default: `hex`)_
* `keys` - specify which keys to ignore when encrypting/decrypting _(default: `[]`, i.e. encrypt/decrypt everything)_

### Example

```javascript
var cryptoJSON = require('crypto-json')
var cipher = 'camellia-128-cbc'
var passKey = '394rwe78fudhwqpwriufdhr8ehyqr9pe8fud'
var encoding = 'hex'

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

var encrypted = cryptoJSON.encrypt(object, passKey, {
  algorithm: cipher,
  encoding: encoding,
  keys: ['first_name', 'birth_year', 'albums']
})

console.dir(encrypted) // =>

/*
  { first_name: 'ac64e6168ebbb8c575a567fa4bdd467c',
    last_name: 'Davis',
    instrument: 'Trumpet',
    birth_year: '735f22844209a3dea04f2c070ead7c5b',
    albums:
     [ { title: 'Birth of the Cool', year: 1957 },
       { title: 'Bitches Brew', year: 1970 } ] }
*/
```

### License

MIT

