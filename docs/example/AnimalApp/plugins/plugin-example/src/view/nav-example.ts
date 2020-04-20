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

import { NavResponse } from '@kui-shell/core'
import reactContent from '../view/Sidecat'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printCatInLeftNavSidecar(): NavResponse {
  return {
    apiVersion: 'kui-shell/v1',
    kind: 'NavResponse',
    breadcrumbs: [{ label: 'Animal' }, { label: 'cat', command: 'hello cat' }],
    menus: [
      {
        label: 'Sweet',
        items: [
          {
            mode: '😻',
            content:
              '### Hello!\n #### **Kui** is a platform for enhancing the terminal experience with visualizations.\n\n ![Kui: The CLI with a GUI twist](https://github.com/myan9/kui/blob/wiki_image/docs/example/images/cat.png?raw=true)',
            contentType: 'text/markdown'
          },
          {
            mode: '😺',
            react: reactContent()
          }
        ]
      },
      {
        label: 'Crazy',
        items: [
          {
            mode: '🙀',
            react: reactContent()
          },
          {
            mode: '😿',
            react: reactContent()
          }
        ]
      }
    ],
    links: [
      { label: 'See 🐶', command: 'hello dog' },
      { label: 'Buy 🧀', href: 'https://github.com/IBM/kui' }
    ]
  }
}
