# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [13.1.4](https://github.com/IBM/kui/compare/v13.1.3...v13.1.4) (2023-04-20)

**Note:** Version bump only for package @kui-shell/plugin-electron-components





## [13.1.3](https://github.com/IBM/kui/compare/v13.1.2...v13.1.3) (2023-03-25)

**Note:** Version bump only for package @kui-shell/plugin-electron-components





## [13.1.2](https://github.com/IBM/kui/compare/v13.1.1...v13.1.2) (2023-03-25)

**Note:** Version bump only for package @kui-shell/plugin-electron-components





## [13.1.1](https://github.com/IBM/kui/compare/v13.1.0...v13.1.1) (2023-02-22)

**Note:** Version bump only for package @kui-shell/plugin-electron-components





# [13.1.0](https://github.com/IBM/kui/compare/v4.5.0...v13.1.0) (2023-02-03)


### Bug Fixes

* add missing electron/remote dependencies ([9426b24](https://github.com/IBM/kui/commit/9426b24))
* add side-effect: false ([5120700](https://github.com/IBM/kui/commit/5120700))
* optimize load time by avoiding loading patternfly and plugin-client-common index.js ([e10829a](https://github.com/IBM/kui/commit/e10829a))
* plugin-electron-components is missing stated needle dependence ([0c78655](https://github.com/IBM/kui/commit/0c78655))
* UpdateChecker component does not display popover content ([20f89a2](https://github.com/IBM/kui/commit/20f89a2))
* UpdateChecker may call setState before mount ([c6c400f](https://github.com/IBM/kui/commit/c6c400f))
* **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
* **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
* **plugins/plugin-client-common:** Search component may emit console errors ([e08f7ac](https://github.com/IBM/kui/commit/e08f7ac))
* **plugins/plugin-electron-components:** Search should lazily load patternfly component ([f6758ce](https://github.com/IBM/kui/commit/f6758ce))
* **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
* **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
* **plugins/plugin-electron-components:** UpdateChecker initial delay is 0ms ([51c857a](https://github.com/IBM/kui/commit/51c857a))
* **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
* **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
* In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
* in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
* Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
* update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
* UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
* **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
* **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
* UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)


### chore

* update to react 18 ([277095f](https://github.com/IBM/kui/commit/277095f))


### Features

* **plugins/plugin-client-common:** some groundwork for for running choice-free guidebooks ([7117486](https://github.com/IBM/kui/commit/7117486))
* allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
* background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
* Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
* tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)


### BREAKING CHANGES

* `at-kui-shell/react` will now pull in react v18.
* we now pre-allocate execUUID on when the block is first mounted (these are known as Active blocks, because they have an active input). Previously, we relied on kui core/repl/exec to allocate upon run. This leads to a race condition, where command handlers expect to be able to communicate with the views based on an execUUID... but the views may not be mounted before the command handlers start... An example of this was the PTY. pty/client in plugin-bash-like sends pty streaming output ... the Output component (in plugin-client-common) is supposed to be the receiver, but it only listens after it is mounted). With this PR, we pre-allocate the execUUID, and mount the Output block even on Active blocks.
* **plugins/plugin-client-common:** the Button spi is now conformant to PatternFly's Button. size="small" -> isSmall





# [13.0.0](https://github.com/IBM/kui/compare/v4.5.0...v13.0.0) (2023-01-13)


### Bug Fixes

* add missing electron/remote dependencies ([9426b24](https://github.com/IBM/kui/commit/9426b24))
* add side-effect: false ([5120700](https://github.com/IBM/kui/commit/5120700))
* optimize load time by avoiding loading patternfly and plugin-client-common index.js ([e10829a](https://github.com/IBM/kui/commit/e10829a))
* plugin-electron-components is missing stated needle dependence ([0c78655](https://github.com/IBM/kui/commit/0c78655))
* UpdateChecker component does not display popover content ([20f89a2](https://github.com/IBM/kui/commit/20f89a2))
* UpdateChecker may call setState before mount ([c6c400f](https://github.com/IBM/kui/commit/c6c400f))
* **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
* **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
* **plugins/plugin-client-common:** Search component may emit console errors ([e08f7ac](https://github.com/IBM/kui/commit/e08f7ac))
* **plugins/plugin-electron-components:** Search should lazily load patternfly component ([f6758ce](https://github.com/IBM/kui/commit/f6758ce))
* **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
* **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
* **plugins/plugin-electron-components:** UpdateChecker initial delay is 0ms ([51c857a](https://github.com/IBM/kui/commit/51c857a))
* **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
* **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
* In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
* in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
* Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
* update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
* UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
* **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
* **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
* UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)


### chore

* update to react 18 ([277095f](https://github.com/IBM/kui/commit/277095f))


### Features

* **plugins/plugin-client-common:** some groundwork for for running choice-free guidebooks ([7117486](https://github.com/IBM/kui/commit/7117486))
* allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
* background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
* Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
* tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)


### BREAKING CHANGES

* `at-kui-shell/react` will now pull in react v18.
* we now pre-allocate execUUID on when the block is first mounted (these are known as Active blocks, because they have an active input). Previously, we relied on kui core/repl/exec to allocate upon run. This leads to a race condition, where command handlers expect to be able to communicate with the views based on an execUUID... but the views may not be mounted before the command handlers start... An example of this was the PTY. pty/client in plugin-bash-like sends pty streaming output ... the Output component (in plugin-client-common) is supposed to be the receiver, but it only listens after it is mounted). With this PR, we pre-allocate the execUUID, and mount the Output block even on Active blocks.
* **plugins/plugin-client-common:** the Button spi is now conformant to PatternFly's Button. size="small" -> isSmall





# [12.2.0](https://github.com/IBM/kui/compare/v4.5.0...v12.2.0) (2022-10-10)


### Bug Fixes

* **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
* **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
* **plugins/plugin-client-common:** Search component may emit console errors ([e08f7ac](https://github.com/IBM/kui/commit/e08f7ac))
* **plugins/plugin-electron-components:** Search should lazily load patternfly component ([f6758ce](https://github.com/IBM/kui/commit/f6758ce))
* **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
* **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
* **plugins/plugin-electron-components:** UpdateChecker initial delay is 0ms ([51c857a](https://github.com/IBM/kui/commit/51c857a))
* add missing electron/remote dependencies ([9426b24](https://github.com/IBM/kui/commit/9426b24))
* In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
* UpdateChecker component does not display popover content ([20f89a2](https://github.com/IBM/kui/commit/20f89a2))
* **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
* **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
* in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
* Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
* update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
* UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
* **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
* **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
* UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)


### Features

* **plugins/plugin-client-common:** some groundwork for for running choice-free guidebooks ([7117486](https://github.com/IBM/kui/commit/7117486))
* allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
* background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
* Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
* tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)


### BREAKING CHANGES

* **plugins/plugin-client-common:** the Button spi is now conformant to PatternFly's Button. size="small" -> isSmall





# [12.0.0](https://github.com/IBM/kui/compare/v4.5.0...v12.0.0) (2022-09-06)

### Bug Fixes

- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-client-common:** Search component may emit console errors ([e08f7ac](https://github.com/IBM/kui/commit/e08f7ac))
- **plugins/plugin-electron-components:** Search should lazily load patternfly component ([f6758ce](https://github.com/IBM/kui/commit/f6758ce))
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** UpdateChecker initial delay is 0ms ([51c857a](https://github.com/IBM/kui/commit/51c857a))
- add missing electron/remote dependencies ([9426b24](https://github.com/IBM/kui/commit/9426b24))
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- UpdateChecker component does not display popover content ([20f89a2](https://github.com/IBM/kui/commit/20f89a2))
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)

### Features

- **plugins/plugin-client-common:** some groundwork for for running choice-free guidebooks ([7117486](https://github.com/IBM/kui/commit/7117486))
- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

### BREAKING CHANGES

- **plugins/plugin-client-common:** the Button spi is now conformant to PatternFly's Button. size="small" -> isSmall

# [11.4.0](https://github.com/IBM/kui/compare/v4.5.0...v11.4.0) (2022-02-25)

### Bug Fixes

- add missing electron/remote dependencies ([9426b24](https://github.com/IBM/kui/commit/9426b24))
- UpdateChecker component does not display popover content ([20f89a2](https://github.com/IBM/kui/commit/20f89a2))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [11.3.0](https://github.com/IBM/kui/compare/v4.5.0...v11.3.0) (2022-02-22)

### Bug Fixes

- add missing electron/remote dependencies ([9426b24](https://github.com/IBM/kui/commit/9426b24))
- UpdateChecker component does not display popover content ([20f89a2](https://github.com/IBM/kui/commit/20f89a2))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [11.2.0](https://github.com/IBM/kui/compare/v4.5.0...v11.2.0) (2022-02-09)

### Bug Fixes

- add missing electron/remote dependencies ([9426b24](https://github.com/IBM/kui/commit/9426b24))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [11.1.0](https://github.com/IBM/kui/compare/v4.5.0...v11.1.0) (2022-01-24)

### Bug Fixes

- add missing electron/remote dependencies ([9426b24](https://github.com/IBM/kui/commit/9426b24))
- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [11.0.0](https://github.com/IBM/kui/compare/v4.5.0...v11.0.0) (2022-01-18)

### Bug Fixes

- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [10.7.0](https://github.com/IBM/kui/compare/v4.5.0...v10.7.0) (2021-10-12)

### Bug Fixes

- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

# [10.6.0](https://github.com/IBM/kui/compare/v4.5.0...v10.6.0) (2021-09-27)

### Bug Fixes

- **plugins/plugin-client-common:** In Popup mode, clicking Help button will show the welcome notebook in a new window ([18a974c](https://github.com/IBM/kui/commit/18a974c))
- **plugins/plugin-electron-components:** UpdateChecker does not render the changelog as markdown ([60d744b](https://github.com/IBM/kui/commit/60d744b)), closes [#7497](https://github.com/IBM/kui/issues/7497)
- **plugins/plugin-electron-components:** use github api to get the latest release ([63ae5bb](https://github.com/IBM/kui/commit/63ae5bb))
- **plugins/plugin-kubectl:** Kubernetes Context widget does not always correctly show "This is your current context" ([9848dc4](https://github.com/IBM/kui/commit/9848dc4)), closes [#7996](https://github.com/IBM/kui/issues/7996)
- In narrower windows, there is too much content in the StatusStripe ([453bc86](https://github.com/IBM/kui/commit/453bc86)), closes [#6570](https://github.com/IBM/kui/issues/6570)
- in screenshot alert, the icon and title text are misaligned ([ff57573](https://github.com/IBM/kui/commit/ff57573)), closes [#6770](https://github.com/IBM/kui/issues/6770)
- Screenshot alert is not visible in narrower windows ([d94da68](https://github.com/IBM/kui/commit/d94da68)), closes [#6843](https://github.com/IBM/kui/issues/6843)
- update UpdateChecker to point to new kubernetes-sigs/kui repo ([24e604b](https://github.com/IBM/kui/commit/24e604b))
- UpdateChecker does not render tables, lists, or relative image refs properly ([3e6ba75](https://github.com/IBM/kui/commit/3e6ba75)), closes [#6918](https://github.com/IBM/kui/issues/6918)
- **plugins/plugin-electron-components:** Update available fires when older legacy dist tags are released ([a15b83b](https://github.com/IBM/kui/commit/a15b83b)), closes [#5823](https://github.com/IBM/kui/issues/5823)
- **plugins/plugin-electron-components:** UpdateChecker should ignore prereleases ([29cba1d](https://github.com/IBM/kui/commit/29cba1d)), closes [#6655](https://github.com/IBM/kui/issues/6655)
- UpdateChecker popover can be too height ([8f87488](https://github.com/IBM/kui/commit/8f87488)), closes [#6413](https://github.com/IBM/kui/issues/6413)
- **plugins/plugin-electron-components:** UpdateChecker emits console errors when running tests ([a2a99c3](https://github.com/IBM/kui/commit/a2a99c3)), closes [#5838](https://github.com/IBM/kui/issues/5838)

### Features

- allow controllers to control the color of the status stripe ([708570c](https://github.com/IBM/kui/commit/708570c)), closes [#5490](https://github.com/IBM/kui/issues/5490)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- Refine Update Checker widget UI ([5c97479](https://github.com/IBM/kui/commit/5c97479)), closes [#6343](https://github.com/IBM/kui/issues/6343)
- tutorial VFS ([6f2330e](https://github.com/IBM/kui/commit/6f2330e)), closes [#5441](https://github.com/IBM/kui/issues/5441)

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
