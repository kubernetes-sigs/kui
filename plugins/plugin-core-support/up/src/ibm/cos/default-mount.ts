/*
 * Copyright 2021 The Kubernetes Authors
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

import Group from '../../Group'
import { Arguments } from '@kui-shell/core'

async function check({ REPL }: Pick<Arguments, 'REPL'>) {
  await REPL.qexec('vfs fstat /s3/ibm/default')
  return true
}

export default {
  group: Group.Storage,
  label: 'mounted IBM Cloud Object Storage default region',
  needsCloudLogin: true,
  fix: 'ibmcloud cos bind',
  check
}
