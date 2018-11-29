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

const debug = require('debug')('seed/get/demos')

import { file as tmpFile } from 'tmp'
import { writeFile } from 'fs-extra'
import { basename, dirname, join } from 'path'
import { safeLoadAll as parseYAML, safeDump } from 'js-yaml'
import { parse as parseURL } from 'url'
import needle = require('needle')

import { isDirectory, pathExists, readFile } from './fs-utils'
import { IResource,
         createResourceButton, deleteResourceButton,
         statusButton, renderStatus, insertView, renderAndViewStatus } from '../../../../k8s/plugin/lib/cmds/modes'

import marked = require('marked')

import { inBrowser } from '../../../../../../build/core/capabilities'
import { findFile } from '../../../../../../build/core/find-file'
import repl = require('../../../../../../build/core/repl')

const rootDirectory = dirname(require.resolve('../../../package.json'))
const relativeDemoDirectory = '@seed'
const demoDirectory = join(rootDirectory, relativeDemoDirectory)

import { State, States, FinalState, state2Traffic, rendering as stateRendering } from '../../../../k8s/plugin/lib/cmds/states'

/**
 * Fetch a source URI
 *
 */
const fetch = async (uri: string): Promise<string> => {
  const { host } = parseURL(uri)
  const options = {}

  // see if we need to use a repo token
  const tokenModel = await repl.qexec(`kubectl get secret "${host}" -o json`,
                                      undefined, undefined, { raw: true })
  if (tokenModel) {
    const token = new Buffer(tokenModel.data.token, 'base64').toString()
    debug('fetch token', token)

    options['headers'] = {
      Authorization: `token ${token}`
    }
  }

  debug('fetch uri', uri, options)
  return needle('get', uri, options).then(_ => _.body.toString())
}

/**
 * Turn composer source into composer IR
 *
 */
const compose = async (source: string) => new Promise((resolve, reject) => {
  tmpFile(async (err, localCodePath, fd, cleanupCallback) => {
    if (err) {
      reject(err)
    } else {
      await writeFile(localCodePath, source)

      const ir = await repl.qexec(`app lang nodejs compose impl`, undefined, undefined, {
        parameters: {
          localCodePath,
          source
        }
      })

      resolve(ir)
    }
  })
})

/**
 * seed get demo impl
 *
 */
const get = (command: string, prequire) => async ({ argvNoOptions }) => {
  const filepathAsGiven = argvNoOptions[argvNoOptions.indexOf(command) + 1]
  debug('get filepathAsGiven', filepathAsGiven)

  const filepathBeforeFlattening = filepathAsGiven && findFile(filepathAsGiven)
  debug('get filepathBeforeFlattening', filepathBeforeFlattening)

  //
  // for seed get demo @seed/applications/twc-flu -> add /seed.yaml suffix
  //
  const flattenable = await isFlattenable(filepathBeforeFlattening)
  const filepath = flattenable ? join(filepathBeforeFlattening, 'seeds', 'main.yaml') : filepathBeforeFlattening
  const filepathForDrilldown = flattenable ? join(filepathAsGiven, 'seeds') : filepathAsGiven
  debug('get filepath', filepath, flattenable)

  const isDir = filepathAsGiven && await isDirectory(filepath)

  if (!filepathAsGiven || isDir) {
    // then the user asked for a list of demos
    debug('get diverting to list')
    return list(command)({ argvNoOptions })
  } else {
    debug('get is not a list')
  }

  const mainModel = !inBrowser()
    ? (await readFile(filepath)).toString()
    : require('!!raw-loader!../../../@seed/' + filepathAsGiven.substring(filepathAsGiven.indexOf('/') + 1))
  debug('mainModel', mainModel)

  /** any compositions? */
  const yamls: Array<any> = parseYAML(mainModel)
  const compositions: Array<any> = await Promise.all(yamls
                                                     .filter(_ => _) // in case there are empty paragraphs
                                                     .filter(({ kind }) => kind === 'Composition')
                                                     .map(({ metadata, spec: { name, compositionURI, composition } }) => {
                                                       debug('composition?', composition, compositionURI)
                                                       return {
                                                         name: name || metadata.name,
                                                         composition: composition ? JSON.parse(composition) : fetch(compositionURI).then(compose)
                                                       }
                                                     }))

  const renderComposition = () => new Promise(async (resolve, reject) => {
    if (compositions.length > 0) {
      const { visualize } = await prequire('wskflow')

      const rule = yamls.find(({ kind, spec }) => {
        return kind === 'Rule' && spec.action === compositions[0].name
      })

      const { view, controller } = await visualize(await compositions[0].composition,
                                                   undefined, undefined, undefined, undefined, undefined,
                                                   rule && {
                                                     action: {
                                                       name: rule.spec.action,
                                                       path: ''
                                                     },
                                                     trigger: {
                                                       name: rule.spec.trigger,
                                                       path: ''
                                                     }
                                                   })
      debug('view', view)

      resolve(view)
    } else {
      return resolve(false)
    }
  })
  const compositionButton = compositions.length === 0 ? [] : [
    { mode: 'flow', label: 'application flow', defaultMode: true, direct: () => renderComposition().then(insertView) }
  ]
  debug('compositions', compositionButton)

  const rawButton = {
    mode: 'yaml',
    label: 'Raw',
    leaveBottomStripeAlone: true,
    direct: async entity => {
      const models = await repl.qexec(`k8s status ${repl.encodeComponent(filepathForDrilldown)}`,
                                      undefined, undefined, { raw: true })

      const raw = Object.assign({}, entity, {
        contentType: 'yaml',
        contentTypeProjection: 'yaml',
        content: {
          yaml: safeDump(models)
        }
      })

      return Promise.resolve(raw)
    }
  }

  /** bottoms stripe buttons model */
  const resource: IResource = { filepathForDrilldown }
  const modes = [].concat(compositionButton).concat([
    statusButton('kubectl', resource, FinalState.NotPendingLike, { defaultMode: compositionButton.length === 0 }),
    rawButton,
    createResourceButton(() => renderAndViewStatus('kubectl', resource, FinalState.OnlineLike)),
    deleteResourceButton(() => renderAndViewStatus('kubectl', resource, FinalState.OfflineLike))
  ])
  debug('modes', modes)

  // default content
  const content = (await renderComposition()) || (await renderStatus('kubectl', resource, FinalState.NotPendingLike))
  debug('content', content)

  return {
    type: 'custom',
    isEntity: true,
    viewName: 'demo',
    packageName: dirname(filepathAsGiven),
    name: basename(filepathAsGiven),
    resourceName: filepathForDrilldown,
    content,
    modes
  }
}

/**
 * Demo list entry
 *
 */
interface IEntry {
  name: string,
  type: string,
  onclick,
  attributes?: Array<IAttribute>
}
interface IAttribute {
  key: string,
  value: string,
  outerCSS?: string,
  css?: string
}

/**
 * If a directory contains a seeds directory, flatten this to show just dirname as a clickable
 *
 */
const isFlattenable = (filepath: string) => filepath && pathExists(join(filepath, 'seeds'))

/**
 * See if the given demo has a description attribute
 *
 * @param filepath path to yaml
 *
 */
const getDescription = async (filepath: string) => {
  debug('getDescription', filepath)

  const models = parseYAML(await readFile(filepath))
  debug('models', models)

  const model = models
    .filter(_ => _) // in case there are empty paragraphs
    .find(_ => _.metadata.annotations && _.metadata.annotations['electron-shell.org/description'])

  const str = marked((model && model.metadata.annotations['electron-shell.org/description']) || '')
  const dom = document.createElement('span')
  dom.innerHTML = str

  return dom
}

const headerRow = {
  type: 'demo',
  name: 'NAME',
  noSort: true,
  outerCSS: 'header-cell',
  onclick: false,
  attributes: [
    { value: 'KIND', outerCSS: 'hide-with-sidecar header-cell' },
    { value: 'DESCRIPTION', outerCSS: 'header-cell' }
  ]
}

/**
 * list demos
 *
 */
const list = (command: string) => async ({ argvNoOptions }) => {
  if (inBrowser()) {
    throw new Error('Operation not yet supported')
  }

  // maybe we're listing demos in a subdirectory of the demoDirectory?
  const subdir = argvNoOptions[argvNoOptions.indexOf(command) + 1] || relativeDemoDirectory
  const rootdir = findFile(subdir)
  const dir = (name: string): string => repl.encodeComponent(join(subdir, name))

  debug('list subdir', subdir)
  debug('list rootdir', rootdir)

  return new Promise((resolve, reject) => {
    require('fs').readdir(rootdir, async (err, files) => {
      if (err) {
        reject(err)
      } else {
        const asFile = (name: string) => (description): IEntry => ({
          name,
          type: 'demo',
          onclick: () => repl.pexec(`seed get demo ${dir(name)}`),
          attributes: [
            { key: 'type', value: 'demo', css: 'deemphasize deemphasize-partial green-text', outerCSS: 'hide-with-sidecar' },
            { key: 'description', value: description || '', css: 'sans-serif' }
          ]
        })
        const asDir = (name: string): IEntry => ({
          name: `${name}/`,
          type: 'demo directory',
          onclick: () => repl.pexec(`seed get demos ${dir(name)}`),
          attributes: [
            { key: 'type', value: 'demo directory', css: 'deemphasize green-text' , outerCSS: 'hide-with-sidecar' },
            { key: 'description', value: '', css: 'sans-serif' }
          ]
        })

        /** if a directory contains a seeds directory, flatten this to show just dirname as a clickable */
        const maybeFlatten = (name: string) => async (isDir: boolean): Promise<IEntry | void> => {
          if (isDir) {
            if (await isFlattenable(join(rootdir, name))) {
              // then this is a demo directory
              return getDescription(join(rootdir, name, 'seeds', 'main.yaml'))
                .then(asFile(name))
                .catch(err => {
                  console.error('Probably missing description', err)
                })
            } else {
              // then this is a directory of demos
              return asDir(name)
            }
          }
        }

        const demos = (await Promise.all(
          [ headerRow ].concat(files
                               .filter(_ => !_.startsWith('.') && !_.endsWith('~'))
                               .map(name => name.endsWith('.yaml')
                                    ? getDescription(join(rootdir, name)).then(asFile(name))
                                    : isDirectory(join(rootdir, name)).then(maybeFlatten(name)))))) // dir/seed.yaml -> seed.yaml
          .filter(x => x)
        debug('demos', demos)

        resolve(demos)
      }
    })
  })
}

const usage = command => ({
  command,
  strict: command,
  docs: 'Show a list of Seed demos, or a given demo',
  optional: [
    { name: 'demo', docs: 'A demo directory', file: true, positional: true }
  ],
  example: `kubectl get ${command} @seed/applications/sms-translate`
})

/**
 * Register the command
 *
 */
export default (commandTree, prequire) => {
  const cmd = commandTree.listen('/seed/get/demos', get('demos', prequire), { usage: usage('demos') })
  commandTree.synonym('/seed/get/demo', get('demo', prequire), cmd, { usage: usage('demo') })
}
