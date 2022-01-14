/*
 * Copyright 2018 The Kubernetes Authors
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

import { Arguments } from '@kui-shell/core'

import { isRecursive, KubeOptions } from '../../controller/kubectl/options'

export interface TypedEntityName {
  type: string
  fqn: string
  actionName?: string
  packageName?: string
}

/**
 * If the given string is a Date, then return it in local time
 *
 */
export const maybeAsDate = str => {
  try {
    const localized = new Date(str).toLocaleString()
    if (localized === 'Invalid Date') {
      // oh well!
      return str
    } else {
      return localized
    }
  } catch (err) {
    // oh well!
    return str
  }
}

/**
 * Is the given filepath a directory?
 *
 */
export const isDirectory = (filepath: string): Promise<boolean> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<boolean>(async (resolve, reject) => {
    const { Capabilities } = await import('@kui-shell/core')
    if (Capabilities.inBrowser()) {
      resolve(false)
    } else {
      // why the dynamic import? being browser friendly here
      const { lstat } = await import('fs')

      lstat(filepath, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve(undefined)
          } else {
            reject(err)
          }
        } else {
          resolve(stats.isDirectory())
        }
      })
    }
  })

/**
 * Turn a resource object into an OpenWhisk fully qualified name. This
 * assumes that resources have been "spread" so that there is one
 * OpenWhisk asset per spec.
 *
 */
export const toOpenWhiskFQN = ({ kind, spec, metadata }): TypedEntityName => {
  if (kind === 'Function' || kind === 'Composition') {
    // FunctionSpec
    const actionName = spec.name || metadata.name
    const packageName = spec.package
    return {
      type: kind === 'Function' ? 'action' : 'app',
      packageName,
      actionName,
      fqn: packageName ? `${packageName}/${actionName}` : actionName
    }
  } else if (kind === 'Composition') {
    return { type: 'app', fqn: metadata.name }
  } else if (kind === 'Package' || kind === 'Rule' || kind === 'Trigger') {
    return { type: kind.toLowerCase(), fqn: metadata.name }
  } else {
    return { type: 'unknown', fqn: metadata.name }
  }
}

export class StatusError extends Error {}

export class TryLaterError extends StatusError {}

export class NotFoundError extends StatusError {
  public code: any // eslint-disable-line @typescript-eslint/no-explicit-any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(message: string, code: any = 404) {
    super(message)
    this.code = code
  }
}

export const getCommandFromArgs = (args: Pick<Arguments, 'argvNoOptions'>): string => {
  if (!args || !args.argvNoOptions) {
    return 'kubectl'
  }

  const cmd = args.argvNoOptions[0]
  return cmd === 'k' ? 'kubectl' : cmd
}

/**
 * Check if the command has verb but not resource. e.g. kubectl get
 * This is a special case since kubectl returns error instead of usage
 *
 */
export const commandWithoutResource = (args: Arguments<KubeOptions>) => {
  return args.argvNoOptions.length === 2
}
/**
 * formulate a `apply -f` or `get -f` command based on args
 *
 */
export function formDashFileCommandFromArgs(
  args: Arguments<KubeOptions>,
  namespace: string,
  filepath: string,
  verb: string
) {
  const cmd = getCommandFromArgs(args)
  const recursive = isRecursive(args) ? '-r' : undefined
  return [cmd === 'k' ? 'kubectl' : cmd, verb, '-n', namespace, '-f', recursive, filepath].filter(_ => _).join(' ')
}

/**
 * Remove the last applied config informaiton for diff
 *
 */
export function removeLastAppliedConfig(yaml: string) {
  const lines = yaml.split('\n')
  const lastAppliedConfigLineIdx = lines
    .map((_, idx) => {
      if (_.includes('last-applied-configuration')) {
        return idx
      }
    })
    .filter(_ => _)

  return lines
    .filter((_, idx) => !lastAppliedConfigLineIdx.includes(idx) && !lastAppliedConfigLineIdx.includes(idx - 1))
    .join('\n')
}
