/*
 * Copyright 2020 IBM Corporation
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

import { Arguments, ParsedOptions, getCurrentTab } from '@kui-shell/core'

interface Options extends ParsedOptions {
  debug: boolean
}

/**
 * This plugin introduces the /split command
 *
 */
export default async function split(args?: Arguments<Options>) {
  if (args && args.parsedOptions.debug) {
    // for debugging
    return args.tab.uuid
  }

  const { doSplitView } = await import('../components/Views/Terminal/ScrollableTerminal')
  return doSplitView(args ? args.tab : getCurrentTab())
}
