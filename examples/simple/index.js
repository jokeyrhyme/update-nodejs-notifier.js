'use strict'

// replace this require with require('update-nodejs-notifier')
const updateNodejsNotifier = require('../../index.js')

updateNodejsNotifier({
  engines: require('./package.json').engines
}).notify()
