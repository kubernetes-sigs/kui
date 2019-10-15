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

import { Tab } from '../tab'
import { Sidecar, getSidecar } from './sidecar-core'

import { removeAllDomChildren } from '../util/dom'

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

export class DefaultBadgeOptions implements BadgeOptions {
  public readonly badgesDom: HTMLElement

  public constructor(tab: Tab) {
    const { badgesDom } = getBadgesDomContainer(getSidecar(tab))
    this.badgesDom = badgesDom
  }
}

export const addBadge = (
  tab: Tab,
  badgeText: Badge,
  { css, onclick, badgesDom = new DefaultBadgeOptions(tab).badgesDom }: BadgeOptions = new DefaultBadgeOptions(tab)
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
