/* @flow */
'use strict'

const lazyRequire = require('lazy-req')(require)

const chalk = lazyRequire('chalk')

const Notifier = require('update-notifier').Notifier
const UpdateChecker = require('update-notifier').UpdateChecker

/* ::
type UpdateNodejsNotifierOptions = {|
  notSupported: boolean | void;
  checkEngines: boolean | void;
  daysOld: number | void;
  stableMajor: boolean | void;
  stableMinor: boolean | void;
  stablePatch: boolean | void;
|};
*/

const defaults = {
  notSupported: true,
  checkEngines: true,
  daysOld: Infinity,
  stableMajor: true,
  stableMinor: false,
  stablePatch: false
}

function UpdateNodejsNotifier (
  options /* : ?UpdateNodejsNotifierOptions */
) {
  this.options = Object.assign(defaults, options)

  this.updateChecker = new UpdateChecker({
    currentVersion: process.version,
    getLatest: function () {
      // TODO: make request to https://nodejs.org/dist/index.json
      // TODO: parse results
      // TODO: compare results against alert settings and current
      return Promise.resolve('1.2.3')
    },
    updaterName: 'node.js'
  })
}

UpdateNodejsNotifier.prototype.check = function () {
  return this.updateChecker.check()
}

UpdateNodejsNotifier.prototype.notify = function (opts) {
  const notifier = new Notifier()

  opts = opts || {}

  opts.update = (this.updateChecker && this.updateChecker.update) || {}

  opts.message = opts.message || 'Update available ' + chalk().dim(opts.update.current) + chalk().reset(' → ') +
    chalk().green(opts.update.latest) // +
    // TODO: add alert text for better impact
    // TODO: figure out better update instructions
    // ' \nRun ' + chalk().cyan('custom update command') + ' to update'

  return notifier.notify(opts)
}

module.exports = function (
  options /* : ?UpdateNodejsNotifierOptions */
) {
  const updateNotifier = new UpdateNodejsNotifier(options)
  updateNotifier.check()
  return updateNotifier
}

module.exports.UpdateNodejsNotifier = UpdateNodejsNotifier
