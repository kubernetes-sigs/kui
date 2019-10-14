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

/**
 * This plugin takes an action and web-exports it. It also adds a
 * mime-type annotation, so that actionable hrefs can be presented to
 * the user.
 *
 */

import { Commands, Models, UI } from '@kui-shell/core'

import { addPrettyType, getClient, owOpts } from '../openwhisk-core'
import { synonyms } from '../../models/synonyms'

// some helpers for the pattern matcher, helping to find the components of a match
const matchOf = idx => match => match[idx] // the match is idx'th element of the result of string.match
const fixedOf = val => () => val // the match is always a fixed value

/**
 * The patterns to look for. These are carefully ordered in priority order.
 *
 */
const matchers = [
  {
    pattern: /^\s*wsk\s+(action|actions)\s+webbify\s+as\s+(.+)\s*$/,
    action: (_, tab: UI.Tab) => Models.Selection.current(tab),
    mimeType: matchOf(2)
  },
  {
    pattern: /^\s*wsk\s+(action|actions)\s+webbify\s+(.+)\s+as\s+(.+)\s*$/,
    action: matchOf(2),
    mimeType: matchOf(3)
  },
  {
    pattern: /^\s*wsk\s+(action|actions)\s+webbify\s+(.+)\s*$/,
    action: matchOf(2),
    mimeType: fixedOf('json')
  },
  {
    pattern: /^\s*wsk\s+(action|actions)\s+webbify\s*$/,
    action: (_, tab: UI.Tab) => Models.Selection.current(tab),
    mimeType: fixedOf('json')
  }
]

/**
 * Make a documentation struct
 *
 */
const theDocs = (docString: string) =>
  Object.assign(
    { docs: docString },
    {
      requireSelection: true,
      filter: selection => selection.type === 'actions'
    }
  )

/**
 * Add the webbifying annotations to the given `annotations` key-value array.
 *
 */
const addAnnotations = (annotations, mimeType) => {
  if (!annotations) {
    annotations = []
  }

  // the standard web-export annotation
  annotations.push({
    key: 'web-export',
    value: true
  })

  // the "mime type" annotation, useful for rendering links, which
  // need an e.g. .json or .http suffix. this annotation tells us
  // which suffix to use, when rendering hrefs
  annotations.push({
    key: 'content-type-extension',
    value: mimeType
  })

  return annotations
}

/**
 * Here is the command impl. It fetches the action body, adds the
 * required annotations, then updates the backend.
 *
 */
const doWebbify = ({ command, execOptions, tab }: Commands.Arguments) => {
  return Promise.all(
    matchers.map(matcher => ({
      matcher: matcher,
      match: command.match(matcher.pattern)
    }))
  )
    .then(matches => matches.filter(match => match.match)) // filter out only matching patterns
    .then(matches => matches && matches[0]) // and take the first one (we've ordered the patterns in priority order)
    .then(match => {
      // check to see if we've successfully parsed the user's intent
      if (!match) throw new Error('Parse error')
      else return match
    })
    .then(match => {
      const action = match.matcher.action(match.match, tab) // the action (name) to webbify
      const mimeType = match.matcher.mimeType(match.match) // webbify as .json? as .http?

      if (!action) {
        // user hasn't specified an action to webbify, either explicitly or implicitly via selection
        throw new Error(`Please select an action, either via "webbify <action>", or by opening it in the sidecar`)
      }

      // fetch, update, render to user
      const ow = getClient(execOptions)
      return ow.actions
        .get(owOpts({ name: action.name || action, namespace: action.namespace }))
        .then(action =>
          ow.actions.update(
            owOpts({
              name: action.name,
              namespace: action.namespace,
              action: Object.assign(action, {
                annotations: addAnnotations(action.annotations, mimeType)
              })
            })
          )
        )
        .then(addPrettyType('actions', 'update', action.name))
    })
}

/**
 * Here is the module. It registers command handlers for the family of
 * /wsk/action/webbify commands.
 *
 */
export default (commandTree: Commands.Registrar) => {
  synonyms('actions').forEach(syn => {
    commandTree.listen(`/wsk/${syn}/webbify`, doWebbify, theDocs('Export an action to the web'))
  })
}
