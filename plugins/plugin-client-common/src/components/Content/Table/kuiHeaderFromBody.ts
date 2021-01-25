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

import { Table as KuiTable } from '@kui-shell/core'

export default function kuiHeaderFromBody(body: KuiTable['body']): KuiTable['header'] {
  if (body.length > 0) {
    const attributes = (body[0].attributes || []).map(({ key, value }) => ({
      key: key || value,
      value: key || value
    }))

    const key = body[0].key || 'Name'
    return { key, name: key, attributes }
  }
}
