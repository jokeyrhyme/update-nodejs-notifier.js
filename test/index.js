'use strict'

const test = require('ava')

const lib = require('../index.js')

test('exports a function', (t) => {
  t.is(typeof lib, 'function')
})

test('exported function()', (t) => {
  t.notThrows(() => lib())
})

test('exports UpdateNodejsNotifier constructor', (t) => {
  t.is(typeof lib.UpdateNodejsNotifier, 'function')
})

test('new UpdateNodejsNotifier has updateChecker property', (t) => {
  const notifier = new lib.UpdateNodejsNotifier()
  t.is(typeof notifier.updateChecker, 'object')
})

test('notifier.check()', (t) => {
  const notifier = new lib.UpdateNodejsNotifier()
  t.notThrows(() => notifier.check())
})
