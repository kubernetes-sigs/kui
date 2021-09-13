# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.5.0](https://github.com/IBM/kui/compare/v4.5.0...v10.5.0) (2021-09-13)

### Bug Fixes

- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

**Note:** Version bump only for package @kui-shell/plugin-electron-components

# [8.11.0](https://github.com/IBM/kui/compare/v4.5.0...v8.11.0) (2020-07-21)

**Note:** Version bump only for package @kui-shell/plugin-electron-components
