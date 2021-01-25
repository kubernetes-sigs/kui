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

import React from 'react'
import prettyPrintDuration from 'pretty-ms'

import {
  i18n,
  Arguments,
  BadgeRegistration,
  Button,
  ExecOptions,
  ModeRegistration,
  REPL,
  Streamable,
  Tab,
  ToolbarProps,
  ToolbarText
} from '@kui-shell/core'
import { Icons, Loading } from '@kui-shell/plugin-client-common'

import cssForValue from '../css-for-value'
import { getCommandFromArgs } from '../../util/util'
import TrafficLight from '../../model/traffic-light'
import { HYSTERESIS, Job, StreamingStatus } from './ContainerCommon'
import { doExecWithPty } from '../../../controller/kubectl/exec'
import { KubeOptions, withKubeconfigFrom } from '../../../controller/kubectl/options'
import { Event, isEvent, KubeResource, isCrudableKubeResource, isNamespaced } from '../../model/resource'

import '../../../../web/scss/components/Events.scss'

const strings = i18n('plugin-kubectl')
const strings2 = i18n('plugin-kubectl', 'events')

/** Interval in milliseconds with which we update the "ago" timestamps */
const UPDATE_INTERVAL = 60 * 1000

interface Props {
  args: Arguments<KubeOptions>
  repl: REPL
  resource: KubeResource
  toolbarController: ToolbarProps
}

type ObservedEvent = Event & {
  lastTimestamp: number
}

interface State {
  /** The "now" used to compute the "ago" properties */
  now: number

  /** Timer used to update now */
  timer: ReturnType<typeof setInterval>

  /** The underlying PTY streaming job */
  job: Job

  /** Are we streaming? */
  isLive: boolean

  /** It may take a second or two between establishing the PTY stream
   * and receiving the first log record. */
  waitingForHysteresis: boolean

  /** List of events */
  events: ObservedEvent[]
}

/** Parse a stream of JSON-formatted bits into a stream of ObservedEvent */
function StreamingJSONParser(cb: (event: ObservedEvent) => void) {
  let escaping = false
  let inQuotes = false
  let depth = 0
  let bundle = ''
  return (_: Streamable) => {
    const data = _.toString()
    for (let idx = 0; idx < data.length; idx++) {
      const ch = data.charAt(idx)
      const escaped = escaping
      escaping = false
      bundle += ch
      if (!inQuotes && ch === '{') {
        depth++
      }
      if (!escaped && ch === '"') {
        inQuotes = !inQuotes
      }
      if (!escaped && ch === '\\') {
        escaping = true
      }
      if (!inQuotes && ch === '}') {
        if (--depth === 0) {
          const event = JSON.parse(bundle) as Event

          // parse the lastTimestamp ahead of time
          const oevent = Object.assign(event, {
            lastTimestamp: new Date(event.lastTimestamp).getTime()
          })
          cb(oevent)

          bundle = ''
        }
      }
    }
  }
}

class Events extends React.PureComponent<Props, State> {
  private static readonly format = '-o json'

  public constructor(props: Props) {
    super(props)

    this.state = {
      now: this.now(),
      timer: setInterval(this.updateNow.bind(this), UPDATE_INTERVAL),
      job: undefined,
      isLive: false,
      waitingForHysteresis: false,
      events: []
    }

    this.initStream()
  }

  private now() {
    return new Date().getTime()
  }

  private updateNow() {
    this.setState({ now: this.now() })
  }

  public componentWillUnmount() {
    clearInterval(this.state.timer)
    if (this.state.job) {
      this.state.job.abort()
    }
  }

  /** Toolbar text to display */
  protected toolbarText(status: StreamingStatus): ToolbarText {
    return {
      type: status === 'Live' ? 'info' : status === 'Paused' ? 'warning' : 'error',
      text: strings2(
        status === 'Live'
          ? 'Events are live streaming'
          : status === 'Paused'
          ? 'Event streaming is paused'
          : status === 'Stopped'
          ? 'Event streaming stopped'
          : 'Event streaming stopped abnormally'
      )
    }
  }

  protected toolbarButtonsForError(status: StreamingStatus): Button[] {
    if (status === 'Error') {
      return [
        {
          mode: 'retry-streaming',
          label: strings('Retry'),
          kind: 'view',
          icon: <Icons icon="Retry" onClick={() => this.initStream()} />,
          command: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
        } as Button
      ]
    } else {
      return []
    }
  }

  protected toolbarButtonsForStreaming(status: StreamingStatus): Button[] {
    const isLive = status === 'Live'
    return [
      {
        mode: 'toggle-streaming',
        label: isLive ? strings('Pause Streaming') : strings('Resume Streaming'),
        kind: 'view',
        icon: <Icons icon={isLive ? 'Pause' : 'Play'} />,
        command: this.toggleStreaming.bind(this, !isLive)
      } as Button
    ]
  }

  /** Toolbar buttons to display */
  protected toolbarButtons(status: StreamingStatus) {
    return this.toolbarButtonsForError(status).concat(this.toolbarButtonsForStreaming(status))
  }

  /** Update Toolbar text and Toolbar buttons. */
  protected updateToolbar(status: StreamingStatus) {
    this.props.toolbarController.willUpdateToolbar(
      this.toolbarText(status),
      this.toolbarButtons(status),
      true // replace default buttons
    )
  }

  /** Update our State to reflect the new ObservedEvents. */
  private observe(newlyObservedEvents: ObservedEvent[]) {
    this.setState(curState => ({
      events: curState.events.concat(newlyObservedEvents).sort((a, b) => b.lastTimestamp - a.lastTimestamp)
    }))
  }

  /** The part of toggleStreaming that deals with PTY flow control. */
  private doFlowControl(desiredStateIsLive = this.state.isLive) {
    if (this.state.job) {
      if (desiredStateIsLive) {
        this.state.job.xon()
      } else {
        this.state.job.xoff()
      }
    }
  }

  /** Handler for Pause/Play. */
  private toggleStreaming(desiredState: boolean) {
    if (this.state.isLive !== desiredState) {
      this.doFlowControl(desiredState)
      this.updateToolbar(desiredState ? 'Live' : 'Paused')
      this.setState(curState => {
        if (curState.isLive !== desiredState) {
          return { isLive: desiredState }
        }
      })
    }
  }

  /** Initialize the event stream */
  private initStream() {
    const args = this.command({
      /** prior to PTY initialization, we provide a streaming consumer */
      onInit: () => {
        // this is our streaming consumer
        return StreamingJSONParser(event => this.observe([event]))
      },

      onReady: (job: Job) => {
        this.updateToolbar('Live')
        setTimeout(() => this.setState({ waitingForHysteresis: false }), HYSTERESIS)
        this.setState({ isLive: true, job, waitingForHysteresis: true })
      },

      onExit: (exitCode: number) => {
        console.error('event stream exited with code', exitCode)
        this.updateToolbar(exitCode === 0 ? 'Stopped' : 'Error')
      }
    })

    doExecWithPty(args)
  }

  private command(execOptions: ExecOptions): Arguments<KubeOptions> {
    const { args, resource } = this.props

    // limit events to those intersecting with the giving resource
    const filter = `involvedObject.apiVersion=${resource.apiVersion},involvedObject.kind=${resource.kind},involvedObject.name=${resource.metadata.name},involvedObject.namespace=${resource.metadata.namespace}`

    // this is the command that will fetch the events table; we specify a watchable table
    // remove the OBJECT column, since we're filtering down to one object
    const argv = [
      getCommandFromArgs(args),
      'get',
      'events',
      '--field-selector',
      filter,
      '-n',
      resource.metadata.namespace,
      Events.format,
      '--watch'
    ]
    const argvNoOptions = argv.filter(_ => _[0] !== '-')
    const parsedOptions = {
      n: resource.metadata.namespace,
      'field-selector': filter,
      watch: true
    }
    const command = withKubeconfigFrom(args, argv.join(' '))

    return Object.assign({}, this.props.args, {
      REPL: this.props.repl,
      command,
      argv,
      argvNoOptions,
      parsedOptions,
      execOptions
    })
  }

  /** Render the events in the case we not yet finished initializing. */
  private notDoneLoading() {
    return <Loading />
  }

  /** Render the events in the case we no logs to show. */
  private nothingToShow() {
    return <div className="kui--hero-text">{strings2('No events')}</div>
  }

  public render() {
    if (!this.state.job || this.state.waitingForHysteresis) {
      return this.notDoneLoading()
    } else if (!this.state.events || this.state.events.length === 0) {
      return this.nothingToShow()
    }

    return (
      <div className="scrollable scrollable-auto">
        <div className="kui--table-like-wrapper kui--kubectl-events-grid">
          {this.state.events.map((event, idx) => (
            <EventUI {...event} now={this.state.now} key={idx} {...this.props} />
          ))}
        </div>
      </div>
    )
  }
}

/** Render one event */
class EventUI extends React.PureComponent<ObservedEvent & { now: number; repl: REPL; args: Arguments<KubeOptions> }> {
  private age() {
    const { lastTimestamp, now } = this.props
    const delta = lastTimestamp - now

    let ago = '0'
    try {
      ago = strings2('ago', prettyPrintDuration(Math.max(1, -delta), { compact: true }))
    } catch (err) {
      console.error('error parsing lastTimestamp', lastTimestamp, err)
    }

    return <span className="kui--kubectl-event-record-age smaller-text sub-text no-wrap left-pad">{ago}</span>
  }

  private reason() {
    const { reason } = this.props
    return (
      <div data-tag="badge">
        <span title={reason} data-tag="badge-circle" className={cssForValue[reason]} />
        <span className="kui--cell-inner-text smaller-text">{reason}</span>
      </div>
    )
  }

  private message() {
    return <pre className="kui--kubectl-event-record-message pre-wrap break-all">{this.props.message}</pre>
  }

  private source() {
    const {
      args,
      repl,
      source: { component, host }
    } = this.props
    const onClick = () => {
      const cmd = `${getCommandFromArgs(args)} get node ${host} -o yaml`

      repl.pexec(cmd)
    }

    return (
      <span className="smaller-text">
        {strings2('Generated by component X on host', component)}
        <a className="small-left-pad" href="#" onClick={onClick}>
          {host}
        </a>
      </span>
    )
  }

  private clickForDetails() {
    const onClick = () => {
      const {
        args,
        repl,
        metadata: { name, namespace }
      } = this.props
      const cmd = `${getCommandFromArgs(args)} get event ${name} -n ${namespace} -o yaml`

      repl.pexec(cmd)
    }

    return (
      <a className="smaller-text" href="#" onClick={onClick}>
        {strings2('Details')}
      </a>
    )
  }

  public render() {
    return (
      <div className="kui--kubectl-event-record smaller-text">
        <div className="flex-layout">
          <span className="flex-fill">{this.reason()}</span>
          {this.age()}
        </div>
        {this.source()}

        <div className="flex-layout full-height flex-align-stretch top-pad">
          <div className="flex-layout">
            <span className="flex-fill">{this.message()}</span>
            {this.clickForDetails()}
          </div>
        </div>
      </div>
    )
  }
}

/**
 * Extract the events
 *
 */
async function content({ REPL }: Tab, resource: KubeResource, args: Arguments<KubeOptions>) {
  return {
    react: function LogsProvider(toolbarController: ToolbarProps) {
      return <Events repl={REPL} resource={resource} args={args} toolbarController={toolbarController} />
    }
  }
}

/**
 * @return whether the given resource might possibly have events;
 * since Events never have Events, we can exclude those always
 *
 */
function hasEvents(resource: KubeResource): boolean {
  return isCrudableKubeResource(resource) && !isEvent(resource) && isNamespaced(resource)
}

/**
 * Add a Events mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const eventsMode: ModeRegistration<KubeResource> = {
  when: hasEvents,
  mode: {
    mode: 'events',
    label: strings('events'),
    content
  }
}

export const eventsBadge: BadgeRegistration<Event> = {
  when: isEvent,
  badge: (event: Event) => {
    const cssFromReason = cssForValue[event.reason]
    return {
      title: cssFromReason ? event.reason : event.type,
      css:
        cssFromReason ||
        (event.type === 'Error' ? TrafficLight.Red : event.type === 'Warning' ? TrafficLight.Yellow : undefined)
    }
  }
}
