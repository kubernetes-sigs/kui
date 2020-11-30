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

import { TreeResponse } from '@kui-shell/core'

const tree: TreeResponse = {
  apiVersion: 'kui-shell/v1',
  kind: 'TreeResponse',
  data: [
    {
      id: 'without children',
      name: 'without children',
      defaultExpanded: true,
      content: 'without children',
      contentType: 'text/plain'
    },
    {
      name: 'with children',
      id: 'with children',
      defaultExpanded: true,
      content: 'with children',
      contentType: 'text/plain',
      children: [
        {
          name: 'Foo',
          id: 'Foo',
          content: 'Foo',
          contentType: 'text/plain',
          defaultExpanded: true,
          children: [
            {
              name: 'a',
              id: 'a',
              defaultExpanded: true,
              content: 'a',
              contentType: 'text/plain'
            },
            {
              name: 'b',
              id: 'b',
              defaultExpanded: true,
              content: `data: b`,
              contentType: 'yaml',
              children: [
                {
                  name: 'c',
                  id: 'c',
                  content: 'c',
                  contentType: 'text/plain'
                }
              ]
            }
          ]
        },
        {
          name: 'Bar',
          id: 'Bar',
          content: 'Bar',
          defaultExpanded: true,
          contentType: 'text/plain'
        }
      ]
    }
  ]
}

export default tree
