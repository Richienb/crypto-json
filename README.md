# crypto-json [![Build Status](https://travis-ci.org/roryrjb/crypto-json.svg?branch=master)](https://travis-ci.org/roryrjb/crypto-json) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> Selectively encrypt/decrypt an object.

### Installation

```
$ npm install crypto-json
```

__Tests__

```
$ npm test
```

### Usage

__cryptObject.encrypt(object, password, config)__

The `config` object has the following options: `algorithm` (string), `encoding` (string: `hex`, `base64`, `binary`), keys (array: choose which keys to encrypt/decrypt).

_For performance, simplicity and my use cases, `keys` only refer to the first level of the object and decryption/encryption will only work on first level values, see the example code block below._

__cryptObject.decrypt(object, password, config)__

Has the same options as `config` for the __`.encrypt()`__ method.

```javascript
var cryptoJSON = require('crypto-json')

var object = {
  first_name: 'Miles',
  last_name: 'Davis',
  instrument: 'Trumpet',
  birth_year: 1926,
  albums: [
    { title: 'Birth of the Cool', year: 1957 },
    { title: 'Bitches Brew', year: 1970 }
  ]
}

var encrypted = cryptObject.encrypt(object, passKey, {
  algorithm: 'aes192',
  encoding: 'hex',
  keys: ['instrument', 'birth_year', 'albums']
}) // =>

/*

  {
    first_name: 'Miles',
    last_name: 'Davis',
    instrument: 'ff331de5464bb8d754ff745da85612a7',
    birth_year: 'f2d66befbd496db7a5ad80eee8fe1f28',
    albums: '56dc972e7c47d2d83ab80a69a72751262e7c956c7a4ec28eb558c7ac6072806a28daaf6ec57b9dfbcab1d1ff53987e181abce50ce953260e9ec1e3045911a3fff183ff2902cbada0802436897074ddf268032a29b0d8b5fbf6c0653d539490e0'
  }

*/

cryptObject.decrypt(encrypted, passKey, {
  algorithm: 'aes192',
  encoding: 'hex',
  keys: ['instrument', 'albums']
}) // =>

/*

  {
    first_name: 'Miles',
    last_name: 'Davis',
    instrument: 'Trumpet',
    birth_year: 'f2d66befbd496db7a5ad80eee8fe1f28',
    albums: [
      { title: 'Birth of the Cool', year: 1957 },
      { title: 'Bitches Brew', year: 1970 }
    ]
  }

*/
```

### License

MIT
