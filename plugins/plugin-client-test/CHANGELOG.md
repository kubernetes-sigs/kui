# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
