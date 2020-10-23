# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.0.6](https://github.com/IBM/kui/compare/v9.0.5...v9.0.6) (2020-10-23)

**Note:** Version bump only for package @kui-shell/plugin-s3

## [9.0.5](https://github.com/IBM/kui/compare/v9.0.4...v9.0.5) (2020-10-19)

**Note:** Version bump only for package @kui-shell/plugin-s3

## [9.0.4](https://github.com/IBM/kui/compare/v9.0.3...v9.0.4) (2020-10-14)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1d4bdaa](https://github.com/IBM/kui/commit/1d4bdaa)), closes [#5977](https://github.com/IBM/kui/issues/5977)

## [9.0.3](https://github.com/IBM/kui/compare/v9.0.2...v9.0.3) (2020-10-13)

**Note:** Version bump only for package @kui-shell/plugin-s3

## [9.0.2](https://github.com/IBM/kui/compare/v9.0.1...v9.0.2) (2020-10-12)

### Bug Fixes

- **plugins/plugin-s3:** improve s3 parallelization notebook ([9ee0808](https://github.com/IBM/kui/commit/9ee0808)), closes [#5957](https://github.com/IBM/kui/issues/5957)
- preferReExecute is lost when re-saving a notebook ([d68a9c3](https://github.com/IBM/kui/commit/d68a9c3)), closes [#5954](https://github.com/IBM/kui/issues/5954)
- **plugins/plugin-s3:** using s3 notebook has an ECONNREFUSED ([6e24222](https://github.com/IBM/kui/commit/6e24222)), closes [#5952](https://github.com/IBM/kui/issues/5952)
- a few more improvements to s3 onboarding ([6c57c16](https://github.com/IBM/kui/commit/6c57c16)), closes [#5947](https://github.com/IBM/kui/issues/5947)

## [9.0.1](https://github.com/IBM/kui/compare/v9.0.0...v9.0.1) (2020-10-10)

### Bug Fixes

- improve discovery of ibmcloud s3 credentials ([0fe3b33](https://github.com/IBM/kui/commit/0fe3b33)), closes [#5926](https://github.com/IBM/kui/issues/5926)

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **plugins/plugin-s3:** plugin-s3 has an out-of-date notebook ([6a8a33a](https://github.com/IBM/kui/commit/6a8a33a)), closes [#5909](https://github.com/IBM/kui/issues/5909)
- improve vfs cp to handle disparate source ([e55e528](https://github.com/IBM/kui/commit/e55e528)), closes [#5786](https://github.com/IBM/kui/issues/5786)
- **plugins/plugin-s3:** improve globbing in s3 rm commands ([48ef3bd](https://github.com/IBM/kui/commit/48ef3bd)), closes [#5709](https://github.com/IBM/kui/issues/5709)
- **plugins/plugin-s3:** ls /s3 fails poorly with wildcards ([2a45124](https://github.com/IBM/kui/commit/2a45124)), closes [#5691](https://github.com/IBM/kui/issues/5691)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/IBM/kui/commit/e05d7e0)), closes [#5831](https://github.com/IBM/kui/issues/5831)
- mount all s3 providers ([c3f5fc5](https://github.com/IBM/kui/commit/c3f5fc5)), closes [#5731](https://github.com/IBM/kui/issues/5731)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- **plugins/plugin-s3:** support for inter-s3 copying ([7cce673](https://github.com/IBM/kui/commit/7cce673)), closes [#5234](https://github.com/IBM/kui/issues/5234)
- add support for copying out of remote storage ([c4ed5b8](https://github.com/IBM/kui/commit/c4ed5b8)), closes [#5322](https://github.com/IBM/kui/issues/5322)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Features

- **plugins/plugin-s3:** support for inter-s3 copying ([7cce673](https://github.com/IBM/kui/commit/7cce673)), closes [#5234](https://github.com/IBM/kui/issues/5234)
- add support for copying out of remote storage ([c4ed5b8](https://github.com/IBM/kui/commit/c4ed5b8)), closes [#5322](https://github.com/IBM/kui/issues/5322)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
