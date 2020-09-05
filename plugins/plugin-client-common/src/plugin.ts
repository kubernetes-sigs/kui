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

import { isHeadless, Registrar } from '@kui-shell/core'

export default async (registrar: Registrar) => {
  if (!isHeadless()) {
    await import(/* webpackMode: "lazy" */ './controller/confirm').then(_ => _.default(registrar))
    await import(/* webpackMode: "lazy" */ './controller/split').then(_ =>
      registrar.listen('/split', _.default, { outputOnly: true, flags: { boolean: ['debug', 'inverse'] } })
    )
    await import(/* webpackMode: "lazy" */ './controller/alert').then(_ => _.default(registrar))
    await import(/* webpackMode: "lazy" */ './controller/card').then(_ => _.default(registrar))
    await import(/* webpackMode: "lazy" */ './controller/commentary').then(_ => _.default(registrar))
  }
}
