# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.0.30](https://github.com/IBM/kui/compare/v4.5.0...v7.0.30) (2020-03-10)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.29](https://github.com/IBM/kui/compare/v4.5.0...v7.0.29) (2020-03-10)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.28](https://github.com/IBM/kui/compare/v4.5.0...v7.0.28) (2020-03-09)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.27](https://github.com/IBM/kui/compare/v4.5.0...v7.0.27) (2020-03-09)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.26](https://github.com/IBM/kui/compare/v4.5.0...v7.0.26) (2020-03-08)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.25](https://github.com/IBM/kui/compare/v4.5.0...v7.0.25) (2020-03-07)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.24](https://github.com/IBM/kui/compare/v4.5.0...v7.0.24) (2020-03-07)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.23](https://github.com/IBM/kui/compare/v4.5.0...v7.0.23) (2020-03-07)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.22](https://github.com/IBM/kui/compare/v4.5.0...v7.0.22) (2020-03-07)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.21](https://github.com/IBM/kui/compare/v4.5.0...v7.0.21) (2020-03-06)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.20](https://github.com/IBM/kui/compare/v4.5.0...v7.0.20) (2020-03-06)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.19](https://github.com/IBM/kui/compare/v7.0.18...v7.0.19) (2020-03-06)

**Note:** Version bump only for package @kui-shell/test

## [7.0.18](https://github.com/IBM/kui/compare/v7.0.17...v7.0.18) (2020-03-06)

**Note:** Version bump only for package @kui-shell/test

## [7.0.17](https://github.com/IBM/kui/compare/v4.5.0...v7.0.17) (2020-03-06)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.16](https://github.com/IBM/kui/compare/v4.5.0...v7.0.16) (2020-03-06)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.15](https://github.com/IBM/kui/compare/v4.5.0...v7.0.15) (2020-03-06)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.14](https://github.com/IBM/kui/compare/v4.5.0...v7.0.14) (2020-03-06)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.13](https://github.com/IBM/kui/compare/v4.5.0...v7.0.13) (2020-03-05)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.12](https://github.com/IBM/kui/compare/v4.5.0...v7.0.12) (2020-03-05)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.11](https://github.com/IBM/kui/compare/v4.5.0...v7.0.11) (2020-03-05)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.10](https://github.com/IBM/kui/compare/v4.5.0...v7.0.10) (2020-03-04)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.9](https://github.com/IBM/kui/compare/v4.5.0...v7.0.9) (2020-03-04)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.8](https://github.com/IBM/kui/compare/v4.5.0...v7.0.8) (2020-03-03)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- support ReactElement as MultiModalResponse modes ([a20e289](https://github.com/IBM/kui/commit/a20e289)), closes [#3793](https://github.com/IBM/kui/issues/3793)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.7](https://github.com/IBM/kui/compare/v4.5.0...v7.0.7) (2020-03-03)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.6](https://github.com/IBM/kui/compare/v4.5.0...v7.0.6) (2020-03-03)

### Bug Fixes

- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.5](https://github.com/IBM/kui/compare/v4.5.0...v7.0.5) (2020-03-02)

### Bug Fixes

- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.4](https://github.com/IBM/kui/compare/v4.5.0...v7.0.4) (2020-03-01)

### Bug Fixes

- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
- **packages/core:** pass a PreloadRegistrar to plugin preloaders ([54d727a](https://github.com/IBM/kui/commit/54d727a)), closes [#3189](https://github.com/IBM/kui/issues/3189)
- **packages/core:** support updating Table from push notifications ([6bfb255](https://github.com/IBM/kui/commit/6bfb255)), closes [#3295](https://github.com/IBM/kui/issues/3295)

## [7.0.3](https://github.com/IBM/kui/compare/v7.0.2...v7.0.3) (2020-03-01)

**Note:** Version bump only for package @kui-shell/test

## [7.0.2](https://github.com/IBM/kui/compare/v7.0.1...v7.0.2) (2020-02-28)

**Note:** Version bump only for package @kui-shell/test

## [7.0.1](https://github.com/IBM/kui/compare/v7.0.0...v7.0.1) (2020-02-28)

**Note:** Version bump only for package @kui-shell/test

# [7.0.0](https://github.com/IBM/kui/compare/v4.5.0...v7.0.0) (2020-02-28)

### Bug Fixes

- **packages/core:** mmr couldn't show up when the sidecar is minimized ([91cd2cc](https://github.com/IBM/kui/commit/91cd2cc)), closes [#3164](https://github.com/IBM/kui/issues/3164)
- **packages/core:** MMR rendering is glitchy ([5ce89aa](https://github.com/IBM/kui/commit/5ce89aa)), closes [#3589](https://github.com/IBM/kui/issues/3589)
- **packages/core:** sidecar basic function should not require plugins ([07aa3e3](https://github.com/IBM/kui/commit/07aa3e3)), closes [#3172](https://github.com/IBM/kui/issues/3172)
- **packages/test:** nameHash waitUntil does not use waitTimeout ([5c996f4](https://github.com/IBM/kui/commit/5c996f4)), closes [#3246](https://github.com/IBM/kui/issues/3246)
- **packages/test:** runMochaLayers versus external clients ([89578dc](https://github.com/IBM/kui/commit/89578dc)), closes [#3106](https://github.com/IBM/kui/issues/3106)
- **packages/test:** runMochaLayersv2.sh should export WEBPACK_CLIENT_URL ([14fcdc9](https://github.com/IBM/kui/commit/14fcdc9)), closes [#3407](https://github.com/IBM/kui/issues/3407)
- **plugins/plugin-client-common:** keyboard shortcuts for TopTabStripe aren't working ([24d074f](https://github.com/IBM/kui/commit/24d074f)), closes [#3643](https://github.com/IBM/kui/issues/3643)
- another fix for codecov ([0b10599](https://github.com/IBM/kui/commit/0b10599)), closes [#3217](https://github.com/IBM/kui/issues/3217)
- improve windows build support ([cacd68b](https://github.com/IBM/kui/commit/cacd68b)), closes [#3332](https://github.com/IBM/kui/issues/3332)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- client test ([4c16985](https://github.com/IBM/kui/commit/4c16985)), closes [#3130](https://github.com/IBM/kui/issues/3130)
- enable plugin-manager for electron clients ([4814cb9](https://github.com/IBM/kui/commit/4814cb9)), closes [#2935](https://github.com/IBM/kui/issues/2935)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
- new client-alternate for bottom-input mode and custom css ([d25f7a0](https://github.com/IBM/kui/commit/d25f7a0)), closes [#3608](https://github.com/IBM/kui/issues/3608)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)
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
