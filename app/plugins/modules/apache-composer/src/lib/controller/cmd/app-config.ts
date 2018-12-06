/*
 * Copyright 2018 IBM Corporation
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
import { properties } from '../../utility/usage'
import * as Debug from 'debug'
const debug = Debug('plugins/apache-composer/cmd/app-get')

export default async (commandTree, prequire) => {
  /* command handler for propertis*/
  // the package.json might be in `app/plugins`, or in
  // `app/plugins/modules/composer`, depending, respectively, on whether
  // we are installing composer from npm, versus from git e.g. when
  // testing a development branch
  let pckage
  try {
    pckage = require('../../../../../../node_modules/openwhisk-composer/package.json')
  } catch (err) {
    pckage = require('../../../../node_modules/openwhisk-composer/package.json')
  }

  const propertySynonyms = ['wsk/app', 'composer']
  propertySynonyms.forEach(tree => {
    const cmd = commandTree.listen(`/${tree}/properties`, () => { return `Composer version ${pckage.version}` }, { usage: properties('properties'), noAuthOk: true })

    // synonyms of app properties
    commandTree.synonym(`/${tree}/props`, () => { return `Composer version ${pckage.version}` }, cmd, { usage: properties('props'), noAuthOk: true })
    commandTree.synonym(`/${tree}/config`, () => { return `Composer version ${pckage.version}` }, cmd, { usage: properties('config'), noAuthOk: true })
  })

}
