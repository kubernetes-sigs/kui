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

export interface WizardSteps {
  /** An alternate way to define the steps of a wizard layout */
  wizard: {
    /** Optional subtitle in the wizard header */
    description?: string

    /** Show progress UI that tracks execution of code blocks [default: 'bar'] */
    progress?: 'bar' | 'none'

    /**
     * Specification of the steps, each of which is the name of a
     * heading in the markdown source. Optionally, a step description
     * may be overlaid
     */
    steps: (string | { match?: string; name: string; description: string })[]
  }
}

interface CodeBlocks {
  codeblocks: {
    /** A string that will be interpreted as regular expression. Any
    markdown code blocks whose body matches this pattern will be seen
    as instances of the rules below (e.g. `language`, `validate`,
    etc.) */
    match: string

    /** Override any `language` property of the matched code block */
    language?: string

    /**
     * If given, this command line will be executed. If it exits with
     * exit code 0, then the code block will be seen as "already
     * executed", and thus represent a valid state. Non-zero exit
     * codes will not be seen as errors, but rather as representative
     * of a default state.
     */
    validate?: string

    /**
     * Is successful execution of this code block seen as necessary
     * for overall successful completion of the enclosing
     * guidebook? */
    optional?: boolean
  }[]
}

type KuiFrontmatter = Partial<WizardSteps> &
  Partial<CodeBlocks> & {
    /** Title of the Notebook */
    title?: string

    layoutCount?: Record<string, number>

    /**
     * A mapping that indicates which section (the `number` values) should be rendered in a given split position.
     */
    layout?: 'wizard' | Record<number | 'default', SplitPositionSpec>
  }

export function hasWizardSteps(frontmatter: KuiFrontmatter): frontmatter is KuiFrontmatter & Required<WizardSteps> {
  return (
    frontmatter.wizard &&
    frontmatter.wizard.steps &&
    Array.isArray(frontmatter.wizard.steps) &&
    frontmatter.wizard.steps.length > 0
  )
}

export function hasCodeBlocks(frontmatter: KuiFrontmatter): frontmatter is KuiFrontmatter & Required<CodeBlocks> {
  return frontmatter.codeblocks && Array.isArray(frontmatter.codeblocks) && frontmatter.codeblocks.length > 0
}

type SplitPosition = 'left' | 'bottom' | 'default' | 'wizard'
type SplitPositionObj = { position: SplitPosition; placeholder?: string; maximized?: boolean | 'true' | 'false' }
type SplitPositionSpec = SplitPosition | SplitPositionObj

export type PositionProps = {
  'data-kui-split': SplitPosition
}

export function isValidPosition(position: SplitPositionSpec): position is SplitPosition {
  return (
    typeof position === 'string' &&
    (position === 'default' || position === 'left' || position === 'bottom' || position === 'wizard')
  )
}

export function isValidPositionObj(position: SplitPositionSpec): position is SplitPositionObj {
  const pos = position as SplitPositionObj
  return typeof pos === 'object' && typeof pos.position === 'string'
}

export default KuiFrontmatter
