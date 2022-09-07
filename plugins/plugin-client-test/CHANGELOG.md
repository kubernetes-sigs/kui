# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [12.0.3](https://github.com/IBM/kui/compare/v12.0.2...v12.0.3) (2022-09-07)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [12.0.2](https://github.com/IBM/kui/compare/v12.0.1...v12.0.2) (2022-09-07)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [12.0.1](https://github.com/IBM/kui/compare/v12.0.0...v12.0.1) (2022-09-07)

**Note:** Version bump only for package @kui-shell/plugin-test-client

# [12.0.0](https://github.com/IBM/kui/compare/v4.5.0...v12.0.0) (2022-09-06)

### Bug Fixes

- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/IBM/kui/commit/31be8fc))
- **plugins/plugin-bash-like:** pty/shell commands fail if cwd is a virtual directory ([022455f](https://github.com/IBM/kui/commit/022455f))
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- ls against command directories does not always list directories of commands ([2800646](https://github.com/IBM/kui/commit/2800646))
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls in vfs directories is not normalized ([dfdacc5](https://github.com/IBM/kui/commit/dfdacc5))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **packages/core:** Util and Themes APIs added and updated documentation ([b175698](https://github.com/IBM/kui/commit/b175698))
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)

### chore

- port notebooks to markdown ([a64295d](https://github.com/IBM/kui/commit/a64295d))

### Features

- electron tray menu for plugin-kubectl ([b8c84ed](https://github.com/IBM/kui/commit/b8c84ed))
- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **plugins/plugin-kubectl:** improved display of kubernetes jobs via `kubectl dashboard jobs` ([ad21df4](https://github.com/IBM/kui/commit/ad21df4))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- MixedResponse only supported string arrays; update to support number arrays ([66002c3](https://github.com/IBM/kui/commit/66002c3))
- **packages/core:** resolve command lines with slashes ([d6c637a](https://github.com/IBM/kui/commit/d6c637a))
- add a client option to show the block execution buttons sequentially ([55d90e0](https://github.com/IBM/kui/commit/55d90e0))
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for JSON notebooks
- removes support for inBrowserOk

# [11.4.0](https://github.com/IBM/kui/compare/v4.5.0...v11.4.0) (2022-02-25)

### Bug Fixes

- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/IBM/kui/commit/31be8fc))
- **plugins/plugin-bash-like:** pty/shell commands fail if cwd is a virtual directory ([022455f](https://github.com/IBM/kui/commit/022455f))
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- ls against command directories does not always list directories of commands ([2800646](https://github.com/IBM/kui/commit/2800646))
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls in vfs directories is not normalized ([dfdacc5](https://github.com/IBM/kui/commit/dfdacc5))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **packages/core:** Util and Themes APIs added and updated documentation ([b175698](https://github.com/IBM/kui/commit/b175698))
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)

### chore

- port notebooks to markdown ([a64295d](https://github.com/IBM/kui/commit/a64295d))

### Features

- **plugins/plugin-kubectl:** improved display of kubernetes jobs via `kubectl dashboard jobs` ([ad21df4](https://github.com/IBM/kui/commit/ad21df4))
- MixedResponse only supported string arrays; update to support number arrays ([66002c3](https://github.com/IBM/kui/commit/66002c3))
- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **packages/core:** resolve command lines with slashes ([d6c637a](https://github.com/IBM/kui/commit/d6c637a))
- add a client option to show the block execution buttons sequentially ([55d90e0](https://github.com/IBM/kui/commit/55d90e0))
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for JSON notebooks
- removes support for inBrowserOk

# [11.3.0](https://github.com/IBM/kui/compare/v4.5.0...v11.3.0) (2022-02-22)

### Bug Fixes

- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/IBM/kui/commit/31be8fc))
- **plugins/plugin-bash-like:** pty/shell commands fail if cwd is a virtual directory ([022455f](https://github.com/IBM/kui/commit/022455f))
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- ls against command directories does not always list directories of commands ([2800646](https://github.com/IBM/kui/commit/2800646))
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls in vfs directories is not normalized ([dfdacc5](https://github.com/IBM/kui/commit/dfdacc5))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **packages/core:** Util and Themes APIs added and updated documentation ([b175698](https://github.com/IBM/kui/commit/b175698))
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)

### chore

- port notebooks to markdown ([a64295d](https://github.com/IBM/kui/commit/a64295d))

### Features

- MixedResponse only supported string arrays; update to support number arrays ([66002c3](https://github.com/IBM/kui/commit/66002c3))
- **packages/core:** resolve command lines with slashes ([d6c637a](https://github.com/IBM/kui/commit/d6c637a))
- add a client option to show the block execution buttons sequentially ([55d90e0](https://github.com/IBM/kui/commit/55d90e0))
- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for JSON notebooks
- removes support for inBrowserOk

# [11.2.0](https://github.com/IBM/kui/compare/v4.5.0...v11.2.0) (2022-02-09)

### Bug Fixes

- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/IBM/kui/commit/31be8fc))
- **plugins/plugin-bash-like:** pty/shell commands fail if cwd is a virtual directory ([022455f](https://github.com/IBM/kui/commit/022455f))
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- ls against command directories does not always list directories of commands ([2800646](https://github.com/IBM/kui/commit/2800646))
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls in vfs directories is not normalized ([dfdacc5](https://github.com/IBM/kui/commit/dfdacc5))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **packages/core:** Util and Themes APIs added and updated documentation ([b175698](https://github.com/IBM/kui/commit/b175698))
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)

### chore

- port notebooks to markdown ([a64295d](https://github.com/IBM/kui/commit/a64295d))

### Features

- MixedResponse only supported string arrays; update to support number arrays ([66002c3](https://github.com/IBM/kui/commit/66002c3))
- **packages/core:** resolve command lines with slashes ([d6c637a](https://github.com/IBM/kui/commit/d6c637a))
- add a client option to show the block execution buttons sequentially ([55d90e0](https://github.com/IBM/kui/commit/55d90e0))
- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for JSON notebooks
- removes support for inBrowserOk

# [11.1.0](https://github.com/IBM/kui/compare/v4.5.0...v11.1.0) (2022-01-24)

### Bug Fixes

- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/IBM/kui/commit/31be8fc))
- **plugins/plugin-bash-like:** pty/shell commands fail if cwd is a virtual directory ([022455f](https://github.com/IBM/kui/commit/022455f))
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- ls against command directories does not always list directories of commands ([2800646](https://github.com/IBM/kui/commit/2800646))
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls in vfs directories is not normalized ([dfdacc5](https://github.com/IBM/kui/commit/dfdacc5))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **packages/core:** Util and Themes APIs added and updated documentation ([b175698](https://github.com/IBM/kui/commit/b175698))
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)

### chore

- port notebooks to markdown ([a64295d](https://github.com/IBM/kui/commit/a64295d))

### Features

- MixedResponse only supported string arrays; update to support number arrays ([66002c3](https://github.com/IBM/kui/commit/66002c3))
- **packages/core:** resolve command lines with slashes ([d6c637a](https://github.com/IBM/kui/commit/d6c637a))
- add a client option to show the block execution buttons sequentially ([55d90e0](https://github.com/IBM/kui/commit/55d90e0))
- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for JSON notebooks
- removes support for inBrowserOk

# [11.0.0](https://github.com/IBM/kui/compare/v4.5.0...v11.0.0) (2022-01-18)

### Bug Fixes

- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/IBM/kui/commit/31be8fc))
- **plugins/plugin-bash-like:** pty/shell commands fail if cwd is a virtual directory ([022455f](https://github.com/IBM/kui/commit/022455f))
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- ls against command directories does not always list directories of commands ([2800646](https://github.com/IBM/kui/commit/2800646))
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls in vfs directories is not normalized ([dfdacc5](https://github.com/IBM/kui/commit/dfdacc5))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **packages/core:** Util and Themes APIs added and updated documentation ([b175698](https://github.com/IBM/kui/commit/b175698))
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)

### chore

- port notebooks to markdown ([a64295d](https://github.com/IBM/kui/commit/a64295d))

### Features

- MixedResponse only supported string arrays; update to support number arrays ([66002c3](https://github.com/IBM/kui/commit/66002c3))
- **packages/core:** resolve command lines with slashes ([d6c637a](https://github.com/IBM/kui/commit/d6c637a))
- add a client option to show the block execution buttons sequentially ([55d90e0](https://github.com/IBM/kui/commit/55d90e0))
- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for JSON notebooks
- removes support for inBrowserOk

# [10.7.0](https://github.com/IBM/kui/compare/v4.5.0...v10.7.0) (2021-10-12)

### Bug Fixes

- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- add a client option to show the block execution buttons sequentially ([55d90e0](https://github.com/IBM/kui/commit/55d90e0))
- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [10.6.0](https://github.com/IBM/kui/compare/v4.5.0...v10.6.0) (2021-09-27)

### Bug Fixes

- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- add a client option to show the block execution buttons sequentially ([55d90e0](https://github.com/IBM/kui/commit/55d90e0))
- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [10.5.0](https://github.com/IBM/kui/compare/v4.5.0...v10.5.0) (2021-09-13)

### Bug Fixes

- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- add a client option to show the block execution buttons sequentially ([55d90e0](https://github.com/IBM/kui/commit/55d90e0))
- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- commands can register evaluator option so core/repl will not redirect output ([d622221](https://github.com/IBM/kui/commit/d622221))
- **packages/core:** the pipeStages splitting logic should not remove quotes and backslash escapes ([1cd235b](https://github.com/IBM/kui/commit/1cd235b)), closes [#7199](https://github.com/IBM/kui/issues/7199)
- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- **packages/core:** improve display of pipes vs quotes and backslash escape ([d951f54](https://github.com/IBM/kui/commit/d951f54)), closes [#7195](https://github.com/IBM/kui/issues/7195)
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- **plugins/plugin-core-support:** watch poller should support --until option to stop watcher ([4472d91](https://github.com/IBM/kui/commit/4472d91))
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- **plugins/plugin-bash-like:** ls ~ fails ([dace62c](https://github.com/IBM/kui/commit/dace62c)), closes [#7008](https://github.com/IBM/kui/issues/7008)
- cd and ls don't always work against vfs ([fb35ffc](https://github.com/IBM/kui/commit/fb35ffc)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- ls does not show mounts, but tab completion does ([8e5a053](https://github.com/IBM/kui/commit/8e5a053)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-bash-like:** ls does not show mounts, but tab completion does ([fd14881](https://github.com/IBM/kui/commit/fd14881)), closes [#6997](https://github.com/IBM/kui/issues/6997)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- cd command handles VFS mounts ([b66a2fb](https://github.com/IBM/kui/commit/b66a2fb)), closes [#6988](https://github.com/IBM/kui/issues/6988)
- **plugins/plugin-bash-like:** tab-complete VFS mounts ([009a00d](https://github.com/IBM/kui/commit/009a00d)), closes [#6989](https://github.com/IBM/kui/issues/6989)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- **plugins/plugin-client-test:** Add missing SpaceFiller to plugin-client-test ([a0f77ee](https://github.com/IBM/kui/commit/a0f77ee)), closes [#6687](https://github.com/IBM/kui/issues/6687)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- remove TreeResponse and PatternFly Tree Component ([e539a53](https://github.com/IBM/kui/commit/e539a53)), closes [#6581](https://github.com/IBM/kui/issues/6581) [#6328](https://github.com/IBM/kui/issues/6328)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)

### Features

- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- Allow command registrants to specify no semicolon expansion ([dbcaf87](https://github.com/IBM/kui/commit/dbcaf87)), closes [#6396](https://github.com/IBM/kui/issues/6396)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- tree should support leaf node drilling down ([006b881](https://github.com/IBM/kui/commit/006b881)), closes [#6293](https://github.com/IBM/kui/issues/6293)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)

### Features

- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add delta summary to Tree ([95a0b4a](https://github.com/IBM/kui/commit/95a0b4a)), closes [#6329](https://github.com/IBM/kui/issues/6329)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)

### Features

- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- add unit support of TreeResponse as one of the contents in MultiModalResponse ([85ea2d5](https://github.com/IBM/kui/commit/85ea2d5)), closes [#6132](https://github.com/IBM/kui/issues/6132)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)

### Features

- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- inline sidecar ([2c3afeb](https://github.com/IBM/kui/commit/2c3afeb)), closes [#6007](https://github.com/IBM/kui/issues/6007)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)
- **plugins/plugin-client-common:** threshold for auto-grid is too low ([9cb76ee](https://github.com/IBM/kui/commit/9cb76ee)), closes [#5424](https://github.com/IBM/kui/issues/5424)
- grid colors are sometimes off ([e66f56f](https://github.com/IBM/kui/commit/e66f56f)), closes [#5422](https://github.com/IBM/kui/issues/5422)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)

### Features

- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Bug Fixes

- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)

### Features

- add sequence diagram to table with timestamp columns ([e9028ee](https://github.com/IBM/kui/commit/e9028ee)), closes [#5336](https://github.com/IBM/kui/issues/5336)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/IBM/kui/commit/eb9f147)), closes [#5282](https://github.com/IBM/kui/issues/5282)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/IBM/kui/commit/677faca)), closes [#5302](https://github.com/IBM/kui/issues/5302) [#5303](https://github.com/IBM/kui/issues/5303)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- allow table model to specify a gridable column index ([f4ba8e6](https://github.com/IBM/kui/commit/f4ba8e6)), closes [#5278](https://github.com/IBM/kui/issues/5278)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.11.0](https://github.com/IBM/kui/compare/v4.5.0...v8.11.0) (2020-07-21)

### Bug Fixes

- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([1a8be9f](https://github.com/IBM/kui/commit/1a8be9f)), closes [#5013](https://github.com/IBM/kui/issues/5013)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)

### Features

- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- **plugins/plugin-client-common:** support client option for hero names in sidecar ([d4f6984](https://github.com/IBM/kui/commit/d4f6984)), closes [#4909](https://github.com/IBM/kui/issues/4909)
- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.10.0](https://github.com/IBM/kui/compare/v4.5.0...v8.10.0) (2020-06-17)

### Bug Fixes

- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)

### Features

- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.9.0](https://github.com/IBM/kui/compare/v4.5.0...v8.9.0) (2020-06-09)

### Bug Fixes

- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- allow user to disable table title by feature flags, and disable table pagination ([5450512](https://github.com/IBM/kui/commit/5450512)), closes [#4640](https://github.com/IBM/kui/issues/4640) [#4655](https://github.com/IBM/kui/issues/4655)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar back/forward should be ordered by visitation rather than insertion ([fba613a](https://github.com/IBM/kui/commit/fba613a)), closes [#4746](https://github.com/IBM/kui/issues/4746)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- TopNavSidecar doesn't return to the previous selected Tab when back button is hit ([32acee5](https://github.com/IBM/kui/commit/32acee5)), closes [#4745](https://github.com/IBM/kui/issues/4745)

### Features

- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)
- RadioTable and port of the themes table to use it ([79a3e8e](https://github.com/IBM/kui/commit/79a3e8e)), closes [#4507](https://github.com/IBM/kui/issues/4507)
- watcher panel for open-ended watch jobs ([6dfe7df](https://github.com/IBM/kui/commit/6dfe7df)), closes [#4503](https://github.com/IBM/kui/issues/4503)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.7.0](https://github.com/IBM/kui/compare/v4.5.0...v8.7.0) (2020-05-08)

### Bug Fixes

- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)

### Features

- kubectl edit via kui's editor ([414e813](https://github.com/IBM/kui/commit/414e813)), closes [#762](https://github.com/IBM/kui/issues/762)

### BREAKING CHANGES

- removes support for inBrowserOk

## [8.6.1](https://github.com/IBM/kui/compare/v4.5.0...v8.6.1) (2020-04-25)

### Bug Fixes

- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.6.0](https://github.com/IBM/kui/compare/v4.5.0...v8.6.0) (2020-04-23)

### Bug Fixes

- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- make inBrowserOk the default ([2a3c811](https://github.com/IBM/kui/commit/2a3c811)), closes [#4275](https://github.com/IBM/kui/issues/4275)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)

### BREAKING CHANGES

- removes support for inBrowserOk

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

**Note:** Version bump only for package @kui-shell/plugin-test-client
