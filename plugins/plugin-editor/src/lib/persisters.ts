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
import { readFile, writeFile } from 'fs'

import { Button } from '@kui-shell/core/api/ui-lite'
import globalEventBus from '@kui-shell/core/api/events'

import strings from './strings'
import { EditorResource, EditorEntity, EditorState, Editor } from './response'

const debug = Debug('plugins/editor/persisters')

export interface Persister {
  getCode: (entity: EditorEntity) => EditorEntity
  saveString: string
  save: (entity: EditorEntity, editor: Editor) => Promise<EditorEntity>
  revert: (entity: EditorEntity, state: EditorState) => Promise<EditorEntity>
}

const FilePersister: Persister = {
  getCode: (entity: EditorEntity) => entity,
  saveString: strings.saveLocalFile,
  save: (entity: EditorEntity, editor: Editor): Promise<EditorEntity> =>
    new Promise((resolve, reject) => {
      const rawText = editor.getValue()

      writeFile(entity.filepath, rawText, err => {
        if (err) {
          reject(err)
        } else {
          if (entity.extract) {
            // let's see if we can re-extract the updated entity name
            // from the raw source
            const newEntity = entity.extract(rawText, entity)
            Object.assign(entity, newEntity)
          }

          resolve(entity as EditorEntity)
        }
      })
    }),
  revert: (entity: EditorEntity): Promise<EditorEntity> =>
    new Promise((resolve, reject) => {
      readFile(entity.filepath, (err, data) => {
        if (err) {
          reject(err)
        } else {
          entity.exec.code = data.toString()
          resolve(entity)
        }
      })
    })
}

/**
 * Logic for saving and reverting
 *
 */
export const persisters = {
  // persisters for local files
  files: FilePersister
}

/**
 * Save the given entity
 *
 */
export const save = ({ getEntity, editor, eventBus }: EditorState): Button<EditorResource> => {
  const entityRightNow = getEntity()
  const mode: string = (entityRightNow.persister && entityRightNow.persister.saveString) || strings.save
  return {
    mode,
    kind: 'view',
    command: () => {
      const entity = getEntity()
      const persister = entity.persister
      debug('persister', persister, entity)
      const { save } = entity.persister

      // transfer the latest code from the editor into the entity
      entity.exec.code = editor.getValue()

      return save(entity, editor).then(entity => {
        entity.persister = persister
        eventBus.emit('/editor/save', entity, { event: 'save' })
        globalEventBus.emit('/editor/save', entity, { event: 'save' })
        return entity
      })
    }
  }
}

/**
 * Revert to the currently deployed version
 *
 */
export const revert = (state: EditorState): Button<EditorResource> => ({
  mode: strings.revert,
  kind: 'view',
  command: () => {
    const entity = state.getEntity()
    const persister = entity.persister
    debug('revert', entity)

    if (persister.revert) {
      return persister
        .revert(entity, state)
        .then(entity => {
          entity.persister = persister
          state.editor.updateText(entity)
          state.eventBus.emit('/editor/save', entity, { event: 'revert' })
        })
        .then(() => true)
    } else {
      debug('no registered reverter')
    }
  }
})
