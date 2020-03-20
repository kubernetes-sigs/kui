# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-editor:** Editor component should be readOnly for non-files ([b537d5c](https://github.com/IBM/kui/commit/b537d5c)), closes [#3641](https://github.com/IBM/kui/issues/3641)
- **plugins/plugin-editor:** editor does not use metadata.name ([7578ec2](https://github.com/IBM/kui/commit/7578ec2)), closes [#3240](https://github.com/IBM/kui/issues/3240)
- **plugins/plugin-editor:** remove leftover use of old `direct` API ([be6c50c](https://github.com/IBM/kui/commit/be6c50c)), closes [#3310](https://github.com/IBM/kui/issues/3310)
- **plugins/plugin-editor:** remove use of fragile semi-global in editor init ([560396e](https://github.com/IBM/kui/commit/560396e)), closes [#3415](https://github.com/IBM/kui/issues/3415)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **plugins/plugin-editor:** fix sidecar editor tooltip contrast issue ([3b612a2](https://github.com/IBM/kui/commit/3b612a2))
- **plugins/plugin-editor:** pin monac-editor-webpack-plugin dep ([dffb4aa](https://github.com/IBM/kui/commit/dffb4aa)), closes [#3387](https://github.com/IBM/kui/issues/3387)
- **plugins/plugin-editor:** syntax coloring not always active ([2f565bf](https://github.com/IBM/kui/commit/2f565bf)), closes [#3043](https://github.com/IBM/kui/issues/3043)

### Features

- editor's persister/fetcher API should expose tab context ([70f633a](https://github.com/IBM/kui/commit/70f633a)), closes [#3351](https://github.com/IBM/kui/issues/3351)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-editor

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-editor

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/plugin-editor

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-editor

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- **plugins/plugin-editor:** remove use of fragile semi-global in editor init ([560396e](https://github.com/IBM/kui/commit/560396e)), closes [#3415](https://github.com/IBM/kui/issues/3415)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-editor:** editor does not use metadata.name ([7578ec2](https://github.com/IBM/kui/commit/7578ec2)), closes [#3240](https://github.com/IBM/kui/issues/3240)
- **plugins/plugin-editor:** fix sidecar editor tooltip contrast issue ([3b612a2](https://github.com/IBM/kui/commit/3b612a2))
- **plugins/plugin-editor:** pin monac-editor-webpack-plugin dep ([dffb4aa](https://github.com/IBM/kui/commit/dffb4aa)), closes [#3387](https://github.com/IBM/kui/issues/3387)
- **plugins/plugin-editor:** remove leftover use of old `direct` API ([be6c50c](https://github.com/IBM/kui/commit/be6c50c)), closes [#3310](https://github.com/IBM/kui/issues/3310)
- **plugins/plugin-editor:** syntax coloring not always active ([2f565bf](https://github.com/IBM/kui/commit/2f565bf)), closes [#3043](https://github.com/IBM/kui/issues/3043)

### Features

- editor's persister/fetcher API should expose tab context ([70f633a](https://github.com/IBM/kui/commit/70f633a)), closes [#3351](https://github.com/IBM/kui/issues/3351)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- **plugins/plugin-editor:** remove use of fragile semi-global in editor init ([560396e](https://github.com/IBM/kui/commit/560396e)), closes [#3415](https://github.com/IBM/kui/issues/3415)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-editor:** editor does not use metadata.name ([7578ec2](https://github.com/IBM/kui/commit/7578ec2)), closes [#3240](https://github.com/IBM/kui/issues/3240)
- **plugins/plugin-editor:** fix sidecar editor tooltip contrast issue ([3b612a2](https://github.com/IBM/kui/commit/3b612a2))
- **plugins/plugin-editor:** pin monac-editor-webpack-plugin dep ([dffb4aa](https://github.com/IBM/kui/commit/dffb4aa)), closes [#3387](https://github.com/IBM/kui/issues/3387)
- **plugins/plugin-editor:** remove leftover use of old `direct` API ([be6c50c](https://github.com/IBM/kui/commit/be6c50c)), closes [#3310](https://github.com/IBM/kui/issues/3310)
- **plugins/plugin-editor:** syntax coloring not always active ([2f565bf](https://github.com/IBM/kui/commit/2f565bf)), closes [#3043](https://github.com/IBM/kui/issues/3043)

### Features

- editor's persister/fetcher API should expose tab context ([70f633a](https://github.com/IBM/kui/commit/70f633a)), closes [#3351](https://github.com/IBM/kui/issues/3351)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- **plugins/plugin-editor:** remove use of fragile semi-global in editor init ([560396e](https://github.com/IBM/kui/commit/560396e)), closes [#3415](https://github.com/IBM/kui/issues/3415)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-editor:** editor does not use metadata.name ([7578ec2](https://github.com/IBM/kui/commit/7578ec2)), closes [#3240](https://github.com/IBM/kui/issues/3240)
- **plugins/plugin-editor:** fix sidecar editor tooltip contrast issue ([3b612a2](https://github.com/IBM/kui/commit/3b612a2))
- **plugins/plugin-editor:** pin monac-editor-webpack-plugin dep ([dffb4aa](https://github.com/IBM/kui/commit/dffb4aa)), closes [#3387](https://github.com/IBM/kui/issues/3387)
- **plugins/plugin-editor:** remove leftover use of old `direct` API ([be6c50c](https://github.com/IBM/kui/commit/be6c50c)), closes [#3310](https://github.com/IBM/kui/issues/3310)
- **plugins/plugin-editor:** syntax coloring not always active ([2f565bf](https://github.com/IBM/kui/commit/2f565bf)), closes [#3043](https://github.com/IBM/kui/issues/3043)

### Features

- editor's persister/fetcher API should expose tab context ([70f633a](https://github.com/IBM/kui/commit/70f633a)), closes [#3351](https://github.com/IBM/kui/issues/3351)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- **plugins/plugin-editor:** remove use of fragile semi-global in editor init ([560396e](https://github.com/IBM/kui/commit/560396e)), closes [#3415](https://github.com/IBM/kui/issues/3415)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-editor:** editor does not use metadata.name ([7578ec2](https://github.com/IBM/kui/commit/7578ec2)), closes [#3240](https://github.com/IBM/kui/issues/3240)
- **plugins/plugin-editor:** fix sidecar editor tooltip contrast issue ([3b612a2](https://github.com/IBM/kui/commit/3b612a2))
- **plugins/plugin-editor:** pin monac-editor-webpack-plugin dep ([dffb4aa](https://github.com/IBM/kui/commit/dffb4aa)), closes [#3387](https://github.com/IBM/kui/issues/3387)
- **plugins/plugin-editor:** remove leftover use of old `direct` API ([be6c50c](https://github.com/IBM/kui/commit/be6c50c)), closes [#3310](https://github.com/IBM/kui/issues/3310)
- **plugins/plugin-editor:** syntax coloring not always active ([2f565bf](https://github.com/IBM/kui/commit/2f565bf)), closes [#3043](https://github.com/IBM/kui/issues/3043)

### Features

- editor's persister/fetcher API should expose tab context ([70f633a](https://github.com/IBM/kui/commit/70f633a)), closes [#3351](https://github.com/IBM/kui/issues/3351)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-editor

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- **plugins/plugin-editor:** remove use of fragile semi-global in editor init ([560396e](https://github.com/IBM/kui/commit/560396e)), closes [#3415](https://github.com/IBM/kui/issues/3415)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-editor:** editor does not use metadata.name ([7578ec2](https://github.com/IBM/kui/commit/7578ec2)), closes [#3240](https://github.com/IBM/kui/issues/3240)
- **plugins/plugin-editor:** fix sidecar editor tooltip contrast issue ([3b612a2](https://github.com/IBM/kui/commit/3b612a2))
- **plugins/plugin-editor:** pin monac-editor-webpack-plugin dep ([dffb4aa](https://github.com/IBM/kui/commit/dffb4aa)), closes [#3387](https://github.com/IBM/kui/issues/3387)
- **plugins/plugin-editor:** remove leftover use of old `direct` API ([be6c50c](https://github.com/IBM/kui/commit/be6c50c)), closes [#3310](https://github.com/IBM/kui/issues/3310)
- **plugins/plugin-editor:** syntax coloring not always active ([2f565bf](https://github.com/IBM/kui/commit/2f565bf)), closes [#3043](https://github.com/IBM/kui/issues/3043)

### Features

- editor's persister/fetcher API should expose tab context ([70f633a](https://github.com/IBM/kui/commit/70f633a)), closes [#3351](https://github.com/IBM/kui/issues/3351)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- **plugins/plugin-editor:** remove use of fragile semi-global in editor init ([560396e](https://github.com/IBM/kui/commit/560396e)), closes [#3415](https://github.com/IBM/kui/issues/3415)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-editor:** editor does not use metadata.name ([7578ec2](https://github.com/IBM/kui/commit/7578ec2)), closes [#3240](https://github.com/IBM/kui/issues/3240)
- **plugins/plugin-editor:** fix sidecar editor tooltip contrast issue ([3b612a2](https://github.com/IBM/kui/commit/3b612a2))
- **plugins/plugin-editor:** pin monac-editor-webpack-plugin dep ([dffb4aa](https://github.com/IBM/kui/commit/dffb4aa)), closes [#3387](https://github.com/IBM/kui/issues/3387)
- **plugins/plugin-editor:** remove leftover use of old `direct` API ([be6c50c](https://github.com/IBM/kui/commit/be6c50c)), closes [#3310](https://github.com/IBM/kui/issues/3310)
- **plugins/plugin-editor:** syntax coloring not always active ([2f565bf](https://github.com/IBM/kui/commit/2f565bf)), closes [#3043](https://github.com/IBM/kui/issues/3043)

### Features

- editor's persister/fetcher API should expose tab context ([70f633a](https://github.com/IBM/kui/commit/70f633a)), closes [#3351](https://github.com/IBM/kui/issues/3351)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- **plugins/plugin-editor:** remove use of fragile semi-global in editor init ([560396e](https://github.com/IBM/kui/commit/560396e)), closes [#3415](https://github.com/IBM/kui/issues/3415)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-editor:** editor does not use metadata.name ([7578ec2](https://github.com/IBM/kui/commit/7578ec2)), closes [#3240](https://github.com/IBM/kui/issues/3240)
- **plugins/plugin-editor:** fix sidecar editor tooltip contrast issue ([3b612a2](https://github.com/IBM/kui/commit/3b612a2))
- **plugins/plugin-editor:** pin monac-editor-webpack-plugin dep ([dffb4aa](https://github.com/IBM/kui/commit/dffb4aa)), closes [#3387](https://github.com/IBM/kui/issues/3387)
- **plugins/plugin-editor:** remove leftover use of old `direct` API ([be6c50c](https://github.com/IBM/kui/commit/be6c50c)), closes [#3310](https://github.com/IBM/kui/issues/3310)
- **plugins/plugin-editor:** syntax coloring not always active ([2f565bf](https://github.com/IBM/kui/commit/2f565bf)), closes [#3043](https://github.com/IBM/kui/issues/3043)

### Features

- editor's persister/fetcher API should expose tab context ([70f633a](https://github.com/IBM/kui/commit/70f633a)), closes [#3351](https://github.com/IBM/kui/issues/3351)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- **plugins/plugin-editor:** remove use of fragile semi-global in editor init ([560396e](https://github.com/IBM/kui/commit/560396e)), closes [#3415](https://github.com/IBM/kui/issues/3415)
- webpack builds for production a bit broken ([26999c8](https://github.com/IBM/kui/commit/26999c8)), closes [#3405](https://github.com/IBM/kui/issues/3405)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-editor:** editor does not use metadata.name ([7578ec2](https://github.com/IBM/kui/commit/7578ec2)), closes [#3240](https://github.com/IBM/kui/issues/3240)
- **plugins/plugin-editor:** fix sidecar editor tooltip contrast issue ([3b612a2](https://github.com/IBM/kui/commit/3b612a2))
- **plugins/plugin-editor:** pin monac-editor-webpack-plugin dep ([dffb4aa](https://github.com/IBM/kui/commit/dffb4aa)), closes [#3387](https://github.com/IBM/kui/issues/3387)
- **plugins/plugin-editor:** remove leftover use of old `direct` API ([be6c50c](https://github.com/IBM/kui/commit/be6c50c)), closes [#3310](https://github.com/IBM/kui/issues/3310)
- **plugins/plugin-editor:** syntax coloring not always active ([2f565bf](https://github.com/IBM/kui/commit/2f565bf)), closes [#3043](https://github.com/IBM/kui/issues/3043)

### Features

- editor's persister/fetcher API should expose tab context ([70f633a](https://github.com/IBM/kui/commit/70f633a)), closes [#3351](https://github.com/IBM/kui/issues/3351)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

**Note:** Version bump only for package @kui-shell/plugin-editor

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/plugin-editor
