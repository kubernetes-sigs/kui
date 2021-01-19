# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0-beta.3](https://github.com/kui-shell/plugin-kubeui/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2021-01-19)

**Note:** Version bump only for package @kui-shell/plugin-ibmcloud

# [10.0.0-beta.2](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v10.0.0-beta.2) (2021-01-19)

### Bug Fixes

- s3 job watcher sometimes fails due to startup issues ([8851d50](https://github.com/kui-shell/plugin-kubeui/commit/8851d50)), closes [#6411](https://github.com/kui-shell/plugin-kubeui/issues/6411)
- SequenceDiagram bar widths are pretty buggy ([6d1c458](https://github.com/kui-shell/plugin-kubeui/commit/6d1c458)), closes [#6408](https://github.com/kui-shell/plugin-kubeui/issues/6408)
- **plugins-plugin-ibmcloud:** ibmcloud ce job list -h does not present help ([799d71d](https://github.com/kui-shell/plugin-kubeui/commit/799d71d)), closes [#5386](https://github.com/kui-shell/plugin-kubeui/issues/5386)
- **plugins/plugin-client-common:** for now, switch interval chart to duration chart ([ea21221](https://github.com/kui-shell/plugin-kubeui/commit/ea21221)), closes [#5340](https://github.com/kui-shell/plugin-kubeui/issues/5340)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- **plugins/plugin-ibmcloud:** further refinements are needed for ibmcloud cos credentials validation ([881e757](https://github.com/kui-shell/plugin-kubeui/commit/881e757)), closes [#5962](https://github.com/kui-shell/plugin-kubeui/issues/5962)
- **plugins/plugin-ibmcloud:** ibmcloud ce job list does not support name filters ([5daa930](https://github.com/kui-shell/plugin-kubeui/commit/5daa930)), closes [#5450](https://github.com/kui-shell/plugin-kubeui/issues/5450)
- **plugins/plugin-ibmcloud:** ibmcloud ce job run can emit unprocessed ansi control characters ([3539acf](https://github.com/kui-shell/plugin-kubeui/commit/3539acf)), closes [#5334](https://github.com/kui-shell/plugin-kubeui/issues/5334)
- **plugins/plugin-ibmcloud:** ibmcloud cos bind fails to resolve endpoint aliases ([ef981ff](https://github.com/kui-shell/plugin-kubeui/commit/ef981ff)), closes [#6253](https://github.com/kui-shell/plugin-kubeui/issues/6253)
- **plugins/plugin-ibmcloud:** ibmcloud cos initialization bug ([d327322](https://github.com/kui-shell/plugin-kubeui/commit/d327322)), closes [#5968](https://github.com/kui-shell/plugin-kubeui/issues/5968)
- **plugins/plugin-ibmcloud:** ibmcloud cos validate misbehaves in reexecuted notebooks ([8aadb37](https://github.com/kui-shell/plugin-kubeui/commit/8aadb37)), closes [#5974](https://github.com/kui-shell/plugin-kubeui/issues/5974)
- a few more improvements to s3 onboarding ([9f821ef](https://github.com/kui-shell/plugin-kubeui/commit/9f821ef)), closes [#5947](https://github.com/kui-shell/plugin-kubeui/issues/5947)
- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/kui-shell/plugin-kubeui/commit/96d5bc0)), closes [#5926](https://github.com/kui-shell/plugin-kubeui/issues/5926)
- **plugins/plugin-ibmcloud:** improve error handling of ibmcloud list commands ([6cbdb88](https://github.com/kui-shell/plugin-kubeui/commit/6cbdb88)), closes [#5250](https://github.com/kui-shell/plugin-kubeui/issues/5250)
- **plugins/plugin-ibmcloud:** k get jobrun is always directed to codeengine CRD ([7f3b6c8](https://github.com/kui-shell/plugin-kubeui/commit/7f3b6c8)), closes [#5377](https://github.com/kui-shell/plugin-kubeui/issues/5377)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/kui-shell/plugin-kubeui/commit/eb9f147)), closes [#5282](https://github.com/kui-shell/plugin-kubeui/issues/5282)
- allow for limiting the number of kubectl table rows ([62588f2](https://github.com/kui-shell/plugin-kubeui/commit/62588f2)), closes [#5358](https://github.com/kui-shell/plugin-kubeui/issues/5358)
- Expand kubectl direct watching to support heterogeneous use cases ([8df1ad3](https://github.com/kui-shell/plugin-kubeui/commit/8df1ad3)), closes [#6504](https://github.com/kui-shell/plugin-kubeui/issues/6504)
- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/kui-shell/plugin-kubeui/commit/e05d7e0)), closes [#5831](https://github.com/kui-shell/plugin-kubeui/issues/5831)
- generalized kuberctl get with limit ([d40ee07](https://github.com/kui-shell/plugin-kubeui/commit/d40ee07)), closes [#5361](https://github.com/kui-shell/plugin-kubeui/issues/5361)
- initial support for using a kubectl proxy ([47b26be](https://github.com/kui-shell/plugin-kubeui/commit/47b26be)), closes [#6440](https://github.com/kui-shell/plugin-kubeui/issues/6440)
- inline sidecar ([2c3afeb](https://github.com/kui-shell/plugin-kubeui/commit/2c3afeb)), closes [#6007](https://github.com/kui-shell/plugin-kubeui/issues/6007)
- s3 plugin, and vfs ([970ba6e](https://github.com/kui-shell/plugin-kubeui/commit/970ba6e)), closes [#5319](https://github.com/kui-shell/plugin-kubeui/issues/5319)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- Timeline view for kubernetes Jobs ([b623e4e](https://github.com/kui-shell/plugin-kubeui/commit/b623e4e)), closes [#5370](https://github.com/kui-shell/plugin-kubeui/issues/5370)
- **plugins/plugin-client-common:** improved SequenceDiagram view ([1e2fb41](https://github.com/kui-shell/plugin-kubeui/commit/1e2fb41)), closes [#5342](https://github.com/kui-shell/plugin-kubeui/issues/5342)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/kui-shell/plugin-kubeui/commit/677faca)), closes [#5302](https://github.com/kui-shell/plugin-kubeui/issues/5302) [#5303](https://github.com/kui-shell/plugin-kubeui/issues/5303)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [9.3.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **plugins-plugin-ibmcloud:** ibmcloud ce job list -h does not present help ([799d71d](https://github.com/kui-shell/plugin-kubeui/commit/799d71d)), closes [#5386](https://github.com/kui-shell/plugin-kubeui/issues/5386)
- **plugins/plugin-client-common:** for now, switch interval chart to duration chart ([ea21221](https://github.com/kui-shell/plugin-kubeui/commit/ea21221)), closes [#5340](https://github.com/kui-shell/plugin-kubeui/issues/5340)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- **plugins/plugin-ibmcloud:** further refinements are needed for ibmcloud cos credentials validation ([881e757](https://github.com/kui-shell/plugin-kubeui/commit/881e757)), closes [#5962](https://github.com/kui-shell/plugin-kubeui/issues/5962)
- **plugins/plugin-ibmcloud:** ibmcloud ce job list does not support name filters ([5daa930](https://github.com/kui-shell/plugin-kubeui/commit/5daa930)), closes [#5450](https://github.com/kui-shell/plugin-kubeui/issues/5450)
- **plugins/plugin-ibmcloud:** ibmcloud ce job run can emit unprocessed ansi control characters ([3539acf](https://github.com/kui-shell/plugin-kubeui/commit/3539acf)), closes [#5334](https://github.com/kui-shell/plugin-kubeui/issues/5334)
- **plugins/plugin-ibmcloud:** ibmcloud cos bind fails to resolve endpoint aliases ([ef981ff](https://github.com/kui-shell/plugin-kubeui/commit/ef981ff)), closes [#6253](https://github.com/kui-shell/plugin-kubeui/issues/6253)
- **plugins/plugin-ibmcloud:** ibmcloud cos initialization bug ([d327322](https://github.com/kui-shell/plugin-kubeui/commit/d327322)), closes [#5968](https://github.com/kui-shell/plugin-kubeui/issues/5968)
- **plugins/plugin-ibmcloud:** ibmcloud cos validate misbehaves in reexecuted notebooks ([8aadb37](https://github.com/kui-shell/plugin-kubeui/commit/8aadb37)), closes [#5974](https://github.com/kui-shell/plugin-kubeui/issues/5974)
- a few more improvements to s3 onboarding ([9f821ef](https://github.com/kui-shell/plugin-kubeui/commit/9f821ef)), closes [#5947](https://github.com/kui-shell/plugin-kubeui/issues/5947)
- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/kui-shell/plugin-kubeui/commit/96d5bc0)), closes [#5926](https://github.com/kui-shell/plugin-kubeui/issues/5926)
- **plugins/plugin-ibmcloud:** improve error handling of ibmcloud list commands ([6cbdb88](https://github.com/kui-shell/plugin-kubeui/commit/6cbdb88)), closes [#5250](https://github.com/kui-shell/plugin-kubeui/issues/5250)
- **plugins/plugin-ibmcloud:** k get jobrun is always directed to codeengine CRD ([7f3b6c8](https://github.com/kui-shell/plugin-kubeui/commit/7f3b6c8)), closes [#5377](https://github.com/kui-shell/plugin-kubeui/issues/5377)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/kui-shell/plugin-kubeui/commit/eb9f147)), closes [#5282](https://github.com/kui-shell/plugin-kubeui/issues/5282)
- allow for limiting the number of kubectl table rows ([62588f2](https://github.com/kui-shell/plugin-kubeui/commit/62588f2)), closes [#5358](https://github.com/kui-shell/plugin-kubeui/issues/5358)
- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/kui-shell/plugin-kubeui/commit/e05d7e0)), closes [#5831](https://github.com/kui-shell/plugin-kubeui/issues/5831)
- generalized kuberctl get with limit ([d40ee07](https://github.com/kui-shell/plugin-kubeui/commit/d40ee07)), closes [#5361](https://github.com/kui-shell/plugin-kubeui/issues/5361)
- inline sidecar ([2c3afeb](https://github.com/kui-shell/plugin-kubeui/commit/2c3afeb)), closes [#6007](https://github.com/kui-shell/plugin-kubeui/issues/6007)
- s3 plugin, and vfs ([970ba6e](https://github.com/kui-shell/plugin-kubeui/commit/970ba6e)), closes [#5319](https://github.com/kui-shell/plugin-kubeui/issues/5319)
- Timeline view for kubernetes Jobs ([b623e4e](https://github.com/kui-shell/plugin-kubeui/commit/b623e4e)), closes [#5370](https://github.com/kui-shell/plugin-kubeui/issues/5370)
- **plugins/plugin-client-common:** improved SequenceDiagram view ([1e2fb41](https://github.com/kui-shell/plugin-kubeui/commit/1e2fb41)), closes [#5342](https://github.com/kui-shell/plugin-kubeui/issues/5342)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/kui-shell/plugin-kubeui/commit/677faca)), closes [#5302](https://github.com/kui-shell/plugin-kubeui/issues/5302) [#5303](https://github.com/kui-shell/plugin-kubeui/issues/5303)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [9.2.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **plugins-plugin-ibmcloud:** ibmcloud ce job list -h does not present help ([799d71d](https://github.com/kui-shell/plugin-kubeui/commit/799d71d)), closes [#5386](https://github.com/kui-shell/plugin-kubeui/issues/5386)
- **plugins/plugin-client-common:** for now, switch interval chart to duration chart ([ea21221](https://github.com/kui-shell/plugin-kubeui/commit/ea21221)), closes [#5340](https://github.com/kui-shell/plugin-kubeui/issues/5340)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- **plugins/plugin-ibmcloud:** further refinements are needed for ibmcloud cos credentials validation ([881e757](https://github.com/kui-shell/plugin-kubeui/commit/881e757)), closes [#5962](https://github.com/kui-shell/plugin-kubeui/issues/5962)
- **plugins/plugin-ibmcloud:** ibmcloud ce job list does not support name filters ([5daa930](https://github.com/kui-shell/plugin-kubeui/commit/5daa930)), closes [#5450](https://github.com/kui-shell/plugin-kubeui/issues/5450)
- **plugins/plugin-ibmcloud:** ibmcloud ce job run can emit unprocessed ansi control characters ([3539acf](https://github.com/kui-shell/plugin-kubeui/commit/3539acf)), closes [#5334](https://github.com/kui-shell/plugin-kubeui/issues/5334)
- **plugins/plugin-ibmcloud:** ibmcloud cos initialization bug ([d327322](https://github.com/kui-shell/plugin-kubeui/commit/d327322)), closes [#5968](https://github.com/kui-shell/plugin-kubeui/issues/5968)
- **plugins/plugin-ibmcloud:** ibmcloud cos validate misbehaves in reexecuted notebooks ([8aadb37](https://github.com/kui-shell/plugin-kubeui/commit/8aadb37)), closes [#5974](https://github.com/kui-shell/plugin-kubeui/issues/5974)
- a few more improvements to s3 onboarding ([9f821ef](https://github.com/kui-shell/plugin-kubeui/commit/9f821ef)), closes [#5947](https://github.com/kui-shell/plugin-kubeui/issues/5947)
- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/kui-shell/plugin-kubeui/commit/96d5bc0)), closes [#5926](https://github.com/kui-shell/plugin-kubeui/issues/5926)
- **plugins/plugin-ibmcloud:** improve error handling of ibmcloud list commands ([6cbdb88](https://github.com/kui-shell/plugin-kubeui/commit/6cbdb88)), closes [#5250](https://github.com/kui-shell/plugin-kubeui/issues/5250)
- **plugins/plugin-ibmcloud:** k get jobrun is always directed to codeengine CRD ([7f3b6c8](https://github.com/kui-shell/plugin-kubeui/commit/7f3b6c8)), closes [#5377](https://github.com/kui-shell/plugin-kubeui/issues/5377)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/kui-shell/plugin-kubeui/commit/eb9f147)), closes [#5282](https://github.com/kui-shell/plugin-kubeui/issues/5282)
- allow for limiting the number of kubectl table rows ([62588f2](https://github.com/kui-shell/plugin-kubeui/commit/62588f2)), closes [#5358](https://github.com/kui-shell/plugin-kubeui/issues/5358)
- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/kui-shell/plugin-kubeui/commit/e05d7e0)), closes [#5831](https://github.com/kui-shell/plugin-kubeui/issues/5831)
- generalized kuberctl get with limit ([d40ee07](https://github.com/kui-shell/plugin-kubeui/commit/d40ee07)), closes [#5361](https://github.com/kui-shell/plugin-kubeui/issues/5361)
- inline sidecar ([2c3afeb](https://github.com/kui-shell/plugin-kubeui/commit/2c3afeb)), closes [#6007](https://github.com/kui-shell/plugin-kubeui/issues/6007)
- s3 plugin, and vfs ([970ba6e](https://github.com/kui-shell/plugin-kubeui/commit/970ba6e)), closes [#5319](https://github.com/kui-shell/plugin-kubeui/issues/5319)
- Timeline view for kubernetes Jobs ([b623e4e](https://github.com/kui-shell/plugin-kubeui/commit/b623e4e)), closes [#5370](https://github.com/kui-shell/plugin-kubeui/issues/5370)
- **plugins/plugin-client-common:** improved SequenceDiagram view ([1e2fb41](https://github.com/kui-shell/plugin-kubeui/commit/1e2fb41)), closes [#5342](https://github.com/kui-shell/plugin-kubeui/issues/5342)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/kui-shell/plugin-kubeui/commit/677faca)), closes [#5302](https://github.com/kui-shell/plugin-kubeui/issues/5302) [#5303](https://github.com/kui-shell/plugin-kubeui/issues/5303)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [9.1.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **plugins-plugin-ibmcloud:** ibmcloud ce job list -h does not present help ([799d71d](https://github.com/kui-shell/plugin-kubeui/commit/799d71d)), closes [#5386](https://github.com/kui-shell/plugin-kubeui/issues/5386)
- **plugins/plugin-client-common:** for now, switch interval chart to duration chart ([ea21221](https://github.com/kui-shell/plugin-kubeui/commit/ea21221)), closes [#5340](https://github.com/kui-shell/plugin-kubeui/issues/5340)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- **plugins/plugin-ibmcloud:** further refinements are needed for ibmcloud cos credentials validation ([881e757](https://github.com/kui-shell/plugin-kubeui/commit/881e757)), closes [#5962](https://github.com/kui-shell/plugin-kubeui/issues/5962)
- **plugins/plugin-ibmcloud:** ibmcloud ce job list does not support name filters ([5daa930](https://github.com/kui-shell/plugin-kubeui/commit/5daa930)), closes [#5450](https://github.com/kui-shell/plugin-kubeui/issues/5450)
- **plugins/plugin-ibmcloud:** ibmcloud ce job run can emit unprocessed ansi control characters ([3539acf](https://github.com/kui-shell/plugin-kubeui/commit/3539acf)), closes [#5334](https://github.com/kui-shell/plugin-kubeui/issues/5334)
- **plugins/plugin-ibmcloud:** ibmcloud cos initialization bug ([d327322](https://github.com/kui-shell/plugin-kubeui/commit/d327322)), closes [#5968](https://github.com/kui-shell/plugin-kubeui/issues/5968)
- **plugins/plugin-ibmcloud:** ibmcloud cos validate misbehaves in reexecuted notebooks ([8aadb37](https://github.com/kui-shell/plugin-kubeui/commit/8aadb37)), closes [#5974](https://github.com/kui-shell/plugin-kubeui/issues/5974)
- a few more improvements to s3 onboarding ([9f821ef](https://github.com/kui-shell/plugin-kubeui/commit/9f821ef)), closes [#5947](https://github.com/kui-shell/plugin-kubeui/issues/5947)
- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- improve discovery of ibmcloud s3 credentials ([96d5bc0](https://github.com/kui-shell/plugin-kubeui/commit/96d5bc0)), closes [#5926](https://github.com/kui-shell/plugin-kubeui/issues/5926)
- **plugins/plugin-ibmcloud:** improve error handling of ibmcloud list commands ([6cbdb88](https://github.com/kui-shell/plugin-kubeui/commit/6cbdb88)), closes [#5250](https://github.com/kui-shell/plugin-kubeui/issues/5250)
- **plugins/plugin-ibmcloud:** k get jobrun is always directed to codeengine CRD ([7f3b6c8](https://github.com/kui-shell/plugin-kubeui/commit/7f3b6c8)), closes [#5377](https://github.com/kui-shell/plugin-kubeui/issues/5377)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/kui-shell/plugin-kubeui/commit/eb9f147)), closes [#5282](https://github.com/kui-shell/plugin-kubeui/issues/5282)
- allow for limiting the number of kubectl table rows ([62588f2](https://github.com/kui-shell/plugin-kubeui/commit/62588f2)), closes [#5358](https://github.com/kui-shell/plugin-kubeui/issues/5358)
- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/kui-shell/plugin-kubeui/commit/e05d7e0)), closes [#5831](https://github.com/kui-shell/plugin-kubeui/issues/5831)
- generalized kuberctl get with limit ([d40ee07](https://github.com/kui-shell/plugin-kubeui/commit/d40ee07)), closes [#5361](https://github.com/kui-shell/plugin-kubeui/issues/5361)
- inline sidecar ([2c3afeb](https://github.com/kui-shell/plugin-kubeui/commit/2c3afeb)), closes [#6007](https://github.com/kui-shell/plugin-kubeui/issues/6007)
- s3 plugin, and vfs ([970ba6e](https://github.com/kui-shell/plugin-kubeui/commit/970ba6e)), closes [#5319](https://github.com/kui-shell/plugin-kubeui/issues/5319)
- Timeline view for kubernetes Jobs ([b623e4e](https://github.com/kui-shell/plugin-kubeui/commit/b623e4e)), closes [#5370](https://github.com/kui-shell/plugin-kubeui/issues/5370)
- **plugins/plugin-client-common:** improved SequenceDiagram view ([1e2fb41](https://github.com/kui-shell/plugin-kubeui/commit/1e2fb41)), closes [#5342](https://github.com/kui-shell/plugin-kubeui/issues/5342)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/kui-shell/plugin-kubeui/commit/677faca)), closes [#5302](https://github.com/kui-shell/plugin-kubeui/issues/5302) [#5303](https://github.com/kui-shell/plugin-kubeui/issues/5303)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [9.0.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **plugins-plugin-ibmcloud:** ibmcloud ce job list -h does not present help ([799d71d](https://github.com/kui-shell/plugin-kubeui/commit/799d71d)), closes [#5386](https://github.com/kui-shell/plugin-kubeui/issues/5386)
- **plugins/plugin-client-common:** for now, switch interval chart to duration chart ([ea21221](https://github.com/kui-shell/plugin-kubeui/commit/ea21221)), closes [#5340](https://github.com/kui-shell/plugin-kubeui/issues/5340)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- **plugins/plugin-ibmcloud:** ibmcloud ce job list does not support name filters ([5daa930](https://github.com/kui-shell/plugin-kubeui/commit/5daa930)), closes [#5450](https://github.com/kui-shell/plugin-kubeui/issues/5450)
- **plugins/plugin-ibmcloud:** ibmcloud ce job run can emit unprocessed ansi control characters ([3539acf](https://github.com/kui-shell/plugin-kubeui/commit/3539acf)), closes [#5334](https://github.com/kui-shell/plugin-kubeui/issues/5334)
- **plugins/plugin-ibmcloud:** improve error handling of ibmcloud list commands ([6cbdb88](https://github.com/kui-shell/plugin-kubeui/commit/6cbdb88)), closes [#5250](https://github.com/kui-shell/plugin-kubeui/issues/5250)
- **plugins/plugin-ibmcloud:** k get jobrun is always directed to codeengine CRD ([7f3b6c8](https://github.com/kui-shell/plugin-kubeui/commit/7f3b6c8)), closes [#5377](https://github.com/kui-shell/plugin-kubeui/issues/5377)
- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/kui-shell/plugin-kubeui/commit/eb9f147)), closes [#5282](https://github.com/kui-shell/plugin-kubeui/issues/5282)
- allow for limiting the number of kubectl table rows ([62588f2](https://github.com/kui-shell/plugin-kubeui/commit/62588f2)), closes [#5358](https://github.com/kui-shell/plugin-kubeui/issues/5358)
- Feature: improve support for parallelization across VFS operations ([e05d7e0](https://github.com/kui-shell/plugin-kubeui/commit/e05d7e0)), closes [#5831](https://github.com/kui-shell/plugin-kubeui/issues/5831)
- generalized kuberctl get with limit ([d40ee07](https://github.com/kui-shell/plugin-kubeui/commit/d40ee07)), closes [#5361](https://github.com/kui-shell/plugin-kubeui/issues/5361)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- Timeline view for kubernetes Jobs ([b623e4e](https://github.com/kui-shell/plugin-kubeui/commit/b623e4e)), closes [#5370](https://github.com/kui-shell/plugin-kubeui/issues/5370)
- **plugins/plugin-client-common:** improved SequenceDiagram view ([1e2fb41](https://github.com/kui-shell/plugin-kubeui/commit/1e2fb41)), closes [#5342](https://github.com/kui-shell/plugin-kubeui/issues/5342)
- s3 plugin, and vfs ([970ba6e](https://github.com/kui-shell/plugin-kubeui/commit/970ba6e)), closes [#5319](https://github.com/kui-shell/plugin-kubeui/issues/5319)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/kui-shell/plugin-kubeui/commit/677faca)), closes [#5302](https://github.com/kui-shell/plugin-kubeui/issues/5302) [#5303](https://github.com/kui-shell/plugin-kubeui/issues/5303)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.12.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Bug Fixes

- **plugins-plugin-ibmcloud:** ibmcloud ce job list -h does not present help ([799d71d](https://github.com/kui-shell/plugin-kubeui/commit/799d71d)), closes [#5386](https://github.com/kui-shell/plugin-kubeui/issues/5386)
- **plugins/plugin-client-common:** for now, switch interval chart to duration chart ([ea21221](https://github.com/kui-shell/plugin-kubeui/commit/ea21221)), closes [#5340](https://github.com/kui-shell/plugin-kubeui/issues/5340)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- **plugins/plugin-ibmcloud:** ibmcloud ce job run can emit unprocessed ansi control characters ([3539acf](https://github.com/kui-shell/plugin-kubeui/commit/3539acf)), closes [#5334](https://github.com/kui-shell/plugin-kubeui/issues/5334)
- **plugins/plugin-ibmcloud:** improve error handling of ibmcloud list commands ([6cbdb88](https://github.com/kui-shell/plugin-kubeui/commit/6cbdb88)), closes [#5250](https://github.com/kui-shell/plugin-kubeui/issues/5250)
- **plugins/plugin-ibmcloud:** k get jobrun is always directed to codeengine CRD ([7f3b6c8](https://github.com/kui-shell/plugin-kubeui/commit/7f3b6c8)), closes [#5377](https://github.com/kui-shell/plugin-kubeui/issues/5377)
- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- allow command registrations to express their experimental nature ([eb9f147](https://github.com/kui-shell/plugin-kubeui/commit/eb9f147)), closes [#5282](https://github.com/kui-shell/plugin-kubeui/issues/5282)
- allow for limiting the number of kubectl table rows ([62588f2](https://github.com/kui-shell/plugin-kubeui/commit/62588f2)), closes [#5358](https://github.com/kui-shell/plugin-kubeui/issues/5358)
- generalized kuberctl get with limit ([d40ee07](https://github.com/kui-shell/plugin-kubeui/commit/d40ee07)), closes [#5361](https://github.com/kui-shell/plugin-kubeui/issues/5361)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- Timeline view for kubernetes Jobs ([b623e4e](https://github.com/kui-shell/plugin-kubeui/commit/b623e4e)), closes [#5370](https://github.com/kui-shell/plugin-kubeui/issues/5370)
- **plugins/plugin-client-common:** improved SequenceDiagram view ([1e2fb41](https://github.com/kui-shell/plugin-kubeui/commit/1e2fb41)), closes [#5342](https://github.com/kui-shell/plugin-kubeui/issues/5342)
- s3 plugin, and vfs ([970ba6e](https://github.com/kui-shell/plugin-kubeui/commit/970ba6e)), closes [#5319](https://github.com/kui-shell/plugin-kubeui/issues/5319)
- **plugins/plugin-ibmcloud:** initial CodeEngine support ([677faca](https://github.com/kui-shell/plugin-kubeui/commit/677faca)), closes [#5302](https://github.com/kui-shell/plugin-kubeui/issues/5302) [#5303](https://github.com/kui-shell/plugin-kubeui/issues/5303)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.11.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.11.0) (2020-07-21)

### Bug Fixes

- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.10.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.10.0) (2020-06-17)

### Bug Fixes

- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.9.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.9.0) (2020-06-09)

### Bug Fixes

- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.7.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.7.0) (2020-05-08)

### Bug Fixes

- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

## [8.6.1](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.6.1) (2020-04-25)

### Bug Fixes

- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.6.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.6.0) (2020-04-23)

### Bug Fixes

- ibmcloud plugin list does not list unofficial plugins ([303fa00](https://github.com/kui-shell/plugin-kubeui/commit/303fa00)), closes [#4339](https://github.com/kui-shell/plugin-kubeui/issues/4339)
- **plugins/plugin-ibmcloud:** certain ibmcloud commands do not function with "ibmcloud" in defaultContext ([1d87981](https://github.com/kui-shell/plugin-kubeui/commit/1d87981)), closes [#4335](https://github.com/kui-shell/plugin-kubeui/issues/4335)
- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

# [8.5.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- make inBrowserOk the default ([2a3c811](https://github.com/kui-shell/plugin-kubeui/commit/2a3c811)), closes [#4275](https://github.com/kui-shell/plugin-kubeui/issues/4275)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

### BREAKING CHANGES

- removes support for inBrowserOk

## [8.4.2](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

## [8.4.1](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

# [8.4.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/kui-shell/plugin-kubeui/commit/00af4b4)), closes [#4213](https://github.com/kui-shell/plugin-kubeui/issues/4213)
- **plugins/plugin-kubectl:** add support for kustomize apply/delete/create ([b95cbdb](https://github.com/kui-shell/plugin-kubeui/commit/b95cbdb)), closes [#4203](https://github.com/kui-shell/plugin-kubeui/issues/4203)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)

# [8.1.0](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Features

- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)
