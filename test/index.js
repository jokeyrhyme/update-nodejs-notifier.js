'use strict'

const test = require('ava')

const lib = require('../index.js')

test('exports an object', (t) => {
  t.is(typeof lib, 'object')
})

test('exports an "updateNodejsNotifier" function', (t) => {
  t.is(typeof lib.updateNodejsNotifier, 'function')
})

test('updateNodejsNotifier({ versions }), no matching alert', (t) => {
  const versions = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.is(lib.updateNodejsNotifier({ versions }), false)
})

test('updateNodejsNotifier({ versions }), matching alert', (t) => {
  const versions = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.is(lib.updateNodejsNotifier({
    current: 'v1.2.3',
    stableMajor: true,
    versions
  }), true)
})
