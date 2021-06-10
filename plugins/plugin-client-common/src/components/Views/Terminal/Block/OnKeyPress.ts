/*
 * Copyright 2017 The Kubernetes Authors
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

import { hasUUID } from './BlockModel'
import { isHTMLInputElement, isHTMLTextAreaElement, InputProvider as Input } from './Input'
import { endsWithBackSlash } from '../../util/multiline-input'

export default async function onKeyPress(this: Input, event: KeyboardEvent) {
  const char = event.key
  if (char === 'Enter') {
    const shiftInTextAreaMode = isHTMLTextAreaElement(this.state.prompt) && event.shiftKey

    if (endsWithBackSlash(this.state.prompt.value)) {
      if (isHTMLInputElement(this.state.prompt)) {
        // user typed backslash and Enter; input'll enter multiline mode, and keep reading
        this.setState({ multiline: true })
      }
    } else if (!shiftInTextAreaMode) {
      // user typed Enter; we've finished Reading, now Evalute
      const { doEval } = await import('@kui-shell/core')

      // Do we already have an execUUID? if so, this means we are in the
      // midst of a command re-execution. In order to have the command
      // response flow back to the same block, we have to reuse the
      // execUUID. See https://github.com/IBM/kui/issues/5814
      const execUUID = hasUUID(this.props.model) ? this.props.model.execUUID : undefined

      // see https://github.com/IBM/kui/issues/6311
      this.setState({ isReEdit: false })

      // FIXME: shiftreturned line should be joined with '\'?
      doEval(this.props.tab, this.props._block, this.state.prompt.value.trim(), execUUID)
      //                                                                        ^^^^ reusing execUUID
    }
  }
}
