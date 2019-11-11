# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.2.32](https://github.com/IBM/kui/compare/v5.2.31...v5.2.32) (2019-11-11)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.31](https://github.com/IBM/kui/compare/v5.2.30...v5.2.31) (2019-11-11)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.30](https://github.com/IBM/kui/compare/v4.5.0...v5.2.30) (2019-11-09)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.29](https://github.com/IBM/kui/compare/v4.5.0...v5.2.29) (2019-11-07)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.28](https://github.com/IBM/kui/compare/v5.2.27...v5.2.28) (2019-11-07)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.27](https://github.com/IBM/kui/compare/v5.2.26...v5.2.27) (2019-11-07)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.26](https://github.com/IBM/kui/compare/v4.5.0...v5.2.26) (2019-11-07)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.25](https://github.com/IBM/kui/compare/v4.5.0...v5.2.25) (2019-11-06)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.24](https://github.com/IBM/kui/compare/v5.2.23...v5.2.24) (2019-11-02)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.23](https://github.com/IBM/kui/compare/v5.2.22...v5.2.23) (2019-11-02)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.22](https://github.com/IBM/kui/compare/v4.5.0...v5.2.22) (2019-11-02)

### Bug Fixes

- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.21](https://github.com/IBM/kui/compare/v4.5.0...v5.2.21) (2019-10-30)

### Bug Fixes

- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.20](https://github.com/IBM/kui/compare/v5.2.19...v5.2.20) (2019-10-30)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.19](https://github.com/IBM/kui/compare/v4.5.0...v5.2.19) (2019-10-30)

### Bug Fixes

- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.18](https://github.com/IBM/kui/compare/v4.5.0...v5.2.18) (2019-10-30)

### Bug Fixes

- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.17](https://github.com/IBM/kui/compare/v5.2.16...v5.2.17) (2019-10-29)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.16](https://github.com/IBM/kui/compare/v4.5.0...v5.2.16) (2019-10-29)

### Bug Fixes

- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.15](https://github.com/IBM/kui/compare/v4.5.0...v5.2.15) (2019-10-28)

### Bug Fixes

- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.14](https://github.com/IBM/kui/compare/v5.2.13...v5.2.14) (2019-10-28)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.13](https://github.com/IBM/kui/compare/v5.2.12...v5.2.13) (2019-10-28)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.12](https://github.com/IBM/kui/compare/v4.5.0...v5.2.12) (2019-10-28)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.11](https://github.com/IBM/kui/compare/v4.5.0...v5.2.11) (2019-10-28)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.10](https://github.com/IBM/kui/compare/v5.2.9...v5.2.10) (2019-10-26)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.9](https://github.com/IBM/kui/compare/v4.5.0...v5.2.9) (2019-10-26)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.8](https://github.com/IBM/kui/compare/v4.5.0...v5.2.8) (2019-10-26)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.7](https://github.com/IBM/kui/compare/v5.2.6...v5.2.7) (2019-10-25)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.6](https://github.com/IBM/kui/compare/v4.5.0...v5.2.6) (2019-10-25)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.5](https://github.com/IBM/kui/compare/v4.5.0...v5.2.5) (2019-10-25)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.4](https://github.com/IBM/kui/compare/v4.5.0...v5.2.4) (2019-10-24)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.3](https://github.com/IBM/kui/compare/v5.2.2...v5.2.3) (2019-10-24)

**Note:** Version bump only for package @kui-shell/builder

## [5.2.2](https://github.com/IBM/kui/compare/v4.5.0...v5.2.2) (2019-10-24)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

## [5.2.1](https://github.com/IBM/kui/compare/v5.2.0...v5.2.1) (2019-10-23)

### Bug Fixes

- improve plugin install ([c51dc8b](https://github.com/IBM/kui/commit/c51dc8b)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- remove k8s command prefix for kube commands ([269e69b](https://github.com/IBM/kui/commit/269e69b)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- use carbon gray10 as default theme for clients/base ([62cb021](https://github.com/IBM/kui/commit/62cb021)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([0ffcb4a](https://github.com/IBM/kui/commit/0ffcb4a)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([fdd1d7c](https://github.com/IBM/kui/commit/fdd1d7c)), closes [#3045](https://github.com/IBM/kui/issues/3045)

### Features

- extend MultiModalResponse to support functions that produce content ([bfb9757](https://github.com/IBM/kui/commit/bfb9757)), closes [#3022](https://github.com/IBM/kui/issues/3022)

# [5.2.0](https://github.com/IBM/kui/compare/v4.5.0...v5.2.0) (2019-10-14)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

### Bug Fixes

- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)

### Features

- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
