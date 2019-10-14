# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.2.0](https://github.com/IBM/kui/compare/v4.5.0...v5.2.0) (2019-10-14)

### Bug Fixes

- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- **packages/core:** kui hangs with command registered as subtree without usage ([0fc14d4](https://github.com/IBM/kui/commit/0fc14d4)), closes [#2954](https://github.com/IBM/kui/issues/2954)
- drilldown bugs in openwhisk trace view ([9185585](https://github.com/IBM/kui/commit/9185585)), closes [#2874](https://github.com/IBM/kui/issues/2874)
- **packages/core:** add missing marked dependence in packages/core ([a1eac24](https://github.com/IBM/kui/commit/a1eac24)), closes [#2997](https://github.com/IBM/kui/issues/2997)
- **packages/core:** commands for plugin didn't handle no-usage case ([9ffa5d9](https://github.com/IBM/kui/commit/9ffa5d9)), closes [#2949](https://github.com/IBM/kui/issues/2949)
- **packages/core:** Commands.Registrar.synonym should have the options as optional ([0882ab2](https://github.com/IBM/kui/commit/0882ab2)), closes [#2909](https://github.com/IBM/kui/issues/2909)
- **packages/core:** debug rather than console.error on plugin scanner retry ([27f41e0](https://github.com/IBM/kui/commit/27f41e0)), closes [#2958](https://github.com/IBM/kui/issues/2958)
- **packages/core:** improve rendering of popup mode ([3501a51](https://github.com/IBM/kui/commit/3501a51)), closes [#2983](https://github.com/IBM/kui/issues/2983)
- **packages/core:** in popup mode, sidecar screenshot and close button too small ([5fa0d97](https://github.com/IBM/kui/commit/5fa0d97)), closes [#2932](https://github.com/IBM/kui/issues/2932)
- **packages/core:** mimic-dom should mimic sessionStorage ([52b3aaa](https://github.com/IBM/kui/commit/52b3aaa)), closes [#2981](https://github.com/IBM/kui/issues/2981)
- **packages/core:** popup spinner is tiny ([8e813f6](https://github.com/IBM/kui/commit/8e813f6)), closes [#2947](https://github.com/IBM/kui/issues/2947)
- **packages/core:** preloader should support absolute paths in prescan.json ([1630564](https://github.com/IBM/kui/commit/1630564)), closes [#2970](https://github.com/IBM/kui/issues/2970)
- **packages/core:** remove leftover console.trace ([5ecf90a](https://github.com/IBM/kui/commit/5ecf90a)), closes [#3003](https://github.com/IBM/kui/issues/3003)
- **packages/core:** sidecar plain text handler should not use normal-text css class ([de82cf4](https://github.com/IBM/kui/commit/de82cf4)), closes [#2907](https://github.com/IBM/kui/issues/2907)
- **packages/core:** spinner color should follow brand palette ([37488dd](https://github.com/IBM/kui/commit/37488dd)), closes [#2987](https://github.com/IBM/kui/issues/2987)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** undefined window title in popup mode ([b2538a1](https://github.com/IBM/kui/commit/b2538a1)), closes [#2943](https://github.com/IBM/kui/issues/2943)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)

### Features

- **packages/core:** improve API for providing sidecar entity content ([4613d1c](https://github.com/IBM/kui/commit/4613d1c)), closes [#2911](https://github.com/IBM/kui/issues/2911)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- kui-base including core and plugin-core-support only ([7df5fd7](https://github.com/IBM/kui/commit/7df5fd7)), closes [#2919](https://github.com/IBM/kui/issues/2919)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Bug Fixes

- **packages/core:** undefined window title in popup mode ([b2538a1](https://github.com/IBM/kui/commit/b2538a1)), closes [#2943](https://github.com/IBM/kui/issues/2943)
- drilldown bugs in openwhisk trace view ([9185585](https://github.com/IBM/kui/commit/9185585)), closes [#2874](https://github.com/IBM/kui/issues/2874)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)
- **packages/core:** commands for plugin didn't handle no-usage case ([9ffa5d9](https://github.com/IBM/kui/commit/9ffa5d9)), closes [#2949](https://github.com/IBM/kui/issues/2949)
- **packages/core:** Commands.Registrar.synonym should have the options as optional ([0882ab2](https://github.com/IBM/kui/commit/0882ab2)), closes [#2909](https://github.com/IBM/kui/issues/2909)
- **packages/core:** debug rather than console.error on plugin scanner retry ([27f41e0](https://github.com/IBM/kui/commit/27f41e0)), closes [#2958](https://github.com/IBM/kui/issues/2958)
- **packages/core:** in popup mode, sidecar screenshot and close button too small ([5fa0d97](https://github.com/IBM/kui/commit/5fa0d97)), closes [#2932](https://github.com/IBM/kui/issues/2932)
- **packages/core:** kui hangs with command registered as subtree without usage ([0fc14d4](https://github.com/IBM/kui/commit/0fc14d4)), closes [#2954](https://github.com/IBM/kui/issues/2954)
- **packages/core:** popup spinner is tiny ([8e813f6](https://github.com/IBM/kui/commit/8e813f6)), closes [#2947](https://github.com/IBM/kui/issues/2947)
- **packages/core:** sidecar plain text handler should not use normal-text css class ([de82cf4](https://github.com/IBM/kui/commit/de82cf4)), closes [#2907](https://github.com/IBM/kui/issues/2907)
- **plugins/plugin-manager:** improve docs strings for plugin-manager commands ([7b5ab7d](https://github.com/IBM/kui/commit/7b5ab7d)), closes [#2926](https://github.com/IBM/kui/issues/2926)

### Features

- **packages/core:** improve API for providing sidecar entity content ([4613d1c](https://github.com/IBM/kui/commit/4613d1c)), closes [#2911](https://github.com/IBM/kui/issues/2911)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- kui-base including core and plugin-core-support only ([7df5fd7](https://github.com/IBM/kui/commit/7df5fd7)), closes [#2919](https://github.com/IBM/kui/issues/2919)
- revive plugin-manager ([b78fed5](https://github.com/IBM/kui/commit/b78fed5)), closes [#2921](https://github.com/IBM/kui/issues/2921)
- **plugins/plugin-manager:** plugin install should return list of new commands ([9ee3739](https://github.com/IBM/kui/commit/9ee3739)), closes [#2945](https://github.com/IBM/kui/issues/2945)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

### Bug Fixes

- drilldown bugs in openwhisk trace view ([9185585](https://github.com/IBM/kui/commit/9185585)), closes [#2874](https://github.com/IBM/kui/issues/2874)
- **packages/core:** Commands.Registrar.synonym should have the options as optional ([0882ab2](https://github.com/IBM/kui/commit/0882ab2)), closes [#2909](https://github.com/IBM/kui/issues/2909)
- **packages/core:** sidecar plain text handler should not use normal-text css class ([de82cf4](https://github.com/IBM/kui/commit/de82cf4)), closes [#2907](https://github.com/IBM/kui/issues/2907)

### Features

- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- **packages/core:** improve API for providing sidecar entity content ([4613d1c](https://github.com/IBM/kui/commit/4613d1c)), closes [#2911](https://github.com/IBM/kui/issues/2911)
