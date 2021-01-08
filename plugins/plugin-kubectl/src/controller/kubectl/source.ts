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

import fetchFile from '../../lib/util/fetch-file'
import { KubeOptions, fileOfWithDetail, isTableRequest } from './options'

/**
 * Fetch any references to --file sources, so that the views can show
 * the user what happened in more detail.
 *
 */
export default async function withSourceRefs(
  args: Arguments<KubeOptions>
): Promise<WithSourceReferences['kuiSourceRef']> {
  const { filepath, isFor } = fileOfWithDetail(args)

  if (filepath && isTableRequest(args)) {
    try {
      const data = (await fetchFile(args.REPL, filepath)).filter(_ => _)[0]
      if (data) {
        return {
          templates: [{ filepath, data, isFor, kind: 'source', contentType: 'yaml' }]
        }
      }
    } catch (err) {
      console.error('Error fetching source ref', err)
    }
  }
}
