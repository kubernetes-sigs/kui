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
const debug = Debug('webapp/views/sidecar')
debug('loading')

import { v4 as uuid } from 'uuid'
import * as prettyPrintDuration from 'pretty-ms'

import { Tab, isPopup, scrollIntoView, oops, getTabFromTarget } from '../cli'
import eventBus from '../../core/events'
import { element, removeAllDomChildren } from '../util/dom'
import { prettyPrintTime } from '../util/time'
import { css as bottomStripeCSS, addModeButtons } from '../bottom-stripe'
import { keys } from '../keys'
import { ShowOptions, DefaultShowOptions } from './show-options'
import sidecarSelector from './sidecar-selector'
import Presentation from './presentation'
import {
  MetadataBearing,
  isMetadataBearing,
  MetadataBearingByReference,
  isMetadataBearingByReference,
  EntitySpec,
  Entity
} from '../../models/entity'
import { ExecOptions } from '../../models/execOptions'
import { apply as addRelevantBadges } from './registrar/badges'
import { tryOpenWithEditor } from './registrar/editors'
import { isPromise } from '../../util/types'

/** @deprecated */
export { MetadataBearingByReference }
export { isMetadataBearingByReference }

debug('finished loading modules')

/**
 * Beautify any kinds we know how to
 *
 */
export const beautify = (kind: string, code: string) => {
  return code
}

/**
 * Return the sidecar model
 *
 */
interface Sidecar extends HTMLElement {
  entity: EntitySpec | CustomSpec
  uuid?: string
}
export const getSidecar = (tab: Tab): Sidecar => {
  return tab.querySelector('sidecar') as Sidecar
}

export const currentSelection = (tab: Tab): EntitySpec | CustomSpec => {
  const sidecar = getSidecar(tab)
  return sidecar && sidecar.entity
}

const enableTabIndex = (sidecar: Sidecar, tabbable = true) => {
  const notabElements = document.querySelectorAll('.kui--notab-when-sidecar-hidden')

  notabElements.forEach(element => {
    if (tabbable) {
      element.removeAttribute('tabindex')
    } else {
      element.setAttribute('tabindex', '-1')
    }
  })
}

export const hide = (tab: Tab, clearSelectionToo = false) => {
  debug('hide')

  const sidecar = getSidecar(tab)
  sidecar.classList.remove('visible')
  enableTabIndex(sidecar, false)

  if (!clearSelectionToo) {
    // only minimize if we weren't asked to clear the selection
    sidecar.classList.add('minimized')
    tab.classList.add('sidecar-is-minimized')
  } else {
    document.body.classList.remove('sidecar-visible')
  }

  const replView = tab.querySelector('.repl')
  replView.classList.remove('sidecar-visible')

  // we just hid the sidecar. make sure the current prompt is active for text input
  // cli.getCurrentPrompt().focus()

  // were we asked also to clear the selection?
  if (clearSelectionToo && sidecar.entity) {
    delete sidecar.entity
  }

  setTimeout(() => eventBus.emit('/sidecar/toggle', { sidecar, tab }), 0)
  return true
}

export const clearSelection = (tab: Tab) => {
  // true means also clear selection model
  return hide(tab, true)
}
export const maybeHideEntity = (tab: Tab, entity: EntitySpec): boolean => {
  const sidecar = getSidecar(tab)

  const entityMatchesSelection =
    sidecar.entity && sidecar.entity.name === entity.name && sidecar.entity.namespace === entity.namespace

  debug('maybeHideEntity', entityMatchesSelection, entity, sidecar.entity)
  if (entityMatchesSelection) {
    clearSelection(tab)
    return true
  }
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
 * Sidecar badges
 *
 */

/**
 * Return the DOM elements housing the sidecar badges
 *
 */
function getBadgesDomContainer(sidecar: Sidecar) {
  const badgesDomContainer = sidecar.querySelector('.header-right-bits .custom-header-content')
  let badgesDom = badgesDomContainer.querySelector('.badges') as HTMLElement
  if (!badgesDom) {
    badgesDom = document.createElement('span')
    badgesDom.classList.add('badges')
    badgesDomContainer.appendChild(badgesDom)
  } else {
    removeAllDomChildren(badgesDom)
  }

  return { badgesDomContainer, badgesDom }
}

/**
 * This is the most complete form of a badge specification, allowing
 * the caller to provide a title, an onclick handler, and an optional
 * fontawesome icon representation.
 *
 */
export interface BadgeSpec {
  title: string
  fontawesome?: string
  image?: HTMLImageElement
  css?: string
  onclick?: (evt: MouseEvent) => boolean
}

export type Badge = string | BadgeSpec | Element

export interface BadgeOptions {
  css?: string
  onclick?: () => void
  badgesDom: Element
}
class DefaultBadgeOptions implements BadgeOptions {
  public readonly badgesDom: HTMLElement

  public constructor(tab: Tab) {
    const { badgesDom } = getBadgesDomContainer(getSidecar(tab))
    this.badgesDom = badgesDom
  }
}

/**
 * Text to be displayed in the sidecar toolbar
 *
 */
type ToolbarTextType = 'info' | 'warning' | 'error'
type ToolbarTextValue = string | Element
export interface ToolbarText {
  type: ToolbarTextType
  text: ToolbarTextValue
}
export interface RefreshableToolbarText extends ToolbarText {
  attach: (owner: Element) => RefreshableToolbarText
  refresh: () => void
}
export class ToolbarTextImpl implements RefreshableToolbarText {
  private _container: Element

  // eslint doesn't recognize the typescript constructor-settor syntax
  // eslint-disable-next-line no-useless-constructor
  public constructor(public type: ToolbarTextType, public text: string | Element) {}

  public attach(owner: Element) {
    this._container = element('.sidecar-bottom-stripe-toolbar .sidecar-toolbar-text', owner)
    return this
  }

  public refresh() {
    if (this._container) {
      const content = element('.sidecar-toolbar-text-content', this._container)
      if (typeof this.text === 'string') {
        content.innerText = this.text
      } else {
        content.appendChild(this.text)
      }
      this._container.setAttribute('data-type', this.type)
    }
  }
}
function isToolbarText(subtext: Formattable | ToolbarText): subtext is ToolbarText {
  const spec = subtext as ToolbarText
  return spec && spec.type !== undefined && spec.text !== undefined
}
function isRefreshableToolbarText(ttext: ToolbarText): ttext is RefreshableToolbarText {
  const refreshable = ttext as RefreshableToolbarText
  return refreshable.attach !== undefined && refreshable.refresh !== undefined
}

/**
 * Show custom content in the sidecar
 *
 */
type CustomContent =
  | string
  | Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  | HTMLElement
  | Promise<HTMLElement>
export interface CustomSpec extends EntitySpec, MetadataBearing {
  /** noZoom: set to true for custom content to control the zoom event handler */
  noZoom?: boolean

  /** name hash, e.g. the hash part of auto-generated names, or an openwhisk activation id */
  nameHash?: string

  isREPL?: boolean
  presentation?: Presentation
  renderAs?: string
  subtext?: Formattable
  toolbarText?: ToolbarText
  content: CustomContent
  badges?: Badge[]
  contentType?: string
  resource?: MetadataBearing
  createdOnString?: string
}

export function isCustomSpec(entity: Entity): entity is CustomSpec {
  const custom = entity as CustomSpec
  return custom !== undefined && (custom.type === 'custom' || custom.renderAs === 'custom')
}
function isHTML(content: CustomContent): content is HTMLElement {
  return typeof content !== 'string' && (content as HTMLElement).nodeName !== undefined
}

type Op = (elt: Element, cls: string) => void
const remove: Op = (elt: Element, cls: string) => elt.classList.remove(cls)
const add: Op = (elt: Element, cls: string) => elt.classList.add(cls)
const toggleClass: Op = (elt: Element, cls: string) => elt.classList.toggle(cls)

/**
 * Ensure that we are in sidecar maximization mode
 *
 */
export const setMaximization = (tab: Tab, op: Op = add, cause: MaximizationCause = 'default') => {
  if (document.body.classList.contains('subwindow')) {
    op(document.body, 'sidecar-full-screen')
    op(document.body, 'sidecar-visible')
  }

  const before = tab.classList.contains('sidecar-full-screen')
  op(tab, 'sidecar-full-screen')
  const after = tab.classList.contains('sidecar-full-screen')

  if (before !== after) {
    setTimeout(() => eventBus.emit('/sidecar/maximize'), 0)
  }

  if (after) {
    // if we entered full screen mode, remember if the user caused it,
    // so that we don't undo it during our normal flow
    tab.setAttribute('maximization-cause', cause)
  } else {
    tab.removeAttribute('maximization-cause')
  }
}

/**
 * Find and format links in the given dom tree
 *
 */
export const linkify = (dom: Element): void => {
  const attrs = dom.querySelectorAll('.hljs-attr')
  for (let idx = 0; idx < attrs.length; idx++) {
    const attr = attrs[idx] as HTMLElement
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

export const presentAs = (tab: Tab, presentation?: Presentation) => {
  if (presentation || presentation === Presentation.Default) {
    document.body.setAttribute('data-presentation', Presentation[presentation].toString())
    if (!isPopup() && presentation === Presentation.Default && tab.getAttribute('maximization-cause') !== 'user') {
      setMaximization(tab, remove)
    }
  } else {
    document.body.removeAttribute('data-presentation')
  }
}

export const addBadge = (
  tab: Tab,
  badgeText: Badge,
  { css, onclick, badgesDom = new DefaultBadgeOptions(tab).badgesDom }: BadgeOptions = new DefaultBadgeOptions(tab)
) => {
  debug('addBadge', badgeText, badgesDom)

  const badge = document.createElement('badge') as HTMLElement
  badgesDom.appendChild(badge)

  if (typeof badgeText === 'string') {
    badge.innerText = badgeText as string
  } else if (badgeText instanceof Element) {
    badge.appendChild(badgeText as Element)
    badge.classList.add('badge-as-image')
  } else {
    // otherwise, badge is an IBadgeSpec
    if (badgeText.image) {
      // badge is an HTMLImageElement
      badgeText.image.alt = badgeText.title
      badge.appendChild(badgeText.image)
      badge.classList.add('badge-as-image')
    } else if (badgeText.fontawesome) {
      // badge is a named fontawesome icon
      const awesome = document.createElement('i')
      awesome.className = badgeText.fontawesome
      badge.classList.add('badge-as-fontawesome')
      badge.appendChild(awesome)
    } else {
      badge.innerText = badgeText.title

      if (badgeText.css) {
        badge.classList.add(badgeText.css)
      }
    }

    if (badgeText.onclick) {
      badge.classList.add('clickable')
      badge.onclick = badgeText.onclick
    }
  }

  if (css) {
    badge.classList.add(css)
  }

  if (onclick) {
    badge.classList.add('clickable')
    badge.onclick = onclick
  }

  return badge
}

export const clearBadges = (tab: Tab) => {
  const sidecar = getSidecar(tab)
  const header = sidecar.querySelector('.sidecar-header')
  removeAllDomChildren(header.querySelector('.badges'))
}

/**
 * If the entity has a version attribute, then render it
 *
 */
export const addVersionBadge = (
  tab: Tab,
  entity: EntitySpec,
  { clear = false, badgesDom = undefined }: { clear?: boolean; badgesDom?: HTMLElement } = {}
) => {
  if (clear) {
    clearBadges(tab)
  }

  if (isMetadataBearing(entity)) {
    const version = (entity as MetadataBearing).metadata.generation
    if (version) {
      addBadge(tab, /^v/.test(version) ? version : `v${version}`, { badgesDom }).classList.add('version')
      return
    }
  }

  const version = entity.version || (isMetadataBearingByReference(entity) && entity.resource.metadata.generation)

  if (version) {
    addBadge(tab, /^v/.test(version) ? version : `v${version}`, { badgesDom }).classList.add('version')
  }
}

/**
 * Call a formatter
 *
 */
export type Formattable = string | Promise<string> | HTMLElement | Promise<HTMLElement>

/**
 * Add view name to the sidecar header "icon text"
 *
 */
export const addSidecarHeaderIconText = (viewName: string, sidecar: HTMLElement) => {
  debug('addSidecarHeaderIconText', viewName)
  const iconDom = element('.sidecar-header-icon', sidecar)

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
const createdOn = (resource: MetadataBearing, entity: CustomSpec): HTMLElement => {
  const startTime = /* resource.status && resource.status.startTime || */ resource.metadata.creationTimestamp
  const prefixText = /* resource.status && resource.status.startTime ? 'Started on ' : */ entity.createdOnString
    ? `${entity.createdOnString} `
    : 'Created on '

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
 * Given an entity name and an optional packageName, decorate the sidecar header
 *
 */
export const addNameToSidecarHeader = async (
  sidecar: Sidecar,
  name: string | Element,
  packageName = '',
  onclick?: () => void,
  viewName?: string,
  subtext?: Formattable | ToolbarText,
  entity?: EntitySpec | CustomSpec
) => {
  debug('addNameToSidecarHeader', name, isMetadataBearingByReference(entity), entity)

  // maybe entity.content is a metadat-bearing entity that we can
  // mine for identifying characteristics
  const metadataBearer = isMetadataBearingByReference(entity) ? entity.resource : isMetadataBearing(entity) && entity
  if (metadataBearer) {
    const maybeName = name || (metadataBearer.spec && metadataBearer.spec.displayName) || metadataBearer.metadata.name
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
  const footer = sidecar.querySelector('.sidecar-bottom-stripe')
  const nameDom = header.querySelector('.sidecar-header-name-content')
  nameDom.className = nameDom.getAttribute('data-base-class')
  element('.package-prefix', footer).innerText = packageName

  if (isCustomSpec(entity) && entity.isREPL) {
    header.querySelector('.sidecar-header-text').classList.add('is-repl-like')
  } else {
    header.querySelector('.sidecar-header-text').classList.remove('is-repl-like')
  }

  if (typeof name === 'string') {
    if (isCustomSpec(entity) && entity.isREPL) {
      /* const nameContainer = nameDom.querySelector('.sidecar-header-input') as HTMLInputElement
      nameContainer.value = name
      cli.listen(nameContainer) */
    } else {
      const nameContainer = element('.entity-name', nameDom)
      nameContainer.innerText = name
    }
  } else if (name) {
    const nameContainer = nameDom.querySelector('.entity-name')
    removeAllDomChildren(nameContainer)
    nameContainer.appendChild(name)
  }

  if (onclick) {
    const clickable = element('.entity-name', nameDom)
    clickable.classList.add('clickable')
    clickable.onclick = onclick
  }

  addSidecarHeaderIconText(viewName, sidecar)

  // if we weren't given a "subtext", and we find legitimate "created
  // on" metadata, then show that as the subtext
  if (!subtext && metadataBearer) {
    const maybe = createdOn(metadataBearer, isCustomSpec(entity) && entity)
    if (maybe) {
      subtext = maybe
    }
  }

  if (subtext && !isToolbarText(subtext) && isCustomSpec(entity) && entity.toolbarText) {
    // both subtext and toolbarText?
    const subtextContainer = sidecar.querySelector(
      '.sidecar-header-secondary-content .custom-header-content'
    ) as HTMLElement
    removeAllDomChildren(subtextContainer)
    Promise.resolve(subtext).then(subtext => {
      if (typeof subtext === 'string') {
        subtextContainer.innerText = subtext
      } else {
        subtextContainer.appendChild(subtext)
      }
    })
  }

  // handle ToolbarText
  const toolbarTextSpec = isToolbarText(subtext) ? subtext : isCustomSpec(entity) && entity.toolbarText
  const toolbarTextContainer = element('.sidecar-bottom-stripe-toolbar .sidecar-toolbar-text', sidecar)
  const toolbarTextContent = element('.sidecar-toolbar-text-content', toolbarTextContainer)
  removeAllDomChildren(toolbarTextContent)
  if (toolbarTextSpec) {
    if (isRefreshableToolbarText(toolbarTextSpec)) {
      toolbarTextSpec.attach(sidecar).refresh()
    } else {
      new ToolbarTextImpl(toolbarTextSpec.type, toolbarTextSpec.text).attach(sidecar).refresh()
    }
  } else if (subtext && !isToolbarText(subtext)) {
    // handle "subtext", which is now treated as a special case of a
    // ToolbarText where the type is 'info'
    const text = await Promise.resolve(subtext)
    toolbarTextContainer.setAttribute('data-type', 'info')
    if (text instanceof Element) {
      toolbarTextContent.appendChild(text)
    } else {
      toolbarTextContent.innerText = text
    }
  } else {
    toolbarTextContent.innerText = ''
    toolbarTextContainer.removeAttribute('data-type')
  }

  return nameDom
}

const setVisibleClass = (sidecar: Sidecar) => {
  sidecar.classList.add('visible')
}

export const isFullscreen = (tab: Tab) => {
  return tab.classList.contains('sidecar-full-screen')
}

export const showCustom = async (tab: Tab, custom: CustomSpec, options?: ExecOptions, resultDom?: Element) => {
  if (!custom || !custom.content) return
  debug('showCustom', custom, options, resultDom)

  const sidecar = getSidecar(tab)
  enableTabIndex(sidecar)

  // tell the current view that they're outta here
  if (sidecar.entity || sidecar.uuid) {
    eventBus.emit('/sidecar/replace', sidecar.uuid || sidecar.entity)
  }
  sidecar.uuid = custom.uuid || uuid()

  const hashDom = element('.sidecar-header-name .entity-name-hash', sidecar)
  hashDom.innerText = ''

  // if the view hints that it wants to occupy the full screen and we
  // are not currenlty in fullscreen, OR if the view does not want to
  // occupy full screen and we *are*... in either case (this is an
  // XOR, does as best one can in NodeJS), toggle maximization
  const viewProviderDesiresFullscreen =
    custom.presentation === Presentation.SidecarFullscreen ||
    (isPopup() &&
      (custom.presentation === Presentation.SidecarFullscreenForPopups ||
        custom.presentation === Presentation.FixedSize))

  if (!custom.presentation && !isPopup()) {
    presentAs(tab, Presentation.Default)
  } else if (
    custom.presentation ||
    isPopup() ||
    (viewProviderDesiresFullscreen ? !isFullscreen(tab) : isFullscreen(tab))
  ) {
    const presentation =
      custom.presentation ||
      (viewProviderDesiresFullscreen
        ? Presentation.SidecarFullscreenForPopups
        : custom.presentation !== undefined
        ? custom.presentation
        : Presentation.SidecarFullscreen)
    presentAs(tab, presentation)

    if (viewProviderDesiresFullscreen) {
      setMaximization(tab)
    }
  } else {
    // otherwise, reset to default presentation mode
    presentAs(tab, Presentation.Default)
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
    custom.controlHeaders.forEach((_: string) => {
      const customHeaders = sidecar.querySelectorAll(`${_} .custom-header-content`)
      for (let idx = 0; idx < customHeaders.length; idx++) {
        removeAllDomChildren(customHeaders[idx])
      }
    })
  }

  const customContent = sidecar.querySelector('.custom-content')

  if (custom.noZoom) {
    // custom content will control the zoom handler, e.g. monaco-editor
    customContent.classList.remove('zoomable')
  } else {
    // revert the change if previous custom content controls the zoom handler
    customContent.classList.add('zoomable')
  }

  // which viewer is currently active?
  sidecar.setAttribute('data-active-view', '.custom-content > div')

  // add mode buttons, if requested
  const modes = custom.modes
  if (!options || !options.leaveBottomStripeAlone) {
    addModeButtons(tab, modes, custom, options)
    sidecar.setAttribute('class', `${sidecar.getAttribute('data-base-class')} custom-content`)
    setVisibleClass(sidecar)
  } else {
    sidecar.classList.add('custom-content')
  }

  if (custom.sidecarHeader === false) {
    // view doesn't want a sidecar header
    sidecar.classList.add('no-sidecar-header')
  }

  if (custom.displayOptions) {
    custom.displayOptions.forEach(option => {
      sidecar.classList.add(option.replace(/\s/g, '-'))
    })
  }

  const { badgesDomContainer, badgesDom } = getBadgesDomContainer(sidecar)

  if (custom && (custom.isEntity || isMetadataBearing(custom) || isMetadataBearingByReference(custom))) {
    const entity = custom
    sidecar.entity = entity
    if (sidecar.entity.viewName) {
      sidecar.entity.type = sidecar.entity.viewName
    }

    hashDom.innerText = entity.nameHash !== undefined ? entity.nameHash : ''

    addNameToSidecarHeader(
      sidecar,
      entity.prettyName || entity.name,
      entity.packageName || entity.namespace,
      undefined,
      entity.prettyType || entity.type || entity.kind,
      entity.subtext,
      entity
    )

    // render badges
    addVersionBadge(tab, entity, { clear: true, badgesDom })

    if (custom.duration) {
      const duration = document.createElement('div')
      duration.classList.add('activation-duration')
      duration.innerText = prettyPrintDuration(custom.duration)
      badgesDomContainer.appendChild(duration)
    }
  }

  // badges
  if (custom && custom.badges) {
    custom.badges.forEach(badge => addBadge(tab, badge, { badgesDom }))
  }
  if (isMetadataBearingByReference(custom)) {
    const badgeOptions: BadgeOptions = {
      badgesDom: sidecar.querySelector('.sidecar-header .custom-header-content .badges')
    }
    addRelevantBadges(tab, custom, badgeOptions)
  }

  const replView = tab.querySelector('.repl')
  replView.className = `sidecar-visible ${(replView.getAttribute('class') || '').replace(/sidecar-visible/g, '')}`

  const container = resultDom || sidecar.querySelector('.custom-content')
  removeAllDomChildren(container)

  if (isPromise(custom.content)) {
    container.appendChild(await custom.content)
  } else if (custom.contentType) {
    // we were asked ot project out one specific field
    const projection = custom.content

    if (isHTML(projection)) {
      // then its already a DOM
      container.appendChild(projection)
    } else {
      const tryToUseEditor = true
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
        code.classList.remove(code.getAttribute('data-content-type')) // remove previous
        code.setAttribute('data-content-type', contentType)
        code.classList.remove('json')
        setTimeout(() => {
          setTimeout(() => linkify(code), 100)
        }, 0)
      }
    }
  } else if (isHTML(custom.content)) {
    container.appendChild(custom.content)
  } else if (typeof custom.content === 'string') {
    container.appendChild(document.createTextNode(custom.content))
  } else {
    console.error('content type not specified for custom content')
  }
} /* showCustom */

/**
 * @return the enclosing tab for the given sidecar
 *
 */
export const getEnclosingTab = (sidecar: Sidecar): Tab => {
  return getTabFromTarget(sidecar)
}

const setVisible = (sidecar: Sidecar) => {
  const tab = getEnclosingTab(sidecar)

  setVisibleClass(sidecar)
  enableTabIndex(sidecar)
  tab.classList.remove('sidecar-is-minimized')
  sidecar.classList.remove('minimized')
  document.body.classList.add('sidecar-visible')

  const replView = tab.querySelector('.repl')
  replView.classList.add('sidecar-visible')

  scrollIntoView()

  setTimeout(() => eventBus.emit('/sidecar/toggle', { sidecar, tab }), 0)
}

export const show = (tab: Tab, block?: HTMLElement, nextBlock?: HTMLElement) => {
  debug('show')

  const sidecar = getSidecar(tab)
  if (currentSelection(tab) || sidecar.className.indexOf('custom-content') >= 0) {
    setVisible(sidecar)
    enableTabIndex(sidecar)
    return true
  } else if (block && nextBlock) {
    oops(undefined, block, nextBlock)(new Error('You have no entity to show'))
  }
}

/**
 * View State of the sidecar of a tab
 *
 */
export enum SidecarState {
  NotShown,
  Minimized,
  Open,
  FullScreen
}

/**
 * @return the view state of the sidecar in a given tab
 *
 */
export const getSidecarState = (tab: Tab): SidecarState => {
  const sidecar = getSidecar(tab)
  if (tab.classList.contains('sidecar-full-screen')) {
    return SidecarState.FullScreen
  } else if (sidecar.classList.contains('visible')) {
    return SidecarState.Open
  } else if (sidecar.classList.contains('minimized')) {
    return SidecarState.Minimized
  } else {
    return SidecarState.NotShown
  }
}

export const isVisible = (tab: Tab): boolean => {
  const sidecar = getSidecar(tab)
  return !!(sidecar.classList.contains('visible') && sidecar)
}

/** was maximization changed by user request, or by normal default processes? */
type MaximizationCause = 'default' | 'user'

/**
 * Toggle sidecar maximization
 *
 */
export const toggleMaximization = (tab: Tab, cause?: MaximizationCause) => {
  setMaximization(tab, toggleClass, cause)
}

/**
 * Toggle sidecar visibility
 *
 */
export const toggle = (tab: Tab) => {
  if (!isVisible(tab)) {
    return show(tab)
  } else {
    const presentationString = document.body.getAttribute('data-presentation') as keyof typeof Presentation
    const presentation: Presentation = presentationString && Presentation[presentationString]
    // Key.Escape for Presentation.SidecarThin is interpreted as Close
    return presentation === Presentation.SidecarThin ? clearSelection(tab) : hide(tab)
  }
}

/**
 * Generic entity rendering
 *
 */
export const showGenericEntity = (
  tab: Tab,
  entity: EntitySpec | CustomSpec,
  options: ShowOptions = new DefaultShowOptions()
) => {
  debug('showGenericEntity', entity, options)

  const sidecar = getSidecar(tab)
  // const header = sidecar.querySelector('.sidecar-header')

  // tell the current view that they're outta here
  eventBus.emit('/sidecar/replace', sidecar.entity)

  const hashDom = element('.sidecar-header-name .entity-name-hash', sidecar)
  hashDom.innerText = ''

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
    addModeButtons(tab, modes, entity, options)
  }

  // remember the selection model
  if (!options || options.echo !== false) sidecar.entity = entity
  sidecar.setAttribute(
    'class',
    `${sidecar.getAttribute('data-base-class')} entity-is-${entity.prettyType} entity-is-${entity.type}`
  )
  setVisibleClass(sidecar)

  const replView = tab.querySelector('.repl')
  replView.className = `sidecar-visible ${(replView.getAttribute('class') || '').replace(/sidecar-visible/g, '')}`

  const viewProviderDesiresFullscreen = document.body.classList.contains('subwindow')
  if (viewProviderDesiresFullscreen ? !isFullscreen(tab) : isFullscreen(tab)) {
    toggleMaximization(tab)
    presentAs(tab, Presentation.SidecarFullscreen)
  } else {
    // otherwise, reset to default presentation mode
    presentAs(tab, Presentation.Default)
  }

  // the name of the entity, for the header
  const viewName = entity.prettyType || entity.type
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nameDom = addNameToSidecarHeader(sidecar, entity.name, entity.packageName, undefined, viewName)

  clearBadges(tab)
  addVersionBadge(tab, entity)

  return sidecar
}

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
 * Load the given entity into the sidecar UI
 *
 */
export const showEntity = (
  tab: Tab,
  entity: EntitySpec | CustomSpec,
  options: ShowOptions = new DefaultShowOptions()
) => {
  if (isCustomSpec(entity)) {
    // caller could have called showCustom, but we will be gracious
    // here, and redirect the call
    return showCustom(tab, entity, options)
  }

  const sidecar = showGenericEntity(tab, entity, options)
  debug('done with showGenericEntity')

  const renderer = registeredEntityViews[entity.type || entity.kind]
  if (renderer) {
    debug('dispatching to registered view handler %s', entity.type || entity.kind, renderer)
    return renderer(tab, entity, sidecar, options)
  } else {
    try {
      const serialized = JSON.stringify(entity, undefined, 2)
      const container = element('.action-source', sidecar)
      sidecar.classList.add('entity-is-actions')
      container.innerText = serialized
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
  document.addEventListener('keydown', async (event: KeyboardEvent) => {
    if (event.keyCode === keys.LEFT_ARROW && (event.ctrlKey || (process.platform === 'darwin' && event.metaKey))) {
      const tab = getTabFromTarget(event.srcElement)
      const back = bottomStripeCSS.backButton(tab)
      const clickEvent = document.createEvent('Events')
      clickEvent.initEvent('click', true, false)
      back.dispatchEvent(clickEvent)
    }
  })

  // escape key toggles sidecar visibility
  document.addEventListener('keyup', (evt: KeyboardEvent) => {
    if (
      document.activeElement &&
      !(
        document.activeElement === document.body ||
        document.activeElement.classList.contains('inputarea') || // monaco-editor
        document.activeElement.classList.contains('repl-input-element')
      )
    ) {
      // not focused on repl
      return
    }

    if (evt.keyCode === keys.ESCAPE) {
      if (!isPopup()) {
        const tab = getTabFromTarget(evt.srcElement)
        const closeButton = sidecarSelector(tab, '.sidecar-bottom-stripe-close')
        if (isVisible(tab)) {
          closeButton.classList.add('hover')
          setTimeout(() => closeButton.classList.remove('hover'), 500)
        }
        toggle(tab)
        scrollIntoView()
      }
    }
  })
}

/**
 * Update the current view into the sidecar; this is helpful for tab
 * mode switching.
 *
 */
export const insertView = (tab: Tab) => (view: HTMLElement) => {
  debug('insertView', view)

  const container = getActiveView(tab)
  debug('insertView.container', container)

  removeAllDomChildren(container)
  container.appendChild(view)

  presentAs(tab, Presentation.Default)
}
