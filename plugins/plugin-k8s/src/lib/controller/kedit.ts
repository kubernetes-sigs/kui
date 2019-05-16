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
const debug = Debug('k8s/controller/kedit')
debug('loading')

import { basename, dirname, join } from 'path'
import expandHomeDir = require('expand-home-dir')

import { inBrowser } from '@kui-shell/core/core/capabilities'
import { CommandRegistrar, IEvaluatorArgs, ParsedOptions } from '@kui-shell/core/models/command'
import { IExecOptions } from '@kui-shell/core/models/execOptions'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { findFile } from '@kui-shell/core/core/find-file'
import repl = require('@kui-shell/core/core/repl')
import { Row, Table } from '@kui-shell/core/webapp/models/table'

import { FinalState } from '../model/states'
import { IKubeResource, IResource } from '../model/resource'

import { redactYAML } from '../view/redact'
import { statusButton } from '../view/modes/status'
import { formatEntity } from '../view/formatEntity'
import { IFormGroup, IFormElement, generateForm } from '../view/form'

const usage = {
  kedit: {
    command: 'kedit',
    strict: 'kedit',
    docs: 'Edit a resource definition file',
    example: 'kedit @seed/cloud-functions/function/echo.yaml',
    required: [
      { name: 'file', file: true, docs: 'A kubernetes resource file or kind' }
    ],
    optional: [
      { name: 'resource', positional: true, docs: 'A resource within the file to view' }
    ]
  }
}

/**
 * Show a customized view of a given yaml in the editor
 *
 */
const showResource = async (yaml, filepath: string, parsedOptions: ParsedOptions, execOptions: IExecOptions) => {
  debug('showing one resource', yaml)

  if (inBrowser()) {
    injectCSS({ css: require('@kui-shell/plugin-k8s/web/css/main.css').toString(), key: 'kedit' })
  } else {
    const ourRoot = dirname(require.resolve('@kui-shell/plugin-k8s/package.json'))
    injectCSS(join(ourRoot, 'web/css/main.css'))
  }

  // override the type shown in the sidecar header to show the
  // resource kind
  const typeOverride = yaml.kind
  const nameOverride = (resource: IKubeResource) => (resource.metadata && resource.metadata.name) || basename(filepath)

  // add our mode buttons
  const resource = { kind: yaml.kind, filepathForDrilldown: filepath, yaml }
  const addModeButtons = (defaultMode: string) => response => {
    response['modes'] = (response['modes'] || []).concat([
      { mode: 'edit', direct: openAsForm },
      { mode: 'raw', direct: openInEditor },
      statusButton('kubectl', resource, FinalState.NotPendingLike)
    ])

    response['modes'].find(({ mode }) => mode === defaultMode).defaultMode = true

    return response
  }

  interface Resource extends IResource {
    source: string
  }

  /** re-extract the structure from raw yaml string */
  const extract = (rawText: string, entity?: Resource): Resource => {
    const resource = editorEntity.yaml = require('js-yaml').safeLoad(rawText)
    editorEntity.source = rawText
    editorEntity.name = resource.metadata.name
    editorEntity.kind = resource.kind

    if (entity) {
      entity.source = editorEntity.source
      entity.name = editorEntity.name
      entity.kind = editorEntity.kind
    }

    return entity
  }

  const { safeDump } = await import('js-yaml')
  const editorEntity = {
    name: yaml.metadata.name,
    kind: yaml.kind,
    lock: false, // we don't want a lock icon
    extract,
    filepath,
    source: redactYAML(safeDump(yaml)),
    yaml
  }

  /** open the content in the monaco editor */
  const openInEditor = () => {
    debug('openInEditor', yaml.metadata.name)

    return repl.qexec(`edit !source --type "${typeOverride}" --name "${nameOverride(editorEntity.yaml)}" --language yaml`,
                      undefined, undefined, {
                        parameters: editorEntity
                      })
      .then(addModeButtons('raw'))
  }

  /** open the content as a pretty-printed form */
  const openAsForm = () => {
    return Promise.resolve(generateForm(parsedOptions)(editorEntity.yaml, filepath, nameOverride(editorEntity.yaml), typeOverride, extract))
      .then(addModeButtons('edit'))
  }

  // open as form by default
  return openAsForm()
}

/**
 * Render the resources as a REPL table
 *
 */
const showAsTable = (yamls: Array<any>, filepathAsGiven: string, parsedOptions): Table => {
  debug('showing as table', yamls)

  const ourOptions = {
    'no-status': true,
    onclickFn: kubeEntity => {
      return evt => {
        evt.stopPropagation() // row versus name click handling; we don't want both
        return repl.pexec(`kedit ${repl.encodeComponent(filepathAsGiven)} ${repl.encodeComponent(kubeEntity.metadata.name)}`)
      }
    }
  }

  return new Table({
    body: yamls.map(formatEntity(Object.assign({}, parsedOptions, ourOptions)))
  })
}

/**
 * kedit command handler
 *
 */
const kedit = async ({ execOptions, argv, argvNoOptions, parsedOptions }: IEvaluatorArgs) => {
  const idx = argvNoOptions.indexOf('kedit') + 1
  const filepathAsGiven = argvNoOptions[idx]
  const resource = argvNoOptions[idx + 1]
  const filepath = findFile(expandHomeDir(filepathAsGiven))
  debug('filepath', filepath)

  const { safeLoadAll: parseYAML } = await import('js-yaml')
  const { readFile } = await import('fs-extra') // 22ms or so to load fs-extra, so defer it
  const yamls = parseYAML(await readFile(filepath)).filter(x => x)
  debug('yamls', yamls)

  if (yamls.length === 0) {
    throw new Error('The specified file is empty')
  } else if (yamls.filter(({ apiVersion, kind }) => apiVersion && kind).length === 0) {
    debug('The specified file does not contain any Kubernetes resource definitions')
    return repl.qexec(`edit "${filepathAsGiven}"`)
  } else if (yamls.length > 1 && !resource) {
    return showAsTable(yamls, filepathAsGiven, parsedOptions)
  } else {
    const yamlIdx = !resource ? 0 : yamls.findIndex(({ metadata: { name } }) => name === resource)
    if (yamlIdx < 0) {
      throw new Error('Cannot find the specified resource')
    } else {
      return showResource(yamls[yamlIdx], filepath, parsedOptions, execOptions)
    }
  }

  return true
}

/**
 * Register the commands
 *
 */
const registration = (commandTree: CommandRegistrar) => {
  commandTree.listen('/k8s/kedit', kedit, {
    usage: usage.kedit,
    noAuthOk: [ 'openwhisk' ]
  })
}

export default registration
