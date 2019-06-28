# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.34.0 (2019-06-17)

### Bug Fixes

- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- **packages/app:** remove stale entries from OS Help menu ([21f59c5](https://github.com/IBM/kui/commit/21f59c5)), closes [#1703](https://github.com/IBM/kui/issues/1703)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** ctrl+F responds in both editor and kui ([5b80a28](https://github.com/IBM/kui/commit/5b80a28)), closes [#1573](https://github.com/IBM/kui/issues/1573)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- **plugins/plugin-core-support:** exit command should close tab ([ad468c2](https://github.com/IBM/kui/commit/ad468c2)), closes [#1384](https://github.com/IBM/kui/issues/1384)
- **plugins/plugin-core-support:** font zooming versus shift key ([e255680](https://github.com/IBM/kui/commit/e255680)), closes [#1357](https://github.com/IBM/kui/issues/1357)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** make sure new text is visible after tab completion ([527e874](https://github.com/IBM/kui/commit/527e874)), closes [#1367](https://github.com/IBM/kui/issues/1367)
- **plugins/plugin-core-support:** new tab from pty active tab ([5d963e0](https://github.com/IBM/kui/commit/5d963e0)), closes [#1298](https://github.com/IBM/kui/issues/1298)
- **plugins/plugin-core-support:** per-tab state ([17c8279](https://github.com/IBM/kui/commit/17c8279)), closes [#1299](https://github.com/IBM/kui/issues/1299)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- **plugins/plugin-core-support:** PTY content escapes to new tabs ([28c4344](https://github.com/IBM/kui/commit/28c4344)), closes [#1263](https://github.com/IBM/kui/issues/1263)
- **plugins/plugin-core-support:** quit command versus auth ([f204a11](https://github.com/IBM/kui/commit/f204a11)), closes [#1218](https://github.com/IBM/kui/issues/1218)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** repl screenshot snap bugs ([61e347a](https://github.com/IBM/kui/commit/61e347a)), closes [#1141](https://github.com/IBM/kui/issues/1141)
- **plugins/plugin-core-support:** reverse-i-search bugs ([895ae59](https://github.com/IBM/kui/commit/895ae59)), closes [#1559](https://github.com/IBM/kui/issues/1559)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** screenshot of repl output is glitchy ([665c7fc](https://github.com/IBM/kui/commit/665c7fc)), closes [#1519](https://github.com/IBM/kui/issues/1519)
- **plugins/plugin-core-support:** screenshot sidecar is not snapping to content ([e5a633f](https://github.com/IBM/kui/commit/e5a633f)), closes [#1257](https://github.com/IBM/kui/issues/1257)
- **plugins/plugin-core-support:** screenshot snapping and escape handling fixes ([1383455](https://github.com/IBM/kui/commit/1383455)), closes [#1442](https://github.com/IBM/kui/issues/1442)
- **plugins/plugin-core-support:** sidecar screenshot of tables too wide ([b82f1d6](https://github.com/IBM/kui/commit/b82f1d6)), closes [#1621](https://github.com/IBM/kui/issues/1621)
- **plugins/plugin-core-support:** tab completion of dirs versus ~ ([c6190c5](https://github.com/IBM/kui/commit/c6190c5)), closes [#1483](https://github.com/IBM/kui/issues/1483)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- **plugins/plugin-core-support:** tab completion versus spaces ([4ad5c40](https://github.com/IBM/kui/commit/4ad5c40)), closes [#1276](https://github.com/IBM/kui/issues/1276)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- forbid tab focus more carefully for elements that should not receive focus ([faa3b86](https://github.com/IBM/kui/commit/faa3b86)), closes [#1160](https://github.com/IBM/kui/issues/1160)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- multiple fixes for tab management ([c125f7f](https://github.com/IBM/kui/commit/c125f7f)), closes [#1493](https://github.com/IBM/kui/issues/1493)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- remove UI inconsistencies with cursor block ([7db0680](https://github.com/IBM/kui/commit/7db0680)), closes [#1657](https://github.com/IBM/kui/issues/1657)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- screenshot sidecar versus escape key ([559bd18](https://github.com/IBM/kui/commit/559bd18)), closes [#1445](https://github.com/IBM/kui/issues/1445)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various fixes for tab management ([f7817e3](https://github.com/IBM/kui/commit/f7817e3)), closes [#1411](https://github.com/IBM/kui/issues/1411)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- add tekton sample inputs ([f8a212a](https://github.com/IBM/kui/commit/f8a212a)), closes [#1499](https://github.com/IBM/kui/issues/1499)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- git branch tab completion ([8be1073](https://github.com/IBM/kui/commit/8be1073)), closes [#1735](https://github.com/IBM/kui/issues/1735)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- tab close button ([b4d0d0d](https://github.com/IBM/kui/commit/b4d0d0d)), closes [#1739](https://github.com/IBM/kui/issues/1739)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- **packages/app:** remove theme button from UI ([3e2765e](https://github.com/IBM/kui/commit/3e2765e)), closes [#1713](https://github.com/IBM/kui/issues/1713)
- top tab stripe ([6167a22](https://github.com/IBM/kui/commit/6167a22)), closes [#1699](https://github.com/IBM/kui/issues/1699)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)
- **plugin-core-support:** Version gets build info ([56493a5](https://github.com/IBM/kui/commit/56493a5)), closes [#1003](https://github.com/IBM/kui/issues/1003)
- **plugins/plugin-k8s:** tab completion ([199c623](https://github.com/IBM/kui/commit/199c623)), closes [#1729](https://github.com/IBM/kui/issues/1729) [#1731](https://github.com/IBM/kui/issues/1731)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)

# 0.33.0 (2019-05-22)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** new tab from pty active tab ([5d963e0](https://github.com/IBM/kui/commit/5d963e0)), closes [#1298](https://github.com/IBM/kui/issues/1298)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- **plugins/plugin-core-support:** exit command should close tab ([ad468c2](https://github.com/IBM/kui/commit/ad468c2)), closes [#1384](https://github.com/IBM/kui/issues/1384)
- **plugins/plugin-core-support:** font zooming versus shift key ([e255680](https://github.com/IBM/kui/commit/e255680)), closes [#1357](https://github.com/IBM/kui/issues/1357)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** make sure new text is visible after tab completion ([527e874](https://github.com/IBM/kui/commit/527e874)), closes [#1367](https://github.com/IBM/kui/issues/1367)
- **plugins/plugin-core-support:** per-tab state ([17c8279](https://github.com/IBM/kui/commit/17c8279)), closes [#1299](https://github.com/IBM/kui/issues/1299)
- **plugins/plugin-core-support:** PTY content escapes to new tabs ([28c4344](https://github.com/IBM/kui/commit/28c4344)), closes [#1263](https://github.com/IBM/kui/issues/1263)
- **plugins/plugin-core-support:** quit command versus auth ([f204a11](https://github.com/IBM/kui/commit/f204a11)), closes [#1218](https://github.com/IBM/kui/issues/1218)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** repl screenshot snap bugs ([61e347a](https://github.com/IBM/kui/commit/61e347a)), closes [#1141](https://github.com/IBM/kui/issues/1141)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** screenshot sidecar is not snapping to content ([e5a633f](https://github.com/IBM/kui/commit/e5a633f)), closes [#1257](https://github.com/IBM/kui/issues/1257)
- **plugins/plugin-core-support:** screenshot snapping and escape handling fixes ([1383455](https://github.com/IBM/kui/commit/1383455)), closes [#1442](https://github.com/IBM/kui/issues/1442)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** tab completion versus spaces ([4ad5c40](https://github.com/IBM/kui/commit/4ad5c40)), closes [#1276](https://github.com/IBM/kui/issues/1276)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- forbid tab focus more carefully for elements that should not receive focus ([faa3b86](https://github.com/IBM/kui/commit/faa3b86)), closes [#1160](https://github.com/IBM/kui/issues/1160)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- screenshot sidecar versus escape key ([559bd18](https://github.com/IBM/kui/commit/559bd18)), closes [#1445](https://github.com/IBM/kui/issues/1445)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various fixes for tab management ([f7817e3](https://github.com/IBM/kui/commit/f7817e3)), closes [#1411](https://github.com/IBM/kui/issues/1411)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- **plugin-core-support:** Version gets build info ([56493a5](https://github.com/IBM/kui/commit/56493a5)), closes [#1003](https://github.com/IBM/kui/issues/1003)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.32.0 (2019-05-08)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** PTY content escapes to new tabs ([28c4344](https://github.com/IBM/kui/commit/28c4344)), closes [#1263](https://github.com/IBM/kui/issues/1263)
- **plugins/plugin-core-support:** quit command versus auth ([f204a11](https://github.com/IBM/kui/commit/f204a11)), closes [#1218](https://github.com/IBM/kui/issues/1218)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** repl screenshot snap bugs ([61e347a](https://github.com/IBM/kui/commit/61e347a)), closes [#1141](https://github.com/IBM/kui/issues/1141)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** screenshot sidecar is not snapping to content ([e5a633f](https://github.com/IBM/kui/commit/e5a633f)), closes [#1257](https://github.com/IBM/kui/issues/1257)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- forbid tab focus more carefully for elements that should not receive focus ([faa3b86](https://github.com/IBM/kui/commit/faa3b86)), closes [#1160](https://github.com/IBM/kui/issues/1160)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- **plugin-core-support:** Version gets build info ([56493a5](https://github.com/IBM/kui/commit/56493a5)), closes [#1003](https://github.com/IBM/kui/issues/1003)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.31.0 (2019-05-07)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** PTY content escapes to new tabs ([28c4344](https://github.com/IBM/kui/commit/28c4344)), closes [#1263](https://github.com/IBM/kui/issues/1263)
- **plugins/plugin-core-support:** quit command versus auth ([f204a11](https://github.com/IBM/kui/commit/f204a11)), closes [#1218](https://github.com/IBM/kui/issues/1218)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** repl screenshot snap bugs ([61e347a](https://github.com/IBM/kui/commit/61e347a)), closes [#1141](https://github.com/IBM/kui/issues/1141)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** screenshot sidecar is not snapping to content ([e5a633f](https://github.com/IBM/kui/commit/e5a633f)), closes [#1257](https://github.com/IBM/kui/issues/1257)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- forbid tab focus more carefully for elements that should not receive focus ([faa3b86](https://github.com/IBM/kui/commit/faa3b86)), closes [#1160](https://github.com/IBM/kui/issues/1160)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- **plugin-core-support:** Version gets build info ([56493a5](https://github.com/IBM/kui/commit/56493a5)), closes [#1003](https://github.com/IBM/kui/issues/1003)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.30.0 (2019-05-06)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** PTY content escapes to new tabs ([28c4344](https://github.com/IBM/kui/commit/28c4344)), closes [#1263](https://github.com/IBM/kui/issues/1263)
- **plugins/plugin-core-support:** quit command versus auth ([f204a11](https://github.com/IBM/kui/commit/f204a11)), closes [#1218](https://github.com/IBM/kui/issues/1218)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** repl screenshot snap bugs ([61e347a](https://github.com/IBM/kui/commit/61e347a)), closes [#1141](https://github.com/IBM/kui/issues/1141)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** screenshot sidecar is not snapping to content ([e5a633f](https://github.com/IBM/kui/commit/e5a633f)), closes [#1257](https://github.com/IBM/kui/issues/1257)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- forbid tab focus more carefully for elements that should not receive focus ([faa3b86](https://github.com/IBM/kui/commit/faa3b86)), closes [#1160](https://github.com/IBM/kui/issues/1160)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- **plugin-core-support:** Version gets build info ([56493a5](https://github.com/IBM/kui/commit/56493a5)), closes [#1003](https://github.com/IBM/kui/issues/1003)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.29.0 (2019-05-06)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** PTY content escapes to new tabs ([28c4344](https://github.com/IBM/kui/commit/28c4344)), closes [#1263](https://github.com/IBM/kui/issues/1263)
- **plugins/plugin-core-support:** quit command versus auth ([f204a11](https://github.com/IBM/kui/commit/f204a11)), closes [#1218](https://github.com/IBM/kui/issues/1218)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** repl screenshot snap bugs ([61e347a](https://github.com/IBM/kui/commit/61e347a)), closes [#1141](https://github.com/IBM/kui/issues/1141)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** screenshot sidecar is not snapping to content ([e5a633f](https://github.com/IBM/kui/commit/e5a633f)), closes [#1257](https://github.com/IBM/kui/issues/1257)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- forbid tab focus more carefully for elements that should not receive focus ([faa3b86](https://github.com/IBM/kui/commit/faa3b86)), closes [#1160](https://github.com/IBM/kui/issues/1160)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- **plugin-core-support:** Version gets build info ([56493a5](https://github.com/IBM/kui/commit/56493a5)), closes [#1003](https://github.com/IBM/kui/issues/1003)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.28.0 (2019-05-04)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** PTY content escapes to new tabs ([28c4344](https://github.com/IBM/kui/commit/28c4344)), closes [#1263](https://github.com/IBM/kui/issues/1263)
- **plugins/plugin-core-support:** quit command versus auth ([f204a11](https://github.com/IBM/kui/commit/f204a11)), closes [#1218](https://github.com/IBM/kui/issues/1218)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** repl screenshot snap bugs ([61e347a](https://github.com/IBM/kui/commit/61e347a)), closes [#1141](https://github.com/IBM/kui/issues/1141)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** screenshot sidecar is not snapping to content ([e5a633f](https://github.com/IBM/kui/commit/e5a633f)), closes [#1257](https://github.com/IBM/kui/issues/1257)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- forbid tab focus more carefully for elements that should not receive focus ([faa3b86](https://github.com/IBM/kui/commit/faa3b86)), closes [#1160](https://github.com/IBM/kui/issues/1160)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)
- **plugin-core-support:** Version gets build info ([56493a5](https://github.com/IBM/kui/commit/56493a5)), closes [#1003](https://github.com/IBM/kui/issues/1003)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)

# 0.27.0 (2019-04-26)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** quit command versus auth ([f204a11](https://github.com/IBM/kui/commit/f204a11)), closes [#1218](https://github.com/IBM/kui/issues/1218)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** repl screenshot snap bugs ([61e347a](https://github.com/IBM/kui/commit/61e347a)), closes [#1141](https://github.com/IBM/kui/issues/1141)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- forbid tab focus more carefully for elements that should not receive focus ([faa3b86](https://github.com/IBM/kui/commit/faa3b86)), closes [#1160](https://github.com/IBM/kui/issues/1160)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.26.0 (2019-04-23)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/kui-builder:** webpack versus linux ([ed285f3](https://github.com/IBM/kui/commit/ed285f3)), closes [#1162](https://github.com/IBM/kui/issues/1162)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** repl screenshot snap bugs ([61e347a](https://github.com/IBM/kui/commit/61e347a)), closes [#1141](https://github.com/IBM/kui/issues/1141)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- forbid tab focus more carefully for elements that should not receive focus ([faa3b86](https://github.com/IBM/kui/commit/faa3b86)), closes [#1160](https://github.com/IBM/kui/issues/1160)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.25.0 (2019-04-10)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clear command needs inBrowserOk:true ([fc86f0f](https://github.com/IBM/kui/commit/fc86f0f)), closes [#960](https://github.com/IBM/kui/issues/960)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** screenshot of repl does not squish repl-block ([a4a7dd7](https://github.com/IBM/kui/commit/a4a7dd7)), closes [#999](https://github.com/IBM/kui/issues/999)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- further screenshot ui improvements ([7ec7808](https://github.com/IBM/kui/commit/7ec7808)), closes [#916](https://github.com/IBM/kui/issues/916)
- improved about window UI ([9fe5a51](https://github.com/IBM/kui/commit/9fe5a51)), closes [#1103](https://github.com/IBM/kui/issues/1103)
- increase contrast of screenshot "ok" icon ([cc2e5d4](https://github.com/IBM/kui/commit/cc2e5d4)), closes [#914](https://github.com/IBM/kui/issues/914)
- make sidecar header repl look more like a repl ([f01e3a3](https://github.com/IBM/kui/commit/f01e3a3)), closes [#912](https://github.com/IBM/kui/issues/912)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot should respect scrollTop ([3d7e04c](https://github.com/IBM/kui/commit/3d7e04c)), closes [#970](https://github.com/IBM/kui/issues/970)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- tab management should work when tabs are active ([615213d](https://github.com/IBM/kui/commit/615213d)), closes [#1067](https://github.com/IBM/kui/issues/1067)
- two reverse-i-search issues ([69fd8bc](https://github.com/IBM/kui/commit/69fd8bc)), closes [#1011](https://github.com/IBM/kui/issues/1011)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** queue up input while commands are executed ([51ec7e9](https://github.com/IBM/kui/commit/51ec7e9)), closes [#1044](https://github.com/IBM/kui/issues/1044)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- pty ([a3ad81d](https://github.com/IBM/kui/commit/a3ad81d)), closes [#572](https://github.com/IBM/kui/issues/572) [#414](https://github.com/IBM/kui/issues/414)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.24.0 (2019-03-19)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.23.0 (2019-03-19)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** a few more small tweaks to screenshot UI ([a267d42](https://github.com/IBM/kui/commit/a267d42)), closes [#892](https://github.com/IBM/kui/issues/892)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** clicking on current theme, editor loses theme ([4eff85f](https://github.com/IBM/kui/commit/4eff85f)), closes [#799](https://github.com/IBM/kui/issues/799)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reduce size of about icons ([d0a0ccc](https://github.com/IBM/kui/commit/d0a0ccc)), closes [#758](https://github.com/IBM/kui/issues/758)
- **plugins/plugin-core-support:** reduce use of raw require in screenshot ([346ab5a](https://github.com/IBM/kui/commit/346ab5a)), closes [#895](https://github.com/IBM/kui/issues/895)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** repl screenshot button should snap tightly ([34e66e5](https://github.com/IBM/kui/commit/34e66e5)), closes [#791](https://github.com/IBM/kui/issues/791)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refine screenshot squishing behavior ([9a08eb7](https://github.com/IBM/kui/commit/9a08eb7)), closes [#858](https://github.com/IBM/kui/issues/858)
- refinements to popup UI ([a6cab89](https://github.com/IBM/kui/commit/a6cab89)), closes [#874](https://github.com/IBM/kui/issues/874)
- repl should use outer scrolling when in popup mode ([434ed21](https://github.com/IBM/kui/commit/434ed21)), closes [#870](https://github.com/IBM/kui/issues/870)
- resolve multiple issues with popups ([09c252f](https://github.com/IBM/kui/commit/09c252f)), closes [#872](https://github.com/IBM/kui/issues/872)
- screenshot UI improvements ([0f4e970](https://github.com/IBM/kui/commit/0f4e970)), closes [#890](https://github.com/IBM/kui/issues/890)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.22.0 (2019-03-10)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.21.0 (2019-03-10)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- user should be able to select text in sidecar header ([9a8a2e2](https://github.com/IBM/kui/commit/9a8a2e2)), closes [#741](https://github.com/IBM/kui/issues/741)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- switch about window to use a sidecar DOM ([90d3ad3](https://github.com/IBM/kui/commit/90d3ad3)), closes [#746](https://github.com/IBM/kui/issues/746)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.20.0 (2019-03-10)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.19.0 (2019-03-09)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- various small fixes for tab UI ([c41d388](https://github.com/IBM/kui/commit/c41d388)), closes [#717](https://github.com/IBM/kui/issues/717)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.18.0 (2019-03-08)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **plugins/plugin-core-support:** text search stripe versus dark mode ([befb53c](https://github.com/IBM/kui/commit/befb53c)), closes [#657](https://github.com/IBM/kui/issues/657)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- screenshots of repl output should have padding ([1b89795](https://github.com/IBM/kui/commit/1b89795)), closes [#668](https://github.com/IBM/kui/issues/668)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.17.0 (2019-03-06)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)

# 0.16.0 (2019-03-06)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)

# 0.15.0 (2019-03-06)

### Bug Fixes

- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** clicking again on a theme results in no theme ([14f28ca](https://github.com/IBM/kui/commit/14f28ca)), closes [#630](https://github.com/IBM/kui/issues/630)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** help command should not require proxy ([2ffb2f8](https://github.com/IBM/kui/commit/2ffb2f8)), closes [#622](https://github.com/IBM/kui/issues/622)
- **plugins/plugin-core-support:** reloading with multiple windows results in no theme ([61b722e](https://github.com/IBM/kui/commit/61b722e)), closes [#640](https://github.com/IBM/kui/issues/640)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- color contrast issues with dark mode ([15afe23](https://github.com/IBM/kui/commit/15afe23)), closes [#605](https://github.com/IBM/kui/issues/605)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- smoother transitions as themes switch ([1ad91c1](https://github.com/IBM/kui/commit/1ad91c1)), closes [#613](https://github.com/IBM/kui/issues/613)
- switch to base16 theme scheme ([5c6a88a](https://github.com/IBM/kui/commit/5c6a88a)), closes [#600](https://github.com/IBM/kui/issues/600)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-wrk:** wrk plugin ([d39a331](https://github.com/IBM/kui/commit/d39a331)), closes [#624](https://github.com/IBM/kui/issues/624)

# 0.14.0 (2019-02-28)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.13.0 (2019-02-28)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.12.0 (2019-02-27)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/kui-builder:** theming fixes for webpack ([5254b73](https://github.com/IBM/kui/commit/5254b73)), closes [#524](https://github.com/IBM/kui/issues/524)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
- **plugins/plugin-core-support:** add missing deps to package.json ([1eb8704](https://github.com/IBM/kui/commit/1eb8704)), closes [#563](https://github.com/IBM/kui/issues/563)
- **plugins/plugin-core-support:** dark mode fixes for about ([fbd75e2](https://github.com/IBM/kui/commit/fbd75e2)), closes [#540](https://github.com/IBM/kui/issues/540)
- **plugins/plugin-core-support:** tab completion should support dot files ([507b86f](https://github.com/IBM/kui/commit/507b86f)), closes [#547](https://github.com/IBM/kui/issues/547)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.11.0 (2019-02-22)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.10.0 (2019-02-21)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.9.0 (2019-02-21)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

## 0.8.1 (2019-02-20)

### Bug Fixes

- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.8.0 (2019-02-20)

### Bug Fixes

- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.7.0 (2019-02-19)

### Bug Fixes

- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.6.0 (2019-02-13)

### Bug Fixes

- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.5.0 (2019-02-04)

### Bug Fixes

- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.4.0 (2019-02-03)

### Bug Fixes

- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.3.0 (2019-02-03)

### Bug Fixes

- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.2.0 (2019-02-03)

### Bug Fixes

- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.1.0 (2019-02-03)

### Bug Fixes

- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/starpit/kui/commit/d1b4e75)), closes [#329](https://github.com/starpit/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/starpit/kui/commit/d6f474d)), closes [#355](https://github.com/starpit/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/starpit/kui/commit/530c278)), closes [#266](https://github.com/starpit/kui/issues/266) [#278](https://github.com/starpit/kui/issues/278) [#279](https://github.com/starpit/kui/issues/279)
