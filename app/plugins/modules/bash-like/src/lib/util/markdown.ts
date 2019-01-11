/*
 * Copyright 2018 IBM Corporation
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

import * as path from 'path'

import { pexec } from '@kui/core/repl'

/**
 * Render a markdown file as HTML
 *
 */
export default (source, fullpath, hljs) => {
  // use marked, but render links specially
  const Marked = require('marked')
  const renderer = new Marked.Renderer()

  renderer.image = (href, title, text) => {
    const parsedUrl = require('url').parse(href)
    const isRemote = parsedUrl.protocol

    if (!isRemote && parsedUrl.pathname) {
      href = href.charAt(0) === '!' ? href : path.join(path.dirname(fullpath), parsedUrl.pathname)
    }

    return `<div style='float:right'><img src='${href}'` + (title ? ' title="' + title + '"' : '') + ` alt="${text}"></img></div>`
  }

  renderer.link = (href, title, text) => {
    const parsedUrl = require('url').parse(href)
    const isRemote = parsedUrl.protocol
    const target = isRemote ? `target='_blank'` : ''
    let dataUrl = ''

    if (!isRemote && parsedUrl.pathname) {
      const url = href.charAt(0) === '!' ? href : path.relative(
        process.cwd(),
        path.normalize(path.join(path.dirname(fullpath), parsedUrl.pathname)))

      href = '#'
      dataUrl = `data-url="${url}"`
    }

    return `<a class='bx--link repl-pexec-link' ${dataUrl} ${target} href='${href}'` + (title ? ' title="' + title + '"' : '') + `}>${text}</a>`
  }
  const marked = _ => Marked(_, { renderer })

  const htmlString = marked(source)

  const wrapper = document.createElement('div')
  wrapper.innerHTML = htmlString

  wrapper.classList.add('page-content') // carbon-components
  wrapper.classList.add('padding-content')
  wrapper.classList.add('scrollable')

  const pexecs = wrapper.querySelectorAll('a.repl-pexec-link')
  for (let idx = 0; idx < pexecs.length; idx++) {
    const exec = pexecs[idx] as HTMLElement
    const url = exec.getAttribute('data-url')
    if (url && url.charAt(0) === '!') {
      exec.onclick = () => pexec(url.substring(1).replace(/(?<!\\)\//g, ' ').replace(/\\\//, '/').replace(/\$\{cwd\}/g, path.dirname(fullpath)))
    } else {
      exec.onclick = () => pexec(`open ${url}`)
    }
  }

  const titles = wrapper.querySelectorAll('h1')
  let title
  if (titles.length === 1) {
    title = titles[0]
    title.parentNode.removeChild(title)
  }

  const codes = wrapper.querySelectorAll('pre > code')
  for (let idx = 0; idx < codes.length; idx++) {
    codes[idx].classList.add('fancy-code')
    setTimeout(() => hljs.highlightBlock(codes[idx]), 0)
  }

  const tables = wrapper.querySelectorAll('table')
  for (let idx = 0; idx < tables.length; idx++) {
    const table = tables[idx]
    table.classList.add('log-lines')

    const rows = table.querySelectorAll('tr')
    for (let idx = 0; idx < rows.length; idx++) {
      rows[idx].classList.add('log-line')

      {
        const cells = rows[idx].querySelectorAll('td')
        for (let jdx = 0; jdx < cells.length; jdx++) {
          cells[jdx].classList.add('log-field')
        }
      }

      {
        const cells = rows[idx].querySelectorAll('th')
        for (let jdx = 0; jdx < cells.length; jdx++) {
          cells[jdx].classList.add('log-field')
          cells[jdx].classList.add('header-cell')
        }
      }
    }
  }

  return { title, body: wrapper }
}
