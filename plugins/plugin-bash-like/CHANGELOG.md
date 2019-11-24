# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.4.1](https://github.com/IBM/kui/compare/v5.4.0...v5.4.1) (2019-11-24)

**Note:** Version bump only for package @kui-shell/plugin-bash-like

# [5.4.0](https://github.com/IBM/kui/compare/v4.5.0...v5.4.0) (2019-11-24)

### Bug Fixes

- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)

### Features

- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Features

- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

### Features

- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
