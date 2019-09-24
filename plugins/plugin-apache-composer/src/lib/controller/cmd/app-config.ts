/*
 * Copyright 2018-19 IBM Corporation
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

import { Commands } from '@kui-shell/core'

import { properties } from '../../utility/usage'
import { version } from 'openwhisk-composer/package.json'

/**
 * Command handler for the properties command
 *
 */
export default async (commandTree: Commands.Registrar) => {
  // the package.json might be in `app/plugins`, or in
  // `app/plugins/modules/composer`, depending, respectively, on whether
  // we are installing composer from npm, versus from git e.g. when
  // testing a development branch

  const propertySynonyms = ['wsk/app', 'composer']
  propertySynonyms.forEach(tree => {
    const cmd = commandTree.listen(
      `/${tree}/properties`,
      () => {
        return `Composer version ${version}`
      },
      { usage: properties('properties'), noAuthOk: true }
    )

    // synonyms of app properties
    commandTree.synonym(
      `/${tree}/props`,
      () => {
        return `Composer version ${version}`
      },
      cmd,
      { usage: properties('props'), noAuthOk: true }
    )
    commandTree.synonym(
      `/${tree}/config`,
      () => {
        return `Composer version ${version}`
      },
      cmd,
      { usage: properties('config'), noAuthOk: true }
    )
  })
}
