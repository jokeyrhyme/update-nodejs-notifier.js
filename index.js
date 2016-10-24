/* @flow */
'use strict'

const path = require('path')

const getCake = require('hsipe').getCake
const putInOven = require('hsipe').putInOven

const NODEJS_URL = require('./lib/bake.js').NODEJS_URL

const cakeName = NODEJS_URL.replace(/\W+/g, '-')

const alerts = require('./lib/alerts.js')
const versions = require('./lib/versions.js')

/* ::
import type { NodejsVersion } from './lib/versions.js'
export type UpdateNodejsNotifierOptions = {
  notSupported?: boolean,
  daysOld?: number,
  stableMajor?: boolean,
  stableMinor?: boolean,
  stablePatch?: boolean,

  current?: string,
  versions?: NodejsVersion[]
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
) /* : boolean */ {
  putInOven({
    bakePath: path.join(__dirname, 'lib', 'bake.js'),
    cakeName
  })

  options = Object.assign({}, defaults, options)

  // try to continue on, in case we already started baking last time
  const cake = getCake({ cakeName })
  const nodejsVersions = options.versions || cake.versions
  const current = options.current || process.version

  if (nodejsVersions) {
    const alert = alerts.matchAlerts(options, nodejsVersions, current)

    if (!alert) {
      return false
    }

    const chalk = require('chalk') // slow, so do this _after_ check

    const latest = versions.latestStableVersion(nodejsVersions)
    const message = 'Update available ' + chalk.dim(current) + chalk.reset(' → ') +
      chalk.green(latest) + chalk.reset('\n') +
      alert.message(options, current)

    // TODO: figure out better update instructions
    // ' \nRun ' + chalk.cyan('custom update command') + ' to update'

    require('boxen-notify').notify({ message })
    return true
  }

  return false
}

module.exports = {
  updateNodejsNotifier
}
