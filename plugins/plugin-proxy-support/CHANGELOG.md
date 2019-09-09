# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.25](https://github.com/IBM/kui/compare/v3.0.24...v3.0.25) (2019-09-09)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.24](https://github.com/IBM/kui/compare/v3.0.23...v3.0.24) (2019-09-09)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.23](https://github.com/IBM/kui/compare/v3.0.22...v3.0.23) (2019-09-09)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.22](https://github.com/IBM/kui/compare/v3.0.21...v3.0.22) (2019-09-07)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.21](https://github.com/IBM/kui/compare/v3.0.20...v3.0.21) (2019-09-07)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.20](https://github.com/IBM/kui/compare/v3.0.19...v3.0.20) (2019-09-07)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.19](https://github.com/IBM/kui/compare/v3.0.18...v3.0.19) (2019-09-07)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.18](https://github.com/IBM/kui/compare/v3.0.17...v3.0.18) (2019-09-06)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.17](https://github.com/IBM/kui/compare/v3.0.16...v3.0.17) (2019-09-06)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.16](https://github.com/IBM/kui/compare/v3.0.15...v3.0.16) (2019-09-04)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.15](https://github.com/IBM/kui/compare/v3.0.14...v3.0.15) (2019-09-04)

### Bug Fixes

- **plugins/plugin-proxy-support:** proxy-executor renderDom fails if nodeType is undefined ([8d7b947](https://github.com/IBM/kui/commit/8d7b947)), closes [#2644](https://github.com/IBM/kui/issues/2644)

## [3.0.14](https://github.com/IBM/kui/compare/v3.0.13...v3.0.14) (2019-09-01)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.13](https://github.com/IBM/kui/compare/v3.0.12...v3.0.13) (2019-08-30)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.12](https://github.com/IBM/kui/compare/v3.0.11...v3.0.12) (2019-08-29)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.11](https://github.com/IBM/kui/compare/v3.0.10...v3.0.11) (2019-08-29)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.10](https://github.com/IBM/kui/compare/v3.0.9...v3.0.10) (2019-08-28)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.9](https://github.com/IBM/kui/compare/v3.0.8...v3.0.9) (2019-08-27)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.8](https://github.com/IBM/kui/compare/v3.0.7...v3.0.8) (2019-08-27)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.7](https://github.com/IBM/kui/compare/v3.0.6...v3.0.7) (2019-08-26)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.6](https://github.com/IBM/kui/compare/v3.0.5...v3.0.6) (2019-08-23)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.5](https://github.com/IBM/kui/compare/v3.0.4...v3.0.5) (2019-08-23)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.4](https://github.com/IBM/kui/compare/v3.0.3...v3.0.4) (2019-08-22)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.3](https://github.com/IBM/kui/compare/v3.0.2...v3.0.3) (2019-08-22)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.2](https://github.com/IBM/kui/compare/v3.0.1...v3.0.2) (2019-08-21)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

## [3.0.1](https://github.com/IBM/kui/compare/v3.0.0...v3.0.1) (2019-08-20)

**Note:** Version bump only for package @kui-shell/plugin-proxy-support

# 3.0.0 (2019-08-19)

### Bug Fixes

- 404 errors do not flow back from proxy properly ([9cf76d3](https://github.com/IBM/kui/commit/9cf76d3)), closes [#2237](https://github.com/IBM/kui/issues/2237)
- avoid catchall registration if in browser and no proxy ([5de02c2](https://github.com/IBM/kui/commit/5de02c2)), closes [#1494](https://github.com/IBM/kui/issues/1494)
- **plugins/plugin-proxy-support:** try to unwind the returned fakedom in proxy executor, throw execption if necessary ([6be1aa0](https://github.com/IBM/kui/commit/6be1aa0)), closes [#1687](https://github.com/IBM/kui/issues/1687)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **packages/app:** register capabilities before preloading plugins ([871d9de](https://github.com/IBM/kui/commit/871d9de)), closes [#1724](https://github.com/IBM/kui/issues/1724)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-bash-like:** proxy session reconnect issues ([8bb48f0](https://github.com/IBM/kui/commit/8bb48f0)), closes [#2311](https://github.com/IBM/kui/issues/2311)
- **plugins/plugin-k8s:** helm error handling in webpack ([c760a3a](https://github.com/IBM/kui/commit/c760a3a)), closes [#2340](https://github.com/IBM/kui/issues/2340)
- **plugins/plugin-proxy-executor:** also look for statusCode ([2ebfc65](https://github.com/IBM/kui/commit/2ebfc65)), closes [#2154](https://github.com/IBM/kui/issues/2154)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-executor:** proxy-executor versus string responses ([4682f67](https://github.com/IBM/kui/commit/4682f67)), closes [#2208](https://github.com/IBM/kui/issues/2208)
- **plugins/plugin-proxy-support:** override execOptions.tab in proxy executor ([a3af5e1](https://github.com/IBM/kui/commit/a3af5e1)), closes [#1649](https://github.com/IBM/kui/issues/1649)
- improved proxy multitenancy ([b6b339c](https://github.com/IBM/kui/commit/b6b339c)), closes [#1907](https://github.com/IBM/kui/issues/1907) [#1923](https://github.com/IBM/kui/issues/1923) [#1920](https://github.com/IBM/kui/issues/1920)
- improved proxy multitenancy ([f8f816f](https://github.com/IBM/kui/commit/f8f816f)), closes [#1938](https://github.com/IBM/kui/issues/1938)
- kubectl logs versus webpack+proxy ([cea804a](https://github.com/IBM/kui/commit/cea804a)), closes [#1684](https://github.com/IBM/kui/issues/1684)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugins/plugin-proxy-support:** restore usage error rendering in proxy clients ([4c16aff](https://github.com/IBM/kui/commit/4c16aff)), closes [#2246](https://github.com/IBM/kui/issues/2246)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- **plugins/plugin-proxy-executor:** channel all proxied commands through websocket ([70c6206](https://github.com/IBM/kui/commit/70c6206)), closes [#2066](https://github.com/IBM/kui/issues/2066)
- kubectl exec support ([81c6e5a](https://github.com/IBM/kui/commit/81c6e5a)), closes [#2117](https://github.com/IBM/kui/issues/2117)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.34.0 (2019-06-17)

### Bug Fixes

- avoid catchall registration if in browser and no proxy ([5de02c2](https://github.com/IBM/kui/commit/5de02c2)), closes [#1494](https://github.com/IBM/kui/issues/1494)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/app:** register capabilities before preloading plugins ([871d9de](https://github.com/IBM/kui/commit/871d9de)), closes [#1724](https://github.com/IBM/kui/issues/1724)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** override execOptions.tab in proxy executor ([a3af5e1](https://github.com/IBM/kui/commit/a3af5e1)), closes [#1649](https://github.com/IBM/kui/issues/1649)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.33.0 (2019-05-22)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.32.0 (2019-05-08)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.31.0 (2019-05-07)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.30.0 (2019-05-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.29.0 (2019-05-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.28.0 (2019-05-04)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.27.0 (2019-04-26)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.26.0 (2019-04-23)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.25.0 (2019-04-10)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.24.0 (2019-03-19)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.23.0 (2019-03-19)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.22.0 (2019-03-10)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.21.0 (2019-03-10)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.20.0 (2019-03-10)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)
- **plugins/plugin-proxy-support:** webpack+proxy versus usage errors ([4557a72](https://github.com/IBM/kui/commit/4557a72)), closes [#733](https://github.com/IBM/kui/issues/733)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.19.0 (2019-03-09)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.18.0 (2019-03-08)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.17.0 (2019-03-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.16.0 (2019-03-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- **plugins/plugin-proxy-executor:** error handling fixes for proxy-executor ([de67a7c](https://github.com/IBM/kui/commit/de67a7c)), closes [#651](https://github.com/IBM/kui/issues/651)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.15.0 (2019-03-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.14.0 (2019-02-28)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.13.0 (2019-02-28)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)

# 0.12.0 (2019-02-27)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.11.0 (2019-02-22)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.10.0 (2019-02-21)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.9.0 (2019-02-21)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

## 0.8.1 (2019-02-20)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.8.0 (2019-02-20)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.7.0 (2019-02-19)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.6.0 (2019-02-13)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.5.0 (2019-02-04)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.4.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.3.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.2.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/IBM/kui/commit/d17856f)), closes [#310](https://github.com/IBM/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.1.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/starpit/kui/commit/a441c33)), closes [#287](https://github.com/starpit/kui/issues/287) [#286](https://github.com/starpit/kui/issues/286) [#289](https://github.com/starpit/kui/issues/289)
- **plugin-proxy-support:** needle url issue ([d17856f](https://github.com/starpit/kui/commit/d17856f)), closes [#310](https://github.com/starpit/kui/issues/310)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/starpit/kui/commit/d6f474d)), closes [#355](https://github.com/starpit/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/starpit/kui/commit/530c278)), closes [#266](https://github.com/starpit/kui/issues/266) [#278](https://github.com/starpit/kui/issues/278) [#279](https://github.com/starpit/kui/issues/279)
