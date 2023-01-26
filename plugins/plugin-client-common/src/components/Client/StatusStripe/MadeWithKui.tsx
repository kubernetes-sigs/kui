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
import { i18n } from '@kui-shell/core/mdist/api/i18n'

import Icons from '../../spi/Icons'
import TextWithIconWidget, { Options } from './TextWithIconWidget'

type Props = Pick<Options, 'position'>

export default class MadeWithKui extends React.PureComponent<Props> {
  private static readonly strings = i18n('plugin-client-common')

  private readonly popover = {
    bodyContent: MadeWithKui.popoverBody(),
    headerContent: MadeWithKui.popoverHeader()
  }

  private static popoverBody() {
    return <div className="not-very-wide pre-wrap">{MadeWithKui.strings('kui.hello')}</div>
  }

  private static popoverHeader() {
    return (
      <React.Fragment>
        <div>{this.strings('Made with Kui')}</div>
        <div>
          <strong>CLIs with a graphical twist</strong>
        </div>
        <div className="sub-text even-smaller-text">
          <a href="https://github.com/kubernetes-sigs/kui">
            <Icons icon="Github" className="somewhat-larger-text small-right-pad" />
            {MadeWithKui.strings('Visit Kui on Github')}
          </a>
        </div>
      </React.Fragment>
    )
  }

  public render() {
    return (
      <TextWithIconWidget
        text="Made with Kui"
        viewLevel="normal"
        popover={this.popover}
        position={this.props.position || 'top-end'}
      />
    )
  }
}
