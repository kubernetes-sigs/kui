/*
 * Copyright 2019 IBM Corporation
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
  isPod,
  Deployment,
  isDeployment,
  KubeItems,
  isKubeItems,
  isKubeItemsOfKind,
  KubeContext,
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

export { default as commandPrefix } from './controller/command-prefix'

export { default as defaultFlags, crudFlags } from './controller/kubectl/flags'

export { getCurrentContext } from './controller/kubectl/contexts'

export {
  KubeOptions,
  hasLabel,
  getLabel,
  getLabelForArgv,
  isHelpRequest,
  getContainer,
  getNamespace,
  getNamespaceForArgv,
  isForAllNamespaces
} from './controller/kubectl/options'

export { default as parseName } from './lib/util/name'

export { stringToTable, formatTable, preprocessTable } from './lib/view/formatTable'

export { isUsage, doHelp } from './lib/util/help'

export { getCommandFromArgs } from './lib/util/util'

export { fetchFileString } from './lib/util/fetch-file'

export { fqnOf, fqn } from './controller/kubectl/fqn'

/**
 * Exports for future delegation; e.g. `oc get pods` is mostly just
 * `kubectl get pods`
 *
 */
export { doEdit } from './controller/kubectl/edit'
export { getter } from './controller/kubectl/get'
export { doRun } from './controller/kubectl/run'
export { doCreate } from './controller/kubectl/create'
export { doDelete } from './controller/kubectl/delete'
export { describer } from './controller/kubectl/describe'

export { viewTransformer as getTransformer } from './controller/kubectl/get'
