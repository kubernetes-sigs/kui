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
import { dirname } from 'path'
import { cli } from 'madwizard/dist/fe/cli'
import { MadWizardOptions } from 'madwizard'
import { Allotment, AllotmentHandle } from 'allotment'

import type { Arguments, KResponse, ParsedOptions, Tab } from '@kui-shell/core'

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

type Channel = string
type MarkdownSource = {
  /** Guidebook markdown source */
  input: string

  /** Guidebook markdown original filepath */
  filepath?: string
}

/** <Playground/> react props */
export type Props = {
  /** Channel name to listen on. This should be matched with a `commentary --send <channel>` */
  source: Channel | MarkdownSource

  /** Kui REPL controller */
  tab: Tab

  /** Guidebook store root */
  store?: string
}

function isChannel(source: Props['source']): source is Channel {
  return typeof source === 'string'
}

/** <Playground/> react state */
type State = CommandProps &
  MarkdownSource & {
    /** Error in madwizard? */
    internalError?: Error

    /** Current madwizard guide status */
    status?: 'q&a' | 'running' | 'error' | 'success'

    /** If status is q&a, then the current ask model */
    ask?: Ask | null
  }

async function loadNotebookFromSource(source: string, REPL: Tab['REPL'], snippetBasePath?: string) {
  const [{ loadNotebook }, { inlineSnippets }] = await Promise.all([
    import('@kui-shell/plugin-client-common/notebook'),
    import('madwizard/dist/parser')
  ])

  const fetcher = (filepath: string) =>
    loadNotebook(filepath, { REPL })
      .catch(err =>
        loadNotebook(filepath + '.md', { REPL })
          .catch(() => loadNotebook(filepath + '/index.md', { REPL }))
          .catch(() => {
            throw err
          })
      )
      .then(_ => _.toString())

  return inlineSnippets({
    fetcher,
    snippetBasePath,
    madwizardOptions: {}
  })(source, '/')
}

async function loadNotebookFromFilepath(filepath: string, REPL: Tab['REPL']) {
  const { loadNotebook } = await import('@kui-shell/plugin-client-common/notebook')
  return loadNotebookFromSource((await loadNotebook(filepath, { REPL })).toString(), REPL, dirname(filepath))
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

  public constructor(props: Props) {
    super(props)

    if (!isChannel(props.source)) {
      this.state = {
        input: props.source.input,
        filepath: props.source.filepath,
        nExecStarts: 0,
        nExecCompletions: 0,
        commands: []
      }
    }
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
    const input = await loadNotebookFromSource(source, this.REPL)
    this.clearCommands()
    this.setState({ input, filepath })
  }

  /** Optional conduit for stdin and stdout */
  protected stdio(): MadWizardOptions['stdio'] {
    return undefined
  }

  /** Hook to allow subclasses to write a REPL response */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected write(response: KResponse) {
    /* Intentionally empty */
  }

  /** Hook for subclasses to deal with a fresh start of madwizard */
  protected clear() {
    /* Intentionally empty */
  }

  /** Intercept shell executions */
  private readonly _shell: MadWizardOptions['shell'] = {
    willHandle(cmdline: string | boolean) {
      // handle every shell command
      return cmdline !== 'pip-install'
    },

    exec: async (cmdline: string | boolean, env: Record<string, string>, isInternal: boolean) => {
      // mark start
      const command: Command = { cmdline: cmdline.toString(), status: 'in-progress', startTime: Date.now(), endTime: 0 }

      if (!isInternal) {
        this.setState(({ commands = [], nExecStarts = 0 }) => {
          if (!commands.find(_ => _ === command)) {
            commands.push(command)
            return { commands, nExecStarts: nExecStarts + 1 }
          } else {
            return null
          }
        })
      }

      let response: State['commands'][number]['response']
      const status: State['commands'][number]['status'] = 'success'
      try {
        response = await this.REPL.qexec(cmdline.toString(), undefined, undefined, { env })
        this.write(response)
      } catch (err) {
        console.error(err)
        response = err as Error
      }

      if (!isInternal) {
        command.endTime = Date.now()
        command.response = response
        command.status = status
        this.setState(({ nExecCompletions = 0 }) => ({ nExecCompletions: nExecCompletions + 1 }))
      }

      return typeof response !== 'object' || isPrimitiveArray(response) ? response : 'success'
    }
  }

  public componentDidMount() {
    if (isChannel(this.props.source)) {
      // we don't have the markdown source yet, so listen on the given
      // channel for that source
      onCommentaryEdit(this.props.source, this._onEdit)
    } else {
      // great, we were given the source on props, so we can start the
      // play right away
      this.playGuidebook(this.props.source.input, this.props.source.filepath)
    }
  }

  public componentWillUnmount() {
    if (isChannel(this.props.source)) {
      offCommentaryEdit(this.props.source, this._onEdit)
    }
  }

  protected get status() {
    return this.state?.status
  }

  private playGuidebook(input: string, filepath?: string) {
    this.clear()
    cli(
      ['madwizard', 'guide', '-'],
      this.stdio()?.stdout?.write,
      Object.assign(
        {},
        { fs: fakeFs },
        {
          clear: false,
          vfile: new VFile({ cwd: process.cwd(), path: filepath, value: input }),
          raw: this.useRawMode() ? this.onRaw : undefined,
          shell: this._shell,
          stdio: this.stdio(),
          store: this.props.store || process.env.GUIDEBOOK_STORE
        }
      )
    ).catch(err => {
      console.error('Error from madwizard', err)
      this.setState({ internalError: err })
    })
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state?.input && (prevState?.input !== this.state.input || !this.status)) {
      this.playGuidebook(this.state.input, this.state.filepath)
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

type Options = ParsedOptions &
  Pick<Props, 'store'> & {
    /** Present choices graphically or textually? [default: 'graphics'] */
    ui?: 'graphics' | 'text'
  }

/** Open a Playground that listens for source on a given named `channel` */
export function listenOnChannel(args: Arguments<Options>) {
  const channel = args.argvNoOptions[2]
  if (!channel) {
    throw new Error('Usage: madwizard playground <channel>')
  }

  if (args.parsedOptions.ui === 'text') {
    return <PlaygroundTextual source={channel} tab={args.tab} store={args.parsedOptions.store} />
  } else {
    return <Playground source={channel} tab={args.tab} store={args.parsedOptions.store} />
  }
}

/** Open a Playground for the source in the given `filepath` */
export async function readFromFile(args: Arguments<Options>) {
  const filepath = args.argvNoOptions[3]
  if (!filepath) {
    throw new Error('Usage: madwizard playground file <filepath>')
  }

  const input = await loadNotebookFromFilepath(filepath, args.REPL)

  const source: MarkdownSource = { input, filepath }

  if (args.parsedOptions.ui === 'text') {
    return <PlaygroundTextual source={source} tab={args.tab} store={args.parsedOptions.store} />
  } else {
    return <Playground source={source} tab={args.tab} store={args.parsedOptions.store} />
  }
}
