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
import { Allotment, AllotmentHandle } from 'allotment'

import { Loading } from '@kui-shell/plugin-client-common'

import NoGuidebook from './NoGuidebook'
import ProfileExplorer from './ProfileExplorer'
import AllotmentFillPane from './AllotmentFillPane'
import GuidebookTerminal, { Props as GuidebookProps } from './GuidebookTerminal'

import '../../web/scss/components/Allotment/_index.scss'

export type Props = Pick<GuidebookProps, 'extraEnv'> &
  Pick<GuidebookProps['terminalProps'], 'tab' | 'REPL' | 'onExit' | 'searchable' | 'fontSizeAdjust'> & {
    /** Default guidebook (if not given, we will take the value from the client definition); `null` means do not show anything */
    defaultGuidebook: string | null

    /** Run guidebook in non-interactive mode? */
    defaultNoninteractive?: boolean

    /** Callback when user selects a profile */
    onSelectProfile?(profile: string, profiles?: import('madwizard').Profiles.Profile[]): void

    /** Content to place above the terminal */
    aboveTerminal?: React.ReactNode

    /** Default left-right split */
    lrSplit?: [number, number]
  }

type State = Pick<GuidebookProps, 'noninteractive' | 'ifor' | 'extraEnv'> & {
  /** Number of times we have called this.init() */
  initCount: number

  /** Internal error in rendering */
  error?: boolean

  /** Use this guidebook in the terminal execution */
  guidebook?: string | null

  /** Remember initial values */
  initial: {
    guidebook: Props['defaultGuidebook']

    /** Remember props.extraEnv */
    extraEnv: Props['extraEnv']
  }

  /** Use this profile in the terminal execution */
  selectedProfile?: string

  /** Hide terminal? */
  hideTerminal?: boolean
}

/**
 *  ProfileExplorer |  props.aboveTerminal?
 *  ProfileExplorer | --------------------------------------
 *  ProfileExplorer |        Ask       \
 *  ProfileExplorer |     ----------    -- GuidebookTerminal
 *  ProfileExplorer |      Terminal    /
 */
export default class WorkloadDesigner extends React.PureComponent<Props, State> {
  /** Allotment initial split ... allotments */
  private readonly splits = {
    horizontal: [25, 75],
    vertical1: [50, 50], // no `this.props.aboveTerminal`
    vertical2a: [60, 40], // yes, and show a guidebook
    vertical2b: [80, 20] // yes, and do not show a guidebook
  }

  public constructor(props: Props) {
    super(props)

    const initial = {
      extraEnv: props.extraEnv,
      guidebook: props.defaultGuidebook === null ? null : props.defaultGuidebook
    }
    this.state = {
      initCount: 0,
      initial,
      guidebook: initial.guidebook
    }
  }

  public componentDidMount() {
    this.init()
  }

  /**
   * Initialize for a new guidebook execution. Which guidebook depends
   * on: if as given, then as given in props, then as given in
   * client.
   */
  private async init() {
    const guidebook = this.state.guidebook

    if (guidebook === null) {
      return
    }

    try {
      this.setState(curState => ({
        hideTerminal: false,
        initCount: curState.initCount + 1
      }))
    } catch (error) {
      console.error('Error initializing command line', error)
      this.setState(curState => ({
        error: true,
        initCount: curState.initCount + 1
      }))
    }
  }

  /** Event handler for switching to a different profile */
  private readonly onSelectProfile = (selectedProfile: string, profiles?: import('madwizard').Profiles.Profile[]) => {
    this.setState({ selectedProfile })

    if (this.props.onSelectProfile) {
      this.props.onSelectProfile(selectedProfile, profiles)
    }
  }

  /** Event handler for switching to a different guidebook */
  private readonly onSelectGuidebook = (guidebook: string | null | undefined, ifor = true) =>
    this.setState(curState => ({
      initCount: curState.initCount + 1,
      hideTerminal: false,
      guidebook,
      ifor,
      noninteractive: false
    }))

  public static getDerivedStateFromProps(props: Props, state: State) {
    if (
      (props.defaultGuidebook && props.defaultGuidebook !== state.initial.guidebook) ||
      props.extraEnv !== state.initial.extraEnv
    ) {
      // different guidebook or different env vars to be passed to that guidebook
      return {
        ifor: false,
        extraEnv: props.extraEnv,
        guidebook: props.defaultGuidebook,
        noninteractive: props.defaultNoninteractive
      }
    } else if (props.defaultNoninteractive !== undefined && props.defaultNoninteractive !== state.noninteractive) {
      // different interactivity
      return {
        ifor: false,
        noninteractive: props.defaultNoninteractive
      }
    }

    return state
  }

  public static getDerivedStateFromError() {
    return { error: true }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('catastrophic error', error, errorInfo)
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.guidebook !== this.state.guidebook || prevState.ifor !== this.state.ifor) {
      if (prevState.guidebook === null) {
        this.allotmentRef.current?.reset()
      }
      this.init()
    }
  }

  private readonly _gotit = () => this.setState({ hideTerminal: true })

  private readonly _refresh = () => this.setState({ hideTerminal: false, guidebook: this.props.defaultGuidebook })

  /** Return to top-level guidebook */
  private readonly _home = (noninteractive = false) => {
    const home = this.props.defaultGuidebook
    this.onSelectGuidebook(home, false)
    this.setState(curState => ({ initCount: curState.initCount + 1, noninteractive }))
  }

  private get vertical1() {
    return this.splits.vertical1
  }

  private get vertical2() {
    return !this.state.guidebook ? this.splits.vertical2b : this.splits.vertical2a
  }

  private noGuidebook() {
    return <NoGuidebook refresh={this._refresh} gotit={this._gotit} />
  }

  private readonly allotmentRef = React.createRef<AllotmentHandle>()

  private left() {
    return <ProfileExplorer onSelectProfile={this.onSelectProfile} onSelectGuidebook={this.onSelectGuidebook} />
  }

  private rightTop() {
    return this.props.aboveTerminal
  }

  private rightBottom(selectedProfile: string, guidebook: string) {
    return !this.state.guidebook ? (
      this.noGuidebook()
    ) : (
      <GuidebookTerminal
        key={this.state.initCount + '-' + guidebook}
        initCount={this.state.initCount}
        guidebook={guidebook}
        extraEnv={this.state.extraEnv}
        selectedProfile={selectedProfile}
        terminalProps={this.props}
        home={this._home}
        noninteractive={this.state.noninteractive}
      />
    )
  }

  private right() {
    const { aboveTerminal } = this.props
    const { hideTerminal, selectedProfile, guidebook } = this.state

    if (!selectedProfile || !guidebook) {
      return <Loading />
    } else {
      return (
        <Allotment
          snap
          vertical
          defaultSizes={hideTerminal || !aboveTerminal ? this.vertical1 : this.vertical2}
          ref={this.allotmentRef}
        >
          {aboveTerminal && <AllotmentFillPane>{this.rightTop()}</AllotmentFillPane>}
          {!hideTerminal && <AllotmentFillPane>{this.rightBottom(selectedProfile, guidebook)}</AllotmentFillPane>}
        </Allotment>
      )
    }
  }

  private get defaultSizes() {
    return this.props.lrSplit || this.splits.horizontal
  }

  private get minSize() {
    return this.defaultSizes[0] === 0 ? 0 : 275
  }

  public render() {
    if (this.state.error) {
      return 'Internal Error'
    }

    return (
      <Allotment snap defaultSizes={this.defaultSizes} minSize={this.minSize}>
        <AllotmentFillPane minSize={this.minSize}>{this.left()}</AllotmentFillPane>
        <AllotmentFillPane>{this.right()}</AllotmentFillPane>
      </Allotment>
    )
  }
}
