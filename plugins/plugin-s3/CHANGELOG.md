# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.4.13](https://github.com/IBM/kui/compare/v10.4.12...v10.4.13) (2021-08-26)

**Note:** Version bump only for package @kui-shell/plugin-s3

## [10.4.12](https://github.com/IBM/kui/compare/v10.4.11...v10.4.12) (2021-08-22)

**Note:** Version bump only for package @kui-shell/plugin-s3

## [10.4.11](https://github.com/IBM/kui/compare/v10.4.10...v10.4.11) (2021-08-06)

**Note:** Version bump only for package @kui-shell/plugin-s3

## [10.4.10](https://github.com/IBM/kui/compare/v10.4.9...v10.4.10) (2021-08-06)

**Note:** Version bump only for package @kui-shell/plugin-s3

## [10.4.9](https://github.com/IBM/kui/compare/v10.4.8...v10.4.9) (2021-08-06)

**Note:** Version bump only for package @kui-shell/plugin-s3

## [10.4.8](https://github.com/IBM/kui/compare/v10.4.7...v10.4.8) (2021-08-02)

### Bug Fixes

- **plugins/plugin-s3:** leftover debug in s3 vfs ([b9fe371](https://github.com/IBM/kui/commit/b9fe371)), closes [#7806](https://github.com/IBM/kui/issues/7806)
- **plugins/plugin-s3:** optimize s3 init a bit ([8f58a67](https://github.com/IBM/kui/commit/8f58a67)), closes [#7812](https://github.com/IBM/kui/issues/7812)

## [10.4.7](https://github.com/IBM/kui/compare/v10.4.6...v10.4.7) (2021-07-20)

### Bug Fixes

- **plugins/plugin-s3:** ls -d on s3 bind mount returns the underlying directory, not the bind directory ([9f64ff6](https://github.com/IBM/kui/commit/9f64ff6)), closes [#7780](https://github.com/IBM/kui/issues/7780)
- **plugins/plugin-s3:** wildcard cp between s3 regions/providers fails ([c9e1ef8](https://github.com/IBM/kui/commit/c9e1ef8)), closes [#7782](https://github.com/IBM/kui/issues/7782)

### Features

- **plugins/plugin-s3:** plugin-s3/ibm should export findCredentialsForInstance ([d161fe0](https://github.com/IBM/kui/commit/d161fe0)), closes [#7793](https://github.com/IBM/kui/issues/7793)

## [10.4.6](https://github.com/IBM/kui/compare/v10.4.5...v10.4.6) (2021-07-06)

### Bug Fixes

- **plugins/plugin-s3:** leftover debugging in plugin-s3 ([b91c945](https://github.com/IBM/kui/commit/b91c945)), closes [#7767](https://github.com/IBM/kui/issues/7767)
- **plugins/plugin-s3:** s3 bind mounts don't behave correctly with clicks in ls output ([1ac7cd1](https://github.com/IBM/kui/commit/1ac7cd1)), closes [#7764](https://github.com/IBM/kui/issues/7764)

## [10.4.5](https://github.com/IBM/kui/compare/v10.4.4...v10.4.5) (2021-07-01)

### Bug Fixes

- **plugins/plugin-s3:** s3 tmp/bin mounts are not geo-specific ([93d5e88](https://github.com/IBM/kui/commit/93d5e88)), closes [#7729](https://github.com/IBM/kui/issues/7729)

### Features

- **plugins/plugin-s3:** minioConfig of plugin-s3 does not properly export subdirs ([f5cc5ea](https://github.com/IBM/kui/commit/f5cc5ea)), closes [#7753](https://github.com/IBM/kui/issues/7753)

## [10.4.4](https://github.com/IBM/kui/compare/v10.4.3...v10.4.4) (2021-06-28)

### Features

- Add support for "slash tmp" to s3 mounts ([31e8a64](https://github.com/IBM/kui/commit/31e8a64)), closes [#7721](https://github.com/IBM/kui/issues/7721)

## [10.4.3](https://github.com/IBM/kui/compare/v10.4.2...v10.4.3) (2021-06-25)

**Note:** Version bump only for package @kui-shell/plugin-s3

## [10.4.2](https://github.com/IBM/kui/compare/v10.4.1...v10.4.2) (2021-06-24)

### Bug Fixes

- **plugins/plugin-s3:** ibm provider for plugin-s3 does not recognize eu-gb region ([276c6ae](https://github.com/IBM/kui/commit/276c6ae)), closes [#7674](https://github.com/IBM/kui/issues/7674)
- **plugins/plugin-s3:** ibm s3 provider fails with cross-region endpoints ([d650467](https://github.com/IBM/kui/commit/d650467)), closes [#7685](https://github.com/IBM/kui/issues/7685)
- **plugins/plugin-s3:** s3 vfs not mounted in time in headless mode ([36c5199](https://github.com/IBM/kui/commit/36c5199)), closes [#7694](https://github.com/IBM/kui/issues/7694)
- **plugins/plugin-s3:** up command does not respect --cos-instance choice for ibm cloud ([2675bcf](https://github.com/IBM/kui/commit/2675bcf)), closes [#7677](https://github.com/IBM/kui/issues/7677)

## [10.4.1](https://github.com/IBM/kui/compare/v10.4.0...v10.4.1) (2021-06-21)

**Note:** Version bump only for package @kui-shell/plugin-s3

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- **plugins/plugin-s3:** s3 plugin executes a large number of pty commands on startup ([584b649](https://github.com/IBM/kui/commit/584b649)), closes [#7650](https://github.com/IBM/kui/issues/7650)
- **plugins/plugin-s3:** S3Mounts widget has high overhead on startup ([3d17850](https://github.com/IBM/kui/commit/3d17850)), closes [#7576](https://github.com/IBM/kui/issues/7576)
- S3Mounts widget does not properly format ansi control codes from errors ([563573b](https://github.com/IBM/kui/commit/563573b)), closes [#7569](https://github.com/IBM/kui/issues/7569)
- **plugins/plugin-s3:** ibm s3 provider registers too late ([a6c5499](https://github.com/IBM/kui/commit/a6c5499)), closes [#7560](https://github.com/IBM/kui/issues/7560)
- Improve debuggability of s3 vfs mounting ([3989653](https://github.com/IBM/kui/commit/3989653)), closes [#6423](https://github.com/IBM/kui/issues/6423)
- kubectl watcher should auto-terminate, if given a bound up front ([1a94094](https://github.com/IBM/kui/commit/1a94094)), closes [#6417](https://github.com/IBM/kui/issues/6417)
- s3 job watcher sometimes fails due to startup issues ([8851d50](https://github.com/IBM/kui/commit/8851d50)), closes [#6411](https://github.com/IBM/kui/issues/6411)
- **plugins/plugin-bash-like:** ls on s3 vfs directory can fail ([b8dfb77](https://github.com/IBM/kui/commit/b8dfb77)), closes [#6316](https://github.com/IBM/kui/issues/6316)
- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/IBM/kui/commit/1a783f3)), closes [#5977](https://github.com/IBM/kui/issues/5977)
- **plugins/plugin-s3:** improve globbing in s3 rm commands ([48ef3bd](https://github.com/IBM/kui/commit/48ef3bd)), closes [#5709](https://github.com/IBM/kui/issues/5709)
- **plugins/plugin-s3:** ls /s3 fails poorly with wildcards ([2a45124](https://github.com/IBM/kui/commit/2a45124)), closes [#5691](https://github.com/IBM/kui/issues/5691)
- **plugins/plugin-s3:** plugin-s3 has an out-of-date notebook ([6a8a33a](https://github.com/IBM/kui/commit/6a8a33a)), closes [#5909](https://github.com/IBM/kui/issues/5909)
- **plugins/plugin-s3:** scale-out gzip not quite right ([81ffac0](https://github.com/IBM/kui/commit/81ffac0)), closes [#6298](https://github.com/IBM/kui/issues/6298)
- port gunzip and gzip to use new job controller ([b5b8528](https://github.com/IBM/kui/commit/b5b8528)), closes [#6277](https://github.com/IBM/kui/issues/6277)
- **plugins/plugin-s3:** CodeEngine s3 job provider can be optimized a bit ([5de4cb3](https://github.com/IBM/kui/commit/5de4cb3)), closes [#6169](https://github.com/IBM/kui/issues/6169)
- **plugins/plugin-s3:** improve s3 parallelization notebook ([4160fe5](https://github.com/IBM/kui/commit/4160fe5)), closes [#5957](https://github.com/IBM/kui/issues/5957)
- **plugins/plugin-s3:** ls against s3 vfs does not properly handle brace expansion ([037dac8](https://github.com/IBM/kui/commit/037dac8)), closes [#6258](https://github.com/IBM/kui/issues/6258)
- **plugins/plugin-s3:** using s3 notebook has an ECONNREFUSED ([3ecf735](https://github.com/IBM/kui/commit/3ecf735)), closes [#5952](https://github.com/IBM/kui/issues/5952)
- **plugins/plugin-se:** CodeEngine.ts uses invalid option ([6ba634e](https://github.com/IBM/kui/commit/6ba634e)), closes [#6237](https://github.com/IBM/kui/issues/6237)
- a few more improvements to s3 onboarding ([9f821ef](https://github.com/IBM/kui/commit/9f821ef)), closes [#5947](https://github.com/IBM/kui/issues/5947)
- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- improve vfs cp to handle disparate source ([e55e528](https://github.com/IBM/kui/commit/e55e528)), closes [#5786](https://github.com/IBM/kui/issues/5786)
- preferReExecute is lost when re-saving a notebook ([87c6c6f](https://github.com/IBM/kui/commit/87c6c6f)), closes [#5954](https://github.com/IBM/kui/issues/5954)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### chore

- remove plugin-{ibmcloud,s3,skeleton,openwhisk} ([f38ab8a](https://github.com/IBM/kui/commit/f38ab8a)), closes [#6589](https://github.com/IBM/kui/issues/6589)

### Features

- add support for copying out of remote storage ([c4ed5b8](https://github.com/IBM/kui/commit/c4ed5b8)), closes [#5322](https://github.com/IBM/kui/issues/5322)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- experimental parallelized cp aginst s3 vfs ([6a07aa3](https://github.com/IBM/kui/commit/6a07aa3)), closes [#6213](https://github.com/IBM/kui/issues/6213)
- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/IBM/kui/commit/e05d7e0)), closes [#5831](https://github.com/IBM/kui/issues/5831)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- mount all s3 providers ([c3f5fc5](https://github.com/IBM/kui/commit/c3f5fc5)), closes [#5731](https://github.com/IBM/kui/issues/5731)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- port experimental scale-out grep to use new job controller ([45ce460](https://github.com/IBM/kui/commit/45ce460)), closes [#6280](https://github.com/IBM/kui/issues/6280)
- s3 plugin ([177457f](https://github.com/IBM/kui/commit/177457f)), closes [#7536](https://github.com/IBM/kui/issues/7536)
- **plugins/plugin-s3:** support for inter-s3 copying ([7cce673](https://github.com/IBM/kui/commit/7cce673)), closes [#5234](https://github.com/IBM/kui/issues/5234)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)

### BREAKING CHANGES

- this PR removes plugins from the repo

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **plugins/plugin-bash-like:** ls on s3 vfs directory can fail ([b8dfb77](https://github.com/IBM/kui/commit/b8dfb77)), closes [#6316](https://github.com/IBM/kui/issues/6316)
- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/IBM/kui/commit/1a783f3)), closes [#5977](https://github.com/IBM/kui/issues/5977)
- **plugins/plugin-s3:** scale-out gzip not quite right ([81ffac0](https://github.com/IBM/kui/commit/81ffac0)), closes [#6298](https://github.com/IBM/kui/issues/6298)
- port gunzip and gzip to use new job controller ([b5b8528](https://github.com/IBM/kui/commit/b5b8528)), closes [#6277](https://github.com/IBM/kui/issues/6277)
- **plugins/plugin-s3:** CodeEngine s3 job provider can be optimized a bit ([5de4cb3](https://github.com/IBM/kui/commit/5de4cb3)), closes [#6169](https://github.com/IBM/kui/issues/6169)
- **plugins/plugin-s3:** improve globbing in s3 rm commands ([48ef3bd](https://github.com/IBM/kui/commit/48ef3bd)), closes [#5709](https://github.com/IBM/kui/issues/5709)
- **plugins/plugin-s3:** improve s3 parallelization notebook ([4160fe5](https://github.com/IBM/kui/commit/4160fe5)), closes [#5957](https://github.com/IBM/kui/issues/5957)
- **plugins/plugin-s3:** ls /s3 fails poorly with wildcards ([2a45124](https://github.com/IBM/kui/commit/2a45124)), closes [#5691](https://github.com/IBM/kui/issues/5691)
- **plugins/plugin-s3:** ls against s3 vfs does not properly handle brace expansion ([037dac8](https://github.com/IBM/kui/commit/037dac8)), closes [#6258](https://github.com/IBM/kui/issues/6258)
- **plugins/plugin-s3:** using s3 notebook has an ECONNREFUSED ([3ecf735](https://github.com/IBM/kui/commit/3ecf735)), closes [#5952](https://github.com/IBM/kui/issues/5952)
- **plugins/plugin-se:** CodeEngine.ts uses invalid option ([6ba634e](https://github.com/IBM/kui/commit/6ba634e)), closes [#6237](https://github.com/IBM/kui/issues/6237)
- a few more improvements to s3 onboarding ([9f821ef](https://github.com/IBM/kui/commit/9f821ef)), closes [#5947](https://github.com/IBM/kui/issues/5947)
- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- preferReExecute is lost when re-saving a notebook ([87c6c6f](https://github.com/IBM/kui/commit/87c6c6f)), closes [#5954](https://github.com/IBM/kui/issues/5954)
- **plugins/plugin-s3:** plugin-s3 has an out-of-date notebook ([6a8a33a](https://github.com/IBM/kui/commit/6a8a33a)), closes [#5909](https://github.com/IBM/kui/issues/5909)
- improve vfs cp to handle disparate source ([e55e528](https://github.com/IBM/kui/commit/e55e528)), closes [#5786](https://github.com/IBM/kui/issues/5786)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- add support for copying out of remote storage ([c4ed5b8](https://github.com/IBM/kui/commit/c4ed5b8)), closes [#5322](https://github.com/IBM/kui/issues/5322)
- experimental parallelized cp aginst s3 vfs ([6a07aa3](https://github.com/IBM/kui/commit/6a07aa3)), closes [#6213](https://github.com/IBM/kui/issues/6213)
- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/IBM/kui/commit/e05d7e0)), closes [#5831](https://github.com/IBM/kui/issues/5831)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- mount all s3 providers ([c3f5fc5](https://github.com/IBM/kui/commit/c3f5fc5)), closes [#5731](https://github.com/IBM/kui/issues/5731)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- port experimental scale-out grep to use new job controller ([45ce460](https://github.com/IBM/kui/commit/45ce460)), closes [#6280](https://github.com/IBM/kui/issues/6280)
- **plugins/plugin-s3:** support for inter-s3 copying ([7cce673](https://github.com/IBM/kui/commit/7cce673)), closes [#5234](https://github.com/IBM/kui/issues/5234)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/IBM/kui/commit/1a783f3)), closes [#5977](https://github.com/IBM/kui/issues/5977)
- **plugins/plugin-s3:** CodeEngine s3 job provider can be optimized a bit ([5de4cb3](https://github.com/IBM/kui/commit/5de4cb3)), closes [#6169](https://github.com/IBM/kui/issues/6169)
- **plugins/plugin-s3:** improve s3 parallelization notebook ([4160fe5](https://github.com/IBM/kui/commit/4160fe5)), closes [#5957](https://github.com/IBM/kui/issues/5957)
- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- improve vfs cp to handle disparate source ([e55e528](https://github.com/IBM/kui/commit/e55e528)), closes [#5786](https://github.com/IBM/kui/issues/5786)
- preferReExecute is lost when re-saving a notebook ([87c6c6f](https://github.com/IBM/kui/commit/87c6c6f)), closes [#5954](https://github.com/IBM/kui/issues/5954)
- **plugins/plugin-s3:** improve globbing in s3 rm commands ([48ef3bd](https://github.com/IBM/kui/commit/48ef3bd)), closes [#5709](https://github.com/IBM/kui/issues/5709)
- **plugins/plugin-s3:** ls /s3 fails poorly with wildcards ([2a45124](https://github.com/IBM/kui/commit/2a45124)), closes [#5691](https://github.com/IBM/kui/issues/5691)
- **plugins/plugin-s3:** plugin-s3 has an out-of-date notebook ([6a8a33a](https://github.com/IBM/kui/commit/6a8a33a)), closes [#5909](https://github.com/IBM/kui/issues/5909)
- **plugins/plugin-s3:** using s3 notebook has an ECONNREFUSED ([3ecf735](https://github.com/IBM/kui/commit/3ecf735)), closes [#5952](https://github.com/IBM/kui/issues/5952)
- a few more improvements to s3 onboarding ([9f821ef](https://github.com/IBM/kui/commit/9f821ef)), closes [#5947](https://github.com/IBM/kui/issues/5947)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- add support for copying out of remote storage ([c4ed5b8](https://github.com/IBM/kui/commit/c4ed5b8)), closes [#5322](https://github.com/IBM/kui/issues/5322)
- experimental parallelized cp aginst s3 vfs ([6a07aa3](https://github.com/IBM/kui/commit/6a07aa3)), closes [#6213](https://github.com/IBM/kui/issues/6213)
- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/IBM/kui/commit/e05d7e0)), closes [#5831](https://github.com/IBM/kui/issues/5831)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- mount all s3 providers ([c3f5fc5](https://github.com/IBM/kui/commit/c3f5fc5)), closes [#5731](https://github.com/IBM/kui/issues/5731)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- **plugins/plugin-s3:** support for inter-s3 copying ([7cce673](https://github.com/IBM/kui/commit/7cce673)), closes [#5234](https://github.com/IBM/kui/issues/5234)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/IBM/kui/commit/1a783f3)), closes [#5977](https://github.com/IBM/kui/issues/5977)
- **plugins/plugin-s3:** improve s3 parallelization notebook ([4160fe5](https://github.com/IBM/kui/commit/4160fe5)), closes [#5957](https://github.com/IBM/kui/issues/5957)
- preferReExecute is lost when re-saving a notebook ([87c6c6f](https://github.com/IBM/kui/commit/87c6c6f)), closes [#5954](https://github.com/IBM/kui/issues/5954)
- **plugins/plugin-s3:** using s3 notebook has an ECONNREFUSED ([3ecf735](https://github.com/IBM/kui/commit/3ecf735)), closes [#5952](https://github.com/IBM/kui/issues/5952)
- a few more improvements to s3 onboarding ([9f821ef](https://github.com/IBM/kui/commit/9f821ef)), closes [#5947](https://github.com/IBM/kui/issues/5947)
- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/IBM/kui/commit/96d5bc0)), closes [#5926](https://github.com/IBM/kui/issues/5926)
- **plugins/plugin-s3:** plugin-s3 has an out-of-date notebook ([6a8a33a](https://github.com/IBM/kui/commit/6a8a33a)), closes [#5909](https://github.com/IBM/kui/issues/5909)
- improve vfs cp to handle disparate source ([e55e528](https://github.com/IBM/kui/commit/e55e528)), closes [#5786](https://github.com/IBM/kui/issues/5786)
- **plugins/plugin-s3:** improve globbing in s3 rm commands ([48ef3bd](https://github.com/IBM/kui/commit/48ef3bd)), closes [#5709](https://github.com/IBM/kui/issues/5709)
- **plugins/plugin-s3:** ls /s3 fails poorly with wildcards ([2a45124](https://github.com/IBM/kui/commit/2a45124)), closes [#5691](https://github.com/IBM/kui/issues/5691)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- add support for copying out of remote storage ([c4ed5b8](https://github.com/IBM/kui/commit/c4ed5b8)), closes [#5322](https://github.com/IBM/kui/issues/5322)
- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/IBM/kui/commit/e05d7e0)), closes [#5831](https://github.com/IBM/kui/issues/5831)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- mount all s3 providers ([c3f5fc5](https://github.com/IBM/kui/commit/c3f5fc5)), closes [#5731](https://github.com/IBM/kui/issues/5731)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- **plugins/plugin-s3:** support for inter-s3 copying ([7cce673](https://github.com/IBM/kui/commit/7cce673)), closes [#5234](https://github.com/IBM/kui/issues/5234)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)

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
