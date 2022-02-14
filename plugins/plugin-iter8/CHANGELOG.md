# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [11.2.5](https://github.com/kubernetes-sigs/kui/compare/v11.2.4...v11.2.5) (2022-02-14)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [11.2.4](https://github.com/kubernetes-sigs/kui/compare/v11.2.3...v11.2.4) (2022-02-14)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [11.2.3](https://github.com/kubernetes-sigs/kui/compare/v11.2.2...v11.2.3) (2022-02-09)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [11.2.2](https://github.com/kubernetes-sigs/kui/compare/v11.2.1...v11.2.2) (2022-02-09)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [11.2.1](https://github.com/kubernetes-sigs/kui/compare/v4.5.0...v11.2.1) (2022-02-09)

### Bug Fixes

- notebooks loaded from kui vfs do not display sample output ([6fc193e](https://github.com/kubernetes-sigs/kui/commit/6fc193e))
- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/kubernetes-sigs/kui/commit/31be8fc))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/kubernetes-sigs/kui/commit/531461d))
- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/kubernetes-sigs/kui/commit/1a783f3)), closes [#5977](https://github.com/kubernetes-sigs/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/kubernetes-sigs/kui/commit/c6d1633)), closes [#5868](https://github.com/kubernetes-sigs/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/kubernetes-sigs/kui/commit/8fff7b4)), closes [#5432](https://github.com/kubernetes-sigs/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/kubernetes-sigs/kui/commit/bf20b03)), closes [#6432](https://github.com/kubernetes-sigs/kui/issues/6432)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/kubernetes-sigs/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/kubernetes-sigs/kui/commit/c8f9351)), closes [#6875](https://github.com/kubernetes-sigs/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/kubernetes-sigs/kui/commit/1af5cc2)), closes [#5858](https://github.com/kubernetes-sigs/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/kubernetes-sigs/kui/commit/5a3f5e8)), closes [#5916](https://github.com/kubernetes-sigs/kui/issues/5916) [#5672](https://github.com/kubernetes-sigs/kui/issues/5672)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/kubernetes-sigs/kui/commit/dfc6cfb)), closes [#5419](https://github.com/kubernetes-sigs/kui/issues/5419)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/kubernetes-sigs/kui/commit/1899a78)), closes [#5408](https://github.com/kubernetes-sigs/kui/issues/5408)

### chore

- port notebooks to markdown ([a64295d](https://github.com/kubernetes-sigs/kui/commit/a64295d))

### Features

- add support for left strip positioning of terminal splits ([a8dc71f](https://github.com/kubernetes-sigs/kui/commit/a8dc71f)), closes [#8202](https://github.com/kubernetes-sigs/kui/issues/8202)
- extend markdown tab syntax to be presented as a Wizard UI ([173e436](https://github.com/kubernetes-sigs/kui/commit/173e436))
- update Iter8 notebooks ([69d1ec0](https://github.com/kubernetes-sigs/kui/commit/69d1ec0))
- when inlining guidebook snippets, rewrite relative image links ([b403164](https://github.com/kubernetes-sigs/kui/commit/b403164))
- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/kubernetes-sigs/kui/commit/82989ab)), closes [#5400](https://github.com/kubernetes-sigs/kui/issues/5400)

### BREAKING CHANGES

- removes support for JSON notebooks

# [11.2.0](https://github.com/kubernetes-sigs/kui/compare/v4.5.0...v11.2.0) (2022-02-09)

### Bug Fixes

- notebooks loaded from kui vfs do not display sample output ([6fc193e](https://github.com/kubernetes-sigs/kui/commit/6fc193e))
- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/kubernetes-sigs/kui/commit/31be8fc))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/kubernetes-sigs/kui/commit/531461d))
- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/kubernetes-sigs/kui/commit/1a783f3)), closes [#5977](https://github.com/kubernetes-sigs/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/kubernetes-sigs/kui/commit/c6d1633)), closes [#5868](https://github.com/kubernetes-sigs/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/kubernetes-sigs/kui/commit/8fff7b4)), closes [#5432](https://github.com/kubernetes-sigs/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/kubernetes-sigs/kui/commit/bf20b03)), closes [#6432](https://github.com/kubernetes-sigs/kui/issues/6432)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/kubernetes-sigs/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/kubernetes-sigs/kui/commit/c8f9351)), closes [#6875](https://github.com/kubernetes-sigs/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/kubernetes-sigs/kui/commit/1af5cc2)), closes [#5858](https://github.com/kubernetes-sigs/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/kubernetes-sigs/kui/commit/5a3f5e8)), closes [#5916](https://github.com/kubernetes-sigs/kui/issues/5916) [#5672](https://github.com/kubernetes-sigs/kui/issues/5672)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/kubernetes-sigs/kui/commit/dfc6cfb)), closes [#5419](https://github.com/kubernetes-sigs/kui/issues/5419)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/kubernetes-sigs/kui/commit/1899a78)), closes [#5408](https://github.com/kubernetes-sigs/kui/issues/5408)

### chore

- port notebooks to markdown ([a64295d](https://github.com/kubernetes-sigs/kui/commit/a64295d))

### Features

- add support for left strip positioning of terminal splits ([a8dc71f](https://github.com/kubernetes-sigs/kui/commit/a8dc71f)), closes [#8202](https://github.com/kubernetes-sigs/kui/issues/8202)
- extend markdown tab syntax to be presented as a Wizard UI ([173e436](https://github.com/kubernetes-sigs/kui/commit/173e436))
- update Iter8 notebooks ([69d1ec0](https://github.com/kubernetes-sigs/kui/commit/69d1ec0))
- when inlining guidebook snippets, rewrite relative image links ([b403164](https://github.com/kubernetes-sigs/kui/commit/b403164))
- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/kubernetes-sigs/kui/commit/82989ab)), closes [#5400](https://github.com/kubernetes-sigs/kui/issues/5400)

### BREAKING CHANGES

- removes support for JSON notebooks

# [11.1.0](https://github.com/kubernetes-sigs/kui/compare/v4.5.0...v11.1.0) (2022-01-24)

### Bug Fixes

- notebooks loaded from kui vfs do not display sample output ([6fc193e](https://github.com/kubernetes-sigs/kui/commit/6fc193e))
- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/kubernetes-sigs/kui/commit/31be8fc))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/kubernetes-sigs/kui/commit/531461d))
- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/kubernetes-sigs/kui/commit/1a783f3)), closes [#5977](https://github.com/kubernetes-sigs/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/kubernetes-sigs/kui/commit/c6d1633)), closes [#5868](https://github.com/kubernetes-sigs/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/kubernetes-sigs/kui/commit/8fff7b4)), closes [#5432](https://github.com/kubernetes-sigs/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/kubernetes-sigs/kui/commit/bf20b03)), closes [#6432](https://github.com/kubernetes-sigs/kui/issues/6432)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/kubernetes-sigs/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/kubernetes-sigs/kui/commit/c8f9351)), closes [#6875](https://github.com/kubernetes-sigs/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/kubernetes-sigs/kui/commit/1af5cc2)), closes [#5858](https://github.com/kubernetes-sigs/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/kubernetes-sigs/kui/commit/5a3f5e8)), closes [#5916](https://github.com/kubernetes-sigs/kui/issues/5916) [#5672](https://github.com/kubernetes-sigs/kui/issues/5672)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/kubernetes-sigs/kui/commit/dfc6cfb)), closes [#5419](https://github.com/kubernetes-sigs/kui/issues/5419)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/kubernetes-sigs/kui/commit/1899a78)), closes [#5408](https://github.com/kubernetes-sigs/kui/issues/5408)

### chore

- port notebooks to markdown ([a64295d](https://github.com/kubernetes-sigs/kui/commit/a64295d))

### Features

- add support for left strip positioning of terminal splits ([a8dc71f](https://github.com/kubernetes-sigs/kui/commit/a8dc71f)), closes [#8202](https://github.com/kubernetes-sigs/kui/issues/8202)
- extend markdown tab syntax to be presented as a Wizard UI ([173e436](https://github.com/kubernetes-sigs/kui/commit/173e436))
- update Iter8 notebooks ([69d1ec0](https://github.com/kubernetes-sigs/kui/commit/69d1ec0))
- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/kubernetes-sigs/kui/commit/82989ab)), closes [#5400](https://github.com/kubernetes-sigs/kui/issues/5400)

### BREAKING CHANGES

- removes support for JSON notebooks

# [11.0.0](https://github.com/kubernetes-sigs/kui/compare/v4.5.0...v11.0.0) (2022-01-18)

### Bug Fixes

- notebooks loaded from kui vfs do not display sample output ([6fc193e](https://github.com/kubernetes-sigs/kui/commit/6fc193e))
- **packages/core:** Capabilities API added and documentation updated ([31be8fc](https://github.com/kubernetes-sigs/kui/commit/31be8fc))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/kubernetes-sigs/kui/commit/531461d))
- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/kubernetes-sigs/kui/commit/1a783f3)), closes [#5977](https://github.com/kubernetes-sigs/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/kubernetes-sigs/kui/commit/c6d1633)), closes [#5868](https://github.com/kubernetes-sigs/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/kubernetes-sigs/kui/commit/8fff7b4)), closes [#5432](https://github.com/kubernetes-sigs/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/kubernetes-sigs/kui/commit/bf20b03)), closes [#6432](https://github.com/kubernetes-sigs/kui/issues/6432)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/kubernetes-sigs/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/kubernetes-sigs/kui/commit/c8f9351)), closes [#6875](https://github.com/kubernetes-sigs/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/kubernetes-sigs/kui/commit/1af5cc2)), closes [#5858](https://github.com/kubernetes-sigs/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/kubernetes-sigs/kui/commit/5a3f5e8)), closes [#5916](https://github.com/kubernetes-sigs/kui/issues/5916) [#5672](https://github.com/kubernetes-sigs/kui/issues/5672)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/kubernetes-sigs/kui/commit/dfc6cfb)), closes [#5419](https://github.com/kubernetes-sigs/kui/issues/5419)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/kubernetes-sigs/kui/commit/1899a78)), closes [#5408](https://github.com/kubernetes-sigs/kui/issues/5408)

### chore

- port notebooks to markdown ([a64295d](https://github.com/kubernetes-sigs/kui/commit/a64295d))

### Features

- add support for left strip positioning of terminal splits ([a8dc71f](https://github.com/kubernetes-sigs/kui/commit/a8dc71f)), closes [#8202](https://github.com/kubernetes-sigs/kui/issues/8202)
- update Iter8 notebooks ([69d1ec0](https://github.com/kubernetes-sigs/kui/commit/69d1ec0))
- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/kubernetes-sigs/kui/commit/82989ab)), closes [#5400](https://github.com/kubernetes-sigs/kui/issues/5400)

### BREAKING CHANGES

- removes support for JSON notebooks

# [10.7.0](https://github.com/kubernetes-sigs/kui/compare/v4.5.0...v10.7.0) (2021-10-12)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/kubernetes-sigs/kui/commit/1a783f3)), closes [#5977](https://github.com/kubernetes-sigs/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/kubernetes-sigs/kui/commit/c6d1633)), closes [#5868](https://github.com/kubernetes-sigs/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/kubernetes-sigs/kui/commit/8fff7b4)), closes [#5432](https://github.com/kubernetes-sigs/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/kubernetes-sigs/kui/commit/bf20b03)), closes [#6432](https://github.com/kubernetes-sigs/kui/issues/6432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/kubernetes-sigs/kui/commit/dfc6cfb)), closes [#5419](https://github.com/kubernetes-sigs/kui/issues/5419)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/kubernetes-sigs/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/kubernetes-sigs/kui/commit/c8f9351)), closes [#6875](https://github.com/kubernetes-sigs/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/kubernetes-sigs/kui/commit/1af5cc2)), closes [#5858](https://github.com/kubernetes-sigs/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/kubernetes-sigs/kui/commit/5a3f5e8)), closes [#5916](https://github.com/kubernetes-sigs/kui/issues/5916) [#5672](https://github.com/kubernetes-sigs/kui/issues/5672)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/kubernetes-sigs/kui/commit/1899a78)), closes [#5408](https://github.com/kubernetes-sigs/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/kubernetes-sigs/kui/commit/82989ab)), closes [#5400](https://github.com/kubernetes-sigs/kui/issues/5400)

# [10.6.0](https://github.com/kubernetes-sigs/kui/compare/v4.5.0...v10.6.0) (2021-09-27)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/kubernetes-sigs/kui/commit/1a783f3)), closes [#5977](https://github.com/kubernetes-sigs/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/kubernetes-sigs/kui/commit/c6d1633)), closes [#5868](https://github.com/kubernetes-sigs/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/kubernetes-sigs/kui/commit/8fff7b4)), closes [#5432](https://github.com/kubernetes-sigs/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/kubernetes-sigs/kui/commit/bf20b03)), closes [#6432](https://github.com/kubernetes-sigs/kui/issues/6432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/kubernetes-sigs/kui/commit/dfc6cfb)), closes [#5419](https://github.com/kubernetes-sigs/kui/issues/5419)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/kubernetes-sigs/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/kubernetes-sigs/kui/commit/c8f9351)), closes [#6875](https://github.com/kubernetes-sigs/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/kubernetes-sigs/kui/commit/1af5cc2)), closes [#5858](https://github.com/kubernetes-sigs/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/kubernetes-sigs/kui/commit/5a3f5e8)), closes [#5916](https://github.com/kubernetes-sigs/kui/issues/5916) [#5672](https://github.com/kubernetes-sigs/kui/issues/5672)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/kubernetes-sigs/kui/commit/1899a78)), closes [#5408](https://github.com/kubernetes-sigs/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/kubernetes-sigs/kui/commit/82989ab)), closes [#5400](https://github.com/kubernetes-sigs/kui/issues/5400)

# [10.5.0](https://github.com/kubernetes-sigs/kui/compare/v4.5.0...v10.5.0) (2021-09-13)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/kubernetes-sigs/kui/commit/1a783f3)), closes [#5977](https://github.com/kubernetes-sigs/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/kubernetes-sigs/kui/commit/c6d1633)), closes [#5868](https://github.com/kubernetes-sigs/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/kubernetes-sigs/kui/commit/8fff7b4)), closes [#5432](https://github.com/kubernetes-sigs/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/kubernetes-sigs/kui/commit/bf20b03)), closes [#6432](https://github.com/kubernetes-sigs/kui/issues/6432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/kubernetes-sigs/kui/commit/dfc6cfb)), closes [#5419](https://github.com/kubernetes-sigs/kui/issues/5419)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/kubernetes-sigs/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/kubernetes-sigs/kui/commit/c8f9351)), closes [#6875](https://github.com/kubernetes-sigs/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/kubernetes-sigs/kui/commit/1af5cc2)), closes [#5858](https://github.com/kubernetes-sigs/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/kubernetes-sigs/kui/commit/5a3f5e8)), closes [#5916](https://github.com/kubernetes-sigs/kui/issues/5916) [#5672](https://github.com/kubernetes-sigs/kui/issues/5672)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/kubernetes-sigs/kui/commit/1899a78)), closes [#5408](https://github.com/kubernetes-sigs/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/kubernetes-sigs/kui/commit/82989ab)), closes [#5400](https://github.com/kubernetes-sigs/kui/issues/5400)

# [10.4.0](https://github.com/kubernetes-sigs/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/kubernetes-sigs/kui/commit/1a783f3)), closes [#5977](https://github.com/kubernetes-sigs/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/kubernetes-sigs/kui/commit/c6d1633)), closes [#5868](https://github.com/kubernetes-sigs/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/kubernetes-sigs/kui/commit/8fff7b4)), closes [#5432](https://github.com/kubernetes-sigs/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/kubernetes-sigs/kui/commit/bf20b03)), closes [#6432](https://github.com/kubernetes-sigs/kui/issues/6432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/kubernetes-sigs/kui/commit/dfc6cfb)), closes [#5419](https://github.com/kubernetes-sigs/kui/issues/5419)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/kubernetes-sigs/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/kubernetes-sigs/kui/commit/c8f9351)), closes [#6875](https://github.com/kubernetes-sigs/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/kubernetes-sigs/kui/commit/1af5cc2)), closes [#5858](https://github.com/kubernetes-sigs/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/kubernetes-sigs/kui/commit/5a3f5e8)), closes [#5916](https://github.com/kubernetes-sigs/kui/issues/5916) [#5672](https://github.com/kubernetes-sigs/kui/issues/5672)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/kubernetes-sigs/kui/commit/1899a78)), closes [#5408](https://github.com/kubernetes-sigs/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/kubernetes-sigs/kui/commit/82989ab)), closes [#5400](https://github.com/kubernetes-sigs/kui/issues/5400)

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-iter8

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/IBM/kui/commit/1a783f3)), closes [#5977](https://github.com/IBM/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/IBM/kui/commit/c6d1633)), closes [#5868](https://github.com/IBM/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/IBM/kui/commit/8fff7b4)), closes [#5432](https://github.com/IBM/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/IBM/kui/commit/bf20b03)), closes [#6432](https://github.com/IBM/kui/issues/6432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/IBM/kui/commit/dfc6cfb)), closes [#5419](https://github.com/IBM/kui/issues/5419)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/IBM/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/IBM/kui/commit/c8f9351)), closes [#6875](https://github.com/IBM/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/IBM/kui/commit/1af5cc2)), closes [#5858](https://github.com/IBM/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/IBM/kui/commit/5a3f5e8)), closes [#5916](https://github.com/IBM/kui/issues/5916) [#5672](https://github.com/IBM/kui/issues/5672)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/IBM/kui/commit/1899a78)), closes [#5408](https://github.com/IBM/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/IBM/kui/commit/82989ab)), closes [#5400](https://github.com/IBM/kui/issues/5400)

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/IBM/kui/commit/1a783f3)), closes [#5977](https://github.com/IBM/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/IBM/kui/commit/c6d1633)), closes [#5868](https://github.com/IBM/kui/issues/5868)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/IBM/kui/commit/8fff7b4)), closes [#5432](https://github.com/IBM/kui/issues/5432)
- **plugins/plugin-iter8:** fix for typing errors in plugin-iter8 ([bf20b03](https://github.com/IBM/kui/commit/bf20b03)), closes [#6432](https://github.com/IBM/kui/issues/6432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/IBM/kui/commit/dfc6cfb)), closes [#5419](https://github.com/IBM/kui/issues/5419)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/IBM/kui/commit/0691c4d))
- **plugins/plugin-iter8:** remove use of patternfly's Touchspin ([c8f9351](https://github.com/IBM/kui/commit/c8f9351)), closes [#6875](https://github.com/IBM/kui/issues/6875)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/IBM/kui/commit/1af5cc2)), closes [#5858](https://github.com/IBM/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/IBM/kui/commit/5a3f5e8)), closes [#5916](https://github.com/IBM/kui/issues/5916) [#5672](https://github.com/IBM/kui/issues/5672)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/IBM/kui/commit/1899a78)), closes [#5408](https://github.com/IBM/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/IBM/kui/commit/82989ab)), closes [#5400](https://github.com/IBM/kui/issues/5400)

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/IBM/kui/commit/1a783f3)), closes [#5977](https://github.com/IBM/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/IBM/kui/commit/c6d1633)), closes [#5868](https://github.com/IBM/kui/issues/5868)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/IBM/kui/commit/0691c4d))
- improve existing notebooks for v1 ([1af5cc2](https://github.com/IBM/kui/commit/1af5cc2)), closes [#5858](https://github.com/IBM/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/IBM/kui/commit/5a3f5e8)), closes [#5916](https://github.com/IBM/kui/issues/5916) [#5672](https://github.com/IBM/kui/issues/5672)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/IBM/kui/commit/8fff7b4)), closes [#5432](https://github.com/IBM/kui/issues/5432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/IBM/kui/commit/dfc6cfb)), closes [#5419](https://github.com/IBM/kui/issues/5419)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/IBM/kui/commit/1899a78)), closes [#5408](https://github.com/IBM/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/IBM/kui/commit/82989ab)), closes [#5400](https://github.com/IBM/kui/issues/5400)

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/IBM/kui/commit/1a783f3)), closes [#5977](https://github.com/IBM/kui/issues/5977)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/IBM/kui/commit/c6d1633)), closes [#5868](https://github.com/IBM/kui/issues/5868)
- **plugins/plugin-iter8:** minor install command edit in notebook ([0691c4d](https://github.com/IBM/kui/commit/0691c4d))
- improve existing notebooks for v1 ([1af5cc2](https://github.com/IBM/kui/commit/1af5cc2)), closes [#5858](https://github.com/IBM/kui/issues/5858)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/IBM/kui/commit/5a3f5e8)), closes [#5916](https://github.com/IBM/kui/issues/5916) [#5672](https://github.com/IBM/kui/issues/5672)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/IBM/kui/commit/8fff7b4)), closes [#5432](https://github.com/IBM/kui/issues/5432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/IBM/kui/commit/dfc6cfb)), closes [#5419](https://github.com/IBM/kui/issues/5419)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/IBM/kui/commit/1899a78)), closes [#5408](https://github.com/IBM/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/IBM/kui/commit/82989ab)), closes [#5400](https://github.com/IBM/kui/issues/5400)

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **plugins/plugin-client-common:** group the notebooks together in the ls -l table ([1a783f3](https://github.com/IBM/kui/commit/1a783f3)), closes [#5977](https://github.com/IBM/kui/issues/5977)
- store the commentary text result to the command when editing is done ([5a3f5e8](https://github.com/IBM/kui/commit/5a3f5e8)), closes [#5916](https://github.com/IBM/kui/issues/5916) [#5672](https://github.com/IBM/kui/issues/5672)
- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/IBM/kui/commit/c6d1633)), closes [#5868](https://github.com/IBM/kui/issues/5868)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/IBM/kui/commit/1af5cc2)), closes [#5858](https://github.com/IBM/kui/issues/5858)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/IBM/kui/commit/8fff7b4)), closes [#5432](https://github.com/IBM/kui/issues/5432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/IBM/kui/commit/dfc6cfb)), closes [#5419](https://github.com/IBM/kui/issues/5419)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/IBM/kui/commit/1899a78)), closes [#5408](https://github.com/IBM/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/IBM/kui/commit/82989ab)), closes [#5400](https://github.com/IBM/kui/issues/5400)

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **plugins/plugin-client-common:** isReplay bit on Blocks is not set for snapshots ([c6d1633](https://github.com/IBM/kui/commit/c6d1633)), closes [#5868](https://github.com/IBM/kui/issues/5868)
- improve existing notebooks for v1 ([1af5cc2](https://github.com/IBM/kui/commit/1af5cc2)), closes [#5858](https://github.com/IBM/kui/issues/5858)
- **plugins/plugin-iter8:** avoid collisions with global css rules ([8fff7b4](https://github.com/IBM/kui/commit/8fff7b4)), closes [#5432](https://github.com/IBM/kui/issues/5432)
- **plugins/plugin-iter8:** iter8 create experiment combo boxes have misplaced svg ([dfc6cfb](https://github.com/IBM/kui/commit/dfc6cfb)), closes [#5419](https://github.com/IBM/kui/issues/5419)
- **plugins/plugin-iter8:** Removed execSync from iter8 plugin ([1899a78](https://github.com/IBM/kui/commit/1899a78)), closes [#5408](https://github.com/IBM/kui/issues/5408)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/IBM/kui/commit/82989ab)), closes [#5400](https://github.com/IBM/kui/issues/5400)

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Features

- **plugins/plugin-iter8:** added new iter8 plugin ([82989ab](https://github.com/IBM/kui/commit/82989ab)), closes [#5400](https://github.com/IBM/kui/issues/5400)
