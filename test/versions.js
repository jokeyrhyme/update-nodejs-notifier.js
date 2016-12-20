'use strict'

const test = require('ava')

const lib = require('../lib/versions.js')

test('find()', (t) => {
  const list = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.is(lib.find(list, 'v2.3.4'), list[1])
})

test('find() without any matches', (t) => {
  const list = [
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.throws(() => {
    lib.find(list, 'v2.3.4')
  })
})

test('latestStableVersion()', (t) => {
  const list = [
    { version: 'v3.4.5', date: '', files: [], modules: '', lts: false },
    { version: 'v2.3.4', date: '', files: [], modules: '', lts: false },
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.is(lib.latestStableVersion(list), 'v2.3.4')
})

test('latestStableVersion() without any matches', (t) => {
  const list = [
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.throws(() => {
    lib.latestStableVersion(list)
  })
})

test('latestVersion()', (t) => {
  const list = [
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.is(lib.latestVersion(list), 'v1.2.3')
})
