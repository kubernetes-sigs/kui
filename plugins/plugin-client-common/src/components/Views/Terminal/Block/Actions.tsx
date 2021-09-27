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
import { Tab, i18n, isOfflineClient, isReadOnlyClient } from '@kui-shell/core'

import { InputOptions } from './Input'
import { SupportedIcon } from '../../../spi/Icons'
import TwoFaceIcon from '../../../spi/Icons/TwoFaceIcon'
import BlockModel, { hasUUID, hasBeenRerun, isBeingRerun, isOutputOnly, isReplay, isRerunable } from './BlockModel'

const strings = i18n('plugin-client-common')

type Props = InputOptions & {
  tab?: Tab

  /** block index */
  idx: number

  // MYAN TODO: instead pass in execUUID, or willRerun and willCopy? to avoid spurious rerenders
  command?: string
  model?: BlockModel
}

function Action(props: {
  onClick: (evt: React.SyntheticEvent) => void
  icon: SupportedIcon
  iconB?: SupportedIcon
  title: string
}) {
  return (
    <TwoFaceIcon
      a={props.icon}
      b={props.iconB || 'Checkmark'}
      delay={4000}
      onClick={props.onClick}
      classNameB="green-text"
      className="kui--block-action"
      title={strings(props.title)}
    />
  )
}

export default class Actions extends React.PureComponent<Props> {
  private readonly _rerunHandler = () => {
    if (hasUUID(this.props.model)) {
      this.props.tab.REPL.reexec(this.props.command, { execUUID: this.props.model.execUUID })
      if (this.props.willUpdateExecutable) {
        this.props.willUpdateExecutable()
      }
    }
  }

  private rerunAction(icon: 'Play' | 'Retry') {
    if (
      hasUUID(this.props.model) &&
      isRerunable(this.props.model) &&
      !isOutputOnly(this.props.model) &&
      this.props.tab &&
      this.props.command
    ) {
      if (isBeingRerun(this.props.model)) {
        return <React.Fragment />
      }
      return (
        <Action
          icon={icon}
          iconB="At"
          onClick={this._rerunHandler}
          title={strings(icon === 'Retry' ? 'Re-execute this command' : 'Execute this command')}
        />
      )
    }
  }

  private copyAction() {
    return (
      this.props.command && (
        <Action
          icon="Copy"
          onClick={() => navigator.clipboard.writeText(this.props.command)}
          title="Copy the command line to the clipboard"
        />
      )
    )
  }

  private removeAction() {
    return (
      this.props.willRemove && (
        <Action
          icon="WindowClose"
          onClick={evt => this.props.willRemove(evt, this.props.idx)}
          title={this.props.isSectionBreak ? 'Remove this section' : 'Remove this block'}
        />
      )
    )
  }

  private sectionAction() {
    return (
      <Action
        icon="Section"
        onClick={() => this.props.willInsertSection(this.props.idx)}
        title="Insert a section break above"
      />
    )
  }

  private readonly _willLinkifyBlock = () => this.props.willLinkifyBlock(this.props.idx)

  private linkAction() {
    return (
      this.props.willLinkifyBlock && (
        <Action icon="Link" onClick={this._willLinkifyBlock} title="Copy the link of this block" />
      )
    )
  }

  /* private screenshotAction() {
    return (
      this.props.willScreenshot &&
      !inBrowser() && (
        <Action icon="Screenshot" onClick={() => this.props.willScreenshot()} title={strings2('Screenshot')} />
      )
    )
  } */

  /* private upwardAction() {
    return (
      this.props.hasBlockBefore &&
      this.props.willMoveUpward && (
        <Action icon="MoveUp" onClick={() => this.props.willMoveUpward()} title="Move this block up" />
      )
    )
  } */

  /* private downwardAction() {
    return (
      this.props.hasBlockAfter &&
      this.props.willMoveDownward && (
        <Action icon="MoveDown" onClick={() => this.props.willMoveDownward()} title="Move this block down" />
      )
    )
  } */

  public render() {
    const readonly = isReplay(this.props.model) && isReadOnlyClient()

    if (isReplay(this.props.model)) {
      if (this.props.isExecutable && !this.props.isSectionBreak) {
        return (
          <div className="kui--block-actions-buttons" data-has-been-rerun={hasBeenRerun(this.props.model) || undefined}>
            {this.rerunAction('Play')}
          </div>
        )
      }
    } else if (!isOfflineClient()) {
      return (
        <div className="kui--block-actions-buttons kui--inverted-color-context">
          <div className="kui-block-actions-others">
            {!readonly && !this.props.isSectionBreak && this.copyAction()}
            {!readonly && this.linkAction()}
            {/* !readonly && !this.props.isSectionBreak && this.sectionAction() */}
            {this.props.isExecutable && !this.props.isSectionBreak && this.rerunAction('Play')}
          </div>
          {!readonly && this.removeAction()}
        </div>
      )
    }

    return <React.Fragment />
  }
}
