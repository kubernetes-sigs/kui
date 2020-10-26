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

import { skipAndLimit } from '../usage'

export const list = {
  command: 'list',
  docs: 'list recent activations',
  strict: 'list',
  optional: [
    {
      name: 'name',
      positional: true,
      docs: 'filter by a given action name'
    },
    {
      name: '--name',
      docs: 'filter by a given action name'
    },
    {
      name: '--since',
      docs: 'return activations with timestamps later than SINCE; measured in milliseconds since epoch'
    },
    {
      name: '--upto',
      docs: 'return activations with timestamps earlier than UPTO; measured in milliseconds since epoch'
    }
  ].concat(skipAndLimit)
}
