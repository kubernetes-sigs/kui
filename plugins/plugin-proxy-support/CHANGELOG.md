# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.0.1](https://github.com/IBM/kui/compare/v9.0.0...v9.0.1) (2020-10-10)

### Bug Fixes

- improve discovery of ibmcloud s3 credentials ([0fe3b33](https://github.com/IBM/kui/commit/0fe3b33)), closes [#5926](https://github.com/IBM/kui/issues/5926)

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
