/*
 * Copyright 2020 The Kubernetes Authors
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
import { ansiToJson, AnserJsonEntry } from 'anser'

const Markdown = React.lazy(() => import('../Markdown'))

interface Props {
  className?: string
  children: string
  onRender?: () => void
  noWrap?: boolean | 'normal'
}

/** Special overrides for CSS classes; otherwise, we will use the raw values from `anser`, e.g. "italic" and "underline" and "strikethrough" */
const decos = {
  dim: 'semi-transparent'
}

function tagOf(entry: AnserJsonEntry) {
  return entry.decorations.find(_ => _ === 'bold') ? 'strong' : 'span'
}

function classOf(entry: AnserJsonEntry) {
  const fg = entry.fg ? entry.fg.replace(/^ansi-(.*)/, 'ansi-$1-fg') : ''
  const bg = entry.bg ? entry.bg.replace(/^ansi-(.*)/, 'ansi-$1-bg') : ''
  const deco = entry.decorations.map(_ => decos[_] || _)

  return `${fg} ${bg} ${deco.join(' ')}`
}

function content(source: string) {
  if (/kuiexec/.test(source)) {
    // special case for embedded links; Markdown trims prefix and suffix whitespace
    const match = source.match(/^(\s?)(\s*)/) // one \n is ok, because <pre> inserts a linebreak for us
    return (
      <React.Fragment>
        {match && match[1] && <pre>{match[1]}</pre>}
        <Markdown className="pre-wrap" source={source} />
      </React.Fragment>
    )
  } else {
    // adds support for the anchor extension that some terminals support
    // https://iterm2.com/documentation-escape-codes.html
    // eslint-disable-next-line no-control-regex
    const m = source.match(/\x1B\]8;;(.+)\u0007(.+)\x1B\]8;;\u0007/)
    if (m) {
      return (
        <span>
          {source.slice(0, m.index)}
          <a href={m[1]}>{m[2]}</a>
          {source.slice(m.index + m[0].length)}
        </span>
      )
    }
    return source
  }
}

export default function Ansi(props: Props) {
  const model = ansiToJson(props.children, { use_classes: true })

  if (props.onRender) {
    props.onRender()
  }

  const style: Record<string, string | number> = { margin: 0 }
  if (!props.noWrap) {
    style.wordBreak = 'break-all'
  } else if (props.noWrap !== 'normal') {
    style.whiteSpace = 'nowrap'
  }

  return (
    <pre className={props.className} style={style}>
      {model.map(
        (_, idx) => _.content && React.createElement(tagOf(_), { key: idx, className: classOf(_) }, content(_.content))
      )}
    </pre>
  )
}
