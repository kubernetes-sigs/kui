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
import { productName } from '@kui-shell/client/config.d/name.json'

// we use customized tags since the body view doesn't use a React Component lifecycle for now
declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace JSX {
    interface IntrinsicElements {
      tab: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      tabrow: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      tabcolumn: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      repl: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

/**
 * Render the <body> dom
 *
 */
export default function renderBody() {
  return (
    <div className="page">
      <main className="main">
        <div className="left-tab-stripe kui-header">
          <div className="kui-header__title">`${productName}`</div>
          <div className="application-icon" id="about-button"></div>

          <div className="offscreen hidden">
            <div
              className="clickable"
              id="openwhisk-api-host"
              title="Your API host. Click to change to another host."
            ></div>
            <div
              className="clickable"
              id="openwhisk-namespace"
              title="Your currently selected namespace. Click to list your other namespaces."
            ></div>
          </div>

          <div className="left-tab-stripe-buttons">
            <a
              href="#"
              className="kui-tab kui-tab--active left-tab-stripe-button left-tab-stripe-button-selected kui--tab-navigatable"
              data-tab-button-index="1"
              aria-label="tab"
              tabIndex={2}
            >
              <i className="fas fa-square repl-prompt-right-element-icon deemphasize"></i>
              <div className="kui-tab--label left-tab-stripe-button-label">
                &nbsp;
                <span className="kui-tab--label-text"></span>
                <span className="kui-tab--label-index"></span>
              </div>
              <div className="left-tab-stripe-button-closer">
                <svg
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M12 4.7l-.7-.7L8 7.3 4.7 4l-.7.7L7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z"></path>
                </svg>
              </div>
            </a>
          </div>
          <div className="left-tab-stripe-bottom-buttons">
            <a
              href="#"
              className="kui--tab-navigatable kui-new-tab__plus left-tab-stripe-button smaller-button kui-new-tab"
              id="new-tab-button"
              data-balloon-disabled="Open a new tab"
              data-balloon-pos="right"
              data-balloon-length="fit"
              aria-label="Open a new tab"
              tabIndex={2}
            >
              <svg
                className="kui-new-tab__plus"
                focusable="false"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M17 15V7h-2v8H7v2h8v8h2v-8h8v-2h-8z"></path>
              </svg>
            </a>
            <div id="kui--custom-top-tab-stripe-button-container"></div>
          </div>
        </div>

        <div className="tab-container">
          <tab className="visible">
            <tabrow className="kui--rows">
              <tabcolumn className="kui--columns">
                <repl className="repl" id="main-repl">
                  <div className="repl-inner zoomable">
                    <div className="repl-block repl-initial" data-base-class="repl-block" data-input-count="0">
                      <div className="repl-input">
                        <div className="repl-prompt">
                          <span className="repl-prompt-lefty"></span>
                          <span className="repl-context"></span>
                          <span className="repl-selection clickable" title="The current selection"></span>
                          <span className="repl-prompt-righty">
                            {/* a right chevron */}
                            <i>&#x276f;</i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="repl-input-element"
                          aria-label="Command Input"
                          autoFocus
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                        />
                        <span className="repl-prompt-right-elements">
                          <div className="kui--repl-prompt-buttons">
                            <div className="graphical-icon kui--repl-prompt-buttons--screenshot kui--hide-in-webpack">
                              <svg
                                focusable="false"
                                preserveAspectRatio="xMidYMid meet"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 32 32"
                                aria-hidden="true"
                              >
                                <path d="M29 26H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h6.46l1.71-2.55A1 1 0 0 1 12 4h8a1 1 0 0 1 .83.45L22.54 7H29a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1zM4 24h24V9h-6a1 1 0 0 1-.83-.45L19.46 6h-6.92l-1.71 2.55A1 1 0 0 1 10 9H4z"></path>
                                <path d="M16 22a6 6 0 1 1 6-6 6 6 0 0 1-6 6zm0-10a4 4 0 1 0 4 4 4 4 0 0 0-4-4z"></path>
                              </svg>
                            </div>
                          </div>

                          <span className="repl-prompt-timestamp even-smaller-text slightly-deemphasize"></span>
                          <div className="repl-prompt-right-element-status-icon deemphasize">
                            <svg
                              className="kui--icon-error"
                              focusable="false"
                              preserveAspectRatio="xMidYMid meet"
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M10 1c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm3.5 13.5l-8-8 1-1 8 8-1 1z"></path>
                              <path d="M13.5 14.5l-8-8 1-1 8 8-1 1z" data-icon-path="inner-path" opacity="0"></path>
                            </svg>
                            <svg
                              className="kui--icon-ok"
                              focusable="false"
                              preserveAspectRatio="xMidYMid meet"
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M10 1c-4.9 0-9 4.1-9 9s4.1 9 9 9 9-4 9-9-4-9-9-9zM8.7 13.5l-3.2-3.2 1-1 2.2 2.2 4.8-4.8 1 1-5.8 5.8z"></path>
                              <path
                                d="M8.7 13.5l-3.2-3.2 1-1 2.2 2.2 4.8-4.8 1 1-5.8 5.8z"
                                data-icon-path="inner-path"
                                opacity="0"
                              ></path>
                            </svg>
                            <div data-loading className="bx--loading kui--icon-processing">
                              <svg
                                className="bx--loading__svg"
                                focusable="false"
                                preserveAspectRatio="xMidYMid meet"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="-75 -75 150 150"
                                aria-hidden="true"
                              >
                                <circle className="bx--loading__stroke-kui" cx="0" cy="0" r="48.875" />
                                <circle className="bx--loading__stroke" cx="0" cy="0" r="46.875" />
                              </svg>
                            </div>
                          </div>
                        </span>
                      </div>
                      <div className="repl-output">
                        <div className="repl-result"></div>
                        <div className="repl-result-spinner">
                          <div className="repl-result-spinner-inner"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </repl>
              </tabcolumn>
            </tabrow>
          </tab>
        </div>

        <div className="kui--input-stripe">
          <div className="repl-block" data-base-class="repl-block">
            <div className="repl-input">
              <div className="repl-prompt">
                <span className="repl-prompt-lefty"></span>
                <span className="repl-context"></span>
                <span className="repl-selection clickable" title="The current selection"></span>
                <span className="repl-prompt-righty">
                  {/* ChevronRight20 */}
                  <svg
                    focusable="false"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M22 16L12 26l-1.4-1.4 8.6-8.6-8.6-8.6L12 6z"></path>
                  </svg>
                </span>
              </div>
              <input
                type="text"
                aria-label="Command Input"
                tabIndex={1}
                className="repl-input-element kui--tab-navigatable "
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                placeholder="enter your command"
              />
            </div>
          </div>
        </div>

        <div className="kui--status-stripe" id="kui--status-stripe">
          <div className="kui--status-stripe-context"></div>
          <div className="kui--status-stripe-meter"></div>
          <div className="kui--status-stripe-button">
            <div className="kui--status-stripe-element">
              <a href="#" className="kui--tab-navigatable clickable" id="help-button" aria-label="Help" tabIndex={2}>
                <svg
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M30 7H24.9a5 5 0 0 0-9.8 0H2V9H15.1a5 5 0 0 0 9.8 0H30zM20 11a3 3 0 1 1 3-3A3 3 0 0 1 20 11zM2 25H7.1a5 5 0 0 0 9.8 0H30V23H16.9a5 5 0 0 0-9.8 0H2zm7-1a3 3 0 1 1 3 3A3 3 0 0 1 9 24z"></path>
                  <title>Settings adjust</title>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>

      <textarea
        id="invisible-global-input"
        className="not-tabbable"
        tabIndex={-1}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      ></textarea>

      <div id="restart-needed-warning">
        <svg
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm4.3 16.5L6.5 7.7l1.2-1.2 9.8 9.8-1.2 1.2z"></path>
          <path d="M16.3 17.5L6.5 7.7l1.2-1.2 9.8 9.8-1.2 1.2z" data-icon-path="inner-path" opacity="0"></path>
        </svg>
        <div className="restart-needed-warning-content">A severe error occurred during launch</div>
      </div>
    </div>
  )
}
