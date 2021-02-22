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

import { MultiModalResponse } from '@kui-shell/core'
import reactContent from './Sidecat'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printCatInTopNavSidecar(): MultiModalResponse {
  return {
    metadata: {
      name: 'Tumble',
      namespace: 'orange cat'
    },
    kind: 'American Shorthair',
    modes: [
      {
        mode: 'Yaml Tab',
        content:
          'kind: American Shorthair\nmetadata:\n  dateOfBirth: "2018-08-04"\n  placeOfBirth: New York City\n  name: Tumble\n  namespace: orange cat \nhabits: boxing \n',
        contentType: 'yaml'
      },
      {
        mode: 'Markdown Tab',
        content:
          '### Hello!\n #### **Kui** is a platform for enhancing the terminal experience with visualizations.\n\n ![Kui: The CLI with a GUI twist](https://github.com/myan9/kui/blob/wiki_image/docs/example/images/cat.png?raw=true)',
        contentType: 'text/markdown'
      },
      {
        mode: 'React Tab',
        react: reactContent()
      }
    ],
    buttons: [
      { mode: 'show dog', command: 'hello dog', kind: 'drilldown' },
      { mode: 'catnav', command: 'hello catnav', kind: 'drilldown' }
    ]
  }
}
