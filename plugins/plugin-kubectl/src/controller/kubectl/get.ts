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

import { CodedError, Arguments, ExecType, Registrar, MultiModalResponse, isHeadless, KResponse } from '@kui-shell/core'

import flags from './flags'
import { exec } from './exec'
import { RawResponse } from './response'
import doGetWatchTable from './watch/get-watch'
import commandPrefix from '../command-prefix'
import extractAppAndName from '../../lib/util/name'
import { KubeResource } from '../../lib/model/resource'
import { KubeOptions, isEntityRequest, isTableRequest, formatOf, isWatchRequest, getNamespace } from './options'
import { stringToTable, KubeTableResponse, isKubeTableResponse } from '../../lib/view/formatTable'
import { isUsage, doHelp } from '../../lib/util/help'

/**
 * For now, we handle watch ourselves, so strip these options off the command line
 *
 */
function prepareArgsForGet(args: Arguments<KubeOptions>) {
  const stripThese = ['-w=true', '--watch=true', '--watch-only=true', '-w', '--watch', '--watch-only']

  const idx = args.command.indexOf(' get ') + ' get '.length
  const pre = args.command.slice(0, idx - 1)
  const post = args.command.slice(idx - 1)
  return pre + stripThese.reduce((cmd, strip) => cmd.replace(new RegExp(`(\\s)${strip}`), '$1'), post)
}

/**
 * `kubectl get` as a table response
 *
 */
export function doGetAsTable(
  command: string,
  args: Arguments<KubeOptions>,
  response: RawResponse,
  verb = 'get'
): KubeTableResponse {
  const {
    content: { stderr, stdout }
  } = response

  const entityType = args.argvNoOptions[args.argvNoOptions.indexOf(verb) + 1]

  return stringToTable(stdout, stderr, args, command, verb, entityType)
}

/**
 * `kubectl get --watch` as a table response, but for the special case
 * where there is nothing yet to display
 *
 */
/* function doGetEmptyWatchTable(args: Arguments<KubeOptions>): KubeTableResponse {
  const emptyTable = { body: [] }
  return initWatch(args, emptyTable)
} */

/**
 * `kubectl get` as entity response
 *
 */
export async function doGetAsEntity(
  args: Arguments<KubeOptions>,
  response: RawResponse
): Promise<MultiModalResponse<KubeResource>> {
  try {
    // this is the raw data string we get from `kubectl`
    const data = response.content.stdout

    // parse the raw response; the parser we use depends on whether
    // the user asked for JSON or for YAML
    const resource = formatOf(args) === 'json' ? JSON.parse(data) : (await import('js-yaml')).safeLoad(data)

    // attempt to separate out the app and generated parts of the resource name
    const { name: prettyName, nameHash } = extractAppAndName(resource)

    if (resource.kind === 'List' && args.execOptions.type === ExecType.TopLevel) {
      // then this is a response to e.g. `kubectl get pods -o yaml`
      return {
        apiVersion: resource.apiVersion,
        kind: resource.kind,
        metadata: {
          name: args.command,
          namespace: getNamespace(args) || 'default'
        },
        isSimulacrum: true, // this is not a real crudable resource
        originatingCommand: args.command,
        isKubeResource: true,
        modes: [],
        data
      }
    }

    return Object.assign(resource, {
      prettyName,
      nameHash,
      originatingCommand: args.command,
      isKubeResource: true,
      modes: [], // this tells Kui that we want the response to be interpreted as a MultiModalResponse
      data // also include the raw, uninterpreted data string we got back
    })
  } catch (err) {
    console.error('error handling entity response; raw=', response.content.stdout)
    throw err
  }
}

/**
 * kubectl get as custom response
 *
 */
async function doGetCustom(args: Arguments<KubeOptions>, response: RawResponse): Promise<string> {
  return response.content.stdout.trim()
}

export function rawGet(args: Arguments<KubeOptions>, _command = 'kubectl') {
  const command = _command === 'k' ? 'kubectl' : _command
  return exec(args, prepareArgsForGet, command).catch((err: CodedError) => {
    // Notes: we are using statusCode internally to this plugin;
    // delete it before rethrowing the error, because the core would
    // otherwise interpret the statusCode as being meaningful to the
    // outside world
    delete err.statusCode

    // trim? at least with 1.15 clients, e.g. `kubectl get all -l
    // app=foo` emits weird initial blank newlines
    err.message = err.message.trim()

    throw err
  })
}

/**
 * This is the main handler for `kubectl get`. Here, we act as a
 * dispatcher: in `kubectl` a `get` can mean either get-as-table,
 * get-as-entity, or get-as-custom, depending on the `-o` flag.
 *
 */
export const doGet = (command: string) =>
  async function doGet(args: Arguments<KubeOptions>): Promise<KResponse> {
    // first, peel off some special cases:
    if (isUsage(args)) {
      // special case: get --help/-h
      return doHelp(command, args, prepareArgsForGet)
    }

    if (!isHeadless() && isWatchRequest(args)) {
      // special case: get --watch/watch-only

      // special case of special case: kubectl -w get fails; even
      // though we could handle it, we have decided to keep parity
      // with kubectl's errors here
      if (!/^k(ubectl)?\s+-/.test(args.command)) {
        return doGetWatchTable(args)
      }
    }

    // first, we do the raw exec of the given command
    const response = await rawGet(args, command)

    if (isKubeTableResponse(response)) {
      return response
    } else if (response.content.code !== 0) {
      // raw exec yielded an error!
      const err: CodedError = new Error(response.content.stderr)
      err.code = response.content.code
      throw err
    } else if (response.content.wasSentToPty) {
      return response.content.stdout
    } else if (isEntityRequest(args)) {
      // case 1: get-as-entity
      return doGetAsEntity(args, response)
    } else if (isTableRequest(args)) {
      // case 2: get-as-table
      return doGetAsTable(command, args, response)
    } else {
      // case 3: get-as-custom
      return doGetCustom(args, response)
    }
  }

export default (commandTree: Registrar) => {
  commandTree.listen(`/${commandPrefix}/kubectl/get`, doGet('kubectl'), flags)
  commandTree.listen(`/${commandPrefix}/k/get`, doGet('kubectl'), flags)
}
