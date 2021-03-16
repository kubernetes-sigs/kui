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
  const dashDashPattern = /--\s/
  const redirectPattern = /([^"'\\])>/

  const dashDashMatch = command.match(dashDashPattern)
  const pipeStartIdx = dashDashMatch ? dashDashMatch.index + '--'.length : undefined
  const prefix = !dashDashMatch ? '' : command.slice(0, dashDashMatch.index).trim()

  const redirectMatch = command.match(redirectPattern)
  const pipeEndIdx = redirectMatch ? redirectMatch.index : undefined
  const redirect = !redirectMatch
    ? ''
    : command
        .slice(pipeEndIdx)
        .replace(/^\s*>/, '')
        .trim()

  const stages = split(command, false, undefined, '|', pipeStartIdx, pipeEndIdx).map(_ => split(_, false))

  return { prefix, stages, redirect }
}
