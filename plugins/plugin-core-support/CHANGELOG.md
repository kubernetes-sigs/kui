# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.7.25](https://github.com/IBM/kui/compare/v5.7.24...v5.7.25) (2020-01-08)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [5.7.24](https://github.com/IBM/kui/compare/v4.5.0...v5.7.24) (2020-01-08)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.23](https://github.com/IBM/kui/compare/v4.5.0...v5.7.23) (2020-01-07)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.22](https://github.com/IBM/kui/compare/v4.5.0...v5.7.22) (2020-01-02)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.21](https://github.com/IBM/kui/compare/v4.5.0...v5.7.21) (2019-12-31)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.20](https://github.com/IBM/kui/compare/v4.5.0...v5.7.20) (2019-12-31)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.19](https://github.com/IBM/kui/compare/v4.5.0...v5.7.19) (2019-12-30)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.18](https://github.com/IBM/kui/compare/v4.5.0...v5.7.18) (2019-12-29)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.17](https://github.com/IBM/kui/compare/v4.5.0...v5.7.17) (2019-12-28)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.16](https://github.com/IBM/kui/compare/v4.5.0...v5.7.16) (2019-12-28)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.15](https://github.com/IBM/kui/compare/v4.5.0...v5.7.15) (2019-12-27)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.14](https://github.com/IBM/kui/compare/v4.5.0...v5.7.14) (2019-12-27)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.13](https://github.com/IBM/kui/compare/v4.5.0...v5.7.13) (2019-12-25)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.12](https://github.com/IBM/kui/compare/v4.5.0...v5.7.12) (2019-12-25)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.11](https://github.com/IBM/kui/compare/v4.5.0...v5.7.11) (2019-12-24)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.10](https://github.com/IBM/kui/compare/v4.5.0...v5.7.10) (2019-12-24)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.9](https://github.com/IBM/kui/compare/v4.5.0...v5.7.9) (2019-12-24)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.8](https://github.com/IBM/kui/compare/v4.5.0...v5.7.8) (2019-12-23)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.7](https://github.com/IBM/kui/compare/v4.5.0...v5.7.7) (2019-12-23)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.6](https://github.com/IBM/kui/compare/v4.5.0...v5.7.6) (2019-12-22)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.5](https://github.com/IBM/kui/compare/v4.5.0...v5.7.5) (2019-12-21)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.4](https://github.com/IBM/kui/compare/v4.5.0...v5.7.4) (2019-12-19)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.3](https://github.com/IBM/kui/compare/v4.5.0...v5.7.3) (2019-12-18)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.2](https://github.com/IBM/kui/compare/v4.5.0...v5.7.2) (2019-12-18)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.7.1](https://github.com/IBM/kui/compare/v5.7.0...v5.7.1) (2019-12-17)

**Note:** Version bump only for package @kui-shell/plugin-core-support

# [5.7.0](https://github.com/IBM/kui/compare/v4.5.0...v5.7.0) (2019-12-17)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)

### Features

- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/plugin-core-support
