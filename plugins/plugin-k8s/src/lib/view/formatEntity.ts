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

import * as Debug from 'debug'
import { ParsedOptions } from '@kui-shell/core/models/execOptions'
import { FinalState, renderStatus, rendering as stateRendering } from '../model/states'
import { KubeResource } from '../model/resource'
import { Table, Row } from '@kui-shell/core/webapp/models/table'

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
export const formatEntity = (parsedOptions: ParsedOptions, context?: string) => (kubeEntity: KubeResource): Row => {
  debug('formatEntity', kubeEntity)

  const finalState = parsedOptions['final-state'] || FinalState.NotPendingLike

  const {
    kind,
    metadata: { name, namespace, annotations = {} }
  } = kubeEntity

  const { cssForState } = stateRendering

  // masquerade: allows the spec to override/pretty-print certain fields
  const title = annotations && annotations['kui.tools/title']
  const targetNamespace = annotations && annotations['kui.tools/targetNamespace']
  const masqueradeKind = annotations && annotations['kui.tools/category']

  const kindForDisplay = masqueradeKind || kind

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kindAttr: any[] = [{ key: 'kind', value: kindForDisplay, outerCSS: 'entity-kind' }]
  const contextAttr = parsedOptions.multi || !context ? [] : formatContextAttr(context)

  const namespaceAttrs =
    !kind || kind.match(/(ns|Namespace)/i)
      ? []
      : [
          {
            key: 'namespace',
            value: targetNamespace || namespace,
            outerCSS: 'pretty-narrow hide-with-sidecar'
          }
        ]

  const status = renderStatus(kubeEntity, finalState)

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

  return {
    type: 'status',
    prettyType: kindForDisplay,
    name: title || name,
    onclick: parsedOptions.onclickFn ? parsedOptions.onclickFn(kubeEntity) : status.onclick ? status.onclick : false,
    done: status.done,
    attributes
  }
}
