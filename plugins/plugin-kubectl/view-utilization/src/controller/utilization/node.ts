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

// import { Arguments, Table } from '@kui-shell/core'

// import getPodData from '../get-pod-data'
// import getNodeData from '../get-node-data'
// import { BarColor, singletonBar as bar } from '../../view/bar'
// import { sumTime, sumSize, cpuShare, fromSize } from '../../lib/parse'
// import { cpuPretty, memPretty, calcPercentage } from '../../lib/format'

/**
 * Formatter for `utilization node`
 *
 */
/* function formatNodeUtilization(nodes: Table, allPods: Table): Table {
  const header = {
    name: 'Node',
    attributes: [
      { value: 'CPU Requests', outerCSS: 'hide-with-sidecar' },
      { value: 'CPU Limits', outerCSS: 'hide-with-sidecar' },
      { value: 'CPU %Requests', outerCSS: 'hide-with-sidecar' },
      { value: 'CPU %Limits' },
      { value: 'Mem Requests', outerCSS: 'hide-with-sidecar' },
      { value: 'Mem Limits', outerCSS: 'hide-with-sidecar' },
      { value: 'Mem %Requests', outerCSS: 'hide-with-sidecar' },
      { value: 'Mem %Limits' }
    ]
  }

  const body = nodes.body.map(node => {
    const ip = node.name
    const pods = { body: allPods.body.filter(_ => _.attributes[2].value === ip) }

    const allocCpu = cpuShare(node.attributes[0].value)
    const allocMem = fromSize(node.attributes[1].value)
    const reqCpu = sumTime(pods, 3)
    const reqMem = sumSize(pods, 4)
    const limCpu = sumTime(pods, 5, 3)
    const limMem = sumSize(pods, 6, 4)

    const reqCpuText = cpuPretty(reqCpu)
    const reqMemText = memPretty(reqMem)
    const limCpuText = cpuPretty(limCpu)
    const limMemText = memPretty(limMem)

    const percentReqCpuText = calcPercentage(reqCpu, allocCpu)
    const percentReqMemText = calcPercentage(reqMem, allocMem)

    const percentLimCpuText = calcPercentage(limCpu, allocCpu)
    const percentLimMemText = calcPercentage(limMem, allocMem)

    return {
      name: node.name,
      onclick: node.onclick,
      attributes: [
        { value: reqCpuText, outerCSS: 'hide-with-sidecar' },
        { value: limCpuText, outerCSS: 'hide-with-sidecar' },
        { value: percentReqCpuText, valueDom: bar(BarColor.CPU, percentReqCpuText), outerCSS: 'hide-with-sidecar' },
        { value: percentLimCpuText, valueDom: bar(BarColor.CPU, percentLimCpuText) },
        { value: reqMemText, outerCSS: 'hide-with-sidecar' },
        { value: limMemText, outerCSS: 'hide-with-sidecar' },
        { value: percentReqMemText, valueDom: bar(BarColor.Memory, percentReqMemText), outerCSS: 'hide-with-sidecar' },
        { value: percentLimMemText, valueDom: bar(BarColor.Memory, percentLimMemText) }
      ]
    }
  })

  return {
    header,
    body
  }
} */

/**
 * Command handler for `utilization node`
 *
 */
export default async function nodeUtilization() {
  // const [nodes, pods] = await Promise.all([getNodeData(args, true), getPodData(args, true)])

  // return formatNodeUtilization(nodes, pods)
  return true
}
