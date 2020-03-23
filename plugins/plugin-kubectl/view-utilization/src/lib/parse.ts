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

import { Table } from '@kui-shell/core'
import * as bytes from 'bytes-iec'

export function cpuFraction(str: string): number {
  return parseInt(str.replace(/%$/, ''), 10)
}

export function cpuShare(str: string): number {
  if (/m$/.test(str)) {
    return parseInt(str.replace(/m$/, ''), 10)
  } else {
    return parseInt(str, 10) * 1000
  }
}

const byte = 1
const kilobytes = 1024 * byte
const megabytes = 1024 * kilobytes
const gigabytes = 1024 * megabytes
const terabytes = 1024 * gigabytes
const petabytes = 1024 * terabytes
const exabytes = 1024 * petabytes

export function memShare(str: string): number {
  let end = 2
  let unit = byte

  if (/Ei$/.test(str)) {
    unit = exabytes
  } else if (/Pi$/.test(str)) {
    unit = petabytes
  } else if (/Ti$/.test(str)) {
    unit = terabytes
  } else if (/Gi$/.test(str)) {
    unit = gigabytes
  } else if (/Mi$/.test(str)) {
    unit = megabytes
  } else if (/Ki$/.test(str)) {
    unit = kilobytes
  } else {
    end = 1
  }

  return parseInt(str.slice(0, str.length - end), 10) * unit
}

export function formatAsBytes(mem: number): string {
  if (mem < kilobytes) {
    return mem.toString()
  } else if (mem < 10 * megabytes) {
    return (mem / kilobytes).toFixed(0) + 'Ki'
  } else if (mem < 10 * gigabytes) {
    return (mem / megabytes).toFixed(0) + 'Mi'
  } else if (mem < 10 * terabytes) {
    return (mem / gigabytes).toFixed(0) + 'Gi'
  } else if (mem < 10 * petabytes) {
    return (mem / terabytes).toFixed(0) + 'Ti'
  } /* if (mem < 10 * petabytes) */ else {
    return (mem / petabytes).toFixed(0) + 'Pi'
  }
}

export function formatAsCpu(cpu: number): string {
  return cpu > 10000 ? (cpu / 1000).toFixed(0) : `${cpu}m`
}

export function parseAsTime(str: string): string {
  return cpuShare(str).toString()
}

export function fromSize(str: string): number {
  return bytes(
    str
      .replace(/m/g, 'MB')
      .replace(/Ki/g, 'KiB')
      .replace(/Mi/g, 'MiB')
      .replace(/Gi/g, 'GiB')
      .replace(/Ti/g, 'TiB')
      .replace(/Pi/g, 'PiB')
      .replace(/Ei/g, 'EiB')
  )
}

/**
 * @return the sum of the attributes in the given column, interpreted
 * as times
 *
 */
export function sumTime(table: Table, attrIdx: number, backupAttrIdx = attrIdx): number {
  return table.body
    .map(_ =>
      cpuShare(_.attributes[attrIdx].value === '0' ? _.attributes[backupAttrIdx].value : _.attributes[attrIdx].value)
    )
    .reduce((sum, _) => sum + _, 0)
}

/**
 * @return the sum of the attributes in the given column, interpreted as sizes
 *
 */
export function sumSize(table: Table, attrIdx: number, backupAttrIdx = attrIdx): number {
  return table.body
    .map(_ =>
      fromSize(_.attributes[attrIdx].value === '0Ki' ? _.attributes[backupAttrIdx].value : _.attributes[attrIdx].value)
    )
    .reduce((sum, _) => sum + _, 0)
}

export function parseAsSize(str: string): string {
  return bytes(fromSize(str), {})
}

export default parseAsSize
