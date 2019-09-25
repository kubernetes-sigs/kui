/*
 * Copyright 2017-19 IBM Corporation
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
import * as prettyPrintDuration from 'pretty-ms'

import { element } from '@kui-shell/core/webapp/util/dom'
import { linkify, getSidecar, renderField, showCustom } from '@kui-shell/core/webapp/views/sidecar'
import { prettyPrintTime } from '@kui-shell/core/webapp/util/time'
import { ShowOptions } from '@kui-shell/core/webapp/views/show-options'
import { REPL, UI } from '@kui-shell/core'

import { isActivationId } from '../../models/activation'
import { render as renderActivationTable } from '../cli/activations/list'

declare let hljs
const debug = Debug('plugins/openwhisk/views/sidecar/activation')

export default (tab: UI.Tab, entity, options: ShowOptions) => {
  debug('showing activation')

  const sidecar = getSidecar(tab)
  const nameDom = sidecar.querySelector('.sidecar-header-name-content')
  sidecar.querySelector('.sidecar-content .activation-content').className = 'activation-content'

  // success indicator
  sidecar.classList.add(`activation-success-${entity.response.success}`)
  /* const statusDom = sidecar.querySelector('.activation-status')
     statusDom.setAttribute('data-extra-decoration', entity.response.status)
     statusDom.title = statusDom.getAttribute('data-title-base').replace(/{status}/, entity.response.status) */

  // limits
  const entityLimitsAnnotation = entity.annotations.find(kv => kv.key === 'limits')
  if (!entityLimitsAnnotation || entity.noCost) {
    // noCost means we should not display any cost info
    sidecar.classList.add('no-limits-data')
  }

  // start time
  const startDom = sidecar.querySelector('.activation-start')
  UI.empty(startDom)
  if (!entity.start) {
    sidecar.classList.add('no-activation-timing-data')
  } else {
    startDom.appendChild(prettyPrintTime(entity.start))
  }

  // duration
  if (entity.end) {
    // the guard helps with: rule activations don't have an end time
    const duration = entity.end - entity.start
    element('.activation-content .activation-duration', sidecar).innerText = prettyPrintDuration(duration)
  }

  // estimated cost
  if (entity.duration && entityLimitsAnnotation) {
    // if we have BOTH a raw duration and limits data, then also show estimated cost
    const roughCostEstimate = (
      (entityLimitsAnnotation.value.memory / 1024) *
      (Math.ceil(entity.duration / 100) / 10) *
      0.000017 *
      1000000
    ).toFixed(2)
    element('.activation-estimated-cost', sidecar).innerText = roughCostEstimate
  }

  // the entity.namespace and entity.name of activation records don't include the package name :/
  const pathAnnotation = entity.annotations && entity.annotations.find(kv => kv.key === 'path')
  const entityNameWithPackageAndNamespace =
    (pathAnnotation && pathAnnotation.value) || `${entity.namespace}/${entity.name}`
  const pathComponents = pathAnnotation && entityNameWithPackageAndNamespace.split('/')
  const entityPackageName = pathComponents ? (pathComponents.length === 2 ? '' : pathComponents[1]) : '' // either ns/package/action or ns/action

  // make the nameDom clickable, traversing to the action
  const footer = sidecar.querySelector('.sidecar-bottom-stripe')
  element('.package-prefix', footer).innerText = entityPackageName
  const entityName = element('.entity-name', nameDom)
  entityName.innerText = entity.name
  entityName.className = `${entityName.className} clickable`
  entityName.onclick =
    entity.onclick ||
    (async () => {
      REPL.pexec(`wsk action get "/${entityNameWithPackageAndNamespace}"`)
    })

  // add the activation id to the header
  const activationDom = element('.sidecar-header-name .entity-name-hash', sidecar)
  activationDom.innerText = entity.activationId

  // view mode
  const show =
    (options && options.show) || // cli-specified mode
    (entity.modes && entity.modes.find(_ => _.defaultMode)) || // model-specified default mode
    'result' // fail-safe default mode

  if (show === 'result' || show.mode === 'result') {
    debug('showing result')
    const activationResult = element('.activation-result', sidecar)
    UI.empty(activationResult)

    try {
      activationResult['scrollIntoViewIfNeeded']()
    } catch (err) {
      // ok: might not be implemented in all browsers
    }

    if (entity.response.result) {
      const result = entity.response.result
      if (result.error && result.error.stack) {
        // special case for error stacks, we can do better than beautify, here
        result.error.rawStack = result.error.stack
        result.error.stack = result.error.rawStack
          .split(/\n/)
          .slice(1, -1) // slice off the first and last line; the first line is a repeat of result.error.message; the last is internal openwhisk
          .map(line =>
            line
              .substring(line.indexOf('at ') + 3)
              .replace(/eval at <anonymous> \(\/nodejsAction\/runner.js:\d+:\d+\), /, '')
              .replace(/<anonymous>/, entity.name)
          )
      }

      if (entity.contentTypeProjection) {
        // we were asked ot project out one specific field
        const projection = result[entity.contentTypeProjection]

        if (projection.nodeName) {
          // then its already a DOM
          activationResult.appendChild(projection)
        } else {
          if (entity.contentType && activationResult.innerText.length < 20 * 1024) {
            // caller gave us a content type. attempt to decorate
            const contentType = `language-${entity.contentType}`
            activationResult.classList.add(contentType)
            activationResult.classList.remove(activationResult.getAttribute('data-content-type')) // remove previous
            activationResult.setAttribute('data-content-type', contentType)
            activationResult.classList.remove('json')

            activationResult.innerHTML = hljs.highlight(entity.contentType, projection).value
            linkify(activationResult)
          } else {
            activationResult.innerText = projection
          }
        }
      } else {
        const data = JSON.stringify(result, undefined, 4)
        if (data.length < 30 * 1024) {
          const beautify = require('js-beautify').js_beautify
          const prettier = beautify(data, { indent_size: 2 })

          // colorify
          const contentType = 'language-json'
          activationResult.classList.add(contentType)
          activationResult.classList.remove(activationResult.getAttribute('data-content-type')) // remove previous
          activationResult.setAttribute('data-content-type', contentType)

          // apply the syntax highlighter to the code
          activationResult.innerHTML = hljs.highlight('javascript', prettier).value
          linkify(activationResult)
        } else {
          // too big! too slow for the fancy stuff
          activationResult.innerText = data
        }
      }
    } else {
      activationResult.innerText = 'Nothing to show' // FIXME
    }
  } else if (
    show === 'logs' &&
    entity[show] &&
    Array.isArray(entity[show]) &&
    entity[show].length > 0 &&
    isActivationId(entity[show][0])
  ) {
    // special rendering of sequence "logs", which is really an array of activationIds
    renderActivationTable({
      tab,
      entity,
      activationIds: entity[show],
      container: sidecar.querySelector('.activation-result')
    })
  } else if (typeof show === 'string') {
    // render a given field of the entity
    renderField(sidecar.querySelector('.activation-result'), entity, show)
  } else {
    // render a custom mode
    console.error('rendering custom activation mode', show)
    if (show.customContent) {
      sidecar.classList.add('custom-content')
    }
    if (show.direct) {
      const view = show.direct(entity)
      if (view.then) {
        view.then(showCustom)
      }
    } else {
      console.error('Unsupported operation')
    }
  }
}
