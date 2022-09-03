/*
 * Copyright 2019 The Kubernetes Authors
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

/**
 * This file tests "test mmr name" command that opens the sidecar with
 * a plain text mode associated with a name metadata.
 *
 * See the command implementation in: plugin-test/src/lib/cmds/mmr-name.ts
 *
 */
import { TestMMR } from '@kui-shell/test'

const testMetadataName = new TestMMR({
  command: 'test mmr name',
  metadata: {
    name: 'this is the name part'
  }
})

const testPrettyName = new TestMMR({
  command: 'test mmr name --pretty',
  metadata: {
    name: 'this is the name part'
  }
})

testMetadataName.name({
  //  nameHash: 'this is the namehash part',
  //  onclick: {
  //    nameHash: { command: 'test string --grumble 1', expect: 'hello world 1' }
  //  }
})

testPrettyName.name({
  nameHash: 'this is the namehash part'
  //  prettyName: 'this is the prettyName part',
  //  onclick: {
  //    nameHash: { command: 'test string --grumble 1', expect: 'hello world 1' }
  //  }
})
