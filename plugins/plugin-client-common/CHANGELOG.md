# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- **plugins/plugin-client-common:** in popup mode, make sure repl is visible after command execution ([0134952](https://github.com/IBM/kui/commit/0134952)), closes [#4183](https://github.com/IBM/kui/issues/4183)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-client-common:** table bottom toolbar missing grid buttons, poor alignment and height ([44e1018](https://github.com/IBM/kui/commit/44e1018)), closes [#4133](https://github.com/IBM/kui/issues/4133)
- **plugins/plugin-client-common:** with narrow windows, hide sidecar resize thumb ([a7c72e8](https://github.com/IBM/kui/commit/a7c72e8)), closes [#4179](https://github.com/IBM/kui/issues/4179)
- breadcrumb in TopNavSidecar isn't zoomable ([2642f39](https://github.com/IBM/kui/commit/2642f39)), closes [#4091](https://github.com/IBM/kui/issues/4091)
- font zooming issues ([5442532](https://github.com/IBM/kui/commit/5442532)), closes [#4176](https://github.com/IBM/kui/issues/4176) [#4177](https://github.com/IBM/kui/issues/4177)
- **plugins/plugin-client-common:** captured screenshots sometimes have residual sepia tones ([97172c6](https://github.com/IBM/kui/commit/97172c6)), closes [#4170](https://github.com/IBM/kui/issues/4170)
- **plugins/plugin-client-common:** tooltips can render below other UI elements ([6dd4808](https://github.com/IBM/kui/commit/6dd4808)), closes [#4159](https://github.com/IBM/kui/issues/4159)
- Form component sometimes has too-small TextInputs ([21d841d](https://github.com/IBM/kui/commit/21d841d)), closes [#4036](https://github.com/IBM/kui/issues/4036)
- helm on its own should render in sidecar ([4b82517](https://github.com/IBM/kui/commit/4b82517)), closes [#4010](https://github.com/IBM/kui/issues/4010)
- improve contrast of table Pagination component in light themes ([41246c3](https://github.com/IBM/kui/commit/41246c3)), closes [#4038](https://github.com/IBM/kui/issues/4038)
- improve Form layout ([2003622](https://github.com/IBM/kui/commit/2003622)), closes [#4034](https://github.com/IBM/kui/issues/4034)
- improve kubectl breadcrumb detection ([6cacfe6](https://github.com/IBM/kui/commit/6cacfe6)), closes [#4099](https://github.com/IBM/kui/issues/4099)
- improved color contrast in bottom stripe light themes (on hover) ([58681b8](https://github.com/IBM/kui/commit/58681b8)), closes [#4081](https://github.com/IBM/kui/issues/4081)
- kubectl summary form clipping ([7ea65e8](https://github.com/IBM/kui/commit/7ea65e8)), closes [#4093](https://github.com/IBM/kui/issues/4093)
- lighten up the PaginatedTable UI ([eccf23b](https://github.com/IBM/kui/commit/eccf23b)), closes [#4155](https://github.com/IBM/kui/issues/4155)
- **plugins/plugin-client-common:** active PTY easily loses focus ([8ca12e8](https://github.com/IBM/kui/commit/8ca12e8)), closes [#3945](https://github.com/IBM/kui/issues/3945)
- **plugins/plugin-client-common:** captured screenshots can show hover effect ([d48370b](https://github.com/IBM/kui/commit/d48370b)), closes [#4153](https://github.com/IBM/kui/issues/4153)
- remove use of inline styling in Form.tsx ([23121b2](https://github.com/IBM/kui/commit/23121b2)), closes [#4112](https://github.com/IBM/kui/issues/4112)
- table status grid layout seems buggy ([7da6ff3](https://github.com/IBM/kui/commit/7da6ff3)), closes [#4143](https://github.com/IBM/kui/issues/4143)
- **plugin-client-common:** PaginatedTable clicks on page N+1 activate handlers on first page ([f5f6045](https://github.com/IBM/kui/commit/f5f6045)), closes [#3999](https://github.com/IBM/kui/issues/3999)
- **plugins/plugin-client-common:** badge/STATUS column is always monospace ([b53e8f9](https://github.com/IBM/kui/commit/b53e8f9)), closes [#4056](https://github.com/IBM/kui/issues/4056)
- **plugins/plugin-client-common:** combine top toolbar and header of PaginatedTable UI ([3e1a1a7](https://github.com/IBM/kui/commit/3e1a1a7)), closes [#4131](https://github.com/IBM/kui/issues/4131)
- **plugins/plugin-client-common:** css regression of sidecar-header in popup mode ([6112f94](https://github.com/IBM/kui/commit/6112f94)), closes [#4061](https://github.com/IBM/kui/issues/4061)
- **plugins/plugin-client-common:** horizontal scrollbar can flash on and off ([3c26eca](https://github.com/IBM/kui/commit/3c26eca)), closes [#3937](https://github.com/IBM/kui/issues/3937)
- **plugins/plugin-client-common:** improve consistency of button hover effects ([2e96c8c](https://github.com/IBM/kui/commit/2e96c8c)), closes [#3986](https://github.com/IBM/kui/issues/3986)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-common:** input element clips with larger font sizes ([c62678b](https://github.com/IBM/kui/commit/c62678b)), closes [#4026](https://github.com/IBM/kui/issues/4026)
- **plugins/plugin-client-common:** LeftNavSidecar does not support font zooming ([7008857](https://github.com/IBM/kui/commit/7008857)), closes [#4001](https://github.com/IBM/kui/issues/4001)
- **plugins/plugin-client-common:** live tables too thin when sidecar is open ([ccd41f0](https://github.com/IBM/kui/commit/ccd41f0)), closes [#4029](https://github.com/IBM/kui/issues/4029) [#4031](https://github.com/IBM/kui/issues/4031)
- **plugins/plugin-client-common:** reduce size of sidecar window buttons ([79336ad](https://github.com/IBM/kui/commit/79336ad)), closes [#4074](https://github.com/IBM/kui/issues/4074)
- **plugins/plugin-client-common:** small tweaks to h3 headers in Markdown content ([3eee334](https://github.com/IBM/kui/commit/3eee334)), closes [#3918](https://github.com/IBM/kui/issues/3918)
- **plugins/plugin-client-common:** SplitPane layout issues with electron 7 ([b81b75d](https://github.com/IBM/kui/commit/b81b75d)), closes [#3914](https://github.com/IBM/kui/issues/3914)
- **plugins/plugin-client-common:** TopNavSidecar renders poorly with narrower windows ([4be1068](https://github.com/IBM/kui/commit/4be1068)), closes [#4095](https://github.com/IBM/kui/issues/4095)
- **plugins/plugin-client-common:** yellow badges in sidecar have low contrast ([325d23f](https://github.com/IBM/kui/commit/325d23f)), closes [#4050](https://github.com/IBM/kui/issues/4050)
- **plugins/plugin-kubectl:** kubectl watch tables can be misparsed ([cb3e1c2](https://github.com/IBM/kui/commit/cb3e1c2)), closes [#4139](https://github.com/IBM/kui/issues/4139)
- **plugins/plugin-kubectl:** remove leftover debugging printf in kubectl help ([39ab52f](https://github.com/IBM/kui/commit/39ab52f)), closes [#4083](https://github.com/IBM/kui/issues/4083)
- **plugins/plugni-client-common:** improve contrast of Toolbar tooltips ([a167f3b](https://github.com/IBM/kui/commit/a167f3b)), closes [#4108](https://github.com/IBM/kui/issues/4108)
- improve contrast of top tab stripe versus sidecar title stripe ([ee9eb63](https://github.com/IBM/kui/commit/ee9eb63)), closes [#3956](https://github.com/IBM/kui/issues/3956)
- improve presentation with narrow windows ([cb23c63](https://github.com/IBM/kui/commit/cb23c63)), closes [#3954](https://github.com/IBM/kui/issues/3954)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- restore support for quiet table clicks ([b8d4e51](https://github.com/IBM/kui/commit/b8d4e51)), closes [#3894](https://github.com/IBM/kui/issues/3894)
- STATUS cell not centered when sidecar is open ([4fb507a](https://github.com/IBM/kui/commit/4fb507a)), closes [#4059](https://github.com/IBM/kui/issues/4059)
- status stripe refinements ([1394043](https://github.com/IBM/kui/commit/1394043)), closes [#4069](https://github.com/IBM/kui/issues/4069) [#4069](https://github.com/IBM/kui/issues/4069)
- tables overflow horizontally when sidecar is open ([2d6bc95](https://github.com/IBM/kui/commit/2d6bc95)), closes [#4016](https://github.com/IBM/kui/issues/4016)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- **plugins/plugin-client-common:** closing first tab can close entire window ([6ef836d](https://github.com/IBM/kui/commit/6ef836d)), closes [#3896](https://github.com/IBM/kui/issues/3896)
- cmd+w doesn't closes the window when there's only 1 tab ([f2868a9](https://github.com/IBM/kui/commit/f2868a9)), closes [#3884](https://github.com/IBM/kui/issues/3884)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improve Terminal horizontal alignment for carbon themes ([fe7c8bb](https://github.com/IBM/kui/commit/fe7c8bb)), closes [#3891](https://github.com/IBM/kui/issues/3891)
- when sidecar is open, only show status badge, not status text ([3214db2](https://github.com/IBM/kui/commit/3214db2)), closes [#4058](https://github.com/IBM/kui/issues/4058)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** active+processing tab is not properly colored ([56bc759](https://github.com/IBM/kui/commit/56bc759)), closes [#3827](https://github.com/IBM/kui/issues/3827)
- **plugins/plugin-client-common:** clear console should restore active prompt value ([23afefd](https://github.com/IBM/kui/commit/23afefd)), closes [#3797](https://github.com/IBM/kui/issues/3797)
- **plugins/plugin-client-common:** improve error handling of hackFocus ([a16b680](https://github.com/IBM/kui/commit/a16b680)), closes [#3769](https://github.com/IBM/kui/issues/3769)
- **plugins/plugin-client-common:** improve error handling of Scalar.tsx ([53cd8e5](https://github.com/IBM/kui/commit/53cd8e5)), closes [#3781](https://github.com/IBM/kui/issues/3781)
- **plugins/plugin-client-common:** improve focus preservation of active prompt ([1ef2153](https://github.com/IBM/kui/commit/1ef2153)), closes [#3805](https://github.com/IBM/kui/issues/3805)
- **plugins/plugin-client-common:** improve Markdown styling of ul ([e60d592](https://github.com/IBM/kui/commit/e60d592)), closes [#3865](https://github.com/IBM/kui/issues/3865)
- **plugins/plugin-client-common:** improve Scalar renderer error handling ([c42fd6a](https://github.com/IBM/kui/commit/c42fd6a)), closes [#3765](https://github.com/IBM/kui/issues/3765)
- **plugins/plugin-client-common:** improved fix for status stripe icon spacing ([fe9eab2](https://github.com/IBM/kui/commit/fe9eab2)), closes [#3724](https://github.com/IBM/kui/issues/3724)
- **plugins/plugin-client-common:** odd border-left in prompt for light themes ([a9f8af3](https://github.com/IBM/kui/commit/a9f8af3)), closes [#3752](https://github.com/IBM/kui/issues/3752)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- **plugins/plugin-client-common:** shorten top tabs ([da02499](https://github.com/IBM/kui/commit/da02499)), closes [#3872](https://github.com/IBM/kui/issues/3872)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- reverse-i-search does not always terminate with current completion ([e05d905](https://github.com/IBM/kui/commit/e05d905)), closes [#3799](https://github.com/IBM/kui/issues/3799)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- TabContent constructor sometimes calls this.setState ([5a72470](https://github.com/IBM/kui/commit/5a72470)), closes [#3844](https://github.com/IBM/kui/issues/3844)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-client-common:** clean up screenshot notification UI ([9ddec1a](https://github.com/IBM/kui/commit/9ddec1a)), closes [#3699](https://github.com/IBM/kui/issues/3699)
- **plugins/plugin-client-common:** inBrowser, prompt should be basename ([f47d03c](https://github.com/IBM/kui/commit/f47d03c)), closes [#3815](https://github.com/IBM/kui/issues/3815)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- **plugins/plugin-client-common:** misaligned svgs in paginated table ([7a201c2](https://github.com/IBM/kui/commit/7a201c2)), closes [#3702](https://github.com/IBM/kui/issues/3702)
- **plugins/plugin-client-common:** remove old min-width-date-like css class ([b075b7b](https://github.com/IBM/kui/commit/b075b7b)), closes [#3767](https://github.com/IBM/kui/issues/3767)
- **plugins/plugin-client-common:** screenshot notification never goes away ([9a8ad4f](https://github.com/IBM/kui/commit/9a8ad4f)), closes [#3705](https://github.com/IBM/kui/issues/3705)
- **plugins/plugin-client-common:** status stripe left-pad missing ([58d0613](https://github.com/IBM/kui/commit/58d0613)), closes [#3724](https://github.com/IBM/kui/issues/3724)
- **plugins/plugin-client-common:** stop using value prop for uncontrolled input element ([fdbfaff](https://github.com/IBM/kui/commit/fdbfaff)), closes [#3778](https://github.com/IBM/kui/issues/3778)
- **plugins/plugin-client-common:** streaming output does not scroll terminal ([63891d6](https://github.com/IBM/kui/commit/63891d6)), closes [#3760](https://github.com/IBM/kui/issues/3760)
- **plugins/plugin-client-common:** Tab uses strings rather than numbers for Close16 dimensions ([786447c](https://github.com/IBM/kui/commit/786447c)), closes [#3771](https://github.com/IBM/kui/issues/3771)
- **plugins/plugin-client-common:** Tab.tsx does not render "processing" state ([1ae0ab5](https://github.com/IBM/kui/commit/1ae0ab5)), closes [#3646](https://github.com/IBM/kui/issues/3646)
- **plugins/plugin-client-common:** text-selection is not working in repl ([5672e02](https://github.com/IBM/kui/commit/5672e02)), closes [#3738](https://github.com/IBM/kui/issues/3738) [#3739](https://github.com/IBM/kui/issues/3739) [#3741](https://github.com/IBM/kui/issues/3741)
- **plugins/plugin-client-common:** top tabs disappear with narrower windows ([4184247](https://github.com/IBM/kui/commit/4184247)), closes [#3842](https://github.com/IBM/kui/issues/3842)
- **plugins/plugin-client-common:** When command completes, TopTab doesn't change the process state ([f8139ac](https://github.com/IBM/kui/commit/f8139ac)), closes [#3707](https://github.com/IBM/kui/issues/3707)
- **plugins/plugin-client-default:** improve table layout for radio tables ([75e1e70](https://github.com/IBM/kui/commit/75e1e70)), closes [#3596](https://github.com/IBM/kui/issues/3596)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add krew support ([f87cb6c](https://github.com/IBM/kui/commit/f87cb6c)), closes [#4199](https://github.com/IBM/kui/issues/4199)
- add labels to summary mode ([95f731d](https://github.com/IBM/kui/commit/95f731d)), closes [#4041](https://github.com/IBM/kui/issues/4041) [#4040](https://github.com/IBM/kui/issues/4040)
- add Show Owner Reference button for kube resources ([80ea40f](https://github.com/IBM/kui/commit/80ea40f)), closes [#4106](https://github.com/IBM/kui/issues/4106)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/IBM/kui/commit/f55b8c6)), closes [#4103](https://github.com/IBM/kui/issues/4103) [#4105](https://github.com/IBM/kui/issues/4105)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- decrease default size of popup window ([a210ac4](https://github.com/IBM/kui/commit/a210ac4)), closes [#4192](https://github.com/IBM/kui/issues/4192) [#4193](https://github.com/IBM/kui/issues/4193)
- enhance table UI ([519beb1](https://github.com/IBM/kui/commit/519beb1)), closes [#4023](https://github.com/IBM/kui/issues/4023)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- improve pagination and toolbar UIs of PaginatedTable ([08062e9](https://github.com/IBM/kui/commit/08062e9)), closes [#1456](https://github.com/IBM/kui/issues/1456)
- kubectl tables should show official kind in title ([06eec95](https://github.com/IBM/kui/commit/06eec95)), closes [#4127](https://github.com/IBM/kui/issues/4127)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- use breadcrumbs for TopNavSidecar naming ([5a4611e](https://github.com/IBM/kui/commit/5a4611e)), closes [#4043](https://github.com/IBM/kui/issues/4043) [#3657](https://github.com/IBM/kui/issues/3657) [#4044](https://github.com/IBM/kui/issues/4044)
- **plugins/plugin-client-common:** accordion blocks in Terminal ([eb2f285](https://github.com/IBM/kui/commit/eb2f285)), closes [#3726](https://github.com/IBM/kui/issues/3726)
- **plugins/plugin-client-common:** add styling for blockquotes in Markdown ([b3fa5c6](https://github.com/IBM/kui/commit/b3fa5c6)), closes [#3925](https://github.com/IBM/kui/issues/3925)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

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
