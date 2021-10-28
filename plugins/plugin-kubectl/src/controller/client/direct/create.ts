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
import { Arguments, CodedError, Table, isTable, is404or409 } from '@kui-shell/core'

import { fetchFile } from '../../../lib/util/fetch-file'
import { Explained, getKindAndVersion } from '../../kubectl/explain'

import { KubeOptions, getFileFromArgv, getLabel, getNamespace } from '../../kubectl/options'

import status from './status'
import handleErrors from './errors'
import { urlFormatterForArgs } from './url'
import { headersForPlainRequest as headers } from './headers'

import { FinalState } from '../../../lib/model/states'
import { getCommandFromArgs } from '../../../lib/util/util'

const debug = Debug('plugin-kubectl/controller/client/direct/create')

function withErrors(watchPart: string[] | Table, errors: Error[]) {
  if (errors.length === 0) {
    return watchPart
  } else if (isTable(watchPart)) {
    return [watchPart, ...errors.map(_ => _.message)]
  } else {
    return [...watchPart, ...errors.map(_ => _.message)]
  }
}

export default async function createDirect(
  args: Arguments<KubeOptions>,
  verb: 'create' | 'apply',
  _kind?: Promise<Explained>
) {
  // For now, we only handle create-by-name
  if (
    !getFileFromArgv(args) &&
    !getLabel(args) &&
    !args.parsedOptions['dry-run'] &&
    !args.parsedOptions['field-selector']
  ) {
    const explainedKind = await (_kind ||
      getKindAndVersion(getCommandFromArgs(args), args, args.argvNoOptions[args.argvNoOptions.indexOf(verb) + 1]))
    const { kind, version } = explainedKind

    // the last undefined is needed: we don't want to include a name in the URL path
    const formatUrl = await urlFormatterForArgs(args, explainedKind)

    const kindIdx = args.argvNoOptions.indexOf('create') + 1
    const names = args.argvNoOptions.slice(kindIdx + 1)

    // re: context and kubeconfig, see https://github.com/IBM/kui/issues/7023
    if (
      verb === 'create' &&
      kind === 'Namespace' &&
      version === 'v1' &&
      names.length > 0 &&
      !args.parsedOptions.kubeconfig
    ) {
      // WARNING: this is namespace-specific for now!
      const data = names.map(name => ({
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
          creationTimestamp: null,
          name
        },
        spec: {},
        status: {}
      }))

      const urls = names
        .map(formatUrl.bind(undefined, true, false, undefined))
        .map(url => `${url}?fieldManager=kubectl-create`)
        .join(',')
      debug('attempting create namespace direct', names, urls)

      const responses = await fetchFile(args, urls, { method: 'post', headers, returnErrors: true, data })

      // then dissect it into errors and non-errors; the last true means return, don't throw, errors
      const { errors, okIndices, ok } = await handleErrors(responses, formatUrl, kind, args, true)
      if (ok.length === 0) {
        // all errors? then tell the user about them (no need to re-invoke the CLI)
        if (errors.length > 0 && errors.every(is404or409)) {
          const error: CodedError = new Error(errors.map(_ => _.message).join('\n'))
          error.code = errors[0].code
          throw error
        }
        // otherwise: intentional fall-through, returning void; let
        // kubectl CLI handle the errors for now
      } else {
        // success!
        const groups = [
          {
            names: okIndices.map(idx => names[idx]),
            namespace: await getNamespace(args),
            explainedKind
          }
        ]

        const watchPart = await status(args, groups, FinalState.OnlineLike)
        if (watchPart) {
          return withErrors(watchPart, errors)
        }
      }
    }
  }
}
