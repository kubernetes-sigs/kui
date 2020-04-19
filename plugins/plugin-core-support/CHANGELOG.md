# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** each time about opens, another Configure menu is added ([6f1dac2](https://github.com/IBM/kui/commit/6f1dac2)), closes [#3934](https://github.com/IBM/kui/issues/3934)
- **plugins/plugin-core-support:** Terminal accordion svgs don't font zoom ([80caabd](https://github.com/IBM/kui/commit/80caabd)), closes [#4240](https://github.com/IBM/kui/issues/4240)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- font zooming issues ([5442532](https://github.com/IBM/kui/commit/5442532)), closes [#4176](https://github.com/IBM/kui/issues/4176) [#4177](https://github.com/IBM/kui/issues/4177)
- **plugins/plugin-core-support:** about shows wrong breadcrumbs ([aa05182](https://github.com/IBM/kui/commit/aa05182)), closes [#3972](https://github.com/IBM/kui/issues/3972)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- StatusStripe should respond to font zooming ([26ba443](https://github.com/IBM/kui/commit/26ba443)), closes [#4242](https://github.com/IBM/kui/issues/4242)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)

### BREAKING CHANGES

- removes support for inBrowserOk
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common
- **packages/core:** remove old EntitySpec support

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- **plugins/plugin-core-support:** Terminal accordion svgs don't font zoom ([80caabd](https://github.com/IBM/kui/commit/80caabd)), closes [#4240](https://github.com/IBM/kui/issues/4240)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- font zooming issues ([5442532](https://github.com/IBM/kui/commit/5442532)), closes [#4176](https://github.com/IBM/kui/issues/4176) [#4177](https://github.com/IBM/kui/issues/4177)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-core-support:** about shows wrong breadcrumbs ([aa05182](https://github.com/IBM/kui/commit/aa05182)), closes [#3972](https://github.com/IBM/kui/issues/3972)
- **plugins/plugin-core-support:** each time about opens, another Configure menu is added ([6f1dac2](https://github.com/IBM/kui/commit/6f1dac2)), closes [#3934](https://github.com/IBM/kui/issues/3934)
- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
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
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- StatusStripe should respond to font zooming ([26ba443](https://github.com/IBM/kui/commit/26ba443)), closes [#4242](https://github.com/IBM/kui/issues/4242)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common
- **packages/core:** remove old EntitySpec support

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- **plugins/plugin-core-support:** Terminal accordion svgs don't font zoom ([80caabd](https://github.com/IBM/kui/commit/80caabd)), closes [#4240](https://github.com/IBM/kui/issues/4240)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- font zooming issues ([5442532](https://github.com/IBM/kui/commit/5442532)), closes [#4176](https://github.com/IBM/kui/issues/4176) [#4177](https://github.com/IBM/kui/issues/4177)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-core-support:** about shows wrong breadcrumbs ([aa05182](https://github.com/IBM/kui/commit/aa05182)), closes [#3972](https://github.com/IBM/kui/issues/3972)
- **plugins/plugin-core-support:** each time about opens, another Configure menu is added ([6f1dac2](https://github.com/IBM/kui/commit/6f1dac2)), closes [#3934](https://github.com/IBM/kui/issues/3934)
- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
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
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- StatusStripe should respond to font zooming ([26ba443](https://github.com/IBM/kui/commit/26ba443)), closes [#4242](https://github.com/IBM/kui/issues/4242)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common
- **packages/core:** remove old EntitySpec support

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- **plugins/plugin-core-support:** Terminal accordion svgs don't font zoom ([80caabd](https://github.com/IBM/kui/commit/80caabd)), closes [#4240](https://github.com/IBM/kui/issues/4240)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- font zooming issues ([5442532](https://github.com/IBM/kui/commit/5442532)), closes [#4176](https://github.com/IBM/kui/issues/4176) [#4177](https://github.com/IBM/kui/issues/4177)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-core-support:** about shows wrong breadcrumbs ([aa05182](https://github.com/IBM/kui/commit/aa05182)), closes [#3972](https://github.com/IBM/kui/issues/3972)
- **plugins/plugin-core-support:** each time about opens, another Configure menu is added ([6f1dac2](https://github.com/IBM/kui/commit/6f1dac2)), closes [#3934](https://github.com/IBM/kui/issues/3934)
- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
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
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- StatusStripe should respond to font zooming ([26ba443](https://github.com/IBM/kui/commit/26ba443)), closes [#4242](https://github.com/IBM/kui/issues/4242)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common
- **packages/core:** remove old EntitySpec support

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- font zooming issues ([5442532](https://github.com/IBM/kui/commit/5442532)), closes [#4176](https://github.com/IBM/kui/issues/4176) [#4177](https://github.com/IBM/kui/issues/4177)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-core-support:** about shows wrong breadcrumbs ([aa05182](https://github.com/IBM/kui/commit/aa05182)), closes [#3972](https://github.com/IBM/kui/issues/3972)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** each time about opens, another Configure menu is added ([6f1dac2](https://github.com/IBM/kui/commit/6f1dac2)), closes [#3934](https://github.com/IBM/kui/issues/3934)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common
- **packages/core:** remove old EntitySpec support

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-core-support:** about shows wrong breadcrumbs ([aa05182](https://github.com/IBM/kui/commit/aa05182)), closes [#3972](https://github.com/IBM/kui/issues/3972)
- **plugins/plugin-core-support:** clicking on rows of theme table results in onccuous console error message ([942e800](https://github.com/IBM/kui/commit/942e800)), closes [#3779](https://github.com/IBM/kui/issues/3779)
- **plugins/plugin-core-support:** clicking on theme name should not change theme ([71f7fd2](https://github.com/IBM/kui/commit/71f7fd2)), closes [#3804](https://github.com/IBM/kui/issues/3804)
- **plugins/plugin-core-support:** each time about opens, another Configure menu is added ([6f1dac2](https://github.com/IBM/kui/commit/6f1dac2)), closes [#3934](https://github.com/IBM/kui/issues/3934)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- reduce expense of preloader on webapp init ([00b87c0](https://github.com/IBM/kui/commit/00b87c0)), closes [#3286](https://github.com/IBM/kui/issues/3286)
- regression due to introduced cycle dependendence ([d1799b0](https://github.com/IBM/kui/commit/d1799b0)), closes [#3422](https://github.com/IBM/kui/issues/3422)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-core-support:** remove old unused css ([e04536f](https://github.com/IBM/kui/commit/e04536f)), closes [#3748](https://github.com/IBM/kui/issues/3748)
- remove screenshot strings out of core-support i18n resource file ([65fccb8](https://github.com/IBM/kui/commit/65fccb8)), closes [#3715](https://github.com/IBM/kui/issues/3715)
- **packages/core:** cell onclick should be on inner ([45d2975](https://github.com/IBM/kui/commit/45d2975)), closes [#3518](https://github.com/IBM/kui/issues/3518)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-core-support:** getting started text is stretched in non-English ([1413a26](https://github.com/IBM/kui/commit/1413a26))
- **plugins/plugin-core-support:** repl screenshot button does not capture streaming output ([a4aa544](https://github.com/IBM/kui/commit/a4aa544)), closes [#3606](https://github.com/IBM/kui/issues/3606)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **plugins/plugin-core-support:** command `!!` returns console error ([0a6c140](https://github.com/IBM/kui/commit/0a6c140)), closes [#2893](https://github.com/IBM/kui/issues/2893)
- **plugins/plugin-core-support:** tab completion versus cursor motion ([d428a3e](https://github.com/IBM/kui/commit/d428a3e)), closes [#3087](https://github.com/IBM/kui/issues/3087)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)
- **plugins/plugin-core-support:** switch tabs via keyboard shortcuts ([4f2bb76](https://github.com/IBM/kui/commit/4f2bb76)), closes [#1242](https://github.com/IBM/kui/issues/1242)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common
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
