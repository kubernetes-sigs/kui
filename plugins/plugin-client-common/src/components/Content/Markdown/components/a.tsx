/*
 * Copyright 2021 The Kubernetes Authors
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

import React from 'react'
import { dirname, join, relative } from 'path'
import { REPL, maybeKuiLink, pexecInCurrentTab } from '@kui-shell/core'

import { Props } from '../../Markdown'
import { anchorFrom } from './heading'

// const LinkStatus = React.lazy(() => import('../../LinkStatus'))
const Tooltip = React.lazy(() => import('../../../spi/Tooltip'))

export default function a(mdprops: Props, uuid: string, repl: REPL) {
  return (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isKuiCommand = props.href.startsWith('#kuiexec?command=')
    const isLocal = !/^http/i.test(props.href)
    const target = !isLocal ? '_blank' : undefined
    const onClick =
      !isLocal && !isKuiCommand
        ? (evt: React.MouseEvent) => evt.stopPropagation()
        : async (evt: React.MouseEvent) => {
            evt.stopPropagation()
            let file = props.href
            if (isKuiCommand) {
              const raw = props.href.match(/#kuiexec\?command=([^&]+)(&quiet)?/)
              if (raw) {
                const cmdline = decodeURI(raw[1])
                const echo = !raw[2]
                if (repl) {
                  return repl.pexec(cmdline, { echo })
                } else {
                  pexecInCurrentTab(cmdline, undefined, !echo)
                }
              }
            } else if (props.href.charAt(0) === '#') {
              const tab = mdprops.tab
              if (tab) {
                tab.show(`[data-markdown-anchor="${anchorFrom(uuid, props.href.slice(1))}"]`)
              }
            } else if (file) {
              if (mdprops.fullpath) {
                const absoluteHref = join(dirname(mdprops.fullpath), props.href)
                const relativeToCWD = relative(process.cwd() || process.env.PWD, absoluteHref)
                file = relativeToCWD
              }

              return repl.pexec(`open ${repl.encodeComponent(file)}`)
            }
          }

    if (!props.href) {
      return <a className={mdprops.className}>{props.children}</a>
    } else if (!isLocal && mdprops.noExternalLinks) {
      return <span className={mdprops.className}>{props.href}</span>
    } else {
      const isKuiBlockLink = props.href.startsWith('#kui-link-')
      const tip = isKuiCommand
        ? `### Command Execution\n#### ${decodeURI(props.href.slice(props.href.indexOf('=') + 1)).replace(
            '&quiet',
            ''
          )}\n\n\`Link will execute a command\``
        : isKuiBlockLink
        ? `### Block Link\n\n\`Link will scroll the block into view\``
        : props.href.charAt(0) === '#'
        ? `### In-Page Link\n#### ${props.href}\n\n\`Element will scroll into view\``
        : `### External Link\n#### ${props.href}\n\n\`Link will open in a separate window\``

      const kuiLink = maybeKuiLink(props.href)
      /* 
        if (kuiLink) {
          props.children.push(<LinkStatus key="link-status" link={kuiLink} />)
        } */

      return (
        <Tooltip markdown={tip}>
          <a
            title={props.title}
            href={isKuiCommand ? '#' : props.href}
            target={target}
            onClick={onClick}
            className={kuiLink ? 'kui--link-status' : ''}
          >
            {props.children}
          </a>
        </Tooltip>
      )
    }
  }
}
