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

import wrap from 'word-wrap'
import colors from 'colors/safe'

import { isHeadless } from '../capabilities'
import { Title, Option, Example, Usage, Related } from './types'

export function command(cmdline: string) {
  return `${colors.cyan(cmdline)}`
}

export function intro(paragraph: string) {
  return wrap(paragraph, { width: 100, indent: '  ' }) + '\n'
}

export function option(opts: string | string[]) {
  return typeof opts === 'string'
    ? colors.bold(opts) + colors.reset('')
    : opts.map(_ => colors.bold(_)).join(', ') + colors.reset('')
}

export function title(_: Title) {
  return `${colors.bold(colors.yellow(_.command))} ${colors.reset(_.doc)}
`
}

/** @return pretty-printed version of the given bash pipeline */
export function pipeline(code: string): string {
  return code
    .replace(/(\s+\|\s+)(\w+)/g, (_, p1, p2) => `${p1}${colors.cyan(p2)}`)
    .replace(/(\s+--\s+)(\w+)/g, (_, p1, p2) => `${p1}${colors.cyan(p2)}`)
    .replace(/\[[^\]]*options[^\]]*\]/, _ => colors.gray(_))
    .replace(/\[[^\]]*name[^\]]*\]/, _ => colors.gray(_))
    .replace(/\/s3\/aws\/commoncrawl\/[./\-{},\w]+/, _ => colors.dim(_))
    .replace(/ \|/g, _ => colors.magenta(_))
    .replace(/ \\/g, _ => colors.dim(_))
    .replace(/kiwi super/, _ => colors.yellow(_))
}

// \u2063 is "invisible separator" https://www.fileformat.info/info/unicode/char/2063/index.htm
// needed for columnify, which deletes whitespace
const indent = '  '
const indentedLines = '\n  '

export function usage(usages: Usage[]) {
  return `Usage:
  ${usages.map(pipeline).join(indentedLines)}
`
}

function clickable(cmdline: string) {
  return isHeadless() ? command(cmdline) : `[${cmdline}](#kuiexec?command=${encodeURIComponent(cmdline)})`
}

export function examples(examples: Example[], sectionTitle = 'Examples') {
  const data = examples.map(_ => ({
    command: indent + clickable(_.command),
    doc: _.doc
  }))

  return `${sectionTitle}:
${require('columnify')(data, { showHeaders: false })} 
`
}

export function related(related: Related[]) {
  return `Related:
  ${colors.dim(related.map(command).join(', '))}
`
}

export function options(options: Option[]) {
  const data = options.map(_ => ({
    option: `${indent}${option(_.flags)}`,
    doc: `${_.doc}${_.default ? ` ${colors.gray('default: ' + _.default)}` : ''}`
  }))
  return `Options:
${require('columnify')(data, { showHeaders: false })}
`
}
