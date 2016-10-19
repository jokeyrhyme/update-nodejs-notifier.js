/* @flow */
'use strict'

const SemVer = require('semver')

const versions = require('./versions.js')

/* ::
import type { UpdateNodejsNotifierOptions } from '../index.js'
import type { NodejsVersion } from './versions.js'
export type Alert = {
  isEnabled: (options: UpdateNodejsNotifierOptions) => boolean;
  test: (
    options: UpdateNodejsNotifierOptions,
    list: NodejsVersion[],
    currentVersion: string
  ) => boolean
}
*/

const NOT_SUPPORTED = 'notSupported'
const CHECK_ENGINES = 'checkEngines'
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

  test: (
    options /* : UpdateNodejsNotifierOptions */,
    list /* : NodejsVersion[] */,
    currentVersion /* : string */
  ) /* : boolean */ => {
    return false
  }
}

ALERTS[CHECK_ENGINES] = {
  isEnabled: (
    options /* : UpdateNodejsNotifierOptions */
  ) /* : boolean */ => {
    return !!(options[CHECK_ENGINES] && options.engines)
  },

  test: (
    options /* : UpdateNodejsNotifierOptions */,
    list /* : NodejsVersion[] */,
    currentVersion /* : string */
  ) /* : boolean */ => {
    const nodeRange = (options.engines || {}).node || '*'
    return !SemVer.satisfies(currentVersion, nodeRange)
  }
}

ALERTS[DAYS_OLD] = {
  isEnabled: (
    options /* : UpdateNodejsNotifierOptions */
  ) /* : boolean */ => {
    return typeof options[DAYS_OLD] === 'number'
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
  CHECK_ENGINES,
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
      if (candidate.test(options, list, currentVersion)) {
        alert = candidate
        return true
      }
    }
  })
  return alert || null
}

module.exports = {
  NOT_SUPPORTED,
  CHECK_ENGINES,
  DAYS_OLD,
  STABLE_MAJOR,
  STABLE_MINOR,
  STABLE_PATCH,

  ALERTS,
  SEVERITY_ORDER,

  matchAlerts
}
