'use strict'

/* global describe, it */

const cryptoJSON = require('../')
const randomr = require('randomr')
const assert = require('assert')

describe('arguments', () => {
  it('config should be optional (no keys)', () => {
    const input = {hello: 'world'}
    const password = randomr(64, 'hex')
    cryptoJSON.encrypt(input, password)
  })

  it('encrypt everything with no keys', () => {
    const input = {
      hello: 'world',
      foo: {
        bar: ['baz']
      }
    }

    const password = randomr(64, 'hex')
    const output = cryptoJSON.encrypt(input, password)

    assert.notDeepEqual(input, output)
  })

  it('encoding, cipher should be optional', () => {
    const input = {hello: 'world'}
    const password = randomr(64, 'hex')
    const keys = ['hello']
    const output = cryptoJSON.encrypt(input, password, {keys})

    assert.notDeepEqual(output, input)
  })
})

describe('flat object', () => {
  it('strings', () => {
    const input = {
      hello: 'world',
      foo: 'bar'
    }

    const password = randomr(64, 'hex')
    const keys = ['hello']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, {encoding, keys, cipher}
    )

    assert.notEqual(output.hello, input.hello)
    assert.equal(output.foo, input.foo)
  })

  it('numbers', () => {
    const input = {
      hello: 1,
      foo: 2.3
    }

    const password = randomr(64, 'hex')
    const keys = ['hello']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, {encoding, keys, cipher}
    )

    assert.notEqual(output.hello, input.hello)
    assert.equal(output.foo, input.foo)

    const original = cryptoJSON.decrypt(
      output, password, {encoding, keys, cipher}
    )

    assert.deepEqual(input, original)
  })

  it('mixed', () => {
    const input = {
      hello: 1,
      foo: 'hello',
      bar: '2.5',
      x: true
    }

    const password = randomr(64, 'hex')
    const keys = Object.keys(input)
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, {encoding, keys, cipher}
    )

    for (const key in input) {
      assert.notEqual(input[key], output[key])
    }

    const original = cryptoJSON.decrypt(
      output, password, {encoding, keys, cipher}
    )

    assert.deepEqual(input, original)
  })
})

describe('nested objects', () => {
  it('should encrypt nested bar value only', () => {
    const input = {
      hello: {
        bar: 'baz'
      }
    }

    const password = randomr(64, 'hex')
    const keys = ['hello', 'bar']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, {encoding, keys, cipher}
    )

    assert.deepEqual(['hello'], Object.keys(output))
    assert.deepEqual(['bar'], Object.keys(output.hello))

    const original = cryptoJSON.decrypt(
      output, password, {encoding, keys, cipher}
    )

    assert.deepEqual(input, original)
  })

  it('should encrypt nested array strings', () => {
    const input = {
      hello: {
        bar: ['hello', 'world']
      }
    }

    const password = randomr(64, 'hex')
    const keys = ['hello', 'bar']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, {encoding, keys, cipher}
    )

    assert(Array.isArray(output.hello.bar))
    assert.equal(output.hello.bar.length, input.hello.bar.length)

    for (let i = 0, len = input.hello.bar.length; i < len; i++) {
      assert.notEqual(input.hello.bar[i], output.hello.bar[i])
    }

    const original = cryptoJSON.decrypt(
      output, password, {encoding, keys, cipher}
    )

    assert.deepEqual(input, original)
  })

  it('complex', () => {
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

    const password = randomr(64, 'hex')
    const keys = ['hello', 'bar', 'baz', 'a', 'b', 'test']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, {encoding, keys, cipher}
    )

    assert.notDeepEqual(output, input)

    const original = cryptoJSON.decrypt(
      output, password, {encoding, keys, cipher}
    )

    assert.deepEqual(input, original)
  })
})
