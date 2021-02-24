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
import { Tab } from '@kui-shell/core'

import Response from './response'
import ActivationLike from './activation'
import { textualPropertiesOfCode } from './util'
import * as AST from './ast'
import { FlowNode, NodeOptions, Edge } from './graph'
import renderSubtext from './subtext'

const debug = Debug('plugins/wskflow/fsm2graph')

const maxWidth = 100
// const defaultWidth = 40
const defaultHeight = 20
const defaultCharWidth = 5
const defaultCharHeight = 10

/**
 * Capitalize a given string
 *
 */
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.substring(1)

function id2log(id: string): string {
  return id
    .replace(/-components/g, '')
    .replace(/__origin/g, '')
    .replace(/__terminus/g, '')
}

class RenderState {
  readonly graphData: FlowNode

  dummyCount = 0

  taskIndex = 0

  visited: Record<string, number[]>

  actions: Record<string, string[]>

  readonly activations: ActivationLike[]

  constructor(acts: ActivationLike[]) {
    this.activations = acts
    if (acts) {
      this.activations.sort((a, b) => {
        return a.start - b.start
      })
    }

    this.visited = undefined // see shell issue #602
    this.graphData = {
      id: 'root',
      label: 'root',
      children: [],
      edges: []
    }
  }

  addDummy(sources = [], targets: string[], obj, options?: NodeOptions, directionS?: string, directionT?: string) {
    const dummyId = 'dummy_' + this.dummyCount
    let o
    let port: string
    this.dummyCount++
    obj.children.push(this.drawNodeNew(dummyId, options.label || dummyId, options.type || 'Dummy', sources, options))
    if (sources && sources.length > 0) {
      o = this.drawEdgeNew(sources[0], dummyId, obj)
      port = o.targetPort
      obj.edges.push(o)
      for (let i = 1; i < sources.length; i++) {
        obj.edges.push(this.drawEdgeNew(sources[i], dummyId, obj, undefined, directionS, undefined, port))
      }
    }

    if (targets && targets.length > 0) {
      o = this.drawEdgeNew(dummyId, targets[0], obj)
      port = o.sourcePort
      obj.edges.push(o)
      for (let i = 1; i < targets.length; i++) {
        obj.edges.push(this.drawEdgeNew(dummyId, targets[i], obj, undefined, directionT, port, undefined))
      }
    }

    return dummyId
  }

  drawNodeNew(id: string, label: string, type?: string, properties?, options?: NodeOptions): FlowNode {
    // console.log(id)
    const o: FlowNode = {
      id,
      label,
      type,
      ports: [],
      value: options && options.value,
      tooltip: options && options.tooltip,
      tooltipHeader: options && options.tooltipHeader,
      properties: {}
    }
    if (this.visited) {
      if (id === 'Entry') {
        this.visited[id] = [0]
        o.visited = this.visited[id]
      } else if (id === 'Exit') {
        if (Array.isArray(properties)) {
          properties.forEach(p => {
            if (this.visited[p]) {
              this.visited[id] = [this.activations.length - 1]
            }
          })
        }
        o.visited = this.visited[id]
      } else {
        const iid = id2log(id)
        if (this.visited[iid]) {
          if (type === 'action') {
            this.visited[iid].forEach((v, i) => {
              this.visited[iid][i]++
            }) // for actions, increase all index by one to point to the next activation in the array.
          }

          if (type === 'retain') {
            if (
              (this.visited[iid].length >= 1 && id.endsWith('__origin')) ||
              (this.visited[iid].length === 2 && id.endsWith('__terminus'))
            ) {
              o.visited = this.visited[iid]
            }
          } else {
            o.visited = this.visited[iid]
          }
        }
        // console.log("iid:", id, iid, visited[iid], o.visited)
      }
    }

    if (this.visited && (this.visited[id] || id === 'Entry')) {
      o.visited = this.visited[id] || [0]
    }

    // if(type !== 'tryBody' && type !== 'handler'){
    if (type !== 'try' && type !== 'handler') {
      // o.properties["de.cau.cs.kieler.portConstraints"] = "FIXED_SIDE";
      // DO NOT TOUCH THIS.
      o.properties['de.cau.cs.kieler.portConstraints'] = 'FIXED_ORDER'
    }
    if (options && options.leftToRight) {
      delete o.properties['de.cau.cs.kieler.portConstraints']
    }

    if (type !== 'Dummy' && type !== 'Exit' && properties) {
      // dummy and entry/exit nodes have no layout properties
      o.layoutOptions = {}
      Object.keys(properties).forEach(p => {
        o.properties[p] = properties[p]
        o.layoutOptions[p] = properties[p]
      })
    }

    if (options && options.leftToRight) {
      o.properties = {
        direction: 'RIGHT',
        'org.eclipse.elk.direction': 'RIGHT'
      }
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

      if (this.actions) {
        if (this.actions[o.name] === undefined) this.actions[o.name] = []
        this.actions[o.name].push(o.id)
      }

      o.taskIndex = this.taskIndex++
    } else if (o.type === 'function') {
      o.fullFunctionCode = label
      const prettyCode = label
      const { nLines, maxLineLength } = textualPropertiesOfCode(prettyCode)

      // uncomment the second clause if you want always to display 1-liner functions inline in the view
      if (options.renderFunctionsInView /* || nLines === 1 */) {
        // ok cool, then render this function body directly in the view
        const charWidthForCode = defaultCharWidth

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

      o.taskIndex = this.taskIndex++
    } else if (o.type === 'try_catch') {
      o.properties = {
        direction: 'RIGHT',
        'org.eclipse.elk.direction': 'RIGHT'
      }
      o.children = [
        {
          id: `${id}-body`,
          label: 'try',
          type: 'try',
          ports: [],
          properties: {},
          children: [],
          edges: [],
          visited: this.visited ? this.visited[id2log(`${id}-body`)] : undefined
        },
        {
          id: `${id}-handler`,
          label: 'error handler',
          type: 'handler',
          ports: [],
          properties: {},
          children: [],
          edges: [],
          visited: this.visited ? this.visited[id2log(`${id}-<handler`)] : undefined
        }
      ]

      o.edges = [this.drawEdgeNew(`${id}-body`, `${id}-handler`, o, undefined, 'RIGHT')]
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
      if (this.visited && Array.isArray(properties)) {
        properties.forEach((_s: string) => {
          // a source id
          const s = id2log(_s)
          if (this.visited[s]) {
            // if the source is visited
            this.visited[s].forEach(a => {
              // find out if any of its activation was success
              if (this.activations[a].response.success) {
                // if so, dummy is visited
                if (this.visited[o.id] === undefined) {
                  this.visited[o.id] = []
                  o.visited = []
                }
                this.visited[o.id].push(a)
                o.visited.push(a)
              }
            })
          }
        })
      }
    } else if (o.type === 'let' || o.type === 'literal') {
      if (o.label.length > 30) {
        o.width = 30 * defaultCharWidth + 10
      } else {
        o.width = o.label.length * defaultCharWidth + 10
      }
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

  drawEdgeNew(
    sourceId: string,
    targetId: string,
    layer,
    type?: string,
    direction?: string,
    sourcePort?: string,
    targetPort?: string
  ): Edge {
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
      if (sourcePort && targetPort) {
        break
      }
    }

    if (sourcePort === undefined || targetPort === undefined) {
      debug('source or target not found', sourceId, targetId, layer, this.graphData)
    }

    return {
      id: sourceId + '_' + sourcePort + '->' + targetId + '_' + targetPort,
      source: sourceId,
      sourcePort: sourcePort,
      target: targetId,
      targetPort: targetPort,
      visited: this.visited ? !!(this.visited[sourceId] && this.visited[targetId]) : undefined
    }
  }

  ir2graph(ir: AST.ASTNode, gm: FlowNode, id: string, prevId: string[], options = {}): string[] {
    // ir and graph model
    if (ir.type === 'sequence' || ir.type === 'seq' || Array.isArray(ir)) {
      // for an array of things, prevId is the previous element
      // console.log(ir, gm, id, prevId);
      let count = 0
      let prev: string[]
      let array
      if (AST.isSequence(ir)) {
        array = ir.components
      } else {
        array = ir
      }

      array.forEach(obj => {
        if (obj.options && obj.options.helper) {
          // do nothing
        } else {
          prev = this.ir2graph(obj, gm, `${id}-${count}`, count > 0 ? prev : prevId, options)
          count++
        }
      })

      return prev
    } else {
      // id = `${id}-${ir.type}`
      if (AST.isAction(ir)) {
        let name = ir.name
        if (ir.displayLabel) {
          name += `|${ir.displayLabel}`
        }
        gm.children.push(this.drawNodeNew(id, name, ir.type, undefined, options))
        if (prevId) {
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, id, gm)))
        }
        return [id]
      } else if (AST.isFunction(ir)) {
        gm.children.push(
          this.drawNodeNew(id, ir.function.exec.prettyCode || ir.function.exec.code, ir.type, undefined, options)
        )

        if (prevId) {
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, id, gm)))
        }
        return [id]
      } else if (AST.isConditional(ir)) {
        const firstTestId = gm.children.length
        const lastTestId = this.ir2graph(ir.test, gm, `${id}-test`, undefined, options)
        const firstConsId = gm.children.length
        const lastConsId = this.ir2graph(ir.consequent, gm, `${id}-consequent`, undefined, options)

        // the if may not have an "else", i.e. "alternate"
        let firstAltId
        let lastAltId
        if (ir.alternate.type !== 'empty') {
          firstAltId = gm.children.length
          lastAltId = this.ir2graph(ir.alternate, gm, `${id}-alternate`, undefined, options)
        }

        if (prevId) {
          // connect prevId to the first node in test
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, gm.children[firstTestId].id, gm)))
        }

        // connect test to consequence
        let ltid
        if (lastTestId.length > 1) {
          // insert a dummy node to converge
          ltid = this.addDummy(lastTestId, undefined, gm, options)
        } else {
          ltid = lastTestId[0]
        }
        gm.edges.push(this.drawEdgeNew(ltid, gm.children[firstConsId].id, gm, 'true'))
        if (lastAltId && lastAltId.length > 0) {
          // may or may not have a alt branch
          gm.edges.push(this.drawEdgeNew(ltid, gm.children[firstAltId].id, gm, 'false'))
        } else {
          lastAltId = [ltid]
        }

        const exitConcentrator = this.addDummy(lastAltId.concat(lastConsId), undefined, gm, options)
        return [exitConcentrator]
      } else if (AST.isTry(ir)) {
        // insert a compound node for try
        gm.children.push(this.drawNodeNew(id, 'Try-Catch', 'try_catch', undefined, options))
        if (prevId) {
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, id, gm)))
        } else {
          gm.children[gm.children.length - 1].properties.compoundNoParents = true
        }

        const tryCatchPart = gm.children[gm.children.length - 1]
        const tryPart = tryCatchPart.children[0]
        const catchPart = tryCatchPart.children[1]

        this.ir2graph(ir.body, tryPart, tryPart.id + '-components', undefined, options)
        this.ir2graph(ir.handler, catchPart, catchPart.id + '-components', undefined, options)

        return [gm.children[gm.children.length - 1].id]
      } else if (AST.isWhile(ir) || AST.isDoWhile(ir)) {
        let firstTestId
        let firstBodyId
        let lastTestId
        let lastBodyId

        if (AST.isWhile(ir)) {
          firstTestId = gm.children.length
          lastTestId = this.ir2graph(ir.test, gm, `${id}-test`, undefined, options)
          if (prevId) {
            // connect prevId to the first node in test
            prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, gm.children[firstTestId].id, gm)))
          }
          firstBodyId = gm.children.length
          lastBodyId = this.ir2graph(ir.body, gm, `${id}-body`, undefined, options)
        } else if (AST.isDoWhile(ir)) {
          firstBodyId = gm.children.length
          lastBodyId = this.ir2graph(ir.body, gm, `${id}-body`, undefined, options)
          firstTestId = gm.children.length
          lastTestId = this.ir2graph(ir.test, gm, `${id}-test`, undefined, options)
        }

        // connect test to consequence
        let ltid
        let lbid
        if (lastTestId.length > 1) {
          // insert a dummy node to converge
          ltid = this.addDummy(lastTestId, undefined, gm, options)
        } else {
          ltid = lastTestId[0]
        }

        if (lastBodyId.length > 1) {
          // insert a dummy node to converge
          lbid = this.addDummy(lastBodyId, undefined, gm, options)
        } else {
          lbid = lastBodyId[0]
        }

        gm.edges.push(this.drawEdgeNew(ltid, gm.children[firstBodyId].id, gm, 'true')) // true edge for test, go to body
        gm.edges.push(this.drawEdgeNew(lbid, gm.children[firstTestId].id, gm)) // edge loop back to the beginning of test

        // for dowhile, add the edge from prev to the body at the end;
        // this seems to make the ELK layout algorithm happier;
        // otherwise, it crosses the prev->body and cond-yes->body edges
        if (prevId && (ir.type === 'dowhile' || ir.type === 'dowhile_nosave')) {
          // connect prevId to the first node in test
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, gm.children[firstBodyId].id, gm)))
        }

        return [ltid]
      } else if (AST.isRetain(ir)) {
        gm.children.push(this.drawNodeNew(`${id}__origin`, '', ir.type, undefined, options))

        if (prevId) {
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, `${id}__origin`, gm)))
        }
        const lastNodes = this.ir2graph(ir.components, gm, id, [`${id}__origin`], options)
        gm.children.push(this.drawNodeNew(`${id}__terminus`, '', ir.type, undefined, options))
        if (lastNodes) {
          lastNodes.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, `${id}__terminus`, gm)))
        }

        const forwardingEdge = this.drawEdgeNew(`${id}__origin`, `${id}__terminus`, gm, undefined, 'EAST')
        // forwardingEdge.labels = [ { text: 'forwarding' } ]
        forwardingEdge.properties = { type: 'retain' }
        gm.edges.push(forwardingEdge)

        return [`${id}__terminus`]
      } else if (AST.isRetryOrRepeat(ir)) {
        gm.children.push(this.drawNodeNew(id, ir.count, ir.type, undefined, options))
        if (prevId) {
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, id, gm)))
        }
        // body is in ir.components
        this.ir2graph(ir.components, gm.children[gm.children.length - 1], `${id}-components`, undefined, options)

        return [gm.children[gm.children.length - 1].id]
      } else if (AST.isLet(ir)) {
        // regular let
        const s = JSON.stringify(ir.declarations, undefined, 4)
        gm.children.push(
          this.drawNodeNew(id, s, ir.type, undefined, Object.assign(options, { value: ir.declarations }))
        )
        if (prevId) {
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, id, gm)))
        }

        return this.ir2graph(ir.components, gm, `${id}-components`, [id], options)
      } else if (AST.isLiteral(ir)) {
        const s = JSON.stringify(ir.value, undefined, 4)
        gm.children.push(this.drawNodeNew(id, s, ir.type, undefined, Object.assign(options, { value: ir.value })))
        if (prevId) {
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, id, gm)))
        }

        return [id]
      } else if (AST.isFinally(ir)) {
        const lastBodyNode = this.ir2graph(ir.body, gm, `${id}-body`, prevId, /* undefined, */ options)
        return this.ir2graph(ir.finalizer, gm, `${id}-finalizer`, lastBodyNode, /* undefined, */ options)
      } else if (AST.isParallelLike(ir)) {
        // par and map
        const label =
          ir.type === 'map' || ir.type === 'forall' ? 'Parallel Map over Array' : 'Execute Tasks in Parallel'

        const tooltipHeader =
          ir.type === 'par' || ir.type === 'parallel' ? 'Parallel' : ir.type === 'map' ? 'Map' : ir.type

        const tooltip =
          ir.type === 'map' || ir.type === 'forall'
            ? 'Executes a single task in parallel for each element of the input array'
            : 'Executes a set of tasks in parallel, passing the same input data to each task'

        let parent = prevId
        if (ir.set) {
          // input set to the parallel construct
          parent = this.ir2graph(ir.set, gm, `${id}-${ir.type}-set`, parent, options)
        }

        // render the "Fork" node
        const fork = this.addDummy(parent, undefined, gm, {
          label,
          tooltipHeader,
          tooltip
        })

        // for now, the parent of the body is the fork node; if the ir
        // specifies an input set, then we'll change this
        parent = [fork]

        // render the par/map body
        let exits: string[]
        if (AST.isMapLike(ir)) {
          // for map, render the components as a sequence
          //         Fork (the "fork" node that we rendered just above)
          //          |
          //     a ->  b ->  c  <-- we're doing this part now
          //          |
          //        Join (we'll render this just below)
          const body = ir.components || ir.body
          const ellipsis: AST.Literal = { type: 'literal', value: '...' }
          const spreadItOut = [body, body, ellipsis, body]
          exits = spreadItOut.map((component, idx) => {
            return this.ir2graph(component, gm, `${id}-component-${idx}`, parent, options)[0]
          })
        } else {
          // for parallel, render the components as a fan-out
          //         Fork (the "fork" node that we rendered just above)
          //      /   |   \
          //     a    b    c  <-- we're doing this part now
          //      \   |   /
          //        Join (we'll render this just below)
          exits = ir.components.map((component, idx) => {
            return this.ir2graph(component, gm, `${id}-component-${idx}`, parent, options)[0]
          })
        }

        // finally, render the "Join" node
        const exitConcentrator = this.addDummy(exits, undefined, gm, {
          label: 'Wait for Completion',
          tooltipHeader: `${tooltipHeader} completion`,
          tooltip: 'Wait for the parallel tasks to complete, and then return an array of results'
        })
        return [exitConcentrator]
      } else if (AST.isComponentBearing(ir)) {
        // generic handler for any subgraph-via-body node
        const label = capitalize(ir.type)
        const type = ir.type
        const body = this.drawNodeNew(id, label, type, undefined, options)

        body.children = []
        body.edges = []
        gm.children.push(body)

        if (prevId) {
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, id, gm)))
        }

        // render the components as a sequence
        this.ir2graph(ir.components, body, `${id}-components`, undefined, options)

        return [id]
      } else if (typeof ir === 'object') {
        // generic handler for any opaque node
        const type = 'action'
        const label = ir.type

        gm.children.push(this.drawNodeNew(id, label, type, undefined, options))

        if (prevId) {
          prevId.forEach(pid => gm.edges.push(this.drawEdgeNew(pid, id, gm)))
        }

        debug('generic handler', ir, label, type)

        return [id]
      }
    }
  }
}

/**
 * @return the cumulative number of nodes in the given composition that are not of type Function
 *
 */
const numNonFunctions = (composition: AST.ASTNode): number => {
  if (composition === undefined) return 0
  if (composition.type === 'function') {
    return 0
  } else if (composition.type) {
    // then this is a compound node of some type
    let sum = 0
    for (const key in composition) {
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
 * Heuristic: is this composition "pretty simple"?
 *
 */
const isSimpleComposition = (ir: AST.ASTNode): boolean => {
  const isShort = AST.isComponentArrayBearing(ir) ? ir.components.length <= 2 : true
  const numNonFuncs = numNonFunctions(ir)
  const atMostOneNonFunction = numNonFuncs <= 3

  debug('isSimpleComposition', isShort, numNonFuncs)
  return isShort && atMostOneNonFunction
}

export default async function fsm2graph(
  tab: Tab,
  ir: AST.ASTNode,
  containerElement?: HTMLElement,
  acts?: ActivationLike[],
  options?: NodeOptions,
  rule?: { trigger: { name: string } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Response> {
  // console.log(ir, containerElement, acts);

  const renderState = new RenderState(acts)

  if (renderState.activations) {
    // parse the activations to get a list of states that was visted
    debug('activations', renderState.activations)
    renderState.visited = {}
    renderState.activations.forEach((a, index) => {
      if (a.logs) {
        // states recorded in logs
        a.logs.forEach(log => {
          if (log.indexOf('Entering composition') !== -1) {
            // a conductor path log
            let path = log.substring(log.lastIndexOf(' ') + 1)
            // replace all [,],.in path to - to use as a id, as css selector cannot have those characters
            path = path.replace(/[\[\.]/g, '-').replace(/\]/g, '') // eslint-disable-line no-useless-escape
            if (renderState.visited[path] === undefined) renderState.visited[path] = []
            renderState.visited[path].push(index)
          }
        })
      }
    })
    Object.keys(renderState.visited).forEach(k => {
      // make sure the compound node, if any, is included in visited too.
      const seg = k.split('-')
      seg.pop() // kick out the last element == get the compound node id
      const path = seg.join('-')
      if (renderState.visited[path] === undefined) renderState.visited[path] = []
      renderState.visited[path] = renderState.visited[path].concat(renderState.visited[k]) // join it back, value is all the items in the child arrays (not sure if it's necessary)
    })
    debug('visited nodes:', renderState.visited)
  } else {
    renderState.actions = {}
  }

  debug('generating graph model')

  const renderFunctionsInView = isSimpleComposition(ir)
  const viewOptions = Object.assign({ renderFunctionsInView }, options)

  if ((rule && rule.trigger) || AST.isOn(ir)) {
    debug('using rule as start', rule)
    const start = renderState.drawNodeNew('Entry', 'trigger', 'Entry')
    start.properties.kind = 'trigger'
    start.properties.kindDetail = rule ? rule.trigger.name : AST.isOn(ir) && ir.trigger
    start.width = 24
    renderState.graphData.children.push(start) // insert Entry node

    if (AST.isOn(ir)) {
      // no need to render the "on" wrapper, as we've already
      // signified the trigger in the Start node
      ir = ir.components
    }
  } else {
    renderState.graphData.children.push(renderState.drawNodeNew('Entry', 'start', 'Entry')) // insert Entry node
  }

  let lastNodes = renderState.ir2graph(
    ir,
    renderState.graphData,
    'composition',
    ['Entry'], // build the graph model, link the start of the graph to Entry
    viewOptions
  ) // <-- options to the rendering
  if (lastNodes === undefined) {
    lastNodes = ['Entry']
  }
  renderState.graphData.children.push(renderState.drawNodeNew('Exit', 'end', 'Exit', lastNodes)) // insert Exit node
  lastNodes.forEach(pid =>
    renderState.graphData.edges.push(renderState.drawEdgeNew(pid, 'Exit', renderState.graphData))
  ) // link the end of the graph to Exit

  debug('graphData', renderState.graphData)
  const subtext = await renderSubtext(tab, renderState.actions, renderState.activations, renderState.graphData, options)
  debug('subtext', subtext)

  debug('inserting DOM, calling graph2doms')

  const graph2doms = (await import('./graph2doms')).default
  const response = await graph2doms(tab, renderState.graphData, containerElement, renderState.activations)
  return Object.assign(response, { subtext })
}
