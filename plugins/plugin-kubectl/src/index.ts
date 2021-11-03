/*
 * Copyright 2019 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// this file defines the external API

export {
  KubeResource,
  isKubeResource,
  isCrudableKubeResource,
  KubeResourceWithSummary,
  WithSummary,
  WithRawData,
  InvolvedObject,
  KubeStatus,
  KubeStatusCondition,
  Pod,
  PodLikeSpec,
  isPod,
  Deployment,
  isDeployment,
  KubeItems,
  isKubeItems,
  isKubeItemsOfKind,
  KubePartial,
  PodList,
  isPodList,
  KubeContext,
  Secret,
  isSecret,
  Job,
  isJob,
  Resource
} from './lib/model/resource'

export { default as TrafficLight } from './lib/model/traffic-light'

export { default as apiVersion } from './controller/kubectl/apiVersion'

export { default as doExecWithMarkdown } from './controller/kubectl/exec-to-markdown'

export {
  doExecWithStdoutViaPty,
  doExecWithPty,
  doExecWithStdout,
  doExecWithStatus,
  doExecWithRadioTable,
  doExecWithTable
} from './controller/kubectl/exec'

export { doExecRaw, doNativeExec } from './controller/kubectl/raw'

export { default as kubectl } from './controller/cli'

export { default as defaultFlags, flags } from './controller/kubectl/flags'

export {
  getAllContexts,
  getCurrentContext,
  getCurrentContextName,
  getCurrentDefaultContextName,
  getCurrentDefaultNamespace
} from './controller/kubectl/contexts'

export {
  KubeOptions,
  hasLabel,
  getLabel,
  getLabelForArgv,
  isHelpRequest,
  getContainer,
  getNamespace,
  getNamespaceForArgv,
  isWatchRequest,
  watchRequestFrom,
  withKubeconfigFrom,
  isTableRequest,
  isForAllNamespaces
} from './controller/kubectl/options'

export { default as parseName } from './lib/util/name'

export {
  stringToTable,
  formatTable,
  preprocessTable,
  computeDurations,
  withNamespaceBreadcrumb
} from './lib/view/formatTable'

export { getPodsCommand } from './lib/view/modes/pods'

export { default as logsMode } from './lib/view/modes/logs-mode-id'

export { isUsage, doHelp, withHelp } from './lib/util/help'

export { getCommandFromArgs } from './lib/util/util'

export { fetchFileString } from './lib/util/fetch-file'

export { fqnOf, fqn } from './controller/kubectl/fqn'

export { getKind } from './controller/kubectl/explain'

/**
 * Exports for future delegation; e.g. `oc get pods` is mostly just
 * `kubectl get pods`
 *
 */
export { register as registerEdit } from './controller/kubectl/edit'
export { doGet, getter } from './controller/kubectl/get'
export { doRun } from './controller/kubectl/run'
export { doCreate } from './controller/kubectl/create'
export { doDelete } from './controller/kubectl/delete'
export { describer } from './controller/kubectl/describe'
export { register as registerConfig } from './controller/kubectl/config'
export { registerApplySubcommands } from './controller/kubectl/apply-subcommands'

export { viewTransformer as getTransformer, doGetAsMMR as getAsMMRTransformer } from './controller/kubectl/get'

/** A channel that covers *possible* changes to kubectl config */
export {
  onKubectlConfigChangeEvents,
  offKubectlConfigChangeEvents,
  emitKubectlConfigChangeEvent
} from './controller/kubectl/config'

/** memory and cpu parsing */
export { default as Parser } from './lib/util/parse'

/** get plugin-kubectl's tab-state */
export { getTabState } from './tab-state'
