/*
 * Copyright 2020 The Kubernetes Authors
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
 * This file tests "test sassy" command that expects a simple `hi`
 * string response
 *
 * See the command implementation in: plugin-test/src/lib/cmds/style.ts
 *
 */

import { TestStringResponse } from '@kui-shell/test'

new TestStringResponse({
  command: 'test sassy',
  expect: 'hi',
  exact: true
}).string()
