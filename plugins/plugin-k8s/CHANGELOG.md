# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.4.7](https://github.com/IBM/kui/compare/v4.5.0...v5.4.7) (2019-11-27)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-k8s:** clicking Previous Log Tab in browser issues \_kubectl command in REPL ([de8356b](https://github.com/IBM/kui/commit/de8356b)), closes [#3040](https://github.com/IBM/kui/issues/3040)
- **plugins/plugin-k8s:** fix helm get notes in sidecar ([04c245e](https://github.com/IBM/kui/commit/04c245e))
- some long-standing issues with table display in headless mode ([841d5d3](https://github.com/IBM/kui/commit/841d5d3)), closes [#3034](https://github.com/IBM/kui/issues/3034)
- **plugins/plugin-k8s:** latest and previous logs labels are translated but not externalized ([15cd56f](https://github.com/IBM/kui/commit/15cd56f)), closes [#3038](https://github.com/IBM/kui/issues/3038)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)

### Features

- **packages/core:** default click behavior for tables should not echo to repl ([48618b7](https://github.com/IBM/kui/commit/48618b7)), closes [#3154](https://github.com/IBM/kui/issues/3154)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.4.6](https://github.com/IBM/kui/compare/v4.5.0...v5.4.6) (2019-11-27)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-k8s:** clicking Previous Log Tab in browser issues \_kubectl command in REPL ([de8356b](https://github.com/IBM/kui/commit/de8356b)), closes [#3040](https://github.com/IBM/kui/issues/3040)
- **plugins/plugin-k8s:** fix helm get notes in sidecar ([04c245e](https://github.com/IBM/kui/commit/04c245e))
- some long-standing issues with table display in headless mode ([841d5d3](https://github.com/IBM/kui/commit/841d5d3)), closes [#3034](https://github.com/IBM/kui/issues/3034)
- **plugins/plugin-k8s:** latest and previous logs labels are translated but not externalized ([15cd56f](https://github.com/IBM/kui/commit/15cd56f)), closes [#3038](https://github.com/IBM/kui/issues/3038)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)

### Features

- **packages/core:** default click behavior for tables should not echo to repl ([48618b7](https://github.com/IBM/kui/commit/48618b7)), closes [#3154](https://github.com/IBM/kui/issues/3154)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.4.5](https://github.com/IBM/kui/compare/v4.5.0...v5.4.5) (2019-11-27)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-k8s:** clicking Previous Log Tab in browser issues \_kubectl command in REPL ([de8356b](https://github.com/IBM/kui/commit/de8356b)), closes [#3040](https://github.com/IBM/kui/issues/3040)
- **plugins/plugin-k8s:** fix helm get notes in sidecar ([04c245e](https://github.com/IBM/kui/commit/04c245e))
- some long-standing issues with table display in headless mode ([841d5d3](https://github.com/IBM/kui/commit/841d5d3)), closes [#3034](https://github.com/IBM/kui/issues/3034)
- **plugins/plugin-k8s:** latest and previous logs labels are translated but not externalized ([15cd56f](https://github.com/IBM/kui/commit/15cd56f)), closes [#3038](https://github.com/IBM/kui/issues/3038)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)

### Features

- **packages/core:** default click behavior for tables should not echo to repl ([48618b7](https://github.com/IBM/kui/commit/48618b7)), closes [#3154](https://github.com/IBM/kui/issues/3154)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.4.4](https://github.com/IBM/kui/compare/v4.5.0...v5.4.4) (2019-11-25)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-k8s:** clicking Previous Log Tab in browser issues \_kubectl command in REPL ([de8356b](https://github.com/IBM/kui/commit/de8356b)), closes [#3040](https://github.com/IBM/kui/issues/3040)
- **plugins/plugin-k8s:** fix helm get notes in sidecar ([04c245e](https://github.com/IBM/kui/commit/04c245e))
- some long-standing issues with table display in headless mode ([841d5d3](https://github.com/IBM/kui/commit/841d5d3)), closes [#3034](https://github.com/IBM/kui/issues/3034)
- **plugins/plugin-k8s:** latest and previous logs labels are translated but not externalized ([15cd56f](https://github.com/IBM/kui/commit/15cd56f)), closes [#3038](https://github.com/IBM/kui/issues/3038)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)

### Features

- **packages/core:** default click behavior for tables should not echo to repl ([48618b7](https://github.com/IBM/kui/commit/48618b7)), closes [#3154](https://github.com/IBM/kui/issues/3154)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.4.3](https://github.com/IBM/kui/compare/v4.5.0...v5.4.3) (2019-11-25)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-k8s:** clicking Previous Log Tab in browser issues \_kubectl command in REPL ([de8356b](https://github.com/IBM/kui/commit/de8356b)), closes [#3040](https://github.com/IBM/kui/issues/3040)
- **plugins/plugin-k8s:** fix helm get notes in sidecar ([04c245e](https://github.com/IBM/kui/commit/04c245e))
- some long-standing issues with table display in headless mode ([841d5d3](https://github.com/IBM/kui/commit/841d5d3)), closes [#3034](https://github.com/IBM/kui/issues/3034)
- **plugins/plugin-k8s:** latest and previous logs labels are translated but not externalized ([15cd56f](https://github.com/IBM/kui/commit/15cd56f)), closes [#3038](https://github.com/IBM/kui/issues/3038)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)

### Features

- **packages/core:** default click behavior for tables should not echo to repl ([48618b7](https://github.com/IBM/kui/commit/48618b7)), closes [#3154](https://github.com/IBM/kui/issues/3154)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.4.2](https://github.com/IBM/kui/compare/v4.5.0...v5.4.2) (2019-11-24)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-k8s:** clicking Previous Log Tab in browser issues \_kubectl command in REPL ([de8356b](https://github.com/IBM/kui/commit/de8356b)), closes [#3040](https://github.com/IBM/kui/issues/3040)
- **plugins/plugin-k8s:** fix helm get notes in sidecar ([04c245e](https://github.com/IBM/kui/commit/04c245e))
- some long-standing issues with table display in headless mode ([841d5d3](https://github.com/IBM/kui/commit/841d5d3)), closes [#3034](https://github.com/IBM/kui/issues/3034)
- **plugins/plugin-k8s:** latest and previous logs labels are translated but not externalized ([15cd56f](https://github.com/IBM/kui/commit/15cd56f)), closes [#3038](https://github.com/IBM/kui/issues/3038)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)

### Features

- **packages/core:** default click behavior for tables should not echo to repl ([48618b7](https://github.com/IBM/kui/commit/48618b7)), closes [#3154](https://github.com/IBM/kui/issues/3154)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [5.4.1](https://github.com/IBM/kui/compare/v5.4.0...v5.4.1) (2019-11-24)

**Note:** Version bump only for package @kui-shell/plugin-k8s

# [5.4.0](https://github.com/IBM/kui/compare/v4.5.0...v5.4.0) (2019-11-24)

### Bug Fixes

- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-k8s:** clicking Previous Log Tab in browser issues \_kubectl command in REPL ([de8356b](https://github.com/IBM/kui/commit/de8356b)), closes [#3040](https://github.com/IBM/kui/issues/3040)
- **plugins/plugin-k8s:** fix helm get notes in sidecar ([04c245e](https://github.com/IBM/kui/commit/04c245e))
- some long-standing issues with table display in headless mode ([841d5d3](https://github.com/IBM/kui/commit/841d5d3)), closes [#3034](https://github.com/IBM/kui/issues/3034)
- **plugins/plugin-k8s:** latest and previous logs labels are translated but not externalized ([15cd56f](https://github.com/IBM/kui/commit/15cd56f)), closes [#3038](https://github.com/IBM/kui/issues/3038)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- remove k8s command prefix for kube commands ([3c53806](https://github.com/IBM/kui/commit/3c53806)), closes [#3008](https://github.com/IBM/kui/issues/3008)

### Features

- **packages/core:** default click behavior for tables should not echo to repl ([48618b7](https://github.com/IBM/kui/commit/48618b7)), closes [#3154](https://github.com/IBM/kui/issues/3154)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/plugin-k8s
