<!-- markdownlint-disable --><!-- textlint-disable -->

# 📓 Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.3](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v1.1.2...v1.1.3) (2022-09-02)

### Bug Fixes

- removed incorrect icon attribute ([23af224](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/23af224737b7405d6c936b04af8b441b47566317))

## [1.1.2](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v1.1.1...v1.1.2) (2022-09-02)

### Bug Fixes

- **deps and ci:** semver workflow ([#7](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/issues/7)) ([05fb9ef](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/05fb9ef1c5bcd4ede17f8b5923a35287a88cfae1))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.1](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v1.1.0...v1.1.1) (2022-01-03)

### Bug Fixes

- correctly namespace deployment target \_ids ([cd97cd3](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/cd97cd39bd35260efe728c796d8cbadf4d788aa6))

## [1.1.0](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v1.0.0...v1.1.0) (2021-03-25)

### Features

- use API-versioned client if available ([44ca27f](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/44ca27fbd0649be8c050aad8b7eecf67324ee65d))

## [1.0.0](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.1.5...v1.0.0) (2021-03-24)

### ⚠ BREAKING CHANGES

- Deployment targets are now configured within sanity - please remove any vercel
  related configuration you may have stored inside your dashboard config file. Support for forcing
  small layout has also been (temporarily) dropped.

### Features

- store tokens in a namespaced sanity document, add support for multiple deploy targets ([a1a3446](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/a1a34464590934f1bf7adf3812f29acbef3ed314))

### Bug Fixes

- add eventless transitions to deployment target list machine ([7a6d921](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/7a6d921e05c238adbb335331531999a31f680b14))
- set correct form defaults, update input descriptions, include target name in deploy button ([bf10600](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/bf106000b1a69c9f127f517da98d901fbbbcd481))

### [0.1.5](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.1.4...v0.1.5) (2021-01-23)

### [0.1.4](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.1.3...v0.1.4) (2021-01-15)

### [0.1.3](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.1.2...v0.1.3) (2020-11-23)

### Bug Fixes

- add babel plugin-transform-runtime ([7a5ad89](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/7a5ad89b553387717017be01ee3778c641fca570))

### [0.1.2](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.1.1...v0.1.2) (2020-11-23)

### Bug Fixes

- don't return an empty array prior to aliases being fetched ([856be29](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/856be2981a9c02362d80212f6f773669a6fd7094))

### [0.1.1](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.1.0...v0.1.1) (2020-11-21)

### Bug Fixes

- add babel preset-env ([4da6993](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/4da69936e8158277fe9b9a77b491516e74dec4b3))

## [0.1.0](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.0.6...v0.1.0) (2020-11-21)

### [0.0.6](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.0.5...v0.0.6) (2020-11-21)

### Features

- allow deployLimit to be user configurable, minor cleanup" ([d15f4a8](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/d15f4a8f0ffa1525cb106a2006ff61ef53c29401))

### Bug Fixes

- correctly show cancelled dot color ([5045a3d](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/5045a3d4c9e3ba94945a97d3f1dfd5b636cf184a))

### [0.0.5](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.0.4...v0.0.5) (2020-11-20)

### Features

- make deployHook optional, show error snackbar on refresh error, add deployment skeleton" ([a24071e](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/a24071e7ab9d44f9b1a655cb260ee0680c698617))

### [0.0.4](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.0.3...v0.0.4) (2020-11-20)

### Features

- create dedicated cell components, force cell widths, minor cleanup ([fb4b36a](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/fb4b36a14332eb61f4f0f44484b2570a1b248418))
- display configuration error message, store config error in machine context ([e8ce270](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/e8ce270cf74215f5419a1053426d2742d2d3eee3))

### Bug Fixes

- add delay to DEPLOYED event before forcing refresh ([cd104fc](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/cd104fc8ba39ed601a39a7f139121106910dc3da))

### [0.0.3](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/compare/v0.0.2...v0.0.3) (2020-11-19)

### Features

- add initial xstate machines, use react-query ([ffff751](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/ffff751e0167a981a3d649ce991ca9ba06a048e6))
- add xstate deploy machhine, pull config values from sanity, add run-time config checking" ([6c940cb](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/6c940cb64d57e708f022f06840c9b9796b1d4883))

### 0.0.2 (2020-11-11)

### Features

- add commitizen, standard-release and husky ([160646c](https://github.com/robinpyon/sanity-plugin-dashboard-widget-vercel/commit/160646c73d140af6738e6ea8864e275a736a13f8))
