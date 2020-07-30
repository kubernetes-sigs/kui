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

export default function strip(raw: string): { messages: string[]; content: string[] } {
  const lines = raw.split(/\n/)
  const justBeforeContentIdx = lines.findIndex(_ => /(Getting|Listing) .*\.\.\./.test(_))

  if (justBeforeContentIdx >= 0) {
    const justAfterContentIdx = lines.findIndex(_ => /OK/.test(_), justBeforeContentIdx + 1)
    const messages = lines
      .slice(0, justBeforeContentIdx)
      .concat(justAfterContentIdx < 0 ? [] : lines.slice(justAfterContentIdx))
      .filter(_ => !/OK/.test(_) && !/performed successfully/.test(_))
    const content = lines.slice(justBeforeContentIdx + 1, justAfterContentIdx)
    return { messages, content }
  }
}
