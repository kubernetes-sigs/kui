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

export default interface CodeBlockProps {
  id: string
  body: string
  language: string
  optional?: boolean
  validate?: string

  /**
   * Is this a member of a group of choices? e.g. am I `A` in a choice
   * to do either `A+B` or `C+D`?
   */
  choice?: {
    /**
     * This option names the group, to keep it distinct from other
     * groups of choices.
     */
    group?: string

    /**
     * This option names that member. e.g. if the user can choose
     * between doing either A-and-B or C-and-D, this identifies
     * whether we are part ofth e first choice (A+B) or the second
     * (C+D).
     */
    member?: string
  }
}
