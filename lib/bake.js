/* @flow */
'use strict'

const fetch = require('node-fetch')

/* ::
import type { BakeOptions } from 'hsipe'
*/

const NODEJS_URL = 'https://nodejs.org/dist/index.json'

function bake (options /* : BakeOptions */) /* : Promise<void> */ {
  const conf = options.conf

  return fetch(NODEJS_URL)
    .then((res) => res.json())
    .then((versions) => {
      conf.set('versions', versions)
    })
}

module.exports = {
  NODEJS_URL,
  bake
}
