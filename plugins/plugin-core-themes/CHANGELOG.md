# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [13.1.2](https://github.com/IBM/kui/compare/v13.1.1...v13.1.2) (2023-03-25)

**Note:** Version bump only for package @kui-shell/plugin-core-themes





## [13.1.1](https://github.com/IBM/kui/compare/v13.1.0...v13.1.1) (2023-02-22)

**Note:** Version bump only for package @kui-shell/plugin-core-themes





# [13.1.0](https://github.com/IBM/kui/compare/v4.5.0...v13.1.0) (2023-02-03)


### Bug Fixes

* a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
* a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
* add side-effect: false ([5120700](https://github.com/IBM/kui/commit/5120700))
* block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
* Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
* Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
* color contrast fixes for Sidebar and Wizard header ([cc76957](https://github.com/IBM/kui/commit/cc76957))
* Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
* Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
* fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
* fixes for inverted colors in dark themes ([43425a8](https://github.com/IBM/kui/commit/43425a8))
* improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
* improved markdown expandable section colors ([52b7e38](https://github.com/IBM/kui/commit/52b7e38))
* in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
* increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
* Light theme does not get expected sepia filter for finished blocks ([752150f](https://github.com/IBM/kui/commit/752150f))
* monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
* more base0E color contrast fixes ([e533109](https://github.com/IBM/kui/commit/e533109))
* more color contrast fixes for wizard ([1bf1ea6](https://github.com/IBM/kui/commit/1bf1ea6))
* more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
* move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
* multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
* reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
* rendering improvements for playground ([883b522](https://github.com/IBM/kui/commit/883b522))
* status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
* StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
* support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
* text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
* the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
* Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
* UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
* **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
* **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
* **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
* use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)


### chore

* kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)


### Features

* **plugins/plugin-client-common:** refinements to wizard header guidebook spacing ([432ead3](https://github.com/IBM/kui/commit/432ead3))
* allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
* improve consistency of input element coloring between guidebooks and plain terminals ([d5bac1d](https://github.com/IBM/kui/commit/d5bac1d))
* Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
* Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
* lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
* MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
* refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
* Use patternfly Sidebar to display guidebooks ([d2333e4](https://github.com/IBM/kui/commit/d2333e4))


### BREAKING CHANGES

* this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common





# [13.0.0](https://github.com/IBM/kui/compare/v4.5.0...v13.0.0) (2023-01-13)


### Bug Fixes

* a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
* a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
* add side-effect: false ([5120700](https://github.com/IBM/kui/commit/5120700))
* block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
* Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
* Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
* color contrast fixes for Sidebar and Wizard header ([cc76957](https://github.com/IBM/kui/commit/cc76957))
* Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
* Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
* fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
* fixes for inverted colors in dark themes ([43425a8](https://github.com/IBM/kui/commit/43425a8))
* improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
* improved markdown expandable section colors ([52b7e38](https://github.com/IBM/kui/commit/52b7e38))
* in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
* increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
* Light theme does not get expected sepia filter for finished blocks ([752150f](https://github.com/IBM/kui/commit/752150f))
* monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
* more base0E color contrast fixes ([e533109](https://github.com/IBM/kui/commit/e533109))
* more color contrast fixes for wizard ([1bf1ea6](https://github.com/IBM/kui/commit/1bf1ea6))
* more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
* move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
* multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
* reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
* rendering improvements for playground ([883b522](https://github.com/IBM/kui/commit/883b522))
* status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
* StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
* support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
* text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
* the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
* Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
* UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
* **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
* **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
* **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
* use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)


### chore

* kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)


### Features

* **plugins/plugin-client-common:** refinements to wizard header guidebook spacing ([432ead3](https://github.com/IBM/kui/commit/432ead3))
* allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
* improve consistency of input element coloring between guidebooks and plain terminals ([d5bac1d](https://github.com/IBM/kui/commit/d5bac1d))
* Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
* Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
* lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
* MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
* refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
* Use patternfly Sidebar to display guidebooks ([d2333e4](https://github.com/IBM/kui/commit/d2333e4))


### BREAKING CHANGES

* this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common





# [12.2.0](https://github.com/IBM/kui/compare/v4.5.0...v12.2.0) (2022-10-10)


### Bug Fixes

* a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
* a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
* block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
* Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
* Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
* color contrast fixes for Sidebar and Wizard header ([cc76957](https://github.com/IBM/kui/commit/cc76957))
* Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
* Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
* fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
* fixes for inverted colors in dark themes ([43425a8](https://github.com/IBM/kui/commit/43425a8))
* improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
* improved markdown expandable section colors ([52b7e38](https://github.com/IBM/kui/commit/52b7e38))
* in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
* increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
* Light theme does not get expected sepia filter for finished blocks ([752150f](https://github.com/IBM/kui/commit/752150f))
* monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
* more base0E color contrast fixes ([e533109](https://github.com/IBM/kui/commit/e533109))
* more color contrast fixes for wizard ([1bf1ea6](https://github.com/IBM/kui/commit/1bf1ea6))
* more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
* move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
* multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
* reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
* rendering improvements for playground ([883b522](https://github.com/IBM/kui/commit/883b522))
* status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
* StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
* support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
* text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
* the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
* Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
* UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
* **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
* **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
* **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
* use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)


### chore

* kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)


### Features

* **plugins/plugin-client-common:** refinements to wizard header guidebook spacing ([432ead3](https://github.com/IBM/kui/commit/432ead3))
* allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
* improve consistency of input element coloring between guidebooks and plain terminals ([d5bac1d](https://github.com/IBM/kui/commit/d5bac1d))
* Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
* Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
* lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
* MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
* refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
* Use patternfly Sidebar to display guidebooks ([d2333e4](https://github.com/IBM/kui/commit/d2333e4))


### BREAKING CHANGES

* this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common





# [12.0.0](https://github.com/IBM/kui/compare/v4.5.0...v12.0.0) (2022-09-06)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- color contrast fixes for Sidebar and Wizard header ([cc76957](https://github.com/IBM/kui/commit/cc76957))
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- fixes for inverted colors in dark themes ([43425a8](https://github.com/IBM/kui/commit/43425a8))
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improved markdown expandable section colors ([52b7e38](https://github.com/IBM/kui/commit/52b7e38))
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- Light theme does not get expected sepia filter for finished blocks ([752150f](https://github.com/IBM/kui/commit/752150f))
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more base0E color contrast fixes ([e533109](https://github.com/IBM/kui/commit/e533109))
- more color contrast fixes for wizard ([1bf1ea6](https://github.com/IBM/kui/commit/1bf1ea6))
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- rendering improvements for playground ([883b522](https://github.com/IBM/kui/commit/883b522))
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- **plugins/plugin-client-common:** refinements to wizard header guidebook spacing ([432ead3](https://github.com/IBM/kui/commit/432ead3))
- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- improve consistency of input element coloring between guidebooks and plain terminals ([d5bac1d](https://github.com/IBM/kui/commit/d5bac1d))
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- Use patternfly Sidebar to display guidebooks ([d2333e4](https://github.com/IBM/kui/commit/d2333e4))

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [11.4.0](https://github.com/IBM/kui/compare/v4.5.0...v11.4.0) (2022-02-25)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- color contrast fixes for Sidebar and Wizard header ([cc76957](https://github.com/IBM/kui/commit/cc76957))
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- fixes for inverted colors in dark themes ([43425a8](https://github.com/IBM/kui/commit/43425a8))
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improved markdown expandable section colors ([52b7e38](https://github.com/IBM/kui/commit/52b7e38))
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- Light theme does not get expected sepia filter for finished blocks ([752150f](https://github.com/IBM/kui/commit/752150f))
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more color contrast fixes for wizard ([1bf1ea6](https://github.com/IBM/kui/commit/1bf1ea6))
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- rendering improvements for playground ([883b522](https://github.com/IBM/kui/commit/883b522))
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- improve consistency of input element coloring between guidebooks and plain terminals ([d5bac1d](https://github.com/IBM/kui/commit/d5bac1d))
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- Use patternfly Sidebar to display guidebooks ([d2333e4](https://github.com/IBM/kui/commit/d2333e4))

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [11.3.0](https://github.com/IBM/kui/compare/v4.5.0...v11.3.0) (2022-02-22)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- color contrast fixes for Sidebar and Wizard header ([cc76957](https://github.com/IBM/kui/commit/cc76957))
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- fixes for inverted colors in dark themes ([43425a8](https://github.com/IBM/kui/commit/43425a8))
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improved markdown expandable section colors ([52b7e38](https://github.com/IBM/kui/commit/52b7e38))
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- Light theme does not get expected sepia filter for finished blocks ([752150f](https://github.com/IBM/kui/commit/752150f))
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more color contrast fixes for wizard ([1bf1ea6](https://github.com/IBM/kui/commit/1bf1ea6))
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- rendering improvements for playground ([883b522](https://github.com/IBM/kui/commit/883b522))
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- improve consistency of input element coloring between guidebooks and plain terminals ([d5bac1d](https://github.com/IBM/kui/commit/d5bac1d))
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- Use patternfly Sidebar to display guidebooks ([d2333e4](https://github.com/IBM/kui/commit/d2333e4))

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [11.2.0](https://github.com/IBM/kui/compare/v4.5.0...v11.2.0) (2022-02-09)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- color contrast fixes for Sidebar and Wizard header ([cc76957](https://github.com/IBM/kui/commit/cc76957))
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improved markdown expandable section colors ([52b7e38](https://github.com/IBM/kui/commit/52b7e38))
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more color contrast fixes for wizard ([1bf1ea6](https://github.com/IBM/kui/commit/1bf1ea6))
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- rendering improvements for playground ([883b522](https://github.com/IBM/kui/commit/883b522))
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- Use patternfly Sidebar to display guidebooks ([d2333e4](https://github.com/IBM/kui/commit/d2333e4))

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [11.1.0](https://github.com/IBM/kui/compare/v4.5.0...v11.1.0) (2022-01-24)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- improved markdown expandable section colors ([52b7e38](https://github.com/IBM/kui/commit/52b7e38))
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- rendering improvements for playground ([883b522](https://github.com/IBM/kui/commit/883b522))
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- Use patternfly Sidebar to display guidebooks ([d2333e4](https://github.com/IBM/kui/commit/d2333e4))

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [11.0.0](https://github.com/IBM/kui/compare/v4.5.0...v11.0.0) (2022-01-18)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- rendering improvements for playground ([883b522](https://github.com/IBM/kui/commit/883b522))
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)
- Use patternfly Sidebar to display guidebooks ([d2333e4](https://github.com/IBM/kui/commit/d2333e4))

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [10.7.0](https://github.com/IBM/kui/compare/v4.5.0...v10.7.0) (2021-10-12)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [10.6.0](https://github.com/IBM/kui/compare/v4.5.0...v10.6.0) (2021-09-27)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [10.5.0](https://github.com/IBM/kui/compare/v4.5.0...v10.5.0) (2021-09-13)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Carbon Gray10 theme has poor contrast for hints ([930fd57](https://github.com/IBM/kui/commit/930fd57)), closes [#7956](https://github.com/IBM/kui/issues/7956)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- in "lightweight" themes, split header buttons overflow ([e059fb8](https://github.com/IBM/kui/commit/e059fb8)), closes [#7620](https://github.com/IBM/kui/issues/7620)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- **plugins/plugin-core-themes:** Sidecar header and body may lack contrast ([b09391e](https://github.com/IBM/kui/commit/b09391e)), closes [#6306](https://github.com/IBM/kui/issues/6306)
- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- Tree view badges can have low contrast ([9be1ae5](https://github.com/IBM/kui/commit/9be1ae5)), closes [#6245](https://github.com/IBM/kui/issues/6245)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- Improve support for designing light themes ([b6c859f](https://github.com/IBM/kui/commit/b6c859f)), closes [#6372](https://github.com/IBM/kui/issues/6372)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- block timestamp in Light theme/lightweight ui has low contrast ([6ae08fd](https://github.com/IBM/kui/commit/6ae08fd)), closes [#6226](https://github.com/IBM/kui/issues/6226)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- **plugins/plugin-core-themes:** In Light theme, inverted splits don't render well ([db6ae59](https://github.com/IBM/kui/commit/db6ae59)), closes [#6220](https://github.com/IBM/kui/issues/6220)
- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- lightweight ui options for core themes ([cf96867](https://github.com/IBM/kui/commit/cf96867)), closes [#6187](https://github.com/IBM/kui/issues/6187)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.11.0](https://github.com/IBM/kui/compare/v4.5.0...v8.11.0) (2020-07-21)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- Confirm dialog color contrast issues ([da14c25](https://github.com/IBM/kui/commit/da14c25)), closes [#4995](https://github.com/IBM/kui/issues/4995)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- increase contrast in watch pane ([246ecd2](https://github.com/IBM/kui/commit/246ecd2)), closes [#5000](https://github.com/IBM/kui/issues/5000) [#5001](https://github.com/IBM/kui/issues/5001)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.10.0](https://github.com/IBM/kui/compare/v4.5.0...v8.10.0) (2020-06-17)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.9.0](https://github.com/IBM/kui/compare/v4.5.0...v8.9.0) (2020-06-09)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.7.0](https://github.com/IBM/kui/compare/v4.5.0...v8.7.0) (2020-05-08)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

## [8.6.1](https://github.com/IBM/kui/compare/v4.5.0...v8.6.1) (2020-04-25)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.6.0](https://github.com/IBM/kui/compare/v4.5.0...v8.6.0) (2020-04-23)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- a few more color contrast issues with inverted sidecar themes ([f0f36d5](https://github.com/IBM/kui/commit/f0f36d5)), closes [#3874](https://github.com/IBM/kui/issues/3874)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- more inverted sidecar fixes ([5316c66](https://github.com/IBM/kui/commit/5316c66)), closes [#3756](https://github.com/IBM/kui/issues/3756)
- multiple fixes for screenshot toast notification UI ([8725e0b](https://github.com/IBM/kui/commit/8725e0b)), closes [#3933](https://github.com/IBM/kui/issues/3933)
- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)
- use more standard TopTabStripe UI ([c390dff](https://github.com/IBM/kui/commit/c390dff)), closes [#3867](https://github.com/IBM/kui/issues/3867)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
- refine sidecar minimization ([ead3b41](https://github.com/IBM/kui/commit/ead3b41)), closes [#3958](https://github.com/IBM/kui/issues/3958)

### BREAKING CHANGES

- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-core-themes

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- status stripe UI fixes to work better across themes ([2aa107f](https://github.com/IBM/kui/commit/2aa107f)), closes [#3507](https://github.com/IBM/kui/issues/3507)

### Features

- allow plugins to define themes ([216f41c](https://github.com/IBM/kui/commit/216f41c)), closes [#3420](https://github.com/IBM/kui/issues/3420)
