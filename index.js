/* @flow */
'use strict'

const lazyRequire = require('lazy-req')(require)
const UpdateChecker = require('update-notifier').UpdateChecker

const chalk = lazyRequire('chalk')

const alerts = require('./lib/alerts.js')
const versions = require('./lib/versions.js')

/* ::
export type UpdateNodejsNotifierOptions = {
  notSupported?: boolean,
  daysOld?: number,
  stableMajor?: boolean,
  stableMinor?: boolean,
  stablePatch?: boolean
}
*/

const defaults = {
  notSupported: true,
  daysOld: Infinity,
  stableMajor: true,
  stableMinor: false,
  stablePatch: false
}

function UpdateNodejsNotifier (
  options /* : ?UpdateNodejsNotifierOptions */
) {
  this.options = Object.assign(defaults, options)

  console.log('UpdateNodejsNotifier')
  this.updateChecker = new UpdateChecker({
    currentVersion: process.version,
    getLatest: function () {
      console.log('getLatest')
      return versions.fetchList()
        .then((list) => {
          console.log('getLatest', list.length)
          this.config.set('list', list)
          return versions.latestVersion(list)
        })
    }.bind(this),
    updateCheckInterval: 0,
    updaterName: 'node.js'
  })
}

UpdateNodejsNotifier.prototype.check = function () {
  return this.updateChecker.check()
}

UpdateNodejsNotifier.prototype.notify = function (opts) {
  const list = this.config ? this.config.get('list') || [] : []
  const alert = alerts.matchAlerts(this.options, list, process.version)

  if (!alert) {
    return this
  }

  opts = opts || {}

  opts.update = (this.updateChecker && this.updateChecker.update) || {}

  opts.message = opts.message || 'Update available ' + chalk().dim(opts.update.current) + chalk().reset(' → ') +
    chalk().green(opts.update.latest) + chalk().reset('\n') +
    alert.message(this.options, process.version)

    // TODO: figure out better update instructions
    // ' \nRun ' + chalk().cyan('custom update command') + ' to update'

  require('update-notifier').notify(opts)

  return this
}

module.exports = function (
  options /* : ?UpdateNodejsNotifierOptions */
) {
  const updateNotifier = new UpdateNodejsNotifier(options)
  updateNotifier.check()
  return updateNotifier
}

module.exports.UpdateNodejsNotifier = UpdateNodejsNotifier
