# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/plugin-core-support
