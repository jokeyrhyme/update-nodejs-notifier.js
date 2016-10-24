/* @flow */
'use strict'

const fetch = require('node-fetch')

/* ::
import type { BakeOptions, Cake } from 'hsipe'
*/

const NODEJS_URL = 'https://nodejs.org/dist/index.json'

function bake (options /* : BakeOptions */) /* : Promise<Cake> */ {
  // const cake = options.cake

  return fetch(NODEJS_URL)
    .then((res) => res.json())
    .then((versions) => ({ versions }))
}

module.exports = {
  NODEJS_URL,
  bake
}
