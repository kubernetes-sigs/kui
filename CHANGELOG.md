# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.5.12](https://github.com/IBM/kui/compare/v10.5.11...v10.5.12) (2021-09-23)

### Bug Fixes

- **plugins/plugin-s3:** ibm s3 tmp and bin bind mounts do not handle switching instances within a region ([3532d4b](https://github.com/IBM/kui/commit/3532d4b)), closes [#8051](https://github.com/IBM/kui/issues/8051)

### Features

- **packages/proxy:** dockerized kui hard-wires ContentSecurityPolicy ([89988b1](https://github.com/IBM/kui/commit/89988b1)), closes [#8055](https://github.com/IBM/kui/issues/8055)
- **plugins/plugin-core-support:** up command should offer to check for a valid kubeconfig ([38b346f](https://github.com/IBM/kui/commit/38b346f)), closes [#8053](https://github.com/IBM/kui/issues/8053)

## [10.5.11](https://github.com/IBM/kui/compare/v10.5.10...v10.5.11) (2021-09-22)

### Features

- **plugins/plugin-carbon-themes:** use plex fonts via google font CDN ([9c3b390](https://github.com/IBM/kui/commit/9c3b390)), closes [#8048](https://github.com/IBM/kui/issues/8048)
- **plugins/plugin-s3:** when copying to a public s3 bucket, use the bucket url, not the generic one ([5d5ac1e](https://github.com/IBM/kui/commit/5d5ac1e)), closes [#8046](https://github.com/IBM/kui/issues/8046)

## [10.5.10](https://github.com/IBM/kui/compare/v10.5.9...v10.5.10) (2021-09-22)

### Bug Fixes

- **plugins/plugin-client-common:** improve block rerun UI ([5e34fdf](https://github.com/IBM/kui/commit/5e34fdf)), closes [#8025](https://github.com/IBM/kui/issues/8025)
- **plugins/plugin-client-common:** leftover debugging in Block/index.tsx ([03965db](https://github.com/IBM/kui/commit/03965db)), closes [#8041](https://github.com/IBM/kui/issues/8041)

## [10.5.9](https://github.com/IBM/kui/compare/v10.5.8...v10.5.9) (2021-09-21)

### Bug Fixes

- **packages/webpack:** update headless webpack config to new IgnorePlugin schema enforcement ([f7f8f27](https://github.com/IBM/kui/commit/f7f8f27)), closes [#8032](https://github.com/IBM/kui/issues/8032)
- **plugins/plugin-client-common:** leftover debugging in Editor component ([0ff7b95](https://github.com/IBM/kui/commit/0ff7b95)), closes [#8037](https://github.com/IBM/kui/issues/8037)
- **plugins/plugin-client-common:** Loading for proxied clients is now centered ([104c31e](https://github.com/IBM/kui/commit/104c31e)), closes [#8034](https://github.com/IBM/kui/issues/8034)
- **plugins/plugin-client-common:** when proxy disconnects, all terminal state is lost ([73285c6](https://github.com/IBM/kui/commit/73285c6)), closes [#8030](https://github.com/IBM/kui/issues/8030)

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
