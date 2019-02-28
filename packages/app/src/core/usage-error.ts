/*
 * Copyright 2017-2018 IBM Corporation
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

// TODO repl and ui globals
// 'use strict'

const debug = require('debug')('core/usage-error')

import { isHeadless } from './capabilities'
import pip from '../webapp/picture-in-picture'

interface IUsageOptions {
  noHide?: boolean
  noBreadcrumb?: boolean
}
class DefaultUsageOptions implements IUsageOptions {
  constructor () {
    // empty
  }
}

const promiseEach = async function (arr, fn) { // take an array and a function
  const result = []
  for (const item of arr) result.push(await fn(item))
  return result
}

/** Create an HTML DIV to wrap around the given string */
const div = (str?: string | Promise<string> | Element, css: string | Array<string> = undefined, tag = 'div'): HTMLElement => {
  const result = document.createElement(tag)

  if (str) {
    if (typeof str === 'string') {
      Promise.resolve(str).then(str => {
        result.innerText = str
      })
    } else {
      result.appendChild(str as Element)
    }
  }

  if (css) {
    if (typeof css === 'string') {
      result.className = css
    } else {
      css.forEach(_ => result.classList.add(_))
    }
  }
  return result
}
const span = (str?: string | Element, css?: string) => div(str, css, 'span')

/**
 * The start of every section, e.g. Usage:
 *
 */
const prefix = str => {
  const prefix = div(str, 'usage-error-title', 'h4')
  prefix.setAttribute('data-title', str)
  return prefix
}

/** A part of the main body of the usage message */
const bodyPart = (noMargin = false) => {
  const result = div()
  if (!noMargin) result.style.margin = '2em 0em 0 0'
  return result
}

/** render the given div with the default san serif font */
const sans = div => {
  div.style.fontFamily = 'var(--font-sans-serif)'
  return div
}

/** render the given div a bit smaller */
const smaller = div => {
  div.style.fontSize = '0.875em'
  return div
}
/** render the given div with white space line wrapping */
const wrap = div => {
  div.style.display = 'block'
  div.style.whiteSpace = 'normal'
  return div
}

/**
 * Invoke a given command, and return the raw (i.e. not formatted) usage model
 *
 */
const usageFromCommand = (command, repl) => repl.qexec(command)
  .then(_ => {
    console.error('Invalid usage model', command, _)
    throw new Error('Internal Error')
  })
  .catch(usageError => usageError.raw)

/**
 * Invoke a given command, and extract the breadcrumb title from the resulting usage model
 *
 */
const breadcrumbFromCommand = (command, repl) => usageFromCommand(command, repl)
  .then(usage => usage.breadcrumb || usage.title)

/**
 * Format the given usage message
 *
 */
const format = (message, options: IUsageOptions = new DefaultUsageOptions()) => {
  debug('format', typeof message === 'string' ? message : message.title)

  if (typeof message === 'string') {
    return message
  } else if (message.nodeName) {
    // then this is a pre-formatted HTML
    return message
  } else if (message.fn) {
    // then message.fn is a generator, e.g. for command aliases
    return format(message.fn(message.command))
  } else {
    // these are the fields of the usage message
    const replWrappedAMessageString = message.message && message.usage
    const usage = replWrappedAMessageString ? message.usage : message
    const messageString = replWrappedAMessageString && message.message

    const { command, docs, title, breadcrumb = title || command, header = docs && `${docs}.`, example, detailedExample, sampleInputs,
      intro, sections, // the more general case: the usage model has custom sections
      commandPrefix, commandPrefixNotNeeded,
      commandSuffix = '',
      drilldownWithPip = false,
      preserveCase = false, // in breadcrumbs
      available, parents = [], related, required, optional, oneof } = usage
    const outerCommandPrefix = commandPrefix
    const outerCommandSuffix = commandSuffix
    const outerCommand = command

    // the return value will be `result`; we will populate it with
    // those fields now; `body` is the flex-wrap portion of the
    // content
    const resultWrapper = div(undefined, 'fade-in usage-error-wrapper')
    const result = div(undefined, options.noHide ? '' : ['hideable', 'page-content'])
    const body = div()
    const left = div() // usage and detailedExample
    const right = div() // required and optional parameters

    if (sections && sections.length > 1) {
      left.classList.add('fifty-fifty')
      right.classList.add('fifty-fifty')
    } else {
      right.style.marginLeft = '2em'
    }

    if (messageString) {
      // then the repl wrapped around the usage model, adding an extra message string
      const messageDom = div(undefined, '', 'div')
      const prefacePart = span('')
      const messagePart = span(messageString, 'red-text usage-error-message-string')

      if (!options.noHide) {
        result.classList.add('hidden')
      }

      messageDom.appendChild(prefacePart)
      messageDom.appendChild(messagePart)
      resultWrapper.appendChild(messageDom)

      if (!isHeadless() && !options.noHide) {
        const usagePart = div(undefined, 'small-top-pad hideable click-here-for-usage-container')
        const frontPart = span('Click ')
        const clickyPart = span('here', 'clickable clickable-blatant click-here-for-usage')
        const restPart = span(' for usage information.')

        usagePart.appendChild(frontPart)
        usagePart.appendChild(clickyPart)
        usagePart.appendChild(restPart)
        messageDom.appendChild(usagePart)

        clickyPart.onclick = () => {
          result.classList.remove('hidden')
          usagePart.classList.add('hidden')
        }
      }
    }

    resultWrapper.appendChild(result)

    const repl = require('@kui-shell/core/core/repl')

    //
    // breadcrumb
    //
    let breadcrumbPromise
    if (options.noBreadcrumb) {
      breadcrumbPromise = Promise.resolve()
    } else {
      const container = div(undefined, 'bx--breadcrumb bx--breadcrumb--no-trailing-slash', 'h2')
      result.appendChild(container)

      /** make a single breadcrumb for the UI; defaultCommand means use the string as a command */
      const makeBreadcrumb = options => {
        const stringLabel = typeof options.label === 'string'
        const cmd = options.commandFromLabel ? stringLabel ? options.label : options.label.command : options.command
        const label = stringLabel ? options.label : breadcrumbFromCommand(options.label.command, repl)

        return Promise.resolve(label)
          .then(label => {
            const item = span()
            item.classList.add('bx--breadcrumb-item')

            if (!preserveCase) {
              item.classList.add('capitalize')
            }

            const dom = span(label, 'bx--no-link')
            dom.setAttribute('data-label', label)
            item.appendChild(dom)

            if (!options.noSlash) {
              item.appendChild(span('/', 'bx--breadcrumb-item--slash'))
            }

            if (cmd) {
              dom.classList.add('bx--link')
              dom.onclick = () => repl.pexec(cmd)
            }

            return item
          })
      }

      /** attach the breadcrumb to the dom */
      const attachBreadcrumb = breadcrumb => container.appendChild(breadcrumb)

      // now we add the breadcrumb chain to the UI
      breadcrumbPromise = promiseEach([{ label: 'Shell Docs', command: 'help' }, // root
        ...parents.map(label => ({ label, commandFromLabel: true })),
        { label: breadcrumb, noSlash: true }
      ], makeBreadcrumb)
        .then(crumbs => crumbs.map(attachBreadcrumb))
    }

    return breadcrumbPromise.then(() => {
      //
      // title
      //
      /* if (title) {
            const dom = div(title, 'capitalize', 'h1')
            dom.style.fontSize = '1.629em'
            dom.style.fontWeight = 300
            dom.style.color = 'var(--color-brand-01)'
            dom.style.margin = '0 0 .3rem'
            result.appendChild(dom)
        } */

      //
      // header message
      //
      if (header) {
        const headerDiv = div(header)
        // headerDiv.style.color = 'var(--color-support-01)'
        headerDiv.style.fontWeight = '400'
        sans(headerDiv)
        result.appendChild(headerDiv)
      }

      body.style.display = 'flex'
      body.style.flexWrap = 'wrap'
      body.style.marginTop = '0.375em'
      body.appendChild(left)
      body.appendChild(right)
      result.appendChild(body)

      // any minimally formatted sections? e.g. `intro` and `section` fields
      const makeSection = (parent = right, noMargin = false) => ({ title, content }) => {
        const wrapper = bodyPart(noMargin)
        const prePart = prefix(title)
        const contentPart = document.createElement('pre')
        contentPart.classList.add('pre-wrap')
        contentPart.innerText = content
        wrapper.appendChild(prePart)
        wrapper.appendChild(contentPart)
        parent.appendChild(wrapper)
      }

      // top-most intro section?
      if (intro) {
        makeSection(left)(intro)
      }

      // example command
      if (example) {
        const examplePart = bodyPart()
        const prePart = prefix('Usage')
        const textPart = div(example)

        left.appendChild(examplePart)
        examplePart.appendChild(prePart)
        examplePart.appendChild(textPart)

        textPart.style.color = 'var(--color-support-02)'
      }

      // detailed example command
      if (detailedExample) {
        const examples = !Array.isArray(detailedExample) ? [detailedExample] : detailedExample

        const examplePart = bodyPart()
        const prePart = prefix(examples.length === 1 ? 'Example' : 'Examples')
        left.appendChild(examplePart)
        examplePart.appendChild(prePart)

        examples.forEach(({ command, docs }, idx) => {
          const textPart = div(command)
          const docPart = sans(div(docs))

          examplePart.appendChild(textPart)
          examplePart.appendChild(smaller(docPart))

          textPart.style.color = 'var(--color-support-02)'

          if (idx > 0) {
            textPart.style.marginTop = '1em'
          }
        })
      }

      /**
       * Render a table of options
       *
       */
      const makeTable = (title, rows, parent = right, nRowsInViewport = message.nRowsInViewport || 5): HTMLElement => {
        const wrapper = bodyPart()
        const prePart = prefix(title)

        wrapper.appendChild(prePart)
        parent.appendChild(wrapper)

        if (typeof rows === 'string') {
          // then we have a degenerate case where the "rows" is a
          // plain string
          debug('plain string body', rows)
          const content = document.createElement('div')
          content.innerText = rows
          wrapper.appendChild(content)

          return
        }

        const table = document.createElement('table')
        table.className = 'log-lines'

        // make the table scrollable, showing only a max number of
        // rows at a time: e.g. 5 rows, plus a bit (1px) for the
        // bottom border; the 3em part must .log-line's height in
        // ui.css; nRowsInViewport = true means disable inner scrolling
        if (rows.length > nRowsInViewport && nRowsInViewport !== true) {
          const tableScrollable = div(undefined, 'scrollable')
          tableScrollable.style.maxHeight = `calc(${nRowsInViewport} * 3em + 1px)`
          tableScrollable.appendChild(table)
          wrapper.appendChild(tableScrollable)
        } else {
          wrapper.appendChild(table)
        }

        // render the rows
        const renderRow = rowData => {
          if (rowData.fn) {
            // then rowData is a generator for aliases
            return renderRow(rowData.fn(rowData.command))
          }

          // fields of the row model
          // debug('row', rowData)
          const { commandPrefix = outerCommandPrefix, commandSuffix = outerCommandSuffix,
            command = outerCommand,
            name = command, label = name,
            noclick = false,
            synonyms, alias, numeric, aliases = synonyms || [alias], hidden = false, advanced = false,
            available,
            example = numeric && 'N', dir: isDir = available || false,
            title, header, docs = header || title, partial = false, allowed, defaultValue } = rowData

          // row is either hidden or only shown for advanced users
          if (hidden) return
          if (advanced) return // for now

          const row = table.insertRow(-1)
          row.className = 'log-line entity'

          const cmdCell = row.insertCell(-1)
          const docsCell = row.insertCell(-1)
          const cmdPart = span(label)
          const dirPart = isDir && label && span('/')
          const examplePart = example && span(example, label || dirPart ? 'left-pad' : '') // for -p key value, "key value"
          const aliasesPart = aliases && span(undefined, 'deemphasize small-left-pad')
          const docsPart = span(docs)
          const allowedPart = allowed && smaller(span(undefined))

          // for repl.exec,
          const commandForExec = (alias: string, cmd = ''): string => {
            return `${commandPrefix && !commandPrefixNotNeeded ? commandPrefix + ' ' : ''}${alias} ${cmd} ${commandSuffix}`
          }

          cmdCell.className = 'log-field'
          docsCell.className = 'log-field'

          cmdCell.style.background = 'var(--color-ui-02)'
          docsCell.style.background = 'var(--color-ui-02)'

          cmdPart.style.fontWeight = '500'
          wrap(smaller(sans(docsPart)))

          // command aliases
          if (aliases) {
            aliases.filter(x => x).forEach(alias => {
              const cmdCell = span()
              const cmdPart = span(alias, noclick ? '' : 'clickable clickable-blatant')
              const dirPart = isDir && span('/')

              if (!noclick) {
                cmdPart.onclick = () => repl.pexec(commandForExec(alias))
              }

              aliasesPart.appendChild(cmdCell)
              cmdCell.appendChild(cmdPart)
              if (dirPart) cmdCell.appendChild(smaller(dirPart))
            })
          }

          // allowed and default values
          if (allowed) {
            allowedPart.style.color = 'var(--color-text-02)'
            allowedPart.appendChild(span('options: '))
            allowed.forEach((value, idx) => {
              const option = span(`${idx > 0 ? ', ' : ''}${value}${value !== defaultValue ? '' : '*'}`)
              allowedPart.appendChild(option)
            })
          }

          cmdCell.appendChild(cmdPart)
          if (dirPart) cmdCell.appendChild(smaller(dirPart))
          if (aliasesPart) cmdCell.appendChild(smaller(aliasesPart))
          if (examplePart) cmdCell.appendChild(smaller(examplePart))
          docsCell.appendChild(docsPart)
          if (allowedPart) docsCell.appendChild(allowedPart)

          if (command) {
            if (!isDir) cmdPart.style.fontWeight = 'bold'
            if (!noclick) {
              cmdPart.classList.add('clickable')
              cmdPart.classList.add('clickable-blatant')
              cmdPart.onclick = async event => {
                if (partial) {
                  const cli = await import('../webapp/cli')
                  return cli.partial(commandForExec(alias, command) + `${partial === true ? '' : ' ' + partial}`)
                } else {
                  // console.error('CP', commandPrefix)
                  // console.error('CCC', command)
                  // console.error('NNN', name)
                  if (drilldownWithPip) {
                    return pip(commandForExec(command, name !== command ? name : undefined),
                               undefined,
                               resultWrapper.parentNode.parentNode as Element,
                              'Previous Usage')(event)
                  } else {
                    return repl.pexec(commandForExec(command, name !== command ? name : undefined))
                  }
                }
              }
            }
          }
        } /* renderRow */

        rows.forEach(renderRow)

        return wrapper
      }

      if (sections) {
        // render more general sections, rather than the specific
        // oneof, optional, etc.
        const defaultNRowsInViewport = (idx, nRows) => {
          if (idx === sections.length - 1 && sections.length % 2 === 0) {
            return sections.length === 2 ? nRows : 5
          } // otherwise, accept global default
        }

        const stringSections = sections.filter(_ => typeof _.rows === 'string')
        const tableSections = sections.filter(_ => Array.isArray(_.rows))
        debug('string', stringSections)
        debug('table', tableSections)

        tableSections.sort(({ rows: a }, { rows: b }) => a.length - b.length)

        const nRowsOf = (section, idx) => {
          debug('nRowsOf', section, section.rows.length, section.nRowsInViewport, defaultNRowsInViewport(idx, section.rows.length))
          return Math.min(section.rows.length,
                          section.nRowsInViewport || defaultNRowsInViewport(idx, section.rows.length) || section.rows.length)
        }

        const totalRows = tableSections.reduce((total, section, idx) => {
          return total + nRowsOf(section, idx)
        }, 0)

        stringSections.forEach((section, idx) => {
          const { title, rows, nRowsInViewport } = section
          makeTable(title,
                    rows,
                    left)
        })

        let runningSum = 0
        tableSections.forEach((section, idx) => {
          const { title, rows, nRowsInViewport } = section

          runningSum += nRowsOf(section, idx)
          debug('running', runningSum, totalRows)
          makeTable(title,
                    rows,
                    runningSum < totalRows / 2 ? left : right,
                    nRowsInViewport || defaultNRowsInViewport(idx, rows.length))
        })
      }

      if (available) {
        const table = makeTable('Available Commands', available)
        table.classList.add('user-error-available-commands')
        if (!title && !header) {
          table.style.marginTop = '0'
        }
      }

      if (required) {
        makeTable('Required Parameters', required)
      }

      if (oneof) {
        makeTable('Required Parameters (choose one of the following)', oneof)
      }

      if (optional) {
        makeTable('Optional Parameters', optional)
      }

      if (sampleInputs) {
        // attach this to the left side, along with usage
        makeTable('Sample Inputs', sampleInputs, left)
      }

      if (related) {
        const relatedPart = bodyPart()
        const prePart = prefix('Related Commands')
        const listPart = div()

        relatedPart.appendChild(prePart)
        relatedPart.appendChild(listPart)
        result.appendChild(relatedPart) // note that we append to result not body; body is for the flex-wrap bits

        related.forEach((command, idx) => {
          const commandPart = span(undefined, '')
          const commaPart = span(idx === 0 ? '' : ', ', '')
          const clickablePart = span(command, 'clickable')

          commandPart.appendChild(commaPart)
          commandPart.appendChild(clickablePart)
          clickablePart.onclick = () => repl.pexec(command)

          listPart.appendChild(commandPart)
        })
      }

      return resultWrapper
    })
  }
}

export default class UsageError extends Error {
  isUsageError: boolean
  raw: any
  extra: any
  code: number

  constructor (message, extra?, code = (message && (message.statusCode || message.code)) || 500) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
    this.isUsageError = true
    this.raw = message
    this.extra = extra
    this.code = code

    if (message.usage instanceof UsageError) {
      message.usage = message.usage.raw
    }
    this.message = format(message, extra)
  }
}
