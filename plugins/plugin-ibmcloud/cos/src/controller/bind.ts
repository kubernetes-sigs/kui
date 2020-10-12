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
import { Arguments, ExecType, encodeComponent, eventChannelUnsafe } from '@kui-shell/core'

import findLocal from './local'
import filepath from './filepath'
import readConfig from './config'
import updateChannel from '../channel'
import { findInstances } from './find'

import Config from '../model/Config'
import ServiceKey from '../model/ServiceKey'
import ServiceInstance from '../model/ServiceInstance'

const debug = Debug('plugin-ibmcloud/cos/bind')

async function bind(
  creds: ServiceKey,
  crn: ServiceInstance['crn'],
  { REPL }: Pick<Arguments, 'REPL'>
): Promise<void | Config> {
  if (!creds.credentials.cos_hmac_keys) {
    debug('invalid credentials, aborting bind')
  } else {
    debug('configuring cos crn and auth method', crn)
    const [config] = await Promise.all([
      readConfig({ REPL }),
      REPL.qexec(`ibmcloud cos config crn --crn ${crn}`),
      REPL.qexec('ibmcloud cos config auth --method HMAC')
    ])

    config.HMACProvided = true
    config.AccessKeyID = creds.credentials.cos_hmac_keys.access_key_id
    config.SecretAccessKey = creds.credentials.cos_hmac_keys.secret_access_key

    debug('configuring cos creds')
    await REPL.rexec<{ data: string }>(`fwrite ${REPL.encodeComponent(filepath())}`, {
      data: JSON.stringify(config, undefined, 2)
    })

    setTimeout(() => eventChannelUnsafe.emit(updateChannel))

    return config
  }
}

async function createCredentials({ crn, name }: ServiceInstance, args: Arguments): Promise<void | Config> {
  const keyName = 'kuiCosHMACKey'
  await args.REPL.qexec(
    `ibmcloud resource service-key-create ${keyName} Writer --instance-name ${encodeComponent(
      name
    )} --parameters '{"HMAC":true}'`
  )
  const key = (await args.REPL.rexec<ServiceKey>(`ibmcloud resource service-key ${keyName} --output json`)).content
  return bind(key, crn, args)
}

async function findCredentials(args: Arguments, instancesP?: Promise<ServiceInstance[]>): Promise<void | Config> {
  const local = await findLocal(args.REPL)

  if (local) {
    debug('already have valid local config')
    return local
  } else {
    const instances = await (instancesP || findInstances(args))
    debug('instances', instances)

    if (instances.length > 0) {
      const instance = instances[0]
      const { id, crn } = instance
      const creds = (
        await args.REPL.rexec<ServiceKey[]>(`ibmcloud resource service-keys --instance-id ${id} --output json`)
      ).content
        .filter(_ => _.credentials.cos_hmac_keys)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

      if (creds.length === 0) {
        return createCredentials(instance, args)
      } else {
        return bind(creds[0], crn, args)
      }
    }
  }
}

export default async function findAndBindCredentials(args: Arguments) {
  const creds = await findCredentials(args)

  if (!creds) {
    throw new Error('Unable to bind Cloud Object Storage credentials')
  } else if (args.execOptions.type !== ExecType.Nested) {
    return 'Successfully identified Cloud Object Storage credentials'
  } else {
    return creds
  }
}
