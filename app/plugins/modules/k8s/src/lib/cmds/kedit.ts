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

const debug = require('debug')('k8s/cmds/kedit')
debug('loading')

import { basename, dirname, join } from 'path'
import expandHomeDir = require('expand-home-dir')

import { inBrowser } from '@kui/core/capabilities'
import { PluginRegistration, PluginRequire } from '@kui/models/plugin'
import { injectCSS } from '@kui/webapp/util/inject'
import { findFile } from '@kui/core/find-file'
import repl = require('@kui/core/repl')

import { IFormGroup, IFormElement, generateForm } from './form'
import { formatEntity } from '../util/formatEntity'
import { FinalState } from './states'
import { statusButton } from './modes'

import { redactYAML } from '../formatters/redact'

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
const showResource = async (yaml, filepath: string, parsedOptions, execOptions) => {
  debug('showing one resource', yaml)

  if (inBrowser()) {
    injectCSS({ css: require('../../../web/css/main.css').toString(), key: 'kedit' })
  } else {
    const ourRoot = dirname(require.resolve('@kui-plugin-src/wskflow/package.json'))
    injectCSS(join(ourRoot, 'web/css/main.css'))
  }

  // override the type shown in the sidecar header to show the
  // resource kind
  const typeOverride = yaml.kind
  let nameOverride = (yaml.metadata && yaml.metadata.name) || basename(filepath)

  // custom hacks now for seed
  if (yaml.spec && yaml.spec.service) {
    nameOverride = yaml.spec.service
  }

  const formGroups: Array<IFormGroup> = []
  const push = (group: string, key: string, { parent = yaml, path = [key], skip = {} } = {}) => {
    const formGroup = formGroups.find(({ title }) => title === group)
      || { title: group, choices: [] }

    const { choices } = formGroup

    if (choices.length === 0) {
      // then we just created a new group
      formGroups.push(formGroup)
    }

    //
    // for each element of the structure, either render a leaf
    // choice or recurse into a subtree
    //
    const struct = parent[key]
    for (let key in struct) {
      if (!skip[key]) {
        const value = struct[key]
        const next = path.concat([key]) // path to this leaf or subtree

        if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
          // leaf node
          choices.push({ key, value, path: next })
        } else if (!Array.isArray(value)) { // not sure what to do with arrays, yet
          // subtree: descend recursively
          // note how we intentionally flatten, for now
          push(key, key, { parent: struct, path: next })
        }
      }
    }
  }

  //
  // for now, we pick which subtrees we want to offer as choices:
  // metadata, spec, and data; note that we place metadata and spec
  // in the same group: 'Resource Definition'
  //
  push('Resource Definition', 'metadata')
  push('Resource Definition', 'spec', { skip: { service: true } })
  push('Data Values', 'data')

  // add our mode buttons
  const resource = { kind: yaml.kind, filepathForDrilldown: filepath }
  const addModeButtons = (defaultMode: string) => response => {
    response['modes'] = [
      { mode: 'edit', direct: openInEditor },
      { mode: 'configure', direct: openAsForm(filepath) },
      statusButton('kubectl', resource, FinalState.NotPendingLike)
    ]

    response['modes'].find(({ mode }) => mode === defaultMode).defaultMode = true

    return response
  }

  /** open the content in the monaco editor */
  const openInEditor = () => {
    debug('openInEditor')

    const { safeDump } = require('js-yaml')
    return repl.qexec(`edit !source --type "${typeOverride}" --name "${nameOverride}" --language yaml`,
                      undefined, undefined, {
                        parameters: {
                          name: basename(filepath),
                          source: redactYAML(safeDump(yaml))
                        }
                      })
      .then(addModeButtons('edit'))
  }

  /** open the content as a pretty-printed form */
  const openAsForm = (filepath: string) => () => {
    return Promise.resolve(generateForm(parsedOptions)(yaml, filepath, nameOverride, typeOverride, formGroups))
      .then(addModeButtons('configure'))
  }

  return openInEditor()

  /*return repl.qexec(`edit !source ${typeOverride} ${nameOverride} --language yaml`,
    undefined, undefined, {
    parameters: {
    name: basename(filepath),
    source: safeDump(yamlSubset),
    persister: {
    saveString: 'Save',
    save: async (wsk, action, editor) => {
    try {
    const updatedYAML = parseYAML(editor.getValue())[0];
    const yamlToSave = Object.assign({}, yaml, updatedYAML);
    delete yamlToSave.persister
    debug('saving', yamlToSave)
    await writeFile(filepath, safeDump(yamlToSave));
    return action;
    } catch (err) {
    console.error(err);
    throw err;
    }
    },
    revert: (wsk, action) => {
    debug('reverting')
    action.exec.code = safeDump(yamlSubset);
    return Promise.resolve(action);
    }
    }
    }
    });*/
}

/**
 * Render the resources as a REPL table
 *
 */
const showAsTable = (yamls: Array<any>, filepathAsGiven: string, parsedOptions) => {
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

  return yamls.map(formatEntity(Object.assign({}, parsedOptions, ourOptions)))
}

/**
 * kedit command handler
 *
 */
const kedit = async ({ execOptions, argv, argvNoOptions, parsedOptions }) => {
  const idx = argvNoOptions.indexOf('kedit') + 1
  const filepathAsGiven = argvNoOptions[idx]
  const resource = argvNoOptions[idx + 1]
  const filepath = findFile(expandHomeDir(filepathAsGiven))
  debug('filepath', filepath)

  const { safeLoadAll: parseYAML } = require('js-yaml')
  const { readFile } = await import('fs-extra') // 22ms or so to load fs-extra, so defer it
  const yamls = parseYAML(await readFile(filepath))
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
const registration: PluginRegistration = (commandTree, prequire: PluginRequire, options?): Promise<any> => {
  commandTree.listen('/k8s/kedit', kedit, {
    usage: usage.kedit,
    noAuthOk: [ 'openwhisk' ]
  })

  return Promise.resolve()
}

export default registration
