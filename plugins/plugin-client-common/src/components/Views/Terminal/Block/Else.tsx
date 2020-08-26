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

import { eventBus, CommandCompleteEvent, i18n, isResourceWithMetadata } from '@kui-shell/core'

const strings = i18n('plugin-client-common')

type Props = {
  completeEvent: CommandCompleteEvent
}

/**
 * Some responses are not presented in `ScrollableTerminal`,
 * e.g. sidecar-destined responses such as `NavResponse` and `MultiModalResponse`,
 * Else, in `Terminal/Block`, signifies where these responses are presented,
 * and provides ways to re-interactive with these responses if they're gone
 *
 */
export default class Else extends React.PureComponent<Props> {
  public render() {
    const response = this.props.completeEvent.response

    const drilldownText = isResourceWithMetadata(response)
      ? `${strings('Drilling down to show the')} ${response.kind}`
      : strings('Drilling down to show the')

    const drilldownLink = (
      <a href="#" onClick={() => eventBus.emitCommandComplete(this.props.completeEvent)}>
        {isResourceWithMetadata(response) ? response.metadata.name : 'result'}
      </a>
    )

    return (
      <span className="kui--repl-result-else">
        {drilldownText} {drilldownLink}
      </span>
    )
  }
}
