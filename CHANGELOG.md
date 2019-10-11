# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Bug Fixes

- **packages/builder:** carbon gray 10 popup input font color too dark ([b7b39e3](https://github.com/IBM/kui/commit/b7b39e3)), closes [#2930](https://github.com/IBM/kui/issues/2930)
- **packages/core:** commands for plugin didn't handle no-usage case ([9ffa5d9](https://github.com/IBM/kui/commit/9ffa5d9)), closes [#2949](https://github.com/IBM/kui/issues/2949)
- **packages/core:** Commands.Registrar.synonym should have the options as optional ([0882ab2](https://github.com/IBM/kui/commit/0882ab2)), closes [#2909](https://github.com/IBM/kui/issues/2909)
- **packages/core:** debug rather than console.error on plugin scanner retry ([27f41e0](https://github.com/IBM/kui/commit/27f41e0)), closes [#2958](https://github.com/IBM/kui/issues/2958)
- **packages/core:** in popup mode, sidecar screenshot and close button too small ([5fa0d97](https://github.com/IBM/kui/commit/5fa0d97)), closes [#2932](https://github.com/IBM/kui/issues/2932)
- **packages/core:** kui hangs with command registered as subtree without usage ([0fc14d4](https://github.com/IBM/kui/commit/0fc14d4)), closes [#2954](https://github.com/IBM/kui/issues/2954)
- **packages/core:** popup spinner is tiny ([8e813f6](https://github.com/IBM/kui/commit/8e813f6)), closes [#2947](https://github.com/IBM/kui/issues/2947)
- **packages/core:** sidecar plain text handler should not use normal-text css class ([de82cf4](https://github.com/IBM/kui/commit/de82cf4)), closes [#2907](https://github.com/IBM/kui/issues/2907)
- **packages/core:** undefined window title in popup mode ([b2538a1](https://github.com/IBM/kui/commit/b2538a1)), closes [#2943](https://github.com/IBM/kui/issues/2943)
- **plugins/plugin-apache-composer:** let.js demo versus safari ([dea7610](https://github.com/IBM/kui/commit/dea7610)), closes [#2820](https://github.com/IBM/kui/issues/2820)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)
- **plugins/plugin-openwhisk:** missing wsk prefix to auth switch ([9867189](https://github.com/IBM/kui/commit/9867189)), closes [#2872](https://github.com/IBM/kui/issues/2872)
- drilldown bugs in openwhisk trace view ([9185585](https://github.com/IBM/kui/commit/9185585)), closes [#2874](https://github.com/IBM/kui/issues/2874)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- setup-webhook out of date ([f6ffcd1](https://github.com/IBM/kui/commit/f6ffcd1)), closes [#2843](https://github.com/IBM/kui/issues/2843)
- update kui-base dependencies to 5.0.0 ([f7d429d](https://github.com/IBM/kui/commit/f7d429d)), closes [#2928](https://github.com/IBM/kui/issues/2928)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- **packages/core:** improve API for providing sidecar entity content ([4613d1c](https://github.com/IBM/kui/commit/4613d1c)), closes [#2911](https://github.com/IBM/kui/issues/2911)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- kui-base including core and plugin-core-support only ([7df5fd7](https://github.com/IBM/kui/commit/7df5fd7)), closes [#2919](https://github.com/IBM/kui/issues/2919)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)
- publish kui-base electron distributions ([ab56847](https://github.com/IBM/kui/commit/ab56847)), closes [#2939](https://github.com/IBM/kui/issues/2939)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

### Bug Fixes

- drilldown bugs in openwhisk trace view ([9185585](https://github.com/IBM/kui/commit/9185585)), closes [#2874](https://github.com/IBM/kui/issues/2874)
- electron publish breakage ([5f3d847](https://github.com/IBM/kui/commit/5f3d847)), closes [#2865](https://github.com/IBM/kui/issues/2865)
- lingering reference to packages/app in push-cos.js ([77b88b0](https://github.com/IBM/kui/commit/77b88b0)), closes [#2870](https://github.com/IBM/kui/issues/2870)
- setup-webhook out of date ([f6ffcd1](https://github.com/IBM/kui/commit/f6ffcd1)), closes [#2843](https://github.com/IBM/kui/issues/2843)
- **packages/core:** Commands.Registrar.synonym should have the options as optional ([0882ab2](https://github.com/IBM/kui/commit/0882ab2)), closes [#2909](https://github.com/IBM/kui/issues/2909)
- **packages/core:** sidecar plain text handler should not use normal-text css class ([de82cf4](https://github.com/IBM/kui/commit/de82cf4)), closes [#2907](https://github.com/IBM/kui/issues/2907)
- **plugins/plugin-apache-composer:** let.js demo versus safari ([dea7610](https://github.com/IBM/kui/commit/dea7610)), closes [#2820](https://github.com/IBM/kui/issues/2820)
- **plugins/plugin-openwhisk:** missing wsk prefix to auth switch ([9867189](https://github.com/IBM/kui/commit/9867189)), closes [#2872](https://github.com/IBM/kui/issues/2872)

### Features

- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- **packages/core:** improve API for providing sidecar entity content ([4613d1c](https://github.com/IBM/kui/commit/4613d1c)), closes [#2911](https://github.com/IBM/kui/issues/2911)
