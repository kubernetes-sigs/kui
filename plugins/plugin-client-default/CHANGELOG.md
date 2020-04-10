# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)
- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)
- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common
