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

import * as React from 'react'
import { Badge as KuiBadge, Tab, MultiModalResponse } from '@kui-shell/core'

import HTMLDom from './HTMLDom'

interface Props {
  spec: KuiBadge | ((resource: MultiModalResponse, tab: Tab) => KuiBadge)
}

interface State {
  cache: React.ReactElement
}

/* function isHTMLImage(img: HTMLImageElement | SVGElement): img is HTMLImageElement {
  return (img as HTMLImageElement).alt !== undefined
} */

function oneTimeRender(badgeText: KuiBadge) {
  if (typeof badgeText === 'string') {
    return <React.Fragment>{badgeText}</React.Fragment>
  } else if (badgeText instanceof Element) {
    return <HTMLDom className="badge-as-image" content={badgeText} />
  } else {
    // otherwise, badge is an IBadgeSpec
    const className = (badgeText.css || '') + (badgeText.onclick ? ' clickable' : '')

    if (badgeText.image) {
      /* // badge is an HTMLImageElement
      if (isHTMLImage(badgeText.image)) {
        badgeText.image.alt = badgeText.title
      }

      return (
          <div data-tag="badge" className={className} ref={badgeText.image}>
          </div>
      )
      badge.appendChild()
      badge.classList.add('badge-as-image') */
      return <div />
    } else if (badgeText.fontawesome) {
      // badge is a named fontawesome icon
      return <div />
      /* const awesome = document.createElement('i')
      awesome.className = badgeText.fontawesome
      badge.classList.add('badge-as-fontawesome')
      badge.appendChild(awesome) */
    } else {
      return (
        <div data-tag="badge" className={className} onClick={() => badgeText.onclick()}>
          {badgeText.title}
        </div>
      )
    }
  }
}

export default class Badge extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      cache: oneTimeRender(typeof props.spec === 'function' ? undefined : props.spec)
    }
  }

  public render() {
    return this.state.cache
  }
}
