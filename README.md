# update-nodejs-notifier [![npm](https://img.shields.io/npm/v/update-nodejs-notifier.svg?maxAge=2592000)](https://www.npmjs.com/package/update-nodejs-notifier) [![AppVeyor Status](https://ci.appveyor.com/api/projects/status/094e7unld01so0o7?svg=true)](https://ci.appveyor.com/project/jokeyrhyme/update-nodejs-notifier-js) [![Travis CI Status](https://travis-ci.org/jokeyrhyme/update-nodejs-notifier.js.svg?branch=master)](https://travis-ci.org/jokeyrhyme/update-nodejs-notifier.js)

tell your CLI users that their Node.js is old


## Usage

Set and forget.
Users will see a notification if their Node.js version needs updating.

This library will make no more than a single HTTP request every 5 days.


### Simple example

```js
const { updateNodejsNotifier } = require('update-nodejs-notifier')
updateNodejsNotifier()
```


### Comprehensive example

```js
const { updateNodejsNotifier } = require('update-nodejs-notifier')

updateNodejsNotifier({
  // listed in order of most-severe to least-severe
  // we display the first most-severe matching alert
  // these are the default settings
  notSupported: true, // alert if upstream Node.js support ended
  daysOld: Infinity, // alert if version released this long ago
  stableMajor: true, // alert if MAJOR version older than best "stable"
  stableMinor: false, // alert if MINOR version older than best "stable"
  stablePatch: false, // alert if PATCH version older than best "stable"
})
```


## Roadmap

-   [ ] finish "notSupported" behaviour


## See Also

-   [boxen-notify](https://github.com/jokeyrhyme/boxen-notify.js)

-   [hsipe](https://github.com/jokeyrhyme/hsipe.js)

-   [conf](https://github.com/sindresorhus/conf)

-   [package-engines-notifier](https://github.com/jokeyrhyme/package-engines-notifier.js)

-   [update-notifier](https://github.com/yeoman/update-notifier)
