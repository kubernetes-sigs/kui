# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.6.5](https://github.com/IBM/kui/compare/v10.6.4...v10.6.5) (2021-10-01)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.6.4](https://github.com/IBM/kui/compare/v10.6.3...v10.6.4) (2021-09-30)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.6.3](https://github.com/IBM/kui/compare/v10.6.2...v10.6.3) (2021-09-30)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.6.2](https://github.com/IBM/kui/compare/v10.6.1...v10.6.2) (2021-09-30)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.6.1](https://github.com/IBM/kui/compare/v10.6.0...v10.6.1) (2021-09-28)

**Note:** Version bump only for package @kui-shell/plugin-client

# [10.6.0](https://github.com/IBM/kui/compare/v4.5.0...v10.6.0) (2021-09-27)

### Bug Fixes

- Revamp notebook styling a bit ([c4bc1e1](https://github.com/IBM/kui/commit/c4bc1e1)), closes [#7922](https://github.com/IBM/kui/issues/7922)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** clicking the split button may cause the current processing block to disappear ([aa2b40c](https://github.com/IBM/kui/commit/aa2b40c)), closes [#5703](https://github.com/IBM/kui/issues/5703)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-default:** compilation error ([64169e8](https://github.com/IBM/kui/commit/64169e8))
- **plugins/plugin-client-default:** CurrentContext/Namespace in plugin-client-default don't exit Loading state ([8193d21](https://github.com/IBM/kui/commit/8193d21)), closes [#7665](https://github.com/IBM/kui/issues/7665)
- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- **plugins/plugin-client-default:** Don't show CWD status stripe widget in Popup mode ([52159d7](https://github.com/IBM/kui/commit/52159d7)), closes [#6018](https://github.com/IBM/kui/issues/6018)
- **plugins/plugin-client-default:** don't show UpdateChecker in popup mode ([67fd5a6](https://github.com/IBM/kui/commit/67fd5a6)), closes [#6016](https://github.com/IBM/kui/issues/6016)
- **plugins/plugin-client-default:** Don't use OpenWhisk status stripe widget in popup mode ([6a35183](https://github.com/IBM/kui/commit/6a35183)), closes [#6268](https://github.com/IBM/kui/issues/6268)
- **plugins/plugin-client-default:** remove Screenshot component ([c849168](https://github.com/IBM/kui/commit/c849168))
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- avoiding reopening the Welcome to Kui tab even after the user has closed it ([6b0faff](https://github.com/IBM/kui/commit/6b0faff)), closes [#5673](https://github.com/IBM/kui/issues/5673)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- keyboard history navigation does not work in Popup clients ([89197ba](https://github.com/IBM/kui/commit/89197ba)), closes [#6262](https://github.com/IBM/kui/issues/6262)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove kubeui command prefix ([e2539cb](https://github.com/IBM/kui/commit/e2539cb)), closes [#7314](https://github.com/IBM/kui/issues/7314)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)
- load-time tuning ([1a9b10e](https://github.com/IBM/kui/commit/1a9b10e)), closes [#8070](https://github.com/IBM/kui/issues/8070)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable splits for popup mode ([0b95d9c](https://github.com/IBM/kui/commit/0b95d9c)), closes [#7542](https://github.com/IBM/kui/issues/7542)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Make a notebook about making notebooks ([0d67947](https://github.com/IBM/kui/commit/0d67947)), closes [#6040](https://github.com/IBM/kui/issues/6040)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/IBM/kui/commit/b9c5867)), closes [#6109](https://github.com/IBM/kui/issues/6109)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- s3 plugin ([177457f](https://github.com/IBM/kui/commit/177457f)), closes [#7536](https://github.com/IBM/kui/issues/7536)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- update ls to allow for presenting content from more limited VFS's such as tutorials ([a1ff1a4](https://github.com/IBM/kui/commit/a1ff1a4)), closes [#5497](https://github.com/IBM/kui/issues/5497)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)
- use webpack to build headless bundles ([e7c0d76](https://github.com/IBM/kui/commit/e7c0d76))
- **packages/core:** Allow clients to define the contents of the Notebooks menu. ([7462c1a](https://github.com/IBM/kui/commit/7462c1a))
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)
- **plugins/plugin-kubectl:** popeye dashboard ([6dd4d01](https://github.com/IBM/kui/commit/6dd4d01)), closes [#6949](https://github.com/IBM/kui/issues/6949)

### BREAKING CHANGES

- this alters the loading cycle in a way that may break sensitive tests, mostly by making certain actions a bit more asynchronous
- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [10.5.0](https://github.com/IBM/kui/compare/v4.5.0...v10.5.0) (2021-09-13)

### Bug Fixes

- Revamp notebook styling a bit ([c4bc1e1](https://github.com/IBM/kui/commit/c4bc1e1)), closes [#7922](https://github.com/IBM/kui/issues/7922)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** clicking the split button may cause the current processing block to disappear ([aa2b40c](https://github.com/IBM/kui/commit/aa2b40c)), closes [#5703](https://github.com/IBM/kui/issues/5703)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-default:** compilation error ([64169e8](https://github.com/IBM/kui/commit/64169e8))
- **plugins/plugin-client-default:** CurrentContext/Namespace in plugin-client-default don't exit Loading state ([8193d21](https://github.com/IBM/kui/commit/8193d21)), closes [#7665](https://github.com/IBM/kui/issues/7665)
- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- **plugins/plugin-client-default:** Don't show CWD status stripe widget in Popup mode ([52159d7](https://github.com/IBM/kui/commit/52159d7)), closes [#6018](https://github.com/IBM/kui/issues/6018)
- **plugins/plugin-client-default:** don't show UpdateChecker in popup mode ([67fd5a6](https://github.com/IBM/kui/commit/67fd5a6)), closes [#6016](https://github.com/IBM/kui/issues/6016)
- **plugins/plugin-client-default:** Don't use OpenWhisk status stripe widget in popup mode ([6a35183](https://github.com/IBM/kui/commit/6a35183)), closes [#6268](https://github.com/IBM/kui/issues/6268)
- **plugins/plugin-client-default:** remove Screenshot component ([c849168](https://github.com/IBM/kui/commit/c849168))
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- avoiding reopening the Welcome to Kui tab even after the user has closed it ([6b0faff](https://github.com/IBM/kui/commit/6b0faff)), closes [#5673](https://github.com/IBM/kui/issues/5673)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- keyboard history navigation does not work in Popup clients ([89197ba](https://github.com/IBM/kui/commit/89197ba)), closes [#6262](https://github.com/IBM/kui/issues/6262)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove kubeui command prefix ([e2539cb](https://github.com/IBM/kui/commit/e2539cb)), closes [#7314](https://github.com/IBM/kui/issues/7314)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable splits for popup mode ([0b95d9c](https://github.com/IBM/kui/commit/0b95d9c)), closes [#7542](https://github.com/IBM/kui/issues/7542)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Make a notebook about making notebooks ([0d67947](https://github.com/IBM/kui/commit/0d67947)), closes [#6040](https://github.com/IBM/kui/issues/6040)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/IBM/kui/commit/b9c5867)), closes [#6109](https://github.com/IBM/kui/issues/6109)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- s3 plugin ([177457f](https://github.com/IBM/kui/commit/177457f)), closes [#7536](https://github.com/IBM/kui/issues/7536)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- update ls to allow for presenting content from more limited VFS's such as tutorials ([a1ff1a4](https://github.com/IBM/kui/commit/a1ff1a4)), closes [#5497](https://github.com/IBM/kui/issues/5497)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)
- use webpack to build headless bundles ([e7c0d76](https://github.com/IBM/kui/commit/e7c0d76))
- **packages/core:** Allow clients to define the contents of the Notebooks menu. ([7462c1a](https://github.com/IBM/kui/commit/7462c1a))
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)
- **plugins/plugin-kubectl:** popeye dashboard ([6dd4d01](https://github.com/IBM/kui/commit/6dd4d01)), closes [#6949](https://github.com/IBM/kui/issues/6949)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- **plugins/plugin-client-default:** compilation error ([64169e8](https://github.com/IBM/kui/commit/64169e8))
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- avoiding reopening the Welcome to Kui tab even after the user has closed it ([6b0faff](https://github.com/IBM/kui/commit/6b0faff)), closes [#5673](https://github.com/IBM/kui/issues/5673)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- keyboard history navigation does not work in Popup clients ([89197ba](https://github.com/IBM/kui/commit/89197ba)), closes [#6262](https://github.com/IBM/kui/issues/6262)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove kubeui command prefix ([e2539cb](https://github.com/IBM/kui/commit/e2539cb)), closes [#7314](https://github.com/IBM/kui/issues/7314)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** clicking the split button may cause the current processing block to disappear ([aa2b40c](https://github.com/IBM/kui/commit/aa2b40c)), closes [#5703](https://github.com/IBM/kui/issues/5703)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- **plugins/plugin-client-default:** Don't show CWD status stripe widget in Popup mode ([52159d7](https://github.com/IBM/kui/commit/52159d7)), closes [#6018](https://github.com/IBM/kui/issues/6018)
- **plugins/plugin-client-default:** don't show UpdateChecker in popup mode ([67fd5a6](https://github.com/IBM/kui/commit/67fd5a6)), closes [#6016](https://github.com/IBM/kui/issues/6016)
- **plugins/plugin-client-default:** Don't use OpenWhisk status stripe widget in popup mode ([6a35183](https://github.com/IBM/kui/commit/6a35183)), closes [#6268](https://github.com/IBM/kui/issues/6268)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- enable splits for popup mode ([0b95d9c](https://github.com/IBM/kui/commit/0b95d9c)), closes [#7542](https://github.com/IBM/kui/issues/7542)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Make a notebook about making notebooks ([0d67947](https://github.com/IBM/kui/commit/0d67947)), closes [#6040](https://github.com/IBM/kui/issues/6040)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/IBM/kui/commit/b9c5867)), closes [#6109](https://github.com/IBM/kui/issues/6109)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- s3 plugin ([177457f](https://github.com/IBM/kui/commit/177457f)), closes [#7536](https://github.com/IBM/kui/issues/7536)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- update ls to allow for presenting content from more limited VFS's such as tutorials ([a1ff1a4](https://github.com/IBM/kui/commit/a1ff1a4)), closes [#5497](https://github.com/IBM/kui/issues/5497)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)
- use webpack to build headless bundles ([e7c0d76](https://github.com/IBM/kui/commit/e7c0d76))
- **packages/core:** Allow clients to define the contents of the Notebooks menu. ([7462c1a](https://github.com/IBM/kui/commit/7462c1a))
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)
- **plugins/plugin-kubectl:** popeye dashboard ([6dd4d01](https://github.com/IBM/kui/commit/6dd4d01)), closes [#6949](https://github.com/IBM/kui/issues/6949)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

### Features

- use Select Component for Kubernetes Context and Namespace status stripe widgets ([0e1c25e](https://github.com/IBM/kui/commit/0e1c25e)), closes [#6920](https://github.com/IBM/kui/issues/6920)

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-client

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- keyboard history navigation does not work in Popup clients ([89197ba](https://github.com/IBM/kui/commit/89197ba)), closes [#6262](https://github.com/IBM/kui/issues/6262)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** clicking the split button may cause the current processing block to disappear ([aa2b40c](https://github.com/IBM/kui/commit/aa2b40c)), closes [#5703](https://github.com/IBM/kui/issues/5703)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- **plugins/plugin-client-default:** Don't show CWD status stripe widget in Popup mode ([52159d7](https://github.com/IBM/kui/commit/52159d7)), closes [#6018](https://github.com/IBM/kui/issues/6018)
- **plugins/plugin-client-default:** don't show UpdateChecker in popup mode ([67fd5a6](https://github.com/IBM/kui/commit/67fd5a6)), closes [#6016](https://github.com/IBM/kui/issues/6016)
- **plugins/plugin-client-default:** Don't use OpenWhisk status stripe widget in popup mode ([6a35183](https://github.com/IBM/kui/commit/6a35183)), closes [#6268](https://github.com/IBM/kui/issues/6268)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- avoiding reopening the Welcome to Kui tab even after the user has closed it ([6b0faff](https://github.com/IBM/kui/commit/6b0faff)), closes [#5673](https://github.com/IBM/kui/issues/5673)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- **packages/core:** Allow clients to define the contents of the Notebooks menu. ([7462c1a](https://github.com/IBM/kui/commit/7462c1a))
- **plugins/plugin-kubectl:** popeye dashboard ([6dd4d01](https://github.com/IBM/kui/commit/6dd4d01)), closes [#6949](https://github.com/IBM/kui/issues/6949)
- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Make a notebook about making notebooks ([0d67947](https://github.com/IBM/kui/commit/0d67947)), closes [#6040](https://github.com/IBM/kui/issues/6040)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/IBM/kui/commit/b9c5867)), closes [#6109](https://github.com/IBM/kui/issues/6109)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- update ls to allow for presenting content from more limited VFS's such as tutorials ([a1ff1a4](https://github.com/IBM/kui/commit/a1ff1a4)), closes [#5497](https://github.com/IBM/kui/issues/5497)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- keyboard history navigation does not work in Popup clients ([89197ba](https://github.com/IBM/kui/commit/89197ba)), closes [#6262](https://github.com/IBM/kui/issues/6262)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** clicking the split button may cause the current processing block to disappear ([aa2b40c](https://github.com/IBM/kui/commit/aa2b40c)), closes [#5703](https://github.com/IBM/kui/issues/5703)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- **plugins/plugin-client-default:** Don't show CWD status stripe widget in Popup mode ([52159d7](https://github.com/IBM/kui/commit/52159d7)), closes [#6018](https://github.com/IBM/kui/issues/6018)
- **plugins/plugin-client-default:** don't show UpdateChecker in popup mode ([67fd5a6](https://github.com/IBM/kui/commit/67fd5a6)), closes [#6016](https://github.com/IBM/kui/issues/6016)
- **plugins/plugin-client-default:** Don't use OpenWhisk status stripe widget in popup mode ([6a35183](https://github.com/IBM/kui/commit/6a35183)), closes [#6268](https://github.com/IBM/kui/issues/6268)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- avoiding reopening the Welcome to Kui tab even after the user has closed it ([6b0faff](https://github.com/IBM/kui/commit/6b0faff)), closes [#5673](https://github.com/IBM/kui/issues/5673)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Make a notebook about making notebooks ([0d67947](https://github.com/IBM/kui/commit/0d67947)), closes [#6040](https://github.com/IBM/kui/issues/6040)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/IBM/kui/commit/b9c5867)), closes [#6109](https://github.com/IBM/kui/issues/6109)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- update ls to allow for presenting content from more limited VFS's such as tutorials ([a1ff1a4](https://github.com/IBM/kui/commit/a1ff1a4)), closes [#5497](https://github.com/IBM/kui/issues/5497)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **plugins/plugin-client-default:** Don't use OpenWhisk status stripe widget in popup mode ([6a35183](https://github.com/IBM/kui/commit/6a35183)), closes [#6268](https://github.com/IBM/kui/issues/6268)
- keyboard history navigation does not work in Popup clients ([89197ba](https://github.com/IBM/kui/commit/89197ba)), closes [#6262](https://github.com/IBM/kui/issues/6262)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** clicking the split button may cause the current processing block to disappear ([aa2b40c](https://github.com/IBM/kui/commit/aa2b40c)), closes [#5703](https://github.com/IBM/kui/issues/5703)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- **plugins/plugin-client-default:** Don't show CWD status stripe widget in Popup mode ([52159d7](https://github.com/IBM/kui/commit/52159d7)), closes [#6018](https://github.com/IBM/kui/issues/6018)
- **plugins/plugin-client-default:** don't show UpdateChecker in popup mode ([67fd5a6](https://github.com/IBM/kui/commit/67fd5a6)), closes [#6016](https://github.com/IBM/kui/issues/6016)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- avoiding reopening the Welcome to Kui tab even after the user has closed it ([6b0faff](https://github.com/IBM/kui/commit/6b0faff)), closes [#5673](https://github.com/IBM/kui/issues/5673)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Make a notebook about making notebooks ([0d67947](https://github.com/IBM/kui/commit/0d67947)), closes [#6040](https://github.com/IBM/kui/issues/6040)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/IBM/kui/commit/b9c5867)), closes [#6109](https://github.com/IBM/kui/issues/6109)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- update ls to allow for presenting content from more limited VFS's such as tutorials ([a1ff1a4](https://github.com/IBM/kui/commit/a1ff1a4)), closes [#5497](https://github.com/IBM/kui/issues/5497)
- use a Popover UI for git branch status stripe widget ([6bbf348](https://github.com/IBM/kui/commit/6bbf348)), closes [#6325](https://github.com/IBM/kui/issues/6325)
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **plugins/plugin-client-common:** clicking the split button may cause the current processing block to disappear ([aa2b40c](https://github.com/IBM/kui/commit/aa2b40c)), closes [#5703](https://github.com/IBM/kui/issues/5703)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- **plugins/plugin-client-default:** Don't show CWD status stripe widget in Popup mode ([52159d7](https://github.com/IBM/kui/commit/52159d7)), closes [#6018](https://github.com/IBM/kui/issues/6018)
- **plugins/plugin-client-default:** don't show UpdateChecker in popup mode ([67fd5a6](https://github.com/IBM/kui/commit/67fd5a6)), closes [#6016](https://github.com/IBM/kui/issues/6016)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- avoiding reopening the Welcome to Kui tab even after the user has closed it ([6b0faff](https://github.com/IBM/kui/commit/6b0faff)), closes [#5673](https://github.com/IBM/kui/issues/5673)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Make a notebook about making notebooks ([0d67947](https://github.com/IBM/kui/commit/0d67947)), closes [#6040](https://github.com/IBM/kui/issues/6040)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- Move in OpenWhisk plugin from the external repo ([b9c5867](https://github.com/IBM/kui/commit/b9c5867)), closes [#6109](https://github.com/IBM/kui/issues/6109)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- update ls to allow for presenting content from more limited VFS's such as tutorials ([a1ff1a4](https://github.com/IBM/kui/commit/a1ff1a4)), closes [#5497](https://github.com/IBM/kui/issues/5497)
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **plugins/plugin-client-common:** clicking the split button may cause the current processing block to disappear ([aa2b40c](https://github.com/IBM/kui/commit/aa2b40c)), closes [#5703](https://github.com/IBM/kui/issues/5703)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- **plugins/plugin-client-default:** Don't show CWD status stripe widget in Popup mode ([52159d7](https://github.com/IBM/kui/commit/52159d7)), closes [#6018](https://github.com/IBM/kui/issues/6018)
- **plugins/plugin-client-default:** don't show UpdateChecker in popup mode ([67fd5a6](https://github.com/IBM/kui/commit/67fd5a6)), closes [#6016](https://github.com/IBM/kui/issues/6016)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- avoiding reopening the Welcome to Kui tab even after the user has closed it ([6b0faff](https://github.com/IBM/kui/commit/6b0faff)), closes [#5673](https://github.com/IBM/kui/issues/5673)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Make a notebook about making notebooks ([0d67947](https://github.com/IBM/kui/commit/0d67947)), closes [#6040](https://github.com/IBM/kui/issues/6040)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- update ls to allow for presenting content from more limited VFS's such as tutorials ([a1ff1a4](https://github.com/IBM/kui/commit/a1ff1a4)), closes [#5497](https://github.com/IBM/kui/issues/5497)
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **plugins/plugin-client-common:** clicking the split button may cause the current processing block to disappear ([aa2b40c](https://github.com/IBM/kui/commit/aa2b40c)), closes [#5703](https://github.com/IBM/kui/issues/5703)
- **plugins/plugin-client-common:** update welcome.json to describe kui, not just notebooks ([96330c4](https://github.com/IBM/kui/commit/96330c4)), closes [#5878](https://github.com/IBM/kui/issues/5878)
- avoiding reopening the Welcome to Kui tab even after the user has closed it ([6b0faff](https://github.com/IBM/kui/commit/6b0faff)), closes [#5673](https://github.com/IBM/kui/issues/5673)
- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- update ls to allow for presenting content from more limited VFS's such as tutorials ([a1ff1a4](https://github.com/IBM/kui/commit/a1ff1a4)), closes [#5497](https://github.com/IBM/kui/issues/5497)
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Bug Fixes

- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- shift Block UI to use a Notebook style of presentation ([dc0ee4b](https://github.com/IBM/kui/commit/dc0ee4b)), closes [#5258](https://github.com/IBM/kui/issues/5258)
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.11.0](https://github.com/IBM/kui/compare/v4.5.0...v8.11.0) (2020-07-21)

### Bug Fixes

- **plugins/plugin-client-default:** default client should not use Search component inBrowser ([afb6b48](https://github.com/IBM/kui/commit/afb6b48)), closes [#5074](https://github.com/IBM/kui/issues/5074)
- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- Card component does not render well in dark themes ([d96def0](https://github.com/IBM/kui/commit/d96def0)), closes [#4996](https://github.com/IBM/kui/issues/4996)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- move default loadingDone icon into plugin-client-common ([39994bc](https://github.com/IBM/kui/commit/39994bc)), closes [#5026](https://github.com/IBM/kui/issues/5026)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- reduce custom CSS rules for table UI ([56f69cb](https://github.com/IBM/kui/commit/56f69cb)), closes [#5024](https://github.com/IBM/kui/issues/5024)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- MiniSplits ([70b8441](https://github.com/IBM/kui/commit/70b8441)), closes [#5112](https://github.com/IBM/kui/issues/5112)
- **plugins/plugin-client-common:** use Cards to wrap kube tables and grids ([6698013](https://github.com/IBM/kui/commit/6698013)), closes [#5032](https://github.com/IBM/kui/issues/5032)
- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add a command to return the Card Component in Terminal ([d8d13ab](https://github.com/IBM/kui/commit/d8d13ab)), closes [#4973](https://github.com/IBM/kui/issues/4973)
- add capability to show welcome widget to new users in Terminal ([0c33e6e](https://github.com/IBM/kui/commit/0c33e6e)), closes [#4990](https://github.com/IBM/kui/issues/4990) [#5007](https://github.com/IBM/kui/issues/5007)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow clients to modify the session lifecycle UI by providing custom strings ([3c78fd3](https://github.com/IBM/kui/commit/3c78fd3)), closes [#5019](https://github.com/IBM/kui/issues/5019)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- Update default loadingDone to use Card component ([e1b4c61](https://github.com/IBM/kui/commit/e1b4c61)), closes [#4986](https://github.com/IBM/kui/issues/4986)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.10.0](https://github.com/IBM/kui/compare/v4.5.0...v8.10.0) (2020-06-17)

### Bug Fixes

- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- pin a watchable terminal response in a split pane ([662f413](https://github.com/IBM/kui/commit/662f413)), closes [#4865](https://github.com/IBM/kui/issues/4865) [#4573](https://github.com/IBM/kui/issues/4573) [#4885](https://github.com/IBM/kui/issues/4885) [#4894](https://github.com/IBM/kui/issues/4894)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- update checker ([a7908d2](https://github.com/IBM/kui/commit/a7908d2)), closes [#4537](https://github.com/IBM/kui/issues/4537)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.9.0](https://github.com/IBM/kui/compare/v4.5.0...v8.9.0) (2020-06-09)

### Bug Fixes

- about should show breadcrumbs ([99dc401](https://github.com/IBM/kui/commit/99dc401)), closes [#4730](https://github.com/IBM/kui/issues/4730)
- **plugins/plugin-bash-like:** add back configurable shell ([b7fda6c](https://github.com/IBM/kui/commit/b7fda6c))
- **plugins/plugin-client-default:** disable cluster utilization status stripe widget ([353cbfd](https://github.com/IBM/kui/commit/353cbfd)), closes [#4613](https://github.com/IBM/kui/issues/4613)
- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow <Kui/> users to provide custom views for session init ([1f35894](https://github.com/IBM/kui/commit/1f35894)), closes [#4596](https://github.com/IBM/kui/issues/4596)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- split screen Terminal ([3a6b422](https://github.com/IBM/kui/commit/3a6b422)), closes [#4814](https://github.com/IBM/kui/issues/4814) [#4821](https://github.com/IBM/kui/issues/4821)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.7.0](https://github.com/IBM/kui/compare/v4.5.0...v8.7.0) (2020-05-08)

### Bug Fixes

- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add Patternfly Breadcrumb support ([91e0504](https://github.com/IBM/kui/commit/91e0504)), closes [#4381](https://github.com/IBM/kui/issues/4381)
- allow themes to dictate Kui client properties ([2b41873](https://github.com/IBM/kui/commit/2b41873)), closes [#4409](https://github.com/IBM/kui/issues/4409)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

## [8.6.1](https://github.com/IBM/kui/compare/v4.5.0...v8.6.1) (2020-04-25)

### Bug Fixes

- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.6.0](https://github.com/IBM/kui/compare/v4.5.0...v8.6.0) (2020-04-23)

### Bug Fixes

- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- broken ico icons ([d018404](https://github.com/IBM/kui/commit/d018404)), closes [#3947](https://github.com/IBM/kui/issues/3947)
- eliminate complex nesting of NavResponse model ([e849ae7](https://github.com/IBM/kui/commit/e849ae7)), closes [#4205](https://github.com/IBM/kui/issues/4205)
- improve handling of narrower windows ([7a32591](https://github.com/IBM/kui/commit/7a32591)), closes [#4181](https://github.com/IBM/kui/issues/4181)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- remove config.d/version.json in favor of using the version field from package.json ([1e296c7](https://github.com/IBM/kui/commit/1e296c7)), closes [#4300](https://github.com/IBM/kui/issues/4300)
- remove invalid bodyCss fields in config.d/style.json ([99a92ab](https://github.com/IBM/kui/commit/99a92ab)), closes [#4307](https://github.com/IBM/kui/issues/4307)
- remove limits.json from client config.d ([3ae2201](https://github.com/IBM/kui/commit/3ae2201)), closes [#4292](https://github.com/IBM/kui/issues/4292)
- remove unsed fields from client.json ([a55b1f1](https://github.com/IBM/kui/commit/a55b1f1)), closes [#4296](https://github.com/IBM/kui/issues/4296)
- remove unused fields from config.d/style.json ([ab7278a](https://github.com/IBM/kui/commit/ab7278a)), closes [#4298](https://github.com/IBM/kui/issues/4298)
- **packages/core:** restore CommandStringContent as one of FunctionThatProducesContent types ([1e32b93](https://github.com/IBM/kui/commit/1e32b93)), closes [#3687](https://github.com/IBM/kui/issues/3687)
- **plugin-sidecar:** React doesn't re-instantiate PaginatedTable for tabs located in the same LeftNav ([283a525](https://github.com/IBM/kui/commit/283a525)), closes [#3837](https://github.com/IBM/kui/issues/3837) [#3839](https://github.com/IBM/kui/issues/3839)
- **plugins/plugin-client-common:** improve Screenshot UI ([bc2102a](https://github.com/IBM/kui/commit/bc2102a)), closes [#3734](https://github.com/IBM/kui/issues/3734)
- **plugins/plugin-client-default:** add missing newline in about text ([4fcc9d7](https://github.com/IBM/kui/commit/4fcc9d7)), closes [#4168](https://github.com/IBM/kui/issues/4168)
- **plugins/plugin-client-default:** cwd+w should close popup windows ([dfad325](https://github.com/IBM/kui/commit/dfad325)), closes [#3895](https://github.com/IBM/kui/issues/3895)
- **plugins/plugin-client-default:** load Popup.tsx via React.lazy ([f77c2a3](https://github.com/IBM/kui/commit/f77c2a3)), closes [#3908](https://github.com/IBM/kui/issues/3908)
- **plugins/plugin-client-default:** Popup LeftNav content has too much padding ([194f975](https://github.com/IBM/kui/commit/194f975)), closes [#3912](https://github.com/IBM/kui/issues/3912)
- **plugins/plugin-client-default:** Popup's placeholder text modification should only listen to commands from user ([5bf83fd](https://github.com/IBM/kui/commit/5bf83fd)), closes [#3910](https://github.com/IBM/kui/issues/3910)
- **plugins/plugin-client-default:** remove unused fields from name.json ([6f99959](https://github.com/IBM/kui/commit/6f99959)), closes [#4294](https://github.com/IBM/kui/issues/4294)
- **plugins/plugin-client-default:** remove unused tables.json ([56082b9](https://github.com/IBM/kui/commit/56082b9)), closes [#4290](https://github.com/IBM/kui/issues/4290)
- eliminate the the use of symlink of adding css files to build stage ([dad4987](https://github.com/IBM/kui/commit/dad4987)), closes [#3567](https://github.com/IBM/kui/issues/3567)
- plugin-client-command/default are publishing tsbuildinfo ([0ad3f2a](https://github.com/IBM/kui/commit/0ad3f2a)), closes [#3846](https://github.com/IBM/kui/issues/3846)
- plugin-client-default should have dependency of plugin-client-common ([41fe2f5](https://github.com/IBM/kui/commit/41fe2f5)), closes [#3583](https://github.com/IBM/kui/issues/3583)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)

### chore

- kui client cleanup ([b4c3984](https://github.com/IBM/kui/commit/b4c3984)), closes [#3974](https://github.com/IBM/kui/issues/3974)

### Features

- a new model NavResponse supporting side navigation menu ([41940eb](https://github.com/IBM/kui/commit/41940eb)), closes [#3659](https://github.com/IBM/kui/issues/3659)
- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- bottom input ([c6d2af0](https://github.com/IBM/kui/commit/c6d2af0)), closes [#3729](https://github.com/IBM/kui/issues/3729)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- for popup windows, show command as placeholder text in input stripe ([a897042](https://github.com/IBM/kui/commit/a897042)), closes [#3899](https://github.com/IBM/kui/issues/3899)
- introduce plugin-client-default meant for hosting a client definition ([688a991](https://github.com/IBM/kui/commit/688a991)), closes [#3463](https://github.com/IBM/kui/issues/3463)
- Kui client should support self-bootstrapping of Kui ([3bbf8e8](https://github.com/IBM/kui/commit/3bbf8e8)), closes [#4277](https://github.com/IBM/kui/issues/4277)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- Popup client ([063c363](https://github.com/IBM/kui/commit/063c363)), closes [#3886](https://github.com/IBM/kui/issues/3886)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- switch to Carbon Gray 10 as default theme in plugin-default-client ([c56e2f5](https://github.com/IBM/kui/commit/c56e2f5)), closes [#4101](https://github.com/IBM/kui/issues/4101)
- **plugins/plugin-client-default:** enhance about.json model with kube-specific entries ([0ae86ef](https://github.com/IBM/kui/commit/0ae86ef)), closes [#4020](https://github.com/IBM/kui/issues/4020)
- react helpers ([f6bea1f](https://github.com/IBM/kui/commit/f6bea1f))

### BREAKING CHANGES

- this PR removes plugins/plugin-client-default
- this moves plugin-sidecar and plugin-carbon-tables into plugin-client-common

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

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

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

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
