'use strict'

const test = require('ava')

const lib = require('../index.js')

test('exports an object', (t) => {
  t.is(typeof lib, 'object')
})

test('exports an "updateNodejsNotifier" function', (t) => {
  t.is(typeof lib.updateNodejsNotifier, 'function')
})
