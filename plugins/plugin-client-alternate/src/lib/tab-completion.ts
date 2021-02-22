/*
 * Copyright 2017-20 The Kubernetes Authors
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

import {
  Tab,
  CommandLine,
  registerTabCompletionEnumerator,
  TabCompletionSpec,
  CompletionResponse
} from '@kui-shell/core'

/**
 * Tab completion handler for local files
 *
 */
async function completeLocalFiles(
  tab: Tab,
  commandLine: CommandLine,
  { toBeCompleted }: TabCompletionSpec
): Promise<CompletionResponse[]> {
  if (commandLine.argvNoOptions[0] === 'search') {
    if (/kind:/.test(toBeCompleted)) {
      return ['pod', 'deployment', 'secret']
    }
  }
}

/**
 * Entry point to register tab completion handlers
 *
 */
export function preload() {
  registerTabCompletionEnumerator(completeLocalFiles)
}
