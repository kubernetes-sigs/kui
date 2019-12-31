# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.7.20](https://github.com/IBM/kui/compare/v4.5.0...v5.7.20) (2019-12-31)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [5.7.19](https://github.com/IBM/kui/compare/v4.5.0...v5.7.19) (2019-12-30)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [5.7.18](https://github.com/IBM/kui/compare/v4.5.0...v5.7.18) (2019-12-29)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [5.7.17](https://github.com/IBM/kui/compare/v4.5.0...v5.7.17) (2019-12-28)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.16](https://github.com/IBM/kui/compare/v4.5.0...v5.7.16) (2019-12-28)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.15](https://github.com/IBM/kui/compare/v4.5.0...v5.7.15) (2019-12-27)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.14](https://github.com/IBM/kui/compare/v4.5.0...v5.7.14) (2019-12-27)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.13](https://github.com/IBM/kui/compare/v4.5.0...v5.7.13) (2019-12-25)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.12](https://github.com/IBM/kui/compare/v4.5.0...v5.7.12) (2019-12-25)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.11](https://github.com/IBM/kui/compare/v4.5.0...v5.7.11) (2019-12-24)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.10](https://github.com/IBM/kui/compare/v4.5.0...v5.7.10) (2019-12-24)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.9](https://github.com/IBM/kui/compare/v4.5.0...v5.7.9) (2019-12-24)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.8](https://github.com/IBM/kui/compare/v4.5.0...v5.7.8) (2019-12-23)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.7](https://github.com/IBM/kui/compare/v4.5.0...v5.7.7) (2019-12-23)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.6](https://github.com/IBM/kui/compare/v4.5.0...v5.7.6) (2019-12-22)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.5](https://github.com/IBM/kui/compare/v4.5.0...v5.7.5) (2019-12-21)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.4](https://github.com/IBM/kui/compare/v4.5.0...v5.7.4) (2019-12-19)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- **packages/webpack:** electron packager versus node-pty binaries ([5397577](https://github.com/IBM/kui/commit/5397577)), closes [#3381](https://github.com/IBM/kui/issues/3381)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.3](https://github.com/IBM/kui/compare/v4.5.0...v5.7.3) (2019-12-18)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.2](https://github.com/IBM/kui/compare/v4.5.0...v5.7.2) (2019-12-18)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

## [5.7.1](https://github.com/IBM/kui/compare/v5.7.0...v5.7.1) (2019-12-17)

**Note:** Version bump only for package @kui-shell/builder

# [5.7.0](https://github.com/IBM/kui/compare/v4.5.0...v5.7.0) (2019-12-17)

### Bug Fixes

- another attempt to not-modify a package-lock.json ([70ea4ea](https://github.com/IBM/kui/commit/70ea4ea)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- collect codecov for plugin assembler ([7a0a48c](https://github.com/IBM/kui/commit/7a0a48c)), closes [#3284](https://github.com/IBM/kui/issues/3284)
- **packages/builder:** electron builder versus external clients ([cbc1d37](https://github.com/IBM/kui/commit/cbc1d37)), closes [#3119](https://github.com/IBM/kui/issues/3119)
- electron cross-builds for win32 on linux hosts do not avoid asar ([f4adf00](https://github.com/IBM/kui/commit/f4adf00)), closes [#3336](https://github.com/IBM/kui/issues/3336)
- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/IBM/kui/commit/b9ddcd1)), closes [#3059](https://github.com/IBM/kui/issues/3059) [#3061](https://github.com/IBM/kui/issues/3061)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- improve plugin install ([67e007c](https://github.com/IBM/kui/commit/67e007c)), closes [#3057](https://github.com/IBM/kui/issues/3057)
- **packages/builder:** improve color contrast of about in Dark theme ([2e1b2f8](https://github.com/IBM/kui/commit/2e1b2f8)), closes [#3301](https://github.com/IBM/kui/issues/3301)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- **packages/core:** update sidecar tables to match [#3037](https://github.com/IBM/kui/issues/3037) ([4329e24](https://github.com/IBM/kui/commit/4329e24)), closes [#3045](https://github.com/IBM/kui/issues/3045)
- mkclient.sh failed with tsc error ([bb6b706](https://github.com/IBM/kui/commit/bb6b706)), closes [#3146](https://github.com/IBM/kui/issues/3146)
- Red error text contrast issue in Carbon 90 theme ([86a86ed](https://github.com/IBM/kui/commit/86a86ed)), closes [#FF767](https://github.com/IBM/kui/issues/FF767) [#3096](https://github.com/IBM/kui/issues/3096)
- **packages/builder:** linux packaging issues ([cb9da09](https://github.com/IBM/kui/commit/cb9da09)), closes [#2968](https://github.com/IBM/kui/issues/2968)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)
- remove package-lock from publishers/s3 ([4a9d7a1](https://github.com/IBM/kui/commit/4a9d7a1)), closes [#3205](https://github.com/IBM/kui/issues/3205)
- tomorrow night theme should use blue for table names ([0e3315d](https://github.com/IBM/kui/commit/0e3315d)), closes [#3102](https://github.com/IBM/kui/issues/3102)
- **packages/builder:** support cross-builds of electron clients ([27b5b8f](https://github.com/IBM/kui/commit/27b5b8f)), closes [#3304](https://github.com/IBM/kui/issues/3304)
- use carbon gray10 as default theme for clients/base ([b5d277d](https://github.com/IBM/kui/commit/b5d277d)), closes [#3054](https://github.com/IBM/kui/issues/3054)
- wrong colors (Gray90 and Red50) in Carbon-90 theme ([e319783](https://github.com/IBM/kui/commit/e319783)), closes [#3157](https://github.com/IBM/kui/issues/3157)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- **packages/builder:** add removeComments:true to tsconfig-base.json ([2e14274](https://github.com/IBM/kui/commit/2e14274)), closes [#2975](https://github.com/IBM/kui/issues/2975)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/builder:** kui-compile should allow specifying a tsconfig ([c0eb201](https://github.com/IBM/kui/commit/c0eb201)), closes [#3353](https://github.com/IBM/kui/issues/3353)

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
