/*
 * Copyright 2019 The Kubernetes Authors
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

import { Arguments, ExecOptions, expandHomeDir, ParsedOptions } from '@kui-shell/core'

import { FinalState } from '../../lib/model/states'
import { getCurrentDefaultNamespace } from './contexts'
import { getCommandFromArgs } from '../../lib/util/util'

type EntityFormat = 'yaml' | 'json'
type TableFormat = 'wide' | string // want: 'custom-columns-file=' | 'custom-columns='
type CustomFormat = string // want: 'go-template' | 'go-template-file' | 'jsonpath' | 'jsonpath-file'
type OutputFormat = EntityFormat | TableFormat | CustomFormat

/** @return the -f or --filename option */
export function fileOf(args: Pick<Arguments<KubeOptions>, 'parsedOptions'>): string | string[] {
  const filename = args.parsedOptions.f || args.parsedOptions.filename
  return typeof filename === 'string' || Array.isArray(filename) ? filename : undefined
}

/** @return same as fileOf, but also specify whether this came from a -f or --filename option */
export function fileOfWithDetail(
  args: Pick<Arguments<KubeOptions>, 'parsedOptions'>
): { filepath: string | string[]; isFor: 'f' | 'filename' } {
  return {
    filepath: fileOf(args),
    isFor: args.parsedOptions.f ? 'f' : 'filename'
  }
}

/** @return the -R or --recursive option */
export function isRecursive(args: Arguments<KubeOptions>) {
  return args.parsedOptions.R || args.parsedOptions.recursive
}

/** @return the -k or --kustomize option */
export function kustomizeOf(args: Arguments<KubeOptions>): string {
  return args.parsedOptions.k || args.parsedOptions.kustomize
}

export function getFileForArgv(args: Arguments<KubeOptions>, addSpace = false): string {
  const file = fileOf(args)
  if (file) {
    return `-f ${file}${addSpace ? ' ' : ''}`
  } else {
    const kusto = kustomizeOf(args)
    if (kusto) {
      return `-k ${kusto}${addSpace ? ' ' : ''}`
    }
  }

  return ''
}

export function getFileFromArgv(args: Arguments<KubeOptions>): string | string[] {
  const file = fileOf(args)
  if (file) {
    return file
  } else {
    const kusto = kustomizeOf(args)
    if (kusto) {
      return kusto
    }
  }
}

export function formatOf({ parsedOptions }: Pick<Arguments<KubeOptions>, 'parsedOptions'>): OutputFormat {
  return parsedOptions.o || parsedOptions.output
}

export function isEntityFormat(format: OutputFormat): format is EntityFormat {
  return format === 'yaml' || format === 'json'
}

export function isEntityRequest(args: Arguments<KubeOptions>) {
  return isEntityFormat(formatOf(args))
}

export function isCustomColumns(format: OutputFormat): format is TableFormat {
  return /^custom-columns=/.test(format)
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
  return !format || format === 'wide' || isCustomColumns(format) || /^custom-columns-file=/.test(format)
}

export function isDashHelp(args: Arguments<KubeOptions>) {
  return args.parsedOptions.help || args.parsedOptions.h
}

export function isHelpRequest(args: Arguments<KubeOptions>) {
  return (
    isDashHelp(args) || args.argvNoOptions[1] === 'help' || args.argvNoOptions[1] === 'options' // usage: `kubectl options`
  )
}

export function isTableRequest(args: Pick<Arguments<KubeOptions>, 'parsedOptions'>) {
  return isTableFormat(formatOf(args))
}

export function isWatchRequest(args: Pick<Arguments<KubeOptions>, 'parsedOptions'>) {
  return !!(args.parsedOptions.w || args.parsedOptions.watch || args.parsedOptions['watch-only'])
}

export function watchRequestFrom(args: Arguments<KubeOptions>, forceWatch = false) {
  if (forceWatch) {
    return '--watch'
  } else if (args.parsedOptions.w) {
    return '-w'
  } else if (args.parsedOptions.watch) {
    return '--watch'
  } else if (args.parsedOptions['watch-only']) {
    return '--watch-only'
  } else {
    return ''
  }
}

export function isTableWatchRequest(args: Arguments<KubeOptions>) {
  return isWatchRequest(args) && isTableRequest(args)
}

export function getLabel({ parsedOptions }: Pick<Arguments<KubeOptions>, 'parsedOptions'>) {
  const label = parsedOptions.l || parsedOptions.label
  if (label) {
    return label
  } else {
    // we need to pick the last one, in the case the command line
    // specified more than one; e.g. for `k get pod -lname=nginx
    // -lfoo=bar -n t1`, the kubectl CLI picks foo=bar
    let lastOne: string

    // yargs-parser doesn't handle -lname=nginx without the space
    // after -l; or least not the way we've configured it
    for (const key in parsedOptions) {
      if (/^l.+/.test(key) && key !== 'limit') {
        const value = parsedOptions[key]
        if (value) {
          lastOne = `${key.slice(1)}=${value}`
        }
      }
    }

    return lastOne
  }
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

/** @return the namespace as expressed in the command line, or undefined if not */
export function getNamespaceAsExpressed(args: Pick<Arguments<KubeOptions>, 'parsedOptions'>): string {
  const ns = args.parsedOptions.n || args.parsedOptions.namespace
  if (Array.isArray(ns)) {
    return ns[ns.length - 1]
  } else {
    return ns
  }
}

/** @return the namespace as expressed in the command line, or the default from context */
export async function getNamespace(args: Arguments<KubeOptions>): Promise<string> {
  return getNamespaceAsExpressed(args) || (await getCurrentDefaultNamespace(args))
}

/**
 * A variant of getNamespace where you *only* want to use what was
 * provided by the user in their command line.
 */
export function getNamespaceForArgv(args: Pick<Arguments<KubeOptions>, 'parsedOptions'>): string {
  const ns = getNamespaceAsExpressed(args)
  return !ns ? '' : `-n ${ns}`
}

/** @return the resource names array as expressed in the command line */
export function getResourceNamesForArgv(kindFromArgv: string, args: Arguments<KubeOptions>): string[] {
  return args.argvNoOptions.slice(args.argvNoOptions.indexOf(kindFromArgv) + 1)
}

export function getContext(args: Arguments<KubeOptions>) {
  return args.parsedOptions.context
}

/** e.g. for kubectl logs */
export function getContainer(args: Arguments<KubeOptions>, verb: string) {
  const maybe = args.parsedOptions.c || args.parsedOptions.container
  if (maybe) {
    // specified via -c
    return maybe
  } else {
    // otherwise, specified as a positional parameter
    const idx = args.argvNoOptions.indexOf(verb)
    return args.argvNoOptions[idx + 2]
  }
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

/** Options that specify a filepath */
export type FilepathOption =
  | 'kubeconfig'
  | 'f'
  | 'filename'
  | 'k'
  | 'kustomize'
  | 'client-key'
  | 'client-certificate'
  | 'certificate-authority'
  | 'cache-dir'

/** An incomplete set of kubectl options */
export interface KubeOptions extends ParsedOptions {
  A?: boolean
  'all-namespaces'?: boolean

  cluster?: string
  context?: string
  kubeconfig?: string

  'dry-run'?: boolean | string

  n?: string | string[]
  namespace?: string | string[]

  c?: string
  container?: string

  o?: OutputFormat
  output?: OutputFormat

  w?: boolean
  watch?: boolean
  'watch-only'?: boolean

  wait?: boolean

  p?: boolean
  previous?: boolean

  l?: string
  label?: string

  f?: string | string[]
  filename?: string | string[]

  k?: string
  kustomize?: string

  h?: boolean
  help?: boolean

  limit?: number

  'sort-by'?: string
}

export function isForAllNamespaces(parsedOptions: KubeOptions) {
  return parsedOptions.A || parsedOptions['all-namespaces']
}

/** Copy over any kubeconfig/context/cluster/namespace specifications from the given args */
export function withKubeconfigFrom(args: Pick<Arguments<KubeOptions>, 'parsedOptions'>, cmdline: string): string {
  let extras = ' '

  if (args.parsedOptions.kubeconfig && !/--kubeconfig/.test(cmdline)) {
    extras += ` --kubeconfig ${expandHomeDir(args.parsedOptions.kubeconfig)}`
  }

  if (args.parsedOptions.context && !/--context/.test(cmdline)) {
    extras += ` --context ${args.parsedOptions.context}`
  }

  if (args.parsedOptions.cluster && !/--cluster/.test(cmdline)) {
    extras += ` --cluster ${args.parsedOptions.cluster}`
  }

  if (
    !/\s(-n|--namespace)/.test(cmdline) &&
    !/(get|apply|create|delete|explain)\s+(ns|namespace|namespaces|Namespace|Namespaces)\b/.test(cmdline)
  ) {
    // only add namespace option if 1) not already specified; and 2)
    // we aren't fetching a namespace
    extras += ` ${getNamespaceForArgv(args)} `
  }

  // careful: respect any `--` on the cmdline, and insert our extras
  // *before* that point
  const insertionIndex = cmdline.indexOf(' -- ')
  if (insertionIndex < 0) {
    return cmdline + extras
  } else {
    return cmdline.slice(0, insertionIndex) + extras + cmdline.slice(insertionIndex)
  }
}

function execOptionsHasPrefix(data: Arguments['execOptions']['data']): data is { kubectlPrefix: string } {
  return !Buffer.isBuffer(data) && typeof data === 'object' && typeof data.kubectlPrefix === 'string'
}

/** As with `withKubeconfigFrom`, and also copy over the leading command (e.g. `kubectl`) */
export function withKubeconfigAndCommandFrom(
  args: Pick<Arguments<KubeOptions>, 'argvNoOptions' | 'execOptions' | 'parsedOptions'>,
  cmdline: string
): string {
  if (execOptionsHasPrefix(args.execOptions.data)) {
    return withKubeconfigFrom(args, `${args.execOptions.data.kubectlPrefix} ${cmdline}`)
  } else {
    return withKubeconfigFrom(args, `${getCommandFromArgs(args)} ${cmdline}`)
  }
}

/** Apply --dry-run? */
export function isDryRun(args: Arguments<KubeOptions>): boolean {
  const opt = args.parsedOptions['dry-run']
  return typeof opt === 'boolean' || opt === 'client' || opt === 'server'
}

export function isDiffRequest(args: Arguments<KubeOptions>): boolean {
  return args.execOptions.data && args.execOptions.data['diff']
}

export default KubeOptions
