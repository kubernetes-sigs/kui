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

/* eslint-disable @typescript-eslint/no-use-before-define */

import * as Debug from 'debug'
import { basename, dirname, join } from 'path'

import { Capabilities, Commands, i18n, REPL, Tables, UI, Util } from '@kui-shell/core'

import { FinalState } from '../model/states'
import { KubeResource, Resource } from '../model/resource'
import { statusButton } from '../view/modes/status'
import { formatEntity } from '../view/formatEntity'
import generateForm from '../view/form'

const strings = i18n('plugin-k8s')
const debug = Debug('k8s/controller/kedit')

const usage = {
  kedit: {
    command: 'kedit',
    strict: 'kedit',
    docs: strings('keditUsageDocs'),
    example: 'kedit @seed/cloud-functions/function/echo.yaml',
    required: [{ name: 'file', file: true, docs: strings('keditUsageRequiredDocs') }],
    optional: [
      {
        name: 'resource',
        positional: true,
        docs: strings('keditUsageOptionalDocs')
      }
    ]
  }
}

/**
 * Show a customized view of a given yaml in the editor
 *
 */
const showResource = async (yaml: KubeResource, filepath: string, tab: UI.Tab) => {
  debug('showing one resource', yaml)

  if (Capabilities.inBrowser()) {
    UI.injectCSS({
      css: require('@kui-shell/plugin-k8s/web/css/main.css').toString(),
      key: 'kedit'
    })
  } else {
    const ourRoot = dirname(require.resolve('@kui-shell/plugin-k8s/package.json'))
    UI.injectCSS(join(ourRoot, 'web/css/main.css'))
  }

  // override the type shown in the sidecar header to show the
  // resource kind
  const typeOverride = yaml.kind
  const nameOverride = (resource: KubeResource) => (resource.metadata && resource.metadata.name) || basename(filepath)

  // add our mode buttons
  const resource = {
    kind: yaml.kind,
    filepathForDrilldown: filepath,
    resource: yaml
  }
  const addModeButtons = (defaultMode: string) => (response: Commands.CustomResponse) => {
    response.modes = (response.modes || []).concat([
      { mode: 'edit', direct: openAsForm },
      statusButton('kubectl', resource, FinalState.NotPendingLike),
      { mode: 'raw', label: 'YAML', direct: openInEditor }
    ])

    // adjust selected mode
    response.modes.forEach(spec => {
      if (spec.mode === defaultMode) {
        spec.defaultMode = true
      } else {
        spec.defaultMode = false
      }
    })

    return response
  }

  interface ResourceSource extends Resource {
    source: string
  }

  const { safeLoad, safeDump } = await import('js-yaml')

  /** re-extract the structure from raw yaml string */
  const extract = (rawText: string, entity?: ResourceSource): ResourceSource => {
    try {
      const resource = (editorEntity.resource = safeLoad(rawText))
      editorEntity.source = rawText
      editorEntity.name = resource.metadata.name
      editorEntity.kind = resource.kind

      if (entity) {
        entity.source = editorEntity.source
        entity.name = editorEntity.name
        entity.kind = editorEntity.kind
      }

      return entity
    } catch (err) {
      console.error('error parsing as yaml', err)
    }
  }

  const editorEntity = {
    name: yaml.metadata.name,
    kind: yaml.kind,
    lock: false, // we don't want a lock icon
    extract,
    filepath,
    source: safeDump(yaml),
    resource: yaml
  }

  /** open the content in the monaco editor */
  const openInEditor = () => {
    debug('openInEditor', yaml.metadata.name)

    return REPL.qexec(
      `edit !source --type "${typeOverride}" --name "${nameOverride(editorEntity.resource)}" --language yaml`,
      undefined,
      undefined,
      {
        parameters: editorEntity
      }
    ).then(addModeButtons('raw'))
  }

  /** open the content as a pretty-printed form */
  const openAsForm = () => {
    return Promise.resolve(
      generateForm(tab)(editorEntity.resource, filepath, nameOverride(editorEntity.resource), typeOverride, extract)
    ).then(addModeButtons('edit'))
  }

  // open as form by default
  return openAsForm()
}

/**
 * Render the resources as a REPL table
 *
 */
const showAsTable = async (yamls: KubeResource[], filepathAsGiven: string, parsedOptions): Promise<Tables.Table> => {
  debug('showing as table', yamls)

  const ourOptions = {
    'no-status': true,
    onclickFn: (kubeEntity: KubeResource) => {
      return evt => {
        evt.stopPropagation() // row versus name click handling; we don't want both
        return REPL.pexec(
          `kedit ${REPL.encodeComponent(filepathAsGiven)} ${REPL.encodeComponent(kubeEntity.metadata.name)}`
        )
      }
    }
  }

  return Promise.all(yamls.map(formatEntity(Object.assign({}, parsedOptions, ourOptions)))).then(formattedEntities => {
    return new Tables.Table({ body: formattedEntities })
  })
}

/**
 * kedit command handler
 *
 */
const kedit = async ({ tab, argvNoOptions, parsedOptions }: Commands.Arguments): Promise<Commands.Response> => {
  const idx = argvNoOptions.indexOf('kedit') + 1
  const filepathAsGiven = argvNoOptions[idx]
  const resource = argvNoOptions[idx + 1]
  const filepath = Util.findFile(Util.expandHomeDir(filepathAsGiven))
  debug('filepath', filepath)

  const { safeLoadAll: parseYAML } = await import('js-yaml')
  const { readFile } = await import('fs-extra') // 22ms or so to load fs-extra, so defer it

  try {
    const yamls = parseYAML((await readFile(filepath)).toString()).filter(x => x)
    debug('yamls', yamls)

    if (yamls.length === 0) {
      throw new Error('The specified file is empty')
    } else if (yamls.filter(({ apiVersion, kind }) => apiVersion && kind).length === 0) {
      debug('The specified file does not contain any Kubernetes resource definitions')
      return REPL.qexec(`edit "${filepathAsGiven}"`)
    } else if (yamls.length > 1 && !resource) {
      return showAsTable(yamls, filepathAsGiven, parsedOptions)
    } else {
      const yamlIdx = !resource ? 0 : yamls.findIndex(({ metadata }) => metadata && metadata.name === resource)
      if (yamlIdx < 0) {
        throw new Error('Cannot find the specified resource')
      } else {
        return showResource(yamls[yamlIdx], filepath, tab)
      }
    }
  } catch (err) {
    console.error('error parsing yaml')
    return REPL.qexec(`edit "${filepathAsGiven}"`)
  }
}

/**
 * Register the commands
 *
 */
const registration = (commandTree: Commands.Registrar) => {
  commandTree.listen('/k8s/kedit', kedit, {
    usage: usage.kedit,
    noAuthOk: ['openwhisk']
  })
}

export default registration
