/* @flow */
'use strict'

const path = require('path')

const Conf = require('conf')
const putInOven = require('hsipe').putInOven

const NODEJS_URL = require('./lib/bake.js').NODEJS_URL

const cakeName = NODEJS_URL.replace(/\W+/g, '-')
const conf = new Conf({ configName: cakeName })

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

function updateNodejsNotifier (
  options /* : ?UpdateNodejsNotifierOptions */
) {
  putInOven({
    bakePath: path.join(__dirname, 'lib', 'bake.js'),
    cakeName
  })

  // try to continue on, in case we already started baking last time
  const nodejsVersions = conf.get('versions')

  if (nodejsVersions) {
    options = Object.assign({}, defaults, options)

    const current = process.version
    const alert = alerts.matchAlerts(options, nodejsVersions, current)

    const chalk = require('chalk') // slow, so do this _after_ check

    const latest = versions.latestStableVersion(nodejsVersions).version

    const message = 'Update available ' + chalk().dim(current) + chalk().reset(' → ') +
      chalk().green(latest) + chalk().reset('\n') +
      alert.message(this.options, current)

    // TODO: figure out better update instructions
    // ' \nRun ' + chalk().cyan('custom update command') + ' to update'

    require('boxen-notify').notify({ message })
  }
}

module.exports = {
  updateNodejsNotifier
}
