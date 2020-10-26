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

import Debug from 'debug'
import { readFileSync } from 'fs'
import { Action as RawAction, Exec as RawExec, Sequence, Kind, Dict, Limits } from 'openwhisk'

import {
  findFile,
  expandHomeDir,
  eventChannelUnsafe,
  isHeadless,
  Arguments,
  ParsedOptions,
  ExecOptions,
  Registrar
} from '@kui-shell/core'

import ok from '../ok'
import fqn from '../fqn'
import respondWith from './as-action'
import { synonyms } from '../../models/synonyms'
import { KeyValOptions, kvOptions } from '../key-value'
import { clientOptions, getClient } from '../../client/get'
import { actionMix, deployedAction, sourceFile, withStandardOptions } from '../usage'

const debug = Debug('openwhisk/actions/create')

interface Options extends ParsedOptions {
  web?: boolean
  copy?: boolean
  native?: boolean
  sequence?: boolean
  docker?: string
  namespace?: string
  kind?: Kind
  main?: string
  'content-type'?: string
}

interface Exec extends RawExec {
  main?: string
}

interface BBExec extends Exec {
  kind: Kind // | 'blackbox'
  image?: string
}

/** the openwhisk npm isn't complete here */
interface Action extends RawAction {
  exec: Exec | Sequence
}

interface Spec {
  name: string
  namespace?: string
  action: Action
  kind?: Kind
  overwrite: boolean
  params?: Dict
  annotations?: Dict
  limits?: Limits
  version?: string
}

const extensionToKind = {
  jar: 'java:default',
  js: 'nodejs:default',
  py: 'python:default'
}

async function prepareForCopy(
  src: string,
  dest: string,
  kvOptions: KeyValOptions,
  execOptions: ExecOptions
): Promise<Spec> {
  debug('action copy SRC', src, 'DEST', dest)

  const action = await getClient(execOptions).actions.get(Object.assign({ name: src }, clientOptions))

  if (kvOptions.parameters && !action.parameters) {
    action.parameters = kvOptions.parameters
  } else if (kvOptions.parameters) {
    action.parameters = action.parameters.concat(kvOptions.parameters)
  }

  if (kvOptions.annotations && !action.annotations) {
    action.annotations = kvOptions.annotations
  } else if (kvOptions.annotations) {
    action.annotations = action.annotations.concat(kvOptions.annotations)
  }

  return {
    name: dest,
    action,
    overwrite: true
  }
}

function hasCode(exec: Exec | Sequence): exec is Exec {
  return (exec as Exec).code !== undefined
}

async function spec(
  name: string,
  fileName: string,
  verb: string,
  overwrite: boolean,
  options: Options,
  kvOptions: KeyValOptions,
  { execOptions, REPL }: Arguments
): Promise<Spec> {
  const action: Spec = {
    name,
    action: execOptions.entity
      ? execOptions.entity.action
      : verb === 'update'
      ? await REPL.rexec(`wsk action get "${name}"`).catch(() => ({
          name,
          limits: {}
        }))
      : {
          name,
          exec: {
            kind: options.kind || 'nodejs:10',
            code: ''
          },
          parameters: kvOptions.parameters,
          annotations: kvOptions.annotations,
          limits: kvOptions.limits
        },
    overwrite
  }

  if (verb === 'update') {
    action.action.annotations = (action.action.annotations || []).concat(kvOptions.annotations)
    action.action.parameters = (action.action.annotations || []).concat(kvOptions.parameters)
    if (kvOptions.limits.timeout) {
      if (!action.action.limits) {
        action.action.limits = {}
      }
      action.action.limits.timeout = kvOptions.limits.timeout
    }
    if (kvOptions.limits.memory) {
      if (!action.action.limits) {
        action.action.limits = {}
      }
      action.action.limits.memory = kvOptions.limits.memory
    }
    if (kvOptions.limits.logs) {
      if (!action.action.limits) {
        action.action.limits = {}
      }
      action.action.limits.logs = kvOptions.limits.logs
    }
  }

  if (options.web) {
    action.annotations.push({ key: 'web-export', value: true })

    if (options['content-type']) {
      action.annotations.push({
        key: 'content-type-extension',
        value: options['content-type']
      })
    }
  }

  if (options.sequence) {
    action.action.exec = {
      kind: 'sequence',
      components: fileName.split(/,\s*/).map(fqn) // split by commas, and we need fully qualified names
    }
  } else if (options.copy) {
    // copying an action
    return prepareForCopy(fileName, name, kvOptions, execOptions)
  } else if (verb !== 'update' || fileName) {
    // for action create, or update and the user gave a
    // positional param... find the input file
    if (options.docker) {
      // blackbox action
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(action.action.exec as any).kind = 'blackbox'
      ;(action.action.exec as BBExec).image = options.docker
    }

    if (fileName) {
      // find the file
      const filepath = findFile(expandHomeDir(fileName))
      const isZip = fileName.endsWith('.zip')
      const isJar = fileName.endsWith('.jar')
      const isBinary = isZip || isJar
      const encoding = isBinary ? 'base64' : 'utf8'

      if (fileName.charAt(0) === '!') {
        // read the file from execOptions
        const key = fileName.slice(1)
        const code = execOptions && execOptions.parameters[key]
        if (!action.action.exec) {
          action.action.exec = {
            kind: options.kind || 'nodejs:10',
            code
          }
        } else {
          ;(action.action.exec as Exec).code = code
        }

        // remove traces of this from params
        if (execOptions.parameters) delete execOptions.parameters[key]
        // action.parameters = toDict(action.parameters.filter(({ key: otherKey }) => key !== otherKey))

        debug('code passed programmatically', options.action, execOptions)
        if (!hasCode(action.action.exec)) {
          debug('Could not find code', execOptions)
          throw new Error('Could not find code')
        }
      } else {
        const code = readFileSync(filepath).toString(encoding)
        if (!action.action.exec) {
          action.action.exec = {
            kind: options.kind || 'nodejs:10',
            code
          }
        } else {
          ;(action.action.exec as Exec).code = code
        }
      }

      // action.annotations.push({ key: 'file', value: filepath })

      if (isBinary) {
        // add an annotation to indicate that this is a managed action
        action.action.annotations.push({
          key: 'wskng.combinators',
          value: [
            {
              type: 'action.kind',
              role: 'replacement',
              badge: isZip ? 'zip' : 'jar'
            }
          ]
        })
        ;(action.action.exec as Exec).binary = true
      }

      if (options.native) {
        // native code blackbox action
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(action.action.exec as any).kind = 'blackbox'
        ;(action.action.exec as BBExec).image = 'openwhisk/dockerskeleton'
      }

      eventChannelUnsafe.emit('/openwhisk/action/update', {
        file: filepath,
        action: { name: options.name, namespace: options.namespace }
      })

      // set the default kind
      if (!action.action.exec.kind || isJar) {
        if (options.kind) {
          action.action.exec.kind = options.kind
        } else {
          const extension = filepath.substring(filepath.lastIndexOf('.') + 1)
          if (extension) {
            action.action.exec.kind = extensionToKind[extension] || extension
          }
        }
      }
    }
  }

  if (action.action.exec && Object.keys(action.action.exec).length === 0) {
    // then we must remove options.exec; the backend fails if an empty struct is passed
    delete action.action.exec
  }

  if (options.main && action.action.exec) {
    // main method of java actions
    ;(action.action.exec as Exec).main = options.main
  }

  return Object.assign(action, clientOptions)
}

const docker = [{ name: '--docker', docs: 'use a dockerhub image for the action' }]

export const createUsage = withStandardOptions({
  command: 'create',
  docs: 'create a new action',
  strict: 'create',
  example: 'wsk action create <action> <sourceFile>',
  required: [{ name: 'name', docs: 'the name of your new action' }],
  optional: sourceFile.concat(docker).concat(actionMix)
})

export const updateUsage = withStandardOptions({
  command: 'update',
  docs: 'update an existing action, or create one if it does not exist',
  strict: 'update',
  example: 'wsk action update <action> [sourceFile]',
  required: deployedAction,
  optional: sourceFile.concat(docker).concat(actionMix)
})

const doCreate = (verb: string, overwrite: boolean) => async (args: Arguments<Options>) => {
  const { argv, parsedOptions, execOptions } = args

  const { kv, argvNoOptions, nameIdx } = kvOptions(argv, verb)
  const name = argvNoOptions[nameIdx]
  const fileName = argvNoOptions[nameIdx + 1]

  const raw = await getClient(execOptions).actions.create(
    await spec(name, fileName, verb, overwrite, parsedOptions, kv, args)
  )

  if (isHeadless()) {
    return ok(`updated action ${name}`)
  } else {
    return respondWith(raw)
  }
}

export default (registrar: Registrar) => {
  synonyms('actions').forEach(syn => {
    registrar.listen(`/wsk/${syn}/create`, doCreate('create', false), createUsage)
    registrar.listen(`/wsk/${syn}/update`, doCreate('update', true), updateUsage)
  })
}
