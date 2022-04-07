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

import { START_OF_TIP, END_OF_TIP } from '../rehype-tip'
import { START_OF_TAB, END_OF_TAB, PUSH_TABS } from '.'

/** A placeholder marker to indicate markdown that uses indentation not to mean Tab or Tip content */
const FAKE_END_MARKER = ''

/**
 * pymdown uses indentation to define tab content; remark-parse seems
 * to turn these into <pre> blocks before we get control; hack it for
 * now
 */
export default function hackIndentation(source: string): string {
  let inTab: RegExp
  let inBlockquote = false
  let inCodeBlock = false
  let blockquoteOrCodeBlockIndent: number
  const endMarkers: string[] = []

  const indentDepthOfContent: number[] = []

  const unindent = (line: string) => {
    if (!inBlockquote && !inCodeBlock) {
      return line.replace(/^\s*/, '')
    } else {
      if (blockquoteOrCodeBlockIndent > 0) {
        return line.replace(new RegExp(`^\\s{${blockquoteOrCodeBlockIndent}}`), '')
      } else {
        return line
      }
    }
  }

  const pop = (line: string, delta = 0) => {
    const indentMatch = line.match(/^\s+/)
    const curIndentDepth = indentDepthOfContent[indentDepthOfContent.length - 1]
    const thisIndentDepth = !indentMatch ? 0 : ~~(indentMatch[0].length / 4)

    let pop = ''
    for (let idx = curIndentDepth; idx > thisIndentDepth + delta; idx--) {
      indentDepthOfContent.pop()
      const endMarker = endMarkers.pop()
      if (endMarker) {
        pop += `\n${endMarker}\n\n`
      }
    }

    if (pop) {
      if (endMarkers.length === 0) {
        inTab = undefined
      } else {
        const indentDepth = indentDepthOfContent[indentDepthOfContent.length - 1]
        inTab = new RegExp(
          '^' +
            Array(indentDepth * 4)
              .fill(' ')
              .join('')
        )
      }
    }
    return pop
  }

  const rewrite = source.split(/\n/).map(line => {
    const tabStartMatch = line.match(/^(\s*)===\s+".*"/)
    const tipStartMatch = line.match(
      /^(\s*)[?!][?!][?!](\+?)\s+(tip|todo|bug|info|note|warning|caution|success|question)/i
    )
    const startMatch = tabStartMatch || tipStartMatch

    if (!inBlockquote && startMatch) {
      const thisIndentation = startMatch[1] || ''
      const indentDepth = indentDepthOfContent[indentDepthOfContent.length - 1] || 0
      const thisIndentDepth = !thisIndentation ? 1 : ~~(thisIndentation.length / 4) + 1

      const currentEndMarker = endMarkers.length === 0 ? undefined : endMarkers[endMarkers.length - 1]
      const endMarker = tabStartMatch ? END_OF_TAB : END_OF_TIP

      const possibleEndTab =
        (indentDepth === thisIndentDepth && currentEndMarker === END_OF_TIP) || endMarker === END_OF_TIP
          ? pop(line, 0)
          : !(inTab && indentDepth > thisIndentDepth)
          ? ''
          : pop(line, 1)

      const possibleNesting = !(
        inTab &&
        tabStartMatch &&
        indentDepth < thisIndentDepth &&
        endMarkers.find(_ => _ === END_OF_TAB)
      )
        ? ''
        : `\n\n${PUSH_TABS}\n\n`

      const startMarker = tabStartMatch ? START_OF_TAB : START_OF_TIP

      if (thisIndentDepth > indentDepth + 1) {
        // then the markdown is using indentation in ways beyond that
        // which would be "normal" for pymdown, i.e. to indicate Tab
        // or Tip content
        endMarkers.push(FAKE_END_MARKER)
        indentDepthOfContent.push(indentDepthOfContent[indentDepthOfContent.length - 1])
      }

      if (endMarker === END_OF_TIP || endMarkers.length === 0 || thisIndentDepth > indentDepth) {
        endMarkers.push(endMarker)
        indentDepthOfContent.push(thisIndentDepth)
      }

      inTab = new RegExp(
        '^' +
          Array(thisIndentDepth * 4)
            .fill(' ')
            .join('')
      )

      return `\n\n${possibleEndTab}${possibleNesting}${startMarker}\n\n` + unindent(line)
    } else if (/^\s*```/.test(line)) {
      const possibleEndOfTab = !inTab || inTab.test(line) ? '' : pop(line)

      if (/(bash|sh|shell)/.test(line)) {
        blockquoteOrCodeBlockIndent = line.search(/\S/)
        inCodeBlock = true
      } else if (inCodeBlock) {
        inCodeBlock = false
      } else if (!inBlockquote) {
        blockquoteOrCodeBlockIndent = line.search(/\S/)
        inBlockquote = true
      } else {
        inBlockquote = false
      }
      return possibleEndOfTab + unindent(line)
    } else if (inTab) {
      const unindented = unindent(line)

      if (line.length === 0 || /^\s+$/.test(line) || inBlockquote || inTab.test(line)) {
        // empty line, in blockquote, or still in tab
        return unindented
      } else {
        // possibly pop the stack of indentation
        return pop(line) + unindented
      }
    } else if (inBlockquote || inCodeBlock) {
      return unindent(line)
    }

    return line
  })

  while (endMarkers.length > 0) {
    const endMarker = endMarkers.pop()
    if (endMarker) {
      rewrite.push(endMarker)
    }
  }

  return rewrite.join('\n')
}
