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

import Debug from 'debug'
import { Arguments } from '@kui-shell/core'

import { fetchFile } from '../../../lib/util/fetch-file'
import { getKindAndVersion } from '../../kubectl/explain'

import { KubeOptions, fileOf, getLabel } from '../../kubectl/options'

import handleErrors from './errors'
import { urlFormatterFor } from './url'
import { status } from '../../kubectl/exec'
import { FinalState } from '../../../lib/model/states'
import { getCommandFromArgs } from '../../../lib/util/util'
import { headersForPlainRequest as headers } from './headers'

const debug = Debug('plugin-kubectl/controller/client/direct/delete')

export default async function deleteDirect(
  args: Arguments<KubeOptions>,
  _kind = getKindAndVersion(
    getCommandFromArgs(args),
    args,
    args.argvNoOptions[args.argvNoOptions.indexOf('delete') + 1]
  )
) {
  // For now, we only handle delete-by-name
  if (!fileOf(args) && !getLabel(args) && !args.parsedOptions['dry-run'] && !args.parsedOptions['field-selector']) {
    const explainedKind = await _kind
    const { kind } = explainedKind
    const formatUrl = await urlFormatterFor(args, explainedKind)

    const kindIdx = args.argvNoOptions.indexOf('delete') + 1
    const names = args.argvNoOptions.slice(kindIdx + 1)
    if (names.length > 0) {
      const urls = names.map(formatUrl.bind(undefined, true, true)).join(',')
      debug('attempting delete direct', urls)

      const responses = await fetchFile(args.REPL, urls, { method: 'delete', headers, returnErrors: true })

      // then dissect it into errors and non-errors
      const { errors, ok } = await handleErrors(responses, formatUrl, kind, args.REPL)
      if (ok.length === 0) {
        // all errors
        return errors.map(_ => _.message).join('\n')
      } else {
        return status(args, 'delete', getCommandFromArgs(args), FinalState.OfflineLike)
      }
    }
  }
}
