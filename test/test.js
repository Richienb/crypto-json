'use strict'

/* global describe, it */

const cryptoJSON = require('../')
const crypto = require('crypto')
const assert = require('assert')

describe('arguments', () => {
  it('config should be optional (no keys)', () => {
    const input = { hello: 'world' }
    const password = crypto.randomBytes(32)
    cryptoJSON.encrypt(input, password)
  })

  it('encrypt everything with no keys', () => {
    const input = {
      hello: 'world',
      foo: {
        bar: ['baz']
      }
    }

    const password = crypto.randomBytes(32)
    const output = cryptoJSON.encrypt(input, password)

    assert.notDeepStrictEqual(input, output)
  })

  it('encoding, cipher should be optional', () => {
    const input = { hello: 'world' }
    const password = crypto.randomBytes(32)
    const keys = ['hello']
    const output = cryptoJSON.encrypt(input, password, { keys })

    assert.notDeepStrictEqual(output, input)
  })
})

describe('flat object', () => {
  it('strings', () => {
    const input = {
      hello: 'world',
      foo: 'bar'
    }

    const password = crypto.randomBytes(32)
    const keys = ['hello']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, { encoding, keys, cipher }
    )

    assert.notStrictEqual(output.hello, input.hello)
    assert.strictEqual(output.foo, input.foo)
  })

  it('numbers', () => {
    const input = {
      hello: 1,
      foo: 2.3
    }

    const password = crypto.randomBytes(32)
    const keys = ['hello']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, { encoding, keys, cipher }
    )

    assert.notStrictEqual(output.hello, input.hello)
    assert.strictEqual(output.foo, input.foo)

    const original = cryptoJSON.decrypt(
      output, password, { encoding, keys, cipher }
    )

    assert.deepStrictEqual(input, original)
  })

  it('mixed', () => {
    const input = {
      hello: 1,
      foo: 'hello',
      bar: '2.5',
      x: true
    }

    const password = crypto.randomBytes(32)
    const keys = Object.keys(input)
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, { encoding, keys, cipher }
    )

    for (const key in input) {
      assert.notStrictEqual(input[key], output[key])
    }

    const original = cryptoJSON.decrypt(
      output, password, { encoding, keys, cipher }
    )

    assert.deepStrictEqual(input, original)
  })
})

describe('nested objects', () => {
  it('should encrypt nested bar value only', () => {
    const input = {
      hello: {
        bar: 'baz',
        foo: 'foz'
      }
    }

    const password = crypto.randomBytes(32)
    const keys = ['hello', 'bar']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, { encoding, keys, cipher }
    )

    assert.notDeepStrictEqual(input, output)
    assert.deepStrictEqual(input.hello.foo, output.hello.foo)

    const original = cryptoJSON.decrypt(
      output, password, { encoding, keys, cipher }
    )

    assert.deepStrictEqual(input, original)
  })

  it('should encrypt nested array strings', () => {
    const input = {
      hello: {
        bar: ['hello', 'world']
      }
    }

    const password = crypto.randomBytes(32)
    const keys = ['hello', 'bar']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, { encoding, keys, cipher }
    )

    assert(Array.isArray(output.hello.bar))
    assert.strictEqual(output.hello.bar.length, input.hello.bar.length)

    for (let i = 0, len = input.hello.bar.length; i < len; i++) {
      assert.notStrictEqual(input.hello.bar[i], output.hello.bar[i])
    }

    const original = cryptoJSON.decrypt(
      output, password, { encoding, keys, cipher }
    )

    assert.deepStrictEqual(input, original)
  })

  it('complex', () => {
    const input = {
      hello: {
        bar: ['hello', 'world'],
        baz: {
          a: {
            b: ['a', { test: 1 }]
          }
        }
      }
    }

    const password = crypto.randomBytes(32)
    const keys = ['hello', 'bar', 'baz', 'a', 'b', 'test']
    const cipher = 'aes256'
    const encoding = 'hex'

    const output = cryptoJSON.encrypt(
      input, password, { encoding, keys, cipher }
    )

    assert.notDeepStrictEqual(output, input)

    const original = cryptoJSON.decrypt(
      output, password, { encoding, keys, cipher }
    )

    assert.deepStrictEqual(input, original)
  })
})
