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

import { PreloadRegistrar } from '@kui-shell/core'

// modes
import raw from './modes/raw'
import code from './modes/code'
import logs from './modes/logs'
import trace from './modes/trace'
import invoke from './modes/invoke'
import limits from './modes/limits'
import result from './modes/result'
import zipCode from './modes/zip-code'
import blackbox from './modes/blackbox'
import sequence from './modes/sequence'
import parameters from './modes/parameters'
import annotations from './modes/annotations'

// badges
import durationBadge from './modes/duration'
import statusBadge from './modes/status'
import webExportBadge from './modes/web-exported'

// buttons
import edit from './modes/edit'
import showAction from './modes/show-action'
import showBinding from './modes/show-binding'
import showTrigger from './modes/show-trigger'
import deleteResource from './modes/delete'
import showPackageFeeds from './modes/package-feeds'
import showPackageActions from './modes/package-actions'
import showNamespaceActions from './modes/namespace/actions'
import showNamespacePackages from './modes/namespace/packages'
import showNamespaceRules from './modes/namespace/rules'
import showNamespaceTriggers from './modes/namespace/triggers'

import { notebookVFS } from '@kui-shell/plugin-core-support'

/**
 * Notes: buttons and modes and badges will be presented in the order
 * they are registered, unless they specify an `order` attribute.
 *
 */
export default async (registrar: PreloadRegistrar) => {
  registrar.registerModes(
    code,
    zipCode,
    blackbox,
    result,
    sequence,
    logs,
    trace,
    limits,
    parameters,
    annotations,
    raw,

    showAction,
    showTrigger,
    showPackageActions,
    showPackageFeeds,
    showNamespaceActions,
    showNamespacePackages,
    showNamespaceRules,
    showNamespaceTriggers,
    showBinding,
    invoke,
    edit,
    deleteResource
  )

  registrar.registerBadges(durationBadge, statusBadge, webExportBadge)

  // mount notebooks
  notebookVFS.mkdir({ argvNoOptions: ['mkdir', '/kui/openwhisk'] })
  notebookVFS.cp(undefined, ['plugin://plugin-openwhisk/notebooks/welcome.json'], '/kui/openwhisk/')
}
