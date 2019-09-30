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

import { Commands, REPL } from '@kui-shell/core'
import { showEntity } from '@kui-shell/core/webapp/views/sidecar'
import { EntitySpec } from '@kui-shell/core/models/entity'

import { update } from './openwhisk-core'
import { synonyms } from '../models/synonyms'
import { currentSelection } from '../models/openwhisk-entity'

/**
 * This plugin introduces
 * /wsk/{action,rule,trigger,package}/{set,unset,push,annotate,deannoate,apush}
 * to simplify the process of managing parameters and annotations.
 *
 * for parameters:
 *    set x=1              <-- uses the currently selected entity; adds a parameter binding x=1
 *    set x=1 in foo       <-- ibid, but uses the entity named foo
 *    unset x              <-- remove the parameter binding for x in the currently selected entity
 *    set x.y=true         <-- set a sub-field
 *    set x.y={"z":3}      <-- alternate way to set a sub-field
 *    push 3 to x          <-- adds the value 3 to the array-valued parameter named x
 *
 * for annotations, follow this analogy: annotate::set, deannotate::unset, apush::push
 *
 */

const patterns = {
  quoted: {
    single: /^'(.*)'$/g,
    double: /^"(.*)"$/g
  },
  set: {
    implicitEntity: {
      pattern: /\s+([^=]+)\s*=\s*([^=]+)\s*$/,
      key: 1,
      value: 2
    },
    explicitEntity: {
      pattern: /\s+([^=]+)\s*=\s*([^=]+)\s+in\s+(.*)\s*$/,
      key: 1,
      value: 2,
      entity: 3
    }
  },
  push: {
    implicitEntity: { pattern: /\s+(.+)\s*to\s*(.+)\s*$/, key: 2, value: 1 },
    explicitEntity: {
      pattern: /\s+(.+)\s*to\s*(.+)\s+in\s+(.*)\s*$/,
      key: 2,
      value: 1,
      entity: 3
    }
  },
  unset: {
    implicitEntity: { pattern: /\s+([^=]+)\s*$/, key: 1 },
    explicitEntity: { pattern: /\s+(.+)\s*in\s+(.*)\s*$/, key: 1, entity: 2 }
  }
}

/**
 * If struct is s1={x: s2={y: 3}} and path is ['x'] then return
 *   { parent: s, cur: s2, key: x }
 *
 */
const traverse = (struct, path) => {
  let parent = struct
  let cur = parent[path[0]]
  console.log('traverse', 0, path[0], cur, struct)
  for (let idx = 1; idx < path.length; idx++) {
    parent = cur
    cur = cur[path[idx]]
    console.log('traverse', idx, path[idx], cur)
  }
  return { cur: cur, parent: parent, key: path[path.length - 1] }
}

/**
 * If path is ['x', 'y'], then return {x: { y: value } }
 *
 */
const fillIn = (path, value) => {
  const helper = (idx, value) => {
    if (idx < 0) {
      return value
    } else {
      const obj = {}
      obj[path[idx]] = value
      return helper(idx - 1, obj)
    }
  }
  return helper(path.length - 1, value)
}

/**
 * This is the heart of the commands. It traverses the data structure,
 * and splices in (or out) as directed.
 *
 */
const updateMapping = (
  op: string,
  attr: string,
  key: string,
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => entity => {
  if (!entity[attr]) {
    entity[attr] = []
  }

  // the key might be a path expression, e.g. f1.f2.f3
  const path = key.split('.')

  const toplevel = entity[attr].find(kv => kv.key === path[0])
  if (!toplevel) {
    // e.g. we couldn't find an entry for f1
    if (op === 'set') {
      entity[attr].push({ key: path[0], value: fillIn(path.slice(1), value) })
    } else if (op === 'push') {
      entity[attr].push({
        key: path[0],
        value: fillIn(path.slice(1), [value])
      }) // start a new array
    } else {
      // no-op for unset, as we didn't find the key, anyway
    }
  } else if (path.length === 1) {
    // we found an entry for f1, and that's all there is to the key (no f2.f3 traversal bit)
    if (op === 'set') {
      toplevel.value = value
    } else if (op === 'push') {
      if (!Array.isArray(toplevel.value)) {
        throw new Error('You asked to push to a non-array value')
      } else {
        toplevel.value.push(value)
      }
    } else {
      // we were asked to remove the parameter
      entity[attr] = entity[attr].filter(kv => kv.key !== path[0])
    }
  } else {
    // we have to traverse to find the sub-structure
    const leaf = traverse(toplevel.value, path.splice(1))
    if (leaf) {
      if (op === 'set') {
        leaf.parent[leaf.key] = value
      } else if (op === 'push') {
        if (!leaf.parent[leaf.key]) {
          // then this is a new array
          leaf.parent[leaf.key] = [value]
        } else if (!Array.isArray(leaf.parent[leaf.key])) {
          console.error('Not an array', leaf.parent[leaf.key], leaf)
          throw new Error('You asked to push to a non-array value')
        } else {
          leaf.parent[leaf.key].push(value)
        }
      } else {
        delete leaf.parent[leaf.key]
      }
    }
  }

  return entity
}

/**
 * Log the error, and then call the given function
 *
 */
const logThen = f => err => {
  console.error(err)
  return f()
}

/**
 * The set or unset command.
 *
 * @param type will be 'actions' versus 'triggers' versus 'packages'
 * @param op will be 'set' vs 'annotate' or 'unset' versus 'deannotate', i.e. the way it appears in the user-issued command
 * @param opKind will be 'set', 'push', 'unset', i.e. the canonical operation being performed
 * @param attr will be 'parameters' or 'annotations'
 *
 */
const add = (type: string) => (op: string, opKind = op, attr = 'parameters') => async ({
  command: rawCommand,
  execOptions,
  tab
}: Commands.Arguments): Promise<Commands.Response> => {
  /** fetch the given entity with the given type */
  const fetchEntityWithType = (name, type) => REPL.qexec(`wsk ${type} get ${name}`)

  /** try to find the given entity name, across the types */
  const fetchEntityWithFallbacks = name =>
    fetchEntityWithType(name, type)
      .catch(logThen(() => fetchEntityWithType(name, type === 'packages' ? 'actions' : 'packages')))
      .catch(logThen(() => fetchEntityWithType(name, type === 'triggers' ? 'actions' : 'triggers')))

  /** fetch the entity with the given name, using the given entity type, then fall back to trying all types */
  const fetchEntity = (name, tryThisType) =>
    (tryThisType ? fetchEntityWithType(name, tryThisType) : fetchEntityWithFallbacks(name)).catch(() =>
      fetchEntityWithFallbacks(name)
    )

  let key
  let value
  let dest
  let tryThisType
  const selection = currentSelection(tab)

  const command = rawCommand.substring(rawCommand.indexOf(op))

  const matcher1 = patterns[opKind].implicitEntity
  const matcher2 = patterns[opKind].explicitEntity
  const match1 = command.match(matcher1.pattern)
  const match2 = command.match(matcher2.pattern)

  if (match2) {
    // match with explicit entity: set foo=bar in baz
    key = match2[matcher2.key]
    value = match2[matcher2.value]
    dest = match2[matcher2.entity]
  } else if (match1) {
    // match with implicit entity: set foo=bar
    if (!selection) {
      throw new Error('Please provide the name of an entity to update')
    } else {
      key = match1[matcher1.key]
      value = match1[matcher2.value]
      tryThisType = selection.type
      dest = `/${selection.namespace}/${selection.name}`
    }
  } else {
    console.error('Nopes', op, opKind, command)
    throw new Error('Parse error')
  }

  // this might be problematic?
  key = key.trim()
  value = value && value.trim()

  // see if value is JSON
  if (value) {
    try {
      value = JSON.parse(value)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  if (!tryThisType) {
    // see if the dest entity is the selected entity, in which case we'll know the type
    if (
      selection &&
      (selection.name === dest ||
        `${selection.namespace}/${selection.name}` === dest ||
        `/${selection.namespace}/${selection.name}` === dest)
    ) {
      // yup! we have been asked to add a parameter to the current selection
      tryThisType = selection.type
    }
  }

  console.log(`${op} ${key}=${value} to ${dest} using type ${tryThisType || '(we will try to infer the type)'}`)

  // here is where we do the work!
  await fetchEntity(dest, tryThisType) // grab a copy of the current attributes
    .then(updateMapping(opKind, attr, key, value)) // update our copy
    .then(update(execOptions)) // then push the updates to the backend
    .then((entity: EntitySpec) => {
      showEntity(tab, entity, { show: attr })
    }) // open the entity, showing the attribute, e.g. parameters or annotations

  return true
}

/**
 * These options help guide the help system; this command needs a
 * selection, and its type can be any except rule (rules don't allow
 * parameter bindings)
 *
 */
const mkDocs = docString =>
  Object.assign(
    { docs: docString },
    {
      requireSelection: true,
      filter: selection => selection.type !== 'rules'
    }
  )

/** this is the handler body */
export default async (commandTree: Commands.Registrar) => {
  //
  // docs
  //
  const docs = {
      set: attr => mkDocs(`Modify ${attr} by adding or updating a key-value pair`),
      unset: attr => mkDocs(`Modify ${attr} by removing a key`),
      push: attr => mkDocs(`Modify ${attr} by pushing a new value onto an array-valued entry`)
    }

    //
    // register command handlers
    //
  ;['actions', 'triggers', 'packages'].forEach(type => {
    synonyms(type).forEach(syn => {
      const doAdd = add(type)

      commandTree.listen(`/wsk/${syn}/set`, doAdd('set'), docs.set('parameters'))
      commandTree.listen(`/wsk/${syn}/annotate`, doAdd('annotate', 'set', 'annotations'), docs.set('annotations'))

      commandTree.listen(`/wsk/${syn}/unset`, doAdd('unset'), docs.unset('parameters'))
      commandTree.listen(
        `/wsk/${syn}/deannotate`,
        doAdd('deannotate', 'unset', 'annotations'),
        docs.unset('annotations')
      )

      commandTree.listen(`/wsk/${syn}/push`, doAdd('push'), docs.push('parameters'))
      commandTree.listen(`/wsk/${syn}/apush`, doAdd('apush', 'push', 'annotations'), docs.push('annotations'))
    })
  })
}
