/*
 * Copyright 2020 IBM Corporation
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

import { Arguments, WithSourceReferences } from '@kui-shell/core'

import { fetchKusto, fetchFilesVFS } from '../../lib/util/fetch-file'
import { kustomizeOf, KubeOptions, fileOfWithDetail, isTableRequest } from './options'

/**
 * Fetch any references to --file sources, so that the views can show
 * the user what happened in more detail.
 *
 */
export default async function withSourceRefs(
  args: Arguments<KubeOptions>
): Promise<WithSourceReferences['kuiSourceRef']> {
  const { filepath, isFor } = fileOfWithDetail(args)
  const kusto = kustomizeOf(args)

  if (isTableRequest(args)) {
    try {
      if (filepath) {
        const files = await fetchFilesVFS(args, filepath, true)
        return {
          templates: files.map(({ filepath, data }) => ({
            filepath,
            data,
            isFor,
            kind: 'source' as const,
            contentType: 'yaml'
          }))
        }
      } else if (kusto) {
        const { customization, templates } = await fetchKusto(args, kusto)
        return {
          customization: { filepath: customization.filepath, data: customization.data, isFor: 'k' },
          templates: templates.map(({ filepath, data }) => ({
            filepath,
            data,
            isFor,
            kind: 'source' as const,
            contentType: 'yaml'
          }))
        }
      }
    } catch (err) {
      console.error('Error fetching source ref', err)
    }
  }
}
