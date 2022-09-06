# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [12.0.0](https://github.com/IBM/kui/compare/v4.5.0...v12.0.0) (2022-09-06)

### Bug Fixes

- dockerized proxy installs incorrect version of node-pty ([f1d53bb](https://github.com/IBM/kui/commit/f1d53bb))
- remove ancient non-KUI_HEADLESS_WEBPACK support ([0dbbc3e](https://github.com/IBM/kui/commit/0dbbc3e))
- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** Docker builds broken after recent update to node:12-bullseye-slim update ([a1b74a4](https://github.com/IBM/kui/commit/a1b74a4)), closes [#8083](https://github.com/IBM/kui/issues/8083)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** dockerized kui may fail with permissions denied on the nginx directories ([2bcf8bd](https://github.com/IBM/kui/commit/2bcf8bd)), closes [#7658](https://github.com/IBM/kui/issues/7658)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- **packages/proxy:** proxy does not properly run in external clients ([168fb3f](https://github.com/IBM/kui/commit/168fb3f))
- **packages/proxy:** signedCookie not a function ([9e89138](https://github.com/IBM/kui/commit/9e89138))
- **plugins/plugin-bash-like:** cd /tmp && ... does not handle streaming ([b78ba53](https://github.com/IBM/kui/commit/b78ba53))
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)

### Features

- **packages/proxy:** add curl, sed, and git to the kuishell/kui image ([e61d749](https://github.com/IBM/kui/commit/e61d749))
- **packages/proxy:** add iter8ctl to the docker base image ([625f352](https://github.com/IBM/kui/commit/625f352)), closes [#8000](https://github.com/IBM/kui/issues/8000)
- **packages/proxy:** dockerized kui hard-wires ContentSecurityPolicy ([efd20b2](https://github.com/IBM/kui/commit/efd20b2)), closes [#8055](https://github.com/IBM/kui/issues/8055)
- **packages/proxy:** pass through KUI\_ env vars from proxy container to user ([cb0c729](https://github.com/IBM/kui/commit/cb0c729)), closes [#8120](https://github.com/IBM/kui/issues/8120)
- Add support to Kui proxy for pre-shared-key authorization ([2412a72](https://github.com/IBM/kui/commit/2412a72)), closes [#7772](https://github.com/IBM/kui/issues/7772)
- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

### BREAKING CHANGES

- this removes all support for running kui from non-webpack headless

# [11.4.0](https://github.com/IBM/kui/compare/v4.5.0...v11.4.0) (2022-02-25)

### Bug Fixes

- dockerized proxy installs incorrect version of node-pty ([f1d53bb](https://github.com/IBM/kui/commit/f1d53bb))
- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** Docker builds broken after recent update to node:12-bullseye-slim update ([a1b74a4](https://github.com/IBM/kui/commit/a1b74a4)), closes [#8083](https://github.com/IBM/kui/issues/8083)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** dockerized kui may fail with permissions denied on the nginx directories ([2bcf8bd](https://github.com/IBM/kui/commit/2bcf8bd)), closes [#7658](https://github.com/IBM/kui/issues/7658)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- **packages/proxy:** proxy does not properly run in external clients ([168fb3f](https://github.com/IBM/kui/commit/168fb3f))
- **packages/proxy:** signedCookie not a function ([9e89138](https://github.com/IBM/kui/commit/9e89138))
- **plugins/plugin-bash-like:** cd /tmp && ... does not handle streaming ([b78ba53](https://github.com/IBM/kui/commit/b78ba53))
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)

### Features

- **packages/proxy:** add curl, sed, and git to the kuishell/kui image ([e61d749](https://github.com/IBM/kui/commit/e61d749))
- **packages/proxy:** add iter8ctl to the docker base image ([625f352](https://github.com/IBM/kui/commit/625f352)), closes [#8000](https://github.com/IBM/kui/issues/8000)
- **packages/proxy:** dockerized kui hard-wires ContentSecurityPolicy ([efd20b2](https://github.com/IBM/kui/commit/efd20b2)), closes [#8055](https://github.com/IBM/kui/issues/8055)
- **packages/proxy:** pass through KUI\_ env vars from proxy container to user ([cb0c729](https://github.com/IBM/kui/commit/cb0c729)), closes [#8120](https://github.com/IBM/kui/issues/8120)
- Add support to Kui proxy for pre-shared-key authorization ([2412a72](https://github.com/IBM/kui/commit/2412a72)), closes [#7772](https://github.com/IBM/kui/issues/7772)
- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [11.3.0](https://github.com/IBM/kui/compare/v4.5.0...v11.3.0) (2022-02-22)

### Bug Fixes

- dockerized proxy installs incorrect version of node-pty ([f1d53bb](https://github.com/IBM/kui/commit/f1d53bb))
- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** Docker builds broken after recent update to node:12-bullseye-slim update ([a1b74a4](https://github.com/IBM/kui/commit/a1b74a4)), closes [#8083](https://github.com/IBM/kui/issues/8083)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** dockerized kui may fail with permissions denied on the nginx directories ([2bcf8bd](https://github.com/IBM/kui/commit/2bcf8bd)), closes [#7658](https://github.com/IBM/kui/issues/7658)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- **packages/proxy:** proxy does not properly run in external clients ([168fb3f](https://github.com/IBM/kui/commit/168fb3f))
- **packages/proxy:** signedCookie not a function ([9e89138](https://github.com/IBM/kui/commit/9e89138))
- **plugins/plugin-bash-like:** cd /tmp && ... does not handle streaming ([b78ba53](https://github.com/IBM/kui/commit/b78ba53))
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)

### Features

- **packages/proxy:** add curl, sed, and git to the kuishell/kui image ([e61d749](https://github.com/IBM/kui/commit/e61d749))
- **packages/proxy:** add iter8ctl to the docker base image ([625f352](https://github.com/IBM/kui/commit/625f352)), closes [#8000](https://github.com/IBM/kui/issues/8000)
- **packages/proxy:** dockerized kui hard-wires ContentSecurityPolicy ([efd20b2](https://github.com/IBM/kui/commit/efd20b2)), closes [#8055](https://github.com/IBM/kui/issues/8055)
- **packages/proxy:** pass through KUI\_ env vars from proxy container to user ([cb0c729](https://github.com/IBM/kui/commit/cb0c729)), closes [#8120](https://github.com/IBM/kui/issues/8120)
- Add support to Kui proxy for pre-shared-key authorization ([2412a72](https://github.com/IBM/kui/commit/2412a72)), closes [#7772](https://github.com/IBM/kui/issues/7772)
- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [11.2.0](https://github.com/IBM/kui/compare/v4.5.0...v11.2.0) (2022-02-09)

### Bug Fixes

- dockerized proxy installs incorrect version of node-pty ([f1d53bb](https://github.com/IBM/kui/commit/f1d53bb))
- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** Docker builds broken after recent update to node:12-bullseye-slim update ([a1b74a4](https://github.com/IBM/kui/commit/a1b74a4)), closes [#8083](https://github.com/IBM/kui/issues/8083)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** dockerized kui may fail with permissions denied on the nginx directories ([2bcf8bd](https://github.com/IBM/kui/commit/2bcf8bd)), closes [#7658](https://github.com/IBM/kui/issues/7658)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- **packages/proxy:** proxy does not properly run in external clients ([168fb3f](https://github.com/IBM/kui/commit/168fb3f))
- **packages/proxy:** signedCookie not a function ([9e89138](https://github.com/IBM/kui/commit/9e89138))
- **plugins/plugin-bash-like:** cd /tmp && ... does not handle streaming ([b78ba53](https://github.com/IBM/kui/commit/b78ba53))
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)

### Features

- **packages/proxy:** add curl, sed, and git to the kuishell/kui image ([e61d749](https://github.com/IBM/kui/commit/e61d749))
- **packages/proxy:** add iter8ctl to the docker base image ([625f352](https://github.com/IBM/kui/commit/625f352)), closes [#8000](https://github.com/IBM/kui/issues/8000)
- **packages/proxy:** dockerized kui hard-wires ContentSecurityPolicy ([efd20b2](https://github.com/IBM/kui/commit/efd20b2)), closes [#8055](https://github.com/IBM/kui/issues/8055)
- **packages/proxy:** pass through KUI\_ env vars from proxy container to user ([cb0c729](https://github.com/IBM/kui/commit/cb0c729)), closes [#8120](https://github.com/IBM/kui/issues/8120)
- Add support to Kui proxy for pre-shared-key authorization ([2412a72](https://github.com/IBM/kui/commit/2412a72)), closes [#7772](https://github.com/IBM/kui/issues/7772)
- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [11.1.0](https://github.com/IBM/kui/compare/v4.5.0...v11.1.0) (2022-01-24)

### Bug Fixes

- dockerized proxy installs incorrect version of node-pty ([f1d53bb](https://github.com/IBM/kui/commit/f1d53bb))
- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** Docker builds broken after recent update to node:12-bullseye-slim update ([a1b74a4](https://github.com/IBM/kui/commit/a1b74a4)), closes [#8083](https://github.com/IBM/kui/issues/8083)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** dockerized kui may fail with permissions denied on the nginx directories ([2bcf8bd](https://github.com/IBM/kui/commit/2bcf8bd)), closes [#7658](https://github.com/IBM/kui/issues/7658)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- **packages/proxy:** proxy does not properly run in external clients ([168fb3f](https://github.com/IBM/kui/commit/168fb3f))
- **packages/proxy:** signedCookie not a function ([9e89138](https://github.com/IBM/kui/commit/9e89138))
- **plugins/plugin-bash-like:** cd /tmp && ... does not handle streaming ([b78ba53](https://github.com/IBM/kui/commit/b78ba53))
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)

### Features

- **packages/proxy:** add curl, sed, and git to the kuishell/kui image ([e61d749](https://github.com/IBM/kui/commit/e61d749))
- **packages/proxy:** add iter8ctl to the docker base image ([625f352](https://github.com/IBM/kui/commit/625f352)), closes [#8000](https://github.com/IBM/kui/issues/8000)
- **packages/proxy:** dockerized kui hard-wires ContentSecurityPolicy ([efd20b2](https://github.com/IBM/kui/commit/efd20b2)), closes [#8055](https://github.com/IBM/kui/issues/8055)
- **packages/proxy:** pass through KUI\_ env vars from proxy container to user ([cb0c729](https://github.com/IBM/kui/commit/cb0c729)), closes [#8120](https://github.com/IBM/kui/issues/8120)
- Add support to Kui proxy for pre-shared-key authorization ([2412a72](https://github.com/IBM/kui/commit/2412a72)), closes [#7772](https://github.com/IBM/kui/issues/7772)
- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [11.0.0](https://github.com/IBM/kui/compare/v4.5.0...v11.0.0) (2022-01-18)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** Docker builds broken after recent update to node:12-bullseye-slim update ([a1b74a4](https://github.com/IBM/kui/commit/a1b74a4)), closes [#8083](https://github.com/IBM/kui/issues/8083)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** dockerized kui may fail with permissions denied on the nginx directories ([2bcf8bd](https://github.com/IBM/kui/commit/2bcf8bd)), closes [#7658](https://github.com/IBM/kui/issues/7658)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- **packages/proxy:** proxy does not properly run in external clients ([168fb3f](https://github.com/IBM/kui/commit/168fb3f))
- **packages/proxy:** signedCookie not a function ([9e89138](https://github.com/IBM/kui/commit/9e89138))
- **plugins/plugin-bash-like:** cd /tmp && ... does not handle streaming ([b78ba53](https://github.com/IBM/kui/commit/b78ba53))
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)

### Features

- **packages/proxy:** add curl, sed, and git to the kuishell/kui image ([e61d749](https://github.com/IBM/kui/commit/e61d749))
- **packages/proxy:** add iter8ctl to the docker base image ([625f352](https://github.com/IBM/kui/commit/625f352)), closes [#8000](https://github.com/IBM/kui/issues/8000)
- **packages/proxy:** dockerized kui hard-wires ContentSecurityPolicy ([efd20b2](https://github.com/IBM/kui/commit/efd20b2)), closes [#8055](https://github.com/IBM/kui/issues/8055)
- **packages/proxy:** pass through KUI\_ env vars from proxy container to user ([cb0c729](https://github.com/IBM/kui/commit/cb0c729)), closes [#8120](https://github.com/IBM/kui/issues/8120)
- Add support to Kui proxy for pre-shared-key authorization ([2412a72](https://github.com/IBM/kui/commit/2412a72)), closes [#7772](https://github.com/IBM/kui/issues/7772)
- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [10.7.0](https://github.com/IBM/kui/compare/v4.5.0...v10.7.0) (2021-10-12)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** Docker builds broken after recent update to node:12-bullseye-slim update ([a1b74a4](https://github.com/IBM/kui/commit/a1b74a4)), closes [#8083](https://github.com/IBM/kui/issues/8083)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** dockerized kui may fail with permissions denied on the nginx directories ([2bcf8bd](https://github.com/IBM/kui/commit/2bcf8bd)), closes [#7658](https://github.com/IBM/kui/issues/7658)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- **packages/proxy:** signedCookie not a function ([9e89138](https://github.com/IBM/kui/commit/9e89138))
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- **packages/proxy:** add curl, sed, and git to the kuishell/kui image ([e61d749](https://github.com/IBM/kui/commit/e61d749))
- **packages/proxy:** add iter8ctl to the docker base image ([625f352](https://github.com/IBM/kui/commit/625f352)), closes [#8000](https://github.com/IBM/kui/issues/8000)
- **packages/proxy:** dockerized kui hard-wires ContentSecurityPolicy ([efd20b2](https://github.com/IBM/kui/commit/efd20b2)), closes [#8055](https://github.com/IBM/kui/issues/8055)
- **packages/proxy:** pass through KUI\_ env vars from proxy container to user ([cb0c729](https://github.com/IBM/kui/commit/cb0c729)), closes [#8120](https://github.com/IBM/kui/issues/8120)
- Add support to Kui proxy for pre-shared-key authorization ([2412a72](https://github.com/IBM/kui/commit/2412a72)), closes [#7772](https://github.com/IBM/kui/issues/7772)
- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [10.6.0](https://github.com/IBM/kui/compare/v4.5.0...v10.6.0) (2021-09-27)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** dockerized kui may fail with permissions denied on the nginx directories ([2bcf8bd](https://github.com/IBM/kui/commit/2bcf8bd)), closes [#7658](https://github.com/IBM/kui/issues/7658)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- **packages/proxy:** signedCookie not a function ([9e89138](https://github.com/IBM/kui/commit/9e89138))
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- **packages/proxy:** add iter8ctl to the docker base image ([625f352](https://github.com/IBM/kui/commit/625f352)), closes [#8000](https://github.com/IBM/kui/issues/8000)
- **packages/proxy:** dockerized kui hard-wires ContentSecurityPolicy ([efd20b2](https://github.com/IBM/kui/commit/efd20b2)), closes [#8055](https://github.com/IBM/kui/issues/8055)
- Add support to Kui proxy for pre-shared-key authorization ([2412a72](https://github.com/IBM/kui/commit/2412a72)), closes [#7772](https://github.com/IBM/kui/issues/7772)
- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [10.5.0](https://github.com/IBM/kui/compare/v4.5.0...v10.5.0) (2021-09-13)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** dockerized kui may fail with permissions denied on the nginx directories ([2bcf8bd](https://github.com/IBM/kui/commit/2bcf8bd)), closes [#7658](https://github.com/IBM/kui/issues/7658)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- **packages/proxy:** signedCookie not a function ([9e89138](https://github.com/IBM/kui/commit/9e89138))
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- Add support to Kui proxy for pre-shared-key authorization ([2412a72](https://github.com/IBM/kui/commit/2412a72)), closes [#7772](https://github.com/IBM/kui/issues/7772)
- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** docker+proxy build fails ([37e5d6a](https://github.com/IBM/kui/commit/37e5d6a)), closes [#7639](https://github.com/IBM/kui/issues/7639)
- **packages/proxy:** nginx+kui docker container should run nginx on non-privileged port ([b24416c](https://github.com/IBM/kui/commit/b24416c)), closes [#7643](https://github.com/IBM/kui/issues/7643)
- in browser+proxy mode, initial directory is / but \$HOME shows the correct value ([648a2fe](https://github.com/IBM/kui/commit/648a2fe)), closes [#7467](https://github.com/IBM/kui/issues/7467)
- **packages/proxy:** kui-build-docker-with-proxy has several bugs ([eeb21dc](https://github.com/IBM/kui/commit/eeb21dc)), closes [#7085](https://github.com/IBM/kui/issues/7085)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- **packages/proxy:** oc does not work in kui-build-docker-with-proxy image ([b0460b8](https://github.com/IBM/kui/commit/b0460b8)), closes [#7088](https://github.com/IBM/kui/issues/7088)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/proxy

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- **packages/proxy:** kui-build-proxy-with-docker fails if dist/webpack directory does not exist ([689b015](https://github.com/IBM/kui/commit/689b015)), closes [#5728](https://github.com/IBM/kui/issues/5728)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.12.0](https://github.com/IBM/kui/compare/v4.5.0...v8.12.0) (2020-08-20)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.11.0](https://github.com/IBM/kui/compare/v4.5.0...v8.11.0) (2020-07-21)

### Bug Fixes

- **packages/builder:** fixes for building kui on windows ([7b636cc](https://github.com/IBM/kui/commit/7b636cc)), closes [#4920](https://github.com/IBM/kui/issues/4920)
- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.10.0](https://github.com/IBM/kui/compare/v4.5.0...v8.10.0) (2020-06-17)

### Bug Fixes

- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.9.0](https://github.com/IBM/kui/compare/v4.5.0...v8.9.0) (2020-06-09)

### Bug Fixes

- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.7.0](https://github.com/IBM/kui/compare/v4.5.0...v8.7.0) (2020-05-08)

### Bug Fixes

- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [8.6.1](https://github.com/IBM/kui/compare/v4.5.0...v8.6.1) (2020-04-25)

### Bug Fixes

- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.6.0](https://github.com/IBM/kui/compare/v4.5.0...v8.6.0) (2020-04-23)

### Bug Fixes

- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.5.0](https://github.com/IBM/kui/compare/v4.5.0...v8.5.0) (2020-04-19)

### Bug Fixes

- simplify handling of opengraph META ([ff3c0de](https://github.com/IBM/kui/commit/ff3c0de)), closes [#4288](https://github.com/IBM/kui/issues/4288)
- **packages/proxy:** proxy docker container needs style-src: 'unsafe-inline' ([89c33e2](https://github.com/IBM/kui/commit/89c33e2)), closes [#4261](https://github.com/IBM/kui/issues/4261)
- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [8.4.2](https://github.com/IBM/kui/compare/v4.5.0...v8.4.2) (2020-04-10)

### Bug Fixes

- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- proxy nginx should support serving gzip_static content ([f592fc7](https://github.com/IBM/kui/commit/f592fc7)), closes [#4252](https://github.com/IBM/kui/issues/4252)
- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [8.4.1](https://github.com/IBM/kui/compare/v4.5.0...v8.4.1) (2020-04-10)

### Bug Fixes

- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.4.0](https://github.com/IBM/kui/compare/v4.5.0...v8.4.0) (2020-04-10)

### Bug Fixes

- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- simplified co-hosting of client and proxy in a container ([00af4b4](https://github.com/IBM/kui/commit/00af4b4)), closes [#4213](https://github.com/IBM/kui/issues/4213)
- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.1.0](https://github.com/IBM/kui/compare/v4.5.0...v8.1.0) (2020-04-04)

### Bug Fixes

- proxy still runs http-allocate-cert even if NO_DOCKER is set ([5267e52](https://github.com/IBM/kui/commit/5267e52)), closes [#4137](https://github.com/IBM/kui/issues/4137)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [8.0.0](https://github.com/IBM/kui/compare/v4.5.0...v8.0.0) (2020-03-20)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [6.0.12](https://github.com/IBM/kui/compare/v6.0.11...v6.0.12) (2020-02-03)

**Note:** Version bump only for package @kui-shell/proxy

## [6.0.11](https://github.com/IBM/kui/compare/v6.0.10...v6.0.11) (2020-02-03)

**Note:** Version bump only for package @kui-shell/proxy

## [6.0.10](https://github.com/IBM/kui/compare/v6.0.9...v6.0.10) (2020-02-01)

**Note:** Version bump only for package @kui-shell/proxy

## [6.0.9](https://github.com/IBM/kui/compare/v6.0.8...v6.0.9) (2020-01-31)

**Note:** Version bump only for package @kui-shell/proxy

## [6.0.8](https://github.com/IBM/kui/compare/v4.5.0...v6.0.8) (2020-01-30)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [6.0.7](https://github.com/IBM/kui/compare/v4.5.0...v6.0.7) (2020-01-30)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [6.0.6](https://github.com/IBM/kui/compare/v4.5.0...v6.0.6) (2020-01-30)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [6.0.5](https://github.com/IBM/kui/compare/v4.5.0...v6.0.5) (2020-01-29)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [6.0.4](https://github.com/IBM/kui/compare/v6.0.3...v6.0.4) (2020-01-28)

**Note:** Version bump only for package @kui-shell/proxy

## [6.0.3](https://github.com/IBM/kui/compare/v4.5.0...v6.0.3) (2020-01-28)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [6.0.2](https://github.com/IBM/kui/compare/v4.5.0...v6.0.2) (2020-01-28)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

## [6.0.1](https://github.com/IBM/kui/compare/v4.5.0...v6.0.1) (2020-01-28)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [6.0.0](https://github.com/IBM/kui/compare/v4.5.0...v6.0.0) (2020-01-27)

### Features

- support generating es6 modules ([c1ed680](https://github.com/IBM/kui/commit/c1ed680)), closes [#2431](https://github.com/IBM/kui/issues/2431)

# [5.1.0](https://github.com/IBM/kui/compare/v4.5.0...v5.1.0) (2019-10-11)

**Note:** Version bump only for package @kui-shell/proxy

# [5.0.0](https://github.com/IBM/kui/compare/v4.5.0...v5.0.0) (2019-10-03)

**Note:** Version bump only for package @kui-shell/proxy
