'use strict'

const test = require('ava')

const lib = require('../index.js')

test('notifier.notify()', (t) => {
  const notifier = new lib.UpdateNodejsNotifier()
  t.notThrows(() => notifier.notify())
})
