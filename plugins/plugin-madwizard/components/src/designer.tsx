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

import React from 'react'
import type { Arguments, ParsedOptions } from '@kui-shell/core'
import { defaultGuidebook as defaultGuidebookFromClient } from '@kui-shell/plugin-madwizard/do'

import WorkloadDesigner from './WorkloadDesigner'

type Options = ParsedOptions & {
  left?: number
}

export function controller(args: Arguments<Options>) {
  const lrSplit: [number, number] | undefined =
    typeof args.parsedOptions.left === 'number' ? [args.parsedOptions.left, 100 - args.parsedOptions.left] : undefined

  return (
    <WorkloadDesigner
      REPL={args.REPL}
      tab={args.tab}
      lrSplit={lrSplit}
      defaultGuidebook={defaultGuidebookFromClient()}
    />
  )
}
