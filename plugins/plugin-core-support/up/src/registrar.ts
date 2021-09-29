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

import { Arguments, ParsedOptions } from '@kui-shell/core'

import Checker from './Checker'

import AWS from './aws'
import IBM from './ibm'
import Kubernetes from './kubernetes'
import Iter8 from './iter8'

const defaultCheckers: Checker[] = []

interface Options extends ParsedOptions {
  all?: boolean
  aws?: boolean
  ibm?: boolean
  kubernetes?: boolean
}

export default function checkers(args: Pick<Arguments<Options>, 'parsedOptions'>) {
  const { all } = args.parsedOptions

  return [
    ...defaultCheckers,
    ...(args.parsedOptions.aws || all ? AWS : []),
    ...(args.parsedOptions.ibm || all ? IBM : []),
    ...(all ? Iter8 : []),
    ...(args.parsedOptions.kubernetes || all ? Kubernetes : [])
  ]
}

export function addUpper(checker: Checker) {
  defaultCheckers.push(checker)
}

export function getUppers(args: Pick<Arguments<Options>, 'parsedOptions'> = { parsedOptions: {} }): Checker[] {
  return checkers(args)
}
