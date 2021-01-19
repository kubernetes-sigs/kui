# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-beta.3](https://github.com/kui-shell/oui/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2021-01-19)

**Note:** Version bump only for package @kui-shell/plugin-openwhisk

# [10.0.0-beta.2](https://github.com/kui-shell/oui/compare/v4.5.0...v10.0.0-beta.2) (2021-01-19)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/kui-shell/oui/commit/b9ddcd1)), closes [#3059](https://github.com/kui-shell/oui/issues/3059) [#3061](https://github.com/kui-shell/oui/issues/3061)
- **plugins/plugin-client-common:** show table click result in a new split ([fd1b3a1](https://github.com/kui-shell/oui/commit/fd1b3a1)), closes [#6477](https://github.com/kui-shell/oui/issues/6477)
- **plugins/plugin-openwhisk:** missing wsk prefix to auth switch ([9867189](https://github.com/kui-shell/oui/commit/9867189)), closes [#2872](https://github.com/kui-shell/oui/issues/2872)
- **plugins/plugin-openwhisk:** OpenWhisk Trace tab does not work in offline notebooks ([de8ae02](https://github.com/kui-shell/oui/commit/de8ae02)), closes [#6121](https://github.com/kui-shell/oui/issues/6121)
- drilldown bugs in openwhisk trace view ([9185585](https://github.com/kui-shell/oui/commit/9185585)), closes [#2874](https://github.com/kui-shell/oui/issues/2874)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/kui-shell/oui/commit/c17c1e6)), closes [#2963](https://github.com/kui-shell/oui/issues/2963)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/kui-shell/oui/commit/4814cb9)), closes [#2935](https://github.com/kui-shell/oui/issues/2935)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/kui-shell/oui/commit/b9c5867)), closes [#6109](https://github.com/kui-shell/oui/issues/6109)
- remove openwhisk plugins ([fb4274d](https://github.com/kui-shell/oui/commit/fb4274d)), closes [#3201](https://github.com/kui-shell/oui/issues/3201)

### BREAKING CHANGES

- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

# [9.3.0](https://github.com/kui-shell/oui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/kui-shell/oui/commit/b9ddcd1)), closes [#3059](https://github.com/kui-shell/oui/issues/3059) [#3061](https://github.com/kui-shell/oui/issues/3061)
- **plugins/plugin-openwhisk:** OpenWhisk Trace tab does not work in offline notebooks ([de8ae02](https://github.com/kui-shell/oui/commit/de8ae02)), closes [#6121](https://github.com/kui-shell/oui/issues/6121)
- drilldown bugs in openwhisk trace view ([9185585](https://github.com/kui-shell/oui/commit/9185585)), closes [#2874](https://github.com/kui-shell/oui/issues/2874)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/kui-shell/oui/commit/c17c1e6)), closes [#2963](https://github.com/kui-shell/oui/issues/2963)
- **plugins/plugin-openwhisk:** missing wsk prefix to auth switch ([9867189](https://github.com/kui-shell/oui/commit/9867189)), closes [#2872](https://github.com/kui-shell/oui/issues/2872)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/kui-shell/oui/commit/4814cb9)), closes [#2935](https://github.com/kui-shell/oui/issues/2935)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/kui-shell/oui/commit/b9c5867)), closes [#6109](https://github.com/kui-shell/oui/issues/6109)
- remove openwhisk plugins ([fb4274d](https://github.com/kui-shell/oui/commit/fb4274d)), closes [#3201](https://github.com/kui-shell/oui/issues/3201)

### BREAKING CHANGES

- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

# [9.2.0](https://github.com/kui-shell/oui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **packages/core:** avoid "custom" in the sidecar "kind" display ([b9ddcd1](https://github.com/kui-shell/oui/commit/b9ddcd1)), closes [#3059](https://github.com/kui-shell/oui/issues/3059) [#3061](https://github.com/kui-shell/oui/issues/3061)
- **plugins/plugin-openwhisk:** OpenWhisk Trace tab does not work in offline notebooks ([de8ae02](https://github.com/kui-shell/oui/commit/de8ae02)), closes [#6121](https://github.com/kui-shell/oui/issues/6121)
- drilldown bugs in openwhisk trace view ([9185585](https://github.com/kui-shell/oui/commit/9185585)), closes [#2874](https://github.com/kui-shell/oui/issues/2874)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/kui-shell/oui/commit/c17c1e6)), closes [#2963](https://github.com/kui-shell/oui/issues/2963)
- **plugins/plugin-openwhisk:** missing wsk prefix to auth switch ([9867189](https://github.com/kui-shell/oui/commit/9867189)), closes [#2872](https://github.com/kui-shell/oui/issues/2872)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/kui-shell/oui/commit/4814cb9)), closes [#2935](https://github.com/kui-shell/oui/issues/2935)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/kui-shell/oui/commit/b9c5867)), closes [#6109](https://github.com/kui-shell/oui/issues/6109)
- remove openwhisk plugins ([fb4274d](https://github.com/kui-shell/oui/commit/fb4274d)), closes [#3201](https://github.com/kui-shell/oui/issues/3201)

### BREAKING CHANGES

- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Bug Fixes

- **plugins/plugin-openwhisk:** missing wsk prefix to auth switch ([9867189](https://github.com/IBM/kui/commit/9867189)), closes [#2872](https://github.com/IBM/kui/issues/2872)
- drilldown bugs in openwhisk trace view ([9185585](https://github.com/IBM/kui/commit/9185585)), closes [#2874](https://github.com/IBM/kui/issues/2874)
- user-installed plugins cannot always REPL.qexec other plugins ([c17c1e6](https://github.com/IBM/kui/commit/c17c1e6)), closes [#2963](https://github.com/IBM/kui/issues/2963)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

### Bug Fixes

- **plugins/plugin-openwhisk:** missing wsk prefix to auth switch ([9867189](https://github.com/IBM/kui/commit/9867189)), closes [#2872](https://github.com/IBM/kui/issues/2872)
- drilldown bugs in openwhisk trace view ([9185585](https://github.com/IBM/kui/commit/9185585)), closes [#2874](https://github.com/IBM/kui/issues/2874)
