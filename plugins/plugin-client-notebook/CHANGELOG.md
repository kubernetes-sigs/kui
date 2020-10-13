# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.0.3](https://github.com/IBM/kui/compare/v9.0.2...v9.0.3) (2020-10-13)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [9.0.2](https://github.com/IBM/kui/compare/v9.0.1...v9.0.2) (2020-10-12)

### Bug Fixes

- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([e301fe0](https://github.com/IBM/kui/commit/e301fe0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([b29c0aa](https://github.com/IBM/kui/commit/b29c0aa)), closes [#5942](https://github.com/IBM/kui/issues/5942)

## [9.0.1](https://github.com/IBM/kui/compare/v9.0.0...v9.0.1) (2020-10-10)

### Bug Fixes

- add Kui version and github link to client-notebook ([d53337a](https://github.com/IBM/kui/commit/d53337a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([4a700b5](https://github.com/IBM/kui/commit/4a700b5)), closes [#5919](https://github.com/IBM/kui/issues/5919)

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)
