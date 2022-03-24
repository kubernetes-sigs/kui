/*
 * Copyright 2022 The Kubernetes Authors
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

function indentArray(strings: string[], indentation: string) {
  return (indentation.length === 0 ? strings : strings.map(_ => `${indentation}${_}`)).join('\n')
}

export default function indent(str: string, indentation = '    ') {
  return indentArray(str.split(/\n/), indentation)
}

export function indentAll(strings: string[], indentation: string) {
  if (indentation.length === 0) {
    return strings.join('\n')
  } else {
    return strings.map(_ => indent(_, indentation)).join('\n')
  }
}
