# encrypt-object

> Selectively encrypt/decrypt an object's values.

### API

* new __encryptObject(algorithm, outputEncoding)__ (string, string): constructor function takes a specific algorithm and output encoding as arguments.

* __encryptObject#config(keysToEncrypt, key)__ (array, string): set which keys in the object are to be encrypted and which pass phrase to use.

* __encryptObject#encrypt(object, callback)__ (object, function): encrypt using previously set configuration and pass result as a single argument to the callback function.

* __encryptObject#decrypt(object, callback)__ (object, function): decrypt using previously set configuration and pass result as a single argument to the callback function.

### Example

```javascript
var EncryptObject = require('./');
secureObject = new EncryptObject('aes256', 'base64');

var testObject = {
  'name': 'Joe Bloggs',
  'job': 'Developer',
  'age': 28,
  'langs': [
    'js', 'c++', 'perl'
  ]
};

secureObject.config(['name', 'job', 'age', 'langs'], 'password');

secureObject.encrypt(testObject, function (result) {
  console.dir(result);
});

/*

result is:

{
  name: 'jm49FUCyt2pDKgraunwhHw==',
  job: 'qrlZ8UacP2xXl7XxF2HlKw==',
  age: '7BX9WIPNzaw/uk1u7BCxyA==',
  langs: [
    'bmfTu2/IdTKNdTcLflP+Aw==',
    'xBjrusz5K/ahk7zpz0K8AQ==',
    'tTeeha66bXJg/mmV3raD3g=='
  ]
}

*/
```

### License

MIT
