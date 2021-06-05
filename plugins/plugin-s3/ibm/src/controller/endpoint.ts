/*
 * Copyright 2021 The Kubernetes Authors
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

import { Arguments, RadioTable, encodeComponent, eventChannelUnsafe, expandHomeDir } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'

import filepath from './filepath'
import Geos from '../model/geos'
import readConfig from './config'
import updateChannel from '../channel'
import { hasEndpoint } from '../model/Config'

/** @return current region; note, this value may not appear in config.json! */
async function doGetCurrentEndpoint(args: Arguments): Promise<void | string> {
  const raw = await doExecWithStdoutViaPty(Object.assign({}, args, { command: 'ibmcloud cos config region --list' }))
  const match = raw.match(/Default Region\s+(.*)/)
  if (match && match.length === 2) {
    return match[1].trim()
  }
}

/** Talk to `ibmcloud` to set the COS endpoint to the given `endpoint` */
async function doSetEndpoint(args: Arguments, endpoint: string) {
  const config = await readConfig({ REPL: args.REPL })
  config.endpointForKui = Geos[endpoint] || endpoint
  // config["Default Region"] = await REPL.qexec('ibmcloud cos config region default')
  // console.error('heelo', config)

  await args.REPL.rexec<{ data: string }>(`fwrite ${encodeComponent(expandHomeDir(filepath()))}`, {
    data: JSON.stringify(config, undefined, 2)
  })

  eventChannelUnsafe.emit(updateChannel)

  return `Setting IBM Cloud Object Storage endpoint to [${endpoint}](${endpoint})`
}

/** Present a RadioTable of endpoint options */
async function radiotable(args: Arguments): Promise<RadioTable> {
  const [current, local] = await Promise.all([doGetCurrentEndpoint(args), readConfig({ REPL: args.REPL })])

  const keys = Object.keys(Geos)
  const defaultSelectedIdx = !current ? -1 : keys.findIndex(_ => _ === current)

  if (current && !hasEndpoint(local)) {
    await doSetEndpoint(args, current)
  }

  return {
    apiVersion: 'kui-shell/v1',
    kind: 'RadioTable',
    defaultSelectedIdx,
    title: 'Endpoint',
    header: { cells: ['Short name', 'Endpoint'] },
    body: keys.map(short => ({
      cells: [short, Geos[short]],
      onSelect: `ibmcloud cos endpoint ${short}`
    }))
  }
}

export async function setEndpointIfPossible(args: Arguments): Promise<boolean> {
  const current = await doGetCurrentEndpoint(args)
  if (current) {
    await doSetEndpoint(args, Geos[current] || current)
    return true
  } else {
    return false
  }
}

export default async function setEndpoint(args: Arguments) {
  if (args.argvNoOptions.length > 4) {
    throw new Error(
      'Invalid usage. Try [ibmcloud cos endpoint](#kuiexec?command=ibmcloud%20cos%20endpoint) to select an endpoint'
    )
  } else if (args.argvNoOptions.length === 3) {
    return radiotable(args)
  } else {
    const asGiven = args.argvNoOptions[args.argvNoOptions.length - 1]
    const endpoint = Geos[asGiven]
    return doSetEndpoint(args, endpoint)
  }
}
