/*
 * Copyright 2019 IBM Corporation
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
import { Tab } from '@kui-shell/core/webapp/cli'
import { prettyPrintTime } from '@kui-shell/core/webapp/util/time'
import { removeAllDomChildren } from '@kui-shell/core/webapp/util/dom'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { Badge } from '@kui-shell/core/webapp/views/sidecar'

import { KubeResource } from '@kui-shell/plugin-k8s/lib/model/resource'
import { ActivationLikeFull as ActivationLike } from '@kui-shell/plugin-wskflow/lib/activation'

import success from '../../lib/success'
import { ResponseObject } from './flow'
import { getPipelineFromRef, getTasks } from '../fetch'
import { Pipeline, PipelineRun, Task, TaskRef } from '../resource'

const debug = Debug('plugins/tekton/models/modes/trace')

interface RenderOpts {
  noPip?: boolean
  noCrop?: boolean
  showStart?: boolean
  showTimeline?: boolean
}

/**
 * Render a trace view in the given container
 *
 */
export const render = (tab: Tab, activations: ActivationLike[], container: Element, opts: RenderOpts = {}): void => {
  const { noCrop = false, showStart = false, showTimeline = true } = opts

  debug('trace', activations)

  // add a legned
  const legendHTMLtext = `<div class='legend-stripe'><div class='legend-entry' data-legend-type='queueing-delays' data-balloon='The time this activation waited for free execution resources' data-balloon-pos='left'>Queueing Delays<div class='legend-icon is-waitTime'></div></div><div class='legend-entry' data-legend-type='container-initialization' data-balloon='The "cold start time", i.e. time spent initializing a container' data-balloon-pos='left'>Container Initialization<div class='legend-icon is-initTime'></div></div><div class='legend-entry' data-legend-type='execution-time' data-balloon='The time this activation spent executing your code' data-balloon-pos='left'>Execution Time<div class='legend-icon is-runTime'></div></div><div class='legend-entry' data-legend-type='failures' data-balloon='The activation failed to complete' data-balloon-pos='left'>Failures<div class='legend-icon is-success-false'></div></div></div>`
  const legend = document.createElement('div')
  container.appendChild(legend)
  legend.className = 'legend-trace legend-list'
  legend.innerHTML = legendHTMLtext

  const logTable = document.createElement('table')
  logTable.className = 'log-lines log-lines-loose'
  container.appendChild(logTable)

  // duration of the activation. this will be helpful for
  // normalizing the bar dimensions
  const first = 0
  const start = activations[first].start
  const maxEnd = activations.reduce((max, activation) => Math.max(max, activation.end || activation.start + 1), 0) // the last one in the list might not have the highest end
  const dur = Math.max(1, maxEnd - start, maxEnd - start)

  const tgap = 0
  const gaps: number[] = new Array(activations.length).fill(0)
  const normalize = (value, idx) => {
    // console.error(value, value-start, gaps[idx], value-start-gaps[idx], dur-tgap, (value - start - gaps[idx]) / (dur - tgap))
    return (value - start - gaps[idx]) / (dur - tgap)
  }

  /*      if (!entity) {
        let residualDur = dur // after subtracing out gaps

        for (let idx = activations.length - 2; idx >= 0; idx--) {
          const activation = activations[idx]
          const previous = activations[idx + 1]
          const gap = activation.start - findItemInAnnotations('waitTime', activation) - (previous.end || (previous.start + 1))
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
      } */

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
    const line = logTable.insertRow(-1)
    line.className = 'log-line entity'
    line.classList.add('activation')
    line.setAttribute('data-name', activation.name)
    if (idx === 0) line.classList.add('log-line-root')

    const nextCell = () => line.insertCell(-1)

    // column 1: activationId cell
    const id = nextCell()
    const clicky = document.createElement('span') as HTMLElement
    clicky.className = 'clickable'
    id.appendChild(clicky)
    id.className = 'log-field'
    if (noCrop) id.classList.add('full-width')
    clicky.innerText = activation.activationId
    id.setAttribute('data-activation-id', id.innerText)
    // clicky.onclick = pip(show(activation))

    // column 2: name cell
    const name = nextCell()
    const nameClick = document.createElement('span') as HTMLElement
    name.className = 'slightly-deemphasize log-field entity-name'
    nameClick.className = 'clickable'
    nameClick.innerText = activation.name
    name.appendChild(nameClick)

    // command to be executed when clicking on the entity name cell
    /* const path = activation.annotations && activation.annotations.find(({ key }) => key === 'path')
    const gridCommand = activation.sessionId
      ? `grid ${repl.encodeComponent(activation.name)}` // for apps, the activation.name field is the app name
      : !path ? `grid ${repl.encodeComponent(`/${activation.namespace}/${activation.name}`)}` // triggers, at least, have no path annotation
    : `grid ${repl.encodeComponent(`/${path.value}`)}`
    nameClick.onclick = pip(gridCommand) */

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
       removeAllDomChildren(success)
       const successBadge = document.createElement('badge')
       successBadge.classList.add(isSuccess ? 'green-background' : 'red-background')
       successBadge.innerText = isSuccess ? 'OK' : 'Failed'
       success.appendChild(successBadge) */

    // queueing delays and container initialization time
    const waitTime = 0
    const initTime = 0

    // column 5|6|7: bar chart cell
    if (showTimeline) {
      const timeline = nextCell()
      removeAllDomChildren(timeline)

      const isRootBar = idx === 0

      timeline.className = 'log-field log-line-bar-field'

      // execution time bar
      const bar = document.createElement('div') as HTMLElement
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
      // bar.onclick = pip(show(activation))
      bar.setAttribute(
        'data-balloon',
        prettyPrintDuration(activation.end ? activation.end - activation.start - initTime : initTime)
      )
      bar.setAttribute('data-balloon-pos', balloonPos)
      bar.onmouseover = () => legend.setAttribute('data-hover-type', isSuccess ? 'execution-time' : 'failures')
      bar.onmouseout = () => legend.removeAttribute('data-hover-type')

      // container initialization bar
      let initTimeBar
      let waitTimeBar
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

        // initTimeBar.onclick = pip(show(activation))
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
        // waitTimeBar.onclick = pip(show(activation))
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
      const startInner = document.createElement('span') as HTMLElement
      const previous = activations[idx - 1]
      const previousWaitTime = 0
      const previousStart = previous && previous.start - previousWaitTime
      const time = prettyPrintTime(activation.start - waitTime, 'short', previousStart)
      start.className =
        'somewhat-smaller-text lighter-text log-field log-field-right-align start-time-field timestamp-like'
      start.appendChild(startInner)
      if (typeof time === 'string') {
        startInner.innerText = time
      } else {
        removeAllDomChildren(startInner)
        startInner.appendChild(time)
      }
    }
  })
}

function makeRunActivationLike(run: PipelineRun): ActivationLike {
  const start = run && run.status && run.status.startTime && new Date(run.status.startTime)
  const end = run && run.status && run.status.completionTime && new Date(run.status.completionTime)
  const duration = start && end && end.getTime() - start.getTime()

  return {
    activationId: run.metadata.name,
    name: run.spec.pipelineRef.name,
    start: start && start.getTime(),
    end: end && end.getTime(),
    duration,
    response: {
      success: success(run.status.conditions)
    }
  }
}

interface SymbolTable<N> {
  [key: string]: N
}

function makeSymbolTables(pipeline: Pipeline, jsons: KubeResource[]) {
  // map from Task.metadata.name to Task
  const taskName2Task: SymbolTable<Task> = jsons
    .filter(_ => _.kind === 'Task')
    .reduce((symtab: SymbolTable<Task>, task: Task) => {
      symtab[task.metadata.name] = task
      return symtab
    }, {})

  // map from Pipeline.Task.name to Task
  const taskRefName2Task: SymbolTable<Task> = pipeline.spec.tasks.reduce(
    (symtab: SymbolTable<Task>, taskRef: TaskRef) => {
      symtab[taskRef.name] = taskName2Task[taskRef.taskRef.name]
      return symtab
    },
    {}
  )

  return { taskRefName2Task }
}

function makeTaskRunsActivationLike(run: PipelineRun, pipeline: Pipeline, jsons: KubeResource[]): ActivationLike[] {
  const runs = run && run.status.taskRuns

  const { taskRefName2Task } = makeSymbolTables(pipeline, jsons)

  const activations = Object.keys(runs || []).reduce(
    (M: ActivationLike[], _: string) => {
      const taskRun = runs[_]
      const taskRefName = taskRun.pipelineTaskName
      const task = taskRefName2Task[taskRefName]

      if (!task) {
        console.error('!! task not found', taskRefName, taskRefName2Task)
      } else {
        /* const start = new Date(taskRun.status.startTime).getTime()

      task.visitedIdx = M.length
      M.push({
        start,
        duration: taskRun.status.completionTime ? new Date(taskRun.status.completionTime).getTime() - start : 0,
        response: {
          success: success(taskRun.status.conditions)
        }
      }) */

        taskRun.status.steps.forEach(stepRun => {
          const start = new Date(stepRun.terminated.startedAt).getTime()
          const end = new Date(stepRun.terminated.finishedAt).getTime()
          const success = stepRun.terminated.reason !== 'Error'

          /* const step = task.spec.steps.find(_ => _.name === stepRun.name)
        if (!step) {
          console.error('!! step not found', stepRun.name, task.spec.steps)
        } else if (step) {
          step.visitedIdx = M.length
        } */

          M.push({
            activationId: taskRun.pipelineTaskName,
            name: stepRun.name,
            start,
            end,
            duration: end - start,
            response: {
              success
            }
          })
        })
      }
      return M
    },
    [] as ActivationLike[]
  )

  activations.sort((a, b) => a.start - b.start)

  return activations
}

export const traceView = (tab: Tab, run: PipelineRun, pipeline: Pipeline, jsons: KubeResource[]) => {
  const content = document.createElement('div')
  content.classList.add('padding-content', 'repl-result')
  content.style.flex = '1'
  content.style.display = 'flex'
  content.style.flexDirection = 'column'
  content.style.overflowX = 'hidden'

  const runActivation = makeRunActivationLike(run)
  render(tab, [runActivation].concat(makeTaskRunsActivationLike(run, pipeline, jsons)), content)

  const badges: Badge[] = ['Tekton']

  return {
    type: 'custom',
    isEntity: true,
    name: run.metadata.name,
    packageName: run.metadata.namespace,
    prettyType: 'PipelineRun',
    duration: runActivation.duration,
    badges,
    content
  }
}

/**
 * Sidecar mode for a pipeline run trace view
 *
 */
const traceMode: SidecarMode = {
  mode: 'trace',
  direct: async (tab: Tab, _: ResponseObject) => {
    const resource = _.resource as PipelineRun
    const [pipeline, tasks] = await Promise.all([getPipelineFromRef(resource), getTasks()])
    return traceView(tab, resource, pipeline, tasks)
  },
  defaultMode: true,
  leaveBottomStripeAlone: true
}

export default traceMode
