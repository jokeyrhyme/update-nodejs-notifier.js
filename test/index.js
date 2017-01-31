'use strict'

const test = require('ava')

const lib = require('../index.js')

test('exports an object', (t) => {
  t.is(typeof lib, 'object')
})

test('exports an "updateNodejsNotifier" function', (t) => {
  t.is(typeof lib.updateNodejsNotifier, 'function')
})

// assumes current Node.js version is >=4
test('updateNodejsNotifier(), no matching alert', (t) => {
  const versions = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  const notify = () => { notify.called = true }
  t.is(lib.updateNodejsNotifier({ notify, versions }), false)
  t.falsy(notify.called)
})

test('updateNodejsNotifier(), matching alert', (t) => {
  const versions = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  const notify = (options) => {
    const message = options.message || ''
    t.truthy(message)
    notify.called = true
  }
  t.is(lib.updateNodejsNotifier({
    current: 'v1.2.3',
    notify,
    stableMajor: true,
    versions
  }), true)
  t.truthy(notify.called)
})

test('updateNodejsNotifier(), old unstable major version', (t) => {
  const TODAY = (new Date()).toISOString()
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000
  const OLD_DAY = (new Date(Date.now() - THREE_DAYS)).toISOString()
  const versions = [
    { version: 'v7.1.0', date: TODAY, files: [], modules: '', lts: false },
    { version: 'v6.9.0', date: TODAY, files: [], modules: '', lts: false },
    { version: 'v7.0.0', date: OLD_DAY, files: [], modules: '', lts: false }
  ]
  const notify = (options) => {
    const message = options.message || ''
    t.is(message, `Node.js update available v7.0.0 → v7.1.0
v7.0.0 is more than 1 days old`)
    notify.called = true
  }
  t.is(lib.updateNodejsNotifier({
    current: 'v7.0.0',
    daysOld: 1,
    notify,
    versions
  }), true)
  t.truthy(notify.called)
})
