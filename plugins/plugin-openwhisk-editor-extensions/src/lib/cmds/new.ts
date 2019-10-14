/*
 * Copyright 2017-18 IBM Corporation
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
import { Commands, REPL } from '@kui-shell/core'

import {
  EditorEntity as Entity,
  fetchFile,
  language,
  lockIcon,
  openEditor,
  respondToRepl
} from '@kui-shell/plugin-editor'

import strings from '../i18n/strings'
import * as placeholders from '../placeholders'
import { persister as compositionPersister } from '../model/composition-persister'

const debug = Debug('plugins/openwhisk-editor-extensions/cmds/new')

/**
 * Default settings
 *
 */
export const defaults = {
  kind: 'nodejs:default'
}

/**
 * Optional arguments for new and compose commands
 *
 */
export const optional = (allowed: string[]) => [
  {
    name: '--kind',
    alias: '-k',
    docs: 'The OpenWhisk kind of the new action',
    allowed,
    allowedIsPrefixMatch: true,
    defaultValue: 'nodejs'
  },
  {
    name: '--template',
    alias: '-t',
    docs: 'Create a new entity using the given file as the starting place'
  },
  { name: '--readOnly', docs: 'Open the editor in read-only mode' },
  {
    name: '--simple',
    alias: '-s',
    docs: 'Simplify the editor presentation, such as not showing line numbers'
  }
]

/**
 * Usage model for the `new` command
 *
 */
export const newUsage = {
  strict: 'new',
  command: 'new',
  title: 'New action',
  header: 'For quick prototyping of actions, this command opens an editor in the sidecar.',
  example: 'new <actionName>',
  required: [{ name: '<actionName>', docs: 'The name of your new action' }],
  optional: optional(['nodejs', 'python', 'php']),
  parents: [{ command: 'editor' }]
}

/**
 * If the user specified a kind of 'nodejs', then add ':default'
 *
 */
export const addVariantSuffix = (kind: string) => {
  if (kind.indexOf(':') < 0) {
    return `${kind}:default`
  } else {
    return kind
  }
}

/**
 * Throw an error if we can't edit the given action
 *
 */
const checkForConformance = action => {
  debug('checkForConformance', action)

  if (action.exec.binary) {
    debug('abort: trying to edit a binary action')
    const err = new Error('Editing of binary actions not yet supported')
    err['code'] = 406 // 406: Not Acceptable http status code
    throw err
  } else if (action.ast) {
    // try to find the source for this composition
    debug('trying to find source for composition')
    return compositionPersister.getCode(action)
  } else if (action.exec.kind === 'sequence') {
    debug('abort: trying to edit a sequence')
    const err = new Error('Editing of sequence actions not yet supported')
    err['code'] = 406 // 406: Not Acceptable http status code
    throw err
  }

  debug('checkForConformance: ok')
  return action
}

/**
 * Fail with 409 if the given action name exists, otherwise succeed
 *
 */
const failWith409 = () => {
  const error = new Error(strings.editor.actionAlreadyExists)
  error['code'] = 409
  throw error
}
const failIfNot404 = err => {
  if (err.statusCode !== 404 && err.message.indexOf('socket hang up') < 0 && err.statusCode !== 'ENOTFOUND') {
    console.error(err)
    throw err
  } else {
    return true
  }
}

/**
 * Enter read-only mode
 *
 */
export const gotoReadonlyView = ({ getEntity }) => async () => {
  const { name, namespace } = await getEntity()
  const fqn = `/${namespace}/${name}`
  debug('readonly', fqn)
  return REPL.pexec(`wsk action get ${REPL.encodeComponent(fqn)}`)
}

export const persisters = {
  // persisters for regular actions
  actions: {
    getCode: entity => entity,
    revert: (entity: Entity, { editor }) => {
      debug('revert', entity)
      const namespacePart = entity.namespace ? `/${entity.namespace}/` : ''

      return REPL.qexec(`wsk action get "${namespacePart}${entity.name}"`)
        .then(persisters.actions.getCode)
        .then(entity => {
          entity.persister = persisters.actions
          editor.updateText(entity)
          return entity
        })
    },
    save: action => {
      debug('save', action)
      const namespacePart = action.namespace ? `/${action.namespace}/` : ''

      // odd: if we don't delete this, the backend will not perform its default version tagging behavior
      // https://github.com/apache/incubator-openwhisk/issues/3237
      delete action.version

      return REPL.qexec(`wsk action update "${namespacePart}${action.name}"`, undefined, undefined, {
        entity: { action }
      })
    }
  }
}

interface Options extends Commands.ParsedOptions {
  kind?: string
  language?: string
}

/**
 * Simple convenience routine to fetch an action and ensure that it is
 * compatible with the editor
 *
 */
export const fetchAction = (check = checkForConformance, tryLocal = true) => (
  name: string,
  parsedOptions?: Options,
  execOptions?: Commands.ExecOptions
): Promise<Entity> => {
  if (name.charAt(0) === '!') {
    const parameterName = name.substring(1)
    const source = execOptions.parameters && execOptions.parameters[parameterName]
    if (source) {
      return Promise.resolve({
        type: 'source',
        name: execOptions.parameters.name,
        exec: {
          kind: parsedOptions.language || 'source',
          code: source.toString()
        },
        annotations: [],
        persister: execOptions.parameters.persister,
        gotoReadonlyView: ({ getEntity }) => lockIcon({ getEntity, direct: gotoReadonlyView({ getEntity }) })
      })
    }
  }
  return REPL.qexec(`wsk action get "${name}"`)
    .then(check)
    .then(entity =>
      Object.assign({}, entity, {
        persister: persisters.actions,
        gotoReadonlyView: ({ getEntity }) => lockIcon({ getEntity, direct: gotoReadonlyView({ getEntity }) })
      })
    )
    .catch(err => {
      debug('fetchAction error', err.statusCode, err.code, err.message)
      if (tryLocal && err.code !== 406) {
        // 406 means that this is a valid action, but lacking composer source
        return fetchFile(name)
      } else {
        throw err
      }
    })
}
const fetchActionFailingIfExists = fetchAction(failWith409, false)

/**
 * Confirm that the given named action does not already exist
 *
 */
export const betterNotExist = (name: string, options): Promise<boolean> => {
  if (options.readOnly) {
    return Promise.resolve(true)
  } else {
    return fetchActionFailingIfExists(name)
      .then(() => true)
      .catch(failIfNot404)
  }
}

/**
 * Simple convenience routine that takes the result of an action
 * fetch and an editor open call, and passes the former to the latter
 *
 */
export const prepareEditorWithAction = ([action, updateFn]) => {
  debug('prepareEditorWithAction')
  return updateFn(action)
}

/**
 * Command handler to create a new action or app
 *
 */
export const newAction = ({
  cmd = 'new',
  type = 'actions',
  _kind = defaults.kind,
  placeholder = undefined,
  placeholderFn = undefined,
  persister = persisters.actions
} = {}) => async ({
  tab,
  argvNoOptions,
  parsedOptions: options,
  execOptions
}: Commands.Arguments<Options>): Promise<Commands.Response> => {
  const name = argvNoOptions[argvNoOptions.indexOf(cmd) + 1]
  const prettyKind = addVariantSuffix(options.kind || _kind)
  const kind = addVariantSuffix(options.kind || defaults.kind)

  debug('newAction', cmd, name, kind, prettyKind)

  // create the initial, placeholder, source code to place in the editor
  const makePlaceholderCode = placeholderFn || (() => placeholder || placeholders[language(kind)])

  const code = await makePlaceholderCode(Object.assign({ kind }, options))

  // nothing, for now
  const compile = () => Promise.resolve()

  // our placeholder action
  const makeAction = () =>
    compile().then(ast => {
      debug('makeAction', ast)
      return {
        name,
        kind,
        type,
        exec: { kind, prettyKind, code },
        isNew: true,
        ast,
        persister
      }
    })

  //
  // otherwise, open the in-Shell editor
  // then update the editor to show the placeholder action
  // then send a response back to the repl
  //
  return betterNotExist(name, options)
    .then(() => Promise.all([makeAction(), openEditor(tab, name, options, execOptions)]))
    .then(prepareEditorWithAction)
    .then(respondToRepl(undefined, ['is-modified']))
}

export default async (commandTree: Commands.Registrar) => {
  // command registration: create new action
  commandTree.listen('/new', newAction(), {
    usage: newUsage,
    noAuthOk: true,
    needsUI: true,
    inBrowserOk: true
  })
}
