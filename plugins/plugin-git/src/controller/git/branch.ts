/*
 * Copyright 2020 The Kubernetes Authors
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

import { Arguments, ParsedOptions, RadioTable, Registrar } from '@kui-shell/core'
import { doExecWithStdoutViaPty, doExecWithPty } from '@kui-shell/plugin-bash-like'

interface GitBranchOptions extends ParsedOptions {
  a: boolean
  all: boolean
  f: boolean
  force: boolean
  i: boolean
  'ignore-case': boolean
  d: boolean
  delete: boolean
  D: boolean
  m: boolean
  move: boolean
  c: boolean
  copy: boolean
  C: boolean
  l: boolean
  list: boolean
  'create-reflog': boolean
  'edit-description': boolean
  v: boolean
  verbose: boolean
  q: boolean
  quiet: boolean
  t: boolean
  track: boolean
  u: boolean
  'set-upstream-to': boolean
  'unset-upstream': boolean
  r: boolean
  remotes: boolean
}

function noOptions(parsedOptions: ParsedOptions) {
  return Object.keys(parsedOptions).length === 1 // YargsParser always includes '_'
}

function isList({ argvNoOptions, parsedOptions }: Arguments<GitBranchOptions>): boolean {
  return (
    argvNoOptions.length === 2 &&
    !!(parsedOptions.a || parsedOptions.all || parsedOptions.l || parsedOptions.list || noOptions(parsedOptions))
  )
}

async function doListBranches(args: Arguments<GitBranchOptions>): Promise<RadioTable> {
  args.argvNoOptions.push('--no-pager') // see https://github.com/IBM/kui/issues/6535
  args.argvNoOptions.push('--color=never')
  args.command = args.command.replace('git', 'git --no-pager')
  args.command = `${args.command} --color=never`

  const { default: stripAnsi } = await import('strip-ansi')
  const response = stripAnsi(await doExecWithStdoutViaPty(args))

  let defaultSelectedIdx = 0
  const body = response
    .trim()
    .split(/\n/)
    .map((line, idx) => {
      const isSelected = line.charAt(0) === '*'
      const branchName = line.replace(/^\*?\s*/, '').trim()

      if (isSelected) {
        defaultSelectedIdx = idx
      }

      return {
        nameIdx: 0,
        cells: [branchName],
        onSelect: `git checkout ${branchName}`
      }
    })

  const radio: RadioTable = {
    apiVersion: 'kui-shell/v1',
    kind: 'RadioTable',
    title: 'Git Branches',
    defaultSelectedIdx,
    header: {
      cells: ['Branch']
    },
    body
  }

  return radio
}

function gitBranch(args: Arguments<GitBranchOptions>) {
  if (isList(args)) {
    return doListBranches(args)
  } else {
    return doExecWithPty(args)
  }
}

export default function (registrar: Registrar) {
  registrar.listen('/git/branch', gitBranch, {
    flags: {
      boolean: [
        'a',
        'all',
        'f',
        'force',
        'i',
        'ignore-case',
        'd',
        'delete',
        'D',
        'm',
        'move',
        'c',
        'copy',
        'C',
        'l',
        'list',
        'create-reflog',
        'edit-description',
        'v',
        'verbose',
        'q',
        'quiet',
        't',
        'track',
        'u',
        'set-upstream-to',
        'unset-upstream',
        'r',
        'remotes'
      ]
    }
  })
}
