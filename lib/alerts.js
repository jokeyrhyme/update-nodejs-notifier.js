/* @flow */
'use strict'

const SemVer = require('semver')

const versions = require('./versions.js')

/* ::
import type { UpdateNodejsNotifierOptions } from '../index.js'
import type { NodejsVersion } from './versions.js'
export type Alert = {
  isEnabled: (options: UpdateNodejsNotifierOptions) => boolean;
  message: (
    options: UpdateNodejsNotifierOptions,
    currentVersion: string
  ) => string;
  test: (
    options: UpdateNodejsNotifierOptions,
    list: NodejsVersion[],
    currentVersion: string
  ) => boolean
}
*/

const NOT_SUPPORTED = 'notSupported'
const DAYS_OLD = 'daysOld'
const STABLE_MAJOR = 'stableMajor'
const STABLE_MINOR = 'stableMinor'
const STABLE_PATCH = 'stablePatch'

// "test" functions return true if the alert condition is met
// "test" function return false if there is nothing to worry about
const ALERTS = {}

ALERTS[NOT_SUPPORTED] = {
  isEnabled: (
    options /* : UpdateNodejsNotifierOptions */
  ) /* : boolean */ => {
    return !!options[NOT_SUPPORTED]
  },

  message: (
    options /* : UpdateNodejsNotifierOptions */,
    currentVersion /* : string */
  ) /* : string */ => {
    const chalk = require('chalk') // slow, so only do when needed
    return chalk.red(`${currentVersion} is no longer receiving security updates!`)
  },

  test: (
    options /* : UpdateNodejsNotifierOptions */,
    list /* : NodejsVersion[] */,
    currentVersion /* : string */
  ) /* : boolean */ => {
    const datesFromVersion = require('nodejs-support-dates').datesFromVersion

    const end = datesFromVersion(currentVersion).end
    if (end < Date.now()) {
      return true
    }

    return false
  }
}

ALERTS[DAYS_OLD] = {
  isEnabled: (
    options /* : UpdateNodejsNotifierOptions */
  ) /* : boolean */ => {
    return typeof options[DAYS_OLD] === 'number'
  },

  message: (
    options /* : UpdateNodejsNotifierOptions */,
    currentVersion /* : string */
  ) /* : string */ => {
    const chalk = require('chalk') // slow, so only do when needed
    const daysOld = '' + (options[DAYS_OLD] || Infinity)
    return chalk.yellow(`${currentVersion} is more than ${daysOld} days old`)
  },

  test: (
    options /* : UpdateNodejsNotifierOptions */,
    list /* : NodejsVersion[] */,
    currentVersion /* : string */
  ) /* : boolean */ => {
    const details = versions.find(list, currentVersion)
    const releaseDate = new Date(details.date)
    const msOld = (options.daysOld || Infinity) * 24 * 60 * 60 * 1000
    return (new Date()) - releaseDate > msOld
  }
}

ALERTS[STABLE_MAJOR] = {
  isEnabled: (
    options /* : UpdateNodejsNotifierOptions */
  ) /* : boolean */ => {
    return !!options[STABLE_MAJOR]
  },

  message: (
    options /* : UpdateNodejsNotifierOptions */,
    currentVersion /* : string */
  ) /* : string */ => {
    return `${currentVersion} is older than the latest stable version`
  },

  test: (
    options /* : UpdateNodejsNotifierOptions */,
    list /* : NodejsVersion[] */,
    currentVersion /* : string */
  ) /* : boolean */ => {
    const latestStable = versions.latestStableVersion(list)
    const latestStableMajor = SemVer.major(latestStable)
    return latestStableMajor > SemVer.major(currentVersion)
  }
}

ALERTS[STABLE_MINOR] = {
  isEnabled: (
    options /* : UpdateNodejsNotifierOptions */
  ) /* : boolean */ => {
    return !!options[STABLE_MINOR]
  },

  message: (
    options /* : UpdateNodejsNotifierOptions */,
    currentVersion /* : string */
  ) /* : string */ => {
    return `${currentVersion} is older than the latest stable version`
  },

  test: (
    options /* : UpdateNodejsNotifierOptions */,
    list /* : NodejsVersion[] */,
    currentVersion /* : string */
  ) /* : boolean */ => {
    const majorTest = ALERTS[STABLE_MAJOR].test
    if (majorTest(options, list, currentVersion)) {
      return true
    }
    const latestStable = versions.latestStableVersion(list)
    const latestStableMinor = SemVer.minor(latestStable)
    return latestStableMinor > SemVer.minor(currentVersion)
  }
}

ALERTS[STABLE_PATCH] = {
  isEnabled: (
    options /* : UpdateNodejsNotifierOptions */
  ) /* : boolean */ => {
    return !!options[STABLE_PATCH]
  },

  message: (
    options /* : UpdateNodejsNotifierOptions */,
    currentVersion /* : string */
  ) /* : string */ => {
    return `${currentVersion} is older than the latest stable version`
  },

  test: (
    options /* : UpdateNodejsNotifierOptions */,
    list /* : NodejsVersion[] */,
    currentVersion /* : string */
  ) /* : boolean */ => {
    const minorTest = ALERTS[STABLE_MINOR].test
    if (minorTest(options, list, currentVersion)) {
      return true
    }
    const latestStable = versions.latestStableVersion(list)
    const latestStablePatch = SemVer.patch(latestStable)
    return latestStablePatch > SemVer.patch(currentVersion)
  }
}

const SEVERITY_ORDER = [
  NOT_SUPPORTED,
  DAYS_OLD,
  STABLE_MAJOR,
  STABLE_MINOR,
  STABLE_PATCH
]

function matchAlerts (
  options /* : UpdateNodejsNotifierOptions */,
  list /* : NodejsVersion[] */,
  currentVersion /* : string */
) /* : ?Alert */ {
  // using .some() for early exit, unlike .forEach()
  let alert
  SEVERITY_ORDER.some((name) => {
    const candidate = ALERTS[name]
    if (candidate && candidate.isEnabled(options)) {
      try {
        if (candidate.test(options, list, currentVersion)) {
          alert = candidate
          return true
        }
      } catch (err) { /* ignore the error for now */ }
    }
  })
  return alert || null
}

module.exports = {
  NOT_SUPPORTED,
  DAYS_OLD,
  STABLE_MAJOR,
  STABLE_MINOR,
  STABLE_PATCH,

  ALERTS,
  SEVERITY_ORDER,

  matchAlerts
}
