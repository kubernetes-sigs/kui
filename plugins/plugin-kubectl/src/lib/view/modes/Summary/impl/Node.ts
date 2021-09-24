/*
 * Copyright 2020 The Kubernetes Authors
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

/**
 * Name: 10.73.230.207
 * Status: Ready
 * Roles: <none>
 * Age: 435d
 * Version: v1.15.1+IKS
 * Internal-ip: 10.73.230.207
 * External-ip: 169.62.248.114
 * Os-image: Ubuntu 16.04.6 LTS
 * Kernel-version: 4.4.0-157-generic
 * Container-runtime: 'containerd://1.2.7'
 *
 */

import { i18n } from '@kui-shell/core'

import { age, none } from './Generic'
import toDescriptionList from './convert'
import Parser from '../../../../util/parse'
import { AddressType, Node } from '../../../../model/resource'

const strings = i18n('plugin-kubectl')

function address(type: AddressType, node: Node) {
  const addr = node.status.addresses.find(_ => _.type === type)
  return addr ? addr.address : none()
}

function tryParse(intAsString: string): number | string {
  try {
    return parseInt(intAsString)
  } catch (err) {
    return intAsString
  }
}

function free(metric: 'memory' | 'ephemeral-storage', { status }: Node) {
  return strings('percentFree', Parser.fractionOfMemory(status.allocatable[metric], status.capacity[metric]))
}

export default function NodeSummary(node: Node) {
  const { metadata, status } = node

  return toDescriptionList({
    Name: metadata.name,
    Age: age(node),
    CPUs: tryParse(status.capacity.cpu),
    Memory: Parser.reformatAsBytes(status.capacity.memory) + ` (${free('memory', node)})`,
    'Ephemeral Storage':
      Parser.reformatAsBytes(status.capacity['ephemeral-storage']) + ` (${free('ephemeral-storage', node)})`,
    'External IP': address('ExternalIP', node),
    'Internal IP': address('InternalIP', node),
    'OS Image': status.nodeInfo.osImage,
    'Kernel Version': status.nodeInfo.kernelVersion,
    'Container Runtime': status.nodeInfo.containerRuntimeVersion
  })
}
