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

import Debug from 'debug'
const debug = Debug('plugins/apache-composer/utility/ast')

import { Action } from '@kui-shell/plugin-openwhisk'

/* Does the given action represent a composer app? */
export const isAnApp = (action: Action) => {
  debug('filtering action', action)
  const anno = action && action.annotations && action.annotations.find(({ key }) => key === 'conductor')
  return anno && !!anno.value
}

/**
 * Extract the Action Tasks from a given FSM
 *
 */
export const extractActionsFromAst = composition => {
  const actions = []

  /** recursively add actions from the given root sequence */
  const iter = root => {
    if (root.type === 'action') {
      actions.push(root.name)
    } else {
      Object.keys(root).forEach(key => {
        if (Array.isArray(root[key])) {
          root[key].forEach(obj => iter(obj))
        } else if (typeof root[key] === 'object' && root[key] !== null) {
          iter(root[key])
        }
      })
    }
  }

  // start from the root
  iter(composition)
  return actions
}

/**
 * Return the annotation that stores the ast
 *
 */
export const astAnnotation = entity => {
  const anno =
    entity.annotations.find(({ key }) => key === 'ast') || entity.annotations.find(({ key }) => key === 'conductor')

  // avoid conductor:true as indicating the presence of an Ast
  return anno && anno.value !== true ? anno : undefined
}

/**
 * Does the given action have an ast associated with it?
 *
 */
export const hasAst = entity => entity && !!astAnnotation(entity)

/**
 * Is the given struct a valid AST?
 *   TODO, this is a primitive form of validation, for now
 *
 */
export const isValidAst = maybe => {
  return (
    maybe &&
    ((maybe.constructor && maybe.constructor.name === 'Composition') || // for nodejs
      maybe.type) // for other languages (for now, at least)
  )
}
