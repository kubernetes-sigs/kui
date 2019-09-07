/*
 * Copyright 2017-19 IBM Corporation
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

const assert = require('assert')
const timeout = Math.max(5000, process.env.TIMEOUT || 60000)
exports.waitTimeout = timeout - 5000
const constants = {
  API_HOST: process.env.API_HOST,
  // CLI_PLACEHOLDER: process.env.CLI_PLACEHOLDER || 'enter your command',
  OK: process.env.OK || /ok/,
  JUST_OK: process.env.OK || 'ok'
}

const keys = {
  BACKSPACE: '\uE003',
  TAB: '\uE004',
  ENTER: '\uE007',
  DELETE: '\uE017',
  CONTROL: '\uE009',
  ESCAPE: '\uE00C'
}

exports.keys = keys

exports.aliases = {
  activation: ['activation', '$'],
  list: ['list'],
  remove: ['delete']
}

const selectors = {
  APIHOST: '#openwhisk-api-host',
  NAMESPACE: '#openwhisk-namespace',
  CURRENT_TAB: 'tab.visible',
  TAB_N: N => `tab:nth-child(${N})`,
  TAB_SELECTED_N: N => `${selectors.TAB_N(N)}.visible`
}
selectors.SIDECAR_BASE = `${selectors.CURRENT_TAB} sidecar`
selectors.SIDECAR_FULLSCREEN = `${selectors.CURRENT_TAB}.sidecar-full-screen sidecar.visible`
selectors.PROMPT_BLOCK = `${selectors.CURRENT_TAB} .repl .repl-block`
selectors.OOPS = `${selectors.CURRENT_TAB} .repl .repl-block .oops`
selectors.SIDECAR = `${selectors.SIDECAR_BASE}.visible`
selectors.SIDECAR_WITH_FAILURE = `${selectors.SIDECAR_BASE}.visible.activation-success-false`
selectors.SIDECAR_HIDDEN = `${selectors.SIDECAR_BASE}:not(.visible)`
selectors.SIDECAR_FULLY_HIDDEN = `${selectors.SIDECAR_BASE}:not(.visible):not(.minimized)`
selectors.SIDECAR_ACTIVATION_TITLE = `${selectors.SIDECAR} .sidecar-header-name .activation-id`
selectors.SIDECAR_TITLE = `${selectors.SIDECAR} .sidecar-header-name-content .entity-name`
selectors.SIDECAR_PACKAGE_NAME_TITLE = `${selectors.SIDECAR} .sidecar-bottom-stripe .package-prefix`
selectors.SIDECAR_CONTENT = `${selectors.SIDECAR} .sidecar-content`
selectors.SIDECAR_WEB_ACTION_URL = `${selectors.SIDECAR} .sidecar-header .entity-web-export-url.has-url`
selectors.SIDECAR_ACTION_SOURCE = `${selectors.SIDECAR_CONTENT} .action-content .action-source`
selectors.SIDECAR_PACKAGE_PARAMETERS = `${selectors.SIDECAR_CONTENT} .package-content .package-source`
selectors.SIDECAR_ACTIVATION_RESULT = `${selectors.SIDECAR_CONTENT} .activation-result`
selectors.SIDECAR_ACTIVATION_ID = `${selectors.SIDECAR} .sidecar-header .activation-id`
selectors.SIDECAR_RULE_CANVAS = `${selectors.SIDECAR} .rule-components`
selectors.SIDECAR_RULE_CANVAS_NODES = `${selectors.SIDECAR_RULE_CANVAS} .sequence-component`
selectors.SIDECAR_SEQUENCE_CANVAS = `${selectors.SIDECAR} #wskflowSVG`
selectors.SIDECAR_SEQUENCE_CANVAS_NODES = `${selectors.SIDECAR_SEQUENCE_CANVAS} .node.action`
selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N = N => `${selectors.SIDECAR_SEQUENCE_CANVAS_NODES}[data-task-index="${N}"]`
selectors.SIDECAR_LIMIT = type => `${selectors.SIDECAR} .sidecar-header .limits .limit[data-limit-type="${type}"]`
selectors.SIDECAR_BADGES = `${selectors.SIDECAR} .sidecar-header .badges`
selectors.SIDECAR_CUSTOM_CONTENT = `${selectors.SIDECAR} .custom-content`
selectors.SIDECAR_MODE_BUTTONS = `${selectors.SIDECAR} .sidecar-bottom-stripe-mode-bits .sidecar-bottom-stripe-button` // all mode buttons in the bottom stripe
selectors.SIDECAR_MODE_BUTTON = mode => `${selectors.SIDECAR_MODE_BUTTONS}[data-mode="${mode}"]` // specific mode button in the bottom stripe
selectors.SIDECAR_MODE_BUTTON_SELECTED = mode => `${selectors.SIDECAR_MODE_BUTTON(mode)}.bx--tabs__nav-item--selected`
selectors.SIDECAR_BACK_BUTTON = `${selectors.SIDECAR} .sidecar-bottom-stripe-back-button` // back button in the bottom stripe
selectors.SIDECAR_MAXIMIZE_BUTTON = `${selectors.SIDECAR} .toggle-sidecar-maximization-button` // maximize button in the bottom stripe
selectors.SIDECAR_CLOSE_BUTTON = `${selectors.SIDECAR} .sidecar-bottom-stripe-close` // close button in the bottom stripe
selectors.SIDECAR_FULLY_CLOSE_BUTTON = `${selectors.SIDECAR} .sidecar-bottom-stripe-quit` // fully close button in the bottom stripe
selectors.PROCESSING_PROMPT_BLOCK = `${selectors.PROMPT_BLOCK}.repl-active`
selectors.CURRENT_PROMPT_BLOCK = `${selectors.PROMPT_BLOCK}.repl-active`
selectors.PROMPT_BLOCK_N = N => `${selectors.PROMPT_BLOCK}[data-input-count="${N}"]`
selectors.PROCESSING_N = N => `${selectors.PROMPT_BLOCK_N(N)}.processing`
selectors.CURRENT_PROMPT = `${selectors.CURRENT_PROMPT_BLOCK} input`
selectors.PROMPT_N = N => `${selectors.PROMPT_BLOCK_N(N)} input`
selectors.OUTPUT_N = N => `${selectors.PROMPT_BLOCK_N(N)} .repl-result`
selectors.PROMPT_BLOCK_LAST = `${selectors.PROMPT_BLOCK}:nth-last-child(2)`
selectors.PROMPT_BLOCK_FINAL = `${selectors.PROMPT_BLOCK}:nth-last-child(1)`
selectors.PROMPT_FINAL = `${selectors.PROMPT_BLOCK_FINAL} input`
selectors.OUTPUT_LAST = `${selectors.PROMPT_BLOCK_LAST} .repl-result`
selectors.LIST_RESULTS_N = N => `${selectors.PROMPT_BLOCK_N(N)} .repl-result .entity:not(.header-row)`
selectors.LIST_RESULTS_BY_NAME_N = N => `${selectors.LIST_RESULTS_N(N)} .entity-name`
selectors.LIST_RESULT_BY_N_FOR_NAME = (N, name) => `${selectors.LIST_RESULTS_N(N)}[data-name="${name}"]`
selectors.TABLE_CELL = (rowKey, cellKey) =>
  `.entity:not(.header-row)[data-name="${rowKey}"] .cell-inner[data-key="${cellKey}"]`
selectors.BY_NAME = name => `.entity:not(.header-row)[data-name="${name}"]`
selectors.LIST_RESULT_BY_N_AND_NAME = (N, name) => `${selectors.LIST_RESULT_BY_N_FOR_NAME(N, name)} .entity-name`
selectors.OK_N = N => `${selectors.PROMPT_BLOCK_N(N)} .repl-output .ok`
selectors.xtermRows = N => `${selectors.PROMPT_BLOCK_N(N)} .xterm-container .xterm-rows`
exports.selectors = selectors

const expectOK = (appAndCount, opt) => {
  // appAndCount.count is the prompt index of this command... so +1 gives us the next prompt, whose existence signals that this command has finished
  const app = appAndCount.app
  const N = appAndCount.count + 1

  return (
    app.client
      .waitForVisible(selectors.PROMPT_N(N), timeout - 5000) // wait for the next prompt to appear
      .then(() => app.client.getAttribute(selectors.PROMPT_N(N), 'placeholder')) // it should have a placeholder text
      // .then(attr => assert.strictEqual(attr, constants.CLI_PLACEHOLDER)) //      ... verify that
      .then(() => app.client.getValue(selectors.PROMPT_N(N), timeout)) // it should have an empty value
      .then(promptValue => {
        if ((!opt || !opt.nonBlankPromptOk) && promptValue.length !== 0) {
          console.error(`Expected prompt value to be empty: ${promptValue}`)
        }
        return promptValue
      })
      .then(promptValue => {
        if (!opt || !opt.nonBlankPromptOk) assert.strictEqual(promptValue.length, 0)
      }) //      ... verify that
      .then(() => (opt && opt.expectError ? false : app.client.getHTML(selectors.OK_N(N - 1), timeout))) // get the "ok" part of the current command
      .then(ok => (opt && opt.expectError ? false : assert.ok(constants.OK.test(ok)))) // make sure it says "ok" !
      .then(() => {
        // validate any expected list entry
        if (typeof opt === 'string') {
          // expect exactly one entry
          return app.client.getText(selectors.LIST_RESULTS_BY_NAME_N(N - 1)).then(name => assert.strictEqual(name, opt))
        } else if (Array.isArray(opt)) {
          // expect several entries, of which opt is one
          return app.client
            .getText(selectors.LIST_RESULTS_BY_NAME_N(N - 1))
            .then(name => (!Array.isArray(name) ? [name] : name))
            .then(name => assert.ok(name !== opt[0] && name.find(_ => _.indexOf(opt[0]) >= 0)))
        } else if (opt && (opt.selector || opt.expect)) {
          // more custom, look for expect text under given selector
          const selector = `${selectors.OUTPUT_N(N - 1)} ${opt.selector || ''}`
          if (opt.elements) {
            return app.client.elements(selector)
          } else {
            return app.client.getText(selector).then(txt => {
              if (opt.exact) assert.strictEqual(txt, opt.expect)
              else if (opt.expect) {
                if (txt.indexOf(opt.expect) < 0) {
                  console.error(
                    `Expected string not found expected=${opt.expect} idx=${txt.indexOf(opt.expect)} actual=${txt}`
                  )
                  assert.ok(txt.indexOf(opt.expect) >= 0)
                }
              }

              return opt.passthrough ? N - 1 : selector // so that the caller can inspect the selector in more detail
            })
          }
        } else if (opt === true) {
          // ensure that there is nothing other than "ok"
          return app.client.waitUntil(async () => {
            const txt = await app.client.getText(selectors.OUTPUT_N(N - 1))
            return txt.length === 0 || txt === constants.JUST_OK
          })
        } else {
          // nothing to validate with the "console" results of the command
          // return the index of the last executed command
          return N - 1
        }
      })
      .then(res => (opt && (opt.selector || opt.passthrough) ? res : app)) // return res rather than app, if requested
  )
}

/** grab focus for the repl */
const grabFocus = async app => {
  return app.client
    .click(selectors.CURRENT_PROMPT_BLOCK)
    .then(() => app.client.waitForEnabled(selectors.CURRENT_PROMPT_BLOCK))
    .catch(err => {
      console.error(err)
      // probably ok, we are doing this is just in case it helps
    })
}

exports.cli = {
  /**
   * Execute a CLI command, and return the data-input-count of that command
   *
   */
  do: async (cmd, app, noNewline = false, noCopyPaste = false, noFocus = false) => {
    return app.client
      .waitForExist(selectors.CURRENT_PROMPT_BLOCK, timeout - 5000)
      .then(() => {
        if (!noFocus) return grabFocus(app)
      })
      .then(() => app.client.getAttribute(selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
      .then(async count => {
        if (!noCopyPaste && cmd.length > 1) {
          // use the clipboard for a fast path
          await app.client.execute(
            text => navigator.clipboard.writeText(text).then(() => document.execCommand('paste')),
            cmd
          )
        } else {
          // slow path
          const currentValue = await app.client.getValue(selectors.CURRENT_PROMPT)
          const doThis = `${currentValue}${cmd}`
          await app.client.setValue(selectors.CURRENT_PROMPT, doThis)
        }
        if (noNewline !== true) await app.client.keys(keys.ENTER)
        return { app: app, count: parseInt(count) }
      })
  },

  /**
   * Exit code code for the given http status code; this is an identity function; for headless mode, there is the -256 part.
   * See headless.js for the analogous headless implementation.
   */
  exitCode: statusCode => statusCode,

  paste: (cmd, app, nLines = 1) =>
    app.client
      .waitForExist(selectors.CURRENT_PROMPT_BLOCK)
      .then(() => app.client.getAttribute(selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
      .then(count =>
        app.electron.clipboard
          .writeText(cmd)
          .then(() => app.client.execute(() => document.execCommand('paste')))
          .then(() => ({ app: app, count: parseInt(count) + nLines - 1 }))
      ),

  /** wait for the repl to be active */
  waitForRepl: async app => {
    await app.client.waitForEnabled(selectors.CURRENT_PROMPT)
    return app
  },

  /**
   * look at the repl-context and repl-selection after a cli.do (which is the `res` part)
   *   getHTML lets us inspect the contents of potentially invisible elements
   */
  expectContext: (expectedContext, expectedSelection) => res =>
    exports.cli
      .expectOKWithCustom({ passthrough: true })(res)
      .then(N =>
        Promise.all([
          res.app.client.getHTML(`${selectors.PROMPT_BLOCK_N(N + 1)} .repl-context`),
          res.app.client.getHTML(`${selectors.PROMPT_BLOCK_N(N + 1)} .repl-selection`)
        ]).then(
          pair =>
            assert.ok(expectedContext === undefined || pair[0].indexOf(expectedContext) >= 0) &&
            (expectedSelection === undefined || pair[1].indexOf(expectedSelection) >= 0)
        )
      )
      .then(() => res.app),

  /** close sidecar, then expectContext, then open sidecar */
  /* expectContextWithToggle: (expectedContext, expectedSelection) => res => {
        return exports.sidecar.doClose(res.app).then(() => res)
            .then(exports.cli.expectContext(expectedContext, expectedSelection))
            .then(exports.sidecar.doOpen)
            .then(() => res.app)
    }, */

  /** wait for the result of a cli.do */
  makeCustom: (selector, expect, exact) => ({
    selector: selector,
    expect: expect,
    exact: exact
  }),
  expectError: (statusCode, expect) => res =>
    expectOK(res, {
      selector: `.oops[data-status-code="${statusCode || 0}"]`,
      expectError: true,
      expect: expect
    }).then(() => res.app),
  expectErrorWithPassthrough: (statusCode, expect) => res =>
    expectOK(res, {
      selector: `.oops[data-status-code="${statusCode || 0}"]`,
      expectError: true,
      expect: expect,
      passthrough: true
    }),
  expectBlankWithOpts: (opts = {}) => res => expectOK(res, Object.assign({ selector: '', expectError: true }, opts)),
  expectBlank: res => exports.cli.expectBlankWithOpts()(res),
  expectConsoleToBeClear: app => {
    return app.client.waitUntil(async () => {
      return app.client.elements(selectors.PROMPT_BLOCK).then(elements => elements.value.length === 1)
    })
  },
  expectOKWithCustom: custom => res => expectOK(res, custom), // as long as its ok, accept anything
  expectOKWithStringEventually: (expect, exact = false) => res => {
    return res.app.client.waitUntil(() => {
      try {
        return exports.cli.expectOKWithString(expect, exact)(res)
      } catch (err) {
        // swallow
      }
    }, timeout - 5000)
  },
  expectOKWithString: (expect, exact = false) => res => {
    // first try innerText
    return exports.cli
      .expectOKWithCustom({ expect, exact })(res)
      .catch(err1 => {
        // use .textContent as a backup plan
        return exports.cli
          .expectOKWithTextContent(expect, exact)(res)
          .catch(() => {
            throw err1
          })
      })
  },
  expectOKWithTextContent: (expect, exact = false, failFast = true, sel = ' ') => async res => {
    // Notes: webdriverio's getText seems to use .innerText to extract
    // the text from a given selector; this is quite unreliable in
    // terms of whitespace preservation; e.g. <div><span>
    // </span><span> </span></div> will preserve whitespace, but if
    // the inner spans have are inline-block, then innerText will not
    // preserve whitespace; textContent *will* preserve whitespace
    const selector = await exports.cli.expectOKWithCustom({ selector: sel })(res)
    const txt = await exports.getTextContent(res.app, selector)

    if (exact) {
      return assert.strictEqual(txt, expect)
    } else {
      if (txt.indexOf(expect) < 0) {
        console.error(`Expected string not found expected=${expect} idx=${txt.indexOf(expect)} actual=${txt}`)
        if (failFast) {
          assert.ok(txt.indexOf(expect) >= 0)
        } else {
          return false
        }
      }
    }
  },
  expectOKWithAny: res => expectOK(res), // as long as its ok, accept anything
  expectOKWithOnly: entityName => res => expectOK(res, entityName), // expect ok and *only* the given result value
  expectOKWith: entityName => res => expectOK(res, [entityName]), // expect ok and at least the given result value
  expectOK: res =>
    expectOK(res, { passthrough: true })
      .then(N => res.app.client.elements(selectors.LIST_RESULTS_BY_NAME_N(N)))
      .then(elts => assert.strictEqual(elts.value.length, 0))
      .then(() => res.app),
  expectJustOK: res => expectOK(res, true).then(() => res.app) // expect just ok, and no result value
}

/** wait for the xterm input to be read */
exports.waitForXtermInput = (app, N) => {
  const selector = `${selectors.PROMPT_BLOCK_N(N)} .xterm-helper-textarea`
  return app.client.waitForExist(selector)
}

/** extract text from the given selector using .textContent */
exports.getTextContent = (app, selector) => {
  return app.client
    .execute(selector => {
      try {
        return document.querySelector(selector).textContent
      } catch (err) {
        console.error('error in getTextContent', err)
        // intentionally returning undefined
      }
    }, selector)
    .then(_ => _.value)
}

exports.sidecar = {
  expectOpen: app => app.client.waitForVisible(selectors.SIDECAR, timeout).then(() => app),
  expectOpenWithFailure: app => app.client.waitForVisible(selectors.SIDECAR_WITH_FAILURE, timeout).then(() => app),

  // expect open fullscreen
  expectFullscreen: app => app.client.waitForVisible(selectors.SIDECAR_FULLSCREEN, timeout).then(() => app),

  // either minimized or fully closed
  expectClosed: app => app.client.waitForExist(selectors.SIDECAR_HIDDEN, timeout).then(() => app),

  // fully closed, not just minimized
  expectFullyClosed: app => app.client.waitForExist(selectors.SIDECAR_FULLY_HIDDEN, timeout).then(() => app),

  expectSourceStruct: expectedJSON => app =>
    app.client
      .getText(selectors.SIDECAR_ACTION_SOURCE)
      .then(exports.expectStruct(expectedJSON))
      .then(() => app),

  expectSourceSubset: expectedJSON => app =>
    app.client
      .getText(selectors.SIDECAR_ACTION_SOURCE)
      .then(exports.expectSubset(expectedJSON))
      .then(() => app),

  expectSource: expectedSource => app =>
    app.client
      .waitUntil(async () => {
        const actualSource = await app.client.getText(selectors.SIDECAR_ACTION_SOURCE)
        return actualSource.replace(/\s+/g, '') === expectedSource.replace(/\s+/g, '')
      }, exports.waitTimeout)
      .then(() => app),

  expectResult: (expectedResult, failFast = true) => app =>
    app.client
      .getText(selectors.SIDECAR_ACTIVATION_RESULT)
      .then(exports.expectStruct(expectedResult, undefined, failFast))
      .then(() => app),

  expectResultSubset: (expectedResult, failFast = true) => app =>
    app.client
      .getText(selectors.SIDECAR_ACTIVATION_RESULT)
      .then(exports.expectSubset(expectedResult, failFast))
      .then(() => app),

  expectBadge: badge => app =>
    app.client
      .waitUntil(() => app.client.getText(selectors.SIDECAR_BADGES).then(badges => badges.indexOf(badge) >= 0))
      .then(() => app),

  expectLimit: (type, expectedValue) => app => {
    const expect = {}
    expect[type] = expectedValue

    return app.client
      .click(selectors.SIDECAR_MODE_BUTTON('limits'))
      .then(() => app.client.getText(selectors.SIDECAR_ACTION_SOURCE))
      .then(exports.expectSubset(expect))
  },

  expectSequence: A => app => {
    return Promise.all(
      A.map((component, idx) => {
        const selector = `${selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(idx)}[data-name="/_/${component}"]`
        console.error(`Waiting for ${selector}`)
        return app.client.waitForExist(selector)
      })
    )
  },

  /** helper method to close the sidecar */
  doClose: function(app) {
    return exports.sidecar
      .expectOpen(app)
      .then(() => app.client.keys(keys.ESCAPE))
      .then(() => app)
      .then(exports.sidecar.expectClosed)
  },
  doOpen: function(app) {
    return exports.sidecar
      .expectClosed(app)
      .then(() => app.client.keys(keys.ESCAPE))
      .then(() => app)
      .then(exports.sidecar.expectOpen)
  },
  close: function(ctx) {
    it('should toggle closed the sidecar', () => exports.sidecar.doClose(ctx.app))
  },

  expectMode: expectedMode => app =>
    app.client.waitUntil(() => {
      return app.client
        .waitForVisible(`${selectors.SIDECAR_MODE_BUTTON(expectedMode)}.bx--tabs__nav-item--selected`)
        .then(() => app)
    }),

  expectShowing: (
    expectedName,
    expectedActivationId,
    expectSubstringMatchOnName = false,
    expectedPackageName,
    expectType,
    waitThisLong = timeout
  ) => app =>
    app.client
      .waitUntil(
        () => {
          // check selected name in sidecar
          return app.client
            .waitForVisible(`${selectors.SIDECAR}${!expectType ? '' : '.entity-is-' + expectType}`)
            .then(() => app.client.waitForText(selectors.SIDECAR_TITLE, timeout))
            .then(() => app.client.getText(selectors.SIDECAR_TITLE))
            .then(name => {
              const nameMatches = expectSubstringMatchOnName
                ? name.indexOf(expectedName) >= 0 || expectedName.indexOf(name) >= 0
                : name === expectedName
              if (nameMatches) {
                if (expectedPackageName) {
                  return app.client
                    .getText(selectors.SIDECAR_PACKAGE_NAME_TITLE)
                    .then(name =>
                      expectSubstringMatchOnName
                        ? name.search(new RegExp(expectedPackageName, 'i')) >= 0
                        : name.toLowerCase() === expectedPackageName.toLowerCase()
                    )
                } else {
                  return true
                }
              }
            })
        },
        waitThisLong,
        `expect action name ${expectedName} in sidecar substringOk? ${expectSubstringMatchOnName}`
      )
      .then(() => {
        // check selectd activation id in sidecar
        if (expectedActivationId) {
          return app.client.waitUntil(
            () =>
              app.client
                .waitForText(selectors.SIDECAR_ACTIVATION_TITLE, timeout)
                .then(() => app.client.getText(selectors.SIDECAR_ACTIVATION_TITLE))
                .then(id => id === expectedActivationId),
            timeout,
            `expect activation id ${expectedActivationId} in sidecar`
          )
        }
      })
      .then(() => app)
}

exports.expectText = (app, expectedText) => async selector => {
  const actualText = await app.client.getText(selector)
  assert.strictEqual(actualText, expectedText)
}

/** get the monaco editor text */
exports.getValueFromMonaco = async (app /*: Application */, prefix = '') => {
  const editor = '.monaco-editor-wrapper'
  const selector = prefix ? `${prefix} ${editor}` : editor
  try {
    await app.client.waitForExist(selector, timeout - 5000)
  } catch (err) {
    console.error('cannot find editor', err)
    await app.client.getHTML(selectors.SIDECAR).then(html => {
      console.log('here is the content of the sidecar:')
      console.log(html)
    })
    throw err
  }

  return app.client
    .execute(selector => {
      try {
        return document.querySelector(selector)['editor'].getValue()
      } catch (err) {
        console.error('error in getValueFromMonaco1', err)
        // intentionally returning undefined
      }
    }, selector)
    .then(_ => _.value)
    .catch(err => {
      console.error('error in getValueFromMonaco2', err)
      // intentionally returning undefined
    })
}

/**
 * subset means that it is ok for struct1 to be a subset of struct2
 * so: every key in struct1 must be in struct2, but not vice versa
 *
 */
const sameStruct = (struct1, struct2, subset = false) => {
  if (struct1 === struct2) {
    return true
  } else if (typeof struct1 !== typeof struct2) {
    return false
  } else if (Array.isArray(struct1) && subset) {
    // array subset check has to ignore ordering within the array
    const map1 = Object.keys(struct1).reduce((M, key, idx, A) => {
      M[key] = A[idx]
      return M
    }, {})
    const map2 = Object.keys(struct2).reduce((M, key, idx, A) => {
      M[key] = A[idx]
      return M
    }, {})
    return sameStruct(map1, map2, subset)
  }

  for (const key in struct1) {
    if (!(key in struct2)) {
      console.log(`!(${key} in struct2)`)
      return false
    } else if (typeof struct1[key] === 'function') {
      // then we have a validator function
      if (!struct1[key](struct2[key])) {
        return false
      }
    } else if (typeof struct1[key] !== typeof struct2[key]) {
      console.log(`typeof struct1[${key}] !== typeof struct2[${key}] ${typeof struct1[key]} ${typeof struct2[key]}`)
      return false
    } else if (typeof struct1[key] === 'object') {
      if (!sameStruct(struct1[key], struct2[key], subset)) {
        return false
      }
    } else if (struct1[key] !== struct2[key]) {
      console.log(`struct1[${key}] !== struct2[${key}] ${struct1[key]} ${struct2[key]}`)
      return false
    }
  }

  // if struct1 if expected to be a subset of struct2, then we're done
  if (subset) return true

  for (const key in struct2) {
    if (!(key in struct1)) {
      console.log(`!(${key} in struct1)`)
      return false
    } else if (typeof struct1[key] === 'function') {
      // then we have a validator function
      if (!struct1[key](struct2[key])) {
        return false
      }
    } else if (typeof struct1[key] !== typeof struct2[key]) {
      console.log(`typeof struct1[${key}] !== typeof struct2[${key}] ${typeof struct1[key]} ${typeof struct2[key]}`)
      return false
    } else if (typeof struct2[key] === 'object') {
      if (!sameStruct(struct1[key], struct2[key], subset)) {
        return false
      }
    } else if (struct1[key] !== struct2[key]) {
      console.log(`struct1[${key}] !== struct2[${key}] ${struct1[key]} ${struct2[key]}`)
      return false
    }
  }
  return true
}

/** is the given struct2 the same as the given struct2 (given as a string) */
exports.expectStruct = (struct1, noParse = false, failFast = true) => string => {
  try {
    const ok = sameStruct(struct1, noParse ? string : JSON.parse(string))
    if (failFast) {
      assert.ok(ok)
    }
    return ok
  } catch (err) {
    console.error('Error comparing structs for actual value=' + string)
    throw err
  }
}
exports.expectYAML = (struct1, subset = false, failFast = true) => string => {
  try {
    const struct2 = require('js-yaml').safeLoad(string)
    const ok = sameStruct(struct1, struct2, subset)
    if (failFast) {
      assert.ok(ok)
    }
    return ok
  } catch (err) {
    if (failFast) {
      return false
    } else {
      console.error('Error comparing subset for actual value=' + string)
      throw err
    }
  }
}
exports.expectYAMLSubset = (struct1, failFast = true) => exports.expectYAML(struct1, true, failFast)
exports.expectSubset = (struct1, failFast = true) => string => {
  try {
    const ok = sameStruct(struct1, JSON.parse(string), true)
    if (failFast) {
      assert.ok(ok)
    }
    return true
  } catch (err) {
    console.error('Error comparing subset for actual value=' + string)
    throw err
  }
}

/** is the given actual array the same as the given expected array? */
exports.expectArray = (expected, failFast = true) => actual => {
  if (!Array.isArray(actual)) {
    // webdriver.io's getText will return a singleton if there is only one match
    actual = [actual]
  }

  const ok =
    actual.length === expected.length &&
    actual.every(function(u, i) {
      return u === expected[i]
    })

  if (!ok) {
    console.error(`array mismatch; expected=${expected} actual=${actual}`)
  }

  if (failFast) {
    assert.ok(ok)
  } else {
    return ok
  }
}

/** validate an activationId */
const activationIdPattern = /^\w{12}$/
exports.expectValidActivationId = () => activationId => activationId.match(activationIdPattern)

/**
 * Normalize data for conformance testing of an HTML file
 *
 */
exports.normalizeHTML = s => {
  const result = s
    .toString()
    .replace(/http(s?):\/\/[^/]+/g, '') // strip out any hostnames that may vary
    .replace(/>\s+</g, '><') // remove white-space between tags
    .replace(/"/g, "'") // convert to single quotes
    .replace(/href=(['"])([^'"]+).css(['"])/, 'href=$1$2.http$3')
  return result
}

/**
 * @return the expected namespace string for this test
 *
 */
exports.expectedNamespace = (space = process.env.TEST_SPACE, org = process.env.TEST_ORG) => {
  if (!org || org.length === 0) {
    return space
  } else {
    return `${org}_${space}`
  }
}

/**
 * Valdiate that the observed namespace matches the expected namespace
 * for this test
 *
 */
exports.validateNamespace = observedNamespace => {
  assert.strictEqual(observedNamespace.toLowerCase(), exports.expectedNamespace().toLowerCase())
}

/**
 * The proper control or command modifier for the platform
 *
 */
exports.ctrlOrMeta = process.platform === 'darwin' ? '\uE03D' : '\uE009'

exports.ctrlC = ['\uE009', 'c', 'NULL'] // Send NULL to release Control key at the end of the call, otherwise the state of Control is kept between calls

/**
 * Wait till activation list shows the given activationId. Optionally,
 * use an action name filter
 *
 */
const waitForActivationOrSession = entityType => (app, activationId, { name = '' } = {}) => {
  return app.client.waitUntil(() => {
    return exports.cli
      .do(`wsk ${entityType} list ${name}`, app)
      .then(exports.cli.expectOKWithCustom({ passthrough: true }))
      .then(
        N =>
          !!app.client.getText(
            `${exports.selectors.LIST_RESULTS_N(N)} .activationId[data-activation-id="${activationId}"]`
          )
      )
  })
}
exports.waitForActivation = waitForActivationOrSession('activation')
exports.waitForSession = waitForActivationOrSession('session')

exports.apiHost = constants.API_HOST

/** sleep for the given number of milliseconds */
exports.sleep = (millis /*: number */) => new Promise(resolve => setTimeout(resolve, millis))
