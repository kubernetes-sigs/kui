# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.5.0](https://github.com/IBM/kui/compare/v4.4.0...v4.5.0) (2019-09-22)

### Bug Fixes

- **plugins/plugin-core-support:** code issues with microsoft edge ([316da30](https://github.com/IBM/kui/commit/316da30)), closes [#2811](https://github.com/IBM/kui/issues/2811)
- remove sidecar secondary content ([71ab198](https://github.com/IBM/kui/commit/71ab198))
- **packages/app:** font zooming in clients/alternate does not affect tables ([66476b9](https://github.com/IBM/kui/commit/66476b9)), closes [#2726](https://github.com/IBM/kui/issues/2726)
- **packages/app:** on mac electron builds, cwd and PWD mismatch ([97f94f5](https://github.com/IBM/kui/commit/97f94f5)), closes [#2752](https://github.com/IBM/kui/issues/2752)
- **packages/app:** remove top-tab-stripe-alt.css link ([39a1886](https://github.com/IBM/kui/commit/39a1886)), closes [#2735](https://github.com/IBM/kui/issues/2735) [#2750](https://github.com/IBM/kui/issues/2750)
- **packages/app:** set icon on linux ([ce76708](https://github.com/IBM/kui/commit/ce76708)), closes [#1248](https://github.com/IBM/kui/issues/1248)
- **packages/app:** Sidecar not showing content when it's opened in the full-screen mode ([e94dde7](https://github.com/IBM/kui/commit/e94dde7)), closes [#2788](https://github.com/IBM/kui/issues/2788)
- **packages/app:** top-tab-stripe-alt rules are too sticky ([1a03390](https://github.com/IBM/kui/commit/1a03390)), closes [#2791](https://github.com/IBM/kui/issues/2791)
- **packages/kui-builder:** allow custom clients to provide tsconfig overrides ([2d75764](https://github.com/IBM/kui/commit/2d75764)), closes [#2801](https://github.com/IBM/kui/issues/2801)
- **packages/kui-builder:** carbon gray 90 versus highlightjs ([fda3530](https://github.com/IBM/kui/commit/fda3530)), closes [#2774](https://github.com/IBM/kui/issues/2774)
- **packages/kui-builder:** external clients versus nodejs 12 ([f9b74ac](https://github.com/IBM/kui/commit/f9b74ac)), closes [#2785](https://github.com/IBM/kui/issues/2785)
- **packages/kui-builder:** sidecar table text bugs in carbon-gray10 ([139ff9a](https://github.com/IBM/kui/commit/139ff9a)), closes [#2772](https://github.com/IBM/kui/issues/2772)
- **plugins-plugin-core-support:** theme bootstrapping assumes document is defined ([15484e7](https://github.com/IBM/kui/commit/15484e7)), closes [#2740](https://github.com/IBM/kui/issues/2740)
- **plugins/plugin-bash-like:** decrease usage of ascii-to-table in pty ([9836ab8](https://github.com/IBM/kui/commit/9836ab8)), closes [#2745](https://github.com/IBM/kui/issues/2745)
- **plugins/plugin-bash-like:** expand env prefetching to support macos dock launches ([f9c85bf](https://github.com/IBM/kui/commit/f9c85bf)), closes [#2762](https://github.com/IBM/kui/issues/2762)
- **plugins/plugin-bash-like:** pty bold font-weight is lost on exit ([4899d55](https://github.com/IBM/kui/commit/4899d55)), closes [#2746](https://github.com/IBM/kui/issues/2746)
- **plugins/plugin-core-support:** error initializing themes ([d84d7d7](https://github.com/IBM/kui/commit/d84d7d7)), closes [#2766](https://github.com/IBM/kui/issues/2766)
- **plugins/plugin-core-support:** increase default maxWatchersPerTab from 2 to 6 ([e05b6cf](https://github.com/IBM/kui/commit/e05b6cf)), closes [#2754](https://github.com/IBM/kui/issues/2754)
- **plugins/plugin-core-support:** theme set on reload fails to use custom css ([e60683b](https://github.com/IBM/kui/commit/e60683b)), closes [#2742](https://github.com/IBM/kui/issues/2742)
- **plugins/plugin-editor:** don't use "i18n" as the name of a top-level directory ([04bd5f1](https://github.com/IBM/kui/commit/04bd5f1)), closes [#2795](https://github.com/IBM/kui/issues/2795)
- **plugins/plugin-editor:** update the Monaco editor layout since we got rid of the transition effect of sidecar resizing ([a355a80](https://github.com/IBM/kui/commit/a355a80)), closes [#2807](https://github.com/IBM/kui/issues/2807)
- **plugins/plugin-k8s:** don't fail if plugin-core-support unavailable ([080a95d](https://github.com/IBM/kui/commit/080a95d)), closes [#2793](https://github.com/IBM/kui/issues/2793)
- **plugins/plugin-operator-framework:** disable "remembered" config ([ec00aee](https://github.com/IBM/kui/commit/ec00aee)), closes [#2804](https://github.com/IBM/kui/issues/2804)
- default to Light tables ([72ad63a](https://github.com/IBM/kui/commit/72ad63a)), closes [#2798](https://github.com/IBM/kui/issues/2798)
- lerna publish should prune away untracked files ([50e8b35](https://github.com/IBM/kui/commit/50e8b35)), closes [#2735](https://github.com/IBM/kui/issues/2735)
- make yargs-parser dependences explicit ([d080f16](https://github.com/IBM/kui/commit/d080f16)), closes [#2789](https://github.com/IBM/kui/issues/2789)
- more attempts to get lerna publish to work in travis ([f134763](https://github.com/IBM/kui/commit/f134763)), closes [#2735](https://github.com/IBM/kui/issues/2735)
- no horizontal scrolling for wide table ([e9e9564](https://github.com/IBM/kui/commit/e9e9564)), closes [#2778](https://github.com/IBM/kui/issues/2778)
- sidecar color fixes to accommodate sidecar dark/repl light themes ([208da06](https://github.com/IBM/kui/commit/208da06)), closes [#2783](https://github.com/IBM/kui/issues/2783)
- **plugins/plugin-editor:** editor font size does not respect current font size ([608b539](https://github.com/IBM/kui/commit/608b539)), closes [#1565](https://github.com/IBM/kui/issues/1565)
- **plugins/plugin-k8s:** `k get resource -w` doesn't error out for `resource not found` ([a9e5c67](https://github.com/IBM/kui/commit/a9e5c67)), closes [#2731](https://github.com/IBM/kui/issues/2731)
- **plugins/plugin-k8s:** `kubectl get pods -w -w` hangs, `k -w get pods` does not fail ([43374a5](https://github.com/IBM/kui/commit/43374a5)), closes [#2721](https://github.com/IBM/kui/issues/2721) [#2718](https://github.com/IBM/kui/issues/2718)
- **plugins/plugin-k8s:** commands resulting in an empty watch table fail to watch for updates ([c40546f](https://github.com/IBM/kui/commit/c40546f)), closes [#2737](https://github.com/IBM/kui/issues/2737)
- **plugins/plugin-k8s:** remove k8s conditions tab ([46e26e1](https://github.com/IBM/kui/commit/46e26e1)), closes [#2776](https://github.com/IBM/kui/issues/2776)
- **plugins/plugin-k8s:** remove use of old KUBECONFIG inference logic ([74d6c56](https://github.com/IBM/kui/commit/74d6c56)), closes [#2761](https://github.com/IBM/kui/issues/2761)
- **plugins/plugin-tekton:** improve tekton preview support for webpack ([fc4688a](https://github.com/IBM/kui/commit/fc4688a)), closes [#1849](https://github.com/IBM/kui/issues/1849)
- improve zh_CN translation content in plugin-core-support and plugin-k8s ([ebdb3f9](https://github.com/IBM/kui/commit/ebdb3f9)), closes [#2700](https://github.com/IBM/kui/issues/2700)
- travis CD still does not remove all unstaged files ([eeee8ef](https://github.com/IBM/kui/commit/eeee8ef)), closes [#2735](https://github.com/IBM/kui/issues/2735)
- undo git clean in travis.yml ([7d85f2f](https://github.com/IBM/kui/commit/7d85f2f)), closes [#2735](https://github.com/IBM/kui/issues/2735)

### Features

- **plugins/plugin-k8s:** add Events tab for kube resources ([8387575](https://github.com/IBM/kui/commit/8387575)), closes [#2438](https://github.com/IBM/kui/issues/2438)
- **plugins/plugin-k8s:** improve sidecar events table ([a310f6b](https://github.com/IBM/kui/commit/a310f6b)), closes [#2800](https://github.com/IBM/kui/issues/2800)

Please refer to the separate CHANGELOG.md for each [package](packages) and [plugin](plugins).
