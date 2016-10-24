'use strict'

const test = require('ava')

const lib = require('../lib/bake.js')

test('exports an object', (t) => {
  t.is(typeof lib, 'object')
})

test('exports a "bake" function', (t) => {
  t.is(typeof lib.bake, 'function')
})

test('bake() returns a promise, stores "versions" array', (t) => {
  let versions
  const mockConf = {
    set: (key, value) => {
      t.is(key, 'versions')
      versions = value
    }
  }
  const mockOptions = { conf: mockConf }
  const result = lib.bake(mockOptions)
  t.is(typeof result.then, 'function')
  return result.then(() => {
    t.true(Array.isArray(versions))
    t.true(versions.length > 1)
    t.is(typeof versions[0].version, 'string')
  })
})
