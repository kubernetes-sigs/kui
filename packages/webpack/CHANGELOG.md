# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.23](https://github.com/IBM/kui/compare/v3.0.22...v3.0.23) (2019-09-09)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.22](https://github.com/IBM/kui/compare/v3.0.21...v3.0.22) (2019-09-07)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.21](https://github.com/IBM/kui/compare/v3.0.20...v3.0.21) (2019-09-07)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.20](https://github.com/IBM/kui/compare/v3.0.19...v3.0.20) (2019-09-07)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.19](https://github.com/IBM/kui/compare/v3.0.18...v3.0.19) (2019-09-07)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.18](https://github.com/IBM/kui/compare/v3.0.17...v3.0.18) (2019-09-06)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.17](https://github.com/IBM/kui/compare/v3.0.16...v3.0.17) (2019-09-06)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.16](https://github.com/IBM/kui/compare/v3.0.15...v3.0.16) (2019-09-04)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.15](https://github.com/IBM/kui/compare/v3.0.14...v3.0.15) (2019-09-04)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.14](https://github.com/IBM/kui/compare/v3.0.13...v3.0.14) (2019-09-01)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.13](https://github.com/IBM/kui/compare/v3.0.12...v3.0.13) (2019-08-30)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.12](https://github.com/IBM/kui/compare/v3.0.11...v3.0.12) (2019-08-29)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.11](https://github.com/IBM/kui/compare/v3.0.10...v3.0.11) (2019-08-29)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.10](https://github.com/IBM/kui/compare/v3.0.9...v3.0.10) (2019-08-28)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.9](https://github.com/IBM/kui/compare/v3.0.8...v3.0.9) (2019-08-27)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.8](https://github.com/IBM/kui/compare/v3.0.7...v3.0.8) (2019-08-27)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.7](https://github.com/IBM/kui/compare/v3.0.6...v3.0.7) (2019-08-26)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.6](https://github.com/IBM/kui/compare/v3.0.5...v3.0.6) (2019-08-23)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.5](https://github.com/IBM/kui/compare/v3.0.4...v3.0.5) (2019-08-23)

### Bug Fixes

- **plugins/plugin-core-support:** pwd state in webpack+proxy versus tab switching ([006b26c](https://github.com/IBM/kui/commit/006b26c)), closes [#2478](https://github.com/IBM/kui/issues/2478)
- improve handling of contextRoot for custom clients ([6488920](https://github.com/IBM/kui/commit/6488920)), closes [#2482](https://github.com/IBM/kui/issues/2482)

## [3.0.4](https://github.com/IBM/kui/compare/v3.0.3...v3.0.4) (2019-08-22)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.3](https://github.com/IBM/kui/compare/v3.0.2...v3.0.3) (2019-08-22)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.2](https://github.com/IBM/kui/compare/v3.0.1...v3.0.2) (2019-08-21)

**Note:** Version bump only for package @kui-shell/webpack

## [3.0.1](https://github.com/IBM/kui/compare/v3.0.0...v3.0.1) (2019-08-20)

**Note:** Version bump only for package @kui-shell/webpack

# 3.0.0 (2019-08-19)

### Bug Fixes

- **packages/app:** CSP improvements ([fcacd07](https://github.com/IBM/kui/commit/fcacd07)), closes [#2351](https://github.com/IBM/kui/issues/2351) [#964](https://github.com/IBM/kui/issues/964)
- **packages/webpack:** broken webpack builds for external clients ([4acace0](https://github.com/IBM/kui/commit/4acace0)), closes [#1988](https://github.com/IBM/kui/issues/1988)
- **packages/webpack:** only override CSP for dev-server mode ([362a4e0](https://github.com/IBM/kui/commit/362a4e0)), closes [#2394](https://github.com/IBM/kui/issues/2394)
- cat foo.yml produces ugly output ([c839761](https://github.com/IBM/kui/commit/c839761)), closes [#2408](https://github.com/IBM/kui/issues/2408)
- improve support for semicolon-separated kube commands ([c841ae0](https://github.com/IBM/kui/commit/c841ae0)), closes [#2264](https://github.com/IBM/kui/issues/2264)
- improved proxy multitenancy ([f8f816f](https://github.com/IBM/kui/commit/f8f816f)), closes [#1938](https://github.com/IBM/kui/issues/1938)
- **plugins/plugin-bash-like:** xterm focus issues ([9a63427](https://github.com/IBM/kui/commit/9a63427)), closes [#2397](https://github.com/IBM/kui/issues/2397)
- **plugins/plugins-k8s:** kubectl get -lfoo=bar was not working ([8d31bb3](https://github.com/IBM/kui/commit/8d31bb3)), closes [#2332](https://github.com/IBM/kui/issues/2332)

### Features

- allow custom clients to inject static css ([e960b4c](https://github.com/IBM/kui/commit/e960b4c)), closes [#1886](https://github.com/IBM/kui/issues/1886)
- **plugins/plugin-proxy-executor:** channel all proxied commands through websocket ([70c6206](https://github.com/IBM/kui/commit/70c6206)), closes [#2066](https://github.com/IBM/kui/issues/2066)
- alternate example client ([f8542d7](https://github.com/IBM/kui/commit/f8542d7)), closes [#2128](https://github.com/IBM/kui/issues/2128)
- multi-tenant proxy ([3a4b40f](https://github.com/IBM/kui/commit/3a4b40f)), closes [#1907](https://github.com/IBM/kui/issues/1907)
- update sidecar tab UI ([9639811](https://github.com/IBM/kui/commit/9639811)), closes [#1867](https://github.com/IBM/kui/issues/1867)
