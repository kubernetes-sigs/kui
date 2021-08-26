# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.4.13](https://github.com/IBM/kui/compare/v10.4.12...v10.4.13) (2021-08-26)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.12](https://github.com/IBM/kui/compare/v10.4.11...v10.4.12) (2021-08-22)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.11](https://github.com/IBM/kui/compare/v10.4.10...v10.4.11) (2021-08-06)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.10](https://github.com/IBM/kui/compare/v10.4.9...v10.4.10) (2021-08-06)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.9](https://github.com/IBM/kui/compare/v10.4.8...v10.4.9) (2021-08-06)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.8](https://github.com/IBM/kui/compare/v10.4.7...v10.4.8) (2021-08-02)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.7](https://github.com/IBM/kui/compare/v10.4.6...v10.4.7) (2021-07-20)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.6](https://github.com/IBM/kui/compare/v10.4.5...v10.4.6) (2021-07-06)

### Features

- Add support to Kui proxy for pre-shared-key authorization ([0fb1c71](https://github.com/IBM/kui/commit/0fb1c71)), closes [#7772](https://github.com/IBM/kui/issues/7772)

## [10.4.5](https://github.com/IBM/kui/compare/v10.4.4...v10.4.5) (2021-07-01)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.4](https://github.com/IBM/kui/compare/v10.4.3...v10.4.4) (2021-06-28)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.3](https://github.com/IBM/kui/compare/v10.4.2...v10.4.3) (2021-06-25)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.2](https://github.com/IBM/kui/compare/v10.4.1...v10.4.2) (2021-06-24)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.4.1](https://github.com/IBM/kui/compare/v10.4.0...v10.4.1) (2021-06-21)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- **plugins/plugin-proxy-executor:** proxy-executor may fail poorly if the xhr has no response field ([951ebbc](https://github.com/IBM/kui/commit/951ebbc)), closes [#7170](https://github.com/IBM/kui/issues/7170)
- **plugins/plugin-proxy-support:** kui proxy may send duplicate messages back to client ([223a405](https://github.com/IBM/kui/commit/223a405)), closes [#7019](https://github.com/IBM/kui/issues/7019)
- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-client-common:** spurious warning in the console re: Tag ([93982de](https://github.com/IBM/kui/commit/93982de)), closes [#4959](https://github.com/IBM/kui/issues/4959)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- **plugins/plugin-proxy-support:** improved display of ProxyOffline state ([23b3206](https://github.com/IBM/kui/commit/23b3206)), closes [#4955](https://github.com/IBM/kui/issues/4955)
- **plugins/plugin-proxy-support:** ProxyOfflineIndicator widget does not clean up on unount ([97c6b27](https://github.com/IBM/kui/commit/97c6b27)), closes [#5849](https://github.com/IBM/kui/issues/5849)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)

### Features

- **plugins/plugin-kubectl:** Enhance kubectl direct get to support custom columns ([4762dd8](https://github.com/IBM/kui/commit/4762dd8)), closes [#7014](https://github.com/IBM/kui/issues/7014)
- **plugins/plugin-kubectl:** Port kubectl pollers to use push, for homogeneous deletes ([82448d7](https://github.com/IBM/kui/commit/82448d7)), closes [#6481](https://github.com/IBM/kui/issues/6481) [#6486](https://github.com/IBM/kui/issues/6486)
- Extend kubectl optimizations to table watching ([9a2bc74](https://github.com/IBM/kui/commit/9a2bc74)), closes [#6449](https://github.com/IBM/kui/issues/6449)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

### Bug Fixes

- **plugins/plugin-proxy-support:** kui proxy may send duplicate messages back to client ([223a405](https://github.com/IBM/kui/commit/223a405)), closes [#7019](https://github.com/IBM/kui/issues/7019)

### Features

- **plugins/plugin-kubectl:** Enhance kubectl direct get to support custom columns ([4762dd8](https://github.com/IBM/kui/commit/4762dd8)), closes [#7014](https://github.com/IBM/kui/issues/7014)

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-client-common:** spurious warning in the console re: Tag ([93982de](https://github.com/IBM/kui/commit/93982de)), closes [#4959](https://github.com/IBM/kui/issues/4959)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- **plugins/plugin-proxy-support:** improved display of ProxyOffline state ([23b3206](https://github.com/IBM/kui/commit/23b3206)), closes [#4955](https://github.com/IBM/kui/issues/4955)
- **plugins/plugin-proxy-support:** ProxyOfflineIndicator widget does not clean up on unount ([97c6b27](https://github.com/IBM/kui/commit/97c6b27)), closes [#5849](https://github.com/IBM/kui/issues/5849)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)

### Features

- **plugins/plugin-kubectl:** Port kubectl pollers to use push, for homogeneous deletes ([82448d7](https://github.com/IBM/kui/commit/82448d7)), closes [#6481](https://github.com/IBM/kui/issues/6481) [#6486](https://github.com/IBM/kui/issues/6486)
- Extend kubectl optimizations to table watching ([9a2bc74](https://github.com/IBM/kui/commit/9a2bc74)), closes [#6449](https://github.com/IBM/kui/issues/6449)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-client-common:** spurious warning in the console re: Tag ([93982de](https://github.com/IBM/kui/commit/93982de)), closes [#4959](https://github.com/IBM/kui/issues/4959)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- **plugins/plugin-proxy-support:** improved display of ProxyOffline state ([23b3206](https://github.com/IBM/kui/commit/23b3206)), closes [#4955](https://github.com/IBM/kui/issues/4955)
- **plugins/plugin-proxy-support:** ProxyOfflineIndicator widget does not clean up on unount ([97c6b27](https://github.com/IBM/kui/commit/97c6b27)), closes [#5849](https://github.com/IBM/kui/issues/5849)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)

### Features

- **plugins/plugin-kubectl:** Port kubectl pollers to use push, for homogeneous deletes ([82448d7](https://github.com/IBM/kui/commit/82448d7)), closes [#6481](https://github.com/IBM/kui/issues/6481) [#6486](https://github.com/IBM/kui/issues/6486)
- Extend kubectl optimizations to table watching ([9a2bc74](https://github.com/IBM/kui/commit/9a2bc74)), closes [#6449](https://github.com/IBM/kui/issues/6449)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-client-common:** spurious warning in the console re: Tag ([93982de](https://github.com/IBM/kui/commit/93982de)), closes [#4959](https://github.com/IBM/kui/issues/4959)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- **plugins/plugin-proxy-support:** improved display of ProxyOffline state ([23b3206](https://github.com/IBM/kui/commit/23b3206)), closes [#4955](https://github.com/IBM/kui/issues/4955)
- **plugins/plugin-proxy-support:** ProxyOfflineIndicator widget does not clean up on unount ([97c6b27](https://github.com/IBM/kui/commit/97c6b27)), closes [#5849](https://github.com/IBM/kui/issues/5849)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)

### Features

- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-client-common:** spurious warning in the console re: Tag ([93982de](https://github.com/IBM/kui/commit/93982de)), closes [#4959](https://github.com/IBM/kui/issues/4959)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- **plugins/plugin-proxy-support:** improved display of ProxyOffline state ([23b3206](https://github.com/IBM/kui/commit/23b3206)), closes [#4955](https://github.com/IBM/kui/issues/4955)
- **plugins/plugin-proxy-support:** ProxyOfflineIndicator widget does not clean up on unount ([97c6b27](https://github.com/IBM/kui/commit/97c6b27)), closes [#5849](https://github.com/IBM/kui/issues/5849)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)

### Features

- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-client-common:** spurious warning in the console re: Tag ([93982de](https://github.com/IBM/kui/commit/93982de)), closes [#4959](https://github.com/IBM/kui/issues/4959)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- **plugins/plugin-proxy-support:** improved display of ProxyOffline state ([23b3206](https://github.com/IBM/kui/commit/23b3206)), closes [#4955](https://github.com/IBM/kui/issues/4955)
- **plugins/plugin-proxy-support:** ProxyOfflineIndicator widget does not clean up on unount ([97c6b27](https://github.com/IBM/kui/commit/97c6b27)), closes [#5849](https://github.com/IBM/kui/issues/5849)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)

### Features

- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-client-common:** spurious warning in the console re: Tag ([93982de](https://github.com/IBM/kui/commit/93982de)), closes [#4959](https://github.com/IBM/kui/issues/4959)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- **plugins/plugin-proxy-support:** improved display of ProxyOffline state ([23b3206](https://github.com/IBM/kui/commit/23b3206)), closes [#4955](https://github.com/IBM/kui/issues/4955)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- **plugins/plugin-proxy-support:** ProxyOfflineIndicator widget does not clean up on unount ([97c6b27](https://github.com/IBM/kui/commit/97c6b27)), closes [#5849](https://github.com/IBM/kui/issues/5849)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### Features

- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Bug Fixes

- **plugins/plugin-client-common:** spurious warning in the console re: Tag ([93982de](https://github.com/IBM/kui/commit/93982de)), closes [#4959](https://github.com/IBM/kui/issues/4959)
- **plugins/plugin-proxy-support:** improved display of ProxyOffline state ([23b3206](https://github.com/IBM/kui/commit/23b3206)), closes [#4955](https://github.com/IBM/kui/issues/4955)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [8.11.0](https://github.com/IBM/kui/compare/v4.5.0...v8.11.0) (2020-07-21)

### Bug Fixes

- **plugins/plugin-client-common:** spurious warning in the console re: Tag ([93982de](https://github.com/IBM/kui/commit/93982de)), closes [#4959](https://github.com/IBM/kui/issues/4959)
- **plugins/plugin-proxy-support:** improved display of ProxyOffline state ([23b3206](https://github.com/IBM/kui/commit/23b3206)), closes [#4955](https://github.com/IBM/kui/issues/4955)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [8.10.0](https://github.com/IBM/kui/compare/v4.5.0...v8.10.0) (2020-06-17)

### Bug Fixes

- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [8.9.0](https://github.com/IBM/kui/compare/v4.5.0...v8.9.0) (2020-06-09)

### Bug Fixes

- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [8.7.0](https://github.com/IBM/kui/compare/v4.5.0...v8.7.0) (2020-05-08)

### Bug Fixes

- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

## [8.6.1](https://github.com/IBM/kui/compare/v4.5.0...v8.6.1) (2020-04-25)

### Bug Fixes

- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [8.6.0](https://github.com/IBM/kui/compare/v4.5.0...v8.6.0) (2020-04-23)

### Bug Fixes

- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- removes support for inBrowserOk
- **packages/core:** remove old EntitySpec support

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- **plugins/plugin-proxy-support:** fixed env for proxy executor ([c8de22b](https://github.com/IBM/kui/commit/c8de22b))
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-proxy-support:** proxy offline indicicator shows up in electron clients ([783b304](https://github.com/IBM/kui/commit/783b304)), closes [#3747](https://github.com/IBM/kui/issues/3747)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support
