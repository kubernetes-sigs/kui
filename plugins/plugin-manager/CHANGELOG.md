# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.2.16](https://github.com/IBM/kui/compare/v4.5.0...v5.2.16) (2019-10-29)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.15](https://github.com/IBM/kui/compare/v4.5.0...v5.2.15) (2019-10-28)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.14](https://github.com/IBM/kui/compare/v5.2.13...v5.2.14) (2019-10-28)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [5.2.13](https://github.com/IBM/kui/compare/v5.2.12...v5.2.13) (2019-10-28)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [5.2.12](https://github.com/IBM/kui/compare/v4.5.0...v5.2.12) (2019-10-28)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.11](https://github.com/IBM/kui/compare/v4.5.0...v5.2.11) (2019-10-28)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.10](https://github.com/IBM/kui/compare/v5.2.9...v5.2.10) (2019-10-26)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [5.2.9](https://github.com/IBM/kui/compare/v4.5.0...v5.2.9) (2019-10-26)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.8](https://github.com/IBM/kui/compare/v4.5.0...v5.2.8) (2019-10-26)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.7](https://github.com/IBM/kui/compare/v5.2.6...v5.2.7) (2019-10-25)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [5.2.6](https://github.com/IBM/kui/compare/v4.5.0...v5.2.6) (2019-10-25)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.5](https://github.com/IBM/kui/compare/v4.5.0...v5.2.5) (2019-10-25)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** REPL UI should emit "ok" for multimodalresponse ([1015520](https://github.com/IBM/kui/commit/1015520)), closes [#3100](https://github.com/IBM/kui/issues/3100)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.4](https://github.com/IBM/kui/compare/v4.5.0...v5.2.4) (2019-10-24)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.3](https://github.com/IBM/kui/compare/v5.2.2...v5.2.3) (2019-10-24)

**Note:** Version bump only for package @kui-shell/plugin-manager

## [5.2.2](https://github.com/IBM/kui/compare/v4.5.0...v5.2.2) (2019-10-24)

### Bug Fixes

- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([6932f9b](https://github.com/IBM/kui/commit/6932f9b)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([2df4027](https://github.com/IBM/kui/commit/2df4027)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([3da0e44](https://github.com/IBM/kui/commit/3da0e44)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([05db532](https://github.com/IBM/kui/commit/05db532)), closes [#3024](https://github.com/IBM/kui/issues/3024)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should pull commandContext from package.json ([67a5683](https://github.com/IBM/kui/commit/67a5683)), closes [#3083](https://github.com/IBM/kui/issues/3083)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

## [5.2.1](https://github.com/IBM/kui/compare/v5.2.0...v5.2.1) (2019-10-23)

### Bug Fixes

- improve plugin install ([c51dc8b](https://github.com/IBM/kui/commit/c51dc8b)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([0ffcb4a](https://github.com/IBM/kui/commit/0ffcb4a)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **plugins/plugin-manager:** minor alignment issue with ora checkmarks ([9a9a0a3](https://github.com/IBM/kui/commit/9a9a0a3)), closes [#3032](https://github.com/IBM/kui/issues/3032)
- **plugins/plugin-manager:** plugin install fails if symlink does not exist ([a42d9f5](https://github.com/IBM/kui/commit/a42d9f5)), closes [#3062](https://github.com/IBM/kui/issues/3062)
- **plugins/plugin-manager:** use ora for plugin remove ([4a3af86](https://github.com/IBM/kui/commit/4a3af86)), closes [#3029](https://github.com/IBM/kui/issues/3029) [#3028](https://github.com/IBM/kui/issues/3028)

### Features

- extend MultiModalResponse to support functions that produce content ([bfb9757](https://github.com/IBM/kui/commit/bfb9757)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- plugin install should offer a spinner ([f1a24c6](https://github.com/IBM/kui/commit/f1a24c6)), closes [#3024](https://github.com/IBM/kui/issues/3024)

# [5.2.0](https://github.com/IBM/kui/compare/v4.5.0...v5.2.0) (2019-10-14)

### Bug Fixes

- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

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
