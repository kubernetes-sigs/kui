/*
 * Copyright 2019 IBM Corporation
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
 * This file tests "test mmr namespace" command that opens the sidecar with
 * a plain text mode associated with `name` and `namespace`.
 *
 * See the command implementation in: plugin-test/src/lib/cmds/mmr-namespace.ts
 *
 */

import { TestMMR } from '@kui-shell/test'
import { command, metadata } from '../../lib/cmds/mmr-namespace'

const test = new TestMMR(Object.assign(metadata, { command }))

test.namespace()
