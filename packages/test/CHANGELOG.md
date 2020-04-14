# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- **plugins/plugin-sidecar:** when nameHash is displayed, TopNavSidecar doesn't render the dehashed name ([ef887f4](https://github.com/IBM/kui/commit/ef887f4)), closes [#3969](https://github.com/IBM/kui/issues/3969)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- return an NavResponse without links results in blank page ([e684344](https://github.com/IBM/kui/commit/e684344)), closes [#3927](https://github.com/IBM/kui/issues/3927)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add labels to summary mode ([95f731d](https://github.com/IBM/kui/commit/95f731d)), closes [#4041](https://github.com/IBM/kui/issues/4041) [#4040](https://github.com/IBM/kui/issues/4040)
- add Show Owner Reference button for kube resources ([80ea40f](https://github.com/IBM/kui/commit/80ea40f)), closes [#4106](https://github.com/IBM/kui/issues/4106)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- improve pagination and toolbar UIs of PaginatedTable ([08062e9](https://github.com/IBM/kui/commit/08062e9)), closes [#1456](https://github.com/IBM/kui/issues/1456)
- kubectl tables should show official kind in title ([06eec95](https://github.com/IBM/kui/commit/06eec95)), closes [#4127](https://github.com/IBM/kui/issues/4127)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- resize the popup window ([41bf5cf](https://github.com/IBM/kui/commit/41bf5cf)), closes [#4161](https://github.com/IBM/kui/issues/4161)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- use breadcrumbs for TopNavSidecar naming ([5a4611e](https://github.com/IBM/kui/commit/5a4611e)), closes [#4043](https://github.com/IBM/kui/issues/4043) [#3657](https://github.com/IBM/kui/issues/3657) [#4044](https://github.com/IBM/kui/issues/4044)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- **plugins/plugin-sidecar:** when nameHash is displayed, TopNavSidecar doesn't render the dehashed name ([ef887f4](https://github.com/IBM/kui/commit/ef887f4)), closes [#3969](https://github.com/IBM/kui/issues/3969)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- return an NavResponse without links results in blank page ([e684344](https://github.com/IBM/kui/commit/e684344)), closes [#3927](https://github.com/IBM/kui/issues/3927)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add labels to summary mode ([95f731d](https://github.com/IBM/kui/commit/95f731d)), closes [#4041](https://github.com/IBM/kui/issues/4041) [#4040](https://github.com/IBM/kui/issues/4040)
- add Show Owner Reference button for kube resources ([80ea40f](https://github.com/IBM/kui/commit/80ea40f)), closes [#4106](https://github.com/IBM/kui/issues/4106)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- improve pagination and toolbar UIs of PaginatedTable ([08062e9](https://github.com/IBM/kui/commit/08062e9)), closes [#1456](https://github.com/IBM/kui/issues/1456)
- kubectl tables should show official kind in title ([06eec95](https://github.com/IBM/kui/commit/06eec95)), closes [#4127](https://github.com/IBM/kui/issues/4127)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- resize the popup window ([41bf5cf](https://github.com/IBM/kui/commit/41bf5cf)), closes [#4161](https://github.com/IBM/kui/issues/4161)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- use breadcrumbs for TopNavSidecar naming ([5a4611e](https://github.com/IBM/kui/commit/5a4611e)), closes [#4043](https://github.com/IBM/kui/issues/4043) [#3657](https://github.com/IBM/kui/issues/3657) [#4044](https://github.com/IBM/kui/issues/4044)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- sidecar Toolbar component renders empty if there is no Toolbar content ([14c27ba](https://github.com/IBM/kui/commit/14c27ba)), closes [#4229](https://github.com/IBM/kui/issues/4229)
- **plugins/plugin-sidecar:** when nameHash is displayed, TopNavSidecar doesn't render the dehashed name ([ef887f4](https://github.com/IBM/kui/commit/ef887f4)), closes [#3969](https://github.com/IBM/kui/issues/3969)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- return an NavResponse without links results in blank page ([e684344](https://github.com/IBM/kui/commit/e684344)), closes [#3927](https://github.com/IBM/kui/issues/3927)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add labels to summary mode ([95f731d](https://github.com/IBM/kui/commit/95f731d)), closes [#4041](https://github.com/IBM/kui/issues/4041) [#4040](https://github.com/IBM/kui/issues/4040)
- add Show Owner Reference button for kube resources ([80ea40f](https://github.com/IBM/kui/commit/80ea40f)), closes [#4106](https://github.com/IBM/kui/issues/4106)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- improve pagination and toolbar UIs of PaginatedTable ([08062e9](https://github.com/IBM/kui/commit/08062e9)), closes [#1456](https://github.com/IBM/kui/issues/1456)
- kubectl tables should show official kind in title ([06eec95](https://github.com/IBM/kui/commit/06eec95)), closes [#4127](https://github.com/IBM/kui/issues/4127)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- resize the popup window ([41bf5cf](https://github.com/IBM/kui/commit/41bf5cf)), closes [#4161](https://github.com/IBM/kui/issues/4161)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- use breadcrumbs for TopNavSidecar naming ([5a4611e](https://github.com/IBM/kui/commit/5a4611e)), closes [#4043](https://github.com/IBM/kui/issues/4043) [#3657](https://github.com/IBM/kui/issues/3657) [#4044](https://github.com/IBM/kui/issues/4044)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- **plugins/plugin-sidecar:** when nameHash is displayed, TopNavSidecar doesn't render the dehashed name ([ef887f4](https://github.com/IBM/kui/commit/ef887f4)), closes [#3969](https://github.com/IBM/kui/issues/3969)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- return an NavResponse without links results in blank page ([e684344](https://github.com/IBM/kui/commit/e684344)), closes [#3927](https://github.com/IBM/kui/issues/3927)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- add labels to summary mode ([95f731d](https://github.com/IBM/kui/commit/95f731d)), closes [#4041](https://github.com/IBM/kui/issues/4041) [#4040](https://github.com/IBM/kui/issues/4040)
- add Show Owner Reference button for kube resources ([80ea40f](https://github.com/IBM/kui/commit/80ea40f)), closes [#4106](https://github.com/IBM/kui/issues/4106)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- improve pagination and toolbar UIs of PaginatedTable ([08062e9](https://github.com/IBM/kui/commit/08062e9)), closes [#1456](https://github.com/IBM/kui/issues/1456)
- kubectl tables should show official kind in title ([06eec95](https://github.com/IBM/kui/commit/06eec95)), closes [#4127](https://github.com/IBM/kui/issues/4127)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- render kubectl summary tab using forms ([d88436e](https://github.com/IBM/kui/commit/d88436e)), closes [#4014](https://github.com/IBM/kui/issues/4014)
- resize the popup window ([41bf5cf](https://github.com/IBM/kui/commit/41bf5cf)), closes [#4161](https://github.com/IBM/kui/issues/4161)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- use breadcrumbs for TopNavSidecar naming ([5a4611e](https://github.com/IBM/kui/commit/5a4611e)), closes [#4043](https://github.com/IBM/kui/issues/4043) [#3657](https://github.com/IBM/kui/issues/3657) [#4044](https://github.com/IBM/kui/issues/4044)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- **plugins/plugin-sidecar:** when nameHash is displayed, TopNavSidecar doesn't render the dehashed name ([ef887f4](https://github.com/IBM/kui/commit/ef887f4)), closes [#3969](https://github.com/IBM/kui/issues/3969)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- return an NavResponse without links results in blank page ([e684344](https://github.com/IBM/kui/commit/e684344)), closes [#3927](https://github.com/IBM/kui/issues/3927)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)

### Features

- add history to sidecar views ([b1e5543](https://github.com/IBM/kui/commit/b1e5543)), closes [#3960](https://github.com/IBM/kui/issues/3960)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- refine NavResponse and add NavLinks support in LeftNavSidecar ([f1d8d98](https://github.com/IBM/kui/commit/f1d8d98)), closes [#3902](https://github.com/IBM/kui/issues/3902)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/test

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

### Bug Fixes

- **packages/core:** MMR rendering is glitchy ([d314439](https://github.com/IBM/kui/commit/d314439)), closes [#3589](https://github.com/IBM/kui/issues/3589)

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/test

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/test

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)

### Features

- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)

### Features

- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)

### Features

- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)

### Features

- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/test

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)

### Features

- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)

### Features

- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)

### Features

- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)

### Features

- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Features

- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/test
