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

import Debug from 'debug'

import { join } from 'path'
import { major, minor } from 'semver'
const debug = Debug('k8s/discovery/helm-client-version')

/**
 * Attempt to pick a local helm executable that is compatible with
 * what is running on the server
 *
 */
export default async (env): Promise<string> => {
  if (process.env.KUI_HELM_CLIENTS_DIR) {
    const { pathExists } = await import('fs-extra')

    debug('attempting to infer a matching helm client', env.KUBECONFIG, env.PATH)
    const { exec } = await import('child_process')

    const helmLatest = process.env.HELM_LATEST_VERSION
    const versionLine = await new Promise<string>((resolve, reject) => {
      try {
        exec(`${helmLatest} --short --server version`, { env }, (err, stdout, stderr) => {
          if (err) {
            console.error(stderr)
            console.error(err)
            reject(err)
          } else {
            resolve(stdout)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
    debug('versionLine', versionLine)

    if (versionLine.trim().length > 0) {
      // e.g. Server: v2.10.0+g9ad53aa
      const version = versionLine.replace(/Server: v(\d+\.\d+)/, '$1')
      debug('version', version)

      if (version.trim().length > 0) {
        const helmClient = `helm-${major(version)}.${minor(version)}`
        const helmClientPath = join(process.env.KUI_HELM_CLIENTS_DIR, helmClient)
        debug('helmClientPat', helmClientPath)

        if (pathExists(helmClientPath)) {
          return helmClientPath
        }
      }
    }
  } // intentional fall-through

  debug('using plain "helm"')
  return 'helm'
}
