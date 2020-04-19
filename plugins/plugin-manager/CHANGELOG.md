# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** improve sidecar button behavior ([80c00fe](https://github.com/IBM/kui/commit/80c00fe)), closes [#3165](https://github.com/IBM/kui/issues/3165) [#3166](https://github.com/IBM/kui/issues/3166)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Bug Fixes

- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/plugin-manager
