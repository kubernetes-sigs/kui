# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
