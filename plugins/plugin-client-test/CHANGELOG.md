# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [8.10.16](https://github.com/IBM/kui/compare/v8.10.15...v8.10.16) (2020-10-01)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.15](https://github.com/IBM/kui/compare/v8.10.14...v8.10.15) (2020-07-22)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.14](https://github.com/IBM/kui/compare/v8.10.13...v8.10.14) (2020-07-22)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.13](https://github.com/IBM/kui/compare/v8.10.12...v8.10.13) (2020-07-14)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.12](https://github.com/IBM/kui/compare/v8.10.11...v8.10.12) (2020-07-10)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.11](https://github.com/IBM/kui/compare/v8.10.10...v8.10.11) (2020-07-09)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.10](https://github.com/IBM/kui/compare/v8.10.9...v8.10.10) (2020-07-07)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.9](https://github.com/IBM/kui/compare/v8.10.8...v8.10.9) (2020-07-06)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.8](https://github.com/IBM/kui/compare/v8.10.7...v8.10.8) (2020-07-02)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.7](https://github.com/IBM/kui/compare/v8.10.6...v8.10.7) (2020-07-01)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.6](https://github.com/IBM/kui/compare/v8.10.5...v8.10.6) (2020-06-30)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.5](https://github.com/IBM/kui/compare/v8.10.4...v8.10.5) (2020-06-27)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.4](https://github.com/IBM/kui/compare/v8.10.3...v8.10.4) (2020-06-26)

### Bug Fixes

- still see name-related breadcrumbs and short-name header with feature flag sidecarName 'heroText' ([71c3f06](https://github.com/IBM/kui/commit/71c3f06)), closes [#5013](https://github.com/IBM/kui/issues/5013)

### Features

- add capability to show welcome widget to new users in Terminal ([332627f](https://github.com/IBM/kui/commit/332627f)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)

## [8.10.3](https://github.com/IBM/kui/compare/v8.10.2...v8.10.3) (2020-06-25)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.2](https://github.com/IBM/kui/compare/v8.10.1...v8.10.2) (2020-06-24)

**Note:** Version bump only for package @kui-shell/plugin-test-client

## [8.10.1](https://github.com/IBM/kui/compare/v8.10.0...v8.10.1) (2020-06-18)

### Features

- **plugins/plugin-client-common:** support client option for hero names in sidecar ([6b930d9](https://github.com/IBM/kui/commit/6b930d9)), closes [#4909](https://github.com/IBM/kui/issues/4909)

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
