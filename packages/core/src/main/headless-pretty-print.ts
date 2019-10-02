/*
 * Copyright 2017-18 IBM Corporation
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

import Debug from 'debug'
const debug = Debug('main/headless-pretty-print')
debug('loading')

import { Writable } from 'stream'
import * as colors from 'colors/safe'

import { ElementMimic } from '../util/mimic-dom'
import { isTable, isMultiTable, Row } from '../webapp/models/table'
import { isEntitySpec, isMixedResponse, isMessageBearingEntity, Entity } from '../models/entity'
import { isMultiModalResponse } from '../models/MultiModalResponse'
import { isHTML, isPromise } from '../util/types'

const log = console.log
const error = console.error

const verbose = process.argv.find(_ => _ === '-v')
const colorAlways = process.argv.find(_ => _ === '--color=always')
const neverColor = process.argv.find(_ => _ === '--no-color' || _ === '--no-colors')
const rawOutput = process.argv.find(_ => _ === '--raw-output') // don't try to pretty-print the JSON; c.f. jq's --raw-output

/**
 * Determine whether how pretty we should make the output; if stdout
 * is a pipe, then we shouldn't pass through colors, unless
 * the user specified --color=always.
 *
 */
const stdoutIsFIFO = process.platform !== 'win32' && process.stdout.isTTY
const noColor = neverColor || (stdoutIsFIFO && !colorAlways)
debug('stdoutIsFIFO', stdoutIsFIFO, noColor)

type ColorFunction = (str: string) => string

const colorMap: Record<string, ColorFunction> = {
  'var(--color-brand-01)': colors.blue,
  'var(--color-brand-02)': colors.blue,
  'var(--color-support-02)': colors.blue,

  'var(--color-black)': colors.black,
  'var(--color-red)': colors.red,
  'var(--color-green)': colors.green,
  'var(--color-yellow)': colors.yellow,
  'var(--color-blue)': colors.blue,
  'var(--color-magenta)': colors.magenta,
  'var(--color-cyan)': colors.cyan,
  'var(--color-white)': colors.white,
  'var(--color-gray)': colors.gray,
  'var(--color-light-red)': colors.red,
  'var(--color-light-green)': colors.green,
  'var(--color-light-yellow)': colors.yellow
}

let graphicalShellIsOpen = false
export const setGraphicalShellIsOpen = () => {
  graphicalShellIsOpen = true
}

/**
 * Try to pretty print one of our fake doms
 *
 */
interface PrettyOptions {
  columnWidths?: { [key: number]: number }
  extraColor?: ColorFunction
}
class DefaultPrettyOptions implements PrettyOptions {}
let firstPrettyDom = true // so we can avoid initial newlines for headers
const prettyDom = (
  dom: ElementMimic,
  logger = log,
  stream: Writable = process.stdout,
  _color: (str: string) => string,
  { columnWidths, extraColor }: PrettyOptions = new DefaultPrettyOptions()
) => {
  debug('prettyDom')

  const isHeader = dom.nodeType === 'h1' || dom.nodeType === 'h2' || dom.nodeType === 'h3' || dom.nodeType === 'h4'
  const capitalize = false
  const hasMargin =
    dom.className.indexOf('bx--breadcrumb-item--slash') >= 0 ||
    dom.className.indexOf('left-pad') >= 0 ||
    dom.style['margin'] ||
    dom.style['padding']

  if (hasMargin) {
    stream.write(' ')
  }

  const extraColorChoice =
    isHeader || dom.hasStyle('fontWeight', 'bold')
      ? colors.bold
      : dom.hasStyle('fontWeight', 500)
      ? colors.green
      : dom.hasStyle('fontSize', '0.875em')
      ? colors.gray
      : extraColor || colors.reset
  const colorFn: ColorFunction = (dom.hasStyle('color') && colorMap[dom.style.color]) || _color
  // debug('colors', isHeader, colorCode, color, extraColorChoice)

  if (isHeader) {
    // an extra newline before headers
    if (firstPrettyDom) {
      // don't emit a header margin for the very first thing
      // we print
      firstPrettyDom = false
    } else {
      logger()
    }
  }

  if (dom.innerText) {
    const text = capitalize ? dom.innerText.charAt(0).toUpperCase() + dom.innerText.slice(1) : dom.innerText
    stream.write(extraColorChoice(colorFn(text)))
  }

  const newline = () => {
    if (dom.nodeType === 'div' || isHeader) {
      // not perfect, but treat divs as line breakers
      logger()
    }
  }

  if (hasMargin) {
    stream.write(' ')
  }

  if (dom.innerText) {
    newline()
  }

  // recurse to the children of this fake DOM
  dom.children.forEach(child => prettyDom(child, logger, stream, _color, { extraColor: extraColorChoice }))

  // handle table rows and cells:
  if (dom.rows) {
    // scan the table for max column widths
    const columnWidths: number[] = []
    dom.rows.forEach(row => {
      if (row.cells) {
        row.cells.forEach((cell, idx) => {
          const length = cell.recursiveInnerTextLength()
          if (!columnWidths[idx]) columnWidths[idx] = length
          else columnWidths[idx] = Math.max(columnWidths[idx], length)
        })
      }
    })

    dom.rows.forEach(row => {
      prettyDom(row, logger, stream, _color, { columnWidths })
      logger() // insert a newline after every row
    })
  }
  if (dom.cells) {
    dom.cells.forEach((cell, idx) => {
      prettyDom(cell, logger, stream, _color)

      if (columnWidths && idx < dom.cells.length - 1) {
        // pad out this column to the column width (except we don't
        // need padding in the last column)
        const slop = columnWidths[idx] - cell.recursiveInnerTextLength()
        for (let jj = 0; jj < slop; jj++) {
          stream.write(' ')
        }

        // and then a few more to separate the columns
        stream.write('  ')
      }
    })
  }

  // trailing carriage return?
  if (isHeader && !dom.innerText) {
    logger()
  }
}

/**
 * Pretty print an object as JSON. This is mostly a stub for now, in
 * case we want to do something fancier.
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prettyJSON = (msg: string | Record<string, any>, logger = log) => {
  const serialized = JSON.stringify(msg, undefined, 2)
  logger(serialized)
}

/**
 * Render a name with an optional package name
 *
 */
const pn = (actionName: string, packageName?: string) =>
  colors.dim(`${packageName ? packageName + '/' : ''}`) + colors.blue(actionName)

/**
 * Render a date; if it is from today, show just the time
 *
 */
const prettyDate = (millis: number): string => {
  const date = new Date(millis)
  const now = new Date()
  if (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth() &&
    date.getUTCDate() === now.getUTCDate()
  ) {
    return date.toLocaleTimeString()
  } else {
    return date.toLocaleString()
  }
}

/**
 * Turn an entity into a row, because this entity came as part of an
 * array of entities
 *
 */
const pp = (_: string | boolean) => colors.dim(_ ? 'public' : 'private') // pretty publish
const pk = (_: { key: string; value: string }[]) => colors.green(_.find(({ key }) => key === 'exec').value) // pretty kind

const rowifyAction = ({
  name,
  packageName,
  publish,
  annotations,
  version
}: {
  name: string
  packageName: string
  publish: boolean
  annotations: { key: string; value: string }[]
  version: string
}) => ({
  name: pn(name, packageName),
  'published?': pp(publish),
  kind: pk(annotations),
  version: colors.dim(version)
})

const rowifyPackage = ({ name, publish, binding }: { name: string; publish: boolean; binding: string }) => ({
  name: pn(name),
  'published?': pp(publish),
  binding
})

const rowifySession = ({
  sessionId,
  name,
  success,
  status,
  start
}: {
  sessionId: string
  name: string
  success: boolean
  status: string
  start: number
}) => ({
  sessionId,
  app: pn(name),
  start: colors.dim(prettyDate(start)),
  status: status === 'pending' ? colors.yellow(status) : success ? colors.green(status) : colors.red(status)
})
const rowify: Record<string, (row: Row) => Record<string, string>> = {
  compositions: ({ name, packageName, prettyKind }: { name: string; packageName: string; prettyKind: string }) => ({
    name: pn(name, packageName),
    type: prettyKind
  }),
  session: rowifySession,
  activations: ({ activationId, name }: { activationId: string; name: string }) => ({ activationId, name: pn(name) }),
  actions: rowifyAction,
  triggers: ({ name, publish }: { name: string; publish: string }) => ({
    name: pn(name),
    'published?': pp(publish)
  }),
  packages: rowifyPackage,
  plugins: ({ name, attributes }: { name: string; attributes: { key: string; value: string }[] }) => {
    return {
      name: pn(name),
      version: colors.dim(attributes.find(({ key }) => key === 'version').value)
    }
  },
  _default: ({
    key,
    name,
    attributes
  }: {
    key: string
    name: string
    attributes: { key: string; value: string; placeholderValue?: string }[]
  }) => {
    const row: Record<string, string> = {}

    row[key || 'name'] = pn(name)

    attributes.forEach(attr => {
      if (!attr.placeholderValue) {
        row[attr.key] = attr.value
      }
    })

    return row
  },
  sequence: rowifyAction,
  composer: rowifyAction,
  binding: rowifyPackage,
  live: rowifySession
}

function activationId(msg: Entity) {
  return (msg as { activationId: string }).activationId
}
function name(msg: Entity) {
  const entity = msg as { entity: { name: string } }
  return entity.entity.name
}

/**
 * Pretty print routine that dispatches to the underlying smarter
 * pretty printers (such as prettyDom and prettyjson)
 *
 */
export const print = (
  msg: Entity | Promise<Entity>,
  logger = log,
  stream: Writable = process.stdout,
  colorFn = colors.reset,
  ok = 'ok'
): void | Promise<void> => {
  if (ok === 'error') {
    colorFn = colors.red
  }
  if (verbose && typeof msg === 'string') {
    debug('printing raw JSON, due to -v')
    prettyJSON(msg, logger)
    return
  }

  if (msg && !graphicalShellIsOpen) {
    try {
      if (msg === true) {
        // true is the graphical shell's way of telling the repl to print 'ok'
        debug('printing plain true')
        logger(colors.green(ok))
      } else if (typeof msg === 'string' || typeof msg === 'boolean' || typeof msg === 'number') {
        // logger(colors.green(`${ok}: `) + msg)
        logger(msg)
      } else if (ElementMimic.isFakeDom(msg)) {
        // msg is a DOM facade
        debug('printing fake dom')

        if (msg.className.indexOf('usage-error-wrapper') >= 0) {
          // print usage errors to stdout
          stream = process.stdout
          logger = log
          // color = 'reset'
        }

        prettyDom(msg, logger, stream, colorFn)
        logger()
      } else if (isPromise(msg)) {
        // msg is a promise; resolve it and try again
        debug('printing promise')
        return msg.then(msg => print(msg, logger, stream, colorFn, ok))
      } else if (isTable(msg) || isMultiTable(msg)) {
        debug('printing table')

        if (isMultiTable(msg)) {
          msg.tables.map(_ => print(_, logger, stream, colorFn, ok))
        } else {
          // strip off header row, as we'll make our own
          const type =
            (msg.header && (msg.header.prettyType || msg.header.type)) ||
            (msg.body.length > 0 && (msg.body[0].prettyType || msg.body[0].type))

          const print = type ? rowify[type] : rowify._default

          logger(
            require('columnify')(msg.body.map(print), {
              headingTransform: (_: string) => colors.dim(_)
            })
          )
        }
      } else if (isMixedResponse(msg)) {
        msg.forEach(_ => print(_))
        return logger(colors.green(ok))
      } else if (isMultiModalResponse(msg)) {
        throw new Error('cannot format this response in headless mode')
      } else if (Array.isArray(msg)) {
        // msg is an array of stuff
        debug('printing array')
        if (msg.length > 0) {
          try {
            if (typeof msg[0] === 'string') {
              // then we have a simple array of strings, not entities
              ;(msg as string[]).forEach(_ => {
                const logline = _.split(/(stdout|stderr)/)
                if (logline && logline.length === 3 && !rawOutput) {
                  // then this is a log line
                  const colorFn = logline[1] === 'stdout' ? colors.reset : colors.red

                  logger(
                    colors.dim(new Date(logline[0].trim()).toLocaleString()) + // timestamp
                      // + ' ' + colors.yellow(logline[1])                    // stream (stdout, stderr)
                      colorFn(logline[2].replace(/^:/, ''))
                  ) // log message
                } else {
                  // otherwise, we're not sure what this is,
                  // so do not attempt to render it in a special way
                  logger(_)
                }
              })
              return logger(colors.green(ok))
            }
          } catch (err) {
            error(err)
          }
        }
      } else if (isHTML(msg)) {
        console.error('cannot format HTML message')
      } else if (isMessageBearingEntity(msg)) {
        if (ElementMimic.isFakeDom(msg.message)) {
          // msg.message is a DOM facade
          prettyDom(msg.message, logger, stream, colorFn)
          logger()
        } else {
          logger(msg.message)
        }
      } else if (isEntitySpec(msg)) {
        debug('printing some sort of javascript object')

        if (msg.verb && msg.name && (msg.verb === 'create' || msg.verb === 'update')) {
          // msg is an entity, that has just been created or updated
          debug('printing create or update')
          const isWebExported = msg.annotations && !!msg.annotations.find(({ key }) => key === 'web-export')
          if (isWebExported) {
            const contentType: { value: string } = (msg.annotations &&
              msg.annotations.find(({ key }) => key === 'content-type-extension')) || { value: 'json' }
            const apiHost: string = (msg as { apiHost: string }).apiHost
            const https =
              apiHost.startsWith('https://') || apiHost.startsWith('http://')
                ? ''
                : apiHost === 'localhost'
                ? 'http://'
                : 'https://'
            const urlText = `${https}${apiHost}/api/v1/web/${msg.namespace}/${!msg.packageName ? 'default/' : ''}${
              msg.name
            }.${contentType.value}`
            logger(colors.blue(urlText))
          }
          logger(colors.green(`${ok}:`) + ` updated ${msg.type.replace(/s$/, '')} ${msg.name}`)
        } else if (msg.verb === 'delete') {
          debug('printing delete')
          logger(colors.green(`${ok}:`) + ` deleted ${msg.type.replace(/s$/, '')} ${msg.name}`)
        } else if (msg.verb === 'async' && activationId(msg)) {
          // The returned msgs of action and app are different
          msg.type === 'activations'
            ? logger(colors.green(`${ok}:`) + ` invoked ${name(msg)} with id ${activationId(msg)}`)
            : logger(colors.green(`${ok}:`) + ` invoked ${msg.name} with id ${activationId(msg)}`)
        } else if (msg.verb === 'get' && activationId(msg)) {
          // msg is an entity representing an invocation
          // commenting out this line diverges us from bx wsk output, but we're ok with that:
          // logger(colors.green(`${ok}:`) + ` got activation ${msg.activationId}`)
          debug('printing get activation')
          delete msg.prettyType
          delete msg.verb
          // delete msg['publish']
          delete msg.type
          // delete msg['apiHost']
          delete msg.modes
          delete msg.version
          // delete msg['entity']
          prettyJSON(msg, logger)
        } else {
          // otherwise, print it as generic JSON
          if (msg.verb === 'get') {
            // delete msg['exec']
            delete msg.verb
            // delete msg['publish']
            delete msg.type
            // delete msg['apiHost']
            delete msg.modes
            delete msg.version
          }
          prettyJSON(msg, logger)
        }
      } else if (typeof msg === 'object') {
        prettyJSON(msg, logger)
      } else {
        logger(colorFn(msg))
      }
    } catch (err) {
      debug('got an error', err)
      logger(colors.red(typeof msg === 'object' ? JSON.stringify(msg) : msg.toString()))
    }
  }
}
