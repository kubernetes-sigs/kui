# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [8.0.7](https://github.com/kui-shell/plugin-kubeui/compare/v4.5.0...v8.0.7) (2020-03-30)

### Bug Fixes

- Form component sometimes has too-small TextInputs ([21d841d](https://github.com/kui-shell/plugin-kubeui/commit/21d841d)), closes [#4036](https://github.com/kui-shell/plugin-kubeui/issues/4036)
- helm on its own should render in sidecar ([4b82517](https://github.com/kui-shell/plugin-kubeui/commit/4b82517)), closes [#4010](https://github.com/kui-shell/plugin-kubeui/issues/4010)
- improve contrast of table Pagination component in light themes ([41246c3](https://github.com/kui-shell/plugin-kubeui/commit/41246c3)), closes [#4038](https://github.com/kui-shell/plugin-kubeui/issues/4038)
- improve Form layout ([2003622](https://github.com/kui-shell/plugin-kubeui/commit/2003622)), closes [#4034](https://github.com/kui-shell/plugin-kubeui/issues/4034)
- improve kubectl breadcrumb detection ([6cacfe6](https://github.com/kui-shell/plugin-kubeui/commit/6cacfe6)), closes [#4099](https://github.com/kui-shell/plugin-kubeui/issues/4099)
- kubectl summary form clipping ([7ea65e8](https://github.com/kui-shell/plugin-kubeui/commit/7ea65e8)), closes [#4093](https://github.com/kui-shell/plugin-kubeui/issues/4093)
- kubectl summary Form TextInputs can be cropped ([3becaf9](https://github.com/kui-shell/plugin-kubeui/commit/3becaf9)), closes [#4077](https://github.com/kui-shell/plugin-kubeui/issues/4077)
- remove use of inline styling in Form.tsx ([23121b2](https://github.com/kui-shell/plugin-kubeui/commit/23121b2)), closes [#4112](https://github.com/kui-shell/plugin-kubeui/issues/4112)
- tekton Step nodes show with hashed background ([8428d72](https://github.com/kui-shell/plugin-kubeui/commit/8428d72)), closes [#4114](https://github.com/kui-shell/plugin-kubeui/issues/4114)
- **plugins/plugin-kubectl:** remove leftover debugging printf in kubectl help ([39ab52f](https://github.com/kui-shell/plugin-kubeui/commit/39ab52f)), closes [#4083](https://github.com/kui-shell/plugin-kubeui/issues/4083)
- STATUS cell not centered when sidecar is open ([4fb507a](https://github.com/kui-shell/plugin-kubeui/commit/4fb507a)), closes [#4059](https://github.com/kui-shell/plugin-kubeui/issues/4059)
- status stripe refinements ([1394043](https://github.com/kui-shell/plugin-kubeui/commit/1394043)), closes [#4069](https://github.com/kui-shell/plugin-kubeui/issues/4069) [#4069](https://github.com/kui-shell/plugin-kubeui/issues/4069)
- when sidecar is open, only show status badge, not status text ([3214db2](https://github.com/kui-shell/plugin-kubeui/commit/3214db2)), closes [#4058](https://github.com/kui-shell/plugin-kubeui/issues/4058)
- **plugins/plugin-kubectl:** kubectl describe (--help) fails ([10b8e8a](https://github.com/kui-shell/plugin-kubeui/commit/10b8e8a)), closes [#4012](https://github.com/kui-shell/plugin-kubeui/issues/4012)
- tables overflow horizontally when sidecar is open ([2d6bc95](https://github.com/kui-shell/plugin-kubeui/commit/2d6bc95)), closes [#4016](https://github.com/kui-shell/plugin-kubeui/issues/4016)
- **plugins/plugin-kubectl:** oc describe fails ([4f4de4e](https://github.com/kui-shell/plugin-kubeui/commit/4f4de4e)), closes [#4008](https://github.com/kui-shell/plugin-kubeui/issues/4008)

### Features

- **plugins/plugin-kubectl:** ReplicaSet should have Pods tab ([42cd286](https://github.com/kui-shell/plugin-kubeui/commit/42cd286)), closes [#4110](https://github.com/kui-shell/plugin-kubeui/issues/4110)
- add labels to summary mode ([95f731d](https://github.com/kui-shell/plugin-kubeui/commit/95f731d)), closes [#4041](https://github.com/kui-shell/plugin-kubeui/issues/4041) [#4040](https://github.com/kui-shell/plugin-kubeui/issues/4040)
- add Show Owner Reference button for kube resources ([80ea40f](https://github.com/kui-shell/plugin-kubeui/commit/80ea40f)), closes [#4106](https://github.com/kui-shell/plugin-kubeui/issues/4106)
- add support for Toolbar Buttons ([f55b8c6](https://github.com/kui-shell/plugin-kubeui/commit/f55b8c6)), closes [#4103](https://github.com/kui-shell/plugin-kubeui/issues/4103) [#4105](https://github.com/kui-shell/plugin-kubeui/issues/4105)
- **plugins/plugin-kubectl:** restore Show Logs button for kubectl ([6b17dbd](https://github.com/kui-shell/plugin-kubeui/commit/6b17dbd)), closes [#4089](https://github.com/kui-shell/plugin-kubeui/issues/4089)
- render kubectl summary tab using forms ([d88436e](https://github.com/kui-shell/plugin-kubeui/commit/d88436e)), closes [#4014](https://github.com/kui-shell/plugin-kubeui/issues/4014)
- use breadcrumbs for TopNavSidecar naming ([5a4611e](https://github.com/kui-shell/plugin-kubeui/commit/5a4611e)), closes [#4043](https://github.com/kui-shell/plugin-kubeui/issues/4043) [#3657](https://github.com/kui-shell/plugin-kubeui/issues/3657) [#4044](https://github.com/kui-shell/plugin-kubeui/issues/4044)
- **plugins/plugin-kubectl:** configmap summary should show data ([50c7e10](https://github.com/kui-shell/plugin-kubeui/commit/50c7e10)), closes [#4025](https://github.com/kui-shell/plugin-kubeui/issues/4025)
