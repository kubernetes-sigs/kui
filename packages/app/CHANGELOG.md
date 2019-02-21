# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.10.0 (2019-02-21)


### Bug Fixes

* **app:** fixes for --ui and headless to graphics transitions ([38c4e98](https://github.com/IBM/kui/commit/38c4e98)), closes [#408](https://github.com/IBM/kui/issues/408)
* **app:** opening Kui Electron Builds from macOS Finder adds additional argv -psn ([5ac8393](https://github.com/IBM/kui/commit/5ac8393)), closes [#382](https://github.com/IBM/kui/issues/382)
* **app:** table watch handler was installing a row-level onclick handler ([ecdd93b](https://github.com/IBM/kui/commit/ecdd93b)), closes [#388](https://github.com/IBM/kui/issues/388)
* **app:** tone down ENOENT while precompiling plugin model ([dc99c90](https://github.com/IBM/kui/commit/dc99c90)), closes [#375](https://github.com/IBM/kui/issues/375)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
* **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
* **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 2.9.0 (2019-02-21)


### Bug Fixes

* **app:** fixes for --ui and headless to graphics transitions ([38c4e98](https://github.com/IBM/kui/commit/38c4e98)), closes [#408](https://github.com/IBM/kui/issues/408)
* **app:** opening Kui Electron Builds from macOS Finder adds additional argv -psn ([5ac8393](https://github.com/IBM/kui/commit/5ac8393)), closes [#382](https://github.com/IBM/kui/issues/382)
* **app:** table watch handler was installing a row-level onclick handler ([ecdd93b](https://github.com/IBM/kui/commit/ecdd93b)), closes [#388](https://github.com/IBM/kui/issues/388)
* **app:** tone down ENOENT while precompiling plugin model ([dc99c90](https://github.com/IBM/kui/commit/dc99c90)), closes [#375](https://github.com/IBM/kui/issues/375)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **plugin-k8s:** add "k" alias for "kubectl" ([4611ffe](https://github.com/IBM/kui/commit/4611ffe)), closes [#498](https://github.com/IBM/kui/issues/498)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
* **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
* **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





## 2.8.1 (2019-02-20)


### Bug Fixes

* **app:** fixes for --ui and headless to graphics transitions ([38c4e98](https://github.com/IBM/kui/commit/38c4e98)), closes [#408](https://github.com/IBM/kui/issues/408)
* **app:** opening Kui Electron Builds from macOS Finder adds additional argv -psn ([5ac8393](https://github.com/IBM/kui/commit/5ac8393)), closes [#382](https://github.com/IBM/kui/issues/382)
* **app:** table watch handler was installing a row-level onclick handler ([ecdd93b](https://github.com/IBM/kui/commit/ecdd93b)), closes [#388](https://github.com/IBM/kui/issues/388)
* **app:** tone down ENOENT while precompiling plugin model ([dc99c90](https://github.com/IBM/kui/commit/dc99c90)), closes [#375](https://github.com/IBM/kui/issues/375)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
* **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 2.8.0 (2019-02-20)


### Bug Fixes

* **app:** fixes for --ui and headless to graphics transitions ([38c4e98](https://github.com/IBM/kui/commit/38c4e98)), closes [#408](https://github.com/IBM/kui/issues/408)
* **app:** opening Kui Electron Builds from macOS Finder adds additional argv -psn ([5ac8393](https://github.com/IBM/kui/commit/5ac8393)), closes [#382](https://github.com/IBM/kui/issues/382)
* **app:** table watch handler was installing a row-level onclick handler ([ecdd93b](https://github.com/IBM/kui/commit/ecdd93b)), closes [#388](https://github.com/IBM/kui/issues/388)
* **app:** tone down ENOENT while precompiling plugin model ([dc99c90](https://github.com/IBM/kui/commit/dc99c90)), closes [#375](https://github.com/IBM/kui/issues/375)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
* **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 2.7.0 (2019-02-19)


### Bug Fixes

* **app:** fixes for --ui and headless to graphics transitions ([38c4e98](https://github.com/IBM/kui/commit/38c4e98)), closes [#408](https://github.com/IBM/kui/issues/408)
* **app:** opening Kui Electron Builds from macOS Finder adds additional argv -psn ([5ac8393](https://github.com/IBM/kui/commit/5ac8393)), closes [#382](https://github.com/IBM/kui/issues/382)
* **app:** table watch handler was installing a row-level onclick handler ([ecdd93b](https://github.com/IBM/kui/commit/ecdd93b)), closes [#388](https://github.com/IBM/kui/issues/388)
* **app:** tone down ENOENT while precompiling plugin model ([dc99c90](https://github.com/IBM/kui/commit/dc99c90)), closes [#375](https://github.com/IBM/kui/issues/375)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **plugin-openwhisk:** code highlight race bugs ([717b563](https://github.com/IBM/kui/commit/717b563)), closes [#475](https://github.com/IBM/kui/issues/475)
* **plugins-editor, plugins-openwhisk-editor-extensions:** fixes for lock/unlock and deploy n editor ([d0801a1](https://github.com/IBM/kui/commit/d0801a1)), closes [#472](https://github.com/IBM/kui/issues/472)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 2.6.0 (2019-02-13)


### Bug Fixes

* **app:** fixes for --ui and headless to graphics transitions ([38c4e98](https://github.com/IBM/kui/commit/38c4e98)), closes [#408](https://github.com/IBM/kui/issues/408)
* **app:** opening Kui Electron Builds from macOS Finder adds additional argv -psn ([5ac8393](https://github.com/IBM/kui/commit/5ac8393)), closes [#382](https://github.com/IBM/kui/issues/382)
* **app:** table watch handler was installing a row-level onclick handler ([ecdd93b](https://github.com/IBM/kui/commit/ecdd93b)), closes [#388](https://github.com/IBM/kui/issues/388)
* **app:** tone down ENOENT while precompiling plugin model ([dc99c90](https://github.com/IBM/kui/commit/dc99c90)), closes [#375](https://github.com/IBM/kui/issues/375)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **plugin-k8s:** k8s status enters infinite loop if resources absent ([e714c3f](https://github.com/IBM/kui/commit/e714c3f)), closes [#393](https://github.com/IBM/kui/issues/393)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 2.5.0 (2019-02-04)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 2.4.0 (2019-02-03)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 2.3.0 (2019-02-03)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 2.2.0 (2019-02-03)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **core:** another fix for error handling in plugin precompiler ([41c15db](https://github.com/IBM/kui/commit/41c15db)), closes [#306](https://github.com/IBM/kui/issues/306)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 2.1.0 (2019-02-03)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **core:** confine global repl hack to test mode ([e37d933](https://github.com/IBM/kui/commit/e37d933)), closes [#212](https://github.com/IBM/kui/issues/212)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **k8s:** fix for kubectl status in headless mode ([072626f](https://github.com/IBM/kui/commit/072626f)), closes [#327](https://github.com/IBM/kui/issues/327)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
