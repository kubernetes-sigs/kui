# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.35.0 (2019-07-01)


### Bug Fixes

* **plugins/plugin-k8s:** do not render clickable element for example commands in k8s usage model ([5403436](https://github.com/IBM/kui/commit/5403436)), closes [#1830](https://github.com/IBM/kui/issues/1830)
* **plugins/plugin-k8s:** fix webpack regression by dynamically import fs-extra ([1a5c868](https://github.com/IBM/kui/commit/1a5c868)), closes [#1819](https://github.com/IBM/kui/issues/1819)
* remove regex lookbehind for webpack in firefox ([f5fa704](https://github.com/IBM/kui/commit/f5fa704)), closes [#1801](https://github.com/IBM/kui/issues/1801)
* **packages/app:** watchable table: stop checking resource deletion by error message ([549adc7](https://github.com/IBM/kui/commit/549adc7))
* sidecar full screen behavioral tweaks ([99ffc99](https://github.com/IBM/kui/commit/99ffc99)), closes [#1794](https://github.com/IBM/kui/issues/1794)
* **packages/app:** first column with sidecar open can be scrunched ([bee82d1](https://github.com/IBM/kui/commit/bee82d1)), closes [#1694](https://github.com/IBM/kui/issues/1694)
* **packages/app:** register capabilities before preloading plugins ([871d9de](https://github.com/IBM/kui/commit/871d9de)), closes [#1724](https://github.com/IBM/kui/issues/1724)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **plugins/plugin-core-support:** tab completion of dirs versus ~ ([c6190c5](https://github.com/IBM/kui/commit/c6190c5)), closes [#1483](https://github.com/IBM/kui/issues/1483)
* **plugins/plugin-k8s:** `k status --all` should return resources across namespaces ([9ea04d3](https://github.com/IBM/kui/commit/9ea04d3)), closes [#1461](https://github.com/IBM/kui/issues/1461)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** fix kubectl table regression in sidecar ([88f6cb3](https://github.com/IBM/kui/commit/88f6cb3)), closes [#1262](https://github.com/IBM/kui/issues/1262)
* **plugins/plugin-k8s:** fixed missing notes of helm status ([a4a3b76](https://github.com/IBM/kui/commit/a4a3b76))
* **plugins/plugin-k8s:** fixed the issue that empty helm list returns {} as output and added tests for empty helm list ([ad61cc4](https://github.com/IBM/kui/commit/ad61cc4)), closes [#1246](https://github.com/IBM/kui/issues/1246)
* **plugins/plugin-k8s:** HorizontalPodAutoscaler status support ([666b54a](https://github.com/IBM/kui/commit/666b54a)), closes [#1220](https://github.com/IBM/kui/issues/1220)
* **plugins/plugin-k8s:** improve support for ClusterRole and PodSecurityPolicy states ([605132e](https://github.com/IBM/kui/commit/605132e)), closes [#1476](https://github.com/IBM/kui/issues/1476)
* **plugins/plugin-k8s:** k get all shows "ALL" for each subtable ([5c4b32d](https://github.com/IBM/kui/commit/5c4b32d)), closes [#1549](https://github.com/IBM/kui/issues/1549)
* **plugins/plugin-k8s:** k status tab versus webpack+proxy ([5488c10](https://github.com/IBM/kui/commit/5488c10)), closes [#1346](https://github.com/IBM/kui/issues/1346)
* **plugins/plugin-k8s:** k8s resource states with Ready:True should be designated as Online ([6b4d3d9](https://github.com/IBM/kui/commit/6b4d3d9)), closes [#1775](https://github.com/IBM/kui/issues/1775)
* **plugins/plugin-k8s:** k8s tab completion test regression ([f5d87da](https://github.com/IBM/kui/commit/f5d87da)), closes [#1756](https://github.com/IBM/kui/issues/1756)
* **plugins/plugin-k8s:** kedit versus empty final paragraph yamls ([5755530](https://github.com/IBM/kui/commit/5755530)), closes [#1409](https://github.com/IBM/kui/issues/1409)
* **plugins/plugin-k8s:** kubectl get fails if STATUS column has empty cells ([755aa33](https://github.com/IBM/kui/commit/755aa33)), closes [#1787](https://github.com/IBM/kui/issues/1787)
* **plugins/plugin-k8s:** kui still searches in bashrc if KUBECONFIG=<emptystring> ([6b0f0d3](https://github.com/IBM/kui/commit/6b0f0d3)), closes [#1789](https://github.com/IBM/kui/issues/1789)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* helm list and helm list test fixes ([22694f7](https://github.com/IBM/kui/commit/22694f7)), closes [#1721](https://github.com/IBM/kui/issues/1721)
* **plugins/plugin-k8s:** sidecar deletion button has incorrect direct function ([c1442a8](https://github.com/IBM/kui/commit/c1442a8)), closes [#1554](https://github.com/IBM/kui/issues/1554)
* ascii-to-table with duplicate final column ([f43cda0](https://github.com/IBM/kui/commit/f43cda0)), closes [#1561](https://github.com/IBM/kui/issues/1561)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* multiple fixes for tab management ([c125f7f](https://github.com/IBM/kui/commit/c125f7f)), closes [#1493](https://github.com/IBM/kui/issues/1493)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* experimental olm commands ([35d8015](https://github.com/IBM/kui/commit/35d8015)), closes [#1783](https://github.com/IBM/kui/issues/1783)
* plugin-operator-framework ([cc56e4a](https://github.com/IBM/kui/commit/cc56e4a)), closes [#1768](https://github.com/IBM/kui/issues/1768)
* **plugins/plugin-k8s:** initial olm support ([b361a03](https://github.com/IBM/kui/commit/b361a03)), closes [#1459](https://github.com/IBM/kui/issues/1459)
* extend tab completion extension API to support completion of optional args ([494bdfd](https://github.com/IBM/kui/commit/494bdfd)), closes [#1748](https://github.com/IBM/kui/issues/1748)
* git branch tab completion ([8be1073](https://github.com/IBM/kui/commit/8be1073)), closes [#1735](https://github.com/IBM/kui/issues/1735)
* **plugins/plugin-k8s:** add a last applied tab for k8s resources ([477b5c2](https://github.com/IBM/kui/commit/477b5c2)), closes [#1632](https://github.com/IBM/kui/issues/1632)
* **plugins/plugin-k8s:** improve k8s log parsing ([2eb82cb](https://github.com/IBM/kui/commit/2eb82cb)), closes [#1487](https://github.com/IBM/kui/issues/1487)
* **plugins/plugin-k8s:** improve support for kubectl --filename ([da7bb42](https://github.com/IBM/kui/commit/da7bb42)), closes [#1475](https://github.com/IBM/kui/issues/1475)
* **plugins/plugin-k8s:** improved helm search output ([7ca584c](https://github.com/IBM/kui/commit/7ca584c)), closes [#1511](https://github.com/IBM/kui/issues/1511)
* **plugins/plugin-k8s:** tab completion ([199c623](https://github.com/IBM/kui/commit/199c623)), closes [#1729](https://github.com/IBM/kui/issues/1729) [#1731](https://github.com/IBM/kui/issues/1731)
* add watchableTable model and port kubectl get [entity] -w to use the watchable table ([af9a757](https://github.com/IBM/kui/commit/af9a757)), closes [#1450](https://github.com/IBM/kui/issues/1450)
* allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
* improved support for custom k8s modes ([8e3ca5a](https://github.com/IBM/kui/commit/8e3ca5a)), closes [#1481](https://github.com/IBM/kui/issues/1481)
* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* pty table parsing ([090f9df](https://github.com/IBM/kui/commit/090f9df)), closes [#1516](https://github.com/IBM/kui/issues/1516)
* tekton log navigation support ([85f19d9](https://github.com/IBM/kui/commit/85f19d9)), closes [#1608](https://github.com/IBM/kui/issues/1608) [#1609](https://github.com/IBM/kui/issues/1609)
* tekton pipelinerun view ([565a94c](https://github.com/IBM/kui/commit/565a94c)), closes [#1448](https://github.com/IBM/kui/issues/1448)
* tekton pipelinerun view ([615f2bb](https://github.com/IBM/kui/commit/615f2bb)), closes [#1448](https://github.com/IBM/kui/issues/1448)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.34.0 (2019-06-17)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/app:** register capabilities before preloading plugins ([871d9de](https://github.com/IBM/kui/commit/871d9de)), closes [#1724](https://github.com/IBM/kui/issues/1724)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-core-support:** tab completion of dirs versus ~ ([c6190c5](https://github.com/IBM/kui/commit/c6190c5)), closes [#1483](https://github.com/IBM/kui/issues/1483)
* **plugins/plugin-k8s:** `k status --all` should return resources across namespaces ([9ea04d3](https://github.com/IBM/kui/commit/9ea04d3)), closes [#1461](https://github.com/IBM/kui/issues/1461)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix kubectl table regression in sidecar ([88f6cb3](https://github.com/IBM/kui/commit/88f6cb3)), closes [#1262](https://github.com/IBM/kui/issues/1262)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** fixed missing notes of helm status ([a4a3b76](https://github.com/IBM/kui/commit/a4a3b76))
* **plugins/plugin-k8s:** fixed the issue that empty helm list returns {} as output and added tests for empty helm list ([ad61cc4](https://github.com/IBM/kui/commit/ad61cc4)), closes [#1246](https://github.com/IBM/kui/issues/1246)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** HorizontalPodAutoscaler status support ([666b54a](https://github.com/IBM/kui/commit/666b54a)), closes [#1220](https://github.com/IBM/kui/issues/1220)
* **plugins/plugin-k8s:** improve support for ClusterRole and PodSecurityPolicy states ([605132e](https://github.com/IBM/kui/commit/605132e)), closes [#1476](https://github.com/IBM/kui/issues/1476)
* **plugins/plugin-k8s:** k get all shows "ALL" for each subtable ([5c4b32d](https://github.com/IBM/kui/commit/5c4b32d)), closes [#1549](https://github.com/IBM/kui/issues/1549)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k status tab versus webpack+proxy ([5488c10](https://github.com/IBM/kui/commit/5488c10)), closes [#1346](https://github.com/IBM/kui/issues/1346)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kedit versus empty final paragraph yamls ([5755530](https://github.com/IBM/kui/commit/5755530)), closes [#1409](https://github.com/IBM/kui/issues/1409)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** sidecar deletion button has incorrect direct function ([c1442a8](https://github.com/IBM/kui/commit/c1442a8)), closes [#1554](https://github.com/IBM/kui/issues/1554)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* ascii-to-table with duplicate final column ([f43cda0](https://github.com/IBM/kui/commit/f43cda0)), closes [#1561](https://github.com/IBM/kui/issues/1561)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* helm list and helm list test fixes ([22694f7](https://github.com/IBM/kui/commit/22694f7)), closes [#1721](https://github.com/IBM/kui/issues/1721)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* multiple fixes for tab management ([c125f7f](https://github.com/IBM/kui/commit/c125f7f)), closes [#1493](https://github.com/IBM/kui/issues/1493)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)
* webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)


### Features

* add watchableTable model and port kubectl get [entity] -w to use the watchable table ([af9a757](https://github.com/IBM/kui/commit/af9a757)), closes [#1450](https://github.com/IBM/kui/issues/1450)
* allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
* git branch tab completion ([8be1073](https://github.com/IBM/kui/commit/8be1073)), closes [#1735](https://github.com/IBM/kui/issues/1735)
* improved support for custom k8s modes ([8e3ca5a](https://github.com/IBM/kui/commit/8e3ca5a)), closes [#1481](https://github.com/IBM/kui/issues/1481)
* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* pty table parsing ([090f9df](https://github.com/IBM/kui/commit/090f9df)), closes [#1516](https://github.com/IBM/kui/issues/1516)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* tekton log navigation support ([85f19d9](https://github.com/IBM/kui/commit/85f19d9)), closes [#1608](https://github.com/IBM/kui/issues/1608) [#1609](https://github.com/IBM/kui/issues/1609)
* **plugins/plugin-k8s:** add a last applied tab for k8s resources ([477b5c2](https://github.com/IBM/kui/commit/477b5c2)), closes [#1632](https://github.com/IBM/kui/issues/1632)
* tekton pipelinerun view ([615f2bb](https://github.com/IBM/kui/commit/615f2bb)), closes [#1448](https://github.com/IBM/kui/issues/1448)
* tekton pipelinerun view ([565a94c](https://github.com/IBM/kui/commit/565a94c)), closes [#1448](https://github.com/IBM/kui/issues/1448)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** improve k8s log parsing ([2eb82cb](https://github.com/IBM/kui/commit/2eb82cb)), closes [#1487](https://github.com/IBM/kui/issues/1487)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** improve support for kubectl --filename ([da7bb42](https://github.com/IBM/kui/commit/da7bb42)), closes [#1475](https://github.com/IBM/kui/issues/1475)
* **plugins/plugin-k8s:** improved helm search output ([7ca584c](https://github.com/IBM/kui/commit/7ca584c)), closes [#1511](https://github.com/IBM/kui/issues/1511)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
* **plugins/plugin-k8s:** tab completion ([199c623](https://github.com/IBM/kui/commit/199c623)), closes [#1729](https://github.com/IBM/kui/issues/1729) [#1731](https://github.com/IBM/kui/issues/1731)





# 0.33.0 (2019-05-22)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix kubectl table regression in sidecar ([88f6cb3](https://github.com/IBM/kui/commit/88f6cb3)), closes [#1262](https://github.com/IBM/kui/issues/1262)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** fixed the issue that empty helm list returns {} as output and added tests for empty helm list ([ad61cc4](https://github.com/IBM/kui/commit/ad61cc4)), closes [#1246](https://github.com/IBM/kui/issues/1246)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** HorizontalPodAutoscaler status support ([666b54a](https://github.com/IBM/kui/commit/666b54a)), closes [#1220](https://github.com/IBM/kui/issues/1220)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k status tab versus webpack+proxy ([5488c10](https://github.com/IBM/kui/commit/5488c10)), closes [#1346](https://github.com/IBM/kui/issues/1346)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kedit versus empty final paragraph yamls ([5755530](https://github.com/IBM/kui/commit/5755530)), closes [#1409](https://github.com/IBM/kui/issues/1409)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)
* webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)


### Features

* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.32.0 (2019-05-08)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix kubectl table regression in sidecar ([88f6cb3](https://github.com/IBM/kui/commit/88f6cb3)), closes [#1262](https://github.com/IBM/kui/issues/1262)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** fixed the issue that empty helm list returns {} as output and added tests for empty helm list ([ad61cc4](https://github.com/IBM/kui/commit/ad61cc4)), closes [#1246](https://github.com/IBM/kui/issues/1246)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)
* webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)


### Features

* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.31.0 (2019-05-07)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix kubectl table regression in sidecar ([88f6cb3](https://github.com/IBM/kui/commit/88f6cb3)), closes [#1262](https://github.com/IBM/kui/issues/1262)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** fixed the issue that empty helm list returns {} as output and added tests for empty helm list ([ad61cc4](https://github.com/IBM/kui/commit/ad61cc4)), closes [#1246](https://github.com/IBM/kui/issues/1246)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.30.0 (2019-05-06)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix kubectl table regression in sidecar ([88f6cb3](https://github.com/IBM/kui/commit/88f6cb3)), closes [#1262](https://github.com/IBM/kui/issues/1262)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** fixed the issue that empty helm list returns {} as output and added tests for empty helm list ([ad61cc4](https://github.com/IBM/kui/commit/ad61cc4)), closes [#1246](https://github.com/IBM/kui/issues/1246)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.29.0 (2019-05-06)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix kubectl table regression in sidecar ([88f6cb3](https://github.com/IBM/kui/commit/88f6cb3)), closes [#1262](https://github.com/IBM/kui/issues/1262)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** fixed the issue that empty helm list returns {} as output and added tests for empty helm list ([ad61cc4](https://github.com/IBM/kui/commit/ad61cc4)), closes [#1246](https://github.com/IBM/kui/issues/1246)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* allow for client-provided localStorage impl ([829bc1d](https://github.com/IBM/kui/commit/829bc1d)), closes [#1294](https://github.com/IBM/kui/issues/1294)
* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.28.0 (2019-05-04)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** fixed the issue that empty helm list returns {} as output and added tests for empty helm list ([ad61cc4](https://github.com/IBM/kui/commit/ad61cc4)), closes [#1246](https://github.com/IBM/kui/issues/1246)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.27.0 (2019-04-26)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* further work on type coverage ([3805002](https://github.com/IBM/kui/commit/3805002)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* initial work on improving core type coverage ([0f042a8](https://github.com/IBM/kui/commit/0f042a8)), closes [#1206](https://github.com/IBM/kui/issues/1206)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.26.0 (2019-04-23)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** apply fails if URL redirects ([8eb7dc1](https://github.com/IBM/kui/commit/8eb7dc1)), closes [#1126](https://github.com/IBM/kui/issues/1126)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s contexts click handler regression ([31fb7a3](https://github.com/IBM/kui/commit/31fb7a3)), closes [#1180](https://github.com/IBM/kui/issues/1180)
* **plugins/plugin-k8s:** k8s tables in sidecar have odd font size ([5a2ea6b](https://github.com/IBM/kui/commit/5a2ea6b)), closes [#1143](https://github.com/IBM/kui/issues/1143)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **plugins/plugins-k8s:** Ingress never shows as Online ([3dd7697](https://github.com/IBM/kui/commit/3dd7697)), closes [#1181](https://github.com/IBM/kui/issues/1181)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* kubectl edit support ([de44c9a](https://github.com/IBM/kui/commit/de44c9a)), closes [#1164](https://github.com/IBM/kui/issues/1164)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.25.0 (2019-04-10)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** fix misusage of reverse waitForVisable and waitForExist ([f38a031](https://github.com/IBM/kui/commit/f38a031)), closes [#1065](https://github.com/IBM/kui/issues/1065)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** revert to istio 1.0.6 ([868a8d4](https://github.com/IBM/kui/commit/868a8d4)), closes [#1015](https://github.com/IBM/kui/issues/1015)
* **plugins/plugin-k8s:** status mode does not handle non-default namespace ([4494ff4](https://github.com/IBM/kui/commit/4494ff4)), closes [#1009](https://github.com/IBM/kui/issues/1009)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **plugins/plugin-k8s:** Unschedulable should be considered offline-like ([c470708](https://github.com/IBM/kui/commit/c470708)), closes [#994](https://github.com/IBM/kui/issues/994)
* **plugins/plugin-k8s:** update to istio 1.1 ([945a595](https://github.com/IBM/kui/commit/945a595)), closes [#993](https://github.com/IBM/kui/issues/993)
* **plugins/plugins-k8s:** describe versus unknown resource type ([5b7f0ca](https://github.com/IBM/kui/commit/5b7f0ca)), closes [#1007](https://github.com/IBM/kui/issues/1007)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* cross-editing between form and monaco issues for kedit ([6076653](https://github.com/IBM/kui/commit/6076653)), closes [#990](https://github.com/IBM/kui/issues/990)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* improve prettyPrintTime for small deltas ([8b43230](https://github.com/IBM/kui/commit/8b43230)), closes [#1023](https://github.com/IBM/kui/issues/1023)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* improved log rendering, especially for istio ([dca663a](https://github.com/IBM/kui/commit/dca663a)), closes [#1017](https://github.com/IBM/kui/issues/1017)
* kedit breakage ([e237336](https://github.com/IBM/kui/commit/e237336)), closes [#982](https://github.com/IBM/kui/issues/982)
* log formatting issues ([8bc375c](https://github.com/IBM/kui/commit/8bc375c)), closes [#1036](https://github.com/IBM/kui/issues/1036)
* log parsing updates ([b7b91db](https://github.com/IBM/kui/commit/b7b91db)), closes [#1019](https://github.com/IBM/kui/issues/1019)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* make sure we don't label multiple columns as NAME-like ([c64386a](https://github.com/IBM/kui/commit/c64386a)), closes [#936](https://github.com/IBM/kui/issues/936)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* refinements to kedit ([13ae0bf](https://github.com/IBM/kui/commit/13ae0bf)), closes [#986](https://github.com/IBM/kui/issues/986)
* slowPoll sometimes never terminates ([c974e5e](https://github.com/IBM/kui/commit/c974e5e)), closes [#1050](https://github.com/IBM/kui/issues/1050)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* k8s parsing of nginx access logs ([86fd92f](https://github.com/IBM/kui/commit/86fd92f)), closes [#1040](https://github.com/IBM/kui/issues/1040)
* k8s tables should have header ([996a3c3](https://github.com/IBM/kui/commit/996a3c3)), closes [#942](https://github.com/IBM/kui/issues/942)
* kiali graph ([d51e3e1](https://github.com/IBM/kui/commit/d51e3e1)), closes [#965](https://github.com/IBM/kui/issues/965) [#966](https://github.com/IBM/kui/issues/966)
* kubectl get -w ([fc833d9](https://github.com/IBM/kui/commit/fc833d9)), closes [#981](https://github.com/IBM/kui/issues/981)
* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.24.0 (2019-03-19)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* enhanced support for subtext rendering of sidecar ([b54f1ff](https://github.com/IBM/kui/commit/b54f1ff)), closes [#907](https://github.com/IBM/kui/issues/907)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.23.0 (2019-03-19)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins-plugin-k8s:** helm status tables may have no header row ([7c9527c](https://github.com/IBM/kui/commit/7c9527c)), closes [#863](https://github.com/IBM/kui/issues/863)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** add a few more fields to kubectl describe ([493f8e5](https://github.com/IBM/kui/commit/493f8e5)), closes [#774](https://github.com/IBM/kui/issues/774)
* **plugins/plugin-k8s:** add Data to describe output ([0c5cf37](https://github.com/IBM/kui/commit/0c5cf37)), closes [#785](https://github.com/IBM/kui/issues/785)
* **plugins/plugin-k8s:** bug in addConditions causing kubectl get utter failure ([391ffda](https://github.com/IBM/kui/commit/391ffda)), closes [#770](https://github.com/IBM/kui/issues/770)
* **plugins/plugin-k8s:** describe should handle tolerations without effect ([8222c0c](https://github.com/IBM/kui/commit/8222c0c)), closes [#805](https://github.com/IBM/kui/issues/805)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** helm status click handler for configmaps ([b1294a0](https://github.com/IBM/kui/commit/b1294a0)), closes [#772](https://github.com/IBM/kui/issues/772)
* **plugins/plugin-k8s:** k get namespace does not show green for Active ([6146269](https://github.com/IBM/kui/commit/6146269)), closes [#782](https://github.com/IBM/kui/issues/782)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kube Status should be STATUS ([0464ad5](https://github.com/IBM/kui/commit/0464ad5)), closes [#809](https://github.com/IBM/kui/issues/809)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** make kubectl -h detailed examples clickable ([b157c41](https://github.com/IBM/kui/commit/b157c41)), closes [#824](https://github.com/IBM/kui/issues/824)
* fix for overflowing badge text ([6caaeaf](https://github.com/IBM/kui/commit/6caaeaf)), closes [#795](https://github.com/IBM/kui/issues/795)
* improve support for kube all-namespaces ([8fab11a](https://github.com/IBM/kui/commit/8fab11a)), closes [#797](https://github.com/IBM/kui/issues/797)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **plugins/plugin-k8s:** status table for namespaces misaligned columns ([1a6aa16](https://github.com/IBM/kui/commit/1a6aa16)), closes [#793](https://github.com/IBM/kui/issues/793)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)
* **plugins/plugin-k8s:** add delete button to kube describe sidecar ([3db2775](https://github.com/IBM/kui/commit/3db2775)), closes [#811](https://github.com/IBM/kui/issues/811)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** kiali get apps --interval support ([cccd772](https://github.com/IBM/kui/commit/cccd772)), closes [#817](https://github.com/IBM/kui/issues/817)
* **plugins/plugin-k8s:** kubectl describe refinements ([6b6e8c5](https://github.com/IBM/kui/commit/6b6e8c5)), closes [#756](https://github.com/IBM/kui/issues/756)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.22.0 (2019-03-10)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
* pretty-print kubectl error+usage output ([b6e235b](https://github.com/IBM/kui/commit/b6e235b)), closes [#751](https://github.com/IBM/kui/issues/751)





# 0.21.0 (2019-03-10)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.20.0 (2019-03-10)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/app:** further improve multi-line table rendering ([807ce72](https://github.com/IBM/kui/commit/807ce72)), closes [#726](https://github.com/IBM/kui/issues/726)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* make improved use of sidecar header for k8s ([e9c34d0](https://github.com/IBM/kui/commit/e9c34d0)), closes [#735](https://github.com/IBM/kui/issues/735)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.19.0 (2019-03-09)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** fix mode button operation when running in proxy ([810f9b2](https://github.com/IBM/kui/commit/810f9b2)), closes [#710](https://github.com/IBM/kui/issues/710)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** improve kubectl run behavior ([66c3fc6](https://github.com/IBM/kui/commit/66c3fc6)), closes [#723](https://github.com/IBM/kui/issues/723)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.18.0 (2019-03-08)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* **plugins/plugin-k8s:** kubectl logs -h does not display usage ([67f56fa](https://github.com/IBM/kui/commit/67f56fa)), closes [#571](https://github.com/IBM/kui/issues/571)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **plugins/plugin-k8s:** minor k8s table formatting issues ([b02019c](https://github.com/IBM/kui/commit/b02019c)), closes [#665](https://github.com/IBM/kui/issues/665)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.17.0 (2019-03-06)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** k8s versus webpack bug ([8ed6032](https://github.com/IBM/kui/commit/8ed6032)), closes [#653](https://github.com/IBM/kui/issues/653)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.16.0 (2019-03-06)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.15.0 (2019-03-06)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** initial istio and kiali support ([0072725](https://github.com/IBM/kui/commit/0072725)), closes [#644](https://github.com/IBM/kui/issues/644)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.14.0 (2019-02-28)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** helm client checker fix for webpack ([b300e25](https://github.com/IBM/kui/commit/b300e25)), closes [#592](https://github.com/IBM/kui/issues/592)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.13.0 (2019-02-28)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* some tables overflowed due to buggy scrollable css ([23d3353](https://github.com/IBM/kui/commit/23d3353)), closes [#575](https://github.com/IBM/kui/issues/575)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)
* **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)





# 0.12.0 (2019-02-27)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **plugins/plugin-bash-like:** improve markdown rendering ([fd37be5](https://github.com/IBM/kui/commit/fd37be5)), closes [#159](https://github.com/IBM/kui/issues/159)
* **plugins/plugin-k8s:** fix for get configmap ([945dde3](https://github.com/IBM/kui/commit/945dde3)), closes [#552](https://github.com/IBM/kui/issues/552)
* **plugins/plugin-k8s:** fix for overflowing UPDATED column in helm list ([f1d1c9f](https://github.com/IBM/kui/commit/f1d1c9f)), closes [#528](https://github.com/IBM/kui/issues/528)
* **plugins/plugin-k8s:** fix for proxied drilldown from kubectl get ([46cf6ec](https://github.com/IBM/kui/commit/46cf6ec)), closes [#564](https://github.com/IBM/kui/issues/564) [#568](https://github.com/IBM/kui/issues/568)
* **plugins/plugin-k8s:** make helm status rows clickable ([0295964](https://github.com/IBM/kui/commit/0295964)), closes [#538](https://github.com/IBM/kui/issues/538)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **packages/app:** dark theme support ([51f8736](https://github.com/IBM/kui/commit/51f8736)), closes [#522](https://github.com/IBM/kui/issues/522)
* **plugin-k8s:** add conditions and containers tabs to kubectl get ([7ca6130](https://github.com/IBM/kui/commit/7ca6130)), closes [#517](https://github.com/IBM/kui/issues/517)





# 0.11.0 (2019-02-22)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.10.0 (2019-02-21)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix for racy headless-create-pod tests ([d07792d](https://github.com/IBM/kui/commit/d07792d)), closes [#501](https://github.com/IBM/kui/issues/501)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.9.0 (2019-02-21)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** in contexts table, make context name clickable ([2c4339c](https://github.com/IBM/kui/commit/2c4339c)), closes [#494](https://github.com/IBM/kui/issues/494)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





## 0.8.1 (2019-02-20)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.8.0 (2019-02-20)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** attempt to find KUBECONFIG for double-clicked macOS electron apps ([51f8332](https://github.com/IBM/kui/commit/51f8332)), closes [#462](https://github.com/IBM/kui/issues/462)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** improved fix for finding KUBECONFIG for double-clicked apps ([fd3f40b](https://github.com/IBM/kui/commit/fd3f40b)), closes [#487](https://github.com/IBM/kui/issues/487)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.7.0 (2019-02-19)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-k8s:** add /usr/local/bin to PATH ([a3c2f9d](https://github.com/IBM/kui/commit/a3c2f9d)), closes [#460](https://github.com/IBM/kui/issues/460)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.6.0 (2019-02-13)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-k8s:** fix helm delete (--wait not a supported option) ([7533f4e](https://github.com/IBM/kui/commit/7533f4e)), closes [#412](https://github.com/IBM/kui/issues/412)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-k8s:** show VirtualService kind as Online ([667a0b1](https://github.com/IBM/kui/commit/667a0b1)), closes [#387](https://github.com/IBM/kui/issues/387)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.5.0 (2019-02-04)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.4.0 (2019-02-03)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.3.0 (2019-02-03)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.2.0 (2019-02-03)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.1.0 (2019-02-03)


### Bug Fixes

* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/starpit/kui/commit/072626f)), closes [#327](https://github.com/starpit/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/starpit/kui/commit/f636fb6)), closes [#259](https://github.com/starpit/kui/issues/259)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/starpit/kui/commit/d6f474d)), closes [#355](https://github.com/starpit/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/starpit/kui/commit/530c278)), closes [#266](https://github.com/starpit/kui/issues/266) [#278](https://github.com/starpit/kui/issues/278) [#279](https://github.com/starpit/kui/issues/279)
