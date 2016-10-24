'use strict'

const test = require('ava')

const lib = require('../lib/alerts.js')

test('all alerts implement required interface', (t) => {
  t.true(lib.ALERTS && typeof lib.ALERTS === 'object')
  Object.keys(lib.ALERTS).forEach((key) => {
    const alert = lib.ALERTS[key]
    t.true(alert && typeof alert === 'object', `ALERTS[${key}]`)

    t.is(typeof alert.isEnabled, 'function', key, `ALERTS[${key}]`)
    t.is(typeof alert.isEnabled({}), 'boolean', `ALERTS[${key}]`)

    t.is(typeof alert.message, 'function', `ALERTS[${key}]`)
    t.is(typeof alert.message({}, ''), 'string', `ALERTS[${key}]`)

    t.is(typeof alert.test, 'function', `ALERTS[${key}]`)
  })
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

test('matchAlerts() finding no alerts', (t) => {
  t.is(lib.matchAlerts({}, [], 'v1.2.3'), null)
})

test('matchAlerts() returns 1st matching alert', (t) => {
  const list = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  const expected = lib.ALERTS['stableMajor']
  t.is(lib.matchAlerts({
    stableMajor: true,
    stableMinor: true
  }, list, 'v1.2.3'), expected)
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
