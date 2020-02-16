/*
 * Copyright 2017-2020 IBM Corporation
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

import { join } from 'path'

import { inBrowser, Arguments, UsageError, i18n, KeyCodes, Tab, getCurrentPrompt } from '@kui-shell/core'

import usage from './usage'
import Options from './options'
import '../../web/css/static/screenshot.css'

const strings = i18n('plugin-core-support')

/** number of seconds before the screenshot-captured UI disappears automatically */
const SECONDS_TILL_AUTO_CLOSE = 10

/**
 * Round a dom coordinate to make the electron API happy.
 *
 */
const round = Math.round

/**
 * Query selectors for the subcommands that capture the documented screen territory
 *
 */
const selectors = {
  full: 'body', // everything
  default: 'body > .page', // everything but header
  repl: (tab: Tab) => tab.querySelector('.repl'), // entire REPL region
  nth: (tab: Tab, n: number) => tab.querySelector(`.repl .repl-block:nth-child(${n}) .repl-output`),
  'last-full': (tab: Tab) => tab.querySelector('.repl .repl-block:nth-last-child(2)'), // this will include the 'ok' part
  last: (tab: Tab) => tab.querySelector('.repl .repl-block:nth-last-child(2) .repl-output .repl-result') // this will include only the non-ok region
}

/**
 * Sizing elements to fit prior to capturing them
 *
 */
const hideCurrentReplBlock = [
  {
    selector: '#main-repl .repl-block.processing',
    property: 'display',
    value: 'none'
  }
]
const squishers = {
  // screenshot full and repl should remove the last command from the screenshot, so that "screenshot full" doesn't show
  full: hideCurrentReplBlock,
  repl: hideCurrentReplBlock
}
const _squish = (tab: Tab, which: string, selector: string, parsedOptions: Options, op) => {
  let squisher = squishers[which]

  if (typeof squisher === 'function') {
    squisher = squisher(selector)
  }

  // caller specified squish specification on the command line, via
  // --squish-selecteor and --squish-css
  if (!squisher && parsedOptions['squish-selector'] && parsedOptions['squish-css']) {
    if (!Array.isArray(parsedOptions['squish-selector'])) {
      parsedOptions['squish-selector'] = [parsedOptions['squish-selector']]
    }
    const css = parsedOptions['squish-css']
    squisher = parsedOptions['squish-selector'].map(selector => ({
      selector,
      css
    }))
  }

  if (squisher) {
    const impl = (dryRun: boolean) =>
      squisher
        .map(({ selector, property, value, css }) => {
          const element =
            selector === 'tab.visible'
              ? tab
              : typeof selector === 'string'
              ? document.querySelector(selector)
              : selector
          if (element) {
            return op(dryRun, element, property, value, css) // true i.e. dryRun=true
          }
        })
        .find(x => x)

    // do not squish if one of the regions has a non-zero scrollTop;
    // first we have to scan for such a condition
    const doNotSquish = impl(true) // dryRun=true

    if (!doNotSquish) {
      impl(false) // dryRun=false
    }

    return doNotSquish
  }
}
const squish = (tab: Tab, which: string, selector: string, parsedOptions: Options) =>
  _squish(tab, which, selector, parsedOptions, (dryRun: boolean, element: HTMLElement, property, value, css) => {
    if (dryRun) {
      const scrollers = element.querySelectorAll('.overflow-auto')
      for (let idx = 0; idx < scrollers.length; idx++) {
        const scroller = scrollers[idx]
        if (scroller.scrollTop) {
          return true
        }
      }
    } else {
      if (css) element.classList.add(css)
      if (property) element.style[property] = value
    }
  })
const unsquish = (tab: Tab, which: string, selector: string, parsedOptions: Options) =>
  _squish(
    tab,
    which,
    selector,
    parsedOptions,
    (_, element: HTMLElement, property: string, value: string, css: string) => {
      if (css) element.classList.remove(css)
      if (property) element.style[property] = null
    }
  )

/** fill to two digits */
const fill = (n: number) => (n < 10 ? `0${n}` : n)

/** format the date; e.g. 2018-03-27 */
const dateString = (ts: Date) => `${ts.getUTCFullYear()}-${fill(1 + ts.getUTCMonth())}-${fill(ts.getUTCDate())}`

/** format the time; e.g. 11.36.54 AM */
const timeString = (ts: Date) => ts.toLocaleTimeString('en-us').replace(/:/g, '.')

interface SnapDom extends HTMLElement {
  kuiSnapshotTimer?: NodeJS.Timer
}

/** this is the handler body */
export default async ({ tab, argvNoOptions, parsedOptions }: Arguments<Options>) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    if (inBrowser()) {
      const error = new Error(strings('notSupportedInBrowser'))
      error['code'] = 500
      reject(error)
    }

    const options = parsedOptions

    try {
      const { ipcRenderer, nativeImage, remote, shell } = await import('electron')
      const { app } = remote

      // which dom to snap?
      const which = (argvNoOptions[1] && argvNoOptions[1].toLowerCase()) || (options['nth'] && 'nth') || 'default'

      // the selector which will snap the dom
      let selector = which === 'selector' ? argvNoOptions[2] : selectors[which]
      const context = parsedOptions.context === 'tab' ? tab : document

      const N = options['nth']
      if (typeof selector === 'function') {
        selector = selector(tab, N)
      }

      if (which === 'last' && !selector) {
        // sanity check the last option
        return reject(new Error(strings('screenshotREPLError')))
      } else if (!selector) {
        // either we couldn't find the area to
        return reject(new UsageError({ usage }))
      } else if (which === 'nth') {
        if (N === undefined) {
          return reject(new Error('You must provide a numeric value for the "nth" argument'))
        }
      }

      const dom: Element = selector && typeof selector === 'string' ? context.querySelector(selector) : selector
      if (!dom) {
        // either we couldn't find the area to capture :(
        console.error('bad selector', selector)
        return reject(new Error(strings('screenshotInternalError')))
      }

      // remove any hover effects on the capture screenshot button
      const screenshotButtons = tab.querySelectorAll('sidecar .sidecar-screenshot-button')
      for (let idx = 0; idx < screenshotButtons.length; idx++) {
        screenshotButtons[idx].classList.add('force-no-hover')
      }

      // squish down the element to be copied, sizing it to fit
      const doNotSquish = squish(tab, which, selector, parsedOptions)

      // which rectangle to snap; electron's rect schema differs
      // from the underlying dom's schema. sigh
      // https://github.com/electron/electron/blob/master/docs/api/structures/rectangle.md
      // note that all four values must be integral, hence the rounding bits
      const snap = () => {
        const domRect = dom.getBoundingClientRect()
        const rect = {
          x: round(domRect.left) + (options.offset ? parseInt(options.offset, 10) : 0), // see #346 for options.offset
          y: round(domRect.top),
          width: round(domRect.width),
          height: round(domRect.height)
        }

        if (which === 'sidecar') {
          // bump up by 1 pixel, we don't care about the left border
          rect.x += 1
          rect.width -= 1
        }

        // capture a screenshot
        const listener = (event, buf) => {
          document.body.classList.remove('no-tooltips-anywhere')
          const page = document.querySelector('body > .page')

          if (!buf) {
            // some sort of internal error in the main process
            for (let idx = 0; idx < screenshotButtons.length; idx++) {
              screenshotButtons[idx].classList.remove('force-no-hover')
            }
            return reject(new Error('Internal Error'))
          }

          if (document.getElementById('screenshot-captured') !== null) {
            // if a notification widget already exists, remove it
            const prevSnapDom = document.getElementById('screenshot-captured') as SnapDom
            if (prevSnapDom.kuiSnapshotTimer) {
              clearInterval(prevSnapDom.kuiSnapshotTimer)
            }
            prevSnapDom.remove()
          }

          const img = nativeImage.createFromBuffer(buf)
          const snapDom: SnapDom = document.createElement('div')

          const snapImg = document.createElement('img')
          const message = document.createElement('div')
          const messageContent = document.createElement('div')
          const snapContent = document.createElement('div')
          const close = document.createElement('div')

          page.appendChild(snapDom)

          // when we're done, re-enable the things we messed with and hide the snapDom
          const finish = () => {
            snapDom.classList.add('screenshot-hide')
            setTimeout(() => snapDom.classList.remove('screenshot-active'), 0)

            setTimeout(() => {
              page.removeChild(snapDom)
              getCurrentPrompt(tab).readOnly = false
              getCurrentPrompt(tab).focus()
            }, 1000) // match go-away-able transition-duration; see ui.css
          }

          const windowSize = document.body.getBoundingClientRect()
          const imgSize = img.getSize()

          // pixel dimensions of the screenshot popup
          let widthPx = windowSize.width * 0.65
          let heightPx = (imgSize.height / imgSize.width) * widthPx
          if (heightPx > windowSize.height) {
            // oops, too tall
            heightPx = windowSize.height * 0.65
            widthPx = (imgSize.width / imgSize.height) * heightPx
          }

          // viewport width dimensions of the screenshot popup
          // const widthVw = `${(75 * widthPx) / windowSize.width}vw`
          // const heightVw = `${(75 * heightPx) / windowSize.width}vw`

          snapDom.appendChild(snapImg)
          snapDom.appendChild(snapContent)
          snapDom.appendChild(close)

          snapDom.setAttribute('data-notification', '')
          snapDom.setAttribute('role', 'polite')
          snapDom.setAttribute('data-notification', '')
          snapDom.classList.add('bx--toast-notification')
          snapDom.classList.add('bx--toast-notification--warning')
          snapDom.classList.add('zoomable')

          snapDom.id = 'screenshot-captured'
          snapDom.classList.add('screenshot-hide')
          snapDom.classList.add('screenshot-active')
          setTimeout(() => snapDom.classList.remove('screenshot-hide'), 0)

          // save screenshot to disk
          const saveButton = document.createElement('div')

          const ts = new Date()
          const filename = `Screen Shot ${dateString(ts)} ${timeString(ts)}.png`
          const location = join(app.getPath('desktop'), filename)

          saveButton.className = 'screenshot-save-button'
          saveButton.innerHTML = strings('Save to desktop')

          saveButton.onclick = () => {
            remote.require('fs').writeFile(location, img.toPNG(), async () => {
              console.log(`screenshot saved to ${location}`)

              try {
                shell.showItemInFolder(location)
              } catch (err) {
                console.error('error opening screenshot file')
              }
            })
          }

          // the image; chrome bug: if we use width and height,
          // there is a white border that is not defeatible; if
          // we trick chrome into thinking the image has no
          // width and height (but fake it with padding), the
          // border goes away: https://stackoverflow.com/a/14709695

          snapImg.setAttribute('src', img.toDataURL())
          snapImg.classList.add('screenshot-image')

          snapContent.classList.add('screenshot-content')
          message.classList.add('screenshot-success-message')
          message.innerText = strings('Screenshot copied to clipboard')
          messageContent.classList.add('screenshot-message')
          messageContent.appendChild(message)
          const closeMessage = document.createElement('div')
          closeMessage.classList.add('screenshot-closing-message')
          closeMessage.setAttribute('id', 'close-msg')
          messageContent.appendChild(closeMessage)
          snapContent.append(messageContent)
          snapContent.appendChild(saveButton)

          const closeButton = document.createElement('div')

          close.classList.add('screenshot-close')
          close.appendChild(closeButton)

          closeButton.innerHTML =
            '<div style="display: flex;justify-content:flex-end;align-items:baseline"><svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform; cursor:pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6L24 9.4z" stroke="white" fill="white"></path></svg></div>'
          closeButton.classList.add('screenshot-close-botton')

          // go away after SECONDS_TILL_AUTO_CLOSE seconds
          let timeleft = SECONDS_TILL_AUTO_CLOSE
          snapDom.kuiSnapshotTimer = setInterval(() => {
            if (timeleft <= 0) {
              clearInterval(snapDom.kuiSnapshotTimer)
              finish()
            }

            ;(snapDom.querySelector('.screenshot-closing-message') as HTMLElement).innerText = strings(
              'Closing in {0} seconds',
              timeleft.toString()
            )

            timeleft -= 1
          }, 1000)

          // to capture the Escape key event
          const hiddenInput = document.createElement('input')
          hiddenInput.classList.add('hidden')
          hiddenInput.classList.add('grab-focus') // so that the repl doesn't grab it back on `listen`
          snapDom.appendChild(hiddenInput)
          hiddenInput.focus()

          // we'll do a finish when the user hits escape
          hiddenInput.addEventListener(
            'keyup',
            (evt: KeyboardEvent) => {
              if (evt.keyCode === KeyCodes.ESCAPE) {
                evt.preventDefault()
                finish()
              }
            },
            { capture: true, once: true }
          )

          // also, if the user clicks on the close button, finish up
          closeButton.onclick = finish

          // we can no unregister our listener; this is
          // important as subsequent listener registrations
          // stack, rather than replace
          ipcRenderer.removeListener('capture-page-to-clipboard-done', listener)

          // undo any squishing
          if (!doNotSquish) {
            unsquish(tab, which, selector, parsedOptions)
          }

          for (let idx = 0; idx < screenshotButtons.length; idx++) {
            screenshotButtons[idx].classList.remove('force-no-hover')
          }
          resolve(strings('Successfully captured a screenshot to the clipboard'))
        }

        //
        // register our listener, and tell the main process to get
        // started (in that order!)
        //
        ipcRenderer.on('capture-page-to-clipboard-done', listener)
        ipcRenderer.send('capture-page-to-clipboard', remote.getCurrentWebContents().id, rect)
      }

      document.body.classList.add('no-tooltips-anywhere')
      setTimeout(snap, 100)
    } catch (e) {
      console.error(e)
      reject(new Error('Internal Error'))
    }
  })
