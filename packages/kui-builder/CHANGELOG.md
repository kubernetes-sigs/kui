# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.9.0 (2019-02-21)


### Bug Fixes

* **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
* **kui-builder:** more fixes for CD pipeline ([184b45e](https://github.com/IBM/kui/commit/184b45e)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** more fixes for CD pipeline ([59bb0b7](https://github.com/IBM/kui/commit/59bb0b7)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** more fixes for headless build ([3ae143c](https://github.com/IBM/kui/commit/3ae143c)), closes [#478](https://github.com/IBM/kui/issues/478)
* **kui-builder:** update CD publisher to reflect new clients/default/dist structure ([efe753d](https://github.com/IBM/kui/commit/efe753d)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** update kui-watch to support external clients ([cfef146](https://github.com/IBM/kui/commit/cfef146)), closes [#448](https://github.com/IBM/kui/issues/448)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
* **test:** refactor /tests ([98f6096](https://github.com/IBM/kui/commit/98f6096)), closes [#496](https://github.com/IBM/kui/issues/496)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **webpack:** improve theme override support ([e8b943a](https://github.com/IBM/kui/commit/e8b943a)), closes [#298](https://github.com/IBM/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/IBM/kui/commit/2b4feeb)), closes [#271](https://github.com/IBM/kui/issues/271)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





## 0.8.1 (2019-02-20)


### Bug Fixes

* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
* **kui-builder:** more fixes for CD pipeline ([184b45e](https://github.com/IBM/kui/commit/184b45e)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** more fixes for CD pipeline ([59bb0b7](https://github.com/IBM/kui/commit/59bb0b7)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** more fixes for headless build ([3ae143c](https://github.com/IBM/kui/commit/3ae143c)), closes [#478](https://github.com/IBM/kui/issues/478)
* **kui-builder:** update CD publisher to reflect new clients/default/dist structure ([efe753d](https://github.com/IBM/kui/commit/efe753d)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** update kui-watch to support external clients ([cfef146](https://github.com/IBM/kui/commit/cfef146)), closes [#448](https://github.com/IBM/kui/issues/448)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **webpack:** improve theme override support ([e8b943a](https://github.com/IBM/kui/commit/e8b943a)), closes [#298](https://github.com/IBM/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/IBM/kui/commit/2b4feeb)), closes [#271](https://github.com/IBM/kui/issues/271)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 0.8.0 (2019-02-20)


### Bug Fixes

* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
* **kui-builder:** more fixes for CD pipeline ([184b45e](https://github.com/IBM/kui/commit/184b45e)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** more fixes for CD pipeline ([59bb0b7](https://github.com/IBM/kui/commit/59bb0b7)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** more fixes for headless build ([3ae143c](https://github.com/IBM/kui/commit/3ae143c)), closes [#478](https://github.com/IBM/kui/issues/478)
* **kui-builder:** update CD publisher to reflect new clients/default/dist structure ([efe753d](https://github.com/IBM/kui/commit/efe753d)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** update kui-watch to support external clients ([cfef146](https://github.com/IBM/kui/commit/cfef146)), closes [#448](https://github.com/IBM/kui/issues/448)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **webpack:** improve theme override support ([e8b943a](https://github.com/IBM/kui/commit/e8b943a)), closes [#298](https://github.com/IBM/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/IBM/kui/commit/2b4feeb)), closes [#271](https://github.com/IBM/kui/issues/271)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 0.7.0 (2019-02-19)


### Bug Fixes

* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
* **kui-builder:** more fixes for headless build ([3ae143c](https://github.com/IBM/kui/commit/3ae143c)), closes [#478](https://github.com/IBM/kui/issues/478)
* **kui-builder:** update CD publisher to reflect new clients/default/dist structure ([8726d12](https://github.com/IBM/kui/commit/8726d12)), closes [#482](https://github.com/IBM/kui/issues/482)
* **kui-builder:** update kui-watch to support external clients ([cfef146](https://github.com/IBM/kui/commit/cfef146)), closes [#448](https://github.com/IBM/kui/issues/448)
* **plugin-k8s:** improve k8s in absence of plugin-openwhisk ([30f8a3a](https://github.com/IBM/kui/commit/30f8a3a)), closes [#457](https://github.com/IBM/kui/issues/457) [#458](https://github.com/IBM/kui/issues/458)
* **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **webpack:** improve theme override support ([e8b943a](https://github.com/IBM/kui/commit/e8b943a)), closes [#298](https://github.com/IBM/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/IBM/kui/commit/2b4feeb)), closes [#271](https://github.com/IBM/kui/issues/271)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 0.6.0 (2019-02-13)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
* **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **webpack:** improve theme override support ([e8b943a](https://github.com/IBM/kui/commit/e8b943a)), closes [#298](https://github.com/IBM/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/IBM/kui/commit/2b4feeb)), closes [#271](https://github.com/IBM/kui/issues/271)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 0.5.0 (2019-02-04)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **webpack:** improve theme override support ([e8b943a](https://github.com/IBM/kui/commit/e8b943a)), closes [#298](https://github.com/IBM/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/IBM/kui/commit/2b4feeb)), closes [#271](https://github.com/IBM/kui/issues/271)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 0.4.0 (2019-02-03)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **webpack:** improve theme override support ([e8b943a](https://github.com/IBM/kui/commit/e8b943a)), closes [#298](https://github.com/IBM/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/IBM/kui/commit/2b4feeb)), closes [#271](https://github.com/IBM/kui/issues/271)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 0.3.0 (2019-02-03)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **webpack:** improve theme override support ([e8b943a](https://github.com/IBM/kui/commit/e8b943a)), closes [#298](https://github.com/IBM/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/IBM/kui/commit/2b4feeb)), closes [#271](https://github.com/IBM/kui/issues/271)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 0.2.0 (2019-02-03)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/IBM/kui/commit/e41e159)), closes [#319](https://github.com/IBM/kui/issues/319)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/IBM/kui/commit/34e6f48)), closes [#306](https://github.com/IBM/kui/issues/306)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/IBM/kui/commit/f636fb6)), closes [#259](https://github.com/IBM/kui/issues/259)
* **webpack:** improve theme override support ([e8b943a](https://github.com/IBM/kui/commit/e8b943a)), closes [#298](https://github.com/IBM/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/IBM/kui/commit/2b4feeb)), closes [#271](https://github.com/IBM/kui/issues/271)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/IBM/kui/commit/d1b4e75)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)





# 0.1.0 (2019-02-03)


### Bug Fixes

* fixes for auth in browser+proxy mode ([a441c33](https://github.com/starpit/kui/commit/a441c33)), closes [#287](https://github.com/starpit/kui/issues/287) [#286](https://github.com/starpit/kui/issues/286) [#289](https://github.com/starpit/kui/issues/289)
* local dev-mode ./bin/kui is missing theme ([e41e159](https://github.com/starpit/kui/commit/e41e159)), closes [#319](https://github.com/starpit/kui/issues/319)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/starpit/kui/commit/14ac816)), closes [#332](https://github.com/starpit/kui/issues/332)
* **core:** more gracefully handle dom and errors in plugin compiler ([34e6f48](https://github.com/starpit/kui/commit/34e6f48)), closes [#306](https://github.com/starpit/kui/issues/306)
* **webpack:** fixes for webpack build regressions ([f636fb6](https://github.com/starpit/kui/commit/f636fb6)), closes [#259](https://github.com/starpit/kui/issues/259)
* **webpack:** improve theme override support ([e8b943a](https://github.com/starpit/kui/commit/e8b943a)), closes [#298](https://github.com/starpit/kui/issues/298)
* **webpack:** restore webpack publisher functionality ([2b4feeb](https://github.com/starpit/kui/commit/2b4feeb)), closes [#271](https://github.com/starpit/kui/issues/271)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([d1b4e75](https://github.com/starpit/kui/commit/d1b4e75)), closes [#329](https://github.com/starpit/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/starpit/kui/commit/530c278)), closes [#266](https://github.com/starpit/kui/issues/266) [#278](https://github.com/starpit/kui/issues/278) [#279](https://github.com/starpit/kui/issues/279)
* **webpack:** dockerized webpack build ([bc65dc2](https://github.com/starpit/kui/commit/bc65dc2)), closes [#274](https://github.com/starpit/kui/issues/274)
