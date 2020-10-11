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

import { Arguments, eventChannelUnsafe } from '@kui-shell/core'

import filepath from './filepath'
import readConfig from './config'
import updateChannel from '../channel'

const shorthands = {
  us: 's3.us.cloud-object-storage.appdomain.cloud',
  'us-south': 's3.us-south.cloud-object-storage.appdomain.cloud',
  dallas: 's3.dal.us.cloud-object-storage.appdomain.cloud',
  'us-east': 's3.us-east.cloud-object-storage.appdomain.cloud',

  eu: 's3.eu.cloud-object-storage.appdomain.cloud',
  uk: 's3.eu-gb.cloud-object-storage.appdomain.cloud',
  de: 's3.eu-de.cloud-object-storage.appdomain.cloud',

  ap: 's3.ap.cloud-object-storage.appdomain.cloud',
  au: 's3.au-syd.cloud-object-storage.appdomain.cloud',
  jp: 's3.jp-tok.cloud-object-storage.appdomain.cloud'
}

export const usage = {
  required: [{ name: 'endpoint', allowed: ['us', 'us-south', 'us-east', 'eu', 'uk', 'de', 'ap', 'au', 'jp'] }]
}

export default async function setEndpoint(args: Arguments) {
  const asGiven = args.argvNoOptions[args.argvNoOptions.length - 1]
  const endpoint = shorthands[asGiven] || asGiven

  const config = await readConfig(args)
  config.endpointForKui = endpoint

  await args.REPL.rexec<{ data: string }>(`fwrite ${args.REPL.encodeComponent(filepath())}`, {
    data: JSON.stringify(config, undefined, 2)
  })

  eventChannelUnsafe.emit(updateChannel)

  return `Set IBM Cloud Object Storage endpoint to ${endpoint}`
}
