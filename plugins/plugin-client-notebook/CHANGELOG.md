# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [12.1.0](https://github.com/IBM/kui/compare/v4.5.0...v12.1.0) (2022-09-14)


### Bug Fixes

* **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
* plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
* **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
* **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
* add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
* **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
* improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
* **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
* notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
* vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)


### Features

* improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
* **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
* background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
* custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
* inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
* Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
* notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
* restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
* separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
* **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)





# [12.0.0](https://github.com/IBM/kui/compare/v4.5.0...v12.0.0) (2022-09-06)

### Bug Fixes

- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [11.4.0](https://github.com/IBM/kui/compare/v4.5.0...v11.4.0) (2022-02-25)

### Bug Fixes

- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [11.3.0](https://github.com/IBM/kui/compare/v4.5.0...v11.3.0) (2022-02-22)

### Bug Fixes

- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [11.2.0](https://github.com/IBM/kui/compare/v4.5.0...v11.2.0) (2022-02-09)

### Bug Fixes

- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [11.1.0](https://github.com/IBM/kui/compare/v4.5.0...v11.1.0) (2022-01-24)

### Bug Fixes

- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [11.0.0](https://github.com/IBM/kui/compare/v4.5.0...v11.0.0) (2022-01-18)

### Bug Fixes

- **packages/core:** Events api created and typedoc documentation generated ([531461d](https://github.com/IBM/kui/commit/531461d))
- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [10.7.0](https://github.com/IBM/kui/compare/v4.5.0...v10.7.0) (2021-10-12)

### Bug Fixes

- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [10.6.0](https://github.com/IBM/kui/compare/v4.5.0...v10.6.0) (2021-09-27)

### Bug Fixes

- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [10.5.0](https://github.com/IBM/kui/compare/v4.5.0...v10.5.0) (2021-09-13)

### Bug Fixes

- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [10.4.0](https://github.com/IBM/kui/compare/v4.5.0...v10.4.0) (2021-06-17)

### Bug Fixes

- plugin-client-notebook and plugin-client-alternate have old commandContext setting ([658bc89](https://github.com/IBM/kui/commit/658bc89)), closes [#7318](https://github.com/IBM/kui/issues/7318)
- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)
- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [10.2.0](https://github.com/IBM/kui/compare/v10.1.1-dev-20210223-062039...v10.2.0) (2021-02-24)

### Features

- improved support for commentary-from-file ([2efc70e](https://github.com/IBM/kui/commit/2efc70e)), closes [#7074](https://github.com/IBM/kui/issues/7074)
- **plugins/plugin-core-support:** replay --close-current-tab ([a6134b2](https://github.com/IBM/kui/commit/a6134b2)), closes [#5929](https://github.com/IBM/kui/issues/5929)

## [10.1.1-dev-20210223-062039](https://github.com/IBM/kui/compare/v10.1.1-dev-20210221-141404...v10.1.1-dev-20210223-062039) (2021-02-23)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210221-141404](https://github.com/IBM/kui/compare/v10.1.1-dev-20210219-194602...v10.1.1-dev-20210221-141404) (2021-02-21)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210219-194602](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-202429...v10.1.1-dev-20210219-194602) (2021-02-20)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210218-202429](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-164854...v10.1.1-dev-20210218-202429) (2021-02-19)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210218-164854](https://github.com/IBM/kui/compare/v10.1.1-dev-20210218-131731...v10.1.1-dev-20210218-164854) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210218-131731](https://github.com/IBM/kui/compare/v10.1.1-dev-20210216-094031...v10.1.1-dev-20210218-131731) (2021-02-18)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210216-094031](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-213847...v10.1.1-dev-20210216-094031) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210215-213847](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-184959...v10.1.1-dev-20210215-213847) (2021-02-16)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210215-184959](https://github.com/IBM/kui/compare/v10.1.1-dev-20210215-161454...v10.1.1-dev-20210215-184959) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210215-161454](https://github.com/IBM/kui/compare/v10.1.1-dev-20210211-145439...v10.1.1-dev-20210215-161454) (2021-02-15)

**Note:** Version bump only for package @kui-shell/plugin-client-notebooks

## [10.1.1-dev-20210211-145439](https://github.com/IBM/kui/compare/v4.5.0...v10.1.1-dev-20210211-145439) (2021-02-11)

### Bug Fixes

- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)

## [10.0.1](https://github.com/IBM/kui/compare/v4.5.0...v10.0.1) (2021-02-01)

### Bug Fixes

- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- Make PatternFly4 Light the default theme ([7d31c17](https://github.com/IBM/kui/commit/7d31c17)), closes [#6773](https://github.com/IBM/kui/issues/6773)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)

# [9.3.0](https://github.com/IBM/kui/compare/v4.5.0...v9.3.0) (2020-12-11)

### Bug Fixes

- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [9.2.0](https://github.com/IBM/kui/compare/v4.5.0...v9.2.0) (2020-11-25)

### Bug Fixes

- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [9.1.0](https://github.com/IBM/kui/compare/v4.5.0...v9.1.0) (2020-10-26)

### Bug Fixes

- **plugins/plugin-client-notebook:** github button in notebook client does not have hover effect ([a4fa6f0](https://github.com/IBM/kui/commit/a4fa6f0)), closes [#5941](https://github.com/IBM/kui/issues/5941)
- **plugins/plugin-client-notebook:** notebook client no longer needs to set an initialTabTitle ([ba2ddbf](https://github.com/IBM/kui/commit/ba2ddbf)), closes [#5919](https://github.com/IBM/kui/issues/5919)
- **plugins/plugin-client-notebook:** notebook client's version widget has a hard-wired version ([19264ce](https://github.com/IBM/kui/commit/19264ce)), closes [#5942](https://github.com/IBM/kui/issues/5942)
- add Kui version and github link to client-notebook ([7b2562a](https://github.com/IBM/kui/commit/7b2562a)), closes [#5918](https://github.com/IBM/kui/issues/5918)
- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)

# [9.0.0](https://github.com/IBM/kui/compare/v4.5.0...v9.0.0) (2020-10-08)

### Bug Fixes

- improved support for replaying splits ([8039a9d](https://github.com/IBM/kui/commit/8039a9d)), closes [#5535](https://github.com/IBM/kui/issues/5535)
- **Plugins/plugin-core-support:** support for shallow recording of notebooks ([605b0e3](https://github.com/IBM/kui/commit/605b0e3)), closes [#5529](https://github.com/IBM/kui/issues/5529)
- notebook replay should scroll to top, and not display welcome message on every tab ([7ade801](https://github.com/IBM/kui/commit/7ade801)), closes [#5515](https://github.com/IBM/kui/issues/5515) [#5516](https://github.com/IBM/kui/issues/5516)
- vfs fixes for multi-source copying and for s3 globbing ([893902e](https://github.com/IBM/kui/commit/893902e)), closes [#5511](https://github.com/IBM/kui/issues/5511)

### Features

- background new tabs ([be9f986](https://github.com/IBM/kui/commit/be9f986)), closes [#5550](https://github.com/IBM/kui/issues/5550)
- custom tab titles ([fd780df](https://github.com/IBM/kui/commit/fd780df)), closes [#5525](https://github.com/IBM/kui/issues/5525)
- inverse splits ([38d2895](https://github.com/IBM/kui/commit/38d2895)), closes [#5537](https://github.com/IBM/kui/issues/5537)
- notebook client ([4b64133](https://github.com/IBM/kui/commit/4b64133)), closes [#5501](https://github.com/IBM/kui/issues/5501)
- restore opengraph properties on index.ejs ([6e57007](https://github.com/IBM/kui/commit/6e57007)), closes [#5530](https://github.com/IBM/kui/issues/5530)
- separate out themes into a new settings Notebook ([5180759](https://github.com/IBM/kui/commit/5180759)), closes [#5605](https://github.com/IBM/kui/issues/5605)
- **plugins/plugin-client-common:** allow clients to specify initial tab title ([e8e365f](https://github.com/IBM/kui/commit/e8e365f)), closes [#5539](https://github.com/IBM/kui/issues/5539)
