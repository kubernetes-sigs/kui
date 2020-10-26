# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
