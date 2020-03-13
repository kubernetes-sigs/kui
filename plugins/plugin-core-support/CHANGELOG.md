# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.0.41](https://github.com/IBM/kui/compare/v4.5.0...v7.0.41) (2020-03-13)

### Bug Fixes

- **plugins/plugin-core-support:** each time about opens, another Configure menu is added ([6f1dac2](https://github.com/IBM/kui/commit/6f1dac2)), closes [#3934](https://github.com/IBM/kui/issues/3934)
- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.40](https://github.com/IBM/kui/compare/v4.5.0...v7.0.40) (2020-03-12)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.39](https://github.com/IBM/kui/compare/v4.5.0...v7.0.39) (2020-03-12)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.38](https://github.com/IBM/kui/compare/v4.5.0...v7.0.38) (2020-03-12)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.37](https://github.com/IBM/kui/compare/v4.5.0...v7.0.37) (2020-03-12)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.36](https://github.com/IBM/kui/compare/v4.5.0...v7.0.36) (2020-03-12)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.35](https://github.com/IBM/kui/compare/v4.5.0...v7.0.35) (2020-03-11)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.34](https://github.com/IBM/kui/compare/v4.5.0...v7.0.34) (2020-03-11)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.33](https://github.com/IBM/kui/compare/v4.5.0...v7.0.33) (2020-03-11)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.32](https://github.com/IBM/kui/compare/v4.5.0...v7.0.32) (2020-03-11)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.31](https://github.com/IBM/kui/compare/v4.5.0...v7.0.31) (2020-03-11)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.30](https://github.com/IBM/kui/compare/v4.5.0...v7.0.30) (2020-03-10)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.29](https://github.com/IBM/kui/compare/v4.5.0...v7.0.29) (2020-03-10)

### Bug Fixes

- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.28](https://github.com/IBM/kui/compare/v4.5.0...v7.0.28) (2020-03-09)

### Bug Fixes

- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.27](https://github.com/IBM/kui/compare/v4.5.0...v7.0.27) (2020-03-09)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.26](https://github.com/IBM/kui/compare/v4.5.0...v7.0.26) (2020-03-08)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.25](https://github.com/IBM/kui/compare/v4.5.0...v7.0.25) (2020-03-07)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.24](https://github.com/IBM/kui/compare/v4.5.0...v7.0.24) (2020-03-07)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.23](https://github.com/IBM/kui/compare/v4.5.0...v7.0.23) (2020-03-07)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.22](https://github.com/IBM/kui/compare/v4.5.0...v7.0.22) (2020-03-07)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.21](https://github.com/IBM/kui/compare/v4.5.0...v7.0.21) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.20](https://github.com/IBM/kui/compare/v4.5.0...v7.0.20) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.19](https://github.com/IBM/kui/compare/v7.0.18...v7.0.19) (2020-03-06)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [7.0.18](https://github.com/IBM/kui/compare/v7.0.17...v7.0.18) (2020-03-06)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [7.0.17](https://github.com/IBM/kui/compare/v4.5.0...v7.0.17) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.16](https://github.com/IBM/kui/compare/v4.5.0...v7.0.16) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.15](https://github.com/IBM/kui/compare/v4.5.0...v7.0.15) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.14](https://github.com/IBM/kui/compare/v4.5.0...v7.0.14) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.13](https://github.com/IBM/kui/compare/v4.5.0...v7.0.13) (2020-03-05)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.12](https://github.com/IBM/kui/compare/v4.5.0...v7.0.12) (2020-03-05)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.11](https://github.com/IBM/kui/compare/v4.5.0...v7.0.11) (2020-03-05)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.10](https://github.com/IBM/kui/compare/v4.5.0...v7.0.10) (2020-03-04)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.9](https://github.com/IBM/kui/compare/v4.5.0...v7.0.9) (2020-03-04)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.8](https://github.com/IBM/kui/compare/v4.5.0...v7.0.8) (2020-03-03)

### Bug Fixes

- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.7](https://github.com/IBM/kui/compare/v4.5.0...v7.0.7) (2020-03-03)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.6](https://github.com/IBM/kui/compare/v4.5.0...v7.0.6) (2020-03-03)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.5](https://github.com/IBM/kui/compare/v4.5.0...v7.0.5) (2020-03-02)

### Bug Fixes

- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.4](https://github.com/IBM/kui/compare/v4.5.0...v7.0.4) (2020-03-01)

### Bug Fixes

- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [7.0.3](https://github.com/IBM/kui/compare/v7.0.2...v7.0.3) (2020-03-01)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [7.0.2](https://github.com/IBM/kui/compare/v7.0.1...v7.0.2) (2020-02-28)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [7.0.1](https://github.com/IBM/kui/compare/v7.0.0...v7.0.1) (2020-02-28)

**Note:** Version bump only for package @kui-shell/plugin-core-support

# [7.0.0](https://github.com/IBM/kui/compare/v4.5.0...v7.0.0) (2020-02-28)

### Bug Fixes

- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-core-support

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/plugin-core-support
