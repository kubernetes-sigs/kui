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
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent
} from '@patternfly/react-core/dist/esm/components/Accordion'

import { Events, getPrimaryTabId, i18n } from '@kui-shell/core'
import Props from '../model'

import '../../../../../web/scss/components/Accordion/PatternFly.scss'

const strings = i18n('plugin-client-common')

interface State {
  expandedIdx: number
}

export default class PatternFlyAccordion extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      expandedIdx: -1
    }
  }

  private content(idx: number) {
    const isHidden = this.state.expandedIdx !== idx
    return <AccordionContent isHidden={isHidden}>{!isHidden && this.props.content[idx]()}</AccordionContent>
  }

  public render() {
    return (
      <Accordion
        asDefinitionList={false}
        className={`kui--accordion ${this.props.className || ''} ${this.props.isWidthConstrained ? 'flex-fill' : ''}`}
      >
        {this.props.names.map((name, idx) => (
          <div key={idx} className="kui--accordion-item">
            {/*          ^^^^^^^^^ AccordionItem does not accept className */}
            <AccordionItem>
              <AccordionToggle
                id={idx.toString()}
                className="kui--accordion-toggle"
                onClick={() => {
                  this.setState(curState => ({ expandedIdx: curState.expandedIdx !== idx ? idx : -1 }))
                  if (this.props.tab) {
                    Events.eventBus.emitTabLayoutChange(getPrimaryTabId(this.props.tab))
                  }
                }}
                isExpanded={this.state.expandedIdx === idx}
              >
                {typeof name !== 'string'
                  ? name
                  : this.state.expandedIdx !== idx
                  ? strings('Show X', name)
                  : strings('Hide X', name)}
              </AccordionToggle>
              {this.content(idx)}
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    )
  }
}
