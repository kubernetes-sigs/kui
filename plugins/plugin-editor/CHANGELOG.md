# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.23.0 (2019-06-17)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- editor sometimes doesn't show vertical "icon" text ([d0a1d70](https://github.com/IBM/kui/commit/d0a1d70)), closes [#1113](https://github.com/IBM/kui/issues/1113)
- editor swallows escape sidecar toggle ([0fb4f2e](https://github.com/IBM/kui/commit/0fb4f2e)), closes [#1317](https://github.com/IBM/kui/issues/1317)
- expose webpack hash to plugins ([c37bcbf](https://github.com/IBM/kui/commit/c37bcbf)), closes [#1350](https://github.com/IBM/kui/issues/1350)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- multiple fixes for tab management ([c125f7f](https://github.com/IBM/kui/commit/c125f7f)), closes [#1493](https://github.com/IBM/kui/issues/1493)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-core-support:** tab completion of dirs versus ~ ([c6190c5](https://github.com/IBM/kui/commit/c6190c5)), closes [#1483](https://github.com/IBM/kui/issues/1483)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** bugs in editor theme switching ([44dab97](https://github.com/IBM/kui/commit/44dab97)), closes [#1152](https://github.com/IBM/kui/issues/1152)
- **plugins/plugin-editor:** editor plugin hard-wires font size ([c35caf1](https://github.com/IBM/kui/commit/c35caf1)), closes [#1349](https://github.com/IBM/kui/issues/1349)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** editor test race condition ([c9daca2](https://github.com/IBM/kui/commit/c9daca2)), closes [#1363](https://github.com/IBM/kui/issues/1363)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** fixed the zooming issue in monaco-editor ([117fe7e](https://github.com/IBM/kui/commit/117fe7e)), closes [#1565](https://github.com/IBM/kui/issues/1565)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
- **plugins/plugin-k8s:** kedit versus empty final paragraph yamls ([5755530](https://github.com/IBM/kui/commit/5755530)), closes [#1409](https://github.com/IBM/kui/issues/1409)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- tekton pipelinerun view ([565a94c](https://github.com/IBM/kui/commit/565a94c)), closes [#1448](https://github.com/IBM/kui/issues/1448)
- tekton pipelinerun view ([615f2bb](https://github.com/IBM/kui/commit/615f2bb)), closes [#1448](https://github.com/IBM/kui/issues/1448)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.22.0 (2019-05-22)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- editor sometimes doesn't show vertical "icon" text ([d0a1d70](https://github.com/IBM/kui/commit/d0a1d70)), closes [#1113](https://github.com/IBM/kui/issues/1113)
- editor swallows escape sidecar toggle ([0fb4f2e](https://github.com/IBM/kui/commit/0fb4f2e)), closes [#1317](https://github.com/IBM/kui/issues/1317)
- expose webpack hash to plugins ([c37bcbf](https://github.com/IBM/kui/commit/c37bcbf)), closes [#1350](https://github.com/IBM/kui/issues/1350)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** bugs in editor theme switching ([44dab97](https://github.com/IBM/kui/commit/44dab97)), closes [#1152](https://github.com/IBM/kui/issues/1152)
- **plugins/plugin-editor:** editor plugin hard-wires font size ([c35caf1](https://github.com/IBM/kui/commit/c35caf1)), closes [#1349](https://github.com/IBM/kui/issues/1349)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** editor test race condition ([c9daca2](https://github.com/IBM/kui/commit/c9daca2)), closes [#1363](https://github.com/IBM/kui/issues/1363)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
- **plugins/plugin-k8s:** kedit versus empty final paragraph yamls ([5755530](https://github.com/IBM/kui/commit/5755530)), closes [#1409](https://github.com/IBM/kui/issues/1409)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.21.0 (2019-05-08)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- editor sometimes doesn't show vertical "icon" text ([d0a1d70](https://github.com/IBM/kui/commit/d0a1d70)), closes [#1113](https://github.com/IBM/kui/issues/1113)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** bugs in editor theme switching ([44dab97](https://github.com/IBM/kui/commit/44dab97)), closes [#1152](https://github.com/IBM/kui/issues/1152)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.20.0 (2019-05-07)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- editor sometimes doesn't show vertical "icon" text ([d0a1d70](https://github.com/IBM/kui/commit/d0a1d70)), closes [#1113](https://github.com/IBM/kui/issues/1113)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** bugs in editor theme switching ([44dab97](https://github.com/IBM/kui/commit/44dab97)), closes [#1152](https://github.com/IBM/kui/issues/1152)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.19.0 (2019-05-06)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- editor sometimes doesn't show vertical "icon" text ([d0a1d70](https://github.com/IBM/kui/commit/d0a1d70)), closes [#1113](https://github.com/IBM/kui/issues/1113)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** bugs in editor theme switching ([44dab97](https://github.com/IBM/kui/commit/44dab97)), closes [#1152](https://github.com/IBM/kui/issues/1152)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.18.0 (2019-05-06)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- editor sometimes doesn't show vertical "icon" text ([d0a1d70](https://github.com/IBM/kui/commit/d0a1d70)), closes [#1113](https://github.com/IBM/kui/issues/1113)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** bugs in editor theme switching ([44dab97](https://github.com/IBM/kui/commit/44dab97)), closes [#1152](https://github.com/IBM/kui/issues/1152)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.17.0 (2019-05-04)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- editor sometimes doesn't show vertical "icon" text ([d0a1d70](https://github.com/IBM/kui/commit/d0a1d70)), closes [#1113](https://github.com/IBM/kui/issues/1113)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** bugs in editor theme switching ([44dab97](https://github.com/IBM/kui/commit/44dab97)), closes [#1152](https://github.com/IBM/kui/issues/1152)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.16.0 (2019-04-26)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- editor sometimes doesn't show vertical "icon" text ([d0a1d70](https://github.com/IBM/kui/commit/d0a1d70)), closes [#1113](https://github.com/IBM/kui/issues/1113)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** bugs in editor theme switching ([44dab97](https://github.com/IBM/kui/commit/44dab97)), closes [#1152](https://github.com/IBM/kui/issues/1152)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.15.0 (2019-04-23)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- editor sometimes doesn't show vertical "icon" text ([d0a1d70](https://github.com/IBM/kui/commit/d0a1d70)), closes [#1113](https://github.com/IBM/kui/issues/1113)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** bugs in editor theme switching ([44dab97](https://github.com/IBM/kui/commit/44dab97)), closes [#1152](https://github.com/IBM/kui/issues/1152)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.14.0 (2019-04-10)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
- improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
- wskflow versus popup mode ([629bf44](https://github.com/IBM/kui/commit/629bf44)), closes [#1107](https://github.com/IBM/kui/issues/1107)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** editor versus light theme ([df77289](https://github.com/IBM/kui/commit/df77289)), closes [#983](https://github.com/IBM/kui/issues/983)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.13.0 (2019-03-19)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.12.0 (2019-03-19)

### Bug Fixes

- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- improved support for long vertical "resource type" sidecar header ([73ac7b4](https://github.com/IBM/kui/commit/73ac7b4)), closes [#780](https://github.com/IBM/kui/issues/780)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- paste in editor results in loss of editor focus ([f4ef055](https://github.com/IBM/kui/commit/f4ef055)), closes [#847](https://github.com/IBM/kui/issues/847)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** editor plugin not properly rendering markdown ([2f99bbc](https://github.com/IBM/kui/commit/2f99bbc)), closes [#763](https://github.com/IBM/kui/issues/763)
- **plugins/plugin-editor:** improve key-value coloration in editor ([77c7b93](https://github.com/IBM/kui/commit/77c7b93)), closes [#765](https://github.com/IBM/kui/issues/765)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)
- **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
- --ui should open repl-free windows ([088c24f](https://github.com/IBM/kui/commit/088c24f)), closes [#830](https://github.com/IBM/kui/issues/830)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.11.0 (2019-03-10)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugins/plugin-editor:** monaco-editor scrollbar positioning issues ([bf1245e](https://github.com/IBM/kui/commit/bf1245e)), closes [#753](https://github.com/IBM/kui/issues/753)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.10.0 (2019-03-10)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.9.0 (2019-03-10)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.8.0 (2019-03-09)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.7.0 (2019-03-08)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
- use editor more widely ([fe063de](https://github.com/IBM/kui/commit/fe063de)), closes [#532](https://github.com/IBM/kui/issues/532)

# 0.6.0 (2019-03-06)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.5.0 (2019-03-06)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.4.0 (2019-03-06)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- clicks on sidecar header etc. result in prompt losing focus ([2f78dfc](https://github.com/IBM/kui/commit/2f78dfc)), closes [#610](https://github.com/IBM/kui/issues/610)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.3.0 (2019-02-28)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.2.0 (2019-02-28)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugins/plugin-editor:** add missing deps to package.json ([63bc382](https://github.com/IBM/kui/commit/63bc382)), closes [#587](https://github.com/IBM/kui/issues/587)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

# 0.1.0 (2019-02-27)

### Bug Fixes

- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
- **plugins/plugin-editor:** improved dark mode for editor ([8a7fd03](https://github.com/IBM/kui/commit/8a7fd03)), closes [#533](https://github.com/IBM/kui/issues/533) [#530](https://github.com/IBM/kui/issues/530)
- more dark mode tweaks, including for editor text ([1d353ae](https://github.com/IBM/kui/commit/1d353ae)), closes [#554](https://github.com/IBM/kui/issues/554)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)

## 0.0.18 (2019-02-22)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)

## 0.0.17 (2019-02-21)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)

## 0.0.14 (2019-02-21)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)

## 0.0.13 (2019-02-20)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)

## 0.0.12 (2019-02-20)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)

## 0.0.11 (2019-02-19)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
- **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)

## 0.0.10 (2019-02-13)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)

## 0.0.6 (2019-02-04)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

## 0.0.5 (2019-02-03)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

## 0.0.4 (2019-02-03)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

## 0.0.3 (2019-02-03)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

## 0.0.2 (2019-02-03)

### Bug Fixes

- proxy package and plugin have improper package.json ([d6f474d](https://github.com/starpit/kui/commit/d6f474d)), closes [#355](https://github.com/starpit/kui/issues/355)
