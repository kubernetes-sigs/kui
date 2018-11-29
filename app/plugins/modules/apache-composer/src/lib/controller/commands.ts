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
const debug = Debug('plugins/apache-composer/cmds')

import * as client from './client'
import * as repl from '../../../../../../build/core/repl'
import { create, invoke, async, app_get, session_get, app_delete, app_list, session_list, properties }  from '../utility/usage'
import * as parseUtil from '../utility/parse'
import * as view from '../view/entity-view'
import * as compileUtil from '../utility/compile'
import * as astUtil from '../utility/ast'
import UsageError from '../../../../../../build/core/usage-error'


// TODO: clean up synonym

export default async (commandTree, prequire) => {
  const wsk = await prequire('openwhisk')

  /* command handler for app create */
  commandTree.listen(`/wsk/app/create`, async ({ argvNoOptions, execOptions, parsedOptions }) => {
    // load and parse the source file to JSON-encoded composition and then deploy
    let inputFile = argvNoOptions[argvNoOptions.indexOf('create') + 2]
    let name = argvNoOptions[argvNoOptions.indexOf('create') + 1]
    if (!inputFile) {
      const implicitEntity = compileUtil.implicitInputFile(inputFile, name)
      inputFile = implicitEntity.inputFile
      name = implicitEntity.name

      if (!name || !inputFile) {
        debug('insufficient inputs')
        throw new UsageError(create('create'), undefined, 497)
      }
    }

    return compileUtil.sourceToComposition({inputFile, name, recursive: parsedOptions.r || parsedOptions.recursive})
    // return compileUtil.parseSource(argvNoOptions, 'create', parsedOptions.r || parsedOptions.recursive)
      .then(source => client.deploy({ composition: source, overwrite: false })
        .then(view.formatCompositionEntity(execOptions)))
      .catch(err => { throw err })
  }, {usage: create('create')})

  /* command handler for app update */
  commandTree.listen(`/wsk/app/update`, async ({ argvNoOptions, execOptions, parsedOptions }) => {
    // load and parse the source file to JSON-encoded composition and then deploy
    let inputFile = argvNoOptions[argvNoOptions.indexOf('update') + 2]
    let name = argvNoOptions[argvNoOptions.indexOf('update') + 1]
    if (!inputFile) {
      const implicitEntity = compileUtil.implicitInputFile(inputFile, name)
      inputFile = implicitEntity.inputFile
      name = implicitEntity.name

      if (!name || !inputFile) {
        debug('insufficient inputs')
        throw new UsageError(create('update'), undefined, 497)
      }
    }

    return compileUtil.sourceToComposition({ inputFile, name, recursive: parsedOptions.r || parsedOptions.recursive })
      .then(composition => client.deploy({ composition, overwrite: true })
        .then(view.formatCompositionEntity(execOptions)))
  }, {usage: create('update')})

  /* command handler for app invoke */
  commandTree.listen(`/wsk/app/invoke`, ({ command, parsedOptions: options }) => {
    //command = command.replace(/--blocking|--result|-br|-b|-r/g, '').replace('app', 'action')
    return repl.qfexec(command.replace('app', 'action'))
      .then(result => view.formatCompositionResult(result, options))
  }, {usage: invoke})


  /* command handler for app async */
  commandTree.listen(`/wsk/app/async`, ({command }) => {
    return repl.qfexec(command.replace('app', 'action')) // asynchronous composition invocation is the same with asynchronous action invocation
  }, {usage: async})

  /* command handler for app delete */
  commandTree.listen(`/wsk/app/delete`, ({ command }) => {
    return repl.qfexec(command.replace('app', 'action'))
      .then(result => view.formatDeleteResult(result))
  }, { usage: app_delete})

  /* command handler for app get */
  commandTree.listen(`/wsk/app/get`, ({ argvNoOptions, execOptions, parsedOptions }) =>
    repl.qexec(`wsk action get "${parseUtil.parseName(argvNoOptions, 'get')}"`, undefined, undefined,
      Object.assign({}, execOptions, { override: true, originalOptions: parsedOptions }))
  , { usage: app_get('get') })


    // override wsk action get
  const actionGet = (await (commandTree.find('/wsk/action/get'))).$

  wsk.synonyms('actions').forEach(syn => {
   commandTree.listen(`/wsk/${syn}/get`, (opts) => {
     if (!actionGet) {
       return Promise.reject(new Error())
     }
     debug('rendering action get')
     return actionGet(opts).then(async response => view.visualizeComposition(response, opts.execOptions))
   })
  })

  /* command handler for session get */
  commandTree.listen(`/wsk/session/get`, ({ command, parsedOptions }) => {
    if (parsedOptions.last) { // user didn't specify last = name
      return repl.qfexec('activation list --limit 200')
        .then(activations => {
          debug('session get --last')
          return activations.find(activation => {
            if(activation.annotations && activation.annotations.find(({key, value}) => key === 'conductor' && value)) {
              if(typeof parsedOptions.last === 'string'){
                if (activation.name === parsedOptions.last) return activation
              } else {
                return activation
              }
            }
          })
        }).then(activation => {
          return repl.qfexec(`session get ${activation.activationId}`)
        }).catch(err => err)
    } else {
        return repl.qfexec(command.replace('session', 'activation'))
    }
  }
  , {usage: session_get('get')})

  commandTree.listen(`/wsk/session/result`, ({ command }) => {
    return repl.qfexec(command.replace('session result', 'activation get'))
      .then(result => result.response.result)
  }
  , {usage: session_get('result')})

  // override wsk activation get
  const activationGet = (await (commandTree.find('/wsk/activation/get'))).$
  wsk.synonyms('activations').forEach(syn => {
      commandTree.listen(`/wsk/${syn}/get`, (opts) => {
          if (!activationGet) {
              return Promise.reject()
          }
          const last = opts.parsedOptions.last

          if (last) {
            return repl.qexec(`wsk activation list --limit 1` + (typeof last === 'string' ? ` --name ${last}` : ''))
              .then(activations => {
                if (activations.length === 0) {
                  throw new Error('No such activation found')
                } else {
                  return repl.qexec(`wsk activation get ${activations[0].activationId}`)
                }
            })
          }

          return activationGet(opts)
              .then(response => view.formatSessionGet(response))
              .catch(err => { throw err })
      })
    })

  /* command handler for app list */
  commandTree.listen(`/wsk/app/list`, ({ command }) => {
    return repl.qfexec(command.replace('app', 'action'), undefined, undefined, { showHeader: true })
      .then(table => {
        debug('multi-row table view of action list', table)
        if(!table[0]) return table
        let actions = table[0].slice(1) // table is an array of array, the first element is row-header, the others are actual actions
        return view.formatCompositionList(actions.filter(astUtil.isAnApp), table[0][0])
      })
  }, {usage: app_list('list')})


  /* command handler for session list*/
    commandTree.listen(`/wsk/session/list`, ({ command, parsedOptions }) => {
      return repl.qfexec(command.replace('session', 'activation'))
        .then(activations => {
          debug('session list -> activation list -> got activations:', activations)
          // filter with sessions
          return activations.filter(activation => {
            debug('processing activation', activation )
            if (activation && activation.annotations && activation.annotations.find(({key, value}) => key === 'conductor' && value)) {
                debug('filtering activations: found a session', activation)
                return activation
            }
          })
        })
        .catch(err => err)
    }, {usage: session_list})

  /* command handler for propertis*/
  // the package.json might be in `app/plugins`, or in
  // `app/plugins/modules/composer`, depending, respectively, on whether
  // we are installing composer from npm, versus from git e.g. when
  // testing a development branch
  let pckage
  try {
    pckage = require('../../../../../node_modules/@ibm-functions/composer/package.json')
  } catch (err) {
    pckage = require('../../../node_modules/@ibm-functions/composer/package.json')
  }

  const propertySynonyms = ['wsk/app', 'composer']
  propertySynonyms.forEach(tree => {
    const cmd = commandTree.listen(`/${tree}/properties`, () => {return `Composer version ${pckage.version}`}, { usage: properties('properties'), noAuthOk: true })

    // synonyms of app properties
    commandTree.synonym(`/${tree}/props`, () => {return `Composer version ${pckage.version}`}, cmd, { usage: properties('props'), noAuthOk: true })
    commandTree.synonym(`/${tree}/config`, () => {return `Composer version ${pckage.version}`}, cmd, { usage: properties('config'), noAuthOk: true })
  })

  //TODO
  // app lang
  // const opts = { noAuthOk: true }
  // const aliases = ['js', 'nodejs', 'nodejs:default', 'json']
  //
  // aliases.forEach(lang => {
  //   commandTree.listen(`/app/lang/${lang}/init/impl`, () => {true}, opts)
  //   commandTree.listen(`/app/lang/${lang}/clean/impl`, () => {true}, opts)
  //   commandTree.listen(`/app/lang/${lang}/compose/impl`, compose, opts)
  //   commandTree.listen(`/app/lang/${lang}/encode/impl`, encode, opts)
  // })

}
