# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.0.33](https://github.com/IBM/kui/compare/v4.5.0...v7.0.33) (2020-03-11)

### Bug Fixes

- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- **plugins/plugin-sidecar:** change ReactMarkdown CodeSnippet from single to multiline style if the characters exceed 40 ([efe45f5](https://github.com/IBM/kui/commit/efe45f5)), closes [#3877](https://github.com/IBM/kui/issues/3877)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.32](https://github.com/IBM/kui/compare/v4.5.0...v7.0.32) (2020-03-11)

### Bug Fixes

- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- **plugins/plugin-sidecar:** change ReactMarkdown CodeSnippet from single to multiline style if the characters exceed 40 ([efe45f5](https://github.com/IBM/kui/commit/efe45f5)), closes [#3877](https://github.com/IBM/kui/issues/3877)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.31](https://github.com/IBM/kui/compare/v4.5.0...v7.0.31) (2020-03-11)

### Bug Fixes

- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- **plugins/plugin-sidecar:** change ReactMarkdown CodeSnippet from single to multiline style if the characters exceed 40 ([efe45f5](https://github.com/IBM/kui/commit/efe45f5)), closes [#3877](https://github.com/IBM/kui/issues/3877)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.30](https://github.com/IBM/kui/compare/v4.5.0...v7.0.30) (2020-03-10)

### Bug Fixes

- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- **plugins/plugin-sidecar:** change ReactMarkdown CodeSnippet from single to multiline style if the characters exceed 40 ([efe45f5](https://github.com/IBM/kui/commit/efe45f5)), closes [#3877](https://github.com/IBM/kui/issues/3877)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.29](https://github.com/IBM/kui/compare/v4.5.0...v7.0.29) (2020-03-10)

### Bug Fixes

- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- **plugins/plugin-sidecar:** change ReactMarkdown CodeSnippet from single to multiline style if the characters exceed 40 ([efe45f5](https://github.com/IBM/kui/commit/efe45f5)), closes [#3877](https://github.com/IBM/kui/issues/3877)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.28](https://github.com/IBM/kui/compare/v4.5.0...v7.0.28) (2020-03-09)

### Bug Fixes

- **plugins/plugin-sidecar:** change ReactMarkdown CodeSnippet from single to multiline style if the characters exceed 40 ([efe45f5](https://github.com/IBM/kui/commit/efe45f5)), closes [#3877](https://github.com/IBM/kui/issues/3877)
- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.27](https://github.com/IBM/kui/compare/v4.5.0...v7.0.27) (2020-03-09)

### Bug Fixes

- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.26](https://github.com/IBM/kui/compare/v4.5.0...v7.0.26) (2020-03-08)

### Bug Fixes

- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.25](https://github.com/IBM/kui/compare/v4.5.0...v7.0.25) (2020-03-07)

### Bug Fixes

- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.24](https://github.com/IBM/kui/compare/v4.5.0...v7.0.24) (2020-03-07)

### Bug Fixes

- improve CodeSnippet rendering in Markdown ([9df43d0](https://github.com/IBM/kui/commit/9df43d0)), closes [#3863](https://github.com/IBM/kui/issues/3863)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.23](https://github.com/IBM/kui/compare/v4.5.0...v7.0.23) (2020-03-07)

### Bug Fixes

- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.22](https://github.com/IBM/kui/compare/v4.5.0...v7.0.22) (2020-03-07)

### Bug Fixes

- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.21](https://github.com/IBM/kui/compare/v4.5.0...v7.0.21) (2020-03-06)

### Bug Fixes

- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.20](https://github.com/IBM/kui/compare/v4.5.0...v7.0.20) (2020-03-06)

### Bug Fixes

- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.19](https://github.com/IBM/kui/compare/v7.0.18...v7.0.19) (2020-03-06)

**Note:** Version bump only for package @kui-shell/plugin-sidecar

## [7.0.18](https://github.com/IBM/kui/compare/v7.0.17...v7.0.18) (2020-03-06)

**Note:** Version bump only for package @kui-shell/plugin-sidecar

## [7.0.17](https://github.com/IBM/kui/compare/v4.5.0...v7.0.17) (2020-03-06)

### Bug Fixes

- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.16](https://github.com/IBM/kui/compare/v4.5.0...v7.0.16) (2020-03-06)

### Bug Fixes

- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.15](https://github.com/IBM/kui/compare/v4.5.0...v7.0.15) (2020-03-06)

### Bug Fixes

- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.14](https://github.com/IBM/kui/compare/v4.5.0...v7.0.14) (2020-03-06)

### Bug Fixes

- a few more color contrast issues with inverted sidecars ([0776df7](https://github.com/IBM/kui/commit/0776df7)), closes [#3835](https://github.com/IBM/kui/issues/3835)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- **plugins/plugin-client-common:** re-implement "sidecar-visible" attribute of Terminal ([6d280ab](https://github.com/IBM/kui/commit/6d280ab)), closes [#3833](https://github.com/IBM/kui/issues/3833)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.13](https://github.com/IBM/kui/compare/v4.5.0...v7.0.13) (2020-03-05)

### Bug Fixes

- **plugins/plugin-carbon-themes:** color contrast issues in carbon gray 10 ([0211b54](https://github.com/IBM/kui/commit/0211b54)), closes [#3775](https://github.com/IBM/kui/issues/3775)
- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.12](https://github.com/IBM/kui/compare/v4.5.0...v7.0.12) (2020-03-05)

### Bug Fixes

- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.11](https://github.com/IBM/kui/compare/v4.5.0...v7.0.11) (2020-03-05)

### Bug Fixes

- LeftNavSidecar fails silently for MMR with plain text mode ([56e3053](https://github.com/IBM/kui/commit/56e3053)), closes [#3823](https://github.com/IBM/kui/issues/3823)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** eliminate the warning message in the javascript console when LeftNavSidecar opens ([4418e04](https://github.com/IBM/kui/commit/4418e04)), closes [#3821](https://github.com/IBM/kui/issues/3821)
- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.10](https://github.com/IBM/kui/compare/v4.5.0...v7.0.10) (2020-03-04)

### Bug Fixes

- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.9](https://github.com/IBM/kui/compare/v4.5.0...v7.0.9) (2020-03-04)

### Bug Fixes

- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.8](https://github.com/IBM/kui/compare/v4.5.0...v7.0.8) (2020-03-03)

### Bug Fixes

- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)

## [7.0.7](https://github.com/IBM/kui/compare/v4.5.0...v7.0.7) (2020-03-03)

### Bug Fixes

- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)

## [7.0.6](https://github.com/IBM/kui/compare/v4.5.0...v7.0.6) (2020-03-03)

### Bug Fixes

- **plugins/plugin-sidecar:** implement support for Badges as functions ([4c1d7e0](https://github.com/IBM/kui/commit/4c1d7e0)), closes [#3789](https://github.com/IBM/kui/issues/3789)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** LeftNavSidecar should not minimize on Escape ([dd9eaff](https://github.com/IBM/kui/commit/dd9eaff)), closes [#3776](https://github.com/IBM/kui/issues/3776)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)

## [7.0.5](https://github.com/IBM/kui/compare/v4.5.0...v7.0.5) (2020-03-02)

### Bug Fixes

- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** poor hover colors for not-selected tabs ([f927c9e](https://github.com/IBM/kui/commit/f927c9e)), closes [#3763](https://github.com/IBM/kui/issues/3763)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)

## [7.0.4](https://github.com/IBM/kui/compare/v4.5.0...v7.0.4) (2020-03-01)

### Bug Fixes

- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-carbon-themes:** carbon themes do not fully apply ([1659157](https://github.com/IBM/kui/commit/1659157)), closes [#3740](https://github.com/IBM/kui/issues/3740)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** lazily load monaco-editor ([03892a5](https://github.com/IBM/kui/commit/03892a5)), closes [#3746](https://github.com/IBM/kui/issues/3746)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** sidecar un-minimize bug after click-minimize ([9910929](https://github.com/IBM/kui/commit/9910929)), closes [#3758](https://github.com/IBM/kui/issues/3758)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)

## [7.0.3](https://github.com/IBM/kui/compare/v7.0.2...v7.0.3) (2020-03-01)

**Note:** Version bump only for package @kui-shell/plugin-sidecar

## [7.0.2](https://github.com/IBM/kui/compare/v7.0.1...v7.0.2) (2020-02-28)

**Note:** Version bump only for package @kui-shell/plugin-sidecar

## [7.0.1](https://github.com/IBM/kui/compare/v7.0.0...v7.0.1) (2020-02-28)

**Note:** Version bump only for package @kui-shell/plugin-sidecar

# [7.0.0](https://github.com/IBM/kui/compare/v4.5.0...v7.0.0) (2020-02-28)

### Bug Fixes

- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugins/plugin-sidecar:** don't focus on TopNavSidecar tabs on click ([856afbd](https://github.com/IBM/kui/commit/856afbd)), closes [#3714](https://github.com/IBM/kui/issues/3714)
- **plugins/plugin-sidecar:** LeftNavSidecar appears too wide ([2d0c30b](https://github.com/IBM/kui/commit/2d0c30b)), closes [#3677](https://github.com/IBM/kui/issues/3677)
- **plugins/plugin-sidecar:** regressions about defaultMode and order ([b146efb](https://github.com/IBM/kui/commit/b146efb)), closes [#3710](https://github.com/IBM/kui/issues/3710) [#3709](https://github.com/IBM/kui/issues/3709)
- sidecar screenshot captures blank canvas ([ce38178](https://github.com/IBM/kui/commit/ce38178)), closes [#3679](https://github.com/IBM/kui/issues/3679)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- resizable sidecar ([0b8a22e](https://github.com/IBM/kui/commit/0b8a22e)), closes [#2484](https://github.com/IBM/kui/issues/2484)
