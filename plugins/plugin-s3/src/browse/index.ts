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

import { Arguments, Registrar, encodeComponent } from '@kui-shell/core'

const opts = { needsUI: true, width: 720, height: 900 }

function doBrowse(this: string, { REPL }: Arguments) {
  return REPL.qexec(`ls ${encodeComponent(this)}`)
}

export default async function(registrar: Registrar) {
  registrar.listen('/browse/s3', doBrowse.bind('/s3'), opts)
  registrar.listen('/browse/cc', doBrowse.bind('/s3/aws/commoncrawl'), opts)
  registrar.listen('/browse/commoncrawl', doBrowse.bind('/s3/aws/commoncrawl'), opts)
}
