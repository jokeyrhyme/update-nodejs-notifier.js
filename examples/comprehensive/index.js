'use strict'

// replace this require with require('update-nodejs-notifier')
const updateNodejsNotifier = require('../../index.js')

const notifier = updateNodejsNotifier({
  engines: require('./package.json').engines,
  notSupported: true,
  checkEngines: true,
  daysOld: 30,
  stableMajor: true,
  stableMinor: false,
  stablePatch: false
})

notifier.notify()
