/*
 * Copyright 2018-19 IBM Corporation
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

import Debug from 'debug'

import eventBus from '@kui-shell/core/api/events'

import { toOpenWhiskFQN } from '../util/util'
import { FinalState, watchStatus, rendering as stateRendering } from '../model/states'

const debug = Debug('k8s/util/formatEntity')

/**
 * Make a kube context attribute
 *
 */
export const formatContextAttr = (context: string, extraCSS?: string) => {
  return [
    {
      key: 'context',
      value: context,
      outerCSS: `${extraCSS ? extraCSS + ' ' : ''}entity-name-group entity-name-group-narrow hide-with-sidecar`
    }
  ]
}

/**
 * Return a repl attribute for the given readiness
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatEntity = (parsedOptions: Record<string, any>, context?: string) => async kubeEntity => {
  // debug('formatEntity', kubeEntity)

  if (!kubeEntity.metadata) {
    return kubeEntity
  }

  const finalState = parsedOptions['final-state'] || FinalState.NotPendingLike

  const {
    apiVersion,
    kind,
    metadata: { name, namespace, labels, annotations = {} }
  } = kubeEntity
  const { type, actionName, packageName, fqn } = toOpenWhiskFQN(kubeEntity)
  const { cssForState } = stateRendering

  // masquerade: allows the spec to override/pretty-print certain fields
  const title = annotations && annotations['kui.tools/title']
  const targetNamespace = annotations && annotations['kui.tools/targetNamespace']
  const masqueradeKind = annotations && annotations['kui.tools/category']

  const kindForDisplay = masqueradeKind || kind

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kindAttr: any[] = [{ key: 'kind', value: kindForDisplay, outerCSS: 'entity-kind' }]
  const contextAttr = parsedOptions.multi || !context ? [] : formatContextAttr(context)

  // see if anyone else changes the expected final state
  const watch = {
    apiVersion,
    kind,
    name,
    namespace,
    type,
    fqn,
    context,
    labels
  }
  const eventType = '/kubectl/state/expect'
  const listener = ({ watch: other, finalState: otherFinalState }) => {
    if (
      watch.kind === other.kind &&
      watch.name === other.name &&
      watch.context === other.context &&
      finalState !== otherFinalState
    ) {
      debug('conflicting final states', watch, finalState, otherFinalState)

      eventBus.removeListener(eventType, listener)
    }
  }
  eventBus.on(eventType, listener)

  // let everyone know that this resource has a new expected final state
  eventBus.emit('/kubectl/state/expect', { watch, finalState })

  const namespaceAttrs =
    !watch.kind || watch.kind.match(/(ns|Namespace)/i)
      ? []
      : [
          {
            key: 'namespace',
            value: targetNamespace || namespace,
            outerCSS: 'pretty-narrow hide-with-sidecar'
          }
        ]

  const status = await watchStatus(watch, finalState)

  const statusAttrs = parsedOptions['no-status']
    ? []
    : [
        {
          key: 'STATUS',
          value: status.value,
          placeholderValue: true, // allows headless to make an informed rendering decision
          tag: 'badge',
          outerCSS: status.outerCSS,
          css: cssForState(status.value)
        },

        {
          key: 'message',
          value:
            status.others && status.others.find(other => other.key === 'message')
              ? status.others.find(other => other.key === 'message').value
              : '',
          css: 'somewhat-smaller-text slightly-deemphasize',
          outerCSS: 'hide-with-sidecar not-too-wide min-width-date-like'
        }
      ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attributes: any[] = kindAttr
    .concat(contextAttr)
    .concat(namespaceAttrs)
    .concat(statusAttrs)

  return Object.assign({}, kubeEntity, {
    type: 'status',
    prettyType: kindForDisplay,
    name: title || actionName || fqn,
    packageName,
    noSort: true,
    onclick: parsedOptions.onclickFn ? parsedOptions.onclickFn(kubeEntity) : status.onclick ? status.onclick : false,
    done: status.done,
    attributes
  })
}
