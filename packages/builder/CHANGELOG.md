# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.5.0](https://github.com/IBM/kui/compare/v4.5.0...v5.5.0) (2019-11-29)

### Bug Fixes

- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)

### Features

- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)

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
