# Change Log


## Unreleased


## 1.1.1 - 2017-02-01


### Changed

-   if caller passes `versions` in, don't fetch versions (better for testing)

-   allow caller to pass in `notify()` function (better for testing)


### Fixed

-   "update" message for unstable Node.js versions (#7)


## 1.1.0 - 2016-11-01


### Added

-   use [nodejs-support-dates](https://github.com/jokeyrhyme/nodejs-support-dates.js) to provide warnings about unsupported versions


## 1.0.1 - 2016-10-25


### Fixed

-   actually say that "Node.js" needs updating (oops)
