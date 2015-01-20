'use strict';

var crypto    = require('crypto'),
    ofmt      = 'base64',
    algorithm = 'aes256';

function EncryptObject(algorithm, outputEncoding) {

  var _this = this;

  this.algorithm      = algorithm;
  this.outputEncoding = outputEncoding;

  this.config = function (keysToEncrypt, key) {
    _this.keys = keysToEncrypt;
    _this.key  = key;
  };

  this.encrypt = function (object, callback) {

    var newObject = {},
        cipher    = crypto.createCipher(_this.algorithm, _this.key);

    function encryptString(string, key, algorithm, enc) {
      var cipher = crypto.createCipher(algorithm, key);
      return cipher.update(string, 'utf8', enc) + cipher.final(enc);
    }

    function encryptArray(array, key, algorithm, enc) {
      return array.map(function (element) {
        if (typeof element === 'string' || typeof element === 'number') {
          return encryptString(String(element), key, algorithm, enc);
        } else if (Array.isArray(element)) {
          return encryptArray(element, key, algorithm, enc);
        } else if (typeof element === 'object' && !Array.isArray(element)) {
          // skip object for now
          return element;
        } else {
          console.warn('Element type "' + typeof element + '" is not ' +
            'supported.');
          return element;
        }
      });
    }

    (function encryptObject() {
      for (var node in object) {
        if (_this.keys.indexOf(node) !== -1) {
          if (typeof object[node] === 'string' || typeof object[node] === 'number') {
            newObject[node] = encryptString(String(object[node]), _this.key,
              _this.algorithm, _this.outputEncoding);
          } else if (Array.isArray(object[node])) {
            newObject[node] = encryptArray(object[node], _this.key, _this.algorithm,
              _this.outputEncoding);
          } else {
            newObject[node] = object[node];
          }
        } else {
          newObject[node] = object[node];
        }
      }
      return callback(newObject);
    }());

  };

}

module.exports = EncryptObject;
