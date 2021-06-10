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

export function isMultiLineHereDoc(text: string) {
  const lines = text.split(/[\n\r]/)
  // TODO: expand to match <<, but we'll need to handle the case for escapes: e.g. cat"<<"EOF, cat\<<EOF and cat’<<’EOF
  return lines[0].startsWith('cat <<') && lines.length > 1
}

export function endsWithBackSlash(text: string) {
  return text[text.length - 1] === '\\'
}

export function includesBachSlash(text: string) {
  return text.includes('\\')
}
