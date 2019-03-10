# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
