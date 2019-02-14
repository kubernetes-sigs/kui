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

import * as Debug from 'debug'
const debug = Debug('plugins/wskflow/fsm2graph')

import * as $ from 'jquery'

import * as repl from '@kui-shell/core/core/repl'
import sidecarSelector from '@kui-shell/core/webapp/views/sidecar-selector'

import graph2doms from './graph2doms'
import { textualPropertiesOfCode } from './util'

const maxWidth = 100
// const defaultWidth = 40
const defaultHeight = 20
const defaultCharWidth = 5
const defaultCharHeight = 10

let graphData
let dummyCount
let visited
let activations
let actions
let taskIndex

function addDummy (sources = [], targets, obj, options?, directionS?: string, directionT?: string) {
  let dummyId = 'dummy_' + dummyCount
  let o
  let port
  dummyCount++
  obj.children.push(drawNodeNew(dummyId, options.label || dummyId, options.type || 'Dummy', sources, options))
  if (sources && sources.length > 0) {
    o = drawEdgeNew(sources[0], dummyId, obj)
    port = o.targetPort
    obj.edges.push(o)
    for (let i = 1; i < sources.length; i++) {
      obj.edges.push(drawEdgeNew(sources[i], dummyId, obj, undefined, directionS, undefined, port))
    }
  }

  if (targets && targets.length > 0) {
    o = drawEdgeNew(dummyId, targets[0], obj); port = o.sourcePort
    obj.edges.push(o)
    for (let i = 1; i < targets.length; i++) {
      obj.edges.push(drawEdgeNew(dummyId, targets[i], obj, undefined, directionT, port, undefined))
    }
  }

  return dummyId
}

let id2log = id => id.replace(/-components/g, '').replace(/__origin/g, '').replace(/__terminus/g, '')

interface INode {
  id: string
  label: string
  name?: string
  value?: string
  type?: string
  taskIndex?: number
  tooltip?: string
  tooltipHeader?: string
  prettyCode?: string
  fullFunctionCode?: string
  multiLineLabel?: string
  repeatCount?: string
  retryCount?: string
  width?: number
  height?: number
  layoutOptions?: any
  properties?: any
  ports?: Array<string>
  visited?: Array<string>
  children?: Array<INode>
  edges?: Array<IEdge>
  deployStatus?: string
}

interface INodeOptions {
  value?: string
  tooltip?: string
  tooltipHeader?: string
  leftToRight?: boolean
  renderFunctionsInView?: boolean
}

function drawNodeNew (id: string, label: string, type?: string, properties?, options?: INodeOptions): INode {
  // console.log(id)
  let o: INode = {
    id,
    label,
    type,
    ports: [],
    value: options && options.value,
    tooltip: options && options.tooltip,
    tooltipHeader: options && options.tooltipHeader,
    properties: {}
  }
  if (visited) {
    if (id === 'Entry') {
      visited[id] = [0]
      o.visited = visited[id]
    } else if (id === 'Exit') {
      if (Array.isArray(properties)) {
        properties.forEach(p => {
          if (visited[p]) {
            visited[id] = [activations.length - 1]
          }
        })
      }
      o.visited = visited[id]
    } else {
      let iid = id2log(id)
      if (visited[iid]) {
        if (type === 'action') {
          visited[iid].forEach((v, i) => { visited[iid][i]++ }) // for actions, increase all index by one to point to the next activation in the array.
        }

        if (type === 'retain') {
          if ((visited[iid].length >= 1 && id.endsWith('__origin')) || (visited[iid].length === 2 && id.endsWith('__terminus'))) {
            o.visited = visited[iid]
          }
        } else {
          o.visited = visited[iid]
        }
      }
      // console.log("iid:", id, iid, visited[iid], o.visited)
    }
  }

  if (visited && (visited[id] || id === 'Entry')) { o.visited = visited[id] || 0 }

  // if(type !== 'tryBody' && type !== 'handler'){
  if (type !== 'try' && type !== 'handler') {
    // o.properties["de.cau.cs.kieler.portConstraints"] = "FIXED_SIDE";
    // DO NOT TOUCH THIS.
    o.properties['de.cau.cs.kieler.portConstraints'] = 'FIXED_ORDER'
  }
  if (options && options.leftToRight) {
    delete o.properties['de.cau.cs.kieler.portConstraints']
  }

  if (type !== 'Dummy' && type !== 'Exit' && properties) { // dummy and entry/exit nodes have no layout properties
    o.layoutOptions = {}
    Object.keys(properties).forEach(p => {
      o.properties[p] = properties[p]
      o.layoutOptions[p] = properties[p]
    })
  }

  if (options && options.leftToRight) {
    o.properties = { direction: 'RIGHT', 'org.eclipse.elk.direction': 'RIGHT' }
  }

  if (o.type === 'action') {
    if (label.indexOf('|') !== -1) {
      o.name = label.substring(0, label.indexOf('|'))
      label = label.substring(label.indexOf('|') + 1)
      o.label = label
    } else {
      o.name = label
    }

    if (label.lastIndexOf('/') !== -1 && label.lastIndexOf('/') < label.length - 1) {
      o.label = label.substring(label.lastIndexOf('/') + 1)
    }
    o.height = defaultHeight

    if (o.label.length < 40) {
      o.width = o.label.length * defaultCharWidth + 10
    } else {
      o.label = o.label.substring(0, 40) + '...'
      o.width = 40 * defaultCharWidth + 10
    }

    /* if(o.width<defaultWidth)
       o.width = defaultWidth; */

    if (actions) {
      if (actions[o.name] === undefined) actions[o.name] = []
      actions[o.name].push(o.id)
    }

    o.taskIndex = taskIndex++
  } else if (o.type === 'function') {
    o.fullFunctionCode = label
    const prettyCode = require('js-beautify')(o.fullFunctionCode)
    const { nLines, maxLineLength } = textualPropertiesOfCode(prettyCode)

    // uncomment the second clause if you want always to display 1-liner functions inline in the view
    if (options.renderFunctionsInView /* || nLines === 1 */) {
      // ok cool, then render this function body directly in the view
      const charWidthForCode = defaultCharWidth * 0.63

      o.width = Math.min(maxWidth, maxLineLength * charWidthForCode)
      o.height = Math.max(2.25, nLines) * defaultCharHeight // use at least two lines; makes one-line functions look better
      o.multiLineLabel = prettyCode.split(/[\n\r]/).map(line => {
        const width = o.width / charWidthForCode
        if (width >= line.length) {
          // not cropped
          return line
        } else {
          return line.substring(0, width) + '\u2026' // horizontal ellipsis unicode
        }
      })
      o.prettyCode = prettyCode
      delete o.label
    } else {
      // otherwise, don't show any function code directly in the view; only in tooltip
      o.width = 8
      o.height = 8
      o.tooltip = prettyCode
      delete o.label
    }

    o.taskIndex = taskIndex++
  } else if (o.type === 'try_catch') {
    o.properties = { direction: 'RIGHT', 'org.eclipse.elk.direction': 'RIGHT' }
    o.children = [{
      id: `${id}-body`,
      label: 'try',
      type: 'try',
      ports: [],
      properties: {},
      children: [],
      edges: [],
      visited: visited ? visited[id2log(`${id}-body`)] : undefined
    }, {
      id: `${id}-handler`,
      label: 'error handler',
      type: 'handler',
      ports: [],
      properties: {},
      children: [],
      edges: [],
      visited: visited ? visited[id2log(`${id}-handler`)] : undefined
    }]

    o.edges = [drawEdgeNew(`${id}-body`, `${id}-handler`, o, undefined, 'RIGHT')]
  } else if (o.type === 'Entry' || o.type === 'Exit') {
    o.width = 18
    o.height = 18
  } else if (o.type === 'retain') {
    o.width = 4
    o.height = 4
  } else if (o.type === 'Dummy') {
    if (o.label === o.id) {
      o.width = 4
      o.height = 4
    } else {
      // then this dummy node has a label
      o.width = 0.875 * o.label.length * defaultCharWidth
      o.height = 0.875 * defaultCharHeight
    }

    // Dummy node's `properties` is `sources`, used to determine if the dummy is visited
    if (visited && Array.isArray(properties)) {
      properties.forEach(s => { // a source id
        s = id2log(s)
        if (visited[s]) { // if the source is visited
          visited[s].forEach(a => { // find out if any of its activation was success
            if (activations[a].response.success) { // if so, dummy is visited
              if (visited[o.id] === undefined) {
                visited[o.id] = []
                o.visited = []
              }
              visited[o.id].push(a)
              o.visited.push(a)
            }
          })
        }
      })
    }
  } else if (o.type === 'let' || o.type === 'literal') {
    if (o.label.length > 30) { o.width = 30 * defaultCharWidth + 10 } else { o.width = o.label.length * defaultCharWidth + 10 }
    o.height = defaultHeight
    o.tooltip = o.label
    delete o.label

    o.width = 20
    o.height = 20
  } else if (o.type === 'retry') {
    o.children = []
    o.edges = []
    o.retryCount = label
    o.label = `Retry ${label} time${parseInt(label, 10) > 1 ? 's' : ''}`
  } else if (o.type === 'repeat') {
    o.children = []
    o.edges = []
    o.repeatCount = label
    o.label = `Repeat ${label} time${parseInt(label, 10) > 1 ? 's' : ''}`
  }

  return o
}

interface IEdge {
  id: string
  source: string
  sourcePort: string
  target: string
  targetPort: string
  properties?: any
  visited?: boolean
}
function drawEdgeNew (sourceId: string, targetId: string, layer, type?: string, direction?: string, sourcePort?: string, targetPort?: string): IEdge {
  // let sourcePort, targetPort;

  for (let i = 0; i < layer.children.length; i++) {
    if (layer.children[i].id === sourceId) {
      if (type) {
        if (type === 'true' || type === 'false') {
          sourcePort = `${sourceId}_p${type}`
          layer.children[i].properties.choice = true
        }
      } else if (layer.children[i].properties.choice) {
        sourcePort = `${sourceId}_pfalse`
      } else {
        sourcePort = `${sourceId}_p${layer.children[i].ports.length}`
      }
      layer.children[i].ports.push({
        id: sourcePort,
        properties: { portSide: direction || 'SOUTH' }
      })
    }
    if (layer.children[i].id === targetId) {
      // console.log("found! "+targetId);
      // targetPort = targetId+"_p"+layer.children[i].ports.length;
      targetPort = `${targetId}_p${layer.children[i].ports.length}`
      layer.children[i].ports.push({
        id: targetPort,
        properties: { portSide: direction || 'NORTH' }
      })
    }
    if (sourcePort && targetPort) { break }
  }

  if (sourcePort === undefined || targetPort === undefined) {
    debug('source or target not found', sourceId, targetId, layer, graphData)
  }

  return {
    id: sourceId + '_' + sourcePort + '->' + targetId + '_' + targetPort,
    source: sourceId,
    sourcePort: sourcePort,
    target: targetId,
    targetPort: targetPort,
    visited: visited ? visited[sourceId] && visited[targetId] ? true : false : undefined
  }
}

function ir2graph (ir, gm, id: string, prevId: Array<string>, options = {}) { // ir and graph model
  if (ir.type === 'sequence' || ir.type === 'seq' || Array.isArray(ir)) {
    // for an array of things, prevId is the previous element
    // console.log(ir, gm, id, prevId);
    let count = 0
    let prev
    let array
    if (ir.type === 'sequence' || ir.type === 'seq') { array = ir.components } else { array = ir }

    array.forEach(obj => {
      if (obj.options && obj.options.helper) {
        // do nothing
      } else {
        prev = ir2graph(obj, gm, `${id}-${count}`, count > 0 ? prev : prevId, options)
        count++
      }
    })

    return prev
  } else {
    // id = `${id}-${ir.type}`
    if (ir.type === 'action') {
      let name = ir.name
      if (ir.displayLabel) { name += `|${ir.displayLabel}` }
      gm.children.push(drawNodeNew(id, name, ir.type, undefined, options))
      if (prevId) { prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, id, gm))) }
      return [id]
    } else if (ir.type === 'function') {
      gm.children.push(drawNodeNew(id, ir.function.exec.prettyCode || ir.function.exec.code, ir.type, undefined, options))

      if (prevId) { prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, id, gm))) }
      return [id]
    } else if (ir.type === 'if') {
      let firstTestId = gm.children.length
      let lastTestId = ir2graph(ir.test, gm, `${id}-test`, undefined, options)
      let firstConsId = gm.children.length
      let lastConsId = ir2graph(ir.consequent, gm, `${id}-consequent`, undefined, options)

      // the if may not have an "else", i.e. "alternate"
      let firstAltId
      let lastAltId
      if (ir.alternate.type !== 'empty') {
        firstAltId = gm.children.length
        lastAltId = ir2graph(ir.alternate, gm, `${id}-alternate`, undefined, options)
      }

      if (prevId) { // connect prevId to the first node in test
        prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, gm.children[firstTestId].id, gm)))
      }

      // connect test to consequence
      let ltid
      if (lastTestId.length > 1) {
        // insert a dummy node to converge
        ltid = addDummy(lastTestId, undefined, gm, options)
      } else {
        ltid = lastTestId[0]
      }
      gm.edges.push(drawEdgeNew(ltid, gm.children[firstConsId].id, gm, 'true'))
      if (lastAltId && lastAltId.length > 0) {
        // may or may not have a alt branch
        gm.edges.push(drawEdgeNew(ltid, gm.children[firstAltId].id, gm, 'false'))
      } else {
        lastAltId = [ltid]
      }

      const exitConcentrator = addDummy(lastAltId.concat(lastConsId), undefined, gm, options)
      return [exitConcentrator]
    } else if (ir.type === 'try') {
      // insert a compound node for try
      gm.children.push(drawNodeNew(id, 'Try-Catch', 'try_catch', undefined, options))
      if (prevId) {
        prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, id, gm)))
      } else {
        gm.children[gm.children.length - 1].properties.compoundNoParents = true
      }

      const tryCatchPart = gm.children[gm.children.length - 1]
      const tryPart = tryCatchPart.children[0]
      const catchPart = tryCatchPart.children[1]

      ir2graph(ir.body, tryPart, tryPart.id + '-components', undefined, options)
      ir2graph(ir.handler, catchPart, catchPart.id + '-components', undefined, options)

      return [gm.children[gm.children.length - 1].id]
    } else if (ir.type === 'while' || ir.type === 'dowhile' || ir.type === 'while_nosave' || ir.type === 'dowhile_nosave') {
      let firstTestId
      let firstBodyId
      let lastTestId
      let lastBodyId

      if (ir.type === 'while' || ir.type === 'while_nosave') {
        firstTestId = gm.children.length
        lastTestId = ir2graph(ir.test, gm, `${id}-test`, undefined, options)
        if (prevId) { // connect prevId to the first node in test
          prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, gm.children[firstTestId].id, gm)))
        }
        firstBodyId = gm.children.length
        lastBodyId = ir2graph(ir.body, gm, `${id}-body`, undefined, options)
      } else {
        firstBodyId = gm.children.length
        lastBodyId = ir2graph(ir.body, gm, `${id}-body`, undefined, options)
        firstTestId = gm.children.length
        lastTestId = ir2graph(ir.test, gm, `${id}-test`, undefined, options)
      }

      // connect test to consequence
      let ltid
      let lbid
      if (lastTestId.length > 1) {
        // insert a dummy node to converge
        ltid = addDummy(lastTestId, undefined, gm, options)
      } else {
        ltid = lastTestId[0]
      }

      if (lastBodyId.length > 1) {
        // insert a dummy node to converge
        lbid = addDummy(lastBodyId, undefined, gm, options)
      } else {
        lbid = lastBodyId[0]
      }

      gm.edges.push(drawEdgeNew(ltid, gm.children[firstBodyId].id, gm, 'true')) // true edge for test, go to body
      gm.edges.push(drawEdgeNew(lbid, gm.children[firstTestId].id, gm)) // edge loop back to the beginning of test

      // for dowhile, add the edge from prev to the body at the end;
      // this seems to make the ELK layout algorithm happier;
      // otherwise, it crosses the prev->body and cond-yes->body edges
      if (prevId && (ir.type === 'dowhile' || ir.type === 'dowhile_nosave')) {
        // connect prevId to the first node in test
        prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, gm.children[firstBodyId].id, gm)))
      }

      return [ltid]
    } else if (ir.type === 'retain') {
      gm.children.push(drawNodeNew(`${id}__origin`, '', ir.type, undefined, options))

      if (prevId) {
        prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, `${id}__origin`, gm)))
      }
      let lastNodes = ir2graph(ir.components, gm, id, [`${id}__origin`], options)
      gm.children.push(drawNodeNew(`${id}__terminus`, '', ir.type, undefined, options))
      if (lastNodes) {
        lastNodes.forEach(pid => gm.edges.push(drawEdgeNew(pid, `${id}__terminus`, gm)))
      }

      const forwardingEdge = drawEdgeNew(`${id}__origin`, `${id}__terminus`, gm, undefined, 'EAST')
      // forwardingEdge.labels = [ { text: 'forwarding' } ]
      forwardingEdge.properties = { type: 'retain' }
      gm.edges.push(forwardingEdge)

      return [`${id}__terminus`]
    } else if (ir.type === 'retry' || ir.type === 'repeat') {
      gm.children.push(drawNodeNew(id, ir.count, ir.type, undefined, options))
      if (prevId) {
        prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, id, gm)))
      }
      // body is in ir.components
      ir2graph(ir.components, gm.children[gm.children.length - 1], `${id}-components`, undefined, options)

      return [gm.children[gm.children.length - 1].id]
    } else if (ir.type === 'let') {
      // regular let
      let s = JSON.stringify(ir.declarations, undefined, 4)
      gm.children.push(drawNodeNew(id, s, ir.type, undefined, Object.assign(options, { value: ir.declarations })))
      if (prevId) { prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, id, gm))) }

      return ir2graph(ir.components, gm, `${id}-components`, [id], options)
    } else if (ir.type === 'literal' || ir.type === 'value') {
      const s = JSON.stringify(ir.value, undefined, 4)
      gm.children.push(drawNodeNew(id, s, ir.type, undefined, Object.assign(options, { value: ir.value })))
      if (prevId) { prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, id, gm))) }

      return [id]
    } else if (ir.type === 'finally') {
      let lastBodyNode = ir2graph(ir.body, gm, `${id}-body`, prevId, /*undefined,*/ options)
      return ir2graph(ir.finalizer, gm, `${id}-finalizer`, lastBodyNode, /*undefined,*/ options)
    } else if (ir.type === 'parallel' || ir.type === 'par' || ir.type === 'map' || ir.type === 'forall') {
      // par and map
      const label = ir.type === 'map' || ir.type === 'forall' ? 'Parallel Map over Array'
        : 'Execute Tasks in Parallel'

      const tooltipHeader = ir.type === 'par' || ir.type === 'par'
        ? 'Parallel'
        : ir.type === 'map' ? 'Map' : ir.type

      const tooltip = ir.type === 'map' || ir.type === 'forall'
        ? 'Executes a single task in parallel for each element of the input array'
        : 'Executes a set of tasks in parallel, passing the same input data to each task'

      let parent = prevId
      if (ir.set) {
        // input set to the parallel construct
        parent = ir2graph(ir.set, gm, `${id}-${ir.type}-set`, parent, options)
      }

      // render the "Fork" node
      const fork = addDummy(parent, undefined, gm, { label, tooltipHeader, tooltip })

      // for now, the parent of the body is the fork node; if the ir
      // specifies an input set, then we'll change this
      parent = [ fork ]

      // render the par/map body
      let exits
      if (ir.type === 'map' || ir.type === 'forall') {
        // for map, render the components as a sequence
        //         Fork (the "fork" node that we rendered just above)
        //          |
        //     a ->  b ->  c  <-- we're doing this part now
        //          |
        //        Join (we'll render this just below)
        const body = ir.components || ir.body
        const spreadItOut = [ body, body, { type: 'literal', value: '...' }, body ]
        exits = spreadItOut.map((component, idx) => {
          return ir2graph(component, gm, `${id}-component-${idx}`, parent, options)[0]
        })
      } else {
        // for parallel, render the components as a fan-out
        //         Fork (the "fork" node that we rendered just above)
        //      /   |   \
        //     a    b    c  <-- we're doing this part now
        //      \   |   /
        //        Join (we'll render this just below)
        exits = ir.components.map((component, idx) => {
          return ir2graph(component, gm, `${id}-component-${idx}`, parent, options)[0]
        })
      }

      // finally, render the "Join" node
      const exitConcentrator = addDummy(exits, undefined, gm, {
        label: 'Wait for Completion',
        tooltipHeader: `${tooltipHeader} completion`,
        tooltip: 'Wait for the parallel tasks to complete, and then return an array of results'
      })
      return [exitConcentrator]
    } else if (typeof ir.components === 'object') {
      // generic handler for any subgraph-via-body node
      const label = capitalize(ir.type)
      const type = ir.type
      const body = drawNodeNew(id, label, type, undefined, options)

      body.children = []
      body.edges = []
      gm.children.push(body)

      if (prevId) {
        prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, id, gm)))
      }

      // render the components as a sequence
      ir2graph(ir.components, body, `${id}-components`, undefined, options)

      return [id]
    } else if (typeof ir === 'object') {
      // generic handler for any opaque node
      const type = 'action'
      const label = ir.type

      gm.children.push(drawNodeNew(id, label, type, undefined, options))

      if (prevId) {
        prevId.forEach(pid => gm.edges.push(drawEdgeNew(pid, id, gm)))
      }

      debug('generic handler', ir, label, type)

      return [id]
    }
  }
}

export default async function fsm2graph (ir, containerElement, acts, options, rule): Promise<void> {
  // console.log(ir, containerElement, acts);
  taskIndex = 0
  activations = acts
  visited = undefined // see shell issue #602
  dummyCount = 0
  graphData = {
    id: 'root',
    label: 'root',
    children: [],
    edges: []
  }

  $('.wskflowWarning').remove()

  if (activations) {
    // parse the activations to get a list of states that was visted
    activations = activations.sort((a, b) => { return a.start - b.start })
    debug('activations', activations)
    visited = {}
    activations.forEach((a, index) => {
      if (a.logs) { // states recorded in logs
        a.logs.forEach(log => {
          if (log.indexOf('stdout: Entering composition') !== -1) {
            // a conductor path log
            let path = log.substring(log.lastIndexOf(' ') + 1)
            // replace all [,],.in path to - to use as a id, as css selector cannot have those characters
            path = path.replace(/[\[\.]/g, '-').replace(/\]/g, '') // eslint-disable-line
            if (visited[path] === undefined) visited[path] = []
            visited[path].push(index)
          }
        })
      }
    })
    Object.keys(visited).forEach(k => {
      // make sure the compound node, if any, is included in visited too.
      let seg = k.split('-')
      seg.pop() // kick out the last element == get the compound node id
      let path = seg.join('-')
      if (visited[path] === undefined) visited[path] = []
      visited[path] = visited[path].concat(visited[k]) // join it back, value is all the items in the child arrays (not sure if it's necessary)
    })
    debug('visited nodes:', visited)
  } else {
    actions = {}
  }

  debug('generating graph model')

  const renderFunctionsInView = isSimpleComposition(ir)
  const viewOptions = Object.assign({ renderFunctionsInView }, options)

  if ((rule && rule.trigger) || ir.type === 'on') {
    debug('using rule as start', rule)
    const start = drawNodeNew('Entry', 'trigger', 'Entry')
    start.properties.kind = 'trigger'
    start.properties.kindDetail = rule ? rule.trigger.name : ir.trigger
    start.width = 24
    graphData.children.push(start) // insert Entry node

    if (ir.type === 'on') {
      // no need to render the "on" wrapper, as we've already
      // signified the trigger in the Start node
      ir = ir.components
    }
  } else {
    graphData.children.push(drawNodeNew('Entry', 'start', 'Entry')) // insert Entry node
  }

  let lastNodes = ir2graph(ir, graphData, 'composition', ['Entry'], // build the graph model, link the start of the graph to Entry
    viewOptions) // <-- options to the rendering
  if (lastNodes === undefined) { lastNodes = ['Entry'] }
  graphData.children.push(drawNodeNew('Exit', 'end', 'Exit', lastNodes)) // insert Exit node
  lastNodes.forEach(pid => graphData.edges.push(drawEdgeNew(pid, 'Exit', graphData))) // link the end of the graph to Exit

  debug('graphData', graphData)
  if (actions) {
    debug('actions', actions)
    let array = []
    let names = Object.keys(actions)
    names.forEach(name => {
      array.push(repl.qexec(`wsk action get "${name}"`))
    })
    await Promise.all(array.map(p => p.catch(e => e)))
      .then(result => {
        const notDeployed = []
        result.forEach((r, index) => {
          if (r.type === 'actions' && r.name) {
            debug(`action ${r.name} is deployed`)
            actions[names[index]].forEach(id => {
              graphData.children.find((children: INode) => children.id === id).deployStatus = 'deployed'
            })
          } else {
            debug(`action ${names[index]} is not deployed`, r, names)
            if (actions[names[index]]) {
              notDeployed.push(names[index])
              actions[names[index]].forEach(id => {
                graphData.children.find((children: INode) => children.id === id).deployStatus = 'not-deployed'
              })
            }
          }
        })

        // warn user about not-deployed actions (but only if !activations, i.e. not for session flow)
        if (notDeployed.length > 0 && !activations) {
          const container = document.querySelector(sidecarSelector('.sidecar-header .sidecar-header-secondary-content .custom-header-content'))
          if (container && (!options || !options.noHeader)) {
            const css = {
              message: 'wskflow-undeployed-action-warning',
              text: 'wskflow-undeployed-action-warning-text',
              examples: 'wskflow-undeployed-action-warning-examples',
              examplesExtra: [ 'deemphasize', 'deemphasize-partial', 'left-pad' ]
            }
            let message = container.querySelector(`.${css.message}`)
            let text
            let examples

            const makeExampleDoms = () => {
              const message = document.createElement('div')
              const warning = document.createElement('strong')

              text = document.createElement('span')
              examples = document.createElement('span')

              message.className = css.message
              text.className = css.text
              warning.className = 'red-text'
              examples.className = css.examples
              css.examplesExtra.forEach(_ => examples.classList.add(_))

              message.appendChild(warning)
              message.appendChild(text)
              message.appendChild(examples)
              container.appendChild(message)

              warning.innerText = 'Warning: '
            }

            if (!message) {
              makeExampleDoms()
            } else {
              text = message.querySelector(`.${css.text}`)
              examples = message.querySelector(`.${css.examples}`)
            }

            const actionStr = notDeployed.length === 1 ? 'component' : 'components'
            text.innerText = `This composition depends on ${notDeployed.length} undeployed ${actionStr}`

            const pre = notDeployed.length > 2 ? 'e.g. ' : ''
            const examplesOfNotDeployed = notDeployed.slice(0, 2).map(_ => _.substring(_.lastIndexOf('/') + 1)).join(', ')
            const post = notDeployed.length > 2 ? ', \u2026' : '' // horizontal ellipsis

            examples.innerText = `(${pre}${examplesOfNotDeployed}${post})`
          }
        }
      })
      .catch(e => {
        debug('action get fetching error: ', e)
      })
  }

  debug('inserting DOM, calling graph2doms')

  return graph2doms(graphData, containerElement, activations)
}

/**
 * Heuristic: is this composition "pretty simple"?
 *
 */
const isSimpleComposition = ir => {
  const isShort = ir.components ? ir.components.length <= 2 : true
  const numNonFuncs = numNonFunctions(ir)
  const atMostOneNonFunction = numNonFuncs <= 3

  debug('isSimpleComposition', isShort, numNonFuncs)
  return isShort && atMostOneNonFunction
}

/**
 * @return the cumulative number of nodes in the given composition that are not of type Function
 *
 */
const numNonFunctions = composition => {
  if (composition === undefined) return 0
  if (composition.type === 'function') {
    return 0
  } else if (composition.type) {
    // then this is a compound node of some type
    let sum = 0
    for (let key in composition) {
      sum += numNonFunctions(composition[key])
    }
    return sum + 1
  } else if (Array.isArray(composition)) {
    return composition.reduce((sum, sub) => sum + numNonFunctions(sub), 0)
  } else {
    return 0
  }
}

/**
 * Capitalize a given string
 *
 */
const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1)
