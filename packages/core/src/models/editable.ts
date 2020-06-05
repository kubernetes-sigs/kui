/*
 * Copyright 2020 IBM Corporation
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

export type Editable = { spec: EditableSpec }

export interface EditableSpec {
  readOnly: boolean
  clearable: boolean
  save: {
    label: string
    onSave(data: string): Save | Promise<Save>
  }
  revert: {
    label?: string
    onRevert(): string | Promise<string>
  }
}

type Save = void | { noToolbarUpdate?: boolean; toolbarText?: ToolbarText }
