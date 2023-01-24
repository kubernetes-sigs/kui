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
import { VFile } from 'vfile'
import { cli } from 'madwizard/dist/fe/cli'
import { MadWizardOptions } from 'madwizard'
import { Allotment, AllotmentHandle } from 'allotment'
import { Loading, onCommentaryEdit, offCommentaryEdit } from '@kui-shell/plugin-client-common'

import AskUI, { Ask } from './Ask'
import AskingDone from './AskingDone'
import PlaygroundTerminal, { Command, CommandProps } from './PlaygroundTerminal'

const PlaygroundTextual = React.lazy(() => import('./PlaygroundTextual'))

import '../../web/scss/components/Allotment/_index.scss'

/** @return whether `A` is an array of primitive values */
function isPrimitiveArray(A: any): A is (string | number | boolean)[] {
  return Array.isArray(A) && A.every(_ => typeof _ !== 'object')
}

/** <Playground/> react props */
export type Props = {
  /** Channel name to listen on. This should be matched with a `commentary --send <channel>` */
  channel: string

  /** Kui REPL controller */
  tab: import('@kui-shell/core').Tab
}

/** <Playground/> react state */
type State = CommandProps & {
  /** Error in madwizard? */
  internalError?: Error

  /** Guidebook markdown source */
  input: string

  /** Guidebook markdown original filepath */
  filepath?: string

  /** Current madwizard guide status */
  status?: 'q&a' | 'running' | 'error' | 'success'

  /** If status is q&a, then the current ask model */
  ask?: Ask | null
}

/** Work In Progress */
const fakeFs: import('madwizard').MadWizardOptions['fs'] = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  mkdirp: async (path: string) => {},

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readFile: (filepath: string, cb: (err: NodeJS.ErrnoException | null, data: Buffer) => void) => {
    cb(null, Buffer.from('{}'))
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  writeFileAtomic: (filepath: string, buffer: string | Buffer) => {}
}

export default class Playground extends React.PureComponent<Props, State> {
  private readonly _allotmentRef = React.createRef<AllotmentHandle>()

  /** Allotment split. See this.sizes() */
  private readonly _sizes = {
    initial: [100],
    qa: [80, 20],
    qadone: [40, 60]
  }

  /**
   * Allotment split: no commands? 100% to the Q&A; Q&A done (!ask)?
   * devote more space to the terminal.
   */
  private get sizes() {
    return this.state?.commands?.length === 0
      ? this._sizes.initial
      : !this.state?.ask
      ? this._sizes.qadone
      : this._sizes.qa
  }

  private get REPL() {
    return this.props.tab.REPL
  }

  /** Use madwizard's raw mode to deal with q&a? */
  protected useRawMode(): boolean {
    return true
  }

  /** Callback from madwizard's raw API, which tells us the state of the wizard. */
  private readonly onRaw = (evt: import('madwizard').RawEvent) => {
    if (evt.type === 'ask') {
      // madwizard wants us to present a question
      const prompt = evt.ask
      const ask = {
        title: prompt.name || 'Make a Choice',
        description: prompt.description,
        prompt,
        onChoose: evt.onChoose
      }
      this.setState({ status: 'q&a', ask })
    } else if (evt.type === 'qa-done') {
      // madwizard tell us no more questions are coming
      this.setState({ status: 'running', ask: null })
    } else if (evt.type === 'all-done') {
      // madwizard tells us we're finished
      this.setState({ status: evt.success ? 'success' : 'error', ask: null })
    }
  }

  private clearCommands() {
    this.setState({ commands: [], nExecStarts: 0, nExecCompletions: 0 })
  }

  private readonly _onHome = () => {
    this.clearCommands()
    this.setState({ ask: null, status: undefined })
  }

  private readonly _onCancel = this._onHome
  private readonly _onEdit = async (source: string, filepath?: string) => {
    const [{ loadNotebook }, { inlineSnippets }] = await Promise.all([
      import('@kui-shell/plugin-client-common/notebook'),
      import('madwizard/dist/parser')
    ])

    const fetcher = (filepath: string) => loadNotebook(filepath, { REPL: this.REPL }).then(_ => _.toString())
    const input = await inlineSnippets({
      fetcher,
      madwizardOptions: {}
      // snippetBasePath: this.snippetBasePath
    })(source, '/')

    this.clearCommands()
    this.setState({ input, filepath })
  }

  /** Optional conduit for stdin and stdout */
  protected stdio(): MadWizardOptions['stdio'] {
    return undefined
  }

  /** Hook to allow subclasses to write a REPL response */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected write(response: import('@kui-shell/core').KResponse) {
    /* Intentionally empty */
  }

  /** Hook for subclasses to deal with a fresh start of madwizard */
  protected clear() {
    /* Intentionally empty */
  }

  /** Intercept shell executions */
  private readonly _shell: MadWizardOptions['shell'] = {
    willHandle() {
      // handle every shell command
      return true
    },

    exec: async (cmdline: string | boolean, env: Record<string, string>) => {
      // mark start
      const command: Command = { cmdline: cmdline.toString(), status: 'in-progress', startTime: Date.now(), endTime: 0 }
      this.setState(({ commands = [], nExecStarts = 0 }) => {
        if (!commands.find(_ => _ === command)) {
          commands.push(command)
          return { commands, nExecStarts: nExecStarts + 1 }
        } else {
          return null
        }
      })

      let response: State['commands'][number]['response']
      const status: State['commands'][number]['status'] = 'success'
      try {
        response = await this.REPL.qexec(cmdline.toString(), undefined, undefined, { env })
        this.write(response)
      } catch (err) {
        console.error(err)
        response = err as Error
      }

      command.endTime = Date.now()
      command.response = response
      command.status = status
      this.setState(({ nExecCompletions = 0 }) => ({ nExecCompletions: nExecCompletions + 1 }))

      return typeof response !== 'object' || isPrimitiveArray(response) ? response : 'success'
    }
  }

  public componentDidMount() {
    onCommentaryEdit(this.props.channel, this._onEdit)
  }

  public componentWillUnmount() {
    offCommentaryEdit(this.props.channel, this._onEdit)
  }

  protected get status() {
    return this.state?.status
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state?.input && (prevState?.input !== this.state.input || !this.status)) {
      this.clear()
      cli(
        ['madwizard', 'guide', '-'],
        this.stdio()?.stdout?.write,
        Object.assign(
          {},
          { fs: fakeFs },
          {
            clear: false,
            vfile: new VFile({ cwd: process.cwd(), path: this.state.filepath, value: this.state.input }),
            raw: this.useRawMode() ? this.onRaw : undefined,
            shell: this._shell,
            stdio: this.stdio()
          }
        )
      ).catch(err => {
        console.error('Error from madwizard', err)
        this.setState({ internalError: err })
      })
    }

    if (this.state && prevState && prevState.ask !== this.state.ask) {
      setTimeout(() => this._allotmentRef.current?.resize(this.sizes))
    }
  }

  private guide() {
    if (this.state?.ask && this.state?.status === 'q&a') {
      return <AskUI ask={this.state.ask} home={this._onHome} />
    } else if (!this.state?.status) {
      return <Loading />
    } else if (this.state?.input && this.state?.status !== 'q&a') {
      return <AskingDone status={this.state.status} onClickCancel={this._onCancel} onClickHome={this._onHome} />
    } else {
      return <React.Fragment />
    }
  }

  private terminal() {
    return (
      <PlaygroundTerminal
        tab={this.props.tab}
        commands={this.state?.commands || []}
        nExecStarts={this.state?.nExecStarts || 0}
        nExecCompletions={this.state?.nExecCompletions || 0}
      />
    )
  }

  public render() {
    if (this.state?.internalError) {
      return 'Internal Error'
    }

    return (
      <Allotment vertical defaultSizes={this.sizes} ref={this._allotmentRef}>
        <Allotment.Pane preferredSize={this.sizes[0]}>{this.guide()}</Allotment.Pane>
        {this.state?.commands?.length > 0 && (
          <Allotment.Pane preferredSize={this.sizes[1]}>{this.terminal()}</Allotment.Pane>
        )}
      </Allotment>
    )
  }
}

type Options = import('@kui-shell/core').ParsedOptions & {
  ui?: 'graphics' | 'text'
}

export function controller(args: import('@kui-shell/core').Arguments<Options>) {
  const channel = args.argvNoOptions[2]
  if (!channel) {
    throw new Error('Usage: madwizard playground <channel>')
  }

  if (args.parsedOptions.ui === 'text') {
    return <PlaygroundTextual channel={channel} tab={args.tab} />
  } else {
    return <Playground channel={channel} tab={args.tab} />
  }
}
