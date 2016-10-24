# update-nodejs-notifier [![npm](https://img.shields.io/npm/v/update-nodejs-notifier.js.svg?maxAge=2592000)](https://www.npmjs.com/package/update-nodejs-notifier.js)

tell your CLI users that their Node.js is old


## Examples


### Simple example

```js
const updateNodejsNotifier = require('update-nodejs-notifier')
updateNodejsNotifier().notify()
```


### Comprehensive example

```js
const updateNodejsNotifier = require('update-nodejs-notifier')

const notifier = updateNodejsNotifier({
  // listed in order of most-severe to least-severe
  // we display the first most-severe matching alert
  // these are the default settings
  notSupported: true, // alert if upstream Node.js support ended
  daysOld: Infinity, // alert if version released this long ago
  stableMajor: true, // alert if MAJOR version older than best "stable"
  stableMinor: false, // alert if MINOR version older than best "stable"
  stablePatch: false, // alert if PATCH version older than best "stable"
})

notifier.notify()
```


## How

This project extends functionality in the popular [update-notifier](https://github.com/yeoman/update-notifier) package.
See upstream documentation for more details.

We drop behaviour that is specific to NPM package versions,
replacing it with logic to check the Node.js version.


## See Also

-   [boxen-notify](https://github.com/jokeyrhyme/boxen-notify.js)

-   [package-engines-notifier](https://github.com/jokeyrhyme/package-engines-notifier.js)

-   [update-notifier](https://github.com/yeoman/update-notifier)
