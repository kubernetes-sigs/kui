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

import * as url from 'url'
import * as path from 'path'

import { REPL, UI } from '@kui-shell/core'
import drilldown from '@kui-shell/core/webapp/picture-in-picture'

declare let hljs

interface Markdown {
  title: HTMLElement
  body: HTMLElement
}

/**
 * Render an <a>
 *
 */
const renderLink = (fullpath: string) => (link: HTMLAnchorElement) => {
  const { href } = link

  // eslint-disable-next-line node/no-deprecated-api
  const parsedUrl = url.parse(href)
  const isRemote = parsedUrl.protocol !== undefined && parsedUrl.protocol !== 'file:'

  if (!isRemote && parsedUrl.pathname) {
    const url =
      href.charAt(0) === '!'
        ? href
        : path.relative(process.cwd(), path.normalize(path.join(path.dirname(fullpath), parsedUrl.pathname)))
    link.href = parsedUrl.hash || '#'
    link.setAttribute('data-url', url)
  }

  // we add the `repl-pexec-link` breadcrumb so that we can fix up
  // the onclick handlers below, in the "hello!" loop; we can't do
  // this here, because we need the doms to be instantiated (not
  // necessarily attached) before we can add the onclick handlers in
  // the form we need
  if (!isRemote) {
    // don't pexec external links
    link.classList.add('repl-pexec-link')
  } else {
    link.target = '_blank'
  }

  link.classList.add('bx--link')
}

/**
 * Wrap a formatted innerHTML
 *
 */
const wrap = (tab: UI.Tab, htmlString: string, fullpath: string): Markdown => {
  const body = document.createElement('div')
  body.classList.add('padding-content')
  body.classList.add('overflow-auto')

  const wrapper = document.createElement('div')
  wrapper.innerHTML = htmlString
  wrapper.classList.add('page-content') // carbon-components
  body.appendChild(wrapper)

  const links = wrapper.querySelectorAll('a')
  const rendLink = renderLink(fullpath)
  for (let idx = 0; idx < links.length; idx++) {
    const link = links[idx] as HTMLAnchorElement
    rendLink(link)
  }

  // hello! here we fix up the onclick handlers; see the
  // "repl-pexec-link" note above
  const pexecs = wrapper.querySelectorAll('a.repl-pexec-link')
  for (let idx = 0; idx < pexecs.length; idx++) {
    const exec = pexecs[idx] as HTMLElement
    const url = exec.getAttribute('data-url')
    if (url && url.charAt(0) === '!') {
      // NOTE: please keep the 'new RegExp' (rather than /.../) form
      // below; some browsers don't (yet?) support <!  hopefully they
      // will all, at some point, and we can restore that commented
      // out part
      exec.onclick = () =>
        REPL.pexec(
          url
            .substring(1) /* .replace(new RegExp('(?<!\\)\/', 'g'), ' ') */
            .replace(/\\\//, '/')
            .replace(/\$\{cwd\}/g, path.dirname(fullpath))
        )
    } else {
      exec.onclick = drilldown(tab, `open ${url}`, undefined, wrapper, path.basename(fullpath))
    }
  }

  const titles = wrapper.querySelectorAll('h1')
  let title: HTMLElement
  if (titles.length === 1) {
    title = titles[0]
    title.parentNode.removeChild(title)
  }

  if (typeof hljs !== 'undefined') {
    const codes = wrapper.querySelectorAll('pre > code')
    for (let idx = 0; idx < codes.length; idx++) {
      codes[idx].classList.add('fancy-code')
      setTimeout(() => hljs.highlightBlock(codes[idx]), 0)
    }
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

  return { title, body }
}

/**
 * Render a markdown file as HTML
 *
 */
const markdownify = async (tab: UI.Tab, source: string, fullpath: string): Promise<Markdown> => {
  // use marked, but render links specially
  const Marked = await import('marked')
  const renderer = new Marked.Renderer()

  const transformHref = (href: string): string => {
    // eslint-disable-next-line node/no-deprecated-api
    const parsedUrl = url.parse(href)
    const isRemote = !!parsedUrl.protocol

    if (!isRemote && parsedUrl.pathname) {
      const newHref = href.charAt(0) === '!' ? href : path.join(path.dirname(fullpath), parsedUrl.pathname)
      return newHref
    } else {
      return href
    }
  }

  /** transform links embedded in raw html in markdown */
  renderer.html = (html: string): string => {
    const tmp = document.createElement('div')
    tmp.style.position = 'absolute'
    tmp.style.top = '-10000'
    tmp.style.left = '-10000'
    tmp.innerHTML = html
    const images = tmp.querySelectorAll('img')
    for (let idx = 0; idx < images.length; idx++) {
      const image = images[idx] as HTMLImageElement
      if (image.src) {
        image.setAttribute('src', transformHref(image.getAttribute('src')))
      }
    }
    return tmp.innerHTML
  }

  /** transform the src attribute of images */
  renderer.image = (href, title, text) => {
    return `<img src='${transformHref(href)}'` + (title ? ' title="' + title + '"' : '') + ` alt="${text}"></img>`
  }

  /** transform the href attribute of links */
  renderer.link = (href: string, title: string, text: string) => {
    const link = document.createElement('a')
    link.href = href
    if (title) link.title = title
    link.innerHTML = text
    renderLink(fullpath)
    return link.outerHTML
  }

  // now we invoke marked with our renderer
  const marked = _ => Marked(_, { renderer })
  const htmlString = marked(source)

  return wrap(tab, htmlString, fullpath)
}

/**
 * Render a markdown file as HTML
 *
 */
export default (tab: UI.Tab, suffix: string, source: string, fullpath: string): Promise<Markdown> => {
  if (suffix === 'md') {
    return markdownify(tab, source, fullpath)
  }
}
