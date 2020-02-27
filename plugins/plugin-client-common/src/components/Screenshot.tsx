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
import { i18n } from '@kui-shell/core'
import { Camera16 as Camera, CameraAction16 as CameraAction } from '@carbon/icons-react'
import { ToastNotification, Tooltip } from 'carbon-components-react'
import { Event, NativeImage } from 'electron'

import '../../web/css/static/Tooltip.scss'
import '../../web/css/static/Screenshot.scss'

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
  private _onClick: (evt: MouseEvent) => void

  public constructor(props: Props) {
    super(props)

    this.state = {
      isActive: false
    }
  }

  /** Transition back to a normal state, where are aren't ready to capture a screenshot */
  private deactivate() {
    document.body.classList.remove('kui--screenshot-active')

    if (this._onClick) {
      const elements = document.querySelectorAll('.kui--screenshotable')
      for (let idx = 0; idx < elements.length; idx++) {
        elements[idx].removeEventListener('click', this._onClick)
      }
    }
  }

  /** User has clicked on a region to be captured */
  private onScreenshot1(evt: MouseEvent) {
    this.deactivate()

    const dom = evt.currentTarget as Element
    setTimeout(() => this.onScreenshot2(dom), 100)
  }

  /** Follow-up to onScreenshot1 */
  private async onScreenshot2(dom: Element) {
    const { ipcRenderer, nativeImage, remote } = await import('electron')
    const { app } = remote

    const domRect = dom.getBoundingClientRect()
    const rect = {
      x: Math.round(domRect.left),
      y: Math.round(domRect.top),
      width: Math.round(domRect.width),
      height: Math.round(domRect.height)
    }

    // capture a screenshot
    const listener = (event: Event, buf: Buffer) => {
      document.body.classList.remove('no-tooltips-anywhere')

      if (!buf) {
        console.error('Unable to capture screenshot')
      } else {
        this.setState({ captured: nativeImage.createFromBuffer(buf), desktop: app.getPath('desktop') })
      }
    }

    //
    // register our listener, and tell the main process to get
    // started (in that order!)
    //
    ipcRenderer.once('capture-page-to-clipboard-done', listener)
    ipcRenderer.send('capture-page-to-clipboard', remote.getCurrentWebContents().id, rect)
  }

  /** Transition to a state where we are ready to capture a screenshot */
  private activate() {
    document.body.classList.add('kui--screenshot-active')

    this._onClick = this.onScreenshot1.bind(this)

    const elements = document.querySelectorAll('.kui--screenshotable')
    for (let idx = 0; idx < elements.length; idx++) {
      elements[idx].addEventListener('click', this._onClick)
    }
  }

  /** User has clicked on the Save to Desktop button */
  private async saveToDisk() {
    const { join } = await import('path')
    const { remote, shell } = await import('electron')

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
      <a href="#" className="bx--link screenshot-save-button" onClick={this.saveToDisk.bind(this)}>
        {strings('Save to desktop')}
      </a>
    )
  }

  /** Render a ToastNotification to tell the user what we captured */
  private notification() {
    if (this.state && this.state.captured) {
      const timeout = 10 * 1000
      return (
        <ToastNotification
          id="screenshot-captured"
          timeout={timeout}
          kind="success"
          title={strings('Screenshot')}
          subtitle={strings('Successfully captured a screenshot to the clipboard')}
          caption=""
          onCloseButtonClick={() => this.setState({ isActive: false, captured: undefined })}
        >
          <div className="flex-layout">
            <img src={this.state.captured.toDataURL()} className="screenshot-image" />
          </div>
          <div className="kui--screenshot-captured-bottom-message">{this.saveToDiskButton()}</div>
        </ToastNotification>
      )
    }
  }

  /** User has clicked on the screenshot button */
  private onScreenshotButtonClick(evt: MouseEvent) {
    evt.preventDefault()

    this.setState(curState => {
      const isActive = !curState.isActive

      if (!isActive) {
        this.deactivate()
      } else {
        this.activate()
      }

      return { isActive, captured: undefined }
    })
  }

  /** Render the screenshot button */
  private button() {
    const active = this.state.isActive
    const onClick = this.onScreenshotButtonClick.bind(this)

    return (
      <Tooltip
        open={active && !this.state.captured}
        direction="top"
        className="kui--screenshot-tooltip"
        showIcon
        renderIcon={React.forwardRef(function screenshotIcon(props, ref) {
          return (
            <a
              href="#"
              className="kui--tab-navigatable clickable kui--screenshot-button"
              onClick={onClick}
              data-active={active}
            >
              {active ? <CameraAction ref={ref} /> : <Camera ref={ref} />}
            </a>
          )
        })}
      >
        <span className="kui--screenshot-tooltip-text">{strings('Hover over a region to capture')}</span>
      </Tooltip>
    )
  }

  public render() {
    return (
      <React.Fragment>
        {this.notification()}
        {this.button()}
      </React.Fragment>
    )
  }
}
