# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.34.0 (2019-06-17)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- allow for log-lines tables to specify a looser layout ([e3b8997](https://github.com/IBM/kui/commit/e3b8997)), closes [#1471](https://github.com/IBM/kui/issues/1471)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- multiple fixes for tab management ([c125f7f](https://github.com/IBM/kui/commit/c125f7f)), closes [#1493](https://github.com/IBM/kui/issues/1493)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** invoke -r should block ([d3db591](https://github.com/IBM/kui/commit/d3db591)), closes [#370](https://github.com/IBM/kui/issues/370)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-bash-like:** fixes for pty buggy scrollbars ([a5a2221](https://github.com/IBM/kui/commit/a5a2221)), closes [#1288](https://github.com/IBM/kui/issues/1288)
- **plugins/plugin-core-support:** tab completion of dirs versus ~ ([c6190c5](https://github.com/IBM/kui/commit/c6190c5)), closes [#1483](https://github.com/IBM/kui/issues/1483)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** add type declarations for openwhisk test utils ([80e45e2](https://github.com/IBM/kui/commit/80e45e2)), closes [#1436](https://github.com/IBM/kui/issues/1436)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-openwhisk:** port wsk auth list to the table model ([b1de05e](https://github.com/IBM/kui/commit/b1de05e)), closes [#1426](https://github.com/IBM/kui/issues/1426)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)

### Features

- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- tekton pipelinerun view ([565a94c](https://github.com/IBM/kui/commit/565a94c)), closes [#1448](https://github.com/IBM/kui/issues/1448)
- tekton pipelinerun view ([615f2bb](https://github.com/IBM/kui/commit/615f2bb)), closes [#1448](https://github.com/IBM/kui/issues/1448)
- **packages/app:** show cwd in prompt ([ca8559f](https://github.com/IBM/kui/commit/ca8559f)), closes [#1727](https://github.com/IBM/kui/issues/1727)
- **plugins/plugin-k8s:** tab completion ([199c623](https://github.com/IBM/kui/commit/199c623)), closes [#1729](https://github.com/IBM/kui/issues/1729) [#1731](https://github.com/IBM/kui/issues/1731)
- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.33.0 (2019-05-22)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** invoke -r should block ([d3db591](https://github.com/IBM/kui/commit/d3db591)), closes [#370](https://github.com/IBM/kui/issues/370)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-bash-like:** fixes for pty buggy scrollbars ([a5a2221](https://github.com/IBM/kui/commit/a5a2221)), closes [#1288](https://github.com/IBM/kui/issues/1288)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** add type declarations for openwhisk test utils ([80e45e2](https://github.com/IBM/kui/commit/80e45e2)), closes [#1436](https://github.com/IBM/kui/issues/1436)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-openwhisk:** port wsk auth list to the table model ([b1de05e](https://github.com/IBM/kui/commit/b1de05e)), closes [#1426](https://github.com/IBM/kui/issues/1426)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)

### Features

- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.32.0 (2019-05-08)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** invoke -r should block ([d3db591](https://github.com/IBM/kui/commit/d3db591)), closes [#370](https://github.com/IBM/kui/issues/370)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.31.0 (2019-05-07)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** invoke -r should block ([d3db591](https://github.com/IBM/kui/commit/d3db591)), closes [#370](https://github.com/IBM/kui/issues/370)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.30.0 (2019-05-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** invoke -r should block ([d3db591](https://github.com/IBM/kui/commit/d3db591)), closes [#370](https://github.com/IBM/kui/issues/370)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.29.0 (2019-05-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** invoke -r should block ([d3db591](https://github.com/IBM/kui/commit/d3db591)), closes [#370](https://github.com/IBM/kui/issues/370)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.28.0 (2019-05-04)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** invoke -r should block ([d3db591](https://github.com/IBM/kui/commit/d3db591)), closes [#370](https://github.com/IBM/kui/issues/370)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.27.0 (2019-04-26)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)

### Features

- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.26.0 (2019-04-23)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)

### Features

- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.25.0 (2019-04-10)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- app list table header row ([0e1a491](https://github.com/IBM/kui/commit/0e1a491)), closes [#926](https://github.com/IBM/kui/issues/926)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- overflowing table cells ([e57fadf](https://github.com/IBM/kui/commit/e57fadf)), closes [#1004](https://github.com/IBM/kui/issues/1004)
- **packages/app:** some usage error formatting issues ([a9523c6](https://github.com/IBM/kui/commit/a9523c6)), closes [#956](https://github.com/IBM/kui/issues/956)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.24.0 (2019-03-19)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.23.0 (2019-03-19)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** [object Object] in action list for sequences vs webpack+proxy ([76cac26](https://github.com/IBM/kui/commit/76cac26)), closes [#403](https://github.com/IBM/kui/issues/403)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **plugins/plugin-openwhisk:** hover over failure bar and execution time legend is activated ([4708f2c](https://github.com/IBM/kui/commit/4708f2c)), closes [#865](https://github.com/IBM/kui/issues/865)
- **plugins/plugin-opwnshisk:** wsk auth list shouldn't present empty table ([f52b5ea](https://github.com/IBM/kui/commit/f52b5ea)), closes [#447](https://github.com/IBM/kui/issues/447)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- improved activation list UI ([fe69bd6](https://github.com/IBM/kui/commit/fe69bd6)), closes [#837](https://github.com/IBM/kui/issues/837)
- openwhisk package list UI fixes ([6d1c2d9](https://github.com/IBM/kui/commit/6d1c2d9)), closes [#296](https://github.com/IBM/kui/issues/296)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to openwhisk list views ([5f822ca](https://github.com/IBM/kui/commit/5f822ca)), closes [#851](https://github.com/IBM/kui/issues/851)
- simplify core log formatter ([4877029](https://github.com/IBM/kui/commit/4877029)), closes [#842](https://github.com/IBM/kui/issues/842)
- use 2-space indent for js-beautify ([f6f9795](https://github.com/IBM/kui/commit/f6f9795)), closes [#845](https://github.com/IBM/kui/issues/845)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.22.0 (2019-03-10)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.21.0 (2019-03-10)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.20.0 (2019-03-10)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.19.0 (2019-03-09)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** fix incorrect data-status-code when command is not resolved by any plugin and add help suggestion to command-not-found error ([01a288e](https://github.com/IBM/kui/commit/01a288e)), closes [#680](https://github.com/IBM/kui/issues/680)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.18.0 (2019-03-08)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins/plugin-openwhisk:** eliminate use of tiny fonts in activation list ([ae1fd6e](https://github.com/IBM/kui/commit/ae1fd6e)), closes [#684](https://github.com/IBM/kui/issues/684)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-openwhisk:** update wsk auth list to use row selection UI ([13eeb8d](https://github.com/IBM/kui/commit/13eeb8d)), closes [#690](https://github.com/IBM/kui/issues/690)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.17.0 (2019-03-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.16.0 (2019-03-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.15.0 (2019-03-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/app:** make annoying 'ok' invisible ([0a0f7f7](https://github.com/IBM/kui/commit/0a0f7f7)), closes [#597](https://github.com/IBM/kui/issues/597)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.14.0 (2019-02-28)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.13.0 (2019-02-28)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.12.0 (2019-02-27)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.11.0 (2019-02-22)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.10.0 (2019-02-21)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.9.0 (2019-02-21)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

## 0.8.1 (2019-02-20)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.8.0 (2019-02-20)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.7.0 (2019-02-19)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
- **plugin-openwhisk:** fix for activation pagination in webpack ([379fb0e](https://github.com/IBM/kui/commit/379fb0e)), closes [#474](https://github.com/IBM/kui/issues/474)
- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **plugin-openwhisk:** openwhisk action invoke not always blocking ([865cb4e](https://github.com/IBM/kui/commit/865cb4e)), closes [#419](https://github.com/IBM/kui/issues/419)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** remove debugging output from openwhisk-core ([eac7a13](https://github.com/IBM/kui/commit/eac7a13)), closes [#470](https://github.com/IBM/kui/issues/470)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.6.0 (2019-02-13)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** openwhisk cost calculator should use duration field in activations ([e6d084e](https://github.com/IBM/kui/commit/e6d084e)), closes [#420](https://github.com/IBM/kui/issues/420)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.5.0 (2019-02-04)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.4.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.3.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.2.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/IBM/kui/commit/c441c1c)), closes [#253](https://github.com/IBM/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/IBM/kui/commit/5d3286f)), closes [#263](https://github.com/IBM/kui/issues/263)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.1.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/starpit/kui/commit/a441c33)), closes [#287](https://github.com/starpit/kui/issues/287) [#286](https://github.com/starpit/kui/issues/286) [#289](https://github.com/starpit/kui/issues/289)
- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/starpit/kui/commit/14ac816)), closes [#332](https://github.com/starpit/kui/issues/332)
- **openwhisk:** add expandHomeDir when reading process.env.WSK_CONFIG_FILE ([c441c1c](https://github.com/starpit/kui/commit/c441c1c)), closes [#253](https://github.com/starpit/kui/issues/253)
- **openwhisk:** fix for misplaced test file ([5d3286f](https://github.com/starpit/kui/commit/5d3286f)), closes [#263](https://github.com/starpit/kui/issues/263)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/starpit/kui/commit/d6f474d)), closes [#355](https://github.com/starpit/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/starpit/kui/commit/530c278)), closes [#266](https://github.com/starpit/kui/issues/266) [#278](https://github.com/starpit/kui/issues/278) [#279](https://github.com/starpit/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/starpit/kui/commit/bc65dc2)), closes [#274](https://github.com/starpit/kui/issues/274)
