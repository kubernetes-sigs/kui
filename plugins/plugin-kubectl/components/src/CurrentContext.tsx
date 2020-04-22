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
import { KubeContext } from '@kui-shell/plugin-kubectl'
import { ViewLevel, TextWithIconWidget } from '@kui-shell/plugin-client-common'

import { eventChannelUnsafe, wireToStandardEvents } from '@kui-shell/core'

interface State {
  text: string
  viewLevel: ViewLevel
}

export default class CurrentContext extends React.PureComponent<{}, State> {
  public constructor(props = {}) {
    super(props)

    this.state = {
      text: '',
      viewLevel: 'hidden'
    }
  }

  /** @return e.g. name/uuid -> name; or name:nnnn -> name */
  private renderName(context: string): string {
    return context.replace(/[/:].*$/, '')
  }

  private async reportCurrentContext() {
    // careful: this impl assumes that current-context is registered
    // *before* current-namespace (in preload.ts)
    eventChannelUnsafe.once('/kubeui/context/current', (context: KubeContext) => {
      try {
        this.setState({
          text: this.renderName(context.spec.cluster),
          viewLevel: 'normal' // only show normally if we succeed; see https://github.com/IBM/kui/issues/3537
        })
      } catch (err) {
        this.setState({
          text: '',
          viewLevel: 'hidden'
        })
      }
    })
  }

  /**
   * Once we have mounted, we immediately check the current branch,
   * and schedule an update based on standard REPL events.
   *
   */
  public componentDidMount() {
    this.reportCurrentContext()
    wireToStandardEvents(this.reportCurrentContext.bind(this))
  }

  public render() {
    // FIXME disable the on-hover effect with the icon
    return (
      <TextWithIconWidget
        text={this.state.text}
        viewLevel={this.state.viewLevel}
        id="'kui--plugin-kubeui--current-context"
        textOnclick="contexts"
      >
        <div className="current-context-button" onClick={() => false}>
          <svg xmlns="http://www.w3.org/2000/svg" role="img" width="16" height="16" viewBox="9.70 9.20 210.86 204.86">
            <path
              d="M134.358 126.46551a3.59023 3.59023 0 00-.855-.065 3.68515 3.68515 0 00-1.425.37 3.725 3.725 0 00-1.803 4.825l-.026.037 8.528 20.603a43.53012 43.53012 0 0017.595-22.102l-21.976-3.714zm-34.194 2.92a3.72 3.72 0 00-3.568-2.894 3.6556 3.6556 0 00-.733.065l-.037-.045-21.785 3.698a43.69506 43.69506 0 0017.54 21.946l8.442-20.399-.066-.08a3.68318 3.68318 0 00.207-2.291zm18.245 8a3.718 3.718 0 00-6.557.008h-.018l-10.713 19.372a43.637 43.637 0 0023.815 1.225q2.197-.5 4.292-1.199l-10.738-19.407zm33.914-45l-16.483 14.753.009.047a3.725 3.725 0 001.46 6.395l.02.089 21.35 6.15a44.278 44.278 0 00-6.356-27.432zM121.7 94.0385a3.725 3.725 0 005.913 2.84l.065.028 18.036-12.789a43.85 43.85 0 00-25.287-12.19l1.253 22.105zm-19.1 2.922a3.72 3.72 0 005.904-2.85l.092-.044 1.253-22.139a44.68209 44.68209 0 00-4.501.775 43.4669 43.4669 0 00-20.937 11.409l18.154 12.869zm-9.678 16.728a3.72 3.72 0 001.462-6.396l.018-.087-16.574-14.825a43.454 43.454 0 00-6.168 27.511l21.245-6.13zm16.098 6.512l6.114 2.94 6.096-2.933 1.514-6.582-4.219-5.276h-6.79l-4.231 5.268z"
              className="cls-1"
            />
            <path
              d="M216.208 133.16651l-17.422-75.675a13.60207 13.60207 0 00-7.293-9.073l-70.521-33.67a13.589 13.589 0 00-11.705 0l-70.507 33.688a13.598 13.598 0 00-7.295 9.072l-17.394 75.673a13.315 13.315 0 00-.004 5.81 13.50607 13.50607 0 00.491 1.718 13.0998 13.0998 0 001.343 2.726c.239.365.491.72.765 1.064l48.804 60.678c.213.264.448.505.681.75a13.42334 13.42334 0 002.574 2.133 13.9237 13.9237 0 003.857 1.677 13.29785 13.29785 0 003.43.473h.759l77.504-.018a12.99345 12.99345 0 001.41-.083 13.46921 13.46921 0 001.989-.378 13.872 13.872 0 001.381-.442c.353-.135.705-.27 1.045-.433a13.94127 13.94127 0 001.479-.822 13.30347 13.30347 0 003.237-2.865l1.488-1.85 47.299-58.84a13.185 13.185 0 002.108-3.785 13.67036 13.67036 0 00.5-1.724 13.28215 13.28215 0 00-.004-5.809zm-73.147 29.432a14.51575 14.51575 0 00.703 1.703 3.314 3.314 0 00-.327 2.49 39.37244 39.37244 0 003.742 6.7 35.06044 35.06044 0 012.263 3.364c.17.315.392.803.553 1.136a4.24 4.24 0 11-7.63 3.607c-.161-.33-.385-.77-.522-1.082a35.27528 35.27528 0 01-1.225-3.868 39.3046 39.3046 0 00-2.896-7.097 3.335 3.335 0 00-2.154-1.307c-.135-.233-.635-1.149-.903-1.623a54.617 54.617 0 01-38.948-.1l-.955 1.731a3.429 3.429 0 00-1.819.886 29.51728 29.51728 0 00-3.268 7.582 34.89931 34.89931 0 01-1.218 3.868c-.135.31-.361.744-.522 1.073v.009l-.007.008a4.238 4.238 0 11-7.619-3.616c.159-.335.372-.82.54-1.135a35.17706 35.17706 0 012.262-3.373 41.22786 41.22786 0 003.82-6.866 4.18792 4.18792 0 00-.376-2.387l.768-1.84a54.922 54.922 0 01-24.338-30.387l-1.839.313a4.68007 4.68007 0 00-2.428-.855 39.52352 39.52352 0 00-7.356 2.165 35.58886 35.58886 0 01-3.787 1.45c-.305.084-.745.168-1.093.244-.028.01-.052.022-.08.029a.60518.60518 0 01-.065.006 4.236 4.236 0 11-1.874-8.224l.061-.015.037-.01c.353-.083.805-.2 1.127-.262a35.27 35.27 0 014.05-.326 39.38835 39.38835 0 007.564-1.242 5.83506 5.83506 0 001.814-1.83l1.767-.516a54.613 54.613 0 018.613-38.073l-1.353-1.206a4.688 4.688 0 00-.848-2.436 39.36558 39.36558 0 00-6.277-4.41 35.2503 35.2503 0 01-3.499-2.046c-.256-.191-.596-.478-.874-.704l-.063-.044a4.473 4.473 0 01-1.038-6.222 4.066 4.066 0 013.363-1.488 5.03 5.03 0 012.942 1.11c.287.225.68.526.935.745a35.25285 35.25285 0 012.78 2.95 39.38314 39.38314 0 005.69 5.142 3.333 3.333 0 002.507.243q.754.55 1.522 1.082a54.28892 54.28892 0 0127.577-15.754 55.05181 55.05181 0 017.63-1.173l.1-1.784a4.6001 4.6001 0 001.37-2.184 39.47551 39.47551 0 00-.47-7.654 35.466 35.466 0 01-.576-4.014c-.011-.307.006-.731.01-1.081 0-.04-.01-.079-.01-.118a4.242 4.242 0 118.441-.004c0 .37.022.861.009 1.2a35.109 35.109 0 01-.579 4.013 39.53346 39.53346 0 00-.478 7.656 3.344 3.344 0 001.379 2.11c.015.305.065 1.323.102 1.884a55.309 55.309 0 0135.032 16.927l1.606-1.147a4.6901 4.6901 0 002.56-.278 39.53152 39.53152 0 005.69-5.148 35.00382 35.00382 0 012.787-2.95c.259-.222.65-.52.936-.746a4.242 4.242 0 115.258 6.598c-.283.229-.657.548-.929.75a35.09523 35.09523 0 01-3.507 2.046 39.49476 39.49476 0 00-6.277 4.41 3.337 3.337 0 00-.792 2.39c-.235.216-1.06.947-1.497 1.343a54.837 54.837 0 018.792 37.983l1.704.496a4.7449 4.7449 0 001.82 1.831 39.46448 39.46448 0 007.568 1.245 35.64041 35.64041 0 014.046.324c.355.065.868.207 1.23.29a4.236 4.236 0 11-1.878 8.223l-.061-.008c-.028-.007-.054-.022-.083-.029-.348-.076-.785-.152-1.09-.232a35.1407 35.1407 0 01-3.785-1.462 39.47672 39.47672 0 00-7.363-2.165 3.337 3.337 0 00-2.362.877q-.9-.171-1.804-.316a54.91994 54.91994 0 01-24.328 30.605z"
              className="cls-1"
            />
          </svg>
        </div>
      </TextWithIconWidget>
    )
  }
}
