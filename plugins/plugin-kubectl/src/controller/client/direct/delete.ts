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

import Debug from 'debug'
import { Arguments, is404 } from '@kui-shell/core'

import { fetchFile } from '../../../lib/util/fetch-file'
import { Explained, getKindAndVersion } from '../../kubectl/explain'

import { KubeOptions, getFileFromArgv, getLabel, getNamespace } from '../../kubectl/options'

import status from './status'
import handleErrors from './errors'
import { urlFormatterForArgs } from './url'
import { FinalState } from '../../../lib/model/states'
import { getCommandFromArgs } from '../../../lib/util/util'
import { headersForPlainRequest as headers } from './headers'

const debug = Debug('plugin-kubectl/controller/client/direct/delete')

export default async function deleteDirect(args: Arguments<KubeOptions>, _kind?: Promise<Explained>) {
  // For now, we only handle delete-by-name
  // re: context and kubeconfig, see https://github.com/IBM/kui/issues/7023
  if (
    !getFileFromArgv(args) &&
    !getLabel(args) &&
    !args.parsedOptions['dry-run'] &&
    !args.parsedOptions['field-selector'] &&
    !args.parsedOptions.context &&
    !args.execOptions.env.KUBECONFIG &&
    !args.parsedOptions.kubeconfig
  ) {
    const explainedKind = await (_kind ||
      getKindAndVersion(getCommandFromArgs(args), args, args.argvNoOptions[args.argvNoOptions.indexOf('delete') + 1]))
    const { kind } = explainedKind
    const formatUrl = await urlFormatterForArgs(args, explainedKind)

    // this tells the apiServer that we want the delete to return right away
    const data = { propagationPolicy: 'Background' }

    const kindIdx = args.argvNoOptions.indexOf('delete') + 1
    const names = args.argvNoOptions.slice(kindIdx + 1)
    if (kind && names.length > 0) {
      const urls = names.map(formatUrl.bind(undefined, true, false)).join(',')
      debug('attempting delete direct', urls)

      const responses = await fetchFile(args.REPL, urls, { method: 'delete', headers, returnErrors: true, data })

      // then dissect it into errors and non-errors
      const { errors, ok } = await handleErrors(responses, formatUrl, kind, args.REPL)
      if (ok.length === 0) {
        // all 404 errors? then tell the user about them (no need to re-invoke the CLI)
        if (errors.length > 0 && errors.every(is404)) {
          return errors.map(_ => _.message).join('\n')
        }
        // otherwise: intentional fall-through, returning void; let
        // kubectl CLI handle the errors for now
      } else {
        // success!
        const groups = [
          {
            names,
            namespace: await getNamespace(args),
            explainedKind
          }
        ]
        return status(args, groups, FinalState.OfflineLike)
      }
    }
  }
}
