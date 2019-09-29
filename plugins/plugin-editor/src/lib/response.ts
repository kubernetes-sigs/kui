/*
 * Copyright 2019 IBM Corporation
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

import { EventEmitter } from 'events'
import { editor as MonacoEditor } from 'monaco-editor'

import { Commands, UI } from '@kui-shell/core'

import { Entity as EditorEntity } from './fetchers'
export { EditorEntity }

export interface Editor extends MonacoEditor.ICodeEditor {
  updateText: (entity: EditorEntity) => void
}

export interface EditorState {
  getEntity: () => EditorEntity
  editor: Editor
  eventBus: EventEmitter
  toolbarText: UI.ToolbarText
}

export interface EditorResponse extends EditorState {
  content: HTMLElement
}

export interface CommandResponse extends Commands.CustomResponse {
  content: HTMLElement
}

export default EditorResponse
