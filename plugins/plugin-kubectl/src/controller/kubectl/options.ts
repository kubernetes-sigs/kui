/*
 * Copyright 2019 IBM Corporation
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

import { Arguments, ExecOptions, ParsedOptions } from '@kui-shell/core'
import { FinalState } from '../../lib/model/states'

type EntityFormat = 'yaml' | 'json'
type TableFormat = 'wide' | string // want: 'custom-columns-file=' | 'custom-columns='
type CustomFormat = string // want: 'go-template' | 'go-template-file' | 'jsonpath' | 'jsonpath-file'
type OutputFormat = EntityFormat | TableFormat | CustomFormat

export function fileOf(args: Arguments<KubeOptions>): string {
  return args.parsedOptions.f || args.parsedOptions.filename
}

export function formatOf(args: Arguments<KubeOptions>): OutputFormat {
  return args.parsedOptions.o || args.parsedOptions.output
}

export function isEntityFormat(format: OutputFormat): format is EntityFormat {
  return format === 'yaml' || format === 'json'
}

export function isEntityRequest(args: Arguments<KubeOptions>) {
  return isEntityFormat(formatOf(args))
}

/**
 * Notes: we interpret the lack of an output format designation as a
 * request for tabular output. This seems in keeping with the
 * `kubectl` behavior.
 *
 * @return truthy if the format indicates a desire for tabular output
 *
 */
function isTableFormat(format: OutputFormat): format is TableFormat {
  return !format || format === 'wide' || /^custom-columns=/.test(format) || /^custom-columns-file=/.test(format)
}

export function isHelpRequest(args: Arguments<KubeOptions>) {
  return (
    args.parsedOptions.help ||
    args.parsedOptions.h ||
    args.argvNoOptions[1] === 'help' ||
    args.argvNoOptions[1] === 'options' // usage: `kubectl options`
  )
}

export function isTableRequest(args: Arguments<KubeOptions>) {
  return isTableFormat(formatOf(args))
}

export function isWatchRequest(args: Arguments<KubeOptions>) {
  return args.parsedOptions.w || args.parsedOptions.watch || args.parsedOptions['watch-only']
}

export function isTableWatchRequest(args: Arguments<KubeOptions>) {
  return isWatchRequest(args) && isTableRequest(args)
}

export function getLabel(args: Arguments<KubeOptions>) {
  // TODO, handle -lapp=name, see hasLabel below
  return args.parsedOptions.l || args.parsedOptions.label
}

export function getLabelForArgv(args: Arguments<KubeOptions>) {
  const label = getLabel(args)
  if (label) {
    return `-l ${label}`
  } else {
    return ''
  }
}

/**
 * Due to deficiencies in yargs-parser (used by @kui-shell/core), the
 * form -lapp=name (i.e. without a whitespace after the -l) is not
 * parsed properly.
 */
export function hasLabel(args: Arguments<KubeOptions>) {
  if (args.parsedOptions.l || args.parsedOptions.label) {
    return true
  }
  for (const key in args.parsedOptions) {
    if (/^l/.test(key)) {
      return true
    }
  }
  return false
}

export function getNamespace(args: Arguments<KubeOptions>) {
  return args.parsedOptions.n || args.parsedOptions.namespace
}

export function getNamespaceForArgv(args: Arguments<KubeOptions>) {
  const ns = getNamespace(args)
  if (ns) {
    return `-n ${ns}`
  } else {
    return ''
  }
}

export function getContext(args: Arguments<KubeOptions>) {
  return args.parsedOptions.context
}

export function getContextForArgv(args: Arguments<KubeOptions>) {
  const context = getContext(args)
  if (context) {
    return `--context ${context}`
  } else {
    return ''
  }
}

export interface KubeExecOptions extends ExecOptions {
  finalState: FinalState
  nResourcesToWaitFor: number

  /** e.g. kubectl delete followed by a watch; if the watch fails,
   * we'd like to report the initial response from the delete */
  initialResponse: string
}

export interface KubeOptions extends ParsedOptions {
  A?: boolean
  'all-namespaces'?: boolean

  context?: string

  n?: string
  namespace?: string

  o?: OutputFormat
  output?: OutputFormat

  w?: boolean
  watch?: boolean
  'watch-only'?: boolean

  wait?: boolean

  l?: string
  label?: string

  f?: string
  filename?: string

  h?: boolean
  help?: boolean
}

export function isForAllNamespaces(args: Arguments<KubeOptions>) {
  return args.parsedOptions.A || args.parsedOptions['all-namespaces']
}

export default KubeOptions
