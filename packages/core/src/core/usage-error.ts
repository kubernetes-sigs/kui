/*
 * Copyright 2017 The Kubernetes Authors
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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import Debug from 'debug'
const debug = Debug('core/usage-error')
debug('loading')

import { isHeadless } from './capabilities'
import { CodedError } from '../models/errors'
import { Entity } from '../models/entity'
import { CapabilityRequirements } from '../models/command'
import { isHTML } from '../util/types'

interface UsageOptions {
  noHide?: boolean
  noBreadcrumb?: boolean
}
class DefaultUsageOptions implements UsageOptions {}

/** lazily load repl */
function pexec(command: string) {
  return async () => {
    const { pexec } = await import('../repl/exec')
    pexec(command)
  }
}

/**
 * Map a asynchronous function to an array sequentially from front to
 * back.
 *
 */
async function promiseEach<T, R>(arr: T[], fn: (t: T) => Promise<R>): Promise<R[]> {
  const result = []
  for (const item of arr) {
    result.push(await fn(item))
  }
  return result
}

/** Create an HTML DIV to wrap around the given string */
const div = (
  str?: string | Promise<string> | Element,
  css: string | string[] = undefined,
  tag = 'div'
): HTMLElement => {
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
const span = (str?: string | Element, css?: string): HTMLElement => div(str, css, 'span')

/**
 * The start of every section, e.g. Usage:
 *
 */
const prefix = (str: string): HTMLElement => {
  const prefix = div(str, 'usage-error-title', 'h4')
  prefix.setAttribute('data-title', str)
  return prefix
}

/** A part of the main body of the usage message */
const bodyPart = (noMargin = false): HTMLElement => {
  const result = div()
  if (!noMargin) result.style.margin = '2em 0em 0 0'
  return result
}

/** render the given div with the default san serif font */
const sans = (div: HTMLElement): HTMLElement => {
  div.classList.add('sans-serif')
  return div
}

/** render the given div a bit smaller */
const smaller = (div: HTMLElement): HTMLElement => {
  div.classList.add('somewhat-smaller-text')
  return div
}
/** render the given div with white space line wrapping */
const wrap = (div: HTMLElement): HTMLElement => {
  div.style.display = 'block'
  div.style.whiteSpace = 'normal'
  return div
}

interface BreadcrumbWithClickCommand {
  label: string
  command: string
}
interface BreadcrumbWithLabelProvider {
  command: string
}
type BreadcrumbLabel = string | BreadcrumbWithLabelProvider | BreadcrumbWithClickCommand
function isBreadcrumbWithClickCommand(crumb: BreadcrumbLabel): crumb is BreadcrumbWithClickCommand {
  const breadcrumb = crumb as BreadcrumbWithClickCommand
  return !!(breadcrumb.label && breadcrumb.command)
}

/** make a single breadcrumb for the UI; defaultCommand means use the string as a command */
interface CrumbOptions {
  breadcrumb: BreadcrumbLabel
  preserveCase?: boolean
  noSlash?: boolean
}
const makeBreadcrumb = (options: CrumbOptions): Promise<Element> => {
  let cmd: string
  let label: string | Promise<string>

  if (typeof options.breadcrumb === 'string') {
    cmd = label = options.breadcrumb
  } else if (isBreadcrumbWithClickCommand(options.breadcrumb)) {
    cmd = options.breadcrumb.command
    label = options.breadcrumb.label
  } else {
    cmd = options.breadcrumb.command
    label = breadcrumbFromCommand(cmd)
  }

  return Promise.resolve(label).then(label => {
    const item = span()
    item.classList.add('bx--breadcrumb-item')

    const dom = span(label, 'bx--no-link')
    dom.setAttribute('data-label', label)
    item.appendChild(dom)

    if (!options.noSlash) {
      item.appendChild(span(isHeadless() ? '/' : '', 'bx--breadcrumb-item--slash'))
    }

    if (cmd) {
      dom.classList.add('bx--link')
      dom.onclick = pexec(cmd)
    }

    return item
  })
}

interface DetailedExample {
  command: string
  docs: string
}

export interface UsageRow {
  commandPrefix?: string
  commandSuffix?: string
  command?: string
  name?: string
  label?: string
  noclick?: boolean
  synonyms?: string[]
  alias?: string

  // yargs-parser-style narg; how many positional parameters are consumed?
  narg?: number

  // implicit entity ok for this attribute?
  implicitOK?: string[]

  // this attribute is not required if we match an implicit entity
  notNeededIfImplicit?: boolean

  // optional arg that consumes one of the required positional slots?
  consumesPositional?: boolean

  // positional optional?
  positional?: boolean

  // boolean form of string allowed?
  booleanOK?: boolean

  // assert true | false
  boolean?: boolean

  // assert numeric
  numeric?: boolean

  // assert argument names a local file
  file?: boolean

  aliases?: string[]
  hidden?: boolean
  advanced?: boolean
  example?: string
  dir?: boolean
  title?: string
  header?: string
  docs?: string
  partial?: boolean
  defaultValue?: boolean | string | number
  available?: UsageRow[]

  // allow users to provide a prefix substring of an `allowed` value
  allowedIsPrefixMatch?: boolean

  // enumeration of allowed values
  allowed?: (number | string | boolean)[]
}

interface Generator {
  command: string
  fn: (command: string) => UsageRow
}

type UsageRowOrGenerator = UsageRow | Generator

function isGenerator(row: UsageRowOrGenerator): row is Generator {
  return !!(row as Generator).fn
}

interface UsageSection {
  title: string
  rows: UsageRow[]
  nRowsInViewport?: number
}

interface TitledContent {
  title: string
  content: string
}

type YargsParserConfigurationValue = boolean
export interface YargsParserConfiguration {
  'camel-case-expansion'?: YargsParserConfigurationValue
  'short-option-groups'?: YargsParserConfigurationValue
  'duplicate-arguments-array'?: YargsParserConfigurationValue
}

export interface UsageModel extends CapabilityRequirements {
  // usage generator
  fn?: (command: string) => UsageModel

  // don't offer --help
  noHelp?: boolean

  // don't offer -h help alias
  noHelpAlias?: boolean

  // only enforce the given options
  onlyEnforceOptions?: boolean | string[]

  // yargs-parser configuration to override the default settings
  configuration?: YargsParserConfiguration

  hide?: boolean
  children?: Record<string, { route: string; usage?: UsageModel }>
  synonymFor?: string
  synonyms?: string[]

  breadcrumb?: string
  title?: string
  command?: string
  strict?: string
  docs?: string
  header?: string
  example?: string
  detailedExample?: DetailedExample | DetailedExample[]
  sampleInputs?: UsageRow[]
  intro?: TitledContent
  sections?: UsageSection[]
  commandPrefix?: string
  commandPrefixNotNeeded?: boolean
  commandSuffix?: string
  preserveCase?: boolean // in breadcrumbs
  parents?: BreadcrumbLabel[]
  related?: string[]
  available?: UsageRow[]
  required?: UsageRow[]
  optional?: UsageRow[]
  oneof?: UsageRow[]
  nRowsInViewport?: number | boolean
}

interface MessageWithCode {
  message?: string

  // support a couple of variants of "code"
  code?: number
  exitCode?: number
  statusCode?: number
}

type MessageLike = string | HTMLElement

export interface MessageWithUsageModel extends MessageWithCode {
  messageDom?: MessageLike

  usage?: UsageModel

  // allow for arbitrary attachments to help with error reporting
  extra?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

type UsageLike = MessageLike | MessageWithUsageModel //  | IUsageRowGenerator

export interface UsageErrorLike {
  code?: number
  statusCode?: number
  message?: string
  formattedMessage?: Promise<HTMLElement>
  stack?: string
  raw?: UsageLike
}

export function isMessageWithUsageModel(msg: UsageLike): msg is MessageWithUsageModel {
  const message = msg as MessageWithUsageModel
  return !!message.usage
}

export function isMessageWithCode(msg: UsageLike): msg is MessageWithCode {
  const message = msg as MessageWithCode
  return !!(message.message && (message.code || message.statusCode || message.exitCode))
}

export class UsageError extends Error implements CodedError, UsageErrorLike {
  public formattedMessage: Promise<HTMLElement>

  raw: UsageLike

  code: number

  constructor(message: UsageLike, extra?: UsageOptions) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
    this.raw = message
    this.code = isMessageWithCode(message) ? message.statusCode || message.code || message.exitCode : 500

    if (typeof message === 'string') {
      this.message = message
    } else {
      this.formattedMessage = format(message, extra)
    }
  }

  getUsageModel(): UsageModel {
    return (this.raw as MessageWithUsageModel).usage
  }

  static getFormattedMessage(err: UsageErrorLike): Promise<HTMLElement> {
    if (err.formattedMessage && !err.formattedMessage.then && Object.keys(err.formattedMessage).length === 0) {
      err.formattedMessage = format(err.raw)
    }

    return err.formattedMessage ? err.formattedMessage : Promise.resolve(span(err.message))
  }

  static isUsageError(error: Entity | UsageErrorLike): error is UsageErrorLike {
    const err = error as UsageError
    return !!(err.formattedMessage && err.code)
  }
}

export function isUsageError(error: Entity | UsageErrorLike): error is UsageErrorLike {
  return UsageError.isUsageError(error)
}

/**
 * Invoke a given command, and extract the breadcrumb title from the resulting usage model
 *
 */
const breadcrumbFromCommand = async (command: string): Promise<string> => {
  const { qexec } = await import('../repl/exec')
  const usageError: UsageError = await qexec(command, undefined, undefined, { failWithUsage: true })

  if (isMessageWithUsageModel(usageError.raw)) {
    const usage = usageError.raw.usage
    return usage.breadcrumb || usage.title
  } else {
    return usageError.message
  }
}

/**
 * Format the given usage message
 *
 */
const format = async (message: UsageLike, options: UsageOptions = new DefaultUsageOptions()): Promise<HTMLElement> => {
  debug('format message', message)

  if (typeof message === 'string') {
    // then the content is already formatted
    return Promise.resolve(span(message))
  } else if (isHTML(message)) {
    // same...
    return Promise.resolve(message)
    /* } else if (isGenerator<UsageLike>(message)) {
    // then message.fn is a generator, e.g. for command aliases
    return format(message.fn(message.command), undefined, options) */
  } else {
    // these are the fields of the usage message
    const usage: UsageModel = message.usage || {}

    const {
      command,
      docs,
      title,
      breadcrumb = title || command,
      header = docs && `${docs}.`,
      example,
      detailedExample,
      sampleInputs,
      intro,
      sections, // the more general case: the usage model has custom sections
      commandPrefix,
      commandPrefixNotNeeded,
      commandSuffix = '',
      preserveCase = false, // in breadcrumbs
      available,
      related,
      required,
      optional,
      oneof
    } = usage
    const outerCommandPrefix = commandPrefix
    const outerCommandSuffix = commandSuffix
    const outerCommand = command

    // the return value will be `result`; we will populate it with
    // those fields now; `body` is the flex-wrap portion of the
    // content
    const resultWrapper = div(undefined, 'usage-error-wrapper')
    const result = div(undefined, options.noHide ? '' : ['hideable', 'page-content'], 'p')
    const body = div()
    const left = div() // usage and detailedExample
    const right = div() // required and optional parameters

    // if we have a great many detailed examples, place them in a scroll region
    const scrollableDetailedExamples = detailedExample && Array.isArray(detailedExample) && detailedExample.length > 4

    if ((sections && sections.length > 1) || (scrollableDetailedExamples && sections && sections.length > 0)) {
      left.classList.add('fifty-fifty')
      right.classList.add('fifty-fifty')
    } else {
      left.style.marginRight = '2em'
    }

    if (message.message) {
      // then the repl wrapped around the usage model, adding an extra message string
      const messageString = message.message
      const messageDom = div(undefined, '', 'div')
      const prefacePart = span('')

      const messagePart = span(messageString, 'red-text usage-error-message-string')
      if (message.messageDom) {
        if (typeof message.messageDom === 'string') {
          messagePart.appendChild(document.createTextNode(message.messageDom))
        } else {
          messagePart.appendChild(message.messageDom)
        }
      }

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

    //
    // breadcrumb
    //
    if (!options.noBreadcrumb) {
      // breadcrumb model chain
      const parentChain = (usage.parents || []).map(breadcrumb => ({
        breadcrumb
      }))
      const thisCommand: CrumbOptions[] = breadcrumb ? [{ breadcrumb, noSlash: true, preserveCase }] : []
      const breadcrumbs: CrumbOptions[] = [...parentChain, ...thisCommand]

      // generate the breadcrumb Elements from the model
      const crumbs = await promiseEach(breadcrumbs, makeBreadcrumb)

      // attach the breadcrumb to the view
      const container = div(undefined, 'bx--breadcrumb bx--breadcrumb--no-trailing-slash', 'h2')
      result.appendChild(container)
      crumbs.forEach(breadcrumb => container.appendChild(breadcrumb))
    }

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
      let headerDiv = div(header, 'normal-text sans-serif')

      if (!isHeadless()) {
        try {
          /* const renderer = new Marked.Renderer()
          const marked = (_: string): string => Marked(_, { renderer })
          renderer.link = (href: string, title: string, text: string) => {
            return `<a class='bx--link' target='_blank' title="${title}" href="${href}">${text}</a>`
          } */

          headerDiv = div('', 'normal-text sans-serif marked-content')
          headerDiv.innerText = header // marked(header)
        } catch (err) {
          debug('error using marked', err)
        }
      }

      if (message.exitCode > 0 && message.exitCode !== 200) {
        // the underlying command emitted some sort of usage model in response to an error
        // e.g. `kubectl get pods --bogus
        headerDiv.classList.add('red-text')
      }

      result.appendChild(headerDiv)
    }

    body.style.display = 'flex'
    body.style.flexWrap = 'wrap'
    body.style.marginTop = '0.375em'
    body.appendChild(left)
    body.appendChild(right)
    result.appendChild(body)

    // keep track of the scroll regions we have created; if not
    // many, maybe we use outer scrolling inside of inner scrolling
    const scrollRegions: HTMLElement[] = []

    // any minimally formatted sections? e.g. `intro` and `section` fields
    const makeSection =
      (parent = right, noMargin = false) =>
      ({ title, content }: TitledContent) => {
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

      const html = example
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(\[[^[\]]+\])/g, '<span class="even-lighter-text">$1</span>') // lighter text for [optional args]
      const textPart = div()
      textPart.innerHTML = html

      left.appendChild(examplePart)
      examplePart.appendChild(prePart)
      examplePart.appendChild(textPart)

      textPart.style.color = 'var(--color-base0C)'
    }

    // detailed example command
    if (detailedExample) {
      const examples = !Array.isArray(detailedExample) ? [detailedExample] : detailedExample

      const examplePart = bodyPart()
      const prePart = prefix(examples.length === 1 ? 'Example' : 'Examples')
      left.appendChild(examplePart)
      examplePart.appendChild(prePart)

      // only if we there are other sections to show, render the
      // detailed examples in a scroll region
      const examplesInScrollRegion = examples.length > 4 && sections && sections.length > 0

      const rowsPart = examplesInScrollRegion ? div(undefined, ['scrollable', 'scrollable-auto']) : examplePart
      if (examplesInScrollRegion) {
        scrollRegions.push(rowsPart)

        const nRowsInViewport = 6
        examplePart.appendChild(rowsPart)
        rowsPart.style.maxHeight = `calc(${nRowsInViewport} * 3em + 1px)`
      }

      examples.forEach(({ command, docs }) => {
        const exampleContainer = div(undefined, 'present-as-quotation')
        rowsPart.appendChild(exampleContainer)

        const textPart = div(command)
        const docPart = sans(div(docs, 'lighter-text'))

        exampleContainer.appendChild(textPart)
        exampleContainer.appendChild(docPart)

        textPart.classList.add('example-command-text')
      })
    }

    /**
     * Render a table of options
     *
     */
    const makeTable = (
      title: string,
      rows: UsageRow[],
      parent = right,
      nRowsInViewport = (usage && usage.nRowsInViewport) || 5
    ): HTMLElement => {
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
        const tableScrollable = div(undefined, ['scrollable', 'scrollable-auto'])
        const nRows =
          sections && (sections.length === 2 || (sections.length === 1 && scrollableDetailedExamples))
            ? 8
            : nRowsInViewport
        tableScrollable.style.maxHeight = `calc(${nRows} * 3em + 1px)`
        tableScrollable.appendChild(table)
        wrapper.appendChild(tableScrollable)
        scrollRegions.push(tableScrollable)
      } else {
        wrapper.appendChild(table)
      }

      // render the rows
      const renderRow = (rowData: UsageRowOrGenerator) => {
        if (isGenerator(rowData)) {
          // then rowData is a generator for aliases
          renderRow(rowData.fn(rowData.command))
          return
        }

        const isDir = rowData.available !== undefined || false

        // fields of the row model
        // debug('row', rowData)
        const {
          commandPrefix = outerCommandPrefix,
          commandSuffix = outerCommandSuffix,
          command = outerCommand,
          name = command,
          label = name,
          noclick = false,
          synonyms,
          alias,
          numeric,
          aliases = (synonyms || [alias]).filter(x => x),
          hidden = false,
          advanced = false,
          example = numeric && 'N',
          title,
          header,
          docs = header || title,
          allowed,
          defaultValue
        } = rowData

        // row is either hidden or only shown for advanced users
        if (hidden) return
        if (advanced) return // for now

        const row = table.insertRow(-1)
        row.className = 'log-line entity'

        const cmdCell = row.insertCell(-1)
        const docsCell = row.insertCell(-1)
        const cmdPart = span(label && label.replace(/=/g, '=\u00ad'), 'pre-wrap')
        const dirPart = isDir && label && span('/')
        const examplePart = example && span(example, label || dirPart ? 'left-pad lighter-text smaller-text' : '') // for -p key value, "key value"
        const aliasesPart = aliases && aliases.length > 0 && span(undefined, 'lighter-text smaller-text small-left-pad')
        const docsPart = span(docs)
        const allowedPart = allowed && smaller(span(undefined))

        // for repl.exec,
        const commandForExec = (alias: string, cmd = ''): string => {
          return `${
            commandPrefix && !commandPrefixNotNeeded ? commandPrefix + ' ' : ''
          }${alias} ${cmd} ${commandSuffix}`
        }

        cmdCell.className = 'log-field'
        docsCell.className = 'log-field'

        cmdPart.style.fontWeight = '500'
        wrap(sans(docsPart))

        // command aliases
        if (aliases) {
          aliases
            .filter(x => x)
            .forEach(alias => {
              const cmdCell = span()
              const cmdPart = span(alias /* noclick ? '' : 'clickable clickable-blatant' */) // don't make aliases clickable
              const dirPart = isDir && span('/')

              if (!noclick) {
                cmdPart.onclick = pexec(commandForExec(alias))
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
        if (examplePart) cmdCell.appendChild(examplePart)
        docsCell.appendChild(docsPart)
        if (allowedPart) docsCell.appendChild(allowedPart)

        if (command) {
          if (!isDir) cmdPart.classList.add('semi-bold')
          if (!noclick) {
            cmdPart.classList.add('clickable')
            cmdPart.classList.add('clickable-blatant')
            cmdPart.setAttribute('tabindex', '0')
            cmdPart.onclick = async () => {
              return pexec(commandForExec(command, name !== command ? name : undefined))()
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
      const defaultNRowsInViewport = (idx: number, nRows: number): number => {
        if (idx === sections.length - 1 && sections.length % 2 === 0) {
          return sections.length === 2 ? nRows : 5
        } // otherwise, accept global default
      }

      const stringSections = sections.filter(_ => typeof _.rows === 'string')
      const tableSections = sections.filter(_ => Array.isArray(_.rows))
      debug('string', stringSections)
      debug('table', tableSections)

      tableSections.sort(({ rows: a }, { rows: b }) => a.length - b.length)

      const nRowsOf = (section: UsageSection, idx: number) => {
        debug(
          'nRowsOf',
          section,
          section.rows.length,
          section.nRowsInViewport,
          defaultNRowsInViewport(idx, section.rows.length)
        )
        return Math.min(
          section.rows.length,
          section.nRowsInViewport || defaultNRowsInViewport(idx, section.rows.length) || section.rows.length
        )
      }

      const totalRows = tableSections.reduce((total, section, idx) => {
        return total + nRowsOf(section, idx)
      }, 0)

      stringSections.forEach(section => {
        const { title, rows } = section
        makeTable(title, rows, left)
      })

      let runningSum = 0
      tableSections.forEach((section, idx) => {
        const { title, rows, nRowsInViewport } = section

        runningSum += nRowsOf(section, idx)
        debug('running', runningSum, totalRows)
        makeTable(
          title,
          rows,
          runningSum < totalRows / 2 ? left : right,
          nRowsInViewport || defaultNRowsInViewport(idx, rows.length)
        )
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
        clickablePart.onclick = pexec(command)

        listPart.appendChild(commandPart)
      })
    }

    // only one scroll region? then we might as well use outer scrolling
    if (scrollRegions.length === 1) {
      scrollRegions[0].classList.remove('scrollable')
      scrollRegions[0].classList.remove('scrollable-auto')
      scrollRegions[0].style.maxHeight = ''
    }

    return resultWrapper
  }
}

export default UsageError
