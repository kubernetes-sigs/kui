# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.5.8](https://github.com/IBM/kui/compare/v10.5.7...v10.5.8) (2021-09-21)

### Bug Fixes

- **plugins/plugin-client-common:** monaco folding overlay is not always very visible ([3b3dac4](https://github.com/IBM/kui/commit/3b3dac4)), closes [#8022](https://github.com/IBM/kui/issues/8022)
- **plugins/plugin-s3:** rm -rf fails for s3 buckets with incomplete uploads ([b7c94e4](https://github.com/IBM/kui/commit/b7c94e4)), closes [#8026](https://github.com/IBM/kui/issues/8026)

## [10.5.7](https://github.com/IBM/kui/compare/v10.5.6...v10.5.7) (2021-09-20)

### Bug Fixes

- **plugins/plugin-client-common:** In sidecar, hover effect for buttons can have low contrast in certain themes. ([dda93de](https://github.com/IBM/kui/commit/dda93de)), closes [#8019](https://github.com/IBM/kui/issues/8019)

## [10.5.6](https://github.com/IBM/kui/compare/v10.5.5...v10.5.6) (2021-09-17)

### Bug Fixes

- **plugins/plugin-client-common:** Editor component does not respond to sidecar resizing ([d890245](https://github.com/IBM/kui/commit/d890245)), closes [#8007](https://github.com/IBM/kui/issues/8007)
- **plugins/plugin-client-common:** SequenceDiagram bars sometimes lack left-offset ([f78b0fb](https://github.com/IBM/kui/commit/f78b0fb))
- **plugins/plugin-client-common:** sidecar tab overflow buttons have low contrast ([6a64a85](https://github.com/IBM/kui/commit/6a64a85)), closes [#8017](https://github.com/IBM/kui/issues/8017)
- **plugins/plugin-kubectl:** involved object button shows up in the wrong place ([09ddae4](https://github.com/IBM/kui/commit/09ddae4)), closes [#8013](https://github.com/IBM/kui/issues/8013)

### Features

- **plugins/plugin-client-common:** Editor component should default to a fold depth of 2 ([88c9b69](https://github.com/IBM/kui/commit/88c9b69)), closes [#8008](https://github.com/IBM/kui/issues/8008)
- **plugins/plugin-kubectl:** Add Annotations and Labels tabs for kube resources ([b722f71](https://github.com/IBM/kui/commit/b722f71)), closes [#8009](https://github.com/IBM/kui/issues/8009)

## [10.5.5](https://github.com/IBM/kui/compare/v10.5.4...v10.5.5) (2021-09-15)

### Bug Fixes

- **plugins/plugin-kubectl:** k delete via API does not properly handle proxy errors ([e5106e3](https://github.com/IBM/kui/commit/e5106e3)), closes [#8004](https://github.com/IBM/kui/issues/8004)
- **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([1990caa](https://github.com/IBM/kui/commit/1990caa)), closes [#7996](https://github.com/IBM/kui/issues/7996)

### Features

- **packages/proxy:** add iter8ctl to the docker base image ([435745e](https://github.com/IBM/kui/commit/435745e)), closes [#8000](https://github.com/IBM/kui/issues/8000)

## [10.5.4](https://github.com/IBM/kui/compare/v10.5.3...v10.5.4) (2021-09-15)

### Bug Fixes

- sidecar contrast issues ([afa6e76](https://github.com/IBM/kui/commit/afa6e76)), closes [#7993](https://github.com/IBM/kui/issues/7993)

## [10.5.3](https://github.com/IBM/kui/compare/v10.5.2...v10.5.3) (2021-09-14)

### Bug Fixes

- **plugins/plugin-kubectl:** Adding logs tab to some Kubernetes resources ([ec86a6b](https://github.com/IBM/kui/commit/ec86a6b))
