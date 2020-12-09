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

import runWithProgress from './scaleOut'
import { Arguments, ParsedOptions } from '@kui-shell/core'

function unfoldTensor(cmdline: string, nTasks: number): string[] {
  return Array(nTasks)
    .fill(0)
    .map((_, idx) => cmdline.replace(/\$j/g, idx.toString()))
}

export interface Options extends ParsedOptions {
  p: number
  parallelism: number
}

/**
 * Interprets args.command as a command template of the form:
 *     dd if=/dev/zero bs=1024 count=1024 of=tmp.txt; do cp tmp.txt /s3/aws/myBucket/tmp-$j-$k.txt
 */
export default async function ssc(args: Arguments<Options>) {
  const cmdline = args.command
    .slice(args.argvNoOptions[0].length)
    .trim()
    .replace(/(-p|--parallelism)(=|\s+)\d+/g, '')
  const nTasks = args.parsedOptions.p || args.parsedOptions.parallelism || 10
  return runWithProgress(unfoldTensor(cmdline, nTasks), args)
}
