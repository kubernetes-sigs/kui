# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.34.0 (2019-06-17)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)
- webpack+proxy versus pty ([0f8a19a](https://github.com/IBM/kui/commit/0f8a19a)), closes [#1170](https://github.com/IBM/kui/issues/1170)
- **packages/proxy:** proxy build fails for non-bluemix, non-kubernetes users ([2a70aae](https://github.com/IBM/kui/commit/2a70aae)), closes [#1647](https://github.com/IBM/kui/issues/1647)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow PTY websockets to piggyback on an existing https server ([4aeced5](https://github.com/IBM/kui/commit/4aeced5)), closes [#1183](https://github.com/IBM/kui/issues/1183)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.33.0 (2019-05-22)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)
- webpack+proxy versus pty ([0f8a19a](https://github.com/IBM/kui/commit/0f8a19a)), closes [#1170](https://github.com/IBM/kui/issues/1170)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow PTY websockets to piggyback on an existing https server ([4aeced5](https://github.com/IBM/kui/commit/4aeced5)), closes [#1183](https://github.com/IBM/kui/issues/1183)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.32.0 (2019-05-08)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- webpack versus editor ([956a72f](https://github.com/IBM/kui/commit/956a72f)), closes [#1333](https://github.com/IBM/kui/issues/1333)
- webpack+proxy versus pty ([0f8a19a](https://github.com/IBM/kui/commit/0f8a19a)), closes [#1170](https://github.com/IBM/kui/issues/1170)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow PTY websockets to piggyback on an existing https server ([4aeced5](https://github.com/IBM/kui/commit/4aeced5)), closes [#1183](https://github.com/IBM/kui/issues/1183)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.31.0 (2019-05-07)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- webpack+proxy versus pty ([0f8a19a](https://github.com/IBM/kui/commit/0f8a19a)), closes [#1170](https://github.com/IBM/kui/issues/1170)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow PTY websockets to piggyback on an existing https server ([4aeced5](https://github.com/IBM/kui/commit/4aeced5)), closes [#1183](https://github.com/IBM/kui/issues/1183)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.30.0 (2019-05-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- webpack+proxy versus pty ([0f8a19a](https://github.com/IBM/kui/commit/0f8a19a)), closes [#1170](https://github.com/IBM/kui/issues/1170)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow PTY websockets to piggyback on an existing https server ([4aeced5](https://github.com/IBM/kui/commit/4aeced5)), closes [#1183](https://github.com/IBM/kui/issues/1183)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.29.0 (2019-05-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- webpack+proxy versus pty ([0f8a19a](https://github.com/IBM/kui/commit/0f8a19a)), closes [#1170](https://github.com/IBM/kui/issues/1170)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow PTY websockets to piggyback on an existing https server ([4aeced5](https://github.com/IBM/kui/commit/4aeced5)), closes [#1183](https://github.com/IBM/kui/issues/1183)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.28.0 (2019-05-04)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- webpack+proxy versus pty ([0f8a19a](https://github.com/IBM/kui/commit/0f8a19a)), closes [#1170](https://github.com/IBM/kui/issues/1170)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow PTY websockets to piggyback on an existing https server ([4aeced5](https://github.com/IBM/kui/commit/4aeced5)), closes [#1183](https://github.com/IBM/kui/issues/1183)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.27.0 (2019-04-26)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- webpack+proxy versus pty ([0f8a19a](https://github.com/IBM/kui/commit/0f8a19a)), closes [#1170](https://github.com/IBM/kui/issues/1170)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow PTY websockets to piggyback on an existing https server ([4aeced5](https://github.com/IBM/kui/commit/4aeced5)), closes [#1183](https://github.com/IBM/kui/issues/1183)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.26.0 (2019-04-23)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- webpack+proxy versus pty ([0f8a19a](https://github.com/IBM/kui/commit/0f8a19a)), closes [#1170](https://github.com/IBM/kui/issues/1170)

### Features

- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)
- allow PTY websockets to piggyback on an existing https server ([4aeced5](https://github.com/IBM/kui/commit/4aeced5)), closes [#1183](https://github.com/IBM/kui/issues/1183)
- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)

# 0.25.0 (2019-04-10)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.24.0 (2019-03-19)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.23.0 (2019-03-19)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **packages/proxy:** fix the issue that external proxy build can't find .keys ([a753abb](https://github.com/IBM/kui/commit/a753abb)), closes [#857](https://github.com/IBM/kui/issues/857)
- **packages/proxy:** send error from proxy in case that error.message is not defined ([863a531](https://github.com/IBM/kui/commit/863a531)), closes [#867](https://github.com/IBM/kui/issues/867)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.22.0 (2019-03-10)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.21.0 (2019-03-10)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.20.0 (2019-03-10)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.19.0 (2019-03-09)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.18.0 (2019-03-08)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.17.0 (2019-03-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.16.0 (2019-03-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.15.0 (2019-03-06)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.14.0 (2019-02-28)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.13.0 (2019-02-28)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **plugins/plugin-k8s:** support a gamut of helm client versions in proxy ([abc00d8](https://github.com/IBM/kui/commit/abc00d8)), closes [#570](https://github.com/IBM/kui/issues/570)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.12.0 (2019-02-27)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.11.0 (2019-02-22)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.10.0 (2019-02-21)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.9.0 (2019-02-21)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

## 0.8.1 (2019-02-20)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.8.0 (2019-02-20)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.7.0 (2019-02-19)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.6.0 (2019-02-13)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)
- **kui-builder:** improve webpack building process for external clients ([14763ca](https://github.com/IBM/kui/commit/14763ca)), closes [#433](https://github.com/IBM/kui/issues/433)
- **proxy:** improve support for building proxy server from an external custom client ([177fac8](https://github.com/IBM/kui/commit/177fac8)), closes [#438](https://github.com/IBM/kui/issues/438)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.5.0 (2019-02-04)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.4.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.3.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.2.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/IBM/kui/commit/a441c33)), closes [#287](https://github.com/IBM/kui/issues/287) [#286](https://github.com/IBM/kui/issues/286) [#289](https://github.com/IBM/kui/issues/289)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/IBM/kui/commit/5a31f8d)), closes [#291](https://github.com/IBM/kui/issues/291)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/IBM/kui/commit/d6f474d)), closes [#355](https://github.com/IBM/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/IBM/kui/commit/530c278)), closes [#266](https://github.com/IBM/kui/issues/266) [#278](https://github.com/IBM/kui/issues/278) [#279](https://github.com/IBM/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/IBM/kui/commit/bc65dc2)), closes [#274](https://github.com/IBM/kui/issues/274)

# 0.1.0 (2019-02-03)

### Bug Fixes

- fixes for auth in browser+proxy mode ([a441c33](https://github.com/starpit/kui/commit/a441c33)), closes [#287](https://github.com/starpit/kui/issues/287) [#286](https://github.com/starpit/kui/issues/286) [#289](https://github.com/starpit/kui/issues/289)
- **proxy:** we weren't handling execOptions undefined ([5a31f8d](https://github.com/starpit/kui/commit/5a31f8d)), closes [#291](https://github.com/starpit/kui/issues/291)
- proxy package and plugin have improper package.json ([d6f474d](https://github.com/starpit/kui/commit/d6f474d)), closes [#355](https://github.com/starpit/kui/issues/355)

### Features

- kuiproxy ([530c278](https://github.com/starpit/kui/commit/530c278)), closes [#266](https://github.com/starpit/kui/issues/266) [#278](https://github.com/starpit/kui/issues/278) [#279](https://github.com/starpit/kui/issues/279)
- **webpack:** dockerized webpack build ([bc65dc2](https://github.com/starpit/kui/commit/bc65dc2)), closes [#274](https://github.com/starpit/kui/issues/274)
