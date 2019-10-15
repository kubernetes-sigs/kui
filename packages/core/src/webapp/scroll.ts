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

interface ScrollIntoViewable extends HTMLElement {
  scrollIntoViewIfNeeded(center: boolean): void
}

function isScrollIntoViewable(element: HTMLElement): element is ScrollIntoViewable {
  return Object.prototype.hasOwnProperty.call(element, 'scrollIntoViewIfNeeded')
}

interface ScrollOptions {
  when?: number
  which?: string
  element?: HTMLElement
  how?: 'scrollIntoViewIfNeeded' | 'scrollIntoView'
  center?: boolean | ScrollIntoViewOptions
}

/**
 * Make sure that the given repl block is visible.
 *
 * @param when wait this long; e.g. the 305ms is in step with the sidecar transition: all 300ms ease-in-out
 * @param which the repl block sub-element that needs to be visible
 * @param element the element to scroll into view (optional, defaults to use @which)
 * @param center this is passed directly to the underlying API https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
 *
 */
export const scrollIntoView = (opts?: ScrollOptions) => {
  const {
    when = 305,
    which = '.repl-active',
    element = document.querySelector(`tab.visible .repl ${which}`) as HTMLElement,
    center = undefined,
    how = 'scrollIntoViewIfNeeded'
  } = opts || {}

  const scroll = () => {
    if (element) {
      if (how === 'scrollIntoViewIfNeeded' && isScrollIntoViewable(element)) {
        // false here means "bottom of the element will be aligned to the bottom of the visible area of the scrollable ancestor"
        //    (see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
        ;(element as ScrollIntoViewable).scrollIntoViewIfNeeded(!!center)
      } else {
        element.scrollIntoView(center || { block: 'end', inline: 'end' })
      }
    }
  }

  if (when === 0) {
    scroll()
  } else {
    return setTimeout(scroll, when)
  }
}
