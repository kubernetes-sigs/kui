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
import { Event, NativeImage } from 'electron'
import { Events, i18n } from '@kui-shell/core'
import { Alert, Button } from '@kui-shell/plugin-client-common'

import '../../web/scss/components/Screenshot/Screenshot.scss'

const strings = i18n('plugin-client-common', 'screenshot')

type Props = {}

interface State {
  /** if the user has clicked the screenshot button an even or odd number of times */
  isActive: boolean

  /** content of captured image */
  captured?: NativeImage

  /** remember location of user's Desktop */
  desktop?: string
}

/** fill to two digits */
const fill = (n: number) => (n < 10 ? `0${n}` : n)

/** format the date; e.g. 2018-03-27 */
const dateString = (ts: Date) => `${ts.getUTCFullYear()}-${fill(1 + ts.getUTCMonth())}-${fill(ts.getUTCDate())}`

/** format the time; e.g. 11.36.54 AM */
const timeString = (ts: Date) => ts.toLocaleTimeString('en-us').replace(/:/g, '.')

export default class Screenshot extends React.PureComponent<Props, State> {
  private overlayCleaner: () => void
  private cleaners: (() => void)[] = []

  /** @see https://github.com/IBM/kui/issues/4170 */
  private renderOverlayTransparent = false
  private toggleOverlayTransparency: () => void

  public constructor(props: Props) {
    super(props)

    this.state = {
      isActive: false
    }

    Events.eventChannelUnsafe.on('/screenshot/element', (element: HTMLElement) => {
      this.onClickScreenshotRegion(element)
    })
  }

  /** Transition back to a normal state, where are aren't ready to capture a screenshot */
  private deactivate() {
    if (this.cleaners) {
      this.cleaners.forEach(cleaner => cleaner())
      this.cleaners = undefined
    }

    if (this.overlayCleaner) {
      this.overlayCleaner()
      this.overlayCleaner = undefined
    }
  }

  /** User has clicked on a region to be captured */
  private onClickScreenshotRegion(element: Element) {
    if (this.toggleOverlayTransparency) {
      this.renderOverlayTransparent = true
      this.toggleOverlayTransparency()
    }
    setTimeout(async () => {
      try {
        await this.captureRegion(element)
        this.deactivate()
      } finally {
        this.renderOverlayTransparent = false
      }
    }, 120)
  }

  /**
   * This is the actual work to screenshot a given region of the
   * screen defined by the extent of the given dom.
   *
   */
  private captureRegion(element: Element) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      try {
        const { ipcRenderer, nativeImage } = await import('electron')
        const { app, getCurrentWebContents } = await import('@electron/remote')

        const domRect = element.getBoundingClientRect()
        const rect = {
          x: Math.round(domRect.left),
          y: Math.round(domRect.top),
          width: Math.round(domRect.width),
          height: Math.round(domRect.height)
        }

        // capture a screenshot
        const listener = (event: Event, buf: Buffer) => {
          try {
            document.body.classList.remove('no-tooltips-anywhere')

            if (!buf) {
              console.error('Unable to capture screenshot')
            } else {
              this.setState({ captured: nativeImage.createFromBuffer(buf), desktop: app.getPath('desktop') })
            }

            // done!
            resolve()
          } catch (err) {
            reject(err)
          }
        }

        //
        // register our listener, and tell the main process to get
        // started (in that order!)
        //
        ipcRenderer.once('capture-page-to-clipboard-done', listener)
        ipcRenderer.send('capture-page-to-clipboard', getCurrentWebContents().id, rect)
      } catch (err) {
        reject(err)
      }
    })
  }

  /** User has clicked on the Save to Desktop button */
  private async saveToDisk() {
    const { join } = await import('path')
    const { shell } = await import('electron')
    const remote = await import('@electron/remote')

    const ts = new Date()
    const filename = `Screen Shot ${dateString(ts)} ${timeString(ts)}.png`
    const location = join(this.state.desktop, filename)

    remote.require('fs').writeFile(location, this.state.captured.toPNG(), async () => {
      console.log(`screenshot saved to ${location}`)

      try {
        shell.showItemInFolder(location)
      } catch (err) {
        console.error('error opening screenshot file')
      }
    })
  }

  /** Inside of the ToastNotification, render a Save to Desktop button */
  private saveToDiskButton() {
    return (
      <div className="kui--button-set">
        <Button isSmall className="screenshot-save-button" onClick={this.saveToDisk.bind(this)}>
          {strings('Save to desktop')}
        </Button>
        <Button isSmall kind="link" onClick={() => this.setState({ isActive: false, captured: undefined })}>
          {strings('Done')}
        </Button>
      </div>
    )
  }

  private closeNotification() {
    this.setState({ isActive: false, captured: undefined })
  }

  private readonly _onClose = this.closeNotification.bind(this)

  /** Render an Alert to tell the user what we captured */
  private notification() {
    if (this.state && this.state.captured) {
      const timeout = 10 * 1000
      const alert = {
        type: 'success' as const,
        title: strings('Screenshot'),
        body: strings('Successfully captured a screenshot to the clipboard')
      }

      return (
        <Alert id="screenshot-captured" isGlobal timeout={timeout} alert={alert} onCloseButtonClick={this._onClose}>
          <div className="flex-layout top-pad">
            <img src={this.state.captured.toDataURL()} className="screenshot-image" />
          </div>
          <div className="kui--screenshot-captured-bottom-message">{this.saveToDiskButton()}</div>
        </Alert>
      )
    }
  }

  public render() {
    return <React.Fragment>{this.notification()}</React.Fragment>
  }
}
