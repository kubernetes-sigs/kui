/*
 * Copyright 2019-2020 IBM Corporation
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

import { Activation, ActivationDesc } from 'openwhisk'
import { isHeadless, flatten, Arguments, Registrar, Table } from '@kui-shell/core'

import { withStandardOptions, standardListUsage } from '../usage'
import { synonyms } from '../../models/synonyms'
import { copy, nameForList, ListOptions } from '../options'
import { clientOptions, getClient } from '../../client/get'
import { asActivation, asActivationTable } from './as-activation'
import { isSession } from '../../views/activation/list'

import { list as listUsage } from './usage'

/**
 * Pattern that matches /a/b/c, and captures the b/c part. It is
 * optional on the b part, and thus will match /a/c while capturing c.
 *
 */
const fqnPattern = /^\/[^/]+\/(([^/]+\/)?.*)$/

/**
 * The activation list impl.
 *
 */
export const doList = async (
  list: string,
  { tab, argvNoOptions, parsedOptions, execOptions }: Arguments<ListOptions>
) => {
  let name = argvNoOptions[argvNoOptions.indexOf(list) + 1]

  if (!parsedOptions.skip) {
    parsedOptions.skip = 0
  }
  if (!parsedOptions.limit) {
    parsedOptions.limit = 200
  }

  if (name) {
    const fqnMatch = name.match(fqnPattern)
    if (fqnMatch) {
      // openwhisk activation queries don't support FQN, only
      // package/action or action
      name = fqnMatch[1]
    }
    parsedOptions.name = name
  }

  const args = copy(parsedOptions, nameForList(name))

  // eslint-disable-next-line no-useless-catch
  try {
    const raw =
      parsedOptions.limit > 200 && !parsedOptions.count
        ? flatten(
            await Promise.all(
              Array(~~(parsedOptions.limit / 200))
                .fill(0)
                .map((_, idx, A) => {
                  const myArgs = Object.assign({}, args, {
                    limit: idx < A.length - 1 ? 200 : args.limit % 200,
                    skip: args.skip + idx * 200
                  })
                  return getClient(execOptions).activations.list(Object.assign({}, myArgs, clientOptions))
                })
            )
          )
        : await getClient(execOptions).activations.list(Object.assign({}, args, clientOptions))

    if (parsedOptions.count) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((raw as any) as { activations: number }).activations
    } else {
      const list = raw.map(asActivation)
      if (execOptions.raw) {
        return { mode: 'raw', content: list }
      } else if (isHeadless()) {
        const L = await asActivationTable(tab, list)
        if (L.body.length > 0) {
          L.header.type = isSession(raw[0]) ? 'sessions' : 'activations' // hack: needed to make core's headless pretty printer work
        }
        return L
      } else {
        return raw
      }
    }
  } catch (err) {
    throw err
  }
}

export function startupPenalty(activation: ActivationDesc) {
  // const waitAnno = activation.annotations.find(_ => _.key === 'waitTime')
  const initAnno = activation.annotations.find(_ => _.key === 'initTime')
  return /* (!waitAnno ? 0 : waitAnno.value) + */ !initAnno ? 0 : initAnno.value
}

export async function viewTransformer(
  args: Arguments<ListOptions>,
  activations: Error | Activation<Record<string, any>>[],
  drilldownCommand = 'get'
): Promise<Table> {
  if (Array.isArray(activations)) {
    const ns = await args.REPL.qexec<string>('wsk namespace current')
    return {
      statusColumnIdx: 1,
      durationColumnIdx: 2,
      coldStartColumnIdx: 3,
      startColumnIdx: 4,
      completeColumnIdx: 5,
      title: 'Activations',
      breadcrumbs: [{ label: ns }],
      body: activations.map(_ => ({
        name: _.name,
        attributes: [
          { key: 'Id', value: _.activationId, onclick: `wsk activation ${drilldownCommand} ${_.activationId}` },
          {
            key: 'Status',
            value: _['statusCode'] === 0 ? 'Success' : 'Failed',
            tag: 'badge',
            css: _['statusCode'] === 0 ? 'green-background' : 'red-background'
          },
          { key: 'Duration', value: _.end - _.start },
          { key: 'Startup Penalty', value: startupPenalty(_) },
          { key: 'Start', value: new Date(_.start).toISOString() },
          { key: 'End', value: new Date(_.end).toISOString() }
        ]
      }))
    }
  } else {
    throw activations
  }
}

function doCount({ REPL, parsedOptions }: Arguments<ListOptions>) {
  return REPL.qexec<number>(`wsk activation list --count ${parsedOptions.name ? ' --name ' + parsedOptions.name : ''}`)
}

export default (registrar: Registrar) => {
  synonyms('activations').forEach(syn => {
    registrar.listen(`/wsk/${syn}/count`, doCount, standardListUsage(syn, true, 'count'))
    ;['list', 'ls'].forEach(list => {
      registrar.listen(
        `/wsk/${syn}/${list}`,
        doList.bind(undefined, list),
        Object.assign(withStandardOptions(listUsage), { viewTransformer })
      )
    })
  })
}
