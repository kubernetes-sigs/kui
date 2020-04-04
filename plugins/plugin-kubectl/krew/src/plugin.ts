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

import { Registrar } from '@kui-shell/core'
import { defaultFlags, commandPrefix } from '@kui-shell/plugin-kubectl'

import help from './controller/help'
import info from './controller/info'
import list from './controller/list'
import genericTable from './controller/generic-table'

const aliases = ['k', 'kubectl']
const canonical = 'kubectl'

export default async (registrar: Registrar) => {
  aliases.forEach(command => {
    registrar.listen(`/${commandPrefix}/${command}/krew/help`, help(canonical), defaultFlags)
    registrar.listen(`/${commandPrefix}/${command}/krew/info`, info(canonical), defaultFlags)
    registrar.listen(`/${commandPrefix}/${command}/krew/list`, list(canonical), defaultFlags)
    registrar.listen(`/${commandPrefix}/${command}/krew/search`, genericTable(canonical), defaultFlags)
    registrar.listen(`/${commandPrefix}/${command}/krew/version`, genericTable(canonical), defaultFlags)
  })
}
