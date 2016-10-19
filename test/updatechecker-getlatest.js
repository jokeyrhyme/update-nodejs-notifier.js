'use strict'

const test = require('ava')

const lib = require('../index.js')

test('notifier.updateChecker.getLatest()', (t) => {
  const notifier = new lib.UpdateNodejsNotifier()
  return notifier.updateChecker.getLatest()
})
