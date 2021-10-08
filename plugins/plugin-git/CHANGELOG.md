# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.6.7](https://github.com/IBM/kui/compare/v10.6.6...v10.6.7) (2021-10-08)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.6.6](https://github.com/IBM/kui/compare/v10.6.5...v10.6.6) (2021-10-04)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.6.5](https://github.com/IBM/kui/compare/v10.6.4...v10.6.5) (2021-10-01)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.6.4](https://github.com/IBM/kui/compare/v10.6.3...v10.6.4) (2021-09-30)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.6.3](https://github.com/IBM/kui/compare/v10.6.2...v10.6.3) (2021-09-30)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.6.2](https://github.com/IBM/kui/compare/v10.6.1...v10.6.2) (2021-09-30)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.6.1](https://github.com/IBM/kui/compare/v10.6.0...v10.6.1) (2021-09-28)

**Note:** Version bump only for package @kui-shell/plugin-git

# [10.6.0](https://github.com/IBM/kui/compare/v4.5.0...v10.6.0) (2021-09-27)

### Bug Fixes

- react components result in invalid updates on unmounted components errors ([db66434](https://github.com/IBM/kui/commit/db66434)), closes [#7854](https://github.com/IBM/kui/issues/7854)
- **plugin-client-common:** RadioTable onSelect changes do not always result in status stripe updates ([3549b7a](https://github.com/IBM/kui/commit/3549b7a)), closes [#5644](https://github.com/IBM/kui/issues/5644)
- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- **plugins/plugin-git:** CurrentGitBranch widget errors onLoad for browser clients ([1ff62a2](https://github.com/IBM/kui/commit/1ff62a2)), closes [#7631](https://github.com/IBM/kui/issues/7631)
- avoid excessive status stripe overheads when replaying Notebooks ([58de9c0](https://github.com/IBM/kui/commit/58de9c0)), closes [#5635](https://github.com/IBM/kui/issues/5635)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- kui may try to open files of unbounded size in monaco-editor ([00197a5](https://github.com/IBM/kui/commit/00197a5)), closes [#7091](https://github.com/IBM/kui/issues/7091)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-git:** git branch command fails if the underlying git command decides to paginate ([45af52b](https://github.com/IBM/kui/commit/45af52b)), closes [#6535](https://github.com/IBM/kui/issues/6535)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- RadioTables are not replayable ([d0dd00e](https://github.com/IBM/kui/commit/d0dd00e)), closes [#5599](https://github.com/IBM/kui/issues/5599)
- restore status stripe to default behavior on terminal clear ([128ec92](https://github.com/IBM/kui/commit/128ec92)), closes [#5495](https://github.com/IBM/kui/issues/5495)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- **plugins/plugin-git:** kui's git branch command fails if the underlying git command decides to paginate ([47e1616](https://github.com/IBM/kui/commit/47e1616)), closes [#6535](https://github.com/IBM/kui/issues/6535)

### Features

- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)

# [10.5.0](https://github.com/IBM/kui/compare/v4.5.0...v10.5.0) (2021-09-13)

### Bug Fixes

- react components result in invalid updates on unmounted components errors ([db66434](https://github.com/IBM/kui/commit/db66434)), closes [#7854](https://github.com/IBM/kui/issues/7854)
- **plugin-client-common:** RadioTable onSelect changes do not always result in status stripe updates ([3549b7a](https://github.com/IBM/kui/commit/3549b7a)), closes [#5644](https://github.com/IBM/kui/issues/5644)
- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- **plugins/plugin-git:** CurrentGitBranch widget errors onLoad for browser clients ([1ff62a2](https://github.com/IBM/kui/commit/1ff62a2)), closes [#7631](https://github.com/IBM/kui/issues/7631)
- avoid excessive status stripe overheads when replaying Notebooks ([58de9c0](https://github.com/IBM/kui/commit/58de9c0)), closes [#5635](https://github.com/IBM/kui/issues/5635)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- kui may try to open files of unbounded size in monaco-editor ([00197a5](https://github.com/IBM/kui/commit/00197a5)), closes [#7091](https://github.com/IBM/kui/issues/7091)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-git:** git branch command fails if the underlying git command decides to paginate ([45af52b](https://github.com/IBM/kui/commit/45af52b)), closes [#6535](https://github.com/IBM/kui/issues/6535)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- RadioTables are not replayable ([d0dd00e](https://github.com/IBM/kui/commit/d0dd00e)), closes [#5599](https://github.com/IBM/kui/issues/5599)
- restore status stripe to default behavior on terminal clear ([128ec92](https://github.com/IBM/kui/commit/128ec92)), closes [#5495](https://github.com/IBM/kui/issues/5495)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- **plugins/plugin-git:** kui's git branch command fails if the underlying git command decides to paginate ([47e1616](https://github.com/IBM/kui/commit/47e1616)), closes [#6535](https://github.com/IBM/kui/issues/6535)

### Features

- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- **plugins/plugin-git:** CurrentGitBranch widget errors onLoad for browser clients ([1ff62a2](https://github.com/IBM/kui/commit/1ff62a2)), closes [#7631](https://github.com/IBM/kui/issues/7631)
- kui may try to open files of unbounded size in monaco-editor ([00197a5](https://github.com/IBM/kui/commit/00197a5)), closes [#7091](https://github.com/IBM/kui/issues/7091)
- **plugin-client-common:** RadioTable onSelect changes do not always result in status stripe updates ([3549b7a](https://github.com/IBM/kui/commit/3549b7a)), closes [#5644](https://github.com/IBM/kui/issues/5644)
- **plugins/plugin-git:** git branch command fails if the underlying git command decides to paginate ([45af52b](https://github.com/IBM/kui/commit/45af52b)), closes [#6535](https://github.com/IBM/kui/issues/6535)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- restore status stripe to default behavior on terminal clear ([128ec92](https://github.com/IBM/kui/commit/128ec92)), closes [#5495](https://github.com/IBM/kui/issues/5495)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugins/plugin-git:** kui's git branch command fails if the underlying git command decides to paginate ([47e1616](https://github.com/IBM/kui/commit/47e1616)), closes [#6535](https://github.com/IBM/kui/issues/6535)
- avoid excessive status stripe overheads when replaying Notebooks ([58de9c0](https://github.com/IBM/kui/commit/58de9c0)), closes [#5635](https://github.com/IBM/kui/issues/5635)
- RadioTables are not replayable ([d0dd00e](https://github.com/IBM/kui/commit/d0dd00e)), closes [#5599](https://github.com/IBM/kui/issues/5599)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)

### Features

- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

### Features

- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-git

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- **plugins/plugin-git:** git branch command fails if the underlying git command decides to paginate ([45af52b](https://github.com/IBM/kui/commit/45af52b)), closes [#6535](https://github.com/IBM/kui/issues/6535)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugin-client-common:** RadioTable onSelect changes do not always result in status stripe updates ([3549b7a](https://github.com/IBM/kui/commit/3549b7a)), closes [#5644](https://github.com/IBM/kui/issues/5644)
- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- **plugins/plugin-git:** kui's git branch command fails if the underlying git command decides to paginate ([47e1616](https://github.com/IBM/kui/commit/47e1616)), closes [#6535](https://github.com/IBM/kui/issues/6535)
- avoid excessive status stripe overheads when replaying Notebooks ([58de9c0](https://github.com/IBM/kui/commit/58de9c0)), closes [#5635](https://github.com/IBM/kui/issues/5635)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- RadioTables are not replayable ([d0dd00e](https://github.com/IBM/kui/commit/d0dd00e)), closes [#5599](https://github.com/IBM/kui/issues/5599)
- restore status stripe to default behavior on terminal clear ([128ec92](https://github.com/IBM/kui/commit/128ec92)), closes [#5495](https://github.com/IBM/kui/issues/5495)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)

### Features

- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- **plugins/plugin-git:** git branch command fails if the underlying git command decides to paginate ([45af52b](https://github.com/IBM/kui/commit/45af52b)), closes [#6535](https://github.com/IBM/kui/issues/6535)
- use Dropdown component for RadioTable impl ([244b16a](https://github.com/IBM/kui/commit/244b16a)), closes [#6539](https://github.com/IBM/kui/issues/6539)
- **plugin-client-common:** RadioTable onSelect changes do not always result in status stripe updates ([3549b7a](https://github.com/IBM/kui/commit/3549b7a)), closes [#5644](https://github.com/IBM/kui/issues/5644)
- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- **plugins/plugin-git:** kui's git branch command fails if the underlying git command decides to paginate ([47e1616](https://github.com/IBM/kui/commit/47e1616)), closes [#6535](https://github.com/IBM/kui/issues/6535)
- avoid excessive status stripe overheads when replaying Notebooks ([58de9c0](https://github.com/IBM/kui/commit/58de9c0)), closes [#5635](https://github.com/IBM/kui/issues/5635)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- RadioTables are not replayable ([d0dd00e](https://github.com/IBM/kui/commit/d0dd00e)), closes [#5599](https://github.com/IBM/kui/issues/5599)
- restore status stripe to default behavior on terminal clear ([128ec92](https://github.com/IBM/kui/commit/128ec92)), closes [#5495](https://github.com/IBM/kui/issues/5495)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)

### Features

- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **plugin-client-common:** RadioTable onSelect changes do not always result in status stripe updates ([3549b7a](https://github.com/IBM/kui/commit/3549b7a)), closes [#5644](https://github.com/IBM/kui/issues/5644)
- avoid excessive status stripe overheads when replaying Notebooks ([58de9c0](https://github.com/IBM/kui/commit/58de9c0)), closes [#5635](https://github.com/IBM/kui/issues/5635)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- RadioTables are not replayable ([d0dd00e](https://github.com/IBM/kui/commit/d0dd00e)), closes [#5599](https://github.com/IBM/kui/issues/5599)
- restore status stripe to default behavior on terminal clear ([128ec92](https://github.com/IBM/kui/commit/128ec92)), closes [#5495](https://github.com/IBM/kui/issues/5495)
- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)

### Features

- clicking changed files in the `git status widget` should show `git diff` result in a DiffEditor ([3a199c7](https://github.com/IBM/kui/commit/3a199c7)), closes [#6348](https://github.com/IBM/kui/issues/6348)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **plugin-client-common:** RadioTable onSelect changes do not always result in status stripe updates ([3549b7a](https://github.com/IBM/kui/commit/3549b7a)), closes [#5644](https://github.com/IBM/kui/issues/5644)
- avoid excessive status stripe overheads when replaying Notebooks ([58de9c0](https://github.com/IBM/kui/commit/58de9c0)), closes [#5635](https://github.com/IBM/kui/issues/5635)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- RadioTables are not replayable ([d0dd00e](https://github.com/IBM/kui/commit/d0dd00e)), closes [#5599](https://github.com/IBM/kui/issues/5599)
- restore status stripe to default behavior on terminal clear ([128ec92](https://github.com/IBM/kui/commit/128ec92)), closes [#5495](https://github.com/IBM/kui/issues/5495)
- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)

### Features

- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **plugin-client-common:** RadioTable onSelect changes do not always result in status stripe updates ([3549b7a](https://github.com/IBM/kui/commit/3549b7a)), closes [#5644](https://github.com/IBM/kui/issues/5644)
- avoid excessive status stripe overheads when replaying Notebooks ([58de9c0](https://github.com/IBM/kui/commit/58de9c0)), closes [#5635](https://github.com/IBM/kui/issues/5635)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- RadioTables are not replayable ([d0dd00e](https://github.com/IBM/kui/commit/d0dd00e)), closes [#5599](https://github.com/IBM/kui/issues/5599)
- restore status stripe to default behavior on terminal clear ([128ec92](https://github.com/IBM/kui/commit/128ec92)), closes [#5495](https://github.com/IBM/kui/issues/5495)
- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)

### Features

- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **plugin-client-common:** RadioTable onSelect changes do not always result in status stripe updates ([3549b7a](https://github.com/IBM/kui/commit/3549b7a)), closes [#5644](https://github.com/IBM/kui/issues/5644)
- avoid excessive status stripe overheads when replaying Notebooks ([58de9c0](https://github.com/IBM/kui/commit/58de9c0)), closes [#5635](https://github.com/IBM/kui/issues/5635)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- RadioTables are not replayable ([d0dd00e](https://github.com/IBM/kui/commit/d0dd00e)), closes [#5599](https://github.com/IBM/kui/issues/5599)
- restore status stripe to default behavior on terminal clear ([128ec92](https://github.com/IBM/kui/commit/128ec92)), closes [#5495](https://github.com/IBM/kui/issues/5495)
- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)

### Features

- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Bug Fixes

- **plugins/plugin-git:** CurrentGitBranch excessively reports errors to the console ([aa53c0a](https://github.com/IBM/kui/commit/aa53c0a)), closes [#5291](https://github.com/IBM/kui/issues/5291)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

### Features

- s3 plugin, and vfs ([970ba6e](https://github.com/IBM/kui/commit/970ba6e)), closes [#5319](https://github.com/IBM/kui/issues/5319)
- **plugins/plugin-git:** git branch should respond with RadioTable ([59a9213](https://github.com/IBM/kui/commit/59a9213)), closes [#5256](https://github.com/IBM/kui/issues/5256)
- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

# [8.11.0](https://github.com/IBM/kui/compare/v4.5.0...v8.11.0) (2020-07-21)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)

### Features

- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

# [8.10.0](https://github.com/IBM/kui/compare/v4.5.0...v8.10.0) (2020-06-17)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- improve hover effect for status stripe buttons ([50ced8f](https://github.com/IBM/kui/commit/50ced8f)), closes [#4896](https://github.com/IBM/kui/issues/4896)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)

### Features

- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

# [8.9.0](https://github.com/IBM/kui/compare/v4.5.0...v8.9.0) (2020-06-09)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

### Features

- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

# [8.7.0](https://github.com/IBM/kui/compare/v4.5.0...v8.7.0) (2020-05-08)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

### Features

- SPI for icons ([3d034e3](https://github.com/IBM/kui/commit/3d034e3)), closes [#4441](https://github.com/IBM/kui/issues/4441) [#4364](https://github.com/IBM/kui/issues/4364)

## [8.6.1](https://github.com/IBM/kui/compare/v4.5.0...v8.6.1) (2020-04-25)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

# [8.6.0](https://github.com/IBM/kui/compare/v4.5.0...v8.6.0) (2020-04-23)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- **plugins/plugin-git:** CurrentGitBranch widget can produce spurious console error messages ([705de4e](https://github.com/IBM/kui/commit/705de4e)), closes [#3941](https://github.com/IBM/kui/issues/3941)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-core-support:** tab completion of "interior" text is buggy ([b13cdb7](https://github.com/IBM/kui/commit/b13cdb7)), closes [#3605](https://github.com/IBM/kui/issues/3605)

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-git

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-git

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/plugin-git

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-git

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-git

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
