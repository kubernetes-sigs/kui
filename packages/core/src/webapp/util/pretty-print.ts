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
 * @return A converter instance. Note that we are using CSS variables,
 * which should make this instance resilient to theme changes
 */
async function makeConverter() {
  // re: require versus import; issues with allowSyntheticDefaultImports
  const Convert = require('ansi-to-html')

  return new Convert({
    newline: true,
    escapeXML: true,
    bg: 'var(--color-ui-01)',
    fg: 'var(--color-text-01)',
    colors: {
      0: 'var(--color-black)',
      1: 'var(--color-red)',
      2: 'var(--color-green)',
      3: 'var(--color-yellow-text)',
      4: 'var(--color-blue)',
      5: 'var(--color-magenta)',
      6: 'var(--color-cyan)',
      7: 'var(--color-white)',
      8: 'var(--color-black)',
      9: 'var(--color-red)',
      10: 'var(--color-green)',
      11: 'var(--color-yellow)',
      12: 'var(--color-blue)',
      13: 'var(--color-magenta)',
      14: 'var(--color-cyan)',
      15: 'var(--color-white)'
    }
  })
}

/**
 * Remove trailing blank lines
 *
 */
function trim(strings: string[]) {
  let idx = strings.length - 1
  for (; idx >= 0; idx--) {
    if (strings[idx].length > 0) {
      break
    }
  }
  if (idx > 0) {
    return strings.slice(0, idx + 1)
  } else {
    return strings
  }
}

/**
 * Here, we leverage xterm.js to format strings that may include control characters
 *
 * @return void if there is nothing worth formatting, otherwise return
 * an Element containing the formatted strings
 */
export default async function formatAsPty(_strings: string[], wrap = true): Promise<HTMLElement> {
  if (!_strings || (_strings.length === 1 && _strings.every(_ => _.length === 0 || /^\s+$/.test(_)))) {
    // don't bother with empty content, or if every line is just whitespace
    return
  }

  const convert = await makeConverter()
  const { flatten } = await import('../../core/utility')

  const strings = trim(flatten(_strings.map(_ => _.split(/[\n]/))))
  const container = document.createElement('div')

  const formatLine = (_: string) => {
    const line = document.createElement('div')
    container.appendChild(line)

    if (wrap) {
      line.classList.add('pre-wrap')
    }

    line.innerHTML = convert.toHtml(_)
  }

  strings.forEach(formatLine)

  if (strings.length === 1) {
    const single = container.children[0]
    if (single.children.length === 0) {
      // innerText only
      return
    } else if (single.children.length === 1) {
      return single.children[0] as HTMLElement
    } else {
      return single as HTMLElement
    }
  }

  return container
}
