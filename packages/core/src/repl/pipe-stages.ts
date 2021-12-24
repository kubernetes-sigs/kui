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

import { split } from './split'
import { CommandLine } from '../models/command'

/**
 * Split a given `command` line into the stages of the pipeline
 *
 * e.g. if command=`a -- b c|d > e`, then
 * pipeStages=`{ prefix: 'a', stages: [['b','c'],'d'], redirect: 'e' }`
 *
 */
export function splitIntoPipeStages(command: string): CommandLine['pipeStages'] {
  // This covers the standard bash convention of using -- to split the
  // command line into a "prefix" part and a "rest" part.
  const dashDashPattern = /--\s/

  // This covers > and >>, but excludes '>' and ">" and \>.
  // WARNING: this regexp uses negaive lookbehind. Firefox only got
  // support for this in Firefox version 78 (released July 30 2020).
  // const redirectPattern = /\d?(?<!["'\\])((>>?)&?\d?)/
  const redirectPattern = /\d?((>>?)&?\d?)/ // <-- Safari :(
  // see https://github.com/kubernetes-sigs/kui/issues/8129 for the Safari issue

  const dashDashMatch = command.match(dashDashPattern)
  const pipeStartIdx = dashDashMatch ? dashDashMatch.index + '--'.length : undefined
  const prefix = !dashDashMatch ? '' : command.slice(0, dashDashMatch.index).trim()

  let redirectMatch = command.match(redirectPattern)
  // workaround for lack of negative lookbehind in Safari :(
  if (redirectMatch && redirectMatch.index > 0) {
    if (/["'\\]/.test(command[redirectMatch.index - 1])) {
      // Safari sigh...
      redirectMatch = undefined
    }
  }

  const pipeEndIdx = redirectMatch ? redirectMatch.index : undefined
  const redirect = !redirectMatch ? '' : command.slice(redirectMatch.index + redirectMatch[0].length).trim()

  const redirector = !redirectMatch ? undefined : (redirectMatch[0] as CommandLine['pipeStages']['redirector'])

  const stages = split(command, false, undefined, '|', pipeStartIdx, pipeEndIdx).map(_ =>
    split(_, false).map(_ => _.replace(/\\\s/g, ''))
  )

  return { prefix, stages, redirect, redirector }
}
