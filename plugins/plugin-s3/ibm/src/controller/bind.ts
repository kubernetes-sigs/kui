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

import Debug from 'debug'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'
import { Arguments, ExecType, ParsedOptions, encodeComponent, eventChannelUnsafe, expandHomeDir } from '@kui-shell/core'

import findLocal from './local'
import filepath from './filepath'
import readConfig from './config'
import updateChannel from '../channel'
import { findInstances } from './find'

import Config from '../model/Config'
import ServiceKey from '../model/ServiceKey'
import ServiceInstance from '../model/ServiceInstance'

const debug = Debug('plugin-ibmcloud/cos/bind')

async function save({ REPL }: Pick<Arguments, 'REPL'>, config: Config) {
  await REPL.rexec<{ data: string }>(`fwrite ${REPL.encodeComponent(expandHomeDir(filepath()))}`, {
    data: JSON.stringify(config, undefined, 2)
  })
}

async function bind(
  creds: ServiceKey,
  { crn, name }: ServiceInstance,
  { REPL }: Pick<Arguments, 'REPL'>
): Promise<void | Config> {
  if (!creds.credentials || !creds.credentials.cos_hmac_keys) {
    debug('invalid credentials, aborting bind')
  } else {
    debug('configuring cos crn and auth method', crn)
    const [config] = await Promise.all([
      readConfig({ REPL }),
      REPL.qexec(`ibmcloud cos config crn --crn ${crn}`),
      REPL.qexec('ibmcloud cos config auth --method HMAC')
    ])

    config.HMACProvided = true
    config.serviceInstanceName = name
    config.AccessKeyID = creds.credentials.cos_hmac_keys.access_key_id
    config.SecretAccessKey = creds.credentials.cos_hmac_keys.secret_access_key

    try {
      const region = await REPL.qexec('ibmcloud cos config region default')
      config['Default Region'] = region
    } catch (err) {
      console.error('configuring cos region failed', err)
    }

    debug('configuring cos creds')
    await save({ REPL }, config)

    setTimeout(() => eventChannelUnsafe.emit(updateChannel))

    return config
  }
}

async function createCredentials(instance: ServiceInstance, args: Arguments): Promise<void | Config> {
  const { id, name } = instance
  debug('creating COS credentials for', name)

  const keyName = `superCosHMACKey-${name}`
  await args.REPL.qexec(
    `ibmcloud resource service-key-create ${keyName} Writer --instance-name ${encodeComponent(
      name
    )} --parameters '{"HMAC":true}'`
  )
  const key = (
    await args.REPL.rexec<ServiceKey[]>(`ibmcloud resource service-key ${keyName} --instance-id ${id} --output json`)
  ).content[0]
  return bind(key, instance, args)
}

interface Options extends ParsedOptions {
  'cos-instance': string
}

async function fetchCreds(args: Arguments): Promise<ServiceKey[]> {
  return JSON.parse(
    await doExecWithStdoutViaPty(Object.assign({}, args, { command: `ibmcloud resource service-keys --output json` }))
  )
}

/** Attempt to find the name of the service instance associated with the given COS Config */
export async function setServiceInstanceName(args: Arguments, config: Config): Promise<boolean> {
  const [creds, instances] = await Promise.all([fetchCreds(args), findInstances(args)])

  const cred = creds.find(
    _ =>
      _.credentials &&
      _.credentials.cos_hmac_keys &&
      _.credentials.cos_hmac_keys.access_key_id === config.AccessKeyID &&
      _.credentials.cos_hmac_keys.secret_access_key === config.SecretAccessKey
  )

  if (cred) {
    const instance = instances.find(_ => _.account_id === cred.account_id)
    if (instance) {
      config.serviceInstanceName = instance.name
      await save(args, config)
      return true
    }
  }

  return false
}

export async function findCredentialsForInstance(
  args: Arguments,
  instanceName?: string,
  instancesP?: Promise<ServiceInstance[]>
): Promise<void | Config> {
  const local = await findLocal(args.REPL)
  const matchingNames = local && (!instanceName || local.serviceInstanceName === instanceName)

  if (local && matchingNames) {
    debug('already have valid local config')
    return local
  } else {
    const instances = await (instancesP || findInstances(args))
    debug('instances', instances)

    if (instances.length > 0) {
      const instance = instanceName ? instances.find(_ => _.name === instanceName) : instances[0]
      if (!instance) {
        throw new Error(`Cannot find specified instance ${instanceName}`)
      } else if (!instanceName && instances.length > 1) {
        throw new Error(`Please try again with --cos-instance <instanceName> as one of: ${instances.map(_ => _.name)}`)
      }

      // const { id } = instance
      const creds = (await fetchCreds(args))
        .filter(_ => _.credentials.cos_hmac_keys)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

      if (creds.length === 0) {
        return createCredentials(instance, args)
      } else {
        return bind(creds[0], instance, args)
      }
    }
  }
}

async function findCredentials(
  args: Arguments<Options>,
  instancesP?: Promise<ServiceInstance[]>
): Promise<void | Config> {
  const instanceName = args.parsedOptions['cos-instance']
  return findCredentialsForInstance(args, instanceName, instancesP)
}

export default async function findAndBindCredentials(args: Arguments<Options>) {
  const creds = await findCredentials(args)

  if (!creds) {
    throw new Error('Unable to bind Cloud Object Storage credentials')
  } else if (args.execOptions.type !== ExecType.Nested) {
    return 'Successfully identified Cloud Object Storage credentials'
  } else {
    return creds
  }
}
