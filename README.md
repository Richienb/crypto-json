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

__cryptoJSON.encrypt(object, password, [config])__

__cryptoJSON.decrypt(object, password, [config])__

__config (optional)__

* `algorithm` - select any supported by the version of Node you are using _(default: `aes256`)_
* `encoding` - `hex`, `base64`, `binary` _(default: `hex`)_
* `keys` - specify which keys to encrypt/decrypt _(default: `[]`, i.e. encrypt/decrypt everything)_

### License

MIT
