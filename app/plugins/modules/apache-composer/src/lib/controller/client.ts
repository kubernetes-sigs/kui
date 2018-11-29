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

import * as Debug from 'debug'
const debug = Debug('plugins/apache-composer/client')
import * as Conductor from '@ibm-functions/composer/conductor'

/**
  * Deploy the given composition to Apache OpenWhisk
  *
  * @param composition the output of
  * e.g. composer.sequence(a,b).compile(), but with a name field
  * added.
  *
  */
export const deploy = ({ composition, overwrite }) => {
  // deploys the JSON-encoded composition
  debug('deploying composition', composition)
  return Conductor().compositions.deploy(composition, overwrite)
    .then(entity => {
      // delploy returns [{...}]
      return Object.assign(entity[0], { name: entity[0].id, verb: 'update', type: 'composition' })
    })
}
