/* @flow */
'use strict'

const fetch = require('node-fetch')
const memoize = require('lodash.memoize')

const URL = 'https://nodejs.org/dist/index.json'

/* ::
type NodejsVersion = {
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

function latestVersion (
  list /* : NodejsVersion[] */
) /* : string */ {
  // assume list is newest-to-oldest
  return list[0].version
}

module.exports = {
  fetchList: memoize(fetchList),
  latestVersion
}
