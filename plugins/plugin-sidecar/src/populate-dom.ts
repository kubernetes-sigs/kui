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

import Debug from 'debug'
import * as Marked from 'marked'

import presentAs from './present-as'
import { Sidecar, getSidecar } from './sidecar'

import {
  BadgeOptions,
  getBadgesDomContainer,
  addBadge,
  clearBadges,
  hasBadge,
  apply as addRelevantBadges
} from './badge'

import {
  isHTML,
  ResourceWithMetadataWithContent,
  ResourceByReferenceWithContent,
  MultiModalResponse,
  hasEditor,
  tryOpenWithEditor,
  isPromise,
  ResourceByReference as MetadataBearingByReference,
  isResourceByReference as isMetadataBearingByReference,
  hasDisplayName,
  isResourceWithMetadata as isMetadataBearing,
  ResourceWithMetadata as MetadataBearing,
  ToolbarText,
  empty as removeAllDomChildren,
  prettyPrintTime,
  ExecOptions,
  Presentation,
  eventBus,
  Tab,
  getTabFromTarget,
  isPopup
} from '@kui-shell/core'

import { ShowOptions } from './show-options'
import { addModeButtons } from './bottom-stripe'
import { setVisibleClass, setMaximization, enableTabIndex, isFullscreen } from './visibility'

const debug = Debug('webapp/views/sidecar')

type Formattable = string | Promise<string> | HTMLElement | Promise<HTMLElement>

/** cheapo uuid; we only need single-threaded uniqueness */
let _uuidCounter = 1
function uuid() {
  return (_uuidCounter++).toString()
}

/**
 * Return the container of the current active sidecar view
 *
 */
export const getActiveView = (tab: Tab) => {
  const sidecar = getSidecar(tab)
  const activeView = sidecar.getAttribute('data-active-view')
  const container = sidecar.querySelector(`.sidecar-content-container ${activeView}`)

  return container
}

/**
 * If the entity has a version attribute, then render it
 *
 */
export const addVersionBadge = (
  sidecar: Sidecar,
  entity: MetadataBearing | MetadataBearingByReference,
  { clear = false, badgesDom = undefined }: { clear?: boolean; badgesDom?: HTMLElement } = {}
) => {
  if (hasBadge(sidecar, '.version')) {
    return
  }

  if (clear) {
    clearBadges(sidecar)
  }

  const version = isMetadataBearingByReference(entity)
    ? entity.resource.metadata.generation
    : entity.metadata.generation
  if (version) {
    addBadge(sidecar, /^v/.test(version) ? version : `v${version}`, { badgesDom }).classList.add('version')
  }
}

/**
 * Add view name to the sidecar header "icon text"
 *
 */
export const addSidecarHeaderIconText = (viewName: string, sidecar: HTMLElement) => {
  debug('addSidecarHeaderIconText', viewName)
  const iconDom = sidecar.querySelector('.sidecar-header-icon') as HTMLElement

  if (viewName) {
    let iconText = viewName.replace(/s$/, '')

    const A = iconText.split(/(?=[A-Z])/).filter(x => x)
    if (iconText.length > 12 && A.length > 1) {
      iconText = A.map(_ => _.charAt(0)).join('')
    }

    iconDom.innerText = iconText
  } else {
    // no viewName, make sure it appears blank in the UI
    iconDom.innerText = ''
  }
}

/** format the creation time of a resource */
const createdOn = (resource: MetadataBearing): HTMLElement => {
  const startTime = resource.metadata.creationTimestamp
  const prefixText = 'Created on '

  if (!startTime) {
    return
  }

  const message = document.createElement('div')
  const datePart = document.createElement('span')

  message.appendChild(document.createTextNode(prefixText))
  message.appendChild(datePart)
  try {
    datePart.appendChild(prettyPrintTime(Date.parse(startTime)))
  } catch (err) {
    debug('error trying to parse this creationTimestamp', resource)
    console.error('error parsing creationTimestamp', err)
    datePart.innerText = resource.metadata.creationTimestamp
  }

  return message
}

/**
 * @return the enclosing tab for the given sidecar
 *
 */
export const getEnclosingTab = (sidecar: Sidecar): Tab => {
  return getTabFromTarget(sidecar)
}

/**
 * Given an entity name and an optional packageName, decorate the sidecar header
 *
 */
export const addNameToSidecarHeader = async (
  sidecar: Sidecar,
  name: string | Element,
  packageName = '',
  onclick?: () => void,
  viewName?: string,
  entity?: MetadataBearing | MetadataBearingByReference
) => {
  debug('addNameToSidecarHeader', name, isMetadataBearingByReference(entity), entity)

  // maybe entity.content is a metadat-bearing entity that we can
  // mine for identifying characteristics
  const metadataBearer = isMetadataBearingByReference(entity) ? entity.resource : isMetadataBearing(entity) && entity
  if (metadataBearer) {
    const maybeName =
      name || (hasDisplayName(metadataBearer) && metadataBearer.spec.displayName) || metadataBearer.metadata.name
    if (maybeName) {
      name = maybeName
    }
    if (metadataBearer.metadata.namespace) {
      packageName = metadataBearer.metadata.namespace
    }
    if (metadataBearer.kind) {
      viewName = metadataBearer.kind
    }
  }

  const header = sidecar.querySelector('.sidecar-header')
  const footer = sidecar.querySelector('.sidecar-bottom-stripe') as HTMLElement
  const nameDom = header.querySelector('.sidecar-header-name-content')
  nameDom.className = nameDom.getAttribute('data-base-class')

  if (packageName) {
    ;(footer.querySelector('.package-prefix') as HTMLElement).innerText = packageName
  }

  header.querySelector('.sidecar-header-text').classList.remove('is-repl-like')

  if (typeof name === 'string') {
    const nameContainer = nameDom.querySelector('.entity-name') as HTMLElement
    nameContainer.innerText = name
  } else if (name) {
    const nameContainer = nameDom.querySelector('.entity-name')
    removeAllDomChildren(nameContainer)
    nameContainer.appendChild(name)
  }

  if (onclick) {
    const clickable = nameDom.querySelector('.entity-name') as HTMLElement
    clickable.classList.add('clickable')
    clickable.onclick = onclick
  }

  if (isMetadataBearing(entity) && entity.onclick) {
    if (entity.onclick.name) {
      const clickable = nameDom.querySelector('.entity-name') as HTMLElement
      clickable.classList.add('clickable')
      clickable.onclick = () => {
        const tab = getEnclosingTab(sidecar)
        tab.REPL.pexec(entity.onclick.name, { tab })
      }
    } else {
      const clickable = nameDom.querySelector('.entity-name') as HTMLElement
      clickable.classList.remove('clickable')
      clickable.onclick = undefined
    }
    if (entity.onclick.namespace) {
      const clickable = sidecar.querySelector('.sidecar-header-icon-wrapper .package-prefix') as HTMLElement
      clickable.classList.add('clickable')
      clickable.onclick = () => {
        const tab = getEnclosingTab(sidecar)
        tab.REPL.pexec(entity.onclick.namespace, { tab })
      }
    } else {
      const clickable = sidecar.querySelector('.sidecar-header-icon-wrapper .package-prefix') as HTMLElement
      clickable.classList.remove('clickable')
      clickable.onclick = undefined
    }
    if (entity.onclick.nameHash) {
      const clickable = nameDom.querySelector('.entity-name-hash') as HTMLElement
      clickable.classList.add('clickable')
      clickable.onclick = () => {
        const tab = getEnclosingTab(sidecar)
        tab.REPL.pexec(entity.onclick.nameHash, { tab })
      }
    } else {
      const clickable = nameDom.querySelector('.entity-name-hash') as HTMLElement
      clickable.classList.remove('clickable')
      clickable.onclick = undefined
    }
  }

  addSidecarHeaderIconText(viewName, sidecar)

  // if we weren't given a toolbarText, but we can infer a createdOn
  // message, then show that as the toolbarText
  if (!entity.toolbarText && metadataBearer) {
    const maybe = createdOn(metadataBearer)
    if (maybe) {
      entity.toolbarText = {
        type: 'info',
        text: maybe
      }
    }
  }

  // handle ToolbarText
  const toolbarTextSpec =
    isMetadataBearing(entity) &&
    (entity.toolbarText || (isMetadataBearingByReference(entity) && entity.resource.toolbarText))
  const toolbarTextContainer = sidecar.querySelector('.sidecar-bottom-stripe-toolbar .sidecar-toolbar-text')
  const toolbarTextContent = toolbarTextContainer.querySelector('.sidecar-toolbar-text-content') as HTMLElement
  removeAllDomChildren(toolbarTextContent)
  if (toolbarTextSpec) {
    /* if (isRefreshableToolbarText(toolbarTextSpec)) {
      toolbarTextSpec.attach(sidecar).refresh()
    } else */
    new ToolbarText(toolbarTextSpec.type, toolbarTextSpec.text).attach(sidecar).refresh()
  } else {
    toolbarTextContent.innerText = ''
    toolbarTextContainer.removeAttribute('data-type')
  }

  return nameDom
}

export const showCustom = async (
  tab: Tab,
  _custom: MultiModalResponse | MetadataBearingByReference,
  sidecar: Sidecar,
  options?: ExecOptions,
  resultDom?: Element
) => {
  if (!_custom || _custom.content === undefined) return

  const custom: MultiModalResponse<ResourceWithMetadataWithContent> | ResourceByReferenceWithContent = _custom
  debug('showCustom', custom, options, resultDom)

  enableTabIndex(sidecar)

  // tell the current view that they're outta here
  if (sidecar.entity || sidecar.uuid) {
    eventBus.emit('/sidecar/replace', sidecar.uuid || sidecar.entity)
  }
  sidecar.uuid = /* custom.uuid || */ uuid()

  const hashDom = sidecar.querySelector('.sidecar-header-name .entity-name-hash') as HTMLElement
  hashDom.innerText = ''

  // if the view hints that it wants to occupy the full screen and we
  // are not currenlty in fullscreen, OR if the view does not want to
  // occupy full screen and we *are*... in either case (this is an
  // XOR, does as best one can in NodeJS), toggle maximization
  const _presentation = isMetadataBearingByReference(custom)
    ? Presentation.Default
    : custom.presentation || Presentation.Default
  const viewProviderDesiresFullscreen =
    _presentation === Presentation.SidecarFullscreen ||
    (isPopup() &&
      (_presentation === Presentation.SidecarFullscreenForPopups || _presentation === Presentation.FixedSize))

  if (!_presentation && !isPopup()) {
    presentAs(tab, Presentation.Default)
  } else if (_presentation || isPopup() || (viewProviderDesiresFullscreen ? !isFullscreen(tab) : isFullscreen(tab))) {
    const presentation =
      _presentation ||
      (viewProviderDesiresFullscreen
        ? Presentation.SidecarFullscreenForPopups
        : _presentation !== undefined
        ? _presentation
        : Presentation.SidecarFullscreen)
    presentAs(tab, presentation)

    if (viewProviderDesiresFullscreen) {
      setMaximization(tab)
    }
  } else {
    // otherwise, reset to default presentation mode
    presentAs(tab, Presentation.Default)
  }

  const customHeaders = sidecar.querySelectorAll('.custom-header-content')
  for (let idx = 0; idx < customHeaders.length; idx++) {
    removeAllDomChildren(customHeaders[idx])
  }

  const customContent = sidecar.querySelector('.custom-content')

  /* if (custom.noZoom) {
    // custom content will control the zoom handler, e.g. monaco-editor
    customContent.classList.remove('zoomable')
  } else */
  // revert the change if previous custom content controls the zoom handler
  customContent.classList.add('zoomable')

  // which viewer is currently active?
  sidecar.setAttribute('data-active-view', '.custom-content > div')

  // add mode buttons, if requested
  const modes = isMetadataBearingByReference(custom) ? [] : custom.modes
  if (!options || !options.leaveBottomStripeAlone) {
    addModeButtons(tab, modes, custom, sidecar, options)
    sidecar.setAttribute('class', `${sidecar.getAttribute('data-base-class')} custom-content`)
  } else {
    sidecar.classList.add('custom-content')
  }
  setVisibleClass(sidecar)

  const { badgesDom } = getBadgesDomContainer(sidecar)

  let addVersion: () => void
  if (custom && (isMetadataBearing(custom) || isMetadataBearingByReference(custom))) {
    const entity = isMetadataBearingByReference(custom) ? custom.resource : custom
    sidecar.entity = entity
    /* if (sidecar.entity.viewName) {
      sidecar.entity.type = sidecar.entity.viewName
    } */

    const prettyName =
      (isMetadataBearingByReference(custom) ? custom.resource.prettyName : undefined) || entity.metadata.name
    const nameHash = entity.nameHash || custom.nameHash
    hashDom.innerText =
      (nameHash !== undefined
        ? nameHash
        : isMetadataBearingByReference(custom)
        ? custom.resource.nameHash
        : undefined) || ''
    const header = sidecar.querySelector('.sidecar-header')
    const nameDom = header.querySelector('.sidecar-header-name-content')
    if (hashDom.innerText.length > 0) {
      nameDom.setAttribute('data-has-name-hash', 'data-has-name-hash')
    } else {
      nameDom.removeAttribute('data-has-name-hash')
    }

    addNameToSidecarHeader(sidecar, prettyName, undefined, undefined, entity.kind, entity)

    // render badges
    clearBadges(sidecar)
    addVersion = () => addVersionBadge(sidecar, entity, { badgesDom })

    /* if (custom.duration) {
      const duration = document.createElement('div')
      duration.classList.add('activation-duration')
      duration.innerText = prettyPrintDuration(custom.duration)
      badgesDomContainer.appendChild(duration)
    } */
  }

  // badges
  const badgeOptions: BadgeOptions = {
    badgesDom: sidecar.querySelector('.sidecar-header .custom-header-content .badges')
  }
  addRelevantBadges(tab, sidecar, isMetadataBearingByReference(custom) ? custom : { resource: custom }, badgeOptions)

  if (addVersion) addVersion()

  const replView = tab.querySelector('.repl')
  replView.className = `sidecar-visible ${(replView.getAttribute('class') || '').replace(/sidecar-visible/g, '')}`

  const container = (resultDom || sidecar.querySelector('.custom-content')) as HTMLElement
  removeAllDomChildren(container)

  if (isPromise(custom.content)) {
    const content = await custom.content
    if (content !== undefined && isHTML(content)) {
      container.appendChild(await content)
    }
  } else if (custom.contentType) {
    // we were asked ot project out one specific field
    const projection = custom.content

    if (isHTML(projection)) {
      // then its already a DOM
      container.appendChild(projection)
    } else if (custom.contentType === 'text/html') {
      // for html-formatted text, wrap it in a container with padding and scrolling
      if (typeof projection === 'string') {
        const padding = document.createElement('div')
        padding.classList.add('padding-content', 'scrollable', 'page-content')
        const inner = document.createElement('div')
        padding.appendChild(inner)
        inner.innerHTML = projection
        container.appendChild(padding)
      } else {
        debug('WARNING: you said you were giving me html-formatted text, but instead gave me an object')
        container.appendChild(document.createTextNode(JSON.stringify(projection, undefined, 2)))
      }
    } else if (custom.contentType === 'text/markdown') {
      if (typeof projection === 'string') {
        const renderer = new Marked.Renderer()
        const marked = (_: string): string => Marked(_, { renderer })
        renderer.link = (href: string, title: string, text: string) => {
          return `<a class='bx--link' target='_blank' title="${title}" href="${href}">${text}</a>`
        }
        const markdownContainer = document.createElement('div')
        markdownContainer.classList.add('padding-content', 'scrollable', 'marked-content', 'page-content')
        markdownContainer.innerHTML = marked(projection)
        container.appendChild(markdownContainer)
      } else {
        debug('WARNING: you said you were giving me markdown-formatted text, but instead gave me an object')
        container.appendChild(document.createTextNode(JSON.stringify(projection, undefined, 2)))
      }
    } else {
      const tryToUseEditor = hasEditor()
      if (tryToUseEditor) {
        try {
          const { content, presentation } = await tryOpenWithEditor(tab, custom, options)
          customContent.classList.remove('zoomable')
          container.appendChild(content)
          presentAs(tab, Presentation.FixedSize)
          return presentation
        } catch (err) {
          console.error('error loading editor', err)
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
        code.innerText = JSON.stringify(projection, undefined, 2)
      }

      scrollWrapper.style.flex = '1'
      scrollWrapper.classList.add('scrollable')
      scrollWrapper.classList.add('scrollable-auto')

      if (custom.contentType) {
        // caller gave us a content type. attempt to decorate
        const contentType = `language-${custom.contentType}`
        code.classList.add(contentType)
        code.classList.remove('json')
        code.classList.remove(code.getAttribute('data-content-type')) // remove previous
        code.setAttribute('data-content-type', contentType)
      }
    }
  } else if (isHTML(custom.content)) {
    container.appendChild(custom.content)
  } else if (typeof custom.content === 'string') {
    // for plain text, wrap it in a `pre` container with padding and scrolling
    const padding = document.createElement('div')
    padding.classList.add('padding-content', 'scrollable')

    const pre = document.createElement('pre')
    pre.classList.add('pre-wrap', 'sans-serif')
    pre.appendChild(document.createTextNode(custom.content))

    padding.appendChild(pre)
    container.appendChild(padding)
  } else {
    console.error('content type not specified for custom content', custom)
  }
} /* showCustom */

/**
 * Register a renderer for a given <kind>
 *
 */
export type ISidecarViewHandler = (
  tab: Tab,
  entity: Object, // eslint-disable-line @typescript-eslint/ban-types
  sidecar: Element,
  options: ShowOptions
) => void
const registeredEntityViews: Record<string, ISidecarViewHandler> = {}
export const registerEntityView = (kind: string, handler: ISidecarViewHandler) => {
  registeredEntityViews[kind] = handler
}

/**
 * Update the current view into the sidecar; this is helpful for tab
 * mode switching.
 *
 */
export const insertCustomContent = (tab: Tab, view: HTMLElement) => {
  debug('insertCustomContent', view)

  const container = getSidecar(tab).querySelector('.custom-content')
  debug('insertCustomContent.container', container)

  removeAllDomChildren(container)
  container.appendChild(view)

  presentAs(tab, Presentation.Default)
}
