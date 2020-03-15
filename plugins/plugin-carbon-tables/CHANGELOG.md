# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.0.43](https://github.com/IBM/kui/compare/v4.5.0...v7.0.43) (2020-03-15)

### Bug Fixes

- Popup client should place InputStripe inside of StatusStripe ([a09138d](https://github.com/IBM/kui/commit/a09138d)), closes [#3949](https://github.com/IBM/kui/issues/3949)
- **plugins/plugin-carbon-tables:** prevent horizontal scrollbars on paginated table container ([5d622c0](https://github.com/IBM/kui/commit/5d622c0)), closes [#3931](https://github.com/IBM/kui/issues/3931)
- a few small tweaks for "short" tables in sidenav ([6609e6d](https://github.com/IBM/kui/commit/6609e6d)), closes [#3923](https://github.com/IBM/kui/issues/3923)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- **plugins/plugin-carbon-tables:** adjust DataTable style based on kui table model TableStyle spec ([694fba1](https://github.com/IBM/kui/commit/694fba1)), closes [#3921](https://github.com/IBM/kui/issues/3921)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.42](https://github.com/IBM/kui/compare/v4.5.0...v7.0.42) (2020-03-13)

### Bug Fixes

- **plugins/plugin-carbon-tables:** prevent horizontal scrollbars on paginated table container ([5d622c0](https://github.com/IBM/kui/commit/5d622c0)), closes [#3931](https://github.com/IBM/kui/issues/3931)
- a few small tweaks for "short" tables in sidenav ([6609e6d](https://github.com/IBM/kui/commit/6609e6d)), closes [#3923](https://github.com/IBM/kui/issues/3923)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- **plugins/plugin-carbon-tables:** adjust DataTable style based on kui table model TableStyle spec ([694fba1](https://github.com/IBM/kui/commit/694fba1)), closes [#3921](https://github.com/IBM/kui/issues/3921)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.41](https://github.com/IBM/kui/compare/v4.5.0...v7.0.41) (2020-03-13)

### Bug Fixes

- **plugins/plugin-carbon-tables:** prevent horizontal scrollbars on paginated table container ([5d622c0](https://github.com/IBM/kui/commit/5d622c0)), closes [#3931](https://github.com/IBM/kui/issues/3931)
- a few small tweaks for "short" tables in sidenav ([6609e6d](https://github.com/IBM/kui/commit/6609e6d)), closes [#3923](https://github.com/IBM/kui/issues/3923)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- **plugins/plugin-carbon-tables:** adjust DataTable style based on kui table model TableStyle spec ([694fba1](https://github.com/IBM/kui/commit/694fba1)), closes [#3921](https://github.com/IBM/kui/issues/3921)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.40](https://github.com/IBM/kui/compare/v4.5.0...v7.0.40) (2020-03-12)

### Bug Fixes

- a few small tweaks for "short" tables in sidenav ([6609e6d](https://github.com/IBM/kui/commit/6609e6d)), closes [#3923](https://github.com/IBM/kui/issues/3923)
- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- **plugins/plugin-carbon-tables:** adjust DataTable style based on kui table model TableStyle spec ([694fba1](https://github.com/IBM/kui/commit/694fba1)), closes [#3921](https://github.com/IBM/kui/issues/3921)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.39](https://github.com/IBM/kui/compare/v4.5.0...v7.0.39) (2020-03-12)

### Bug Fixes

- a few small tweaks for "short" tables in sidenav ([6609e6d](https://github.com/IBM/kui/commit/6609e6d)), closes [#3923](https://github.com/IBM/kui/issues/3923)
- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- **plugins/plugin-carbon-tables:** adjust DataTable style based on kui table model TableStyle spec ([694fba1](https://github.com/IBM/kui/commit/694fba1)), closes [#3921](https://github.com/IBM/kui/issues/3921)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.38](https://github.com/IBM/kui/compare/v4.5.0...v7.0.38) (2020-03-12)

### Bug Fixes

- a few small tweaks for "short" tables in sidenav ([6609e6d](https://github.com/IBM/kui/commit/6609e6d)), closes [#3923](https://github.com/IBM/kui/issues/3923)
- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- **plugins/plugin-carbon-tables:** adjust DataTable style based on kui table model TableStyle spec ([694fba1](https://github.com/IBM/kui/commit/694fba1)), closes [#3921](https://github.com/IBM/kui/issues/3921)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.37](https://github.com/IBM/kui/compare/v4.5.0...v7.0.37) (2020-03-12)

### Bug Fixes

- a few small tweaks for "short" tables in sidenav ([6609e6d](https://github.com/IBM/kui/commit/6609e6d)), closes [#3923](https://github.com/IBM/kui/issues/3923)
- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- **plugins/plugin-carbon-tables:** adjust DataTable style based on kui table model TableStyle spec ([694fba1](https://github.com/IBM/kui/commit/694fba1)), closes [#3921](https://github.com/IBM/kui/issues/3921)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.36](https://github.com/IBM/kui/compare/v4.5.0...v7.0.36) (2020-03-12)

### Bug Fixes

- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- **plugins/plugin-carbon-tables:** adjust DataTable style based on kui table model TableStyle spec ([694fba1](https://github.com/IBM/kui/commit/694fba1)), closes [#3921](https://github.com/IBM/kui/issues/3921)
- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.35](https://github.com/IBM/kui/compare/v4.5.0...v7.0.35) (2020-03-11)

### Bug Fixes

- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.34](https://github.com/IBM/kui/compare/v4.5.0...v7.0.34) (2020-03-11)

### Bug Fixes

- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.33](https://github.com/IBM/kui/compare/v4.5.0...v7.0.33) (2020-03-11)

### Bug Fixes

- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.32](https://github.com/IBM/kui/compare/v4.5.0...v7.0.32) (2020-03-11)

### Bug Fixes

- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.31](https://github.com/IBM/kui/compare/v4.5.0...v7.0.31) (2020-03-11)

### Bug Fixes

- **plugins/plugin-carbon-tables:** PaginatedTable always paginates ([7101c92](https://github.com/IBM/kui/commit/7101c92)), closes [#3903](https://github.com/IBM/kui/issues/3903)
- **plugins/plugin-carbon-tables:** sidecar table shows 20 rows at maximum even without pagination ([0a2191d](https://github.com/IBM/kui/commit/0a2191d)), closes [#3890](https://github.com/IBM/kui/issues/3890)
- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.30](https://github.com/IBM/kui/compare/v4.5.0...v7.0.30) (2020-03-10)

### Bug Fixes

- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.29](https://github.com/IBM/kui/compare/v4.5.0...v7.0.29) (2020-03-10)

### Bug Fixes

- disable pagination and use word-break in sidecar sidecar carbon-tables ([8d4ff4f](https://github.com/IBM/kui/commit/8d4ff4f)), closes [#3882](https://github.com/IBM/kui/issues/3882)
- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.28](https://github.com/IBM/kui/compare/v4.5.0...v7.0.28) (2020-03-09)

### Bug Fixes

- with two radio tables open, only one seems to have selection at a time ([7f5006b](https://github.com/IBM/kui/commit/7f5006b)), closes [#3871](https://github.com/IBM/kui/issues/3871)
- **plugins/plugin-carbon-tables:** improve radio button UI ([fdca8bc](https://github.com/IBM/kui/commit/fdca8bc)), closes [#3869](https://github.com/IBM/kui/issues/3869)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **plugins/plugin-carbon-tables:** Pagination border-top color theme alignment ([6d67b3a](https://github.com/IBM/kui/commit/6d67b3a)), closes [#3879](https://github.com/IBM/kui/issues/3879)
- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.27](https://github.com/IBM/kui/compare/v4.5.0...v7.0.27) (2020-03-09)

### Bug Fixes

- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.26](https://github.com/IBM/kui/compare/v4.5.0...v7.0.26) (2020-03-08)

### Bug Fixes

- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.25](https://github.com/IBM/kui/compare/v4.5.0...v7.0.25) (2020-03-07)

### Bug Fixes

- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.24](https://github.com/IBM/kui/compare/v4.5.0...v7.0.24) (2020-03-07)

### Bug Fixes

- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.23](https://github.com/IBM/kui/compare/v4.5.0...v7.0.23) (2020-03-07)

### Bug Fixes

- **plugins/plugin-carbon-tables:** pagination overflows when sidecar is open ([87e6717](https://github.com/IBM/kui/commit/87e6717)), closes [#3861](https://github.com/IBM/kui/issues/3861)
- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.22](https://github.com/IBM/kui/compare/v4.5.0...v7.0.22) (2020-03-07)

### Bug Fixes

- paginated tables always take up full width ([f0fe792](https://github.com/IBM/kui/commit/f0fe792)), closes [#3859](https://github.com/IBM/kui/issues/3859)
- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.21](https://github.com/IBM/kui/compare/v4.5.0...v7.0.21) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- table model should not allow raw HTML Node ([39c87ce](https://github.com/IBM/kui/commit/39c87ce)), closes [#3785](https://github.com/IBM/kui/issues/3785)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.20](https://github.com/IBM/kui/compare/v4.5.0...v7.0.20) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.19](https://github.com/IBM/kui/compare/v7.0.18...v7.0.19) (2020-03-06)

**Note:** Version bump only for package @kui-shell/plugin-carbon-tables

## [7.0.18](https://github.com/IBM/kui/compare/v7.0.17...v7.0.18) (2020-03-06)

**Note:** Version bump only for package @kui-shell/plugin-carbon-tables

## [7.0.17](https://github.com/IBM/kui/compare/v4.5.0...v7.0.17) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.16](https://github.com/IBM/kui/compare/v4.5.0...v7.0.16) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.15](https://github.com/IBM/kui/compare/v4.5.0...v7.0.15) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.14](https://github.com/IBM/kui/compare/v4.5.0...v7.0.14) (2020-03-06)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.13](https://github.com/IBM/kui/compare/v4.5.0...v7.0.13) (2020-03-05)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.12](https://github.com/IBM/kui/compare/v4.5.0...v7.0.12) (2020-03-05)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.11](https://github.com/IBM/kui/compare/v4.5.0...v7.0.11) (2020-03-05)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.10](https://github.com/IBM/kui/compare/v4.5.0...v7.0.10) (2020-03-04)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.9](https://github.com/IBM/kui/compare/v4.5.0...v7.0.9) (2020-03-04)

### Bug Fixes

- some code is dependent on the existence of static config files ([cdc6487](https://github.com/IBM/kui/commit/cdc6487)), closes [#3813](https://github.com/IBM/kui/issues/3813)
- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.8](https://github.com/IBM/kui/compare/v4.5.0...v7.0.8) (2020-03-03)

### Bug Fixes

- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **plugins/plugin-carbon-tables:** LivePaginatedTable does not properly update header ([106e722](https://github.com/IBM/kui/commit/106e722)), closes [#3795](https://github.com/IBM/kui/issues/3795)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.7](https://github.com/IBM/kui/compare/v4.5.0...v7.0.7) (2020-03-03)

### Bug Fixes

- **plugins/plugin-carbon-tables:** isSelected should not be of type string ([8a13f02](https://github.com/IBM/kui/commit/8a13f02)), closes [#3791](https://github.com/IBM/kui/issues/3791)
- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.6](https://github.com/IBM/kui/compare/v4.5.0...v7.0.6) (2020-03-03)

### Bug Fixes

- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.5](https://github.com/IBM/kui/compare/v4.5.0...v7.0.5) (2020-03-02)

### Bug Fixes

- **Plugins/plugin-carbon-tables:** Pagination UI can overflow offscreen ([28ff7ff](https://github.com/IBM/kui/commit/28ff7ff)), closes [#3773](https://github.com/IBM/kui/issues/3773)
- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.4](https://github.com/IBM/kui/compare/v4.5.0...v7.0.4) (2020-03-01)

### Bug Fixes

- stop loading the entire carbon-components.min.css ([5ecba14](https://github.com/IBM/kui/commit/5ecba14)), closes [#3744](https://github.com/IBM/kui/issues/3744)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)

## [7.0.3](https://github.com/IBM/kui/compare/v7.0.2...v7.0.3) (2020-03-01)

**Note:** Version bump only for package @kui-shell/plugin-carbon-tables

## [7.0.2](https://github.com/IBM/kui/compare/v7.0.1...v7.0.2) (2020-02-28)

**Note:** Version bump only for package @kui-shell/plugin-carbon-tables

## [7.0.1](https://github.com/IBM/kui/compare/v7.0.0...v7.0.1) (2020-02-28)

**Note:** Version bump only for package @kui-shell/plugin-carbon-tables

# [7.0.0](https://github.com/IBM/kui/compare/v4.5.0...v7.0.0) (2020-02-28)

### Features

- carbon tables ([237e9a5](https://github.com/IBM/kui/commit/237e9a5)), closes [#3632](https://github.com/IBM/kui/issues/3632)
- left-navigation sidecar ([f88329e](https://github.com/IBM/kui/commit/f88329e)), closes [#3635](https://github.com/IBM/kui/issues/3635)
