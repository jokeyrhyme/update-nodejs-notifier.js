'use strict'

const test = require('ava')

const lib = require('../lib/alerts.js')

test('checkEngines test()', (t) => {
  t.is(lib.ALERTS['checkEngines'].test({}, [], 'v1.2.3'), false)
  t.is(
    lib.ALERTS['checkEngines'].test({
      engines: { node: '>=1' }
    }, [], 'v1.2.3'),
    false
  )
  t.is(
    lib.ALERTS['checkEngines'].test({
      engines: { node: '>=2' }
    }, [], 'v1.2.3'),
    true
  )
})

test('daysOld test()', (t) => {
  const TWO_DAYS = 2 * 24 * 60 * 60 * 1000
  const dayBeforeYesterday = (new Date(new Date() - TWO_DAYS)).toISOString()
  const list = [
    { version: 'v2.3.4', date: dayBeforeYesterday, files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '1970-01-01', files: [], modules: '', lts: false }
  ]
  t.is(
    lib.ALERTS['daysOld'].test({}, list, 'v1.2.3'),
    false,
    'default is Infinity, so an ancient date should raise no alert'
  )
  t.is(
    lib.ALERTS['daysOld'].test({ daysOld: 30 }, list, 'v1.2.3'),
    true,
    'ancient date is older than 30 days, alert!'
  )
  t.is(
    lib.ALERTS['daysOld'].test({ daysOld: 1 }, list, 'v2.3.4'),
    true,
    'day before yesterday is older than 1 day, alert!'
  )
})

test('stableMajor test()', (t) => {
  const list = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.is(lib.ALERTS['stableMajor'].test({}, list, 'v1.2.3'), true)
  t.is(lib.ALERTS['stableMajor'].test({}, list, 'v2.2.0'), false)
})

test('stableMinor test()', (t) => {
  const list = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.is(lib.ALERTS['stableMinor'].test({}, list, 'v2.2.0'), true)
  t.is(lib.ALERTS['stableMinor'].test({}, list, 'v2.3.1'), false)
})

test('stablePatch test()', (t) => {
  const list = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.is(lib.ALERTS['stablePatch'].test({}, list, 'v2.3.1'), true)
  t.is(lib.ALERTS['stablePatch'].test({}, list, 'v2.3.4'), false)
})
