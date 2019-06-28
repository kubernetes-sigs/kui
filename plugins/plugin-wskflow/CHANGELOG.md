# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.23.0 (2019-06-17)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-core-support:** tab completion of dirs versus ~ ([c6190c5](https://github.com/IBM/kui/commit/c6190c5)), closes [#1483](https://github.com/IBM/kui/issues/1483)
- **plugins/plugin-wskflow:** don't override bash "source" command ([f807626](https://github.com/IBM/kui/commit/f807626)), closes [#1302](https://github.com/IBM/kui/issues/1302)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- apache-composer versus webpack fixes ([0a97daf](https://github.com/IBM/kui/commit/0a97daf)), closes [#584](https://github.com/IBM/kui/issues/584)
- improvements for wskflow zoom buttons ([91a2590](https://github.com/IBM/kui/commit/91a2590)), closes [#1453](https://github.com/IBM/kui/issues/1453)
- multiple fixes for tab management ([c125f7f](https://github.com/IBM/kui/commit/c125f7f)), closes [#1493](https://github.com/IBM/kui/issues/1493)
- node-pty versus electron ([1263c74](https://github.com/IBM/kui/commit/1263c74)), closes [#1155](https://github.com/IBM/kui/issues/1155)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)
- **plugins-plugin-tekton:** intial tekton pipeline views ([0d18858](https://github.com/IBM/kui/commit/0d18858)), closes [#1371](https://github.com/IBM/kui/issues/1371)
- **plugins/plugin-tekton:** add task and step drilldowns to tekton flow view ([bcadca4](https://github.com/IBM/kui/commit/bcadca4)), closes [#1462](https://github.com/IBM/kui/issues/1462)
- **plugins/plugin-tekton:** tekton support for step visualization ([b176899](https://github.com/IBM/kui/commit/b176899)), closes [#1448](https://github.com/IBM/kui/issues/1448)
- tekton pipelinerun view ([565a94c](https://github.com/IBM/kui/commit/565a94c)), closes [#1448](https://github.com/IBM/kui/issues/1448)
- tekton pipelinerun view ([615f2bb](https://github.com/IBM/kui/commit/615f2bb)), closes [#1448](https://github.com/IBM/kui/issues/1448)
- **plugins/plugin-tekton:** tekton trace view ([e9a9872](https://github.com/IBM/kui/commit/e9a9872)), closes [#1580](https://github.com/IBM/kui/issues/1580)

# 0.22.0 (2019-05-22)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** don't override bash "source" command ([f807626](https://github.com/IBM/kui/commit/f807626)), closes [#1302](https://github.com/IBM/kui/issues/1302)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- apache-composer versus webpack fixes ([0a97daf](https://github.com/IBM/kui/commit/0a97daf)), closes [#584](https://github.com/IBM/kui/issues/584)
- improvements for wskflow zoom buttons ([91a2590](https://github.com/IBM/kui/commit/91a2590)), closes [#1453](https://github.com/IBM/kui/issues/1453)
- node-pty versus electron ([1263c74](https://github.com/IBM/kui/commit/1263c74)), closes [#1155](https://github.com/IBM/kui/issues/1155)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)
- **plugins-plugin-tekton:** intial tekton pipeline views ([0d18858](https://github.com/IBM/kui/commit/0d18858)), closes [#1371](https://github.com/IBM/kui/issues/1371)
- **plugins/plugin-tekton:** add task and step drilldowns to tekton flow view ([bcadca4](https://github.com/IBM/kui/commit/bcadca4)), closes [#1462](https://github.com/IBM/kui/issues/1462)
- **plugins/plugin-tekton:** tekton support for step visualization ([b176899](https://github.com/IBM/kui/commit/b176899)), closes [#1448](https://github.com/IBM/kui/issues/1448)

# 0.21.0 (2019-05-08)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- apache-composer versus webpack fixes ([0a97daf](https://github.com/IBM/kui/commit/0a97daf)), closes [#584](https://github.com/IBM/kui/issues/584)
- node-pty versus electron ([1263c74](https://github.com/IBM/kui/commit/1263c74)), closes [#1155](https://github.com/IBM/kui/issues/1155)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.20.0 (2019-05-07)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- apache-composer versus webpack fixes ([0a97daf](https://github.com/IBM/kui/commit/0a97daf)), closes [#584](https://github.com/IBM/kui/issues/584)
- node-pty versus electron ([1263c74](https://github.com/IBM/kui/commit/1263c74)), closes [#1155](https://github.com/IBM/kui/issues/1155)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.19.0 (2019-05-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- apache-composer versus webpack fixes ([0a97daf](https://github.com/IBM/kui/commit/0a97daf)), closes [#584](https://github.com/IBM/kui/issues/584)
- node-pty versus electron ([1263c74](https://github.com/IBM/kui/commit/1263c74)), closes [#1155](https://github.com/IBM/kui/issues/1155)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.18.0 (2019-05-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- apache-composer versus webpack fixes ([0a97daf](https://github.com/IBM/kui/commit/0a97daf)), closes [#584](https://github.com/IBM/kui/issues/584)
- node-pty versus electron ([1263c74](https://github.com/IBM/kui/commit/1263c74)), closes [#1155](https://github.com/IBM/kui/issues/1155)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.17.0 (2019-05-04)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- apache-composer versus webpack fixes ([0a97daf](https://github.com/IBM/kui/commit/0a97daf)), closes [#584](https://github.com/IBM/kui/issues/584)
- node-pty versus electron ([1263c74](https://github.com/IBM/kui/commit/1263c74)), closes [#1155](https://github.com/IBM/kui/issues/1155)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.16.0 (2019-04-26)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- apache-composer versus webpack fixes ([0a97daf](https://github.com/IBM/kui/commit/0a97daf)), closes [#584](https://github.com/IBM/kui/issues/584)
- node-pty versus electron ([1263c74](https://github.com/IBM/kui/commit/1263c74)), closes [#1155](https://github.com/IBM/kui/issues/1155)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.15.0 (2019-04-23)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- apache-composer versus webpack fixes ([0a97daf](https://github.com/IBM/kui/commit/0a97daf)), closes [#584](https://github.com/IBM/kui/issues/584)
- node-pty versus electron ([1263c74](https://github.com/IBM/kui/commit/1263c74)), closes [#1155](https://github.com/IBM/kui/issues/1155)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.14.0 (2019-04-10)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- wskflow theming and css cleanup ([28fed89](https://github.com/IBM/kui/commit/28fed89)), closes [#1025](https://github.com/IBM/kui/issues/1025)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.13.0 (2019-03-19)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.12.0 (2019-03-19)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.11.0 (2019-03-10)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.10.0 (2019-03-10)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.9.0 (2019-03-10)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for overflowing inline function labels ([278d2cd](https://github.com/IBM/kui/commit/278d2cd)), closes [#737](https://github.com/IBM/kui/issues/737)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.8.0 (2019-03-09)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.7.0 (2019-03-08)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.6.0 (2019-03-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.5.0 (2019-03-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.4.0 (2019-03-06)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- add a few more themes ([92199d3](https://github.com/IBM/kui/commit/92199d3)), closes [#608](https://github.com/IBM/kui/issues/608)

# 0.3.0 (2019-02-28)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.2.0 (2019-02-28)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.1.0 (2019-02-27)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **plugins/plugin-wskflow:** fix for Y and N coloring in wskflow ([5da48d8](https://github.com/IBM/kui/commit/5da48d8)), closes [#529](https://github.com/IBM/kui/issues/529)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

## 0.0.17 (2019-02-22)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

## 0.0.16 (2019-02-21)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

## 0.0.13 (2019-02-21)

### Bug Fixes

- **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

## 0.0.12 (2019-02-20)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

## 0.0.11 (2019-02-20)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

## 0.0.10 (2019-02-19)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)

## 0.0.9 (2019-02-13)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

## 0.0.6 (2019-02-04)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

## 0.0.5 (2019-02-03)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

## 0.0.4 (2019-02-03)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

## 0.0.3 (2019-02-03)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

## 0.0.2 (2019-02-03)

### Bug Fixes

- **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/starpit/kui/commit/14ac816)), closes [#332](https://github.com/starpit/kui/issues/332)
- **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/starpit/kui/commit/adc685f)), closes [#329](https://github.com/starpit/kui/issues/329)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/starpit/kui/commit/d6f474d)), closes [#355](https://github.com/starpit/kui/issues/355)
