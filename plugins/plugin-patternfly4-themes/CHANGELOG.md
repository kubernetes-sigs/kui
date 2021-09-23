# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.5.12](https://github.com/IBM/kui/compare/v10.5.11...v10.5.12) (2021-09-23)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.11](https://github.com/IBM/kui/compare/v10.5.10...v10.5.11) (2021-09-22)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.10](https://github.com/IBM/kui/compare/v10.5.9...v10.5.10) (2021-09-22)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.9](https://github.com/IBM/kui/compare/v10.5.8...v10.5.9) (2021-09-21)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.8](https://github.com/IBM/kui/compare/v10.5.7...v10.5.8) (2021-09-21)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.7](https://github.com/IBM/kui/compare/v10.5.6...v10.5.7) (2021-09-20)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.6](https://github.com/IBM/kui/compare/v10.5.5...v10.5.6) (2021-09-17)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.5](https://github.com/IBM/kui/compare/v10.5.4...v10.5.5) (2021-09-15)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.4](https://github.com/IBM/kui/compare/v10.5.3...v10.5.4) (2021-09-15)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.3](https://github.com/IBM/kui/compare/v10.5.2...v10.5.3) (2021-09-14)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.2](https://github.com/IBM/kui/compare/v10.5.1...v10.5.2) (2021-09-13)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.5.1](https://github.com/IBM/kui/compare/v10.5.0...v10.5.1) (2021-09-13)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

# [10.5.0](https://github.com/IBM/kui/compare/v4.5.0...v10.5.0) (2021-09-13)

### Bug Fixes

- **plugins/plugin-patternfly4-themes:** inverted colors have incorrect repl-background color ([5cf5062](https://github.com/IBM/kui/commit/5cf5062))
- a few more patternfly theme tweaks ([cb17ea5](https://github.com/IBM/kui/commit/cb17ea5)), closes [#7900](https://github.com/IBM/kui/issues/7900)
- A few more themes tweaks are needed ([03be3eb](https://github.com/IBM/kui/commit/03be3eb)), closes [#6034](https://github.com/IBM/kui/issues/6034)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- chart colors for patternfly themes aren't in a diverging series ([cc2e177](https://github.com/IBM/kui/commit/cc2e177)), closes [#6161](https://github.com/IBM/kui/issues/6161)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- Commentary Hints have low contrast in PatternFly4 Dark ([15532e4](https://github.com/IBM/kui/commit/15532e4)), closes [#7952](https://github.com/IBM/kui/issues/7952)
- **plugins/plugin-patternfly4-themes:** PatternFly4-Dark theme lacks some box shadow effects ([d7eedff](https://github.com/IBM/kui/commit/d7eedff))
- Commentary Editor in patternfly4 light theme has low contrast ([b74fc6b](https://github.com/IBM/kui/commit/b74fc6b)), closes [#7925](https://github.com/IBM/kui/issues/7925)
- fixes for font rendering regressions due to [#7818](https://github.com/IBM/kui/issues/7818) ([4a1420f](https://github.com/IBM/kui/commit/4a1420f)), closes [#7817](https://github.com/IBM/kui/issues/7817)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- in patternfly-based themes, CurrentContext DropDown renders poorly ([f1a3faf](https://github.com/IBM/kui/commit/f1a3faf)), closes [#6496](https://github.com/IBM/kui/issues/6496)
- In PatternFly4 Light and Garbon Gray90 themes, new tab/new split buttons lack hover effect ([8fa95fc](https://github.com/IBM/kui/commit/8fa95fc)), closes [#6804](https://github.com/IBM/kui/issues/6804)
- in patternfly4 light theme, the status stripe hovers background color are not visible ([a0e79d5](https://github.com/IBM/kui/commit/a0e79d5)), closes [#6361](https://github.com/IBM/kui/issues/6361)
- missing some theme alignment rules for pf-t-dark ([60486a2](https://github.com/IBM/kui/commit/60486a2)), closes [#7036](https://github.com/IBM/kui/issues/7036)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- multiple contrast and padding issues with Dropdowns ([910a566](https://github.com/IBM/kui/commit/910a566)), closes [#7913](https://github.com/IBM/kui/issues/7913)
- StatusStripe in light themes has low contrast ([d99f33b](https://github.com/IBM/kui/commit/d99f33b)), closes [#7927](https://github.com/IBM/kui/issues/7927)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- UI cleanups for notebooks ([b1e2d79](https://github.com/IBM/kui/commit/b1e2d79)), closes [#7824](https://github.com/IBM/kui/issues/7824)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve Card background color in PF4 Dark theme ([1ca7f51](https://github.com/IBM/kui/commit/1ca7f51)), closes [#6780](https://github.com/IBM/kui/issues/6780)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** in patternfly light theme, minisplit block border is not visible ([7c5b0a9](https://github.com/IBM/kui/commit/7c5b0a9)), closes [#6065](https://github.com/IBM/kui/issues/6065)
- **plugins/plugin-patternfly4-themes:** inverted splits don't render correctly in Patternfly Light theme ([f4de80a](https://github.com/IBM/kui/commit/f4de80a)), closes [#5592](https://github.com/IBM/kui/issues/5592)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly light theme can have low contrast ([947dce0](https://github.com/IBM/kui/commit/947dce0)), closes [#6336](https://github.com/IBM/kui/issues/6336)
- **plugins/plugin-patternfly4-themes:** patternfly light's green color has low contrast ([602606d](https://github.com/IBM/kui/commit/602606d)), closes [#6339](https://github.com/IBM/kui/issues/6339)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- **plugins/plugin-patternfly4-themes:** sidecar header does not have proper contrast in patternfly themes ([a5ccbc2](https://github.com/IBM/kui/commit/a5ccbc2)), closes [#6030](https://github.com/IBM/kui/issues/6030)
- **plugins/plugin-patternfly4-themes:** slightly darken terminal background color ([d666baa](https://github.com/IBM/kui/commit/d666baa)), closes [#6708](https://github.com/IBM/kui/issues/6708)
- **plugins/plugin-patternfly4-themes:** StatusStripe dropdowns have low contrast in PatternFly4 Dark theme ([c49729c](https://github.com/IBM/kui/commit/c49729c)), closes [#6717](https://github.com/IBM/kui/issues/6717)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- **plugins/plugin-patternfly4-themes:** switching from PatternFly4 Dark to PF4 Light and back to PF4 Dark results in poor colors ([bba1af4](https://github.com/IBM/kui/commit/bba1af4)), closes [#5816](https://github.com/IBM/kui/issues/5816)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)
- **Plugins/plugin-patternfly4-themes:** in patternfly themes, hovering over tree node has poor background color ([dae92df](https://github.com/IBM/kui/commit/dae92df)), closes [#6320](https://github.com/IBM/kui/issues/6320)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- Improve support for inverted color schemes ([72e096a](https://github.com/IBM/kui/commit/72e096a)), closes [#7918](https://github.com/IBM/kui/issues/7918)
- improve the split layout progression ([d3f2d6c](https://github.com/IBM/kui/commit/d3f2d6c)), closes [#6747](https://github.com/IBM/kui/issues/6747) [#6743](https://github.com/IBM/kui/issues/6743)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- In PatternFly4 Light and Garbon Gray90 themes, new tab/new split buttons lack hover effect ([8fa95fc](https://github.com/IBM/kui/commit/8fa95fc)), closes [#6804](https://github.com/IBM/kui/issues/6804)
- missing some theme alignment rules for pf-t-dark ([60486a2](https://github.com/IBM/kui/commit/60486a2)), closes [#7036](https://github.com/IBM/kui/issues/7036)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- **plugins/plugin-patternfly4-themes:** improve Card background color in PF4 Dark theme ([1ca7f51](https://github.com/IBM/kui/commit/1ca7f51)), closes [#6780](https://github.com/IBM/kui/issues/6780)
- **plugins/plugin-patternfly4-themes:** in patternfly light theme, minisplit block border is not visible ([7c5b0a9](https://github.com/IBM/kui/commit/7c5b0a9)), closes [#6065](https://github.com/IBM/kui/issues/6065)
- **plugins/plugin-patternfly4-themes:** inverted splits don't render correctly in Patternfly Light theme ([f4de80a](https://github.com/IBM/kui/commit/f4de80a)), closes [#5592](https://github.com/IBM/kui/issues/5592)
- **plugins/plugin-patternfly4-themes:** patternfly light theme can have low contrast ([947dce0](https://github.com/IBM/kui/commit/947dce0)), closes [#6336](https://github.com/IBM/kui/issues/6336)
- **plugins/plugin-patternfly4-themes:** patternfly light's green color has low contrast ([602606d](https://github.com/IBM/kui/commit/602606d)), closes [#6339](https://github.com/IBM/kui/issues/6339)
- **plugins/plugin-patternfly4-themes:** sidecar header does not have proper contrast in patternfly themes ([a5ccbc2](https://github.com/IBM/kui/commit/a5ccbc2)), closes [#6030](https://github.com/IBM/kui/issues/6030)
- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- **plugins/plugin-patternfly4-themes:** slightly darken terminal background color ([d666baa](https://github.com/IBM/kui/commit/d666baa)), closes [#6708](https://github.com/IBM/kui/issues/6708)
- **plugins/plugin-patternfly4-themes:** StatusStripe dropdowns have low contrast in PatternFly4 Dark theme ([c49729c](https://github.com/IBM/kui/commit/c49729c)), closes [#6717](https://github.com/IBM/kui/issues/6717)
- A few more themes tweaks are needed ([03be3eb](https://github.com/IBM/kui/commit/03be3eb)), closes [#6034](https://github.com/IBM/kui/issues/6034)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- chart colors for patternfly themes aren't in a diverging series ([cc2e177](https://github.com/IBM/kui/commit/cc2e177)), closes [#6161](https://github.com/IBM/kui/issues/6161)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- in patternfly-based themes, CurrentContext DropDown renders poorly ([f1a3faf](https://github.com/IBM/kui/commit/f1a3faf)), closes [#6496](https://github.com/IBM/kui/issues/6496)
- in patternfly4 light theme, the status stripe hovers background color are not visible ([a0e79d5](https://github.com/IBM/kui/commit/a0e79d5)), closes [#6361](https://github.com/IBM/kui/issues/6361)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- **plugins/plugin-patternfly4-themes:** switching from PatternFly4 Dark to PF4 Light and back to PF4 Dark results in poor colors ([bba1af4](https://github.com/IBM/kui/commit/bba1af4)), closes [#5816](https://github.com/IBM/kui/issues/5816)
- **Plugins/plugin-patternfly4-themes:** in patternfly themes, hovering over tree node has poor background color ([dae92df](https://github.com/IBM/kui/commit/dae92df)), closes [#6320](https://github.com/IBM/kui/issues/6320)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- improve the split layout progression ([d3f2d6c](https://github.com/IBM/kui/commit/d3f2d6c)), closes [#6747](https://github.com/IBM/kui/issues/6747) [#6743](https://github.com/IBM/kui/issues/6743)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

### Bug Fixes

- missing some theme alignment rules for pf-t-dark ([60486a2](https://github.com/IBM/kui/commit/60486a2)), closes [#7036](https://github.com/IBM/kui/issues/7036)

### Features

- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-patternfly4-themes

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- In PatternFly4 Light and Garbon Gray90 themes, new tab/new split buttons lack hover effect ([8fa95fc](https://github.com/IBM/kui/commit/8fa95fc)), closes [#6804](https://github.com/IBM/kui/issues/6804)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- **plugins/plugin-patternfly4-themes:** improve Card background color in PF4 Dark theme ([1ca7f51](https://github.com/IBM/kui/commit/1ca7f51)), closes [#6780](https://github.com/IBM/kui/issues/6780)
- **plugins/plugin-patternfly4-themes:** patternfly light theme can have low contrast ([947dce0](https://github.com/IBM/kui/commit/947dce0)), closes [#6336](https://github.com/IBM/kui/issues/6336)
- **plugins/plugin-patternfly4-themes:** patternfly light's green color has low contrast ([602606d](https://github.com/IBM/kui/commit/602606d)), closes [#6339](https://github.com/IBM/kui/issues/6339)
- **plugins/plugin-patternfly4-themes:** slightly darken terminal background color ([d666baa](https://github.com/IBM/kui/commit/d666baa)), closes [#6708](https://github.com/IBM/kui/issues/6708)
- **plugins/plugin-patternfly4-themes:** StatusStripe dropdowns have low contrast in PatternFly4 Dark theme ([c49729c](https://github.com/IBM/kui/commit/c49729c)), closes [#6717](https://github.com/IBM/kui/issues/6717)
- A few more themes tweaks are needed ([03be3eb](https://github.com/IBM/kui/commit/03be3eb)), closes [#6034](https://github.com/IBM/kui/issues/6034)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- chart colors for patternfly themes aren't in a diverging series ([cc2e177](https://github.com/IBM/kui/commit/cc2e177)), closes [#6161](https://github.com/IBM/kui/issues/6161)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- in patternfly-based themes, CurrentContext DropDown renders poorly ([f1a3faf](https://github.com/IBM/kui/commit/f1a3faf)), closes [#6496](https://github.com/IBM/kui/issues/6496)
- in patternfly4 light theme, the status stripe hovers background color are not visible ([a0e79d5](https://github.com/IBM/kui/commit/a0e79d5)), closes [#6361](https://github.com/IBM/kui/issues/6361)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** inverted splits don't render correctly in Patternfly Light theme ([f4de80a](https://github.com/IBM/kui/commit/f4de80a)), closes [#5592](https://github.com/IBM/kui/issues/5592)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- **plugins/plugin-patternfly4-themes:** switching from PatternFly4 Dark to PF4 Light and back to PF4 Dark results in poor colors ([bba1af4](https://github.com/IBM/kui/commit/bba1af4)), closes [#5816](https://github.com/IBM/kui/issues/5816)
- **Plugins/plugin-patternfly4-themes:** in patternfly themes, hovering over tree node has poor background color ([dae92df](https://github.com/IBM/kui/commit/dae92df)), closes [#6320](https://github.com/IBM/kui/issues/6320)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- **plugins/plugin-patternfly4-themes:** in patternfly light theme, minisplit block border is not visible ([7c5b0a9](https://github.com/IBM/kui/commit/7c5b0a9)), closes [#6065](https://github.com/IBM/kui/issues/6065)
- **plugins/plugin-patternfly4-themes:** sidecar header does not have proper contrast in patternfly themes ([a5ccbc2](https://github.com/IBM/kui/commit/a5ccbc2)), closes [#6030](https://github.com/IBM/kui/issues/6030)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- improve the split layout progression ([d3f2d6c](https://github.com/IBM/kui/commit/d3f2d6c)), closes [#6747](https://github.com/IBM/kui/issues/6747) [#6743](https://github.com/IBM/kui/issues/6743)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- In PatternFly4 Light and Garbon Gray90 themes, new tab/new split buttons lack hover effect ([8fa95fc](https://github.com/IBM/kui/commit/8fa95fc)), closes [#6804](https://github.com/IBM/kui/issues/6804)
- the x in the offline badge is sometimes low contrast, especially in dark themes ([c60157c](https://github.com/IBM/kui/commit/c60157c)), closes [#6784](https://github.com/IBM/kui/issues/6784)
- **plugins/plugin-patternfly4-themes:** improve Card background color in PF4 Dark theme ([1ca7f51](https://github.com/IBM/kui/commit/1ca7f51)), closes [#6780](https://github.com/IBM/kui/issues/6780)
- **plugins/plugin-patternfly4-themes:** patternfly light theme can have low contrast ([947dce0](https://github.com/IBM/kui/commit/947dce0)), closes [#6336](https://github.com/IBM/kui/issues/6336)
- **plugins/plugin-patternfly4-themes:** patternfly light's green color has low contrast ([602606d](https://github.com/IBM/kui/commit/602606d)), closes [#6339](https://github.com/IBM/kui/issues/6339)
- **plugins/plugin-patternfly4-themes:** slightly darken terminal background color ([d666baa](https://github.com/IBM/kui/commit/d666baa)), closes [#6708](https://github.com/IBM/kui/issues/6708)
- **plugins/plugin-patternfly4-themes:** StatusStripe dropdowns have low contrast in PatternFly4 Dark theme ([c49729c](https://github.com/IBM/kui/commit/c49729c)), closes [#6717](https://github.com/IBM/kui/issues/6717)
- A few more themes tweaks are needed ([03be3eb](https://github.com/IBM/kui/commit/03be3eb)), closes [#6034](https://github.com/IBM/kui/issues/6034)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- chart colors for patternfly themes aren't in a diverging series ([cc2e177](https://github.com/IBM/kui/commit/cc2e177)), closes [#6161](https://github.com/IBM/kui/issues/6161)
- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- in patternfly-based themes, CurrentContext DropDown renders poorly ([f1a3faf](https://github.com/IBM/kui/commit/f1a3faf)), closes [#6496](https://github.com/IBM/kui/issues/6496)
- in patternfly4 light theme, the status stripe hovers background color are not visible ([a0e79d5](https://github.com/IBM/kui/commit/a0e79d5)), closes [#6361](https://github.com/IBM/kui/issues/6361)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** inverted splits don't render correctly in Patternfly Light theme ([f4de80a](https://github.com/IBM/kui/commit/f4de80a)), closes [#5592](https://github.com/IBM/kui/issues/5592)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- **plugins/plugin-patternfly4-themes:** switching from PatternFly4 Dark to PF4 Light and back to PF4 Dark results in poor colors ([bba1af4](https://github.com/IBM/kui/commit/bba1af4)), closes [#5816](https://github.com/IBM/kui/issues/5816)
- **Plugins/plugin-patternfly4-themes:** in patternfly themes, hovering over tree node has poor background color ([dae92df](https://github.com/IBM/kui/commit/dae92df)), closes [#6320](https://github.com/IBM/kui/issues/6320)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- **plugins/plugin-patternfly4-themes:** in patternfly light theme, minisplit block border is not visible ([7c5b0a9](https://github.com/IBM/kui/commit/7c5b0a9)), closes [#6065](https://github.com/IBM/kui/issues/6065)
- **plugins/plugin-patternfly4-themes:** sidecar header does not have proper contrast in patternfly themes ([a5ccbc2](https://github.com/IBM/kui/commit/a5ccbc2)), closes [#6030](https://github.com/IBM/kui/issues/6030)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- improve the split layout progression ([d3f2d6c](https://github.com/IBM/kui/commit/d3f2d6c)), closes [#6747](https://github.com/IBM/kui/issues/6747) [#6743](https://github.com/IBM/kui/issues/6743)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- Clean up the way patternfly fonts are incorporated into themes ([2ba49e9](https://github.com/IBM/kui/commit/2ba49e9)), closes [#6375](https://github.com/IBM/kui/issues/6375)
- in patternfly4 light theme, the status stripe hovers background color are not visible ([a0e79d5](https://github.com/IBM/kui/commit/a0e79d5)), closes [#6361](https://github.com/IBM/kui/issues/6361)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- **plugins/plugin-patternfly4-themes:** in patternfly light theme, minisplit block border is not visible ([7c5b0a9](https://github.com/IBM/kui/commit/7c5b0a9)), closes [#6065](https://github.com/IBM/kui/issues/6065)
- **plugins/plugin-patternfly4-themes:** inverted splits don't render correctly in Patternfly Light theme ([f4de80a](https://github.com/IBM/kui/commit/f4de80a)), closes [#5592](https://github.com/IBM/kui/issues/5592)
- **plugins/plugin-patternfly4-themes:** patternfly light theme can have low contrast ([947dce0](https://github.com/IBM/kui/commit/947dce0)), closes [#6336](https://github.com/IBM/kui/issues/6336)
- **plugins/plugin-patternfly4-themes:** patternfly light's green color has low contrast ([602606d](https://github.com/IBM/kui/commit/602606d)), closes [#6339](https://github.com/IBM/kui/issues/6339)
- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- **plugins/plugin-patternfly4-themes:** switching from PatternFly4 Dark to PF4 Light and back to PF4 Dark results in poor colors ([bba1af4](https://github.com/IBM/kui/commit/bba1af4)), closes [#5816](https://github.com/IBM/kui/issues/5816)
- **Plugins/plugin-patternfly4-themes:** in patternfly themes, hovering over tree node has poor background color ([dae92df](https://github.com/IBM/kui/commit/dae92df)), closes [#6320](https://github.com/IBM/kui/issues/6320)
- A few more themes tweaks are needed ([03be3eb](https://github.com/IBM/kui/commit/03be3eb)), closes [#6034](https://github.com/IBM/kui/issues/6034)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- chart colors for patternfly themes aren't in a diverging series ([cc2e177](https://github.com/IBM/kui/commit/cc2e177)), closes [#6161](https://github.com/IBM/kui/issues/6161)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- **plugins/plugin-patternfly4-themes:** sidecar header does not have proper contrast in patternfly themes ([a5ccbc2](https://github.com/IBM/kui/commit/a5ccbc2)), closes [#6030](https://github.com/IBM/kui/issues/6030)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- A few more themes tweaks are needed ([03be3eb](https://github.com/IBM/kui/commit/03be3eb)), closes [#6034](https://github.com/IBM/kui/issues/6034)
- chart colors for patternfly themes aren't in a diverging series ([cc2e177](https://github.com/IBM/kui/commit/cc2e177)), closes [#6161](https://github.com/IBM/kui/issues/6161)
- monaco diff view colors are not themed ([eed2527](https://github.com/IBM/kui/commit/eed2527)), closes [#6232](https://github.com/IBM/kui/issues/6232)
- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- **plugins/plugin-patternfly4-themes:** in patternfly light theme, minisplit block border is not visible ([7c5b0a9](https://github.com/IBM/kui/commit/7c5b0a9)), closes [#6065](https://github.com/IBM/kui/issues/6065)
- **plugins/plugin-patternfly4-themes:** inverted splits don't render correctly in Patternfly Light theme ([f4de80a](https://github.com/IBM/kui/commit/f4de80a)), closes [#5592](https://github.com/IBM/kui/issues/5592)
- **plugins/plugin-patternfly4-themes:** sidecar header does not have proper contrast in patternfly themes ([a5ccbc2](https://github.com/IBM/kui/commit/a5ccbc2)), closes [#6030](https://github.com/IBM/kui/issues/6030)
- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- **plugins/plugin-patternfly4-themes:** switching from PatternFly4 Dark to PF4 Light and back to PF4 Dark results in poor colors ([bba1af4](https://github.com/IBM/kui/commit/bba1af4)), closes [#5816](https://github.com/IBM/kui/issues/5816)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **plugins/plugin-patternfly4-themes:** in patternfly light theme, minisplit block border is not visible ([7c5b0a9](https://github.com/IBM/kui/commit/7c5b0a9)), closes [#6065](https://github.com/IBM/kui/issues/6065)
- A few more themes tweaks are needed ([03be3eb](https://github.com/IBM/kui/commit/03be3eb)), closes [#6034](https://github.com/IBM/kui/issues/6034)
- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- **plugins/plugin-patternfly4-themes:** inverted splits don't render correctly in Patternfly Light theme ([f4de80a](https://github.com/IBM/kui/commit/f4de80a)), closes [#5592](https://github.com/IBM/kui/issues/5592)
- **plugins/plugin-patternfly4-themes:** sidecar header does not have proper contrast in patternfly themes ([a5ccbc2](https://github.com/IBM/kui/commit/a5ccbc2)), closes [#6030](https://github.com/IBM/kui/issues/6030)
- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- **plugins/plugin-patternfly4-themes:** switching from PatternFly4 Dark to PF4 Light and back to PF4 Dark results in poor colors ([bba1af4](https://github.com/IBM/kui/commit/bba1af4)), closes [#5816](https://github.com/IBM/kui/issues/5816)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- **plugins/plugin-patternfly4-themes:** inverted splits don't render correctly in Patternfly Light theme ([f4de80a](https://github.com/IBM/kui/commit/f4de80a)), closes [#5592](https://github.com/IBM/kui/issues/5592)
- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- **plugins/plugin-patternfly4-themes:** switching from PatternFly4 Dark to PF4 Light and back to PF4 Dark results in poor colors ([bba1af4](https://github.com/IBM/kui/commit/bba1af4)), closes [#5816](https://github.com/IBM/kui/issues/5816)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Bug Fixes

- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [8.11.0](https://github.com/IBM/kui/compare/v4.5.0...v8.11.0) (2020-07-21)

### Bug Fixes

- **plugins/plugin-patternfly4-themes:** sidecar tables illegible in patternfly4-light theme ([b125959](https://github.com/IBM/kui/commit/b125959)), closes [#5157](https://github.com/IBM/kui/issues/5157)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- move patternfly alignment out of patternfly themes plugin ([6adbfd6](https://github.com/IBM/kui/commit/6adbfd6)), closes [#4988](https://github.com/IBM/kui/issues/4988)
- **plugins/plugin-patternfly-themes:** update theme alignment to patternfly v4 ([3784b96](https://github.com/IBM/kui/commit/3784b96)), closes [#4948](https://github.com/IBM/kui/issues/4948)
- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- support for using patternfly components with non-patternfly themes ([f88ef97](https://github.com/IBM/kui/commit/f88ef97)), closes [#4934](https://github.com/IBM/kui/issues/4934)
- upgrade @patternfly/react-core to latest ([0331533](https://github.com/IBM/kui/commit/0331533)), closes [#4937](https://github.com/IBM/kui/issues/4937)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [8.10.0](https://github.com/IBM/kui/compare/v4.5.0...v8.10.0) (2020-06-17)

### Bug Fixes

- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [8.9.0](https://github.com/IBM/kui/compare/v4.5.0...v8.9.0) (2020-06-09)

### Bug Fixes

- improve accessibility of table in grid form ([0ade4f7](https://github.com/IBM/kui/commit/0ade4f7)), closes [#4601](https://github.com/IBM/kui/issues/4601)
- improve alignment of icons ([221d0f9](https://github.com/IBM/kui/commit/221d0f9)), closes [#4555](https://github.com/IBM/kui/issues/4555)
- improve alignment of Terminal timestamp ([c361f85](https://github.com/IBM/kui/commit/c361f85)), closes [#4587](https://github.com/IBM/kui/issues/4587)
- improve color contrast of charts in light themes ([9a60197](https://github.com/IBM/kui/commit/9a60197)), closes [#4597](https://github.com/IBM/kui/issues/4597)
- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- Dropdown spi and use in Terminal Block ([327917b](https://github.com/IBM/kui/commit/327917b)), closes [#4589](https://github.com/IBM/kui/issues/4589) [#4556](https://github.com/IBM/kui/issues/4556)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

# [8.7.0](https://github.com/IBM/kui/compare/v4.5.0...v8.7.0) (2020-05-08)

### Bug Fixes

- improve contrast of cyan in Patternfly4 Light theme ([3267e89](https://github.com/IBM/kui/commit/3267e89)), closes [#4480](https://github.com/IBM/kui/issues/4480)
- **plugins/plugi-patternfly4-themes:** add missing sans 500 font-weight ([56c2f76](https://github.com/IBM/kui/commit/56c2f76)), closes [#4389](https://github.com/IBM/kui/issues/4389)
- **plugins/plugin-patternfly4-themes:** darken status stripe ([17d7dbc](https://github.com/IBM/kui/commit/17d7dbc)), closes [#4402](https://github.com/IBM/kui/issues/4402)
- **plugins/plugin-patternfly4-themes:** improve contrast of active tab color ([afbbd05](https://github.com/IBM/kui/commit/afbbd05)), closes [#4429](https://github.com/IBM/kui/issues/4429)
- **plugins/plugin-patternfly4-themes:** overpass-mono font has odd line height ([75c7a01](https://github.com/IBM/kui/commit/75c7a01)), closes [#4392](https://github.com/IBM/kui/issues/4392)
- **plugins/plugin-patternfly4-themes:** patternfly link hover effect color has low contrast ([c8f4a99](https://github.com/IBM/kui/commit/c8f4a99)), closes [#4475](https://github.com/IBM/kui/issues/4475)
- **plugins/plugin-patternfly4-themes:** patternfly4 dark does not show background color for selected nav menu ([1467f83](https://github.com/IBM/kui/commit/1467f83)), closes [#4439](https://github.com/IBM/kui/issues/4439)
- patternfly Navigation missing theme alignment ([047f292](https://github.com/IBM/kui/commit/047f292)), closes [#4399](https://github.com/IBM/kui/issues/4399)
- **Plugins/plugin-patternfly4-themes:** improve color contrast of blue, yellow, and green ([a296e9c](https://github.com/IBM/kui/commit/a296e9c)), closes [#4394](https://github.com/IBM/kui/issues/4394)

### Features

- add Patternfly Navigation for LeftNavSidecar ([a4a7a97](https://github.com/IBM/kui/commit/a4a7a97)), closes [#4387](https://github.com/IBM/kui/issues/4387)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- patternfly4 dark theme ([3dff5a5](https://github.com/IBM/kui/commit/3dff5a5)), closes [#4419](https://github.com/IBM/kui/issues/4419)
- patternfly4 themes ([5f58f71](https://github.com/IBM/kui/commit/5f58f71)), closes [#4364](https://github.com/IBM/kui/issues/4364)
- spi for CodeSnippet ([105cf2b](https://github.com/IBM/kui/commit/105cf2b)), closes [#4478](https://github.com/IBM/kui/issues/4478)
- top tab buttons ([ff8cfba](https://github.com/IBM/kui/commit/ff8cfba)), closes [#4434](https://github.com/IBM/kui/issues/4434)
