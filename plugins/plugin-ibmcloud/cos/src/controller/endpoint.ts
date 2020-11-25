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

import { Arguments, RadioTable, encodeComponent, eventChannelUnsafe } from '@kui-shell/core'

import filepath from './filepath'
import readConfig from './config'
import updateChannel from '../channel'
import { hasEndpoint } from '../model/Config'

const shorthands = {
  ap: 's3.ap.cloud-object-storage.appdomain.cloud',
  au: 's3.au-syd.cloud-object-storage.appdomain.cloud',
  eu: 's3.eu.cloud-object-storage.appdomain.cloud',
  de: 's3.eu-de.cloud-object-storage.appdomain.cloud',
  jp: 's3.jp-tok.cloud-object-storage.appdomain.cloud',
  uk: 's3.eu-gb.cloud-object-storage.appdomain.cloud',
  us: 's3.us.cloud-object-storage.appdomain.cloud',

  'us-south': 's3.us-south.cloud-object-storage.appdomain.cloud',
  dallas: 's3.dal.us.cloud-object-storage.appdomain.cloud',
  'us-east': 's3.us-east.cloud-object-storage.appdomain.cloud'
}

/** @return current region; note, this value may not appear in config.json! */
async function doGetCurrentEndpoint({ REPL }: Pick<Arguments, 'REPL'>): Promise<void | string> {
  const raw = await REPL.qexec<string>('ibmcloud cos config region --list')
  const match = raw.match(/Default Region\s+(.*)/)
  if (match && match.length === 2) {
    return match[1].trim()
  }
}

/** Talk to `ibmcloud` to set the COS endpoint to the given `endpoint` */
async function doSetEndpoint({ REPL }: Pick<Arguments, 'REPL'>, endpoint: string) {
  const config = await readConfig({ REPL })
  config.endpointForKui = shorthands[endpoint] || endpoint

  await REPL.rexec<{ data: string }>(`fwrite ${encodeComponent(filepath())}`, {
    data: JSON.stringify(config, undefined, 2)
  })

  eventChannelUnsafe.emit(updateChannel)

  return `Setting IBM Cloud Object Storage endpoint to [${endpoint}](${endpoint})`
}

/** Present a RadioTable of endpoint options */
async function radiotable({ REPL }: Pick<Arguments, 'REPL'>): Promise<RadioTable> {
  const [current, local] = await Promise.all([doGetCurrentEndpoint({ REPL }), readConfig({ REPL })])

  const keys = Object.keys(shorthands)
  const defaultSelectedIdx = !current ? -1 : keys.findIndex(_ => _ === current)

  if (current && !hasEndpoint(local)) {
    await doSetEndpoint({ REPL }, current)
  }

  return {
    apiVersion: 'kui-shell/v1',
    kind: 'RadioTable',
    defaultSelectedIdx,
    title: 'Endpoint',
    header: { cells: ['Short name', 'Endpoint'] },
    body: keys.map(short => ({
      cells: [short, shorthands[short]],
      onSelect: `ibmcloud cos endpoint ${short}`
    }))
  }
}

export async function setEndpointIfPossible({ REPL }: Pick<Arguments, 'REPL'>): Promise<boolean> {
  const current = await doGetCurrentEndpoint({ REPL })
  if (current) {
    await doSetEndpoint({ REPL }, shorthands[current] || current)
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
    const endpoint = shorthands[asGiven]
    return doSetEndpoint(args, endpoint)
  }
}
