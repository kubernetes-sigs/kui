/*
 * Copyright 2022 The Kubernetes Authors
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
import { PassThrough } from 'stream'
import { MadWizardOptions } from 'madwizard'

import Playground from './Playground'
import Terminal, { WatchInit } from './Terminal'

/**
 * A stdin that implements just enough extra to make `enquirer` happy
 * (used by madwizard for its textual UI).
 */
class FakeStdin extends PassThrough {
  public isTTY = true

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public setRawMode() {}
}

/**
 * As with <Playground/> except use the standard madwizard
 * ASCII/textual interface.
 */
export default class PlaygroundTextual extends Playground {
  private readonly _terminalRef = React.createRef<Terminal>()

  private readonly _stdio = {
    stdin: new FakeStdin(),
    stdout: new PassThrough()
  }

  private get stdin() {
    return this._stdio.stdin
  }

  private get stdout() {
    return this._stdio.stdout
  }

  private readonly _watch: WatchInit = () => ({
    on: (eventType: 'data', cb: (data: any) => void) => {
      this.stdout.on('data', cb)
    },

    onInput: (data: string) => {
      this.stdin.write(data)
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unwatch(): void {}
  })

  protected get status() {
    return 'q&a' as const
  }

  /** Hook to allow subclasses to write a REPL response */
  protected write(response: import('@kui-shell/core').KResponse) {
    if (typeof response === 'string') {
      this._terminalRef.current?.write(response)
    }
  }

  /** Hook for subclasses to deal with a fresh start of madwizard */
  protected clear() {
    this._terminalRef.current?.clear()
  }

  private get terminalKey() {
    return this.state?.input || ''
  }

  /** Use madwizard's raw mode to deal with q&a? */
  protected useRawMode(): boolean {
    return false
  }

  /** Optional conduit for stdin and stdout */
  protected stdio(): MadWizardOptions['stdio'] {
    return this._stdio
  }

  public render() {
    if (this.state?.internalError) {
      return 'Internal Error'
    }

    return (
      <div
        className="kui--inverted-color-context flex-fill flex-layout flex-align-stretch"
        style={{ backgroundColor: 'var(--color-sidecar-background-02)' }}
      >
        <Terminal watch={this._watch} searchable={false} key={this.terminalKey} ref={this._terminalRef} />
      </div>
    )
  }
}
