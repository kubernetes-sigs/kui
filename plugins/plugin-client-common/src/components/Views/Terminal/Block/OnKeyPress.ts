/*
 * Copyright 2017-19 IBM Corporation
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

import Input from './Input'

export default async function onKeyPress(this: Input, event: KeyboardEvent) {
  const char = event.key
  if (char === 'Enter') {
    // user typed Enter; we've finished Reading, now Evalute
    const { doEval } = await import('@kui-shell/core')
    doEval(this.props.tab, this.props._block, this.state.prompt.value.trim())
  }
}
