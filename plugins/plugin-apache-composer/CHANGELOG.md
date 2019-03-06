# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.20.0 (2019-03-06)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **plugins/plugin-apache-composer:** add missing deps to package.json ([243e290](https://github.com/IBM/kui/commit/243e290)), closes [#565](https://github.com/IBM/kui/issues/565)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.19.0 (2019-02-28)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **plugins/plugin-apache-composer:** add missing deps to package.json ([243e290](https://github.com/IBM/kui/commit/243e290)), closes [#565](https://github.com/IBM/kui/issues/565)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.18.0 (2019-02-28)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **plugins/plugin-apache-composer:** add missing deps to package.json ([243e290](https://github.com/IBM/kui/commit/243e290)), closes [#565](https://github.com/IBM/kui/issues/565)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.17.0 (2019-02-27)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **plugins/plugin-apache-composer:** add missing deps to package.json ([243e290](https://github.com/IBM/kui/commit/243e290)), closes [#565](https://github.com/IBM/kui/issues/565)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.16.0 (2019-02-22)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* **packages/tests:** remove bin/corral from test runner ([1f7c263](https://github.com/IBM/kui/commit/1f7c263)), closes [#510](https://github.com/IBM/kui/issues/510) [#425](https://github.com/IBM/kui/issues/425)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.15.0 (2019-02-21)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.14.0 (2019-02-21)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t @demos/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





## 0.13.1 (2019-02-20)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.13.0 (2019-02-20)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.12.0 (2019-02-19)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **plugin-wskflow:** add preview notice to sidecar header ([a65cae5](https://github.com/IBM/kui/commit/a65cae5)), closes [#455](https://github.com/IBM/kui/issues/455) [#386](https://github.com/IBM/kui/issues/386)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.11.0 (2019-02-13)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
* **plugin-apache-composer:** update to latest apache-composer API ([b4a1b8e](https://github.com/IBM/kui/commit/b4a1b8e)), closes [#435](https://github.com/IBM/kui/issues/435)
* **plugin-apache-composer:** update to latest openwhisk-composer ([02a1a56](https://github.com/IBM/kui/commit/02a1a56)), closes [#392](https://github.com/IBM/kui/issues/392)
* **plugin-openwhisk:** separate out the editor parts from plugin-openwhisk ([8195220](https://github.com/IBM/kui/commit/8195220)), closes [#437](https://github.com/IBM/kui/issues/437) [#441](https://github.com/IBM/kui/issues/441)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.10.0 (2019-02-04)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.9.0 (2019-02-03)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.8.0 (2019-02-03)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.7.0 (2019-02-03)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/IBM/kui/commit/49e1e2f)), closes [#269](https://github.com/IBM/kui/issues/269)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/IBM/kui/commit/14ac816)), closes [#332](https://github.com/IBM/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/IBM/kui/commit/871c2b8)), closes [#317](https://github.com/IBM/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/IBM/kui/commit/d9e5598)), closes [#324](https://github.com/IBM/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/IBM/kui/commit/af0a428)), closes [#316](https://github.com/IBM/kui/issues/316) [#318](https://github.com/IBM/kui/issues/318)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/IBM/kui/commit/adc685f)), closes [#329](https://github.com/IBM/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)





# 0.6.0 (2019-02-03)


### Bug Fixes

* **apache-composer:** app create -r waits for all actions being successfully deployed ([49e1e2f](https://github.com/starpit/kui/commit/49e1e2f)), closes [#269](https://github.com/starpit/kui/issues/269)
* fixes for auth in browser+proxy mode ([a441c33](https://github.com/starpit/kui/commit/a441c33)), closes [#287](https://github.com/starpit/kui/issues/287) [#286](https://github.com/starpit/kui/issues/286) [#289](https://github.com/starpit/kui/issues/289)
* **apache-composer:** compose yoyo -t [@demos](https://github.com/demos)/if.js broken in webpack mode ([14ac816](https://github.com/starpit/kui/commit/14ac816)), closes [#332](https://github.com/starpit/kui/issues/332)
* **apache-composer:** help editor find openwhisk-composer module by moving appModulePath to apache-composer preload ([871c2b8](https://github.com/starpit/kui/commit/871c2b8)), closes [#317](https://github.com/starpit/kui/issues/317)
* **apache-composer:** parse error handler of compose will check error casue to avoid decorating error not ENOPARSE ([d9e5598](https://github.com/starpit/kui/commit/d9e5598)), closes [#324](https://github.com/starpit/kui/issues/324)
* **apache-composer:** remove app create -r ([af0a428](https://github.com/starpit/kui/commit/af0a428)), closes [#316](https://github.com/starpit/kui/issues/316) [#318](https://github.com/starpit/kui/issues/318)
* **wskflow:** fix for preview [@demos](https://github.com/demos) in webpack mode ([adc685f](https://github.com/starpit/kui/commit/adc685f)), closes [#329](https://github.com/starpit/kui/issues/329)
* proxy package and plugin have improper package.json ([d6f474d](https://github.com/starpit/kui/commit/d6f474d)), closes [#355](https://github.com/starpit/kui/issues/355)


### Features

* kuiproxy ([530c278](https://github.com/starpit/kui/commit/530c278)), closes [#266](https://github.com/starpit/kui/issues/266) [#278](https://github.com/starpit/kui/issues/278) [#279](https://github.com/starpit/kui/issues/279)
