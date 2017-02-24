/* @flow */
'use strict'

const test = require('ava')

const lib = require('../lib/bake.js')

test('exports an object', (t) => {
  t.is(typeof lib, 'object')
})

test('exports a "bake" function', (t) => {
  t.is(typeof lib.bake, 'function')
})

test('bake() returns a promised cake, with "versions" array', (t) => {
  return lib.bake({ cake: {} })
    .then((cake) => {
      t.truthy(cake && typeof cake === 'object')
      t.true(Array.isArray(cake.versions))
      t.true(cake.versions.length > 1)
      t.is(typeof cake.versions[0].version, 'string')
    })
})
