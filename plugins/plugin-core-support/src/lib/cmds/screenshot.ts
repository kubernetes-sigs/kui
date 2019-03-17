/*
 * Copyright 2017 IBM Corporation
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

import { dirname, join } from 'path'

import UsageError from '@kui-shell/core/core/usage-error'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import * as cli from '@kui-shell/core/webapp/cli'
import { keys } from '@kui-shell/core/webapp/keys'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import sidecarSelector from '@kui-shell/core/webapp/views/sidecar-selector'
import { isVisible as isSidecarVisible } from '@kui-shell/core/webapp/views/sidecar'

/**
 * Usage message
 *
 */
const usage = {
  strict: 'screenshot',
  command: 'screenshot',
  title: 'Capture screenshot',
  header: 'Capture a screenshot, optionally specifying which region of the window to capture.',
  example: 'screenshot [which]',
  detailedExample: [
    { command: 'screenshot sidecar', docs: 'capture the sidecar contents' },
    { command: 'screenshot repl', docs: 'capture the REPL contents' },
    { command: 'screenshot last', docs: 'capture the REPL output of the last command' },
    { command: 'screenshot full', docs: 'capture the entire page, including header' },
    { command: 'screenshot', docs: 'capture the entire page, except for header' }
  ],
  optional: [
    { name: 'which',
      positional: true,
      docs: 'the region to capture',
      allowed: ['sidecar', 'repl', 'full', 'last', 'nth']
    },
    { name: '--nth',
      docs: 'the nth region to capture',
      numeric: true
    }
  ]
}

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
  'default': 'body > .page', // everything but header
  sidecar: sidecarSelector(), // entire sidecar region
  repl: 'tab.visible .repl', // entire REPL region
  nth: n => `tab.visible .repl .repl-block:nth-child(${n}) .repl-output`, // this will include only the non-ok region
  'last-full': 'tab.visible .repl .repl-block:nth-last-child(2)', // this will include the 'ok' part
  last: 'tab.visible .repl .repl-block:nth-last-child(2) .repl-output' // this will include only the non-ok region
}

/**
 * Sizing elements to fit prior to capturing them
 *
 */
const hideCurrentReplBlock = [{ selector: '#main-repl .repl-block.processing', property: 'display', value: 'none' }]
const squishRepl = [
  { selector: 'tab.visible .repl .repl-block:nth-last-child(2)', css: 'screenshot-squish' },
  { selector: 'tab.visible .repl .repl-block:nth-last-child(2) .repl-input', property: 'display', value: 'none' }
]
const squishers = {
  sidecar: [
    { selector: 'body.subwindow', css: 'screenshot-squish' },
    { selector: 'body.subwindow .page', css: 'screenshot-squish' },
    { selector: 'body.subwindow .main', css: 'screenshot-squish' },
    { selector: 'tab.visible', css: 'screenshot-squish' },
    { selector: sidecarSelector(), property: 'height', value: 'initial' },
    { selector: sidecarSelector('.custom-content'), property: 'flex', value: 'initial' },
    { selector: sidecarSelector('.sidecar-content'), property: 'flex', value: 'initial' },
    { selector: '#wskflowDiv', property: 'height', value: 'auto' }
  ],

  // screenshot full and repl should remove the last command from the screenshot, so that "screenshot full" doesn't show
  full: hideCurrentReplBlock,
  repl: hideCurrentReplBlock,

  nth: squishRepl,
  'last-full': squishRepl,
  last: squishRepl
}
const _squish = (which, op) => {
  const squisher = squishers[which]
  if (squisher) {
    squisher.forEach(({ selector, property, value, css }) => {
      const element = document.querySelector(selector)
      if (element) {
        op(element, property, value, css)
      }
    })
  }
}
const squish = which => _squish(which, (element, property, value, css) => { if (css) element.classList.add(css); if (property) element.style[property] = value })
const unsquish = which => _squish(which, (element, property, value, css) => { if (css) element.classList.remove(css); if (property) element.style[property] = null })

/** fill to two digits */
const fill = n => n < 10 ? `0${n}` : n

/** format the date; e.g. 2018-03-27 */
const dateString = ts => `${ts.getUTCFullYear()}-${fill(1 + ts.getUTCMonth())}-${fill(ts.getUTCDate())}`

/** format the time; e.g. 11.36.54 AM */
const timeString = ts => ts.toLocaleTimeString('en-us').replace(/:/g, '.')

/** this is the handler body */
export default async (commandTree, prequire) => {
  commandTree.listen('/screenshot', ({ argvNoOptions, parsedOptions: options }) => new Promise((resolve, reject) => {
    if (inBrowser()) {
      const error = new Error('Command not yet supported when running in a browser')
      error['code'] = 500
      reject(error)
    }

    try {
      const root = dirname(require.resolve('@kui-shell/plugin-core-support/package.json'))
      injectCSS(join(root, 'web/css/screenshot.css'))

      const { ipcRenderer, nativeImage, remote } = require('electron')
      const { app } = remote

      // which dom to snap?
      const which = (argvNoOptions[1] && argvNoOptions[1].toLowerCase())
        || (options['nth'] && 'nth')
        || 'default'

      // the selector which will snap the dom
      let selector = selectors[which]

      if (!selector) {
        // either we couldn't find the area to
        return reject(new UsageError(usage))
      } else if (which === 'sidecar' && !isSidecarVisible()) {
        // sanity check the sidecar option
        return reject(new Error('You requested to screenshot the sidecar, but it is not currently open'))
      } else if (which === 'last' && !document.querySelector(selectors.last)) {
        // sanity check the last option
        console.error('nope')
        return reject(new Error('You requested to screenshot the last REPL output, but this is the first command'))
      } else if (which === 'nth') {
        const N = options['nth']
        if (N === undefined) {
          return reject(new Error('You must provide a numeric value for the "nth" argument'))
        } else {
          selector = selector(N)
        }
      }

      const dom = selector && document.querySelector(selector)
      if (!dom) {
        // either we couldn't find the area to capture :(
        console.error('bad selector', selector)
        return reject(new Error('Internal Error: could not identify the screen region to capture'))
      }

      // remove any hover effects on the capture screenshot button
      const screenshotButton = document.querySelector(sidecarSelector('.sidecar-screenshot-button'))
      screenshotButton.classList.add('force-no-hover')

      // squish down the element to be copied, sizing it to fit
      squish(which)

      // which rectangle to snap; electron's rect schema differs
      // from the underlying dom's schema. sigh
      // https://github.com/electron/electron/blob/master/docs/api/structures/rectangle.md
      // note that all four values must be integral, hence the rounding bits
      const snap = () => {
        const domRect = dom.getBoundingClientRect()
        const rect = { x: round(domRect.left) + (options.offset || 0), // see #346 for options.offset
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
          if (!buf) {
            // some sort of internal error in the main process
            screenshotButton.classList.remove('force-no-hover')
            return reject(new Error('Internal Error'))
          }

          const img = nativeImage.createFromBuffer(buf)
          const snapDom = document.createElement('div')
          // const snapHeader = document.createElement('header')
          const snapFooter = document.createElement('div')
          const snapImg = document.createElement('img')
          const message = document.createElement('div')
          const check = document.createElement('div')

          const windowSize = document.body.getBoundingClientRect()
          const imgSize = img.getSize()

          let widthPx = windowSize.width * 0.75
          let heightPx = imgSize.height / imgSize.width * widthPx
          if (heightPx > windowSize.height) {
            // oops, too tall
            heightPx = windowSize.height * 0.75
            widthPx = imgSize.width / imgSize.height * heightPx
          }
          console.error('!!!!!!!', windowSize, imgSize, widthPx, heightPx)

          document.body.appendChild(snapDom)
          // snapDom.appendChild(snapHeader)
          snapDom.appendChild(snapImg)
          snapDom.appendChild(snapFooter)
          snapDom.appendChild(check)
          snapDom.appendChild(message)

          snapDom.id = 'screenshot-captured'
          snapDom.classList.add('go-away-able')
          snapDom.classList.add('go-away') // initially hidden
          setTimeout(() => snapDom.classList.remove('go-away'), 0)
          snapDom.style.background = 'rgba(0,0,0,0.75)'
          snapDom.style.position = 'absolute'
          snapDom.style.width = '100%'
          snapDom.style.height = '100%'
          snapDom.style.top = '0'
          snapDom.style.left = '0'
          snapDom.style.display = 'flex'
          snapDom.style.flexDirection = 'column'
          snapDom.style.justifyContent = 'center'
          snapDom.style.alignItems = 'center'
          snapDom.style.zIndex = '5'

          /* snapHeader.classList.add('header')
          snapHeader.style.paddingLeft = '1.5em'
          snapHeader.style.flexBasis = '2.75em'
          snapHeader.style.width = width
          snapHeader.style.maxWidth = '100%'
          snapHeader.style.border = 'none'
          const headerTitle = document.createElement('div')
          headerTitle.classList.add('application-name')
          headerTitle.innerText = 'Screenshot'
          snapHeader.appendChild(headerTitle) */

          snapFooter.classList.add('sidecar-bottom-stripe')
          snapFooter.style.width = `${widthPx}px`
          snapFooter.style.justifyContent = 'flex-end'

          // save screenshot to disk
          const saveButton = document.createElement('div')
          const ts = new Date()
          const filename = `Screen Shot ${dateString(ts)} ${timeString(ts)}.png`
          const location = require('path').join(app.getPath('desktop'), filename)
          saveButton.innerText = 'Save to Desktop'
          saveButton.className = 'sidecar-bottom-stripe-button sidecar-bottom-stripe-save'
          saveButton.onclick = () => {
            remote.require('fs').writeFile(location,
              img.toPNG(), () => {
                console.log(`screenshot saved to ${location}`)
              })
          }

          snapFooter.appendChild(saveButton)

          // close popup button
          const closeButton = document.createElement('div')
          closeButton.innerText = 'Done'
          closeButton.className = 'sidecar-bottom-stripe-button sidecar-bottom-stripe-close'
          snapFooter.appendChild(closeButton)

          // the image; chrome bug: if we use width and height,
          // there is a white border that is not defeatible; if
          // we trick chrome into thinking the image has no
          // width and height (but fake it with padding), the
          // border goes away: https://stackoverflow.com/a/14709695
          snapImg.style.background = `url(${img.resize({ width: widthPx, height: heightPx }).toDataURL()}) no-repeat center bottom/contain`
          snapImg.style.backgroundColor = 'var(--color-ui-01)'
          snapImg.style.maxWidth = '100%'
          snapImg.style.minHeight = '300px' // we need some min space to fit the green check and Screenshot copied to clipboard
          snapImg.style.maxHeight = '100%'
          snapImg.style.filter = 'blur(1px) grayscale(0.5) contrast(0.4)'
          snapImg.style.width = `${widthPx}px`
          snapImg.style.height = `${heightPx}px`
          // snapImg.style.padding = `${heightPx / 1.5}px ${widthPx / 1.5}px`

          message.style.position = 'absolute'
          message.style.fontSize = '2.5em'
          message.style.fontWeight = '600'
          message.style.top = 'calc(50% + 1.5em)'
          message.innerText = 'Screenshot copied to clipboard'

          check.classList.add('go-away-button')
          check.style.position = 'absolute'
          check.innerText = '\u2714'
          check.style.color = 'var(--color-ok)'
          check.style.fontSize = '7em'

          // temporarily disable the repl
          cli.getCurrentPrompt().readOnly = true

          // temporarily override escape
          const oldHandler = document.onkeyup

          // when we're done, re-enable the things we messed with and hide the snapDom
          const finish = () => {
            document.onkeyup = oldHandler
            cli.getCurrentPrompt().readOnly = false
            snapDom.classList.add('go-away')
            setTimeout(() => document.body.removeChild(snapDom), 1000) // match go-away-able transition-duration; see ui.css
          }

          // we'll do a finish when the user hits escape
          document.onkeyup = evt => {
            if (evt.keyCode === keys.ESCAPE) {
              finish()
            }
          }

          // also, if the user clicks on the close button, finish up
          closeButton.onclick = finish

          // we can no unregister our listener; this is
          // important as subsequent listener registrations
          // stack, rather than replace
          ipcRenderer.removeListener('capture-page-to-clipboard-done', listener)

          // undo any squishing
          unsquish(which)

          screenshotButton.classList.remove('force-no-hover')
          resolve('Successfully captured a screenshot to the clipboard')
        }

        //
        // register our listener, and tell the main process to get
        // started (in that order!)
        //
        ipcRenderer.on('capture-page-to-clipboard-done', listener)
        ipcRenderer.send('capture-page-to-clipboard',
          remote.getCurrentWebContents().id,
          rect)
      }

      setTimeout(snap, 100)
    } catch (e) {
      console.error(e)
      reject(new Error('Internal Error'))
    }
  }), { usage, noAuthOk: true, requiresLocal: true }) // currently screenshot does not support browser mode
}
