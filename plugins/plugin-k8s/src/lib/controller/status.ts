/*
 * Copyright 2018-19 IBM Corporation
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

import { basename, join } from 'path'
import { safeLoadAll as parseYAML } from 'js-yaml'

import { findFile } from '@kui-shell/core/core/find-file'
import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command'
import { ExecOptions, ParsedOptions } from '@kui-shell/core/models/execOptions'
import { Row, Table, formatWatchableTable } from '@kui-shell/core/webapp/models/table'
import { CodedError } from '@kui-shell/core/models/errors'
import repl = require('@kui-shell/core/core/repl')

import { withRetryOn404 } from '../util/retry'
import { flatten, isDirectory } from '../util/util'

import { KubeResource } from '../model/resource'
import { States, FinalState } from '../model/states'

import { formatEntity } from '../view/formatEntity'

const debug = Debug('k8s/controller/status')

const usage = (command: string) => ({
  command,
  strict: command,
  docs: 'Check the deployment status of a set of resources',
  onlyEnforceOptions: true,
  optional: [
    {
      name: 'file|kind',
      file: true,
      positional: true,
      docs: 'A kubernetes resource file or kind'
    },
    {
      name: 'resourceName',
      positional: true,
      docs: 'The name of a kubernetes resource of the given kind'
    },
    { name: '--final-state', hidden: true }, // when do we stop polling for status updates?
    { name: '--namespace', alias: '-n', docs: 'Inspect a specified namespace' },
    {
      name: '--watch',
      alias: '-w',
      docs: 'After listing/getting the requested object, watch for changes'
    }
  ],
  example: `kubectl ${command} @seed/cloud-functions/function/echo.yaml`
})

/*
 * format a header row
 *
 */
const formatHeader = (kind?: string): Row => {
  const kindAttr = [{ value: 'KIND', outerCSS: 'not-too-wide entity-kind' }]

  // format a namespace attribute for all kinds except namespace
  const namespaceAttr =
    kind && kind.match(/(ns|Namespace)/i) ? [] : [{ value: 'NAMESPACE', outerCSS: 'pretty-narrow hide-with-sidecar' }]

  const attributes = kindAttr
    .concat(namespaceAttr)
    .concat([
      { value: 'STATUS', outerCSS: 'header-cell badge-width' },
      { value: 'MESSAGE', outerCSS: 'not-too-wide hide-with-sidecar min-width-date-like' }
    ])

  return {
    type: 'status',
    name: 'NAME',
    attributes
  }
}

/**
 * In case of an error fetching the status of an entity, return something...
 *
 */
const errorEntity = (execOptions: ExecOptions, base: KubeResource, backupNamespace?: string) => (err: CodedError) => {
  debug('creating error entity', err.code, base, backupNamespace, err)

  if (!base) {
    base = {
      apiVersion: undefined,
      kind: undefined,
      metadata: { name: undefined, namespace: backupNamespace }
    }
  } else if (!base.metadata) {
    base.metadata = { name: undefined, namespace: backupNamespace }
  } else if (!base.metadata.namespace) {
    base.metadata.namespace = backupNamespace
  }

  if (err.code === 404) {
    return Object.assign({}, base, {
      status: {
        state: States.Offline,
        message: 'resource has been deleted'
      }
    })
  } else {
    if (execOptions.raw) {
      throw err
    } else {
      return Object.assign({}, base, {
        status: {
          state: States.Failed,
          message: 'error fetching resource'
        }
      })
    }
  }
}

/**
 * Get the status of those entities referenced directly, either:
 *
 *   1. of a given kind,name
 *   2. across files in a given directory
 *   3. in a given file (local or remote)
 *
 */

interface FinalStateOptions extends ParsedOptions {
  'final-state': FinalState
}

const getDirectReferences = async (
  name: string,
  file: string,
  namespace: string,
  finalState: FinalState,
  execOptions: ExecOptions
) => {
  const raw = Object.assign({}, execOptions, { raw: true })
  // debug('getDirectReferences', file, name)

  /** format a --namespace cli option for the given kubeEntity */
  const ns = ({ metadata = {} } = {}) => {
    debug('ns', metadata['namespace'], namespace)
    return metadata['namespace'] ? `-n "${metadata['namespace']}"` : namespace ? `-n ${namespace}` : ''
  }

  // TODO: does this guard enough?
  if (name) {
    //
    // then the user has asked for the status of a named resource
    //
    const kind = file
    const command = `kubectl get "${kind}" "${name || ''}" ${ns()} -o json`
    debug('status by kind and name', command)

    // note: don't retry the getter on 404 if we're expecting the
    // element (eventually) not to exist
    const getter = () => {
      return repl.qexec(command, undefined, undefined, raw)
    }

    const kubeEntity = !finalState || finalState === FinalState.OfflineLike ? getter() : withRetryOn404(getter, command)

    if (execOptions.raw) {
      return kubeEntity
    } else {
      debug('kubeEntity', kubeEntity)
      return {
        header: formatHeader(kind),
        entities: [kubeEntity]
      }
    }
  } else {
    const filepath = findFile(file)
    const isURL = file.match(/^http[s]?:\/\//)
    const isDir = isURL ? false : await isDirectory(filepath)

    // debug('status by filepath', file, filepath, isURL, isDir)
    // then the user has pointed us to a yaml file
    // TODO: need tests
    if (isDir) {
      // this is a directory of yamls
      debug('status of directory', filepath)

      // why the dynamic import? being browser friendly here
      const { readdir } = await import('fs-extra')

      const files: string[] = await readdir(filepath)
      const yamls = files.filter(_ => _.match(/^[^\\.#].*\.yaml$/)).map(file => join(filepath, file))

      if (files.find(file => file === 'seeds')) {
        const seedsDir = join(filepath, 'seeds')
        if (await isDirectory(seedsDir)) {
          const seeds: string[] = (await readdir(seedsDir)).filter(_ => _.match(/\.yaml$/))
          seeds.forEach(file => yamls.push(join(filepath, 'seeds', file)))
        }
      }

      const main = yamls.find(_ => _.match(/main.yaml$/))
      const yamlsWithMainFirst = (main ? [main] : []).concat(yamls.filter(_ => !_.match(/main.yaml$/)))

      // make a list of tables, recursively calling ourselves for
      // each yaml file in the given directory
      return Promise.all(
        yamlsWithMainFirst.map(filepath =>
          repl.qexec(`k status "${filepath}" --final-state ${finalState}`, undefined, undefined, execOptions)
        )
      )
    } else if (isDir === undefined) {
      // TODO: need tests
      // then the file does not exist; maybe the user specified a resource kind, e.g. k status pods
      debug('status by resource kind', file, name)

      const kubeEntities = repl
        .qexec(`kubectl get "${file}" "${name || ''}" ${ns()} -o json`, undefined, undefined, raw)
        .catch(err => {
          if (err.code === 404) {
            // then no such resource type exists
            throw err
          } else {
            return errorEntity(execOptions, undefined, namespace)(err)
          }
        })

      if (execOptions.raw) {
        return kubeEntities
      } else {
        return {
          header: formatHeader(file),
          entities: kubeEntities
        }
      }
    } else {
      // then the user has pointed us to a yaml file
      debug('status by file', file)

      // handle !spec
      const passedAsParameter = !isURL && filepath.match(/\/(!.*$)/)

      const { fetchFileString } = await import('../util/fetch-file')
      const specs: KubeResource[] = (passedAsParameter
        ? parseYAML(execOptions.parameters[passedAsParameter[1].slice(1)]) // yaml given programatically
        : flatten((await fetchFileString(file)).map(_ => parseYAML(_)))
      ).filter(_ => _) // in case there are empty paragraphs;
      debug('specs', specs)

      const kubeEntities = Promise.all(
        specs.map(spec => {
          return repl
            .qexec(`kubectl get "${spec.kind}" "${spec.metadata.name}" ${ns(spec)} -o json`, undefined, undefined, raw)
            .catch(errorEntity(execOptions, spec, namespace))
        })
      )

      // make a table where the rows are the paragraphs in the yaml file
      if (execOptions.raw) {
        return kubeEntities
      } else {
        // debug('kubeEntities', await kubeEntities)
        return {
          header: formatHeader(),
          entities: kubeEntities
        }
      }
    }
  }
}

/**
 * k status command handler
 *
 */
export const status = (command: string) => async ({
  execOptions,
  argvNoOptions,
  parsedOptions,
  command: fullCommand
}: EvaluatorArgs) => {
  const idx = argvNoOptions.indexOf(command) + 1
  const fileOrKind = argvNoOptions[idx]
  const name = argvNoOptions[idx + 1]
  const namespace = parsedOptions.namespace || parsedOptions.n || 'default'
  const finalState: FinalState = (parsedOptions as FinalStateOptions)['final-state'] || FinalState.NotPendingLike

  const directReferences = await getDirectReferences(name, fileOrKind, namespace, finalState, execOptions)

  debug('getDirectReferences', directReferences)
  const maybe = await (directReferences.entities || directReferences)
  const directEntities = await (Array.isArray(maybe) ? Promise.all(maybe) : [maybe])

  if (execOptions.raw) {
    return directReferences
  } else {
    const formattedEntities = directEntities.map(entity => {
      if (!entity.metadata) return entity
      return formatEntity(parsedOptions)(entity)
    })

    debug('formattedEntities', formattedEntities)

    if (directReferences.header) {
      const doWatch = parsedOptions.watch || parsedOptions.w
      const refreshCommand = fullCommand.replace('--watch', '').replace('-w', '')

      const table: Table = {
        body: formattedEntities,
        header: directReferences.header,
        title: fileOrKind && basename(fileOrKind).replace(/\.yaml$/, ''),
        noSort: true
      }

      return doWatch ? formatWatchableTable(table, { refreshCommand, watchByDefault: true }) : table
    } else {
      return formattedEntities
    }
  }
}

/**
 * Register the commands
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/k8s/status', status('status'), {
    usage: usage('status'),
    inBrowserOk: true,
    noAuthOk: ['openwhisk']
  })
}
