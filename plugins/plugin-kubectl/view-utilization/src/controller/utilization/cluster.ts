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

/* import { Arguments, Table, i18n } from '@kui-shell/core'

import getPodData from '../get-pod-data'
import getNodeData from '../get-node-data'
import { cpuFraction, cpuShare, memShare, fromSize, sumTime, sumSize } from '../../lib/parse'
import { BarColor, singletonBar as bar } from '../../view/bar'
import { cpuPretty, memPretty, calcPercentage } from '../../lib/format'

const strings = i18n('plugin-kubectl', 'view-utilization-table') */

//
// For a primer on terminology, look at the README.md for this plugin.
//

/**
 * @return the Schedulable metric
 *
 */
/* function calcSched(requests: number, capacity: number): number {
  if (capacity >= requests) {
    return capacity - requests
  } else {
    return 0
  }
} */

/**
 * @return the free ratio
 *
 */
/* function calcFree(requests: number, limits: number, allocatable: number): number {
  const totalUsed = requests // limits > requests ? limits : requests
  if (allocatable > totalUsed) {
    return allocatable - totalUsed
  } else {
    return 0
  }
} */

/** column headers */
/* export const headerNames = {
  req: 'REQUESTS',
  percentReq: '%REQUESTS',
  lim: 'LIMITS',
  percentLim: '%LIMITS',
  alloc: 'ALLOCATABLE',
  capacity: 'CAPACITY',
  percentConsumed: '%CONSUMED'
} */

/**
 * Formatter for `utilization cluster`
 *
 */
/* function formatClusterUtilization(nodes: Table, pods: Table): Table {
  const allocCpu = sumTime(nodes, 0)
  const allocMem = sumSize(nodes, 1)
  const reqCpu = sumTime(pods, 3)
  const reqMem = sumSize(pods, 4)
  const limCpu = sumTime(pods, 5, 3)
  const limMem = sumSize(pods, 6, 4)

  // %REQUESTS = requests/allocatable
  const percentReqCpu = calcPercentage(reqCpu, allocCpu)
  const percentReqMem = calcPercentage(reqMem, allocMem)

  // %LIMITS = limit/allocatable
  const percentLimCpu = calcPercentage(limCpu, allocCpu)
  const percentLimMem = calcPercentage(limMem, allocMem)

  // SCHEDULABLE = Math.max(0, allocatable - requests)
  // const schedCpuText = cpuPretty(calcSched(reqCpu, capacityCpu))
  // const schedMemText = memPretty(calcSched(reqMem, capacityMem))

  // does max (i.e. "limit") exceed remaining capacity (i.e. "allocatable")?
  const isCpuOvercommitted = limCpu > allocCpu
  const isMemOvercommitted = limMem > allocMem

  // %CONSUMED: 1-allocatabale/capacity
  const percentConsumedCpu = calcPercentage(allocCpu - calcFree(reqCpu, limCpu, allocCpu), allocCpu)
  const percentConsumedMem = calcPercentage(allocMem - calcFree(reqMem, limMem, allocMem), allocMem)

  const cpuRow = {
    name: 'CPU',
    attributes: [
      { value: cpuPretty(reqCpu), outerCSS: 'hide-with-sidecar' },
      { value: percentReqCpu, valueDom: bar(BarColor.CPU, percentReqCpu) },
      { value: cpuPretty(limCpu), outerCSS: 'hide-with-sidecar', css: isCpuOvercommitted ? 'red-text' : '' },
      {
        value: percentLimCpu,
        valueDom: bar(isCpuOvercommitted ? BarColor.Overcommitted : BarColor.CPU, percentLimCpu)
      },
      { value: cpuPretty(allocCpu) },
      { value: percentConsumedCpu, valueDom: bar(BarColor.CPU, percentConsumedCpu) }
    ]
  }
  const memRow = {
    name: 'Memory',
    attributes: [
      { value: memPretty(reqMem), outerCSS: 'hide-with-sidecar' },
      { value: percentReqMem, valueDom: bar(BarColor.Memory, percentReqMem) },
      { value: memPretty(limMem), outerCSS: 'hide-with-sidecar', css: isMemOvercommitted ? 'red-text' : '' },
      {
        value: percentLimMem,
        valueDom: bar(isMemOvercommitted ? BarColor.Overcommitted : BarColor.Memory, percentLimMem)
      },
      { value: memPretty(allocMem) },
      { value: percentConsumedMem, valueDom: bar(BarColor.Memory, percentConsumedMem) }
    ]
  }
  return {
    header: {
      name: 'Resource',
      attributes: [
        { key: headerNames.req, value: strings(headerNames.req), outerCSS: 'hide-with-sidecar' },
        { key: headerNames.percentReq, value: strings(headerNames.percentReq) },
        { key: headerNames.lim, value: strings(headerNames.lim), outerCSS: 'hide-with-sidecar' },
        { key: headerNames.percentLim, value: strings(headerNames.percentLim) },
        { key: headerNames.alloc, value: strings(headerNames.alloc) },
        { key: headerNames.percentConsumed, value: strings(headerNames.percentConsumed) }
      ]
    },
    body: [cpuRow, memRow]
  }
} */
