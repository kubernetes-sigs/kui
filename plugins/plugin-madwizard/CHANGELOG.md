# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [13.1.4](https://github.com/IBM/kui/compare/v13.1.3...v13.1.4) (2023-04-20)

**Note:** Version bump only for package @kui-shell/plugin-madwizard





## [13.1.3](https://github.com/IBM/kui/compare/v13.1.2...v13.1.3) (2023-03-25)

**Note:** Version bump only for package @kui-shell/plugin-madwizard





## [13.1.2](https://github.com/IBM/kui/compare/v13.1.1...v13.1.2) (2023-03-25)

**Note:** Version bump only for package @kui-shell/plugin-madwizard





## [13.1.1](https://github.com/IBM/kui/compare/v13.1.0...v13.1.1) (2023-02-22)


### Bug Fixes

* allow clients to pass through appName to madwizard controller ([91fa031](https://github.com/IBM/kui/commit/91fa031))
* bump madwizard to pick up security fix ([539ec21](https://github.com/IBM/kui/commit/539ec21))
* bump to madwizard v6 ([e2592ed](https://github.com/IBM/kui/commit/e2592ed))
* doMadwizard does not properly pass through profile subcommands ([a7bbb10](https://github.com/IBM/kui/commit/a7bbb10))
* doMadwizard should pass through `appVersion` option ([0149eaf](https://github.com/IBM/kui/commit/0149eaf))
* doMadwizard was not passing through -h/-v ([cb64017](https://github.com/IBM/kui/commit/cb64017))
* ugh, we were not passing through appVersion to madwizard ([3d5f4f9](https://github.com/IBM/kui/commit/3d5f4f9))





# [13.1.0](https://github.com/IBM/kui/compare/v4.5.0...v13.1.0) (2023-02-03)


### Bug Fixes

* <Ask/> descriptions can have odd prefix whitespace ([8575a9d](https://github.com/IBM/kui/commit/8575a9d))
* <Playground/> may not execute correct command line ([1ba1046](https://github.com/IBM/kui/commit/1ba1046))
* <ProfileExplorer/> edit button does not restart terminal with desired guidebook ([b8ae00a](https://github.com/IBM/kui/commit/b8ae00a))
* AskingTerminal can drop chunks coming from madwizard over raw stdout ([2f06f3c](https://github.com/IBM/kui/commit/2f06f3c))
* AskingTerminal does not reset allotment sizes when restarting guidebook ([e194acf](https://github.com/IBM/kui/commit/e194acf))
* bump guidebook store and madwizard; pick up fixes for imagePullSecret ([06fd6e1](https://github.com/IBM/kui/commit/06fd6e1))
* bump guidebook store to pick up cgroup v2 fix ([00cc3d1](https://github.com/IBM/kui/commit/00cc3d1))
* bump madwizard -> 4.7.0 to pick up removal of dependence on readline ([9e8d6b3](https://github.com/IBM/kui/commit/9e8d6b3))
* bump madwizard 2.5.2 -> 2.5.3 to pick up choice string expansion fix ([f5e5341](https://github.com/IBM/kui/commit/f5e5341))
* bump madwizard 4.0.1->4.0.2 to pick up interactive bug fix ([bd778a5](https://github.com/IBM/kui/commit/bd778a5))
* bump madwizard 4.0.2 -> 4.0.3 to pick up ray job stop fix ([04fe533](https://github.com/IBM/kui/commit/04fe533))
* bump madwizard 5.0.3 to pick up support for recognizing madwizard-internal shell.execs ([ce4c5d7](https://github.com/IBM/kui/commit/ce4c5d7))
* bump madwizard 5.0.4 to pick up expanded handle-by-client exec ([c9abb91](https://github.com/IBM/kui/commit/c9abb91))
* bump store 1.11.2 -> 1.11.3 to pick up improvements to exposition ([e5d8a25](https://github.com/IBM/kui/commit/e5d8a25))
* bump to madwizard 5.0.5 to pick up shell exec updates ([2df6554](https://github.com/IBM/kui/commit/2df6554))
* flip plugin-madwizard to public npm ([e1ff5ab](https://github.com/IBM/kui/commit/e1ff5ab))
* guidebook store env var not properly passed through ([c114730](https://github.com/IBM/kui/commit/c114730))
* make sure to import node:readline, and get rid of npm readline dep ([09f5c8d](https://github.com/IBM/kui/commit/09f5c8d))
* plan command does not work, due to registration as /madwizard/plan ([58a637f](https://github.com/IBM/kui/commit/58a637f))
* Playground should have a min height in non-maximized blocks ([05ecfc4](https://github.com/IBM/kui/commit/05ecfc4))
* Playground Terminal may not fill vertical space ([420ffa4](https://github.com/IBM/kui/commit/420ffa4))
* PlaygroundTerminal should skip  responses ([a6dd65f](https://github.com/IBM/kui/commit/a6dd65f))
* plugin-madwizard should not load notebook vfs in headless ([561ff4a](https://github.com/IBM/kui/commit/561ff4a))
* plugin-madwizard's Terminal component does not pull in base xterm.scss ([f82249d](https://github.com/IBM/kui/commit/f82249d))
* regressions for preloads in headless mode ([3d55061](https://github.com/IBM/kui/commit/3d55061))
* remove dependence of at-guidebooks/store ([e3a4679](https://github.com/IBM/kui/commit/e3a4679))
* remove needle dependence from plugin-madwizard ([340cce9](https://github.com/IBM/kui/commit/340cce9))
* small optimization for Ask's use of Markdown ([2d73fe3](https://github.com/IBM/kui/commit/2d73fe3))
* update to madwizard 5 to pick up support for shell.exec richer return types ([1103695](https://github.com/IBM/kui/commit/1103695))
* update to new phrasing of 'prior choice' ([f840c84](https://github.com/IBM/kui/commit/f840c84))


### Features

* add textual guidebook playground ([185eb06](https://github.com/IBM/kui/commit/185eb06))
* improve support for running madwizard Playground in an offline browser ([a829f94](https://github.com/IBM/kui/commit/a829f94))
* improve support for showing Playground over a given filepath ([c3ce6aa](https://github.com/IBM/kui/commit/c3ce6aa))
* integrate plugin-madwizard ([78b1e3b](https://github.com/IBM/kui/commit/78b1e3b))
* madwizard playground ([4b6b257](https://github.com/IBM/kui/commit/4b6b257))





# [13.0.0](https://github.com/IBM/kui/compare/v4.5.0...v13.0.0) (2023-01-13)


### Bug Fixes

* AskingTerminal can drop chunks coming from madwizard over raw stdout ([2f06f3c](https://github.com/IBM/kui/commit/2f06f3c))
* AskingTerminal does not reset allotment sizes when restarting guidebook ([e194acf](https://github.com/IBM/kui/commit/e194acf))
* bump guidebook store and madwizard; pick up fixes for imagePullSecret ([06fd6e1](https://github.com/IBM/kui/commit/06fd6e1))
* bump guidebook store to pick up cgroup v2 fix ([00cc3d1](https://github.com/IBM/kui/commit/00cc3d1))
* bump madwizard 2.5.2 -> 2.5.3 to pick up choice string expansion fix ([f5e5341](https://github.com/IBM/kui/commit/f5e5341))
* bump madwizard 4.0.1->4.0.2 to pick up interactive bug fix ([bd778a5](https://github.com/IBM/kui/commit/bd778a5))
* bump madwizard 4.0.2 -> 4.0.3 to pick up ray job stop fix ([04fe533](https://github.com/IBM/kui/commit/04fe533))
* bump store 1.11.2 -> 1.11.3 to pick up improvements to exposition ([e5d8a25](https://github.com/IBM/kui/commit/e5d8a25))
* flip plugin-madwizard to public npm ([e1ff5ab](https://github.com/IBM/kui/commit/e1ff5ab))
* guidebook store env var not properly passed through ([c114730](https://github.com/IBM/kui/commit/c114730))
* plan command does not work, due to registration as /madwizard/plan ([58a637f](https://github.com/IBM/kui/commit/58a637f))
* plugin-madwizard should not load notebook vfs in headless ([561ff4a](https://github.com/IBM/kui/commit/561ff4a))
* remove dependence of at-guidebooks/store ([e3a4679](https://github.com/IBM/kui/commit/e3a4679))
* small optimization for Ask's use of Markdown ([2d73fe3](https://github.com/IBM/kui/commit/2d73fe3))
* update to new phrasing of 'prior choice' ([f840c84](https://github.com/IBM/kui/commit/f840c84))


### Features

* integrate plugin-madwizard ([78b1e3b](https://github.com/IBM/kui/commit/78b1e3b))
* madwizard playground ([4b6b257](https://github.com/IBM/kui/commit/4b6b257))
