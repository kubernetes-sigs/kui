/*
 * Copyright 2017 IBM Corporation
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

/**
 * This plugin introduces /wsk/activations/roots, and short-hands $$
 * and $$!, to help with exploring activations. If you have a nesting
 * of sequences, it is sometimes helpful to explore just the roots of
 * these trees. $$ will list just the root-most activations. $$! lists
 * the root-most activations with errors.
 *
 */

import * as minimist from 'yargs-parser'

import { REPL } from '@kui-shell/core'
import { ActivationListTable } from '../../views/cli/activations/list'

const rootSynonyms = ['root', '$$']
const defaultOptions = {
  limit: 10
}

/** i know i know... we're serializing something that the repl interpreter will just turn around and parse... */
const serialize = options => {
  let S = ''
  for (const key in options) {
    if (key.length > 1) {
      // ignore single-letter alias keys
      if (options[key] === true) {
        S += ` --${key}`
      } else {
        S += ` --${key} ${options[key]}`
      }
    }
  }
  return S
}

/** some utility routines over annotations */
const getAnnotation = (entity, key, defaultValue) => {
  const annotation = entity.annotations && entity.annotations.find(kv => kv.key === key)
  return (annotation && annotation.value) || defaultValue
}

/** filter the given list of activations to include only those matching the given namespace regexp string */
const isFromIncludedPackage = packageRegex => activations => {
  if (!packageRegex) {
    return activations
  } else {
    const regex = new RegExp(`.*/${packageRegex.replace('*', '.*').replace('/', '\\/')}.*`)
    return activations.filter(activation => getAnnotation(activation, 'path', '').match(regex))
  }
}

/** filter the given list of activations to exclude those caused by a sequence */
const doesNotHaveAnnotation = (key, value) => entity =>
  !(entity.annotations && entity.annotations.find(kv => kv.key === key && kv.value === value))
const excludeIfCausedBySequence = activations => activations.filter(doesNotHaveAnnotation('causedBy', 'sequence'))

/** a filter function that accepts anything */
const acceptAll = x => x

/** a filter function that accepts only activations with a failure response */
const hasErrorResult = activations =>
  Promise.all(activations.map(activation => REPL.qexec(`wsk activation get ${activation.activationId}`))).then(
    activations => activations.filter(activation => !activation['response'].success)
  )

/** here is the module */
export default (commandTree, wsk) => {
  const rootsDocs = {
    docs: `List the root-most activations, i.e. exclude components of sequences`
  }
  const rootsDocsShortcut = {
    docs: `[Export Shortcut] List the root-most activations; shortcut for "wsk activation roots"`
  }
  const rootsWithErrorsDocs = {
    docs: `As with roots, but showing only those root activations with errors`
  }
  const rootsWithErrorsDocsShortcut = {
    docs: `[Export Shortcut] Root activations with errors`
  }

  const roots = (op, filterFn = acceptAll) => ({ block, argv: fullArgv }) => {
    const options = Object.assign(
      {},
      defaultOptions, // defaults, potentially overridden by minimist...
      minimist(fullArgv.splice(fullArgv.indexOf(op) + 1), {
        alias: { l: 'limit', s: 'skip' }
      })
    )
    const argv = options._
    delete options._

    return REPL.qexec(`wsk activations list ${serialize(options)}`, block)
      .then((response: ActivationListTable) => response.body)
      .then(excludeIfCausedBySequence)
      .then(isFromIncludedPackage(argv[0]))
      .then(filterFn)
  }

  // Install the routes
  wsk.synonyms('activations').forEach(syn => {
    const rootsCmd = commandTree.listen(`/wsk/${syn}/roots`, roots('roots'), rootsDocs)

    rootSynonyms.forEach(op => {
      commandTree.synonym(`/wsk/${syn}/${op}`, roots(op), rootsCmd)
    })
    commandTree.listen(`/wsk/$$`, roots('$$'), rootsDocsShortcut)

    const rootsWithErrorsCmd = commandTree.listen(
      `/wsk/${syn}/roots!`,
      roots('roots!', hasErrorResult),
      rootsWithErrorsDocs
    )
    rootSynonyms.forEach(op => {
      commandTree.synonym(`/wsk/${syn}/${op}!`, roots(`${op}!`), rootsWithErrorsCmd)
    })
    commandTree.listen(`/wsk/$$!`, roots('$$!', hasErrorResult), rootsWithErrorsDocsShortcut)
  })
}
