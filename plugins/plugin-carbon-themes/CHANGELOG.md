# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- **plugins/plugin-carbon-themes:** missing import of medium font weight ([cd13b65](https://github.com/IBM/kui/commit/cd13b65)), closes [#4320](https://github.com/IBM/kui/issues/4320)
- **plugins/plugin-carbon-themes:** optimize loading of plex fonts ([aa833b1](https://github.com/IBM/kui/commit/aa833b1)), closes [#3831](https://github.com/IBM/kui/issues/3831)
- **plugins/plugin-carbon-themes:** popup > prompt not visible in carbon gray 10 theme ([469b6c0](https://github.com/IBM/kui/commit/469b6c0)), closes [#4267](https://github.com/IBM/kui/issues/4267)
- > prompt text has poor vertical alignment ([9a796b3](https://github.com/IBM/kui/commit/9a796b3)), closes [#4237](https://github.com/IBM/kui/issues/4237)
- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- a few more tweaks to prompt ([7bf658a](https://github.com/IBM/kui/commit/7bf658a)), closes [#4250](https://github.com/IBM/kui/issues/4250)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improve contrast of table Pagination component in light themes ([41246c3](https://github.com/IBM/kui/commit/41246c3)), closes [#4038](https://github.com/IBM/kui/issues/4038)
- improve contrast of top tab stripe versus sidecar title stripe ([ee9eb63](https://github.com/IBM/kui/commit/ee9eb63)), closes [#3956](https://github.com/IBM/kui/issues/3956)
- improve Terminal horizontal alignment for carbon themes ([fe7c8bb](https://github.com/IBM/kui/commit/fe7c8bb)), closes [#3891](https://github.com/IBM/kui/issues/3891)
- lighten up the PaginatedTable UI ([eccf23b](https://github.com/IBM/kui/commit/eccf23b)), closes [#4155](https://github.com/IBM/kui/issues/4155)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- reverse-i-search text should be monospace ([4c0bd05](https://github.com/IBM/kui/commit/4c0bd05)), closes [#4254](https://github.com/IBM/kui/issues/4254)
- **plugins/plugin-carbon-themes:** carbon themes have dead css rules ([4d6fce6](https://github.com/IBM/kui/commit/4d6fce6)), closes [#4096](https://github.com/IBM/kui/issues/4096)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe refinements ([1394043](https://github.com/IBM/kui/commit/1394043)), closes [#4069](https://github.com/IBM/kui/issues/4069) [#4069](https://github.com/IBM/kui/issues/4069)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-carbon-themes:** improve contrast of blue colors in sidecar ([e788692](https://github.com/IBM/kui/commit/e788692)), closes [#3885](https://github.com/IBM/kui/issues/3885)
- **plugins/plugin-carbon-themes:** poor color contrast in carbon gray 10 sidecar ([1d79239](https://github.com/IBM/kui/commit/1d79239)), closes [#4053](https://github.com/IBM/kui/issues/4053)
- **plugins/plugin-carbon-themes:** reduce load time burden of ibm-plex fonts ([49c1f60](https://github.com/IBM/kui/commit/49c1f60)), closes [#3831](https://github.com/IBM/kui/issues/3831)
- **plugins/plugin-carbon-themes:** sidecar table contrast issue fix in carbon gray10 ([f329537](https://github.com/IBM/kui/commit/f329537))
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enhance table UI ([519beb1](https://github.com/IBM/kui/commit/519beb1)), closes [#4023](https://github.com/IBM/kui/issues/4023)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- **plugins/plugin-client-common:** add styling for blockquotes in Markdown ([b3fa5c6](https://github.com/IBM/kui/commit/b3fa5c6)), closes [#3925](https://github.com/IBM/kui/issues/3925)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- > prompt text has poor vertical alignment ([9a796b3](https://github.com/IBM/kui/commit/9a796b3)), closes [#4237](https://github.com/IBM/kui/issues/4237)
- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- a few more tweaks to prompt ([7bf658a](https://github.com/IBM/kui/commit/7bf658a)), closes [#4250](https://github.com/IBM/kui/issues/4250)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- lighten up the PaginatedTable UI ([eccf23b](https://github.com/IBM/kui/commit/eccf23b)), closes [#4155](https://github.com/IBM/kui/issues/4155)
- reverse-i-search text should be monospace ([4c0bd05](https://github.com/IBM/kui/commit/4c0bd05)), closes [#4254](https://github.com/IBM/kui/issues/4254)
- **plugins/plugin-carbon-themes:** carbon themes have dead css rules ([4d6fce6](https://github.com/IBM/kui/commit/4d6fce6)), closes [#4096](https://github.com/IBM/kui/issues/4096)
- improve contrast of table Pagination component in light themes ([41246c3](https://github.com/IBM/kui/commit/41246c3)), closes [#4038](https://github.com/IBM/kui/issues/4038)
- improve contrast of top tab stripe versus sidecar title stripe ([ee9eb63](https://github.com/IBM/kui/commit/ee9eb63)), closes [#3956](https://github.com/IBM/kui/issues/3956)
- improve Terminal horizontal alignment for carbon themes ([fe7c8bb](https://github.com/IBM/kui/commit/fe7c8bb)), closes [#3891](https://github.com/IBM/kui/issues/3891)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe refinements ([1394043](https://github.com/IBM/kui/commit/1394043)), closes [#4069](https://github.com/IBM/kui/issues/4069) [#4069](https://github.com/IBM/kui/issues/4069)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-carbon-themes:** improve contrast of blue colors in sidecar ([e788692](https://github.com/IBM/kui/commit/e788692)), closes [#3885](https://github.com/IBM/kui/issues/3885)
- **plugins/plugin-carbon-themes:** poor color contrast in carbon gray 10 sidecar ([1d79239](https://github.com/IBM/kui/commit/1d79239)), closes [#4053](https://github.com/IBM/kui/issues/4053)
- **plugins/plugin-carbon-themes:** reduce load time burden of ibm-plex fonts ([49c1f60](https://github.com/IBM/kui/commit/49c1f60)), closes [#3831](https://github.com/IBM/kui/issues/3831)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** sidecar table contrast issue fix in carbon gray10 ([f329537](https://github.com/IBM/kui/commit/f329537))
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enhance table UI ([519beb1](https://github.com/IBM/kui/commit/519beb1)), closes [#4023](https://github.com/IBM/kui/issues/4023)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- **plugins/plugin-client-common:** add styling for blockquotes in Markdown ([b3fa5c6](https://github.com/IBM/kui/commit/b3fa5c6)), closes [#3925](https://github.com/IBM/kui/issues/3925)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- > prompt text has poor vertical alignment ([9a796b3](https://github.com/IBM/kui/commit/9a796b3)), closes [#4237](https://github.com/IBM/kui/issues/4237)
- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improve contrast of table Pagination component in light themes ([41246c3](https://github.com/IBM/kui/commit/41246c3)), closes [#4038](https://github.com/IBM/kui/issues/4038)
- improve Terminal horizontal alignment for carbon themes ([fe7c8bb](https://github.com/IBM/kui/commit/fe7c8bb)), closes [#3891](https://github.com/IBM/kui/issues/3891)
- lighten up the PaginatedTable UI ([eccf23b](https://github.com/IBM/kui/commit/eccf23b)), closes [#4155](https://github.com/IBM/kui/issues/4155)
- **plugins/plugin-carbon-themes:** carbon themes have dead css rules ([4d6fce6](https://github.com/IBM/kui/commit/4d6fce6)), closes [#4096](https://github.com/IBM/kui/issues/4096)
- improve contrast of top tab stripe versus sidecar title stripe ([ee9eb63](https://github.com/IBM/kui/commit/ee9eb63)), closes [#3956](https://github.com/IBM/kui/issues/3956)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- status stripe refinements ([1394043](https://github.com/IBM/kui/commit/1394043)), closes [#4069](https://github.com/IBM/kui/issues/4069) [#4069](https://github.com/IBM/kui/issues/4069)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-carbon-themes:** improve contrast of blue colors in sidecar ([e788692](https://github.com/IBM/kui/commit/e788692)), closes [#3885](https://github.com/IBM/kui/issues/3885)
- **plugins/plugin-carbon-themes:** poor color contrast in carbon gray 10 sidecar ([1d79239](https://github.com/IBM/kui/commit/1d79239)), closes [#4053](https://github.com/IBM/kui/issues/4053)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** reduce load time burden of ibm-plex fonts ([49c1f60](https://github.com/IBM/kui/commit/49c1f60)), closes [#3831](https://github.com/IBM/kui/issues/3831)
- **plugins/plugin-carbon-themes:** sidecar table contrast issue fix in carbon gray10 ([f329537](https://github.com/IBM/kui/commit/f329537))

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enhance table UI ([519beb1](https://github.com/IBM/kui/commit/519beb1)), closes [#4023](https://github.com/IBM/kui/issues/4023)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- **plugins/plugin-client-common:** add styling for blockquotes in Markdown ([b3fa5c6](https://github.com/IBM/kui/commit/b3fa5c6)), closes [#3925](https://github.com/IBM/kui/issues/3925)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- > prompt text has poor vertical alignment ([9a796b3](https://github.com/IBM/kui/commit/9a796b3)), closes [#4237](https://github.com/IBM/kui/issues/4237)
- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improve contrast of table Pagination component in light themes ([41246c3](https://github.com/IBM/kui/commit/41246c3)), closes [#4038](https://github.com/IBM/kui/issues/4038)
- improve Terminal horizontal alignment for carbon themes ([fe7c8bb](https://github.com/IBM/kui/commit/fe7c8bb)), closes [#3891](https://github.com/IBM/kui/issues/3891)
- lighten up the PaginatedTable UI ([eccf23b](https://github.com/IBM/kui/commit/eccf23b)), closes [#4155](https://github.com/IBM/kui/issues/4155)
- **plugins/plugin-carbon-themes:** carbon themes have dead css rules ([4d6fce6](https://github.com/IBM/kui/commit/4d6fce6)), closes [#4096](https://github.com/IBM/kui/issues/4096)
- improve contrast of top tab stripe versus sidecar title stripe ([ee9eb63](https://github.com/IBM/kui/commit/ee9eb63)), closes [#3956](https://github.com/IBM/kui/issues/3956)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- status stripe refinements ([1394043](https://github.com/IBM/kui/commit/1394043)), closes [#4069](https://github.com/IBM/kui/issues/4069) [#4069](https://github.com/IBM/kui/issues/4069)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-carbon-themes:** improve contrast of blue colors in sidecar ([e788692](https://github.com/IBM/kui/commit/e788692)), closes [#3885](https://github.com/IBM/kui/issues/3885)
- **plugins/plugin-carbon-themes:** poor color contrast in carbon gray 10 sidecar ([1d79239](https://github.com/IBM/kui/commit/1d79239)), closes [#4053](https://github.com/IBM/kui/issues/4053)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** reduce load time burden of ibm-plex fonts ([49c1f60](https://github.com/IBM/kui/commit/49c1f60)), closes [#3831](https://github.com/IBM/kui/issues/3831)
- **plugins/plugin-carbon-themes:** sidecar table contrast issue fix in carbon gray10 ([f329537](https://github.com/IBM/kui/commit/f329537))

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enhance table UI ([519beb1](https://github.com/IBM/kui/commit/519beb1)), closes [#4023](https://github.com/IBM/kui/issues/4023)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- **plugins/plugin-client-common:** add styling for blockquotes in Markdown ([b3fa5c6](https://github.com/IBM/kui/commit/b3fa5c6)), closes [#3925](https://github.com/IBM/kui/issues/3925)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- lighten up the PaginatedTable UI ([eccf23b](https://github.com/IBM/kui/commit/eccf23b)), closes [#4155](https://github.com/IBM/kui/issues/4155)
- **plugins/plugin-carbon-themes:** carbon themes have dead css rules ([4d6fce6](https://github.com/IBM/kui/commit/4d6fce6)), closes [#4096](https://github.com/IBM/kui/issues/4096)
- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improve contrast of table Pagination component in light themes ([41246c3](https://github.com/IBM/kui/commit/41246c3)), closes [#4038](https://github.com/IBM/kui/issues/4038)
- improve contrast of top tab stripe versus sidecar title stripe ([ee9eb63](https://github.com/IBM/kui/commit/ee9eb63)), closes [#3956](https://github.com/IBM/kui/issues/3956)
- improve Terminal horizontal alignment for carbon themes ([fe7c8bb](https://github.com/IBM/kui/commit/fe7c8bb)), closes [#3891](https://github.com/IBM/kui/issues/3891)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe refinements ([1394043](https://github.com/IBM/kui/commit/1394043)), closes [#4069](https://github.com/IBM/kui/issues/4069) [#4069](https://github.com/IBM/kui/issues/4069)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-carbon-themes:** improve contrast of blue colors in sidecar ([e788692](https://github.com/IBM/kui/commit/e788692)), closes [#3885](https://github.com/IBM/kui/issues/3885)
- **plugins/plugin-carbon-themes:** poor color contrast in carbon gray 10 sidecar ([1d79239](https://github.com/IBM/kui/commit/1d79239)), closes [#4053](https://github.com/IBM/kui/issues/4053)
- **plugins/plugin-carbon-themes:** reduce load time burden of ibm-plex fonts ([49c1f60](https://github.com/IBM/kui/commit/49c1f60)), closes [#3831](https://github.com/IBM/kui/issues/3831)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** sidecar table contrast issue fix in carbon gray10 ([f329537](https://github.com/IBM/kui/commit/f329537))
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enhance table UI ([519beb1](https://github.com/IBM/kui/commit/519beb1)), closes [#4023](https://github.com/IBM/kui/issues/4023)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- **plugins/plugin-client-common:** add styling for blockquotes in Markdown ([b3fa5c6](https://github.com/IBM/kui/commit/b3fa5c6)), closes [#3925](https://github.com/IBM/kui/issues/3925)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- improve contrast of top tab stripe versus sidecar title stripe ([ee9eb63](https://github.com/IBM/kui/commit/ee9eb63)), closes [#3956](https://github.com/IBM/kui/issues/3956)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improve Terminal horizontal alignment for carbon themes ([fe7c8bb](https://github.com/IBM/kui/commit/fe7c8bb)), closes [#3891](https://github.com/IBM/kui/issues/3891)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- **plugins/plugin-carbon-themes:** improve contrast of blue colors in sidecar ([e788692](https://github.com/IBM/kui/commit/e788692)), closes [#3885](https://github.com/IBM/kui/issues/3885)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-carbon-themes:** reduce load time burden of ibm-plex fonts ([49c1f60](https://github.com/IBM/kui/commit/49c1f60)), closes [#3831](https://github.com/IBM/kui/issues/3831)
- **plugins/plugin-carbon-themes:** sidecar table contrast issue fix in carbon gray10 ([f329537](https://github.com/IBM/kui/commit/f329537))
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- **plugins/plugin-client-common:** add styling for blockquotes in Markdown ([b3fa5c6](https://github.com/IBM/kui/commit/b3fa5c6)), closes [#3925](https://github.com/IBM/kui/issues/3925)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- use Carbon Components UIShell for TopTabStripe ([8d7619d](https://github.com/IBM/kui/commit/8d7619d)), closes [#3819](https://github.com/IBM/kui/issues/3819)

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-carbon-themes

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-carbon-themes

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/plugin-carbon-themes

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-carbon-themes

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- **plugins/plugin-carbon-themes:** sidecar table contrast issue fix in carbon gray10 ([f329537](https://github.com/IBM/kui/commit/f329537))
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- **plugins/plugin-carbon-themes:** sidecar table contrast issue fix in carbon gray10 ([f329537](https://github.com/IBM/kui/commit/f329537))
- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-carbon-themes

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- carbon themes should pull in plex fonts ([dbf623e](https://github.com/IBM/kui/commit/dbf623e)), closes [#3533](https://github.com/IBM/kui/issues/3533)
- **plugins/plugin-carbon-themes:** carbon themes should import ibm-plex.css ([629bb32](https://github.com/IBM/kui/commit/629bb32)), closes [#3512](https://github.com/IBM/kui/issues/3512)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- add ibm-plex.css in plugin-carbon-themes ([ac0a5b5](https://github.com/IBM/kui/commit/ac0a5b5)), closes [#3512](https://github.com/IBM/kui/issues/3512)
