# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- **plugins/plugin-bash-like:** remove leftover debug in client.ts ([adbe87e](https://github.com/IBM/kui/commit/adbe87e)), closes [#4224](https://github.com/IBM/kui/issues/4224)
- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- CurrentGitBranch fails if branch name parses as a number ([a3d8127](https://github.com/IBM/kui/commit/a3d8127)), closes [#4004](https://github.com/IBM/kui/issues/4004)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** pty output with non-zero exit code results in wall of red text ([4b6fe8e](https://github.com/IBM/kui/commit/4b6fe8e)), closes [#3939](https://github.com/IBM/kui/issues/3939)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- **plugins/plugin-client-common:** text-selection is not working in repl ([5672e02](https://github.com/IBM/kui/commit/5672e02)), closes [#3738](https://github.com/IBM/kui/issues/3738) [#3739](https://github.com/IBM/kui/issues/3739) [#3741](https://github.com/IBM/kui/issues/3741)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- **packages/core:** improved cancel via ctrl+c ([7ee6db6](https://github.com/IBM/kui/commit/7ee6db6)), closes [#3275](https://github.com/IBM/kui/issues/3275) [#3581](https://github.com/IBM/kui/issues/3581)
- **plugins/plugin-client-common:** accordion blocks in Terminal ([eb2f285](https://github.com/IBM/kui/commit/eb2f285)), closes [#3726](https://github.com/IBM/kui/issues/3726)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- **plugins/plugin-kubectl:** watcher table disappears when kui is launched as kubectl plugin ([167eabc](https://github.com/IBM/kui/commit/167eabc)), closes [#4120](https://github.com/IBM/kui/issues/4120) [#4123](https://github.com/IBM/kui/issues/4123)
- CurrentGitBranch fails if branch name parses as a number ([a3d8127](https://github.com/IBM/kui/commit/a3d8127)), closes [#4004](https://github.com/IBM/kui/issues/4004)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- text selection in active xterms for light themes is not visible ([ace9ec9](https://github.com/IBM/kui/commit/ace9ec9)), closes [#4087](https://github.com/IBM/kui/issues/4087)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty output with non-zero exit code results in wall of red text ([4b6fe8e](https://github.com/IBM/kui/commit/4b6fe8e)), closes [#3939](https://github.com/IBM/kui/issues/3939)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- **plugins/plugin-client-common:** text-selection is not working in repl ([5672e02](https://github.com/IBM/kui/commit/5672e02)), closes [#3738](https://github.com/IBM/kui/issues/3738) [#3739](https://github.com/IBM/kui/issues/3739) [#3741](https://github.com/IBM/kui/issues/3741)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- **packages/core:** improved cancel via ctrl+c ([7ee6db6](https://github.com/IBM/kui/commit/7ee6db6)), closes [#3275](https://github.com/IBM/kui/issues/3275) [#3581](https://github.com/IBM/kui/issues/3581)
- **plugins/plugin-client-common:** accordion blocks in Terminal ([eb2f285](https://github.com/IBM/kui/commit/eb2f285)), closes [#3726](https://github.com/IBM/kui/issues/3726)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Bug Fixes

- **plugins/plugin-bash-like:** pty output with non-zero exit code results in wall of red text ([4b6fe8e](https://github.com/IBM/kui/commit/4b6fe8e)), closes [#3939](https://github.com/IBM/kui/issues/3939)
- eliminate use of custom <tab> tag ([00e2728](https://github.com/IBM/kui/commit/00e2728)), closes [#3777](https://github.com/IBM/kui/issues/3777)
- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- pick a winner if more than one tab completion enumerator has offerings ([fbd6696](https://github.com/IBM/kui/commit/fbd6696)), closes [#3736](https://github.com/IBM/kui/issues/3736)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-client-common:** text-selection is not working in repl ([5672e02](https://github.com/IBM/kui/commit/5672e02)), closes [#3738](https://github.com/IBM/kui/issues/3738) [#3739](https://github.com/IBM/kui/issues/3739) [#3741](https://github.com/IBM/kui/issues/3741)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- **packages/core:** improved cancel via ctrl+c ([7ee6db6](https://github.com/IBM/kui/commit/7ee6db6)), closes [#3275](https://github.com/IBM/kui/issues/3275) [#3581](https://github.com/IBM/kui/issues/3581)
- **plugins/plugin-client-common:** accordion blocks in Terminal ([eb2f285](https://github.com/IBM/kui/commit/eb2f285)), closes [#3726](https://github.com/IBM/kui/issues/3726)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-bash-like

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/plugin-bash-like

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/plugin-bash-like

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/plugin-bash-like

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Bug Fixes

- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- **packages/core:** improved cancel via ctrl+c ([7ee6db6](https://github.com/IBM/kui/commit/7ee6db6)), closes [#3275](https://github.com/IBM/kui/issues/3275) [#3581](https://github.com/IBM/kui/issues/3581)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Bug Fixes

- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- **packages/core:** improved cancel via ctrl+c ([7ee6db6](https://github.com/IBM/kui/commit/7ee6db6)), closes [#3275](https://github.com/IBM/kui/issues/3275) [#3581](https://github.com/IBM/kui/issues/3581)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Bug Fixes

- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- **packages/core:** improved cancel via ctrl+c ([7ee6db6](https://github.com/IBM/kui/commit/7ee6db6)), closes [#3275](https://github.com/IBM/kui/issues/3275) [#3581](https://github.com/IBM/kui/issues/3581)
- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Bug Fixes

- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/plugin-bash-like

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Bug Fixes

- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Bug Fixes

- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Bug Fixes

- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Bug Fixes

- improved fixes for status bar ([05f5f7d](https://github.com/IBM/kui/commit/05f5f7d)), closes [#3538](https://github.com/IBM/kui/issues/3538) [#3543](https://github.com/IBM/kui/issues/3543)
- **packages/core:** status stripe fragments should be hidden until data arrives ([5792746](https://github.com/IBM/kui/commit/5792746)), closes [#3538](https://github.com/IBM/kui/issues/3538)
- **plugins/plugin-bash-like:** another fix for nested pty execution, in electron ([5274532](https://github.com/IBM/kui/commit/5274532)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** clean up nested PTY execution path ([5cb3cc0](https://github.com/IBM/kui/commit/5cb3cc0)), closes [#3493](https://github.com/IBM/kui/issues/3493)
- **plugins/plugin-bash-like:** ls versus tab switching ([79473fa](https://github.com/IBM/kui/commit/79473fa)), closes [#3485](https://github.com/IBM/kui/issues/3485)
- don't default to ls -l ([5a5b426](https://github.com/IBM/kui/commit/5a5b426)), closes [#3473](https://github.com/IBM/kui/issues/3473)
- **packages/core:** broken clickable resource names for CLIs that don't have a kui plugin ([3c0f8ae](https://github.com/IBM/kui/commit/3c0f8ae)), closes [#2888](https://github.com/IBM/kui/issues/2888)
- **packages/core:** current selection versus MetadataBearingByReference ([4c78a34](https://github.com/IBM/kui/commit/4c78a34)), closes [#3228](https://github.com/IBM/kui/issues/3228)
- **packages/core:** remove old EntitySpec support ([e45fb7b](https://github.com/IBM/kui/commit/e45fb7b)), closes [#3268](https://github.com/IBM/kui/issues/3268)
- **plugins/plugin-bash-like:** default to powershell not cmd on windows ([e7d50e2](https://github.com/IBM/kui/commit/e7d50e2)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** export with no args error handling ([d3e62b3](https://github.com/IBM/kui/commit/d3e62b3)), closes [#2894](https://github.com/IBM/kui/issues/2894)
- **plugins/plugin-bash-like:** fix memory leak in pty/client ([afeb29e](https://github.com/IBM/kui/commit/afeb29e)), closes [#3465](https://github.com/IBM/kui/issues/3465)
- **plugins/plugin-bash-like:** multiple PTYs per tab ([5a62dc8](https://github.com/IBM/kui/commit/5a62dc8)), closes [#3453](https://github.com/IBM/kui/issues/3453)
- **plugins/plugin-bash-like:** pty should not use yaml heuristics when in alt buffer mode ([de048d5](https://github.com/IBM/kui/commit/de048d5)), closes [#3459](https://github.com/IBM/kui/issues/3459)
- **plugins/plugin-bash-like:** speed up date formatting in ls ([1e54a17](https://github.com/IBM/kui/commit/1e54a17)), closes [#3461](https://github.com/IBM/kui/issues/3461)
- about contexts tab is non-functional ([c0b61b6](https://github.com/IBM/kui/commit/c0b61b6)), closes [#2890](https://github.com/IBM/kui/issues/2890)
- kui session is noop in electron mode ([80f8690](https://github.com/IBM/kui/commit/80f8690)), closes [#3330](https://github.com/IBM/kui/issues/3330)
- optimize webpack bundle loading ([e2f473a](https://github.com/IBM/kui/commit/e2f473a)), closes [#3359](https://github.com/IBM/kui/issues/3359)
- overlapping clien-to-proxy requests can lead to parse errors ([ebcf5ed](https://github.com/IBM/kui/commit/ebcf5ed)), closes [#3314](https://github.com/IBM/kui/issues/3314)
- port filesystem tab completion to tab completion API ([df4ee2f](https://github.com/IBM/kui/commit/df4ee2f)), closes [#3446](https://github.com/IBM/kui/issues/3446) [#2403](https://github.com/IBM/kui/issues/2403) [#3447](https://github.com/IBM/kui/issues/3447)
- propagate statusCode back from the proxy ([275240a](https://github.com/IBM/kui/commit/275240a)), closes [#3318](https://github.com/IBM/kui/issues/3318)
- reducing flashing effect for PTY command not found errors ([f160337](https://github.com/IBM/kui/commit/f160337)), closes [#3449](https://github.com/IBM/kui/issues/3449)
- reimplement ls using filesystem APIs ([7eec254](https://github.com/IBM/kui/commit/7eec254)), closes [#2702](https://github.com/IBM/kui/issues/2702) [#1304](https://github.com/IBM/kui/issues/1304)
- **plugins/plugin-bash-like:** fix windows git bash pty regression ([654d320](https://github.com/IBM/kui/commit/654d320)), closes [#3442](https://github.com/IBM/kui/issues/3442)
- **plugins/plugin-bash-like:** open should not use kedit ([2548998](https://github.com/IBM/kui/commit/2548998)), closes [#3199](https://github.com/IBM/kui/issues/3199)

### Features

- add support for command string modes that specify contentType ([31c6940](https://github.com/IBM/kui/commit/31c6940)), closes [#3299](https://github.com/IBM/kui/issues/3299)
- allow plugins to use subdirectories ([e7cc3e3](https://github.com/IBM/kui/commit/e7cc3e3)), closes [#3389](https://github.com/IBM/kui/issues/3389)
- extend MultiModalResponse to support functions that produce content ([b940c63](https://github.com/IBM/kui/commit/b940c63)), closes [#3022](https://github.com/IBM/kui/issues/3022)
- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
- pty should allow for streaming consumption of output ([1886e58](https://github.com/IBM/kui/commit/1886e58)), closes [#3451](https://github.com/IBM/kui/issues/3451)
- remove openwhisk plugins ([fb4274d](https://github.com/IBM/kui/commit/fb4274d)), closes [#3201](https://github.com/IBM/kui/issues/3201)
- status stripe ([d485ab3](https://github.com/IBM/kui/commit/d485ab3)), closes [#3475](https://github.com/IBM/kui/issues/3475) [#1859](https://github.com/IBM/kui/issues/1859)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- **packages/core:** remove old EntitySpec support
- this moves the openwhisk plugins to a new repo: https://github.com/kui-shell/oui

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

### Features

- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

### Features

- introduce new MultiModalResponse API ([67e9c8a](https://github.com/IBM/kui/commit/67e9c8a)), closes [#2899](https://github.com/IBM/kui/issues/2899)
