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

import { inElectron, getCurrentPrompt, injectCSS, KeyCodes } from '@kui-shell/core'

/**
 * Listen for control/command+F
 *
 */
async function registerListener() {
  if (typeof document === 'undefined') return // return if no document

  injectCSS({
    css: require('@kui-shell/plugin-core-support/web/css/text-search.css'),
    key: 'plugin-core-support.kui-shell.org/text-search.css'
  })

  const app = await import('electron')

  // in case the document needs to be restyled as a consequence of the
  // searchBar visibility
  const addVisibilityStatusToDocument = () => document.body.classList.add('search-bar-is-visible')
  const removeVisibilityStatusFromDocument = () => document.body.classList.remove('search-bar-is-visible')

  // insert html
  const searchBar = document.createElement('div')
  searchBar.setAttribute('id', 'search-bar')
  searchBar.style.opacity = '0' // we need the initial opacity:0 due to injectCSS's asynchronicity

  searchBar.innerHTML = `<div id='search-container'><div id='search-input-container'><input id='search-input' type='text' aria-label='Search' placeholder='search term'/><span id='search-found-text' class='no-search-yet'></span></div><span id='search-close-button'><svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M12 4.7l-.7-.7L8 7.3 4.7 4l-.7.7L7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z"></path></svg></span></div>`

  const input = searchBar.querySelector('#search-input') as HTMLInputElement
  input.onfocus = () => input.select()
  input.onclick = (evt: Event) => {
    evt.stopPropagation()
    return false
  }

  const page = document.querySelector('body > .page')
  page.insertBefore(searchBar, page.querySelector('main').nextSibling)

  // now add the logic
  const searchInput = document.getElementById('search-input') as HTMLInputElement
  const searchFoundText = document.getElementById('search-found-text') as HTMLElement

  const stopSearch = (clear: boolean) => {
    app.remote.getCurrentWebContents().stopFindInPage('clearSelection') // clear selections in page
    if (clear) {
      setTimeout(() => {
        getCurrentPrompt().focus()
      }, 300)
    } // focus repl text input
  }

  /** close the search box and tell chrome to terminate the search highlighting stuff */
  const closeSearchBox = () => {
    searchBar.classList.remove('visible')
    removeVisibilityStatusFromDocument()
    searchFoundText.innerHTML = ''
    stopSearch(true)
  }

  const searchCloseButton = document.getElementById('search-close-button')
  searchCloseButton.onclick = closeSearchBox

  const searchText = (value: string) => {
    searchFoundText.classList.remove('no-search-yet')
    app.remote.getCurrentWebContents().findInPage(value) // findInPage handles highlighting matched text in page
  }

  app.remote.getCurrentWebContents().on('found-in-page', (event, result) => {
    if (!result.finalUpdate) {
      return
    }
    const v = searchInput.value // because findInPage also highlights the searchInput text, we clear it first
    searchInput.value = ''
    searchInput.value = v
    searchInput.focus()
    if (result.matches === 1) {
      // there's always going to one matched text from the searchInput
      searchFoundText.innerText = 'no matches'
    } else if (result.matches === 2) {
      searchFoundText.innerText = '1 match'
    } else {
      searchFoundText.innerText = result.matches - 1 + ' matches'
    }
  })

  // we need to override the repl's global onpaste handler; see shell issue #693
  searchInput.onpaste = (evt: Event) => {
    evt.stopPropagation()
  }

  searchInput.addEventListener('click', () => {
    searchInput.focus()
  })
  searchInput.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      // search when Enter is pressed and there is text in searchInput
      if (searchInput.value.length > 0) {
        searchText(searchInput.value)
      } else {
        searchFoundText.innerHTML = ''
        stopSearch(true)
      }
    } else if (e.key === 'Escape') {
      // esc closes the search tab (when search tab is focus)
      e.stopPropagation() // stop event propagating to other dom elements - only affect the search bar
      closeSearchBox()
    }
  })

  document.body.addEventListener('keydown', function(e: KeyboardEvent) {
    if (
      !e.defaultPrevented &&
      e.keyCode === KeyCodes.F &&
      ((e.ctrlKey && process.platform !== 'darwin') || e.metaKey)
    ) {
      // ctrl/cmd-f opens search, unless some interior region prevented default
      searchBar.classList.add('visible')
      addVisibilityStatusToDocument()
      searchBar.style.opacity = '' // see above "we need the initial opacity:0"
      searchFoundText.innerText = 'hit enter to search' // guide the user a bit
      searchFoundText.classList.add('no-search-yet') // to render the hit enter to search text a bit specially
      searchInput.focus() // searchInpus focused when opened
    }
  })

  window.onbeforeunload = () => {
    stopSearch(false) // before reloading, clear all highlighted matched text
    app.remote.getCurrentWebContents().removeAllListeners('found-in-page') // remove listner
  }
}

/**
 * This plugin implements a simple in-page text search, using Chrome's findInPage API.
 *
 */
export default () => {
  if (inElectron()) {
    registerListener()
  }
}
