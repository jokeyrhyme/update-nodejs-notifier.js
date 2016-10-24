'use strict'

// replace this require with require('update-nodejs-notifier')
const { updateNodejsNotifier } = require('../../index.js')
updateNodejsNotifier({
  notSupported: true,
  daysOld: 30,
  stableMajor: true,
  stableMinor: false,
  stablePatch: false
})
