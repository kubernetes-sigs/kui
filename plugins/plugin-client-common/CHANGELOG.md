# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- improve contrast of top tab stripe versus sidecar title stripe ([ee9eb63](https://github.com/IBM/kui/commit/ee9eb63)), closes [#3956](https://github.com/IBM/kui/issues/3956)
- improve presentation with narrow windows ([cb23c63](https://github.com/IBM/kui/commit/cb23c63)), closes [#3954](https://github.com/IBM/kui/issues/3954)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-client-common:** active PTY easily loses focus ([8ca12e8](https://github.com/IBM/kui/commit/8ca12e8)), closes [#3945](https://github.com/IBM/kui/issues/3945)
- **plugins/plugin-client-common:** horizontal scrollbar can flash on and off ([3c26eca](https://github.com/IBM/kui/commit/3c26eca)), closes [#3937](https://github.com/IBM/kui/issues/3937)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- **plugins/plugin-client-common:** clean up screenshot notification UI ([9ddec1a](https://github.com/IBM/kui/commit/9ddec1a)), closes [#3699](https://github.com/IBM/kui/issues/3699)
- **plugins/plugin-client-common:** improve error handling of hackFocus ([a16b680](https://github.com/IBM/kui/commit/a16b680)), closes [#3769](https://github.com/IBM/kui/issues/3769)
- **plugins/plugin-client-common:** improve error handling of Scalar.tsx ([53cd8e5](https://github.com/IBM/kui/commit/53cd8e5)), closes [#3781](https://github.com/IBM/kui/issues/3781)
- **plugins/plugin-client-common:** improve Markdown styling of ul ([e60d592](https://github.com/IBM/kui/commit/e60d592)), closes [#3865](https://github.com/IBM/kui/issues/3865)
- **plugins/plugin-client-common:** misaligned svgs in paginated table ([7a201c2](https://github.com/IBM/kui/commit/7a201c2)), closes [#3702](https://github.com/IBM/kui/issues/3702)
- **plugins/plugin-client-common:** small tweaks to h3 headers in Markdown content ([3eee334](https://github.com/IBM/kui/commit/3eee334)), closes [#3918](https://github.com/IBM/kui/issues/3918)
- **plugins/plugin-client-common:** SplitPane layout issues with electron 7 ([b81b75d](https://github.com/IBM/kui/commit/b81b75d)), closes [#3914](https://github.com/IBM/kui/issues/3914)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- restore support for quiet table clicks ([b8d4e51](https://github.com/IBM/kui/commit/b8d4e51)), closes [#3894](https://github.com/IBM/kui/issues/3894)
- **plugins/plugin-client-common:** clear console should restore active prompt value ([23afefd](https://github.com/IBM/kui/commit/23afefd)), closes [#3797](https://github.com/IBM/kui/issues/3797)
- **plugins/plugin-client-common:** closing first tab can close entire window ([6ef836d](https://github.com/IBM/kui/commit/6ef836d)), closes [#3896](https://github.com/IBM/kui/issues/3896)
- improve Terminal horizontal alignment for carbon themes ([fe7c8bb](https://github.com/IBM/kui/commit/fe7c8bb)), closes [#3891](https://github.com/IBM/kui/issues/3891)
- **plugins/plugin-client-common:** improve Scalar renderer error handling ([c42fd6a](https://github.com/IBM/kui/commit/c42fd6a)), closes [#3765](https://github.com/IBM/kui/issues/3765)
- **plugins/plugin-client-common:** improved fix for status stripe icon spacing ([fe9eab2](https://github.com/IBM/kui/commit/fe9eab2)), closes [#3724](https://github.com/IBM/kui/issues/3724)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-client-common:** odd border-left in prompt for light themes ([a9f8af3](https://github.com/IBM/kui/commit/a9f8af3)), closes [#3752](https://github.com/IBM/kui/issues/3752)
- **plugins/plugin-client-common:** remove old min-width-date-like css class ([b075b7b](https://github.com/IBM/kui/commit/b075b7b)), closes [#3767](https://github.com/IBM/kui/issues/3767)
- **plugins/plugin-client-common:** screenshot notification never goes away ([9a8ad4f](https://github.com/IBM/kui/commit/9a8ad4f)), closes [#3705](https://github.com/IBM/kui/issues/3705)
- **plugins/plugin-client-common:** shorten top tabs ([da02499](https://github.com/IBM/kui/commit/da02499)), closes [#3872](https://github.com/IBM/kui/issues/3872)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- reverse-i-search does not always terminate with current completion ([e05d905](https://github.com/IBM/kui/commit/e05d905)), closes [#3799](https://github.com/IBM/kui/issues/3799)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- TabContent constructor sometimes calls this.setState ([5a72470](https://github.com/IBM/kui/commit/5a72470)), closes [#3844](https://github.com/IBM/kui/issues/3844)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** active+processing tab is not properly colored ([56bc759](https://github.com/IBM/kui/commit/56bc759)), closes [#3827](https://github.com/IBM/kui/issues/3827)
- **plugins/plugin-client-common:** improve focus preservation of active prompt ([1ef2153](https://github.com/IBM/kui/commit/1ef2153)), closes [#3805](https://github.com/IBM/kui/issues/3805)
- **plugins/plugin-client-common:** inBrowser, prompt should be basename ([f47d03c](https://github.com/IBM/kui/commit/f47d03c)), closes [#3815](https://github.com/IBM/kui/issues/3815)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- **plugins/plugin-client-common:** status stripe left-pad missing ([58d0613](https://github.com/IBM/kui/commit/58d0613)), closes [#3724](https://github.com/IBM/kui/issues/3724)
- **plugins/plugin-client-common:** stop using value prop for uncontrolled input element ([fdbfaff](https://github.com/IBM/kui/commit/fdbfaff)), closes [#3778](https://github.com/IBM/kui/issues/3778)
- **plugins/plugin-client-common:** streaming output does not scroll terminal ([63891d6](https://github.com/IBM/kui/commit/63891d6)), closes [#3760](https://github.com/IBM/kui/issues/3760)
- **plugins/plugin-client-common:** Tab uses strings rather than numbers for Close16 dimensions ([786447c](https://github.com/IBM/kui/commit/786447c)), closes [#3771](https://github.com/IBM/kui/issues/3771)
- **plugins/plugin-client-common:** Tab.tsx does not render "processing" state ([1ae0ab5](https://github.com/IBM/kui/commit/1ae0ab5)), closes [#3646](https://github.com/IBM/kui/issues/3646)
- **plugins/plugin-client-common:** text-selection is not working in repl ([5672e02](https://github.com/IBM/kui/commit/5672e02)), closes [#3738](https://github.com/IBM/kui/issues/3738) [#3739](https://github.com/IBM/kui/issues/3739) [#3741](https://github.com/IBM/kui/issues/3741)
- **plugins/plugin-client-common:** top tabs disappear with narrower windows ([4184247](https://github.com/IBM/kui/commit/4184247)), closes [#3842](https://github.com/IBM/kui/issues/3842)
- **plugins/plugin-client-common:** When command completes, TopTab doesn't change the process state ([f8139ac](https://github.com/IBM/kui/commit/f8139ac)), closes [#3707](https://github.com/IBM/kui/issues/3707)
- **plugins/plugin-client-default:** improve table layout for radio tables ([75e1e70](https://github.com/IBM/kui/commit/75e1e70)), closes [#3596](https://github.com/IBM/kui/issues/3596)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- **plugins/plugin-client-common:** accordion blocks in Terminal ([eb2f285](https://github.com/IBM/kui/commit/eb2f285)), closes [#3726](https://github.com/IBM/kui/issues/3726)
- **plugins/plugin-client-common:** add styling for blockquotes in Markdown ([b3fa5c6](https://github.com/IBM/kui/commit/b3fa5c6)), closes [#3925](https://github.com/IBM/kui/issues/3925)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-client-common

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-client-common

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

### Bug Fixes

- **plugins/plugin-client-default:** improve table layout for radio tables ([308d7bc](https://github.com/IBM/kui/commit/308d7bc)), closes [#3596](https://github.com/IBM/kui/issues/3596)

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-client-common

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-client-common

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
