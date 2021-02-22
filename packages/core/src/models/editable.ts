/*
 * Copyright 2020 The Kubernetes Authors
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

import { ToolbarText } from '../webapp/views/toolbar-text'

type Save = void | { command?: string; noToolbarUpdate?: boolean; toolbarText?: ToolbarText }

export interface SaveError extends Error {
  revealLine?: number
}

export interface EditableSpec {
  /** Should the editor be opened in read-only mode? Default: false */
  readOnly: boolean

  /** Should we offer a Clear button? Default: false */
  clearable: boolean

  /** Button and Controller to handle saves */
  save: {
    label: string
    onSave(data: string): Save | Promise<Save>
  }

  /** Button and Controller to handle reverts */
  revert: {
    label?: string
    onRevert(): string | Promise<string>
  }
}

/** The Resource trait */
export type Editable = { spec: EditableSpec }
