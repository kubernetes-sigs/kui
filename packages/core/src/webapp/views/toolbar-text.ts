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

/**
 * Text to be displayed in the sidecar toolbar
 *
 */

type ToolbarTextType = 'info' | 'success' | 'warning' | 'error'

export function isSupportedToolbarTextType(type: string): type is ToolbarTextType {
  return type === 'info' || type === 'success' || type === 'warning' || type === 'error'
}

type ToolbarTextValue = string | Element

export interface ToolbarAlert {
  type: ToolbarTextType
  title: string
  body?: string
}

export interface ToolbarText {
  type: ToolbarTextType
  text: ToolbarTextValue
  alerts?: ToolbarAlert[] /* auto destruct */
}
