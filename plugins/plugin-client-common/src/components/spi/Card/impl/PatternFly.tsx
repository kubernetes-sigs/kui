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
import {
  Brand,
  Card,
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  Dropdown,
  DropdownItem,
  KebabToggle
} from '@patternfly/react-core'

import Props from '../model'
import { DropDownAction } from '../../DropDown'
import Markdown from '../../../Content/Markdown'

import '../../../../../web/scss/components/Card/PatternFly.scss'

interface State {
  isOpen: boolean
}

export default class PatternflyCard extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  private renderDropDownItems(actions: DropDownAction[]) {
    return actions.map((item, idx) => (
      <DropdownItem key={idx} component="button" onClick={item.handler} data-mode={item.label}>
        {item.label}
      </DropdownItem>
    ))
  }

  private cardActions() {
    return (
      <CardActions>
        {...this.props.inlineActions}
        {this.props.actions && (
          <Dropdown
            onSelect={() => this.setState({ isOpen: !this.state.isOpen })}
            toggle={
              <KebabToggle
                onToggle={isOpen => {
                  this.setState({ isOpen })
                }}
              />
            }
            isOpen={this.state.isOpen}
            isPlain
            dropdownItems={this.renderDropDownItems(this.props.actions)}
            position={'right'}
          />
        )}
      </CardActions>
    )
  }

  private icon() {
    return <Brand src={this.props.icon} alt="card icon" className="kui--card-icon" />
  }

  /** card actions, icon and custom header node will be situated in Card Head */
  private header() {
    return (
      (this.props.header ||
        this.props.icon ||
        this.props.titleInHeader ||
        this.props.bodyInHeader ||
        this.props.inlineActions ||
        this.props.actions) && (
        <CardHeader className="kui--card-header">
          <CardHeaderMain>{this.props.header || (this.props.icon && this.icon())}</CardHeaderMain>
          {(this.props.inlineActions || this.props.actions) && this.cardActions()}
          <div>
            {this.props.titleInHeader && this.title()}
            {this.props.bodyInHeader && this.body()}
          </div>
        </CardHeader>
      )
    )
  }

  /** card footer */
  private footer() {
    return (
      this.props.footer && (
        <CardFooter
          className={'kui--card-footer' + (this.props.footerClassName ? ` ${this.props.footerClassName}` : '')}
        >
          {this.props.footer}
        </CardFooter>
      )
    )
  }

  private title() {
    if (this.props.title) {
      return <CardTitle className="kui--card-title">{this.props.title}</CardTitle>
    }
  }

  private child(node: React.ReactNode) {
    if (typeof node === 'string') {
      return <Markdown nested source={node} repl={this.props.repl} baseUrl={this.props.baseUrl} />
    } else {
      return node
    }
  }

  private body() {
    return <CardBody className="kui--card-body">{React.Children.map(this.props.children, _ => this.child(_))}</CardBody>
  }

  private dataProps() {
    return Object.keys(this.props)
      .filter(_ => /^data-/.test(_))
      .reduce((M, key) => {
        M[key] = this.props[key]
        return M
      }, {})
  }

  public render() {
    const children = React.Children.toArray(this.props.children).filter(Boolean)
    if (children.length === 1 && typeof children[0] === 'string' && /^(>|```)/.test(children[0])) {
      return this.body()
    }

    const basicClassName = 'kui--card'
    return (
      <Card
        isCompact
        onClick={this.props.onCardClick}
        {...this.dataProps()}
        className={!this.props.className ? basicClassName : `${basicClassName} ${this.props.className}`}
      >
        {React.Children.count(this.props.children) > 0 && (
          <React.Fragment>
            {this.header()}
            {!this.props.titleInHeader && this.title()}
            {!this.props.bodyInHeader && this.body()}
            {this.footer()}
          </React.Fragment>
        )}
      </Card>
    )
  }
}
