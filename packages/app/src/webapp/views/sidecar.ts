/*
 * Copyright 2017-18 IBM Corporation
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
const debug = Debug('webapp/views/sidecar')
debug('loading')

declare var hljs

import * as prettyPrintDuration from 'pretty-ms'

import * as cli from '../cli'
import eventBus from '../../core/events'
import { prequire } from '../../core/plugins'
import { element, removeAllDomChildren } from '../util/dom'
import { prettyPrintTime } from '../util/time'
import { addModeButtons } from '../bottom-stripe'
import { formatOneListResult } from '../views/table'
import { keys } from '../keys'
import { IShowOptions, DefaultShowOptions } from './show-options'
import sidecarSelector from './sidecar-selector'
import Presentation from './presentation'

/**
 * e.g. 2017-06-15T14:41:15.60027911Z  stdout:
 *
 */
const logPatterns = {
  logLine: /^\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.[\d]+Z)\s+(\w+):\s+(.*)/
}

/**
 * Beautify the given stringified json, placing it inside the given dom container
 *
 */
export const prettyJSON = (raw, container) => {
  const beautify = require('js-beautify')
  container.innerText = beautify(raw, { wrap_line_length: 80, indent_size: 2 })
  setTimeout(() => hljs.highlightBlock(container), 0)
}

/**
 * Beautify any kinds we know how to
 *
 */
export const beautify = (kind, code) => {
  if (kind.indexOf('nodejs') >= 0) {
    return require('js-beautify').js_beautify(code)
  } else {
    return code
  }
}

/**
 * Return the sidecar model
 *
 */
interface ISidecar extends HTMLElement {
  entity,
  uuid?: string
}
export const getSidecar = (): ISidecar => {
  debug('getSidecar', sidecarSelector(), element(sidecarSelector()))
  return element(sidecarSelector()) as ISidecar
}

export const currentSelection = () => {
  const sidecar = getSidecar()
  return sidecar && sidecar.entity
}
export const clearSelection = async () => {
  // true means also clear selection model
  return hide(true)
}
export const maybeHideEntity = entity => {
  const sidecar = getSidecar()

  const entityMatchesSelection = sidecar.entity &&
    sidecar.entity.name === entity.name &&
    sidecar.entity.namespace === entity.namespace

  debug('maybeHideEntity', entityMatchesSelection, entity, sidecar.entity)
  if (entityMatchesSelection) {
    clearSelection()
    return true
  }
}

/**
 * Return the container of the current active sidecar view
 *
 */
export const getActiveView = () => {
  const sidecar = getSidecar()
  const activeView = sidecar.getAttribute('data-active-view')
  const container = sidecar.querySelector(activeView)

  return container
}

const tryParseDate = s => {
  try {
    return new Date(s).getTime()
  } catch (e) {
    return s
  }
}

/**
 * Render the given field of the given entity in the given dom container
 *
 */
export const renderField = async (container: HTMLElement, entity, field: string, noRetry = false) => {
  if (field === 'raw') {
    // special case for displaying the record, raw, in its entirety
    const value = Object.assign({}, entity)
    delete value.modes
    delete value.apiHost
    delete value.verb
    delete value.type
    delete value.isEntity
    delete value.prettyType
    delete value.prettyKind
    const raw = JSON.stringify(value, undefined, 4)

    if (raw.length < 10 * 1024) {
      prettyJSON(raw, container)
    } else {
      // too big to beautify; try to elide the code bits and
      // then we'll re-check
      const raw = JSON.stringify(value, (key, value) => {
        if (key === 'code' && JSON.stringify(value).length > 1024) {
          // maybe this is why we're too big??
          return '\u2026'
        } else {
          return value
        }
      }, 4)

      // re-checking!
      if (raw.length > 1 * 1024 * 1024) {
        // oof, still too big, crop and add a tail ellision
        container.innerText = raw.substring(0, 1 * 1024 * 1024) + '\u2026'
      } else {
        // yay, eliding the code helped
        prettyJSON(raw, container)
      }
    }
    return
  }

  let value = entity[field]
  if (!value || value.length === 0) {
    container.innerText = `This entity has no ${field}`
  } else if (typeof value === 'string') {
    // render the value like a string
    if (field === 'source') {
      // hmm, let's not beautify the source code. maybe we will revisit this, later
      // const beautify = value => require('js-beautify')(value, { wrap_line_length: 80 })
      container.innerText = value
      setTimeout(() => hljs.highlightBlock(container), 0)
    } else {
      container.innerText = value
    }
  } else if (field === 'logs' && Array.isArray(value)) {
    const logTable = document.createElement('div')
    logTable.className = 'log-lines'
    removeAllDomChildren(container)
    container.appendChild(logTable)

    const nestedQuotes = str => {
      let R = ''
      let singleOpen = 0
      for (let idx = 0; idx < str.length; idx++) {
        const char = str.charAt(idx)
        if (char === '\'') {
          singleOpen++
          R = R + '"'
        } else if (char === '\'') {
          singleOpen--
          R = R + '"'
        } else if (char === '`' && singleOpen > 0) {
          R = R + '\\' + char
        } else if (char === '"' && singleOpen > 0) {
          R = R + '\\' + char
        } else {
          R = R + char
        }
      }
      return R
    }

    /** try parsing the state as a JSON object */
    const tryJSON = state => {
      if (state.accum && state.accum.parens.listOpen > 0 && state.accum.parens.listClose > 0) {
        const str = state.accum.smashed
        let netArray = 0
        let netList = 0
        let firstOpen
        let lastClose = -1
        let previousClose = -1

        const pretty = document.createElement('div')
        pretty.style.display = 'flex'
        pretty.style.flexDirection = 'column'
        pretty.style.alignItems = 'flex-start'
        state.accum.match[3] = pretty

        const terminate = () => {
          const interval = str.substring(firstOpen, lastClose + 1)
          if (firstOpen) {
            pretty.appendChild(document.createTextNode(str.substring(previousClose + 1, firstOpen)))
          }

          const struct = document.createElement('div')
          const jsonified = nestedQuotes(interval)
            .replace(/:\s+{/g, ':{')
            .replace(/\n/g, '')
            .replace(/\[Object\]/g, '["Object"]')
            .replace(/\[Array\]/g, '["Array"]')
            .replace(/{\s*([^:]+):/g, '{"$1":')
            .replace(/"\s*,\s*([^:]+):/g, '","$1":')
            .replace(/}\s*,\s*([^:]+):/g, '},"$1":')
            .replace(/\]\s*,\s*([^:]+):/g, '],"$1":')
            .replace(/(\d)\s*,\s*([^:]+):/g, '$1,"$2":')
            .replace(/null\s*,\s*([^:]+):/g, 'null,"$1":')
            .replace(/false\s*,\s*([^:]+):/g, 'false,"$1":')
            .replace(/true\s*,\s*([^:]+):/g, 'true,"$1":')
            .replace(/([^\\])""/g, '$1"')
          try {
            const maybeJSON = JSON.parse(jsonified)

            const beautify = require('js-beautify').js_beautify
            const json = document.createElement('code')
            const content = beautify(JSON.stringify(maybeJSON), { indent_size: 2 })
            json.classList.add('clickable-block')
            json.setAttribute('title', 'Copy this structure')
            json.appendChild(document.createTextNode(content))
            json.onclick = () => {
              require('electron').clipboard.writeText(content)
              json.classList.remove('pulse')
              setTimeout(() => json.classList.add('pulse'), 0)
            }
            struct.appendChild(json)

            // apply the syntax highlighter to the JSON
            setTimeout(() => hljs.highlightBlock(json), 0)
          } catch (err) {
            struct.appendChild(document.createTextNode(interval))
          }

          pretty.appendChild(struct)
          firstOpen = undefined
        }

        for (let idx = 0; idx < str.length; idx++) {
          const char = str.charAt(idx)
          if (netArray === 0 && netList === 0 && char === '\n') {
            /* if (pretty.children.length === 0
               || pretty.children[pretty.children.length - 1].tagName === 'BR') {
               // don't add a br for the first child, and don't add two in a row
               } else {
               // otherwise, add some spacing between structs
               pretty.appendChild(document.createElement('br'))
               } */

          } else if (char === '[') {
            netArray++
            if (!firstOpen) {
              firstOpen = idx
              previousClose = lastClose
            }
          } else if (char === '{') {
            netList++
            if (!firstOpen) {
              firstOpen = idx
              previousClose = lastClose
            }
          } else if (char === ']') {
            netArray--
            lastClose = idx

            if (netList === 0 && netArray === 0) {
              terminate()
            }
          } else if (char === '}') {
            netList--
            lastClose = idx

            if (netList === 0 && netArray === 0) {
              terminate()
            }
          }
        }

        if (lastClose && lastClose < str.length - 2) {
          pretty.appendChild(document.createTextNode(str.substring(lastClose + 2)))
        }
      }

      if (state.accum) {
        state.lines.push(state.accum.match)
        state.accum = undefined
      } else {
        state.lines = state.lines.map(line => {
          try {
            return JSON.parse(line)
          } catch (err) {
            return line
          }
        })
      }
    } /* end of tryJSON */

    /** net list-paren count */
    const netParens = line => {
      let listOpen = 0
      let listClose = 0

      for (let idx = 0; idx < line.length; idx++) {
        const char = line.charAt(idx)
        if (char === '{') {
          listOpen++
        } else if (char === '}') {
          listClose++
        }
      }
      return { listOpen, listClose }
    }

    // try combining log lines into JSON structs
    const newLines = value.reduce((state, logLine) => {
      const match = logLine.match(logPatterns.logLine)

      /** we need to start a fresh row */
      const freshRow = () => {
        state.accum = {
          match: match,
          date: tryParseDate(match[1]),
          lines: [logLine],
          smashed: match[3],
          parens: netParens(match[3])
        }
      }

      if (!match) {
        state.lines.push(logLine)
      } else if (!state.accum) {
        freshRow()
      } else {
        const thisDate = tryParseDate(match[1])
        if (match && match[2] === state.accum.match[2] && (thisDate - state.accum.date < 100 ||
                                                           state.accum.parens.listClose - state.accum.parens.listOpen > 0)) {
          // both this and previous written to stderr, and no great time separation?
          // then smash them together into one record
          state.accum.lines.push(logLine)
          const { listOpen, listClose } = netParens(match[3])
          state.accum.smashed += `\n${match[3]}`
          state.accum.parens.listOpen += listOpen
          state.accum.parens.listClose += listClose
        } else {
          // then this batch of close-in-time rows has
          // ended; flush it (via tryJSON), and start a
          // fresh row
          tryJSON(state)
          freshRow()
        }
      }

      return state
    }, { accum: undefined, lines: [] })

    tryJSON(newLines)
    console.log(newLines)

    newLines.lines.forEach(logLine => {
      const lineDom = document.createElement('div')
      lineDom.className = 'log-line'
      logTable.appendChild(lineDom)

      const match = Array.isArray(logLine) && logLine
      if (match) {
        const date = document.createElement('div')
        // const type = document.createElement('div')
        const mesg = document.createElement('div')
        lineDom.appendChild(date)
        // lineDom.appendChild(type)
        lineDom.appendChild(mesg)

        lineDom.className = `${lineDom.className} logged-to-${match[2]}` // add stderr/stdout to the line's CSS class

        date.className = 'log-field log-date'
        // type.className = 'log-field log-type'
        mesg.className = 'log-field log-message'

        try {
          date.innerText = new Date(match[1]).toLocaleString()
        } catch (e) {
          date.innerText = match[1]
        }
        // type.innerText = match[2]
        if (typeof match[3] === 'string') {
          mesg.innerText = match[3]
        } else {
          mesg.appendChild(match[3])
        }
      } else if (typeof logLine === 'string') {
        // unparseable log line, so splat out the raw text
        lineDom.innerText = logLine
      } else if (typeof logLine === 'object') {
        const code = document.createElement('code')
        code.appendChild(document.createTextNode(JSON.stringify(logLine, undefined, 2)))
        lineDom.appendChild(code)
        setTimeout(() => hljs.highlightBlock(code), 0)
      } else {
        // unparseable log line, so splat out the raw text
        lineDom.appendChild(document.createTextNode(logLine))
      }
    })
  } else {
    // render the value like a JSON object
    // for now, we just render it as raw JSON, TODO: some sort of fancier key-value pair visualization?
    if (field === 'parameters' || field === 'annotations') {
      // special case here: the parameters field is really a map, but stored as an array of key-value pairs
      value = value.reduce((M, kv) => {
        M[kv.key] = kv.value
        return M
      }, {})
    }
    const beautify = require('js-beautify').js_beautify
    container.innerText = beautify(JSON.stringify(value))

    // apply the syntax highlighter to the JSON
    setTimeout(() => hljs.highlightBlock(container), 0)
  }
}

/**
 * Show custom content in the sidecar
 *
 */
export const showCustom = async (custom, options) => {
  if (!custom || !custom.content) return
  debug('showCustom', custom, options)

  const sidecar = getSidecar()

  // tell the current view that they're outta here
  if (sidecar.entity || sidecar.uuid) {
    eventBus.emit('/sidecar/replace', sidecar.entity || sidecar.uuid)
  }
  sidecar.uuid = custom.uuid

  // if the view hints that it wants to occupy the full screen and we
  // are not currenlty in fullscreen, OR if the view does not want to
  // occupy full screen and we *are*... in either case (this is an
  // XOR, does as best one can in NodeJS), toggle maximization
  if (custom.presentation === Presentation.SidecarFullscreen ? !isFullscreen() : isFullscreen()) {
    toggleMaximization()
  }

  if (custom.controlHeaders === true) {
    // plugin will control all headers
  } else if (!custom.controlHeaders) {
    // plugin will control no headers
    const customHeaders = sidecar.querySelectorAll('.custom-header-content')
    for (let idx = 0; idx < customHeaders.length; idx++) {
      removeAllDomChildren(customHeaders[idx])
    }
  } else {
    // plugin will control some headers; it tell us which it wants us to control
    custom.controlHeaders.forEach(_ => {
      const customHeaders = sidecar.querySelectorAll(`${_} .custom-header-content`)
      for (let idx = 0; idx < customHeaders.length; idx++) {
        removeAllDomChildren(customHeaders[idx])
      }
    })
  }

  // which viewer is currently active?
  sidecar.setAttribute('data-active-view', '.custom-content > div')

  // add mode buttons, if requested
  const modes = custom.modes
  if (!options || !options.leaveBottomStripeAlone) {
    addModeButtons(modes, custom, options)
    sidecar.setAttribute('class', `${sidecar.getAttribute('data-base-class')} visible custom-content`)
  } else {
    sidecar.classList.add('custom-content')
  }

  if (custom.sidecarHeader === false) {
    // view doesn't want a sidecar header
    sidecar.classList.add('no-sidecar-header')
  }

  if (custom.displayOptions) {
    custom.displayOptions.forEach(option => {
      sidecar.classList.add(option)
    })
  }

  const badgesDomContainer = sidecar.querySelector('.header-right-bits .custom-header-content')
  let badgesDom = badgesDomContainer.querySelector('.badges')
  if (!badgesDom) {
    badgesDom = document.createElement('span')
    badgesDom.classList.add('badges')
    badgesDomContainer.appendChild(badgesDom)
  } else {
    removeAllDomChildren(badgesDom)
  }

  if (custom && custom.isEntity) {
    const entity = custom
    sidecar.entity = entity
    sidecar.entity.type = sidecar.entity.viewName

    addNameToSidecarHeader(sidecar, entity.prettyName || entity.name, entity.packageName, undefined,
                           entity.prettyType || entity.type, entity.subtext, entity)

    // render badges
    addVersionBadge(entity, { clear: true, badgesDom })
  }

  if (custom && custom.badges) {
    custom.badges.forEach(badge => addBadge(badge, { badgesDom }))
  }

  const replView = document.querySelector('tab.visible .repl')
  replView.className = `sidecar-visible ${(replView.getAttribute('class') || '').replace(/sidecar-visible/g, '')}`

  const container = sidecar.querySelector('.custom-content')
  removeAllDomChildren(container)

  if (custom.content.then) {
    container.appendChild(await custom.content)
  } else if (custom.contentType || custom.contentTypeProjection) {
    // we were asked ot project out one specific field
    const projection = custom.contentTypeProjection ? custom.content[custom.contentTypeProjection] : custom.content

    if (projection.nodeName) {
      // then its already a DOM
      container.appendChild(projection)
    } else {
      const tryToUseEditor = true
      if (tryToUseEditor) {
        try {
          const { edit /*, IEditorEntity */ } = await import('@kui-shell/plugin-editor/lib/cmds/edit')
          debug('successfully loaded editor', custom)

          const entity /*: IEditorEntity */ = {
            type: custom.prettyType,
            name: custom.name,
            persister: () => true,
            annotations: [],
            exec: {
              kind: custom.contentType,
              code: typeof projection !== 'string' ? JSON.stringify(projection, undefined, 2) : projection
            }
          }

          const { content } = await edit(entity, { readOnly: true })
          container.appendChild(content)
          return
        } catch (err) {
          debug('erroring in loading editor', err)
          // intentional fall-through
        }
      }

      const scrollWrapper = document.createElement('div')
      const pre = document.createElement('pre')
      const code = document.createElement('code')

      container.appendChild(scrollWrapper)
      scrollWrapper.appendChild(pre)
      pre.appendChild(code)

      if (typeof projection === 'string') {
        code.innerText = projection
      } else {
        const beautify = require('js-beautify')
        code.innerText = beautify(JSON.stringify(projection), { wrap_line_length: 80, indent_size: 2 })
      }

      scrollWrapper.style.flex = '1'
      scrollWrapper.classList.add('scrollable')
      scrollWrapper.classList.add('scrollable-auto')

      if (custom.contentType) {
        // caller gave us a content type. attempt to decorate
        const contentType = `language-${custom.contentType}`
        code.classList.add(contentType)
        code.classList.remove(code.getAttribute('data-content-type')) // remove previous
        code.setAttribute('data-content-type', contentType)
        code.classList.remove('json')
        setTimeout(() => {
          hljs.highlightBlock(code)
          setTimeout(() => linkify(code), 100)
        }, 0)
      }
    }
  } else if (custom.content.nodeName) {
    container.appendChild(custom.content)
  } else {
    container.appendChild(document.createTextNode(custom.content))
  }
} /* showCustom */

/**
 * Add view name to the sidecar header "icon text"
 *
 */
export const addSidecarHeaderIconText = (viewName: string, sidecar: HTMLElement) => {
  const iconDom = element('.sidecar-header-icon', sidecar)
  let iconText = viewName.replace(/s$/, '')

  const A = iconText.split(/(?<!(^|[A-Z]))(?=[A-Z])|(?<!^)(?=[A-Z][a-z])"/).filter(x => x)
  if (iconText.length > 8 && A.length > 1) {
    iconText = A.map(_ => _.charAt(0)).join('')
  }

  iconDom.innerText = iconText
}

/**
 * Given an entity name and an optional packageName, decorate the sidecar header
 *
 */
export const addNameToSidecarHeader = async (sidecar = getSidecar(), name, packageName = '', onclick?, viewName?, subtext?, entity?) => {
  debug('addNameToSidecarHeader', name)

  const nameDom = sidecar.querySelector('.sidecar-header-name-content')
  nameDom.className = nameDom.getAttribute('data-base-class')
  element('.package-prefix', nameDom).innerText = packageName

  if (typeof name === 'string') {
    const nameContainer = element('.entity-name', nameDom)
    nameContainer.innerText = name
  } else {
    const nameContainer = nameDom.querySelector('.entity-name')
    removeAllDomChildren(nameContainer)
    nameContainer.appendChild(name)
  }

  if (onclick) {
    const clickable = element('.entity-name', nameDom)
    clickable.classList.add('clickable')
    clickable.onclick = onclick
  }

  if (viewName) {
    addSidecarHeaderIconText(viewName, sidecar)
  }

  if (subtext) {
    const sub = element('.sidecar-header-secondary-content .custom-header-content', sidecar)
    removeAllDomChildren(sub)

    const text = await Promise.resolve(subtext)
    if (text.nodeName) {
      sub.appendChild(text)
    } else {
      sub.innerText = text
    }
  }

  return nameDom
}

/**
 * Find and format links in the given dom tree
 *
 */
export const linkify = dom => {
  const attrs = dom.querySelectorAll('.hljs-attr')
  for (let idx = 0; idx < attrs.length; idx++) {
    const attr = attrs[idx]
    if (attr.innerText.indexOf('http') === 0) {
      const link = document.createElement('a')
      link.href = attr.innerText
      link.innerText = attr.innerText.substring(attr.innerText.lastIndexOf('/') + 1)
      link.target = '_blank'
      attr.innerText = ''
      attr.appendChild(link)
    }
  }
}

/**
 * Sidecar badges
 *
 */
interface IBadgeOptions {
  css?: string
  onclick?,
  badgesDom: Element
}
class DefaultBadgeOptions implements IBadgeOptions {
  badgesDom = getSidecar().querySelector('.sidecar-header .badges')

  constructor () {
    // empty
  }
}

/**
 * This is the most complete form of a badge specification, allowing
 * the caller to provide a title, an onclick handler, and an optional
 * fontawesome icon representation.
 *
 */
interface IBadgeSpec {
  title: string
  fontawesome?: string
  onclick?: (evt: Event) => boolean
}
function isBadgeSpec (spec: string | IBadgeSpec | Element): spec is IBadgeSpec {
  return typeof spec !== 'string' && !(spec instanceof Element)
}

export const addBadge = (badgeText: string | IBadgeSpec | Element, { css, onclick, badgesDom = new DefaultBadgeOptions().badgesDom }: IBadgeOptions = new DefaultBadgeOptions()) => {
  debug('addBadge', badgeText, badgesDom)

  const badge = document.createElement('badge') as HTMLElement

  if (typeof badgeText === 'string') {
    badge.innerText = badgeText as string
  } else if (badgeText instanceof Element) {
    badge.appendChild(badgeText as Element)
  } else {
    // otherwise, badge is an IBadgeSpec
    if (badgeText.fontawesome) {
      const awesome = document.createElement('i')
      awesome.className = badgeText.fontawesome
      badge.classList.add('badge-as-fontawesome')
      badge.appendChild(awesome)
    } else {
      badge.innerText = badgeText.title
    }
  }

  if (css) {
    badge.classList.add(css)
  }

  if (onclick) {
    badge.classList.add('clickable')
    badge.onclick = onclick
  } else if (isBadgeSpec(badgeText)) {
    badge.classList.add('clickable')
    badge.onclick = badgeText.onclick
  }

  badgesDom.appendChild(badge)
  return badge
}

/**
 * If the entity has a version attribute, then render it
 *
 */
export const addVersionBadge = (entity, { clear = false, badgesDom = undefined } = {}) => {
  if (clear) {
    clearBadges()
  }
  if (entity.version) {
    addBadge(/^v/.test(entity.version) ? entity.version : `v${entity.version}`, { badgesDom }).classList.add('version')
  }
}

export const clearBadges = () => {
  const sidecar = getSidecar()
  const header = sidecar.querySelector('.sidecar-header')
  removeAllDomChildren(header.querySelector('.badges'))
}

export const hide = (clearSelectionToo = false) => {
  debug('hide')

  const sidecar = getSidecar()
  sidecar.classList.remove('visible')

  if (!clearSelectionToo) {
    // only minimize if we weren't asked to clear the selection
    sidecar.classList.add('minimized')
    element('tab.visible').classList.add('sidecar-is-minimized')
  }

  const replView = document.querySelector('tab.visible .repl')
  replView.classList.remove('sidecar-visible')

  // we just hid the sidecar. make sure the current prompt is active for text input
  cli.getCurrentPrompt().focus()

  // were we asked also to clear the selection?
  if (clearSelectionToo && sidecar.entity) {
    delete sidecar.entity
  }

  return true
}

export const show = (block?, nextBlock?) => {
  debug('show')

  const sidecar = getSidecar()
  if (currentSelection() || sidecar.className.indexOf('custom-content') >= 0) {
    element('tab.visible').classList.remove('sidecar-is-minimized')
    sidecar.classList.remove('minimized')
    sidecar.classList.add('visible')

    cli.scrollIntoView()
    const replView = document.querySelector('tab.visible .repl')
    replView.classList.add('sidecar-visible')

    return true
  } else if (block && nextBlock) {
    cli.oops(block, nextBlock)({ error: 'You have no entity to show' })
  }
}

export const isVisible = () => {
  const sidecar = getSidecar()
  return sidecar.classList.contains('visible') && sidecar
}

export const isFullscreen = () => {
  return element('tab.visible').classList.contains('sidecar-full-screen')
}

export const toggleMaximization = () => {
  element('tab.visible').classList.toggle('sidecar-full-screen')
  eventBus.emit('/sidecar/maximize')
}

export const toggle = () => isVisible() ? hide() : show()

/**
 * Generic entity rendering
 *
 */
export const showGenericEntity = (entity, options: IShowOptions = new DefaultShowOptions()) => {
  debug('showGenericEntity', entity, options)

  const sidecar = getSidecar()
  // const header = sidecar.querySelector('.sidecar-header')

  // tell the current view that they're outta here
  eventBus.emit('/sidecar/replace', sidecar.entity)

  // which viewer is currently active?
  sidecar.setAttribute('data-active-view', '.sidecar-content')

  // in case we have previously displayed custom content, clear out the header
  const customHeaders = sidecar.querySelectorAll('.custom-header-content')
  for (let idx = 0; idx < customHeaders.length; idx++) {
    removeAllDomChildren(customHeaders[idx])
  }

  // add mode buttons, if requested
  const modes = entity.modes || (options && options.modes)
  if (!options || !options.leaveBottomStripeAlone) {
    addModeButtons(modes, entity, options)
  }

  // remember the selection model
  if (!options || options.echo !== false) sidecar.entity = entity
  sidecar.setAttribute('class', `${sidecar.getAttribute('data-base-class')} visible entity-is-${entity.prettyType} entity-is-${entity.type}`)

  const replView = document.querySelector('tab.visible .repl')
  replView.className = `sidecar-visible ${(replView.getAttribute('class') || '').replace(/sidecar-visible/g, '')}`

  addSidecarHeaderIconText(entity.prettyType || entity.type, sidecar)

  // the name of the entity, for the header
  const nameDom = addNameToSidecarHeader(sidecar, entity.name, entity.packageName)

  clearBadges()
  addVersionBadge(entity)

  return sidecar
}

/**
 * Register a renderer for a given <kind>
 *
 */
export type ISidecarViewHandler = (entity: Object, sidecar: Element, options: IShowOptions) => void
const registeredEntityViews = {}
export const registerEntityView = (kind: string, handler: ISidecarViewHandler) => {
  registeredEntityViews[kind] = handler
}

/**
 * Load the given entity into the sidecar UI
 *
 */
export const showEntity = (entity, options: IShowOptions = new DefaultShowOptions()) => {
  if (entity.type === 'custom') {
    // caller could have called showCustom, but we will be gracious
    // here, and redirect the call
    return showCustom(entity, options)
  }

  const sidecar = showGenericEntity(entity, options)
  debug('done with showGenericEntity')

  const renderer = registeredEntityViews[entity.type || entity.kind]
  if (renderer) {
    debug('dispatching to registered view handler %s', entity.type || entity.kind, renderer)
    return renderer(entity, sidecar, options)
  } else {
    try {
      const serialized = JSON.stringify(entity, undefined, 4)
      const container = element('.action-source', sidecar)
      sidecar.classList.add('entity-is-actions')
      container.innerText = serialized
      setTimeout(() => {
        hljs.highlightBlock(container)
      }, 0)
      debug('displaying generic JSON')
    } catch (err) {
      // probably trouble stringifying JSON
      console.error(err)
    }

    return true
  }
}

/**
 * One-time initialization of sidecar view
 *
 */
export const init = async () => {
  debug('init')

  // command-left go back
  document.onkeydown = async (event) => {
    if (event.keyCode === keys.LEFT_ARROW && (event.ctrlKey || (process.platform === 'darwin' && event.metaKey))) {
      const back = element('.sidecar-bottom-stripe-back-button', getSidecar())
      const clickEvent = document.createEvent('Events')
      clickEvent.initEvent('click', true, false)
      back.dispatchEvent(clickEvent)
    }
  }

  // escape key toggles sidecar visibility
  document.onkeyup = evt => {
    if (evt.keyCode === keys.ESCAPE) {
      const closeButton = document.querySelector(sidecarSelector('.sidecar-bottom-stripe-close'))
      if (isVisible()) {
        closeButton.classList.add('hover')
        setTimeout(() => closeButton.classList.remove('hover'), 500)
      }
      toggle()
      cli.scrollIntoView()
    }
  }
}
