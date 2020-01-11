# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.7.29](https://github.com/IBM/kui/compare/v4.5.0...v5.7.29) (2020-01-11)

### Bug Fixes

- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.28](https://github.com/IBM/kui/compare/v4.5.0...v5.7.28) (2020-01-11)

### Bug Fixes

- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.27](https://github.com/IBM/kui/compare/v4.5.0...v5.7.27) (2020-01-10)

### Bug Fixes

- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.26](https://github.com/IBM/kui/compare/v4.5.0...v5.7.26) (2020-01-09)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.25](https://github.com/IBM/kui/compare/v5.7.24...v5.7.25) (2020-01-08)

**Note:** Version bump only for package @kui-shell/plugin-bash-like

## [5.7.24](https://github.com/IBM/kui/compare/v4.5.0...v5.7.24) (2020-01-08)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [5.7.23](https://github.com/IBM/kui/compare/v4.5.0...v5.7.23) (2020-01-07)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

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

## [5.7.22](https://github.com/IBM/kui/compare/v4.5.0...v5.7.22) (2020-01-02)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

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

## [5.7.21](https://github.com/IBM/kui/compare/v4.5.0...v5.7.21) (2019-12-31)

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

## [5.7.20](https://github.com/IBM/kui/compare/v4.5.0...v5.7.20) (2019-12-31)

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

## [5.7.19](https://github.com/IBM/kui/compare/v4.5.0...v5.7.19) (2019-12-30)

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

## [5.7.18](https://github.com/IBM/kui/compare/v4.5.0...v5.7.18) (2019-12-29)

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

## [5.7.17](https://github.com/IBM/kui/compare/v4.5.0...v5.7.17) (2019-12-28)

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

## [5.7.16](https://github.com/IBM/kui/compare/v4.5.0...v5.7.16) (2019-12-28)

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

## [5.7.15](https://github.com/IBM/kui/compare/v4.5.0...v5.7.15) (2019-12-27)

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

## [5.7.14](https://github.com/IBM/kui/compare/v4.5.0...v5.7.14) (2019-12-27)

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

## [5.7.13](https://github.com/IBM/kui/compare/v4.5.0...v5.7.13) (2019-12-25)

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

## [5.7.12](https://github.com/IBM/kui/compare/v4.5.0...v5.7.12) (2019-12-25)

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

## [5.7.11](https://github.com/IBM/kui/compare/v4.5.0...v5.7.11) (2019-12-24)

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

## [5.7.10](https://github.com/IBM/kui/compare/v4.5.0...v5.7.10) (2019-12-24)

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

## [5.7.9](https://github.com/IBM/kui/compare/v4.5.0...v5.7.9) (2019-12-24)

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

## [5.7.8](https://github.com/IBM/kui/compare/v4.5.0...v5.7.8) (2019-12-23)

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

## [5.7.7](https://github.com/IBM/kui/compare/v4.5.0...v5.7.7) (2019-12-23)

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
