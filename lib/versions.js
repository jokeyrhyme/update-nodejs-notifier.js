/* @flow */
'use strict'

const fetch = require('node-fetch')
const memoize = require('lodash.memoize')
const SemVer = require('semver')

const URL = 'https://nodejs.org/dist/index.json'

/* ::
export type NodejsVersion = {
  version: string;
  date: string;
  files: string[];
  modules: string;
  lts: boolean | string;
};
*/

function fetchList () /* : Promise<NodejsVersion[]> */ {
  return fetch(URL)
    .then((res) => res.json())
}

function find (
  list /* : NodejsVersion[] */,
  version /* : string */
) /* : NodejsVersion */ {
  for (let v = 0, vLength = list.length; v < vLength; v += 1) {
    const candidate = list[v]
    if (candidate.version === version) {
      return candidate
    }
  }
  throw new Error(`version ${version} not listed`)
}

function latestStableVersion (
  list /* : NodejsVersion[] */
) /* : string */ {
  // assume list is newest-to-oldest
  for (let v = 0, vLength = list.length; v < vLength; v += 1) {
    const version = list[v].version
    if (SemVer.major(version) % 2 === 0) {
      return version
    }
  }
  throw new Error('no stable versions identified')
}

function latestVersion (
  list /* : NodejsVersion[] */
) /* : string */ {
  // assume list is newest-to-oldest
  return list[0].version
}

module.exports = {
  fetchList: memoize(fetchList),
  find,
  latestStableVersion,
  latestVersion
}
