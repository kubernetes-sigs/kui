/*
 * Copyright 2022 The Kubernetes Authors
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

import { MenuItemConstructorOptions } from 'electron'

/**
 * @return the given list of menu `items`, with a prepended "header"
 * item that has the given `label`. If `separator` is true, an additional
 * initial separator menu item will be prepended to the returned list.
 *
 */
export default function section(
  label: string,
  items: MenuItemConstructorOptions[],
  separator = true
): MenuItemConstructorOptions[] {
  return [
    ...(separator ? [{ type: 'separator' as const }] : []),
    { label, enabled: false }, // at least on macOS, this gives a nice header-like appearance
    ...items
  ]
}
