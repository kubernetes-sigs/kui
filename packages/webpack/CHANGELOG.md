# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.3.25](https://github.com/IBM/kui/compare/v10.3.24...v10.3.25) (2021-06-29)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.24](https://github.com/IBM/kui/compare/v10.3.23...v10.3.24) (2021-06-24)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.23](https://github.com/IBM/kui/compare/v10.3.22...v10.3.23) (2021-06-18)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.22](https://github.com/IBM/kui/compare/v10.3.21...v10.3.22) (2021-06-15)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.21](https://github.com/IBM/kui/compare/v10.3.20...v10.3.21) (2021-06-14)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.20](https://github.com/IBM/kui/compare/v10.3.19...v10.3.20) (2021-06-10)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.19](https://github.com/IBM/kui/compare/v10.3.18...v10.3.19) (2021-06-10)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.18](https://github.com/IBM/kui/compare/v10.3.17...v10.3.18) (2021-06-08)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.17](https://github.com/IBM/kui/compare/v10.3.16...v10.3.17) (2021-06-07)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.16](https://github.com/IBM/kui/compare/v10.3.15...v10.3.16) (2021-06-07)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.15](https://github.com/IBM/kui/compare/v10.3.14...v10.3.15) (2021-06-04)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.14](https://github.com/IBM/kui/compare/v10.3.13...v10.3.14) (2021-06-04)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.13](https://github.com/IBM/kui/compare/v10.3.12...v10.3.13) (2021-06-02)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.12](https://github.com/IBM/kui/compare/v10.3.11...v10.3.12) (2021-06-01)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.11](https://github.com/IBM/kui/compare/v10.3.10...v10.3.11) (2021-06-01)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.10](https://github.com/IBM/kui/compare/v10.3.9...v10.3.10) (2021-06-01)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.9](https://github.com/IBM/kui/compare/v10.3.8...v10.3.9) (2021-06-01)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.8](https://github.com/IBM/kui/compare/v10.3.7...v10.3.8) (2021-06-01)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.7](https://github.com/IBM/kui/compare/v10.3.6...v10.3.7) (2021-06-01)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.6](https://github.com/IBM/kui/compare/v10.3.5...v10.3.6) (2021-05-28)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.5](https://github.com/IBM/kui/compare/v10.3.4...v10.3.5) (2021-05-27)

### Bug Fixes

- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([3bd40dd](https://github.com/IBM/kui/commit/3bd40dd)), closes [#7467](https://github.com/IBM/kui/issues/7467)

## [10.3.4](https://github.com/IBM/kui/compare/v10.3.3...v10.3.4) (2021-05-24)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.3](https://github.com/IBM/kui/compare/v10.3.2...v10.3.3) (2021-05-22)

### Features

- **packages/webpack:** when building a headless bundle set via webpack, also create a zip file ([114e438](https://github.com/IBM/kui/commit/114e438)), closes [#7427](https://github.com/IBM/kui/issues/7427)

## [10.3.2](https://github.com/IBM/kui/compare/v10.3.1...v10.3.2) (2021-05-20)

**Note:** Version bump only for package @kui-shell/webpack

## [10.3.1](https://github.com/IBM/kui/compare/v10.3.0...v10.3.1) (2021-05-18)

**Note:** Version bump only for package @kui-shell/webpack

# [10.3.0](https://github.com/IBM/kui/compare/v4.5.0...v10.3.0) (2021-05-11)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/core:** in browser mode, kui can get stuck on proxy/nginx co-hosting mode ([9390a6b](https://github.com/IBM/kui/commit/9390a6b)), closes [#7167](https://github.com/IBM/kui/issues/7167)
- **packages/webpack:** allow imports of markdown and image assets ([c006958](https://github.com/IBM/kui/commit/c006958)), closes [#4983](https://github.com/IBM/kui/issues/4983)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** improve process shim for browser-based builds ([c255b23](https://github.com/IBM/kui/commit/c255b23))
- **packages/webpack:** not possible to build development webpack bundles with kui-build-webpack ([b7db124](https://github.com/IBM/kui/commit/b7db124)), closes [#7328](https://github.com/IBM/kui/issues/7328)
- **packages/webpack:** webpack 5 has deprecated [hash](<[0a575f2](https://github.com/IBM/kui/commit/0a575f2)>), closes [#6447](https://github.com/IBM/kui/issues/6447)
- **packages/webpack:** webpack config has bogus entry for zlib fallback ([3d52e56](https://github.com/IBM/kui/commit/3d52e56)), closes [#7332](https://github.com/IBM/kui/issues/7332)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- Markdown misparses certain links ([fd3b98e](https://github.com/IBM/kui/commit/fd3b98e)), closes [#6944](https://github.com/IBM/kui/issues/6944)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- **packages/webpack:** webpack builds may have fonts in the wrong place ([94ca684](https://github.com/IBM/kui/commit/94ca684)), closes [#6036](https://github.com/IBM/kui/issues/6036)
- **packages/webpack:** webpack.config.js blindly ignores certain directories ([e44ae46](https://github.com/IBM/kui/commit/e44ae46)), closes [#6626](https://github.com/IBM/kui/issues/6626)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- initial support for using a kubectl proxy ([47b26be](https://github.com/IBM/kui/commit/47b26be)), closes [#6440](https://github.com/IBM/kui/issues/6440)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- use webpack to build headless bundles ([e7c0d76](https://github.com/IBM/kui/commit/e7c0d76))
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/webpack

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- Markdown misparses certain links ([fd3b98e](https://github.com/IBM/kui/commit/fd3b98e)), closes [#6944](https://github.com/IBM/kui/issues/6944)
- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/webpack:** allow imports of markdown and image assets ([c006958](https://github.com/IBM/kui/commit/c006958)), closes [#4983](https://github.com/IBM/kui/issues/4983)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- **packages/webpack:** webpack 5 has deprecated [hash](<[0a575f2](https://github.com/IBM/kui/commit/0a575f2)>), closes [#6447](https://github.com/IBM/kui/issues/6447)
- **packages/webpack:** webpack builds may have fonts in the wrong place ([94ca684](https://github.com/IBM/kui/commit/94ca684)), closes [#6036](https://github.com/IBM/kui/issues/6036)
- **packages/webpack:** webpack.config.js blindly ignores certain directories ([e44ae46](https://github.com/IBM/kui/commit/e44ae46)), closes [#6626](https://github.com/IBM/kui/issues/6626)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- initial support for using a kubectl proxy ([47b26be](https://github.com/IBM/kui/commit/47b26be)), closes [#6440](https://github.com/IBM/kui/issues/6440)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/webpack:** allow imports of markdown and image assets ([c006958](https://github.com/IBM/kui/commit/c006958)), closes [#4983](https://github.com/IBM/kui/issues/4983)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- **packages/webpack:** webpack 5 has deprecated [hash](<[0a575f2](https://github.com/IBM/kui/commit/0a575f2)>), closes [#6447](https://github.com/IBM/kui/issues/6447)
- **packages/webpack:** webpack builds may have fonts in the wrong place ([94ca684](https://github.com/IBM/kui/commit/94ca684)), closes [#6036](https://github.com/IBM/kui/issues/6036)
- **packages/webpack:** webpack.config.js blindly ignores certain directories ([e44ae46](https://github.com/IBM/kui/commit/e44ae46)), closes [#6626](https://github.com/IBM/kui/issues/6626)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- initial support for using a kubectl proxy ([47b26be](https://github.com/IBM/kui/commit/47b26be)), closes [#6440](https://github.com/IBM/kui/issues/6440)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/webpack:** allow imports of markdown and image assets ([c006958](https://github.com/IBM/kui/commit/c006958)), closes [#4983](https://github.com/IBM/kui/issues/4983)
- **packages/webpack:** webpack builds may have fonts in the wrong place ([94ca684](https://github.com/IBM/kui/commit/94ca684)), closes [#6036](https://github.com/IBM/kui/issues/6036)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/webpack:** allow imports of markdown and image assets ([c006958](https://github.com/IBM/kui/commit/c006958)), closes [#4983](https://github.com/IBM/kui/issues/4983)
- **packages/webpack:** webpack builds may have fonts in the wrong place ([94ca684](https://github.com/IBM/kui/commit/94ca684)), closes [#6036](https://github.com/IBM/kui/issues/6036)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/webpack:** allow imports of markdown and image assets ([c006958](https://github.com/IBM/kui/commit/c006958)), closes [#4983](https://github.com/IBM/kui/issues/4983)
- **packages/webpack:** webpack builds may have fonts in the wrong place ([94ca684](https://github.com/IBM/kui/commit/94ca684)), closes [#6036](https://github.com/IBM/kui/issues/6036)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/webpack:** allow imports of markdown and image assets ([c006958](https://github.com/IBM/kui/commit/c006958)), closes [#4983](https://github.com/IBM/kui/issues/4983)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/webpack:** allow imports of markdown and image assets ([c006958](https://github.com/IBM/kui/commit/c006958)), closes [#4983](https://github.com/IBM/kui/issues/4983)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.11.0](https://github.com/IBM/kui/compare/v4.5.0...v8.11.0) (2020-07-21)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/webpack:** allow imports of markdown and image assets ([c006958](https://github.com/IBM/kui/commit/c006958)), closes [#4983](https://github.com/IBM/kui/issues/4983)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.10.0](https://github.com/IBM/kui/compare/v4.5.0...v8.10.0) (2020-06-17)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.9.0](https://github.com/IBM/kui/compare/v4.5.0...v8.9.0) (2020-06-09)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- some UI elements missing from editor UI ([797f527](https://github.com/IBM/kui/commit/797f527)), closes [#4582](https://github.com/IBM/kui/issues/4582)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.7.0](https://github.com/IBM/kui/compare/v4.5.0...v8.7.0) (2020-05-08)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)

### Features

- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

## [8.6.1](https://github.com/IBM/kui/compare/v4.5.0...v8.6.1) (2020-04-25)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.6.0](https://github.com/IBM/kui/compare/v4.5.0...v8.6.0) (2020-04-23)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/webpack

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/webpack

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/webpack

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/webpack

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- allow client to override styles by sass ([8cee5db](https://github.com/IBM/kui/commit/8cee5db)), closes [#3579](https://github.com/IBM/kui/issues/3579)
- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- **packages/webpack:** allow clients to request classname preservation in webpack builds ([3d9fd32](https://github.com/IBM/kui/commit/3d9fd32)), closes [#3575](https://github.com/IBM/kui/issues/3575)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/webpack

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- **packages/webpack:** build-docker regression on non-mac platforms ([a3eb001](https://github.com/IBM/kui/commit/a3eb001)), closes [#3565](https://github.com/IBM/kui/issues/3565)
- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)

### Features

- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- add 'Access-Control-Allow-Origin': '\*' to webpack dev server config ([fdb18c1](https://github.com/IBM/kui/commit/fdb18c1)), closes [#3324](https://github.com/IBM/kui/issues/3324)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve contextRoot support for webpack ([7b48781](https://github.com/IBM/kui/commit/7b48781)), closes [#3413](https://github.com/IBM/kui/issues/3413)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- webpack build tarCopy falsefully excludes a theme directory ([3800794](https://github.com/IBM/kui/commit/3800794)), closes [#3516](https://github.com/IBM/kui/issues/3516)
- **packages/webpack:** store generated webpack bundles under contextRoot ([7aa074d](https://github.com/IBM/kui/commit/7aa074d)), closes [#3418](https://github.com/IBM/kui/issues/3418)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/webpack:** don't ignore fsevents entirely in webpack ([eec4843](https://github.com/IBM/kui/commit/eec4843)), closes [#3402](https://github.com/IBM/kui/issues/3402)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- kui-watch-webpack should just watch webpack, not build ([ece3623](https://github.com/IBM/kui/commit/ece3623)), closes [#3377](https://github.com/IBM/kui/issues/3377)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- revert to webpack 4.40 ([141a407](https://github.com/IBM/kui/commit/141a407)), closes [#3005](https://github.com/IBM/kui/issues/3005)

### Features

- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- use webpack to build html template ([c4ad57a](https://github.com/IBM/kui/commit/c4ad57a)), closes [#3544](https://github.com/IBM/kui/issues/3544)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- **packages/webpack:** allow plugins to specify webpack externals ([74d2920](https://github.com/IBM/kui/commit/74d2920)), closes [#3399](https://github.com/IBM/kui/issues/3399)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Features

- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/webpack
