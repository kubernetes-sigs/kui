/*
 * Copyright 2017-19 IBM Corporation
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
 * This plugin helps with controlling and knowing what the sidecar should display
 *
 */

import { Capabilities, Commands, REPL } from '@kui-shell/core'
import { show as showSidecar, showEntity } from '@kui-shell/core/webapp/views/sidecar'

import { synonyms } from '../models/synonyms'
import { crudableTypes as crudable } from '../models/crudable'
import { currentSelection, isActivationSpec } from '../models/openwhisk-entity'

/**
 * These options help guide the help system; this command needs a
 * selection, and it (possibly, if the requiredType parameter is
 * given) needs to be of a certain type.
 *
 * If requiredType===true, then accept any
 *
 */
const docs = (docString: string, requiredType?: string | boolean, noSequencesPlease = false) =>
  Object.assign(
    { docs: docString },
    {
      requireSelection: true,
      filter:
        requiredType &&
        (selection => {
          return (
            (requiredType === true || selection.type === requiredType) && // requiredType matches
            (!noSequencesPlease || selection.prettyType !== 'sequence')
          ) // isSequence matches
        })
    }
  )

/** does the given entity match the given entityId? */
const idMatch = (entity, entityId) => {
  if (entity.type === 'activations') {
    return entity.activationId === entityId
  } else {
    // TODO: FQN?
    return entity.name === entityId
  }
}

export default async (commandTree: Commands.Registrar) => {
  const switchSidecarMode = (entityType: string, mode: string) => async ({
    argvNoOptions: args,
    tab
  }: Commands.EvaluatorArgs) => {
    const entityId = args[args.indexOf(mode) + 1]
    const selection = currentSelection(tab)

    if (
      selection &&
      (!entityType ||
        !entityId ||
        (selection.type === entityType && idMatch(selection, entityId)) ||
        (Array.isArray(entityType) && entityType.find(t => t === selection.type)))
    ) {
      if (
        mode !== 'raw' &&
        mode !== 'default' &&
        !(
          selection[mode] ||
          (selection.exec && selection.exec[mode]) ||
          (isActivationSpec(selection) && selection.response[mode])
        )
      ) {
        throw new Error(`The current entity does not support viewing ${mode}`)
      } else {
        showSidecar(tab)
        return showEntity(tab, selection, { show: mode })
      }
    } else if (args.length === 3 || args.length === 4) {
      // activation logs xxx or wsk activation logs xxx
      const activation = await REPL.qexec(`wsk ${entityType} get ${entityId}`)
      if (Capabilities.isHeadless()) {
        return activation[mode]
      } else {
        showEntity(tab, activation, { show: mode })
        return true // make repl happy
      }
    } else {
      const isVowel = c => c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u'
      const startsWithVowel = s => isVowel(s.charAt(0))

      throw new Error(
        !entityType
          ? 'You have not selected an entity'
          : `You have not yet selected ${startsWithVowel(entityType) ? 'an' : 'a'} ${entityType.replace(/s$/, '')}`
      )
    }
  }

  //
  // toggle activation mode
  //
  synonyms('activations').forEach(syn => {
    commandTree.listen(
      `/wsk/${syn}/result`,
      switchSidecarMode('activations', 'result'),
      docs('Show the result of an activation', 'activations')
    )
    commandTree.listen(
      `/wsk/${syn}/logs`,
      switchSidecarMode('activations', 'logs'),
      Object.assign(docs('Show the logs of an activation', 'activations'), {
        needsUI: true,
        width: 800,
        height: 800
      })
    )
  })

  //
  // toggle action mode
  synonyms('actions').forEach(syn => {
    commandTree.listen(
      `/wsk/${syn}/code`,
      switchSidecarMode('actions', 'code'),
      docs('Show the code of an action', 'actions', true)
    )
    commandTree.listen(
      `/wsk/${syn}/limits`,
      switchSidecarMode('actions', 'limits'),
      docs('Show the limits of an action', 'actions')
    )
  })

  crudable.forEach(type => {
    synonyms(type).forEach(syn => {
      const paramsCmd = commandTree.listen(
        `/wsk/${syn}/parameters`,
        switchSidecarMode(undefined, 'parameters'),
        docs('Show the parameters', true, true)
      )
      commandTree.synonym(
        `/wsk/${syn}/params`,
        switchSidecarMode(undefined, 'parameters'),
        paramsCmd,
        docs('Show the parameters', true, true)
      )

      commandTree.listen(
        `/wsk/${syn}/annotations`,
        switchSidecarMode(undefined, 'annotations'),
        docs('Show the annotations')
      )
      commandTree.listen(`/wsk/${syn}/content`, switchSidecarMode(undefined, 'default'), docs('Show the main content'))
      commandTree.listen(`/wsk/${syn}/raw`, switchSidecarMode(undefined, 'raw'), docs('Show the raw JSON record'))
      // commandTree.listen('/default', switchSidecarMode(undefined, 'default'))
    })
  })

  return {
    switch: switchSidecarMode
  }
}
