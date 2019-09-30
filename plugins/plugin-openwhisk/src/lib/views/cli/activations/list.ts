/*
 * Copyright 2017,2019 IBM Corporation
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

import * as Debug from 'debug'
import * as prettyPrintDuration from 'pretty-ms'

import { Commands, REPL, Tables, UI } from '@kui-shell/core'

import { Activation } from '../../../models/activation'

declare let hljs

const debug = Debug('plugins/openwhisk/views/cli/activations/list')

export interface ActivationListRow extends Tables.Row {
  namespace?: string

  annotations?: any[] // eslint-disable-line @typescript-eslint/no-explicit-any

  sessionId?: string

  activationId?: string

  statusCode?: number
}

export interface ActivationListTable extends Tables.Table {
  body: ActivationListRow[]
}

/**
 * Turn a key->value map into a '--key1 value1 --key2 value2' cli opt string
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToOptions = (baseMap: Record<string, any>, overrides = {}) => {
  const map = Object.assign({}, baseMap, overrides)
  return Object.keys(map).reduce((opts, key) => {
    if (key === '_' || typeof map[key] === 'object') {
      return opts
    } else {
      return `${opts} --${key} ${REPL.encodeComponent(map[key])}`
    }
  }, '')
}

function isArrayOfStrings(a: (Activation | string)[]): a is string[] {
  return typeof a[0] === 'string'
}

/**
 * Fetch activation records
 *
 */
const fetch = async (activationIds: Activation[] | string[]): Promise<Activation[]> => {
  debug('fetching', activationIds)

  if (!isArrayOfStrings(activationIds)) {
    return activationIds
  } else {
    const activations: Activation[] = await Promise.all(
      activationIds.map(_ => {
        return REPL.qexec<Activation>(`wsk activation get ${_}`).catch(err => {
          console.error(err)
          return undefined
        })
      })
    )

    return activations.filter(x => !!x) // error recovery. remove blanks
  }
}

/**
 * Show an activation
 *
 */
const show = (activation: Activation): string => {
  debug('show', activation)

  if (activation.logs && activation.logs.length === 1 && activation.logs[0].match(/^[0-9a-f]{32}$/)) {
    // if log size == 1 and the log matches activation id regex

    // optimistically assume this is a session. the sesion get
    // code will fall back to an activation get, if not
    const sessionId = activation.logs[0]
    return `wsk session get ${sessionId}`
  } else if (activation.sessionId) {
    // we know for certain that this is a session
    return `wsk session get ${activation.sessionId}`
  } else {
    // we know of certain that this is a plain activation, and
    // already have it in hand! no need to re-fetch
    return `wsk activation get ${activation.activationId}`
  }
}

const findItemInAnnotations = (name: string, activation?: Activation): number => {
  // this function is for finding waitTime of initTime in activation annotations
  if (activation && activation.annotations && activation.annotations.find(item => item.key === name)) {
    return activation.annotations.find(item => item.key === name).value as number
  } else {
    return 0
  } // if no time item, return 0
}

interface Args {
  tab: UI.Tab
  entity?: Activation
  activationIds: Activation[] | string[]
  container: Element
  noCrop?: boolean
  noPip?: boolean
  showResult?: boolean
  showStart?: boolean
  showTimeline?: boolean
  skip?: number
  limit?: number
  parsedOptions?: Commands.ParsedOptions
}

const _render = (args: Args) => {
  const {
    entity,
    activationIds,
    container,
    noCrop = false,
    noPip = false,
    showResult = false,
    showStart = false,
    showTimeline = true,
    skip,
    limit,
    parsedOptions
  } = args
  const tab: UI.Tab = args.tab

  const currentRows: NodeListOf<HTMLTableRowElement> = container.querySelectorAll('tr.log-line')

  // trim any extra rows
  for (let idx = 0; idx < Math.min(currentRows.length, activationIds.length); idx++) {
    debug('showing', idx)
    currentRows[idx].classList.remove('hide')
  }
  for (let idx = activationIds.length; idx < currentRows.length; idx++) {
    debug('hiding2', idx)
    currentRows[idx].classList.add('hide')
  }

  const legendHTMLtext = `<div class='legend-stripe'><div class='legend-entry' data-legend-type='queueing-delays' data-balloon='The time this activation waited for free execution resources' data-balloon-pos='left'>Queueing Delays<div class='legend-icon is-waitTime'></div></div><div class='legend-entry' data-legend-type='container-initialization' data-balloon='The "cold start time", i.e. time spent initializing a container' data-balloon-pos='left'>Container Initialization<div class='legend-icon is-initTime'></div></div><div class='legend-entry' data-legend-type='execution-time' data-balloon='The time this activation spent executing your code' data-balloon-pos='left'>Execution Time<div class='legend-icon is-runTime'></div></div><div class='legend-entry' data-legend-type='failures' data-balloon='The activation failed to complete' data-balloon-pos='left'>Failures<div class='legend-icon is-success-false'></div></div></div>`

  let legend = container.querySelector('.legend-trace')
  if (!legend) {
    legend = document.createElement('div')

    if (entity) {
      // if we have an entity, then we are rendering the Trace tab
      container.appendChild(legend)

      // add a legned
      legend.className = 'legend-trace'
      legend.innerHTML = legendHTMLtext
    } else {
      // create a legend only for `activation list`.
      legend.className = 'legend-trace legend-list'
      legend.innerHTML = legendHTMLtext
      // insert the legend before logTable
      container.appendChild(legend)
    }
  }

  let logTable: HTMLTableElement = container.querySelector('table.log-lines')
  const newTable = !logTable
  if (newTable) {
    logTable = document.createElement('table')
    logTable.className = 'log-lines fixed-table-layout log-lines-loose'
    logTable.setAttribute('kui-table-style', 'Medium')

    if (entity) {
      // for the sidecar only, clean things out
      UI.empty(container)
    }

    container.appendChild(logTable)
  }

  // picture in picture
  const pip = (cmd: string) => {
    return () => REPL.pexec(cmd)
  }

  return Promise.all([
    fetch(activationIds).then(activations => (entity ? [entity, ...activations] : activations)), // add entity to the front
    parsedOptions &&
      (REPL.qexec(`wsk activation count ${parsedOptions.name ? parsedOptions.name : ''}`) as Promise<number>)
  ]).then(([activations, count]) => {
    // duration of the activation. this will be helpful for
    // normalizing the bar dimensions
    const first = activations.length - 1
    const start = entity
      ? entity.start
      : activations[first].start - findItemInAnnotations('waitTime', activations[first])
    const maxEnd = activations.reduce((max, activation) => Math.max(max, activation.end || activation.start + 1), 0) // the last one in the list might not have the highest end
    const dur = Math.max(1, entity ? entity.end - entity.start : maxEnd - start, maxEnd - start)

    let tgap = 0
    let gaps: number[] // eslint-disable-line prefer-const
    const normalize = (value: number, idx: number) => {
      // console.error(value, value-start, gaps[idx], value-start-gaps[idx], dur-tgap, (value - start - gaps[idx]) / (dur - tgap))
      return (value - start - gaps[idx]) / (dur - tgap)
    }

    gaps = new Array(activations.length).fill(0)
    if (!entity) {
      let residualDur = dur // after subtracing out gaps

      for (let idx = activations.length - 2; idx >= 0; idx--) {
        const activation = activations[idx]
        const previous = activations[idx + 1]
        const gap =
          activation.start - findItemInAnnotations('waitTime', activation) - (previous.end || previous.start + 1)
        if (gap > 0) {
          const ngap = gap / residualDur
          if (gap > 10000 || ngap > 0.05) {
            tgap += gap
            residualDur -= gap

            for (let ii = idx; ii >= 0; ii--) {
              gaps[ii] = gaps[ii] + gap
            }
          }
        }
      }
    }

    // note: for statusCode === 0
    //   see https://github.com/apache/incubator-openwhisk/blob/master/common/scala/src/main/scala/whisk/core/entity/ActivationResult.scala#L58

    // if we are paginating, and go to the last page, make sure to
    // hide rows that we don't need
    if (currentRows) {
      for (let idx = activations.length; idx < currentRows.length; idx++) {
        const line = currentRows[idx]
        line.classList.add('not-displayed')
      }
    }

    activations.forEach((activation, idx) => {
      //
      // in this block, we are rendering a row for one activation
      //

      // if statusCode is undefined, check activation.response for success/fail info
      // need to avoid isSuccess is set to undefined, as (false || undefined) returns undefined
      // and re: statusCode === 0, see the note just above
      const isSuccess = !activation.end
        ? true // rules and triggers. always successful?
        : activation.statusCode !== undefined
        ? activation.statusCode === 0
        : activation.response && activation.response.success

      // row dom
      let line: HTMLTableRowElement = currentRows && currentRows[idx]
      const newLine = !line
      if (newLine) line = logTable.insertRow(-1)
      else line.classList.remove('not-displayed')
      line.className = 'log-line entity'
      line.classList.add(activation.sessionId ? 'session' : 'activation')
      line.setAttribute('data-name', activation.name)
      if (entity && idx === 0) line.classList.add('log-line-root')

      let cellIdx = 0
      const nextCell = (): HTMLTableCellElement =>
        newLine ? line.insertCell(-1) : (line.children[cellIdx++] as HTMLTableCellElement)

      // column 1: activationId cell
      const id = nextCell()
      const clicky: HTMLElement = newLine ? document.createElement('span') : id.querySelector('.clickable')
      clicky.className = 'clickable'
      if (newLine) id.appendChild(clicky)
      id.className = 'log-field activationId'
      if (noCrop) id.classList.add('full-width')
      clicky.innerText = activation.originalActivationId || activation.activationId
      id.setAttribute('data-activation-id', id.innerText)
      clicky.onclick = pip(show(activation))

      // column 2: name cell
      const name = nextCell()
      const nameClick: HTMLSpanElement = newLine ? document.createElement('span') : name.querySelector('.clickable')
      const nameWithPackage = activation.annotations
        .find(_ => _.key === 'path')
        .value.toString()
        .replace(`${activation.namespace}/`, '')
      name.className = 'slightly-deemphasize log-field entity-name'
      nameClick.className = 'clickable'
      nameClick.innerText = nameWithPackage
      if (newLine) name.appendChild(nameClick)

      // command to be executed when clicking on the entity name cell
      const path = activation.annotations && activation.annotations.find(({ key }) => key === 'path')
      const gridCommand = !path
        ? `grid ${REPL.encodeComponent(`/${activation.namespace}/${activation.name}`)}` // triggers, at least, have no path annotation
        : `grid ${REPL.encodeComponent(`/${path.value}`)}`

      nameClick.onclick = pip(gridCommand)

      // column 3: duration cell
      const duration = nextCell()
      duration.className = 'somewhat-smaller-text log-field log-field-right-align duration-field'
      duration.classList.add(isSuccess ? 'green-text' : 'red-text')
      if (activation.end) {
        duration.innerText = prettyPrintDuration(activation.end - activation.start)
      } else {
        // for trigger and rule, set duration to be 1ms. If duration is not set, qtip will show 'lasting undefined'
        duration.innerText = prettyPrintDuration(1)
      }

      // column 4: success cell
      /* const success = nextCell()
        success.className = 'smaller-text lighter-text log-field success-field very-narrow'
        UI.empty(success)
        const successBadge = document.createElement('badge')
        successBadge.classList.add(isSuccess ? 'green-background' : 'red-background')
        successBadge.innerText = isSuccess ? 'OK' : 'Failed'
        success.appendChild(successBadge) */

      // column 5|6?: result cell
      if (showResult) {
        const result = nextCell()
        const code = document.createElement('code')
        code.classList.add('json')
        result.appendChild(code)
        result.className = 'somewhat-smaller-text lighter-text log-field activation-result'
        if (activation.response) {
          code.innerText = JSON.stringify(activation.response.result || {}).substring(0, 40)
          setTimeout(() => hljs.highlightBlock(code), 0)
        }
      }

      // column 5|6|7: bar chart cell
      if (showTimeline) {
        const timeline = nextCell()
        UI.empty(timeline)

        const isRootBar = entity && idx === 0 // for sequence traces, show the sequence bar a bit differently

        timeline.className = 'log-field log-line-bar-field'

        // queueing delays and container initialization time
        const waitTime = findItemInAnnotations('waitTime', activation) || 0
        const initTime = findItemInAnnotations('initTime', activation) || 0

        // execution time bar
        const bar = document.createElement('div')
        bar.style.position = 'absolute'
        bar.classList.add('log-line-bar')
        bar.classList.add(`is-success-${isSuccess}`)
        const left = normalize(activation.start + initTime, idx)
        const right = normalize(idx === 0 ? maxEnd : activation.end || activation.start + initTime + 1, idx) // handle rules and triggers as having dur=1
        const width = right - left

        // on which side should we render the tooltip?
        const balloonPos = right > 0.9 ? 'left' : 'right'

        bar.style.left = 100 * left + '%'
        bar.style.width = 100 * width + '%'
        bar.onclick = pip(show(activation))
        bar.setAttribute(
          'data-balloon',
          prettyPrintDuration(activation.end ? activation.end - activation.start - initTime : initTime)
        )
        bar.setAttribute('data-balloon-pos', balloonPos)
        bar.onmouseover = () => legend.setAttribute('data-hover-type', 'execution-time')
        bar.onmouseout = () => legend.removeAttribute('data-hover-type')

        // container initialization bar
        let initTimeBar: HTMLElement
        let waitTimeBar: HTMLElement
        if (initTime > 0 && !isRootBar) {
          initTimeBar = document.createElement('div')
          const l = normalize(activation.start, idx)
          const w = normalize(activation.start + initTime, idx) - l

          initTimeBar.style.left = 100 * l + '%'
          initTimeBar.style.width = 100 * w + '%'
          initTimeBar.style.position = 'absolute'
          initTimeBar.classList.add('log-line-bar')
          initTimeBar.classList.add('is-initTime')
          initTimeBar.onmouseover = () => legend.setAttribute('data-hover-type', 'container-initialization')
          initTimeBar.onmouseout = () => legend.removeAttribute('data-hover-type')

          // activation can fail at init time - if that's the case, initTime === duration
          if (initTime === activation.duration) {
            initTimeBar.classList.add(`is-success-false`)
          } else {
            initTimeBar.classList.add(`is-success-true`)
          }

          initTimeBar.onclick = pip(show(activation))
          initTimeBar.setAttribute('data-balloon', prettyPrintDuration(initTime))
          initTimeBar.setAttribute('data-balloon-pos', balloonPos)
        }

        // queueing delays bar
        if (waitTime > 0 && !isRootBar) {
          waitTimeBar = document.createElement('div')
          const l = normalize(activation.start - waitTime, idx)
          const w = normalize(activation.start, idx) - l

          waitTimeBar.style.left = 100 * l + '%'
          waitTimeBar.style.width = 100 * w + '%'
          waitTimeBar.style.position = 'absolute'
          waitTimeBar.classList.add('log-line-bar')
          waitTimeBar.classList.add('is-waitTime')
          waitTimeBar.onclick = pip(show(activation))
          waitTimeBar.setAttribute('data-balloon', prettyPrintDuration(waitTime))
          waitTimeBar.setAttribute('data-balloon-pos', balloonPos)
          waitTimeBar.onmouseover = () => legend.setAttribute('data-hover-type', 'queueing-delays')
          waitTimeBar.onmouseout = () => legend.removeAttribute('data-hover-type')
        }

        // here, we have to be careful to stack the bars in an order so that the tooltips will stack on top
        // see shell issue #168
        if (balloonPos === 'right') {
          timeline.appendChild(bar)
          if (initTimeBar) timeline.appendChild(initTimeBar)
          if (waitTimeBar) timeline.appendChild(waitTimeBar)
        } else {
          if (waitTimeBar) timeline.appendChild(waitTimeBar)
          if (initTimeBar) timeline.appendChild(initTimeBar)
          timeline.appendChild(bar)
        }
      } // now we're done rendering the timeline bars

      // column n: start cell
      if (showStart) {
        const start = nextCell()
        const startInner = newLine ? document.createElement('span') : start.querySelector('span')
        const previous = activations[idx - 1]
        const previousStart = previous && previous.start - findItemInAnnotations('waitTime', previous)
        const time = UI.PrettyPrinters.time(
          activation.start - findItemInAnnotations('waitTime', activation),
          'short',
          previousStart
        )
        start.className =
          'somewhat-smaller-text lighter-text log-field log-field-right-align start-time-field timestamp-like'
        if (newLine) start.appendChild(startInner)
        if (typeof time === 'string') {
          startInner.innerText = time
        } else {
          UI.empty(startInner)
          startInner.appendChild(time)
        }
      }
    })

    // paginator
    if (!entity) {
      let description: HTMLElement
      let prev: HTMLElement
      let next: HTMLElement

      if (newTable) {
        const paginator = document.createElement('div')
        const leftButtons = document.createElement('div')
        const rightButtons = document.createElement('div')

        description = document.createElement('span')
        prev = document.createElement('i')
        next = document.createElement('i')

        container.appendChild(paginator)
        paginator.classList.add('list-paginator')

        // left-fill button box
        paginator.appendChild(leftButtons)
        leftButtons.classList.add('list-paginator-left-buttons')

        // show summary buttons
        paginator.appendChild(rightButtons)
        rightButtons.classList.add('list-paginator-right-buttons')
        const buttons = [
          {
            command: 'summary',
            icon:
              '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/1600/svg" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M29 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2zm-2 0v4H5V5zm0 22H5v-4h22zm0-6H5v-4h22zm0-6H5v-4h22z"></path></svg>',
            balloon: 'Open a statistical summary view'
          },
          // 'timeline', // disabled for now shell issue #794
          {
            command: 'grid',
            icon:
              '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M12 4H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 8H6V6h6zm14-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 8h-6V6h6zm-14 6H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zm0 8H6v-6h6zm14-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zm0 8h-6v-6h6z"></path></svg>',
            balloon: 'Open a grid view',
            balloonPos: 'up-left'
          }
        ]
        buttons.forEach(({ command, icon, balloon, balloonPos = 'up-left' }) => {
          const buttonContainer = document.createElement('span')
          const button = document.createElement('i')

          leftButtons.appendChild(buttonContainer)

          buttonContainer.className = 'graphical-icon'
          buttonContainer.appendChild(button)
          buttonContainer.setAttribute('data-balloon', balloon)
          buttonContainer.setAttribute('data-balloon-pos', balloonPos)

          const iconContainer = document.createElement('div')
          iconContainer.style.display = 'flex'
          iconContainer.innerHTML = icon
          button.appendChild(iconContainer)
          button.classList.add('clickable')

          buttonContainer.setAttribute('data-button-command', command)
          buttonContainer.onclick = () => REPL.pexec(command)
        })

        // description of current page
        description.className = 'list-paginator-description'
        rightButtons.appendChild(description)

        // forward and back buttons
        rightButtons.appendChild(prev)
        rightButtons.appendChild(next)
        prev.className = 'list-paginator-button list-paginator-button-prev'
        next.className = 'list-paginator-button list-paginator-button-next'

        const nextSVG = document.createElement('span')
        nextSVG.innerHTML =
          '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M22 16L12 26l-1.4-1.4 8.6-8.6-8.6-8.6L12 6z"></path></svg>'
        next.appendChild(nextSVG)

        const prevSVG = document.createElement('span')
        prevSVG.innerHTML =
          '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M10 16L20 6l1.4 1.4-8.6 8.6 8.6 8.6L20 26z"></path></svg>'
        prev.appendChild(prevSVG)
      } else {
        const paginator = container.querySelector('.list-paginator')
        description = paginator.querySelector('.list-paginator-description')
        prev = paginator.querySelector('.list-paginator-button.list-paginator-button-prev')
        next = paginator.querySelector('.list-paginator-button.list-paginator-button-next')
      }

      // paginator description text
      const ofNText =
        activations.length > 0 && !activations[0].sessionId
          ? ` of ${count < 10000 ? count : count.toLocaleString()}`
          : ''
      description.innerText = `${skip + 1}\u2013${skip + activationIds.length} items${ofNText}`

      // pagination click handlers
      const goto = (skip: number) => () => {
        const listCommand = activations.every(activation => activation.sessionId !== undefined)
          ? 'session list'
          : 'wsk activation list'
        return REPL.qexec(`${listCommand} ${mapToOptions(parsedOptions, { skip })}`)
          .then((activations: ActivationListTable) => activations.body)
          .then(activationIds => {
            if (activationIds.length === 0) {
              // we're at the end! disable the next button
              next.classList.add('list-paginator-button-disabled')
              delete next.onclick
            } else {
              _render({
                activationIds: activationIds.map(_ => _.activationId),
                container,
                noCrop,
                noPip,
                showResult,
                showStart,
                showTimeline,
                skip,
                limit,
                tab,
                parsedOptions
              })
            }
          })
      }
      if (skip === 0) {
        // disable the back button when we're on the first page
        prev.classList.add('list-paginator-button-disabled')
      } else {
        // otherwise, onclick go back a page
        prev.classList.remove('list-paginator-button-disabled')
        prev.onclick = goto(skip - limit)
      }

      if (skip + limit >= count) {
        // we're already at the end, so disable the next button
        next.classList.add('list-paginator-button-disabled')
      } else {
        next.classList.remove('list-paginator-button-disabled')
        next.onclick = goto(skip + limit)
      }
    } // end of paginator

    // try $ list; $ list; then paginate. this avoids chrome
    // scrolling up a bit after the pagination completes. we
    // did a UI.empty, so perhaps chrome thinks
    // that it needs to scorll a bit. this seems like a chrome
    // bug to me, but the following seems to work around
    // it. NMM 20180106
    container.scrollIntoView()

    return true // success
  })
}

/**
 * Given a list of activationIds, render a list view and place it in
 * the given container
 *
 */
export const render = (opts: Args) => {
  debug('render', opts)

  try {
    _render(opts)
  } catch (err) {
    console.error(err)
  }
}

interface Options extends Commands.ParsedOptions {
  skip?: string
  limit?: string
}

/**
 * A handler intended to be passed to cli.registerListView
 *
 */
export const renderActivationListView = (
  tab: UI.Tab,
  activationsTable: Tables.Table,
  container: Element,
  parsedOptions: Options
) => {
  const activations = activationsTable.body as Activation[]
  debug('rendering activation list view', activations)

  const subset = Object.assign({}, parsedOptions)
  delete subset._ // this comes from yargs-parser
  delete subset['User-Agent'] // see openwhisk-core, we add the user-agent fields there
  delete subset['noUserAgent'] // ibid

  // these are from owOpts isLinxu in openwhisk-core
  delete subset.timeout
  delete subset.agent

  render({
    tab,
    activationIds: activations,
    container,
    parsedOptions: subset,
    skip: parsedOptions.skip ? parseInt(parsedOptions.skip, 10) : 0,
    limit: parsedOptions.limit ? parseInt(parsedOptions.limit, 10) : activations.length,
    noPip: true,
    showResult: false,
    showStart: true,
    showTimeline: !parsedOptions || !parsedOptions.simple
  })

  if (activations.length > 0) {
    container.setAttribute('kui-table-style', 'None')
    ;(container.parentNode as HTMLElement).classList.add('result-as-table')
    ;(container.parentNode as HTMLElement).classList.add('result-as-table-full-width')
  }
}
