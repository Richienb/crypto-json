'use strict';

var EncryptObject = require('./'),
    enc           = new EncryptObject('aes256', 'base64'),
    passKey       = '487qrojdhbiuqrehdgcpe9ifyhjw4qrpuiewghqp9rerdfsgarhts',
    assert        = require('assert'),
    crypto        = require('crypto');

function encryptString(string, key) {
  var cipher = crypto.createCipher('aes256', key);
  return cipher.update(String(string), 'utf8', 'base64') +
    cipher.final('base64');
}

var testObject = {
  'name': 'Joe Bloggs',
  'job': 'Developer',
  'age': 28,
  'langs': [
    'js', 'c++', 'perl'
  ],
  'hello': {
    'world': '!',
    'this': 'should be unencrypted',
    'so': 'should this'
  }
};

enc.config(['name', 'job', 'age', 'langs'], passKey);

// encryption test

enc.encrypt(testObject, function (result) {
  enc.config(['world'], passKey);
  testObject = result;
  enc.encrypt(testObject.hello, function (result) {
    testObject.hello = result;
    assert.deepEqual(testObject.name, encryptString('Joe Bloggs', passKey));
    assert.deepEqual(testObject.job, encryptString('Developer', passKey));
    assert.deepEqual(testObject.age, encryptString(28, passKey));
    assert.deepEqual(testObject.langs[0], encryptString('js', passKey));
    assert.deepEqual(testObject.langs[1], encryptString('c++', passKey));
    assert.deepEqual(testObject.langs[2], encryptString('perl', passKey));
    assert.deepEqual(testObject.hello.world, encryptString('!', passKey));
    assert.deepEqual(testObject.hello.so, 'should this');
    assert.deepEqual(testObject.hello.this, 'should be unencrypted');

    // decryption test

    enc.config(['name', 'job', 'age', 'langs'], passKey);

    enc.decrypt(testObject, function (result) {
      enc.config(['world'], passKey);
      testObject = result;
      enc.decrypt(testObject.hello, function (result) {
        testObject.hello = result;
        assert.deepEqual(testObject.name, 'Joe Bloggs');
        assert.deepEqual(testObject.job, 'Developer');
        assert.deepEqual(testObject.age, 28);
        assert.deepEqual(testObject.langs[0], 'js');
        assert.deepEqual(testObject.langs[1], 'c++');
        assert.deepEqual(testObject.langs[2], 'perl');
        assert.deepEqual(testObject.hello.world, '!');
        assert.deepEqual(testObject.hello.so, 'should this');
        assert.deepEqual(testObject.hello.this, 'should be unencrypted');
      });
    });

  });
});
