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

import { KResponse } from '@kui-shell/core'

export function tryParse(str: string | Record<string, any>) {
  if (typeof str !== 'string') {
    return str
  }

  try {
    if (str) {
      return JSON.parse(str)
    }
  } catch (err) {
    if (/{/.test(str)) {
      console.error('Error parsing response', err)
    }
  }

  return str
}

export function tryFrontmatter(
  value: string
): Pick<import('front-matter').FrontMatterResult<any>, 'body' | 'attributes'> {
  try {
    const frontmatter = require('front-matter')
    return frontmatter(value)
  } catch (err) {
    console.error('Error parsing frontmatter', err)
    return {
      body: value,
      attributes: {}
    }
  }
}

export function codeWithResponseFrontmatter(body: string, response?: KResponse) {
  const frontmatter = !response
    ? ''
    : `---
response: ${JSON.stringify(response)}
---
`

  return `
\`\`\`
${frontmatter}${body}
\`\`\`
`
}
