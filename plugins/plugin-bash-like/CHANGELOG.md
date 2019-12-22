# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.7.6](https://github.com/IBM/kui/compare/v4.5.0...v5.7.6) (2019-12-22)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.5](https://github.com/IBM/kui/compare/v4.5.0...v5.7.5) (2019-12-21)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.4](https://github.com/IBM/kui/compare/v4.5.0...v5.7.4) (2019-12-19)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.3](https://github.com/IBM/kui/compare/v4.5.0...v5.7.3) (2019-12-18)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.2](https://github.com/IBM/kui/compare/v4.5.0...v5.7.2) (2019-12-18)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.1](https://github.com/IBM/kui/compare/v5.7.0...v5.7.1) (2019-12-17)

**Note:** Version bump only for package @kui-shell/plugin-bash-like

# [5.7.0](https://github.com/IBM/kui/compare/v4.5.0...v5.7.0) (2019-12-17)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Features

- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

### Features

- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
