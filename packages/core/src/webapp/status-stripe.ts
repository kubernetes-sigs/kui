/*
 * Copyright 2020 IBM Corporation
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

import { Tab, getCurrentTab } from './tab'
import { isHTML } from '../util/types'

export type StripePosition = 'context' | 'meter' | 'button'

function stripe() {
  return document.querySelector('#kui--status-stripe')
}

function region(pos: StripePosition) {
  return stripe().querySelector(`.kui--status-stripe-${pos}`)
}

/**
 * The `icon` is assumed to be html represented as text.
 *
 */
export type TextWithIcon = {
  /** The `icon` is assumed to be html represented as text */
  icon: string

  /** for narrower icons */
  iconIsNarrow?: boolean

  /** The `text` is an HTML element */
  text: HTMLElement

  /** The onclick handlers, interpted as command lines to be executed */
  onclick?: {
    icon?: string
    text?: string
  }
}

/** Supported impls of Fragment */
type FragmentTypes = TextWithIcon

interface WithId {
  /** An identifier that can be helpful with testing */
  id: string
}

export type Fragment = FragmentTypes & Partial<WithId>

function hasId(fragment: Fragment | WithId): fragment is WithId {
  return typeof (fragment as WithId).id === 'string'
}

function isTextWithIcon(fragment: Fragment): fragment is TextWithIcon {
  const twi = fragment as TextWithIcon
  return typeof twi.icon === 'string' && isHTML(twi.text)
}

/** variants of how the information should ber presented */
type ViewLevel = 'hidden' | 'normal' | 'obscured' | 'ok' | 'warn' | 'error'

/** event listener, e.g. new type, switch tab */
type MyListener = (tab: Tab) => void
type Listener<F extends Fragment> = (tab: Tab, hideable: StatusStripeController<F>, fragment: F) => void | Promise<void>

/** a `Contribution` is a UI `Fragment` along with an event `Listener` */
export type StatusStripeContribution<F extends Fragment> = { fragment: F; listener: Listener<F> }

export interface StatusStripeController<F extends Fragment = TextWithIcon> {
  /**
   * Change the ViewLevel of the fragment
   *
   * @return this controller
   */
  showAs(level: ViewLevel): StatusStripeController<F>

  listen(cb: Listener<F>): Promise<MyListener>
  unlisten(cb: MyListener): Promise<void>
}

/**
 * Implementation of StatusStripeController which uses a DOM Element
 * to wrap the fragment. It also listens to a set of default events:
 * new tab, tab switch, and command completion.
 *
 */
class ElementController<F extends Fragment> implements StatusStripeController<F> {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly element: Element, private readonly fragment: F) {}

  public showAs(level: ViewLevel) {
    this.element.setAttribute('data-view', level)
    return this
  }

  public async unlisten(myListener: MyListener) {
    const { default: eventBus } = await import('../core/events')

    eventBus.off('/tab/new', myListener)
    eventBus.off('/tab/switch', myListener)
    eventBus.off('/command/complete/fromuser', myListener)
  }

  public async listen(listener: Listener<F>) {
    const myListener: MyListener = (tab: Tab) => {
      // since we have a single-global status, make sure that the
      // event pertains to the current tab; we also listen to
      // /tab/switch (just below), so we will reflect any events that
      // we drop (here) when the user switches to that other tab
      if (tab === getCurrentTab()) {
        Promise.resolve(listener(tab, this, this.fragment)).catch(err => {
          console.error('error refreshing status stripe fragment', err)
          this.showAs('hidden')
        })
      }
    }

    const { default: eventBus } = await import('../core/events')

    eventBus.on('/tab/new', myListener)
    eventBus.on('/tab/switch', myListener)
    eventBus.on('/command/complete/fromuser', myListener)

    return myListener
  }
}

/**
 * The StatusStripe API.
 *
 */
class StatusStripeAPI {
  private render(fragment: Fragment) {
    if (isTextWithIcon(fragment)) {
      const frag = document.createDocumentFragment()

      const icon = document.createElement('a')
      icon.href = '#' //
      icon.classList.add(fragment.iconIsNarrow ? 'tiny-right-pad' : 'small-right-pad', 'kui--status-stripe-icon')
      icon.innerHTML = fragment.icon

      if (fragment.onclick) {
        if (fragment.onclick.text) {
          const clickable = document.createElement('a')
          clickable.href = '#'
          clickable.classList.add('clickable', 'kui--status-stripe-text')
          clickable.appendChild(fragment.text)
          fragment.text = clickable
          fragment.text.onclick = () => getCurrentTab().REPL.pexec(fragment.onclick.text)
        }
        if (fragment.onclick.icon) {
          icon.classList.add('clickable')
          icon.onclick = () => getCurrentTab().REPL.pexec(fragment.onclick.icon)
        }
      }

      frag.appendChild(icon)
      frag.appendChild(fragment.text)
      return frag
    } else {
      throw new Error('unsupported fragment type')
    }
  }

  private wrap(fragment: Fragment) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('kui--status-stripe-element')
    wrapper.appendChild(this.render(fragment))

    if (hasId(fragment)) {
      wrapper.classList.add(fragment.id)
    }

    return wrapper
  }

  /**
   * Append the given `fragment` at the given position `pos`. Note:
   * that the fragment will be hidden by default. This is to avoid the
   * fragment showing in a partial form prior to the first
   * availability of data.
   *
   * @return a controller that can be used e.g. to change whether or
   * not the fragment is visible
   *
   */
  public addTo<F extends Fragment>(pos: StripePosition, fragment: F): StatusStripeController<F> {
    const element = this.wrap(fragment)
    region(pos).appendChild(element)

    // re: initial invisibility, see
    // https://github.com/IBM/kui/issues/3538
    return new ElementController<F>(element, fragment).showAs('hidden')
  }

  public remove(pos: StripePosition, fragment: DocumentFragment | HTMLElement) {
    region(pos).removeChild(fragment)
  }
}

/**
 * Export the API impl
 *
 */
export default new StatusStripeAPI()
