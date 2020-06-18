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

import {
  Arguments,
  MultiModalResponse,
  Registrar,
  ExecOptions,
  i18n,
  EditableSpec,
  SaveError,
  isStringWithOptionalContentType
} from '@kui-shell/core'

import flags from './flags'
import { doExecWithStdout } from './exec'
import commandPrefix from '../command-prefix'
import { viewTransformer as getView } from './get'
import { isUsage, doHelp } from '../../lib/util/help'
import { KubeOptions, getNamespace } from './options'
import { KubeResource, isKubeResource, KubeItems, isKubeItems } from '../../lib/model/resource'
import { label as yamlModeLabel, mode as yamlMode, order as yamlModeOrder } from '../../lib/view/modes/yaml'

const strings = i18n('plugin-kubectl')
const strings2 = i18n('plugin-client-common', 'editor')

export function isEditable(resource: KubeResource) {
  const editable = resource as MultiModalResponse<KubeResource>
  const editableMode = editable.modes.find(mode => isStringWithOptionalContentType(mode) && mode.spec)

  return (
    editableMode &&
    isStringWithOptionalContentType(editableMode) &&
    typeof editableMode.spec === 'object' &&
    typeof editableMode.spec.readOnly === 'boolean' &&
    typeof editableMode.spec.clearable === 'boolean' &&
    typeof editableMode.spec.save === 'object' &&
    typeof editableMode.spec.revert === 'object'
  )
}

/**
 * Reformat the apply error.
 *
 * @param tmp the temporary file we used to stage the apply -f ${tmp}
 * @param data the raw data we attempted to apply
 *
 */
function reportErrorToUser(tmp: string, data: string, err: Error) {
  console.error('error in apply for edit', err)

  // was this a validation error?
  const msg = err.message.match(/ValidationError\(.*\): ([^]+) in/)
  if (msg && msg.length === 2) {
    const unknownField = err.message.match(/unknown field "(.*)"/)
    const error: SaveError = new Error(msg[1])
    if (unknownField) {
      const regexp = new RegExp(`${unknownField[1]}:`)
      const lineNumber = data.split(/\n/).findIndex(line => regexp.test(line))
      if (lineNumber >= 0) {
        // monaco indexes from 1
        error.revealLine = lineNumber + 1
      }
    }
    throw error
  } else {
    // maybe this was a syntax error?
    const msg = err.message.match(/error parsing.*(line .*)/)
    if (msg && msg.length === 2) {
      const hasLineNumber = err.message.match(/line (\d+):/)
      const error: SaveError = new Error(msg[1])
      if (hasLineNumber) {
        // not sure why, but this line number is off by + 1
        error.revealLine = parseInt(hasLineNumber[1]) - 1
      }
      throw error
    } else {
      // maybe this was a conflict error
      if (err.message.indexOf('Error from server (Conflict)') !== -1) {
        const errorForFile = `for: "${tmp}":`
        const forFile = err.message.indexOf(errorForFile)
        const messageForFile = err.message.substring(forFile).replace(errorForFile, '')
        throw new Error(messageForFile)
      }
      // hmm, some other random error
      const msg = err.message.replace(tmp, '')
      const newLines = msg.split('\n')
      if (newLines[0].charAt(newLines[0].length - 2) === ':') {
        throw new Error(newLines.slice(0, 2).join('\n'))
      } else {
        throw new Error(newLines[0])
      }
    }
  }
}

export function editSpec(
  cmd: string,
  namespace: string,
  args: Arguments<KubeOptions>,
  resource: KubeResource | KubeItems,
  applySubCommand = ''
): EditableSpec {
  return {
    readOnly: false,
    clearable: false,
    save: {
      label: strings('Apply Changes'),
      onSave: async (data: string) => {
        const tmp = (await args.REPL.rexec(`fwriteTemp`, { data })).content

        try {
          const argv = [cmd === 'k' ? 'kubectl' : cmd, 'apply', applySubCommand, '-n', namespace, '-f', tmp].filter(
            x => x
          )
          const applyArgs = Object.assign({}, args, {
            command: argv.join(' '),
            argv,
            argvNoOptions: [cmd, 'apply', applySubCommand].filter(x => x),
            parsedOptions: { n: namespace, f: tmp }
          })

          // execute the apply command, making sure to report any
          // validation or parse errors to the user
          await doExecWithStdout(applyArgs, undefined, cmd).catch(reportErrorToUser.bind(undefined, tmp, data))

          // to show the updated resource after apply,
          // we re-execute the original edit command after applying the changes.
          // `partOfApply` here is used to signify this execution is part of a chain of controller
          await args.REPL.pexec(args.command, { echo: false, data: { partOfApply: true } })
        } finally {
          args.REPL.rexec(`rmTemp ${tmp}`)
        }

        return {
          // disable editor's auto toolbar update,
          // since this command will handle the toolbarText by itself
          noToolbarUpdate: true
        }
      }
    },
    revert: {
      onRevert: () => resource.kuiRawData
    }
  }
}

function editMode(
  spec: EditableSpec,
  resource: KubeResource,
  mode = 'edit',
  label = strings2('Edit'),
  order = undefined,
  priority = undefined
) {
  return {
    mode,
    label,
    order,
    priority,
    spec,
    contentType: 'yaml',
    content: resource.kuiRawData
  }
}

export async function doEdit(cmd: string, args: Arguments<KubeOptions>) {
  if (isUsage(args)) {
    // special case: get --help/-h
    return doHelp(cmd, args)
  }

  const idx = args.argvNoOptions.indexOf('edit')
  const kindForQuery = args.argvNoOptions[idx + 1] || ''
  const nameForQuery = args.argvNoOptions[idx + 2] || ''
  const ns = await getNamespace(args)

  const getCommand = `${cmd} get ${kindForQuery} ${nameForQuery} -n ${ns} -o yaml`
  const resource = await args.REPL.qexec<KubeResource | KubeItems>(getCommand)

  // isKubeItems: did the user ask to edit a collection of resources?
  const kind = isKubeItems(resource) ? resource.items[0].kind : resource.kind
  const metadata = isKubeItems(resource) ? resource.items[0].metadata : resource.metadata
  const name =
    !isKubeItems(resource) || resource.items.length === 1 ? metadata.name : strings('nItems', resource.items.length)
  const namespace = metadata.namespace

  const spec = editSpec(cmd, namespace, args, resource)

  if (isKubeItems(resource)) {
    const response = {
      apiVersion: 'kui-shell/v1',
      kind,
      metadata: {
        name,
        namespace
      },
      spec,
      modes: [editMode(spec, resource)]
    }
    return response
  } else {
    // the viewTransformer below will create the View out of this Model
    return resource
  }
}

interface EditAfterApply {
  data: {
    partOfApply: boolean
  }
}

function isEditAfterApply(options: ExecOptions): options is EditAfterApply {
  const opts = options as EditAfterApply
  return opts && opts.data && opts.data.partOfApply !== undefined
}

export function formatToolbarText(args: Arguments<KubeOptions>, response: KubeResource) {
  const baseEditToolbar = {
    type: 'info',
    text: strings2('isUpToDate')
  }

  return !isEditAfterApply(args.execOptions)
    ? response.toolbarText
    : Object.assign(baseEditToolbar, { alerts: [{ type: 'success', title: strings('Successfully Applied') }] })
}

/**
 * Variant of `resource` enhanced with an `Editable` impl that saves
 * via kubectl apply.
 *
 */
export async function editable(
  cmd: string,
  args: Arguments<KubeOptions>,
  response: KubeResource
): Promise<MultiModalResponse> {
  const spec = editSpec(cmd, response.metadata.namespace, args, response)

  const baseView = await getView(args, response)

  const view = Object.assign(baseView, {
    modes: [editMode(spec, response, yamlMode, yamlModeLabel, yamlModeOrder - 1)], // overwrite the pre-registered yaml tab
    toolbarText: formatToolbarText(args, response)
  })

  return view
}

/** Variant of `resource` that shows the given `defaultMode` upon open */
function showingMode(defaultMode: string, resource: MultiModalResponse) {
  return Object.assign(resource, { defaultMode })
}

/** KubeResource -> MultiModalResponse view transformer */
export async function viewTransformer(cmd: string, args: Arguments<KubeOptions>, response: KubeResource | KubeItems) {
  if (!isKubeItems(response) && isKubeResource(response)) {
    return showingMode(yamlMode, await editable(cmd, args, response))
  }
}

export const editFlags = (cmd: string) =>
  Object.assign({}, flags, { viewTransformer: viewTransformer.bind(undefined, cmd) })

export function register(registrar: Registrar, cmd: string) {
  registrar.listen(`/${commandPrefix}/${cmd}/edit`, doEdit.bind(undefined, cmd), editFlags(cmd))
}

export default function registerForKubectl(registrar: Registrar) {
  register(registrar, 'kubectl')
  register(registrar, 'k')
}
