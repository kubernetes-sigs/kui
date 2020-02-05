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

/**
 * Sidecar badges
 *
 */

import Debug from 'debug'
import { Badge, badgeRegistrar, Tab, empty as removeAllDomChildren, ResourceWithMetadata } from '@kui-shell/core'
import { Sidecar } from '../../model/sidecar'

const debug = Debug('plugin-sidecar/badge')

/**
 * Return the DOM elements housing the sidecar badges
 *
 */
export function getBadgesDomContainer(sidecar: Sidecar) {
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

export interface BadgeOptions {
  css?: string
  onclick?: () => void
  badgesDom: Element
}

export class DefaultBadgeOptions implements BadgeOptions {
  public readonly badgesDom: HTMLElement

  public constructor(sidecar: Sidecar) {
    const { badgesDom } = getBadgesDomContainer(sidecar)
    this.badgesDom = badgesDom
  }
}

function isHTMLImage(img: HTMLImageElement | SVGElement): img is HTMLImageElement {
  return (img as HTMLImageElement).alt !== undefined
}

export const addBadge = (
  sidecar: Sidecar,
  badgeText: Badge,
  { css, onclick, badgesDom = new DefaultBadgeOptions(sidecar).badgesDom }: BadgeOptions = new DefaultBadgeOptions(
    sidecar
  )
) => {
  // debug('addBadge', badgeText, badgesDom)

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
      if (isHTMLImage(badgeText.image)) {
        badgeText.image.alt = badgeText.title
      }
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

export const clearBadges = (sidecar: Sidecar) => {
  const header = sidecar.querySelector('.sidecar-header')
  removeAllDomChildren(header.querySelector('.badges'))
}

export function hasBadge(sidecar: Sidecar, cls: string) {
  const header = sidecar.querySelector('.sidecar-header')
  return !!header.querySelector(`.badges ${cls}`)
}

/**
 * Add all registered badges that are relevant to the given resource
 *
 */
export function apply<Resource extends ResourceWithMetadata>(
  tab: Tab,
  sidecar: Sidecar,
  entity: { resource: Resource },
  badgeOptions: BadgeOptions
) {
  badgeRegistrar
    .filter(({ when }) => {
      // filter out any irrelevant badges (for this resource)
      try {
        return when(entity.resource)
      } catch (err) {
        debug('warning: registered badge threw an exception during filter', err)
        return false
      }
    })
    .forEach(({ badge }) => {
      // now add the badge
      if (typeof badge === 'function') {
        addBadge(sidecar, badge(entity.resource, tab), badgeOptions)
      } else {
        addBadge(sidecar, badge, badgeOptions)
      }
    })
}
