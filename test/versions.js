/* @flow */
'use strict'

const test = require('ava')

const lib = require('../lib/versions.js')

test('latestVersion()', (t) => {
  const list = [
    { version: 'v1.2.3', date: '', files: [], modules: '', lts: false }
  ]
  t.is(lib.latestVersion(list), 'v1.2.3')
})
