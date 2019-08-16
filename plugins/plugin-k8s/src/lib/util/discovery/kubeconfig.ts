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

import * as Debug from 'debug'

import { delimiter } from 'path'
import { execSync } from 'child_process'

const debug = Debug('k8s/discovery/kubeconfig')

/**
 * On macOS, double-clicked and dock-launched processes do not have
 * /usr/local/bin on PATH; unfortunately this is the common location
 * of kubectl and helm.
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fillInPATH = (env: Record<string, any>) => {
  if (!env.PATH) {
    debug('failsafe for env.PATH')
    env.PATH = '/bin:/usr/bin'

    /* if (!process.env.PATH) {
      debug('failsafe for process.env.PATH')
      process.env.PATH = env.PATH
    } */
  }

  if (!env.PATH.match(/\/usr\/local\/bin/)) {
    debug('adding /usr/local/bin to PATH')
    process.env.PATH = env.PATH = `${env.PATH}${delimiter}/usr/local/bin`
    // ^^^ note how we remember this in process.env
  }
}

// Note about the below >1 checks: maybe==='\n' also
// indicates failure (on macOS, the length seems to be 0?)
const maybeKUBECONFIG = (file: string): string | void => {
  try {
    const maybe = execSync(`if [ -f ~/${file} ]; then echo $(. ~/${file} && echo $KUBECONFIG); fi`)
    debug('maybe? KUBECONFIG from %s', file, maybe.toString())
    if (maybe.length > 1) {
      const kubeconfig = maybe.toString().trim()
      debug('all right! we got a candidate KUBECONFIG from %s', file, kubeconfig)
      return kubeconfig
    }
  } catch (err) {
    debug('nope on KUBECONFIG from %s', file, err)
  }
}

/**
 * On macOS, double-clicked and dock-launched processes do not have
 * the KUBECONFIG environment variable, as macOS does not evaluate the
 * .profile (etc.) files prior to launch (for these launch modes).
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fillInKUBECONFIG = async (env: Record<string, any>) => {
  if (env.KUBECONFIG === undefined) {
    // see https://github.com/IBM/kui/issues/1789
    const { exists } = await import('fs-extra')
    if (!(await exists(process.env.HOME + '/.kube/config'))) {
      debug('attempting to find KUBECONFIG env var')
      const kubeconfig =
        maybeKUBECONFIG('.bash_profile') ||
        maybeKUBECONFIG('.profile') ||
        maybeKUBECONFIG('.zshrc') ||
        maybeKUBECONFIG('.zsh_profile') ||
        maybeKUBECONFIG('.bashrc') // might not work, as these are usually no-ops for non-interactive shells; but let's try it

      if (kubeconfig) {
        process.env.KUBECONFIG = env.KUBECONFIG = kubeconfig
        // ^^^ note how we remember this in process.env
      }
    }
  }
}

/**
 * On macOS, double-clicked and dock-launched processes do not have
 * /usr/local/bin on PATH; unfortunately this is the common location
 * of kubectl and helm; there is a similar problem with the KUBECONFIG
 * environment variable.
 *
 * If successful, both the given env and the global process.env will
 * be updated.
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fillInTheBlanks = async (env: Record<string, any>) => {
  try {
    fillInPATH(env)
  } catch (err) {
    debug('giving up trying to fill in PATH for kubectl', err)
  }

  try {
    await fillInKUBECONFIG(env)
  } catch (err) {
    debug('giving up trying to fill in KUBECONFIG for kubectl', err)
  }
}
