/*
 * Copyright 2018 IBM Corporation
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

const debug = require('debug')('seed/prereqs')

import { dirname } from 'path'

import { inBrowser } from '../../../../../../build/core/capabilities'
import repl = require('../../../../../../build/core/repl')

import { okIf404 } from '../../../../k8s/plugin/lib/util/retry'
import { NAMESPACE, helmName } from './constants'

/**
 * Options coming from the command line
 *
 */
interface IOptions {
  set?: string // --set <value overrides;...> passed on to helm install
  namespace?: string // -n <namespace>
}

/**
 * Generate a `-n` command line option from an IOptions
 *
 */
export const opts = (options: IOptions) => options.namespace ? `-n "${options.namespace}"` : ''

/**
 * Check k8s cluster is properly initialized for Seed. If not, initializes it.
 *
 */
export async function initPrereqs (options: IOptions, interactive: boolean, forceReinit = false) {
  debug('initPrereqs')

  if (forceReinit) {
    await Promise.all([
      initSecret(options, interactive, forceReinit),
      initDefaults(options, forceReinit),
      initToken(options, forceReinit)
    ])
  } else {
    return Promise.all([
      checkSecret(options, interactive),
      checkDefaults(options, interactive),
      checkToken(options)
    ])
  }
}

export async function checkSecret (options: IOptions, interactive: boolean, deploy = true) {
  debug('checkSecret')

  try {
    // Does secret exist in current context?
    await repl.qexec(`kubectl get ${opts(options)} secret seed-secret`,
                     undefined, undefined, { raw: true })
    return true
  } catch (e) {
    if (deploy) {
      return initSecret(options, interactive)
    } else {
      return false
    }
  }
}

async function initSecret (options: IOptions, interactive: boolean, forceReinit = false) {
  debug('initSecret', interactive, forceReinit)

  let key = process.env.IBMCLOUD_API_KEY

  if (!key) {
    if (!inBrowser()) {
      key = await new Promise<string>(async (resolve, reject) => {
        const { exec } = require('child_process')
        exec('ibmcloud iam api-key-create seed-key', { stdio: ['pipe', 'pipe', 'ignore'] }, (err, stdout, stderr) => {
          if (err) {
            reject(err)
          } else {
            const key = extractValue('API Key', stdout.toString())
            debug('initSecret got key', key)
            resolve(key)
          }
        })
      })
    } else {
      // TODO: prompt in browser
    }
  }

  if (forceReinit) {
    debug('initSecret delete')
    await okIf404(`kubectl delete ${opts(options)} secret seed-secret`, { raw: true })
  }

  debug('initSecret create')
  await repl.qexec(`kubectl create ${opts(options)} secret generic seed-secret --from-literal=api-key=${key}`,
                   undefined, undefined, { raw: true })

  debug('initSecret label')
  await repl.qexec(`kubectl label secret seed-secret app=seed`,
                   undefined, undefined, { raw: true })

  debug('seed-secret initialized')
}

function extractValue (key: string, out: string): string {
  return out.split('\n').find(line => line.startsWith(key)).substr(key.length).trim()
}

function extractValueOrThrow (key: string, out: string): string {
  const value = extractValue(key, out)
  if (value === '') {
    throw new Error(`${key} value is empty`)
  }
  return value
}

export async function checkDefaults (options: IOptions, interactive: boolean, deploy = true) {
  debug('checkDefaults')
  try {
    // Does defaults exist in current context?
    await repl.qexec(`kubectl get ${opts(options)} cm seed-defaults`,
                     undefined, undefined, { raw: true })
    return true
  } catch (e) {
    if (deploy) {
      return initDefaults(options)
    } else {
      return false
    }
  }
}

async function initDefaults (options: IOptions, forceReinit = false) {
  // Only support setting default from current ic target for now
  debug('initDefaults')
  try {
    if (!inBrowser()) {
      const { execSync } = require('child_process')

      const out = execSync('ibmcloud target', { stdio: ['pipe', 'pipe', 'pipe'] }).toString()
      const region = `--from-literal=region="${extractValueOrThrow('Region:', out)}"`
      const org = `--from-literal=org="${extractValueOrThrow('Org:', out)}"`
      const space = `--from-literal=space="${extractValueOrThrow('Space:', out)}"`
      const group = `--from-literal=resourcegroup="${extractValueOrThrow('Resource group:', out)}"`
      const loc = `--from-literal=resourcelocation="${extractValueOrThrow('Region:', out)}"`

      if (forceReinit) {
        debug('initDefaults delete')
        try {
          await okIf404(`kubectl delete ${opts(options)} configmap seed-defaults`, { raw: true })
          debug('initDefaults delete done')
        } catch (err) {
          console.error('initDefaults error deleting configmap', err.code, err)
        }
      }

      debug('initDefaults configmap create')
      const cmd = `kubectl create ${opts(options)} configmap seed-defaults ${region} ${org} ${space} ${group} ${loc}`
      debug('initDefaults configmap create command', cmd)
      try {
        await repl.qexec(cmd, undefined, undefined, { raw: true })

      } catch (err) {
        console.error('initDefaults error creating configmap', err.code, err)
      }

      debug('initDefaults configmap label')
      await repl.qexec(`kubectl label configmap seed-defaults app=seed`,
                       undefined, undefined, { raw: true })
    } else {
      // TODO: prompt in browser
    }

    debug('seed-defaults initialized')
  } catch (e) {
    console.error(e)
    throw new Error('seed-defaults cannot be set. Use the ibmcloud command to set the targeted region, account, resource group, org and space')
  }
}

export async function checkToken (options: IOptions, deploy = true) {
  debug('checkToken')
  try {
    // Does secret exist in current context?
    await repl.qexec(`kubectl get secret seed-registry -n "${NAMESPACE}"`, // note global NAMESPACE
                     undefined, undefined, { raw: true })
    return true
  } catch (e) {
    console.error(e)
    if (deploy) {
      await initToken(options)
      return 'seed-registry initialized'
    } else {
      return false
    }
  }
}

async function initToken (options: IOptions, forceReinit = false) {
  // Allow access to all IBMers
  const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Mjc5MmJhNi1lMzg5LTVhZjktYmNlNi0yYTgxYmM4MzUwNzciLCJpc3MiOiJyZWdpc3RyeS5uZy5ibHVlbWl4Lm5ldCJ9.663OJ4baZGQOS6qs-QUsPtAIluFbDgMB9XVAojmg1es'

  if (forceReinit) {
    debug('initToken delete')
    await okIf404(`kubectl delete secret seed-registry -n "${NAMESPACE}"`, { raw: true }) // note global namespace
  }

  debug('initToken create')
  await repl.qexec(`kubectl create secret docker-registry seed-registry -n "${NAMESPACE}" --docker-server=registry.ng.bluemix.net --docker-username=token --docker-password=${TOKEN} --docker-email=seed@us.ibm.com`,
                   undefined, undefined, { raw: true })

  debug('initToken label')
  await repl.qexec(`kubectl label secret seed-registry app=seed -n "${NAMESPACE}"`,
                   undefined, undefined, { raw: true })

  debug('registry secret initialized')
}

/**
 * Check to see if the CRDs have been deployed.
 *
 */
const expectedCRDs = [
  'compositions.openwhisk.ibm.com',
  'functions.openwhisk.ibm.com',
  'invocations.openwhisk.ibm.com',
  'packages.openwhisk.ibm.com',
  'rules.openwhisk.ibm.com',
  'triggers.openwhisk.ibm.com'
]
export const checkCRDs = async (options: IOptions, deploy = true) => {
  debug('checkCRDs', deploy)
  try {
    const crds = await repl.qexec(`kubectl get crd -n "${NAMESPACE}" --output=json`, undefined, undefined, { raw: true }) // global namespace
    debug('checkCRDs got crds', crds)
    if (expectedCRDs.every(_ => crds.find(({ metadata }) => metadata.name === _))) {
      return true
    } else {
      return false
    }
  } catch (err) {
    debug('checkCRDs error', err)
    if (deploy) {
      return initCluster(options, false, false)
    } else {
      return false
    }
  }
}

/**
 * Go to sleep for the given number of milliseconds
 *
 */
const sleep = (millis: number) => new Promise(resolve => setTimeout(resolve, millis))

/**
 * Respond to an error, initializing helm if needed
 *
 */
const initHelmIfNeeded = async (options: IOptions, err, weAlreadyTriedHelmInit: boolean) => {
  if (err.raw.message.match(/could not find tiller/i)) {
    debug('helm init needed')
    if (weAlreadyTriedHelmInit) {
      debug('oof, we already tried helm init, and it did not seem to work')
      throw err
    } else {
      await repl.qexec('helm init',
                       undefined, undefined, { raw: true })
      return true // yes, we already tried helm init
    }
  } else if (err.raw.message.match(/could not find a ready tiller pod/i)) {
    debug('helm init in progress, but the tiller pod is not yet ready')
    await sleep(500)
    return weAlreadyTriedHelmInit
  } else {
    throw err
  }
}

/**
 * Push the CRDs
 *
 */
export const initCluster = async (options: IOptions, forceReinit = false, weAlreadyTriedHelmInit = false) => {
  debug('initCluster', forceReinit)

  try {
    if (forceReinit) {
      await okIf404(`helm del --purge ${helmName}`, { raw: true })
    }

    if (!inBrowser()) {
      const chartDir = dirname(require.resolve('../../../charts/seed2'))

      const setOption = options.set ? `--set ${options.set}` : ''
      if (options.set) {
        debug('passing through --set to helm', options.set)
      }

      const now = new Date().getTime()
      return await repl.qexec(`helm install "${chartDir}" ${setOption} --namespace ${NAMESPACE} --set ts=s${now} --name ${helmName}`,
                              undefined, undefined, { raw: true })
    } else {
      throw new Error('browser operation not yet supported')
    }
  } catch (err) {
    debug('checking to see if helm init is needed', err)
    weAlreadyTriedHelmInit = await initHelmIfNeeded(options, err, weAlreadyTriedHelmInit)
    return initCluster(options, forceReinit, weAlreadyTriedHelmInit)
  }
}

/**
 * Check the status of the pods that support the CRDs
 *
 */
export const checkDeploy = async () => {
  debug('checkDeploy')

  if (!inBrowser()) {
    try {
      await repl.qexec(`kubectl get deploy "${helmName}" -n "${NAMESPACE}"`, // global namespace
                       undefined, undefined, { raw: true })
    } catch (err) {
      if (err.code === 404) {
        return false
      } else {
        throw err
      }
    }

    const pods = await repl.qexec(`kubectl get pod -l app=seed -n "${NAMESPACE}" -o json`,
                     undefined, undefined, { raw: true })
    debug('checkDeploy got these pod', pods)
    return pods.filter(_ => _.status.phase !== 'Running').length === 0
  } else {
    throw new Error('browser operation not yet supported')
  }
}

/**
 * Check the status of a pod
 *
 */
export const checkPod = async (name: string) => {
  debug('checkPod', name)

  if (!inBrowser()) {
    await repl.qexec(`kubectl get pod "${name}" --namespace "${NAMESPACE}"`, // global namespace
                     undefined, undefined, { raw: true })
    return true
  } else {
    throw new Error('browser operation not yet supported')
  }
}

/**
 * Restart pods
 *
 */
export const restartPods = async () => {
  debug('restartPods')

  if (!inBrowser()) {
    const pods = await repl.qexec(`kubectl get pods -n "${NAMESPACE}" -l app=seed -o json`, // global namespace
                                  undefined, undefined, { raw: true })
    debug('restartPods', pods)
    await Promise.all(pods.map(pod => repl.qexec(`kubectl delete pod -n "${NAMESPACE}" "${pod.metadata.name}"`,
                                                 undefined, undefined, { raw: true })))
    return true
  } else {
    throw new Error('browser operation not yet supported')
  }
}
