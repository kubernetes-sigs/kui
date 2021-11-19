/*
 * Copyright 2020 The Kubernetes Authors
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

import { Capabilities, PreloadRegistrar } from '@kui-shell/core'

import { metricListMode, metricYamlMode } from './models/metrics'
import { exprcreateMode, decisionMode } from './models/renderCreateExpr'

export default async (registrar: PreloadRegistrar) => {
  if (!Capabilities.isHeadless()) {
    await registrar.registerModes(exprcreateMode, decisionMode, metricListMode, metricYamlMode)

    const { notebookVFS } = await import('@kui-shell/plugin-core-support')
    notebookVFS.mkdir({ argvNoOptions: ['mkdir', '/kui/iter8'] })
    notebookVFS.cp(
      undefined,
      ['plugin://plugin-iter8/notebooks/welcome.json', 'plugin://plugin-iter8/notebooks/tutorial1.json'],
      '/kui/iter8/'
    )
  }
}
