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

import auth from './lib/controller/auth'
import contexts from './lib/controller/contexts'
import kubectl from './lib/controller/kubectl'
import status from './lib/controller/status'

import { Registrar } from '@kui-shell/core/api/commands'

export default async (commandTree: Registrar) => {
  return Promise.all([auth(commandTree), contexts(commandTree), status(commandTree), kubectl(commandTree)])
}
