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

import {
  Dict,
  KeyVal,
  Limits,
  Response,
  PathName,
  Status,
  ActionDesc,
  PackageDesc,
  RuleDesc,
  TriggerDesc
} from 'openwhisk'
import { ResourceWithMetadata } from '@kui-shell/core'

/** our synthetic apiVersion */
export const apiVersion = 'openwhisk/v1'

export interface Metadata {
  name: string
  namespace: string
  creationTimestamp?: string
}

export interface ResourceWithNonOptionalMetadata extends ResourceWithMetadata {
  metadata: Metadata
}

/** kind attribute */
export interface WithKind extends ResourceWithNonOptionalMetadata {
  kind: string
}

/** has a kind attribute? */
export function hasKind(resource: ResourceWithNonOptionalMetadata): resource is WithKind {
  return typeof (resource as WithKind).kind === 'string'
}

/** version attribute */
export interface WithVersion extends ResourceWithNonOptionalMetadata {
  version?: string
}

/** has a version attribute? */
export function hasVersion(resource: ResourceWithNonOptionalMetadata): resource is WithVersion {
  return typeof (resource as WithVersion).version === 'string'
}

/** payload with raw data as fetched from the backend */
export interface RawDataBearing extends ResourceWithNonOptionalMetadata {
  data?: string
}

/** has a raw data payload? */
export function hasRawData(resource: ResourceWithNonOptionalMetadata): resource is RawDataBearing {
  return typeof (resource as RawDataBearing).data === 'string'
}

export type OpenWhiskResource = WithKind &
  RawDataBearing & {
    apiVersion
  }

export function isOpenWhiskResource(resource: ResourceWithMetadata): resource is OpenWhiskResource {
  return (resource as OpenWhiskResource).apiVersion === apiVersion
}

export interface WithAnnotations extends OpenWhiskResource {
  annotations: KeyVal[]
}

export function hasAnnotations(resource: ResourceWithNonOptionalMetadata): resource is WithAnnotations {
  const res = resource as WithAnnotations
  return isOpenWhiskResource(res) && Array.isArray(res.annotations) && res.annotations.length > 0
}

export function hasAnnotation(resource: WithAnnotations, key: string, value?: string): boolean {
  const anno = resource.annotations.find(_ => _.key === key)

  if (value === undefined) {
    return !!anno
  } else {
    return anno.value === value
  }
}

export interface WithParameters extends OpenWhiskResource {
  parameters: KeyVal[]
}

export function hasParameters(resource: ResourceWithNonOptionalMetadata): resource is WithParameters {
  if (isOpenWhiskResource(resource)) {
    const res = resource as WithParameters
    return res.parameters !== undefined && Array.isArray(res.parameters) && res.parameters.length > 0
  } else {
    return false
  }
}

export interface WithLimits extends OpenWhiskResource {
  limits: Limits
}

export function hasLimits(resource: ResourceWithNonOptionalMetadata): resource is WithLimits {
  return isOpenWhiskResource(resource) && (resource as WithLimits).limits !== undefined
}

export interface Action extends WithAnnotations, WithParameters, WithLimits {
  kind: 'Action'
  exec: {
    kind: string
    code?: string
    binary?: boolean
    components?: string[]
  }
}

export interface ActionWithCode extends Action {
  exec: {
    kind: string
    code: string
    binary?: boolean
  }
}

export function isAction(resource: ResourceWithNonOptionalMetadata): resource is Action {
  return isOpenWhiskResource(resource) && resource.kind === 'Action'
}

export interface Sequence extends Action {
  exec: {
    kind: 'sequence'
    components: string[]
  }
}

export function isSequence(resource: ResourceWithNonOptionalMetadata): resource is Sequence {
  return isAction(resource) && resource.exec.kind === 'sequence'
}

export function hasCode(action: ResourceWithNonOptionalMetadata): action is ActionWithCode {
  return isAction(action) && action.exec.code !== undefined
}

export function hasTextualCode(action: ResourceWithNonOptionalMetadata): action is ActionWithCode {
  return hasCode(action) && !action.exec.binary
}

export function hasBinaryCode(action: ResourceWithNonOptionalMetadata): action is ActionWithCode {
  return hasCode(action) && action.exec.binary
}

interface RoleAnnotation {
  badge: string
  role: string
  type: string
}

function isRoleAnnotation(value: RoleAnnotation | string | number | boolean | object): value is RoleAnnotation {
  const anno = value as RoleAnnotation
  return typeof anno.badge === 'string' && typeof anno.role === 'string'
}

export function hasZipCode(action: ResourceWithNonOptionalMetadata): action is ActionWithCode {
  const combinatorArtifacts =
    hasAnnotations(action) && action.annotations && action.annotations.find(({ key }) => key === 'wskng.combinators')
  if (combinatorArtifacts) {
    const annotations = Array.isArray(combinatorArtifacts.value)
      ? combinatorArtifacts.value
      : [combinatorArtifacts.value]
    return (
      annotations &&
      annotations.find(annotation => {
        return isRoleAnnotation(annotation) && annotation.role === 'replacement' && annotation.badge === 'zip'
      })
    )
  }
}

export interface BlackboxAction extends Action {
  exec: {
    kind: 'blackbox'
    image: string
    binary: boolean
  }
}

export function isBlackbox(action: ResourceWithNonOptionalMetadata): action is BlackboxAction {
  return isAction(action) && action.exec.kind === 'blackbox'
}

export interface Trigger extends WithAnnotations, WithLimits, WithParameters {
  kind: 'Trigger'
}

export function isTrigger(resource: ResourceWithNonOptionalMetadata): resource is Trigger {
  return isOpenWhiskResource(resource) && resource.kind === 'Trigger'
}

export interface FQN {
  name: string
}

export interface WithActions extends ResourceWithNonOptionalMetadata {
  actions: FQN[]
}

export interface WithActionDescs extends ResourceWithNonOptionalMetadata {
  actions: ActionDesc[]
}

function isActionDesc(resource: ActionDesc | object): resource is ActionDesc {
  const desc = resource as ActionDesc
  return typeof desc.name === 'string' && typeof desc.version === 'string'
}

function isFQN(resource: FQN | object): resource is FQN {
  const fqn = resource as FQN
  return typeof fqn.name === 'string'
}

export function hasActions(resource: ResourceWithNonOptionalMetadata): resource is WithActions {
  const res = resource as WithActions
  return Array.isArray(res.actions) && res.actions.length > 0 && isFQN(res.actions[0]) && !isActionDesc(res.actions[0])
}

export function hasActionDescs(resource: ResourceWithNonOptionalMetadata): resource is WithActionDescs {
  const res = resource as WithActionDescs
  return Array.isArray(res.actions) && res.actions.length > 0 && isActionDesc(res.actions[0])
}

export interface WithPackages extends ResourceWithNonOptionalMetadata {
  packages: PackageDesc[]
}

export function hasPackages(resource: ResourceWithNonOptionalMetadata): resource is WithPackages {
  const res = resource as WithPackages
  return Array.isArray(res.packages) && res.packages.length > 0
}

export interface WithRules extends ResourceWithNonOptionalMetadata {
  rules: RuleDesc[]
}

export function hasRules(resource: ResourceWithNonOptionalMetadata): resource is WithRules {
  const res = resource as WithRules
  return Array.isArray(res.rules) && res.rules.length > 0
}

export interface WithTriggers extends ResourceWithNonOptionalMetadata {
  triggers: TriggerDesc[]
}

export function hasTriggers(resource: ResourceWithNonOptionalMetadata): resource is WithTriggers {
  const res = resource as WithTriggers
  return Array.isArray(res.triggers) && res.triggers.length > 0
}

export interface WithFeeds extends ResourceWithNonOptionalMetadata {
  feeds: FQN[]
}

export function hasFeeds(resource: ResourceWithNonOptionalMetadata): resource is WithFeeds {
  const res = resource as WithFeeds
  return Array.isArray(res.feeds) && res.feeds.length > 0
}

export interface WithBinding extends ResourceWithNonOptionalMetadata {
  binding?: { name: string; namespace: string }
}

export function hasBinding(resource: ResourceWithNonOptionalMetadata): resource is WithBinding {
  const res = resource as WithBinding
  return res.binding !== undefined && typeof res.binding.name === 'string' && typeof res.binding.namespace === 'string'
}

export type Package = WithAnnotations &
  WithParameters &
  WithActions &
  WithFeeds &
  WithBinding & {
    kind: 'Package'
  }

export function isPackage(resource: ResourceWithNonOptionalMetadata): resource is Package {
  return isOpenWhiskResource(resource) && resource.kind === 'Package'
}

export interface WithLogs extends ResourceWithNonOptionalMetadata {
  logs: string[]
}

export function hasLogs(resource: ResourceWithNonOptionalMetadata): resource is WithLogs {
  const res = resource as WithLogs
  return res.logs !== undefined && Array.isArray(res.logs) && res.logs.length > 0 && typeof res.logs[0] === 'string'
}

export interface WithResponse<T extends Dict> extends ResourceWithNonOptionalMetadata {
  response: Response<T>
}

export function hasResponse<T extends Dict>(resource: ResourceWithNonOptionalMetadata): resource is WithResponse<T> {
  const res = resource as WithResponse<T>
  return res.response !== undefined && typeof res.response === 'object'
}

export interface WithActivationId extends ResourceWithNonOptionalMetadata {
  activationId: string
}

export function hasActivationId(resource: ResourceWithNonOptionalMetadata): resource is WithActivationId {
  const res = resource as WithActivationId
  return typeof res.activationId === 'string'
}

export interface WithDuration extends ResourceWithNonOptionalMetadata {
  end?: number
  start?: number
  duration: number
}

export function hasDuration(resource: ResourceWithNonOptionalMetadata): resource is WithDuration {
  const res = resource as WithDuration
  return typeof res.duration === 'number'
}

export type Activation<T = Dict> = WithAnnotations &
  WithLogs &
  WithResponse<T> &
  WithLimits &
  WithActivationId &
  WithDuration & {
    kind: 'Activation'
    start: number
    end: number
    statusCode: number
  }

export function isActivation<T extends Dict>(resource: ResourceWithNonOptionalMetadata): resource is Activation<T> {
  return isOpenWhiskResource(resource) && resource.kind === 'Activation'
}

export function isSequenceActivation<T extends Dict>(
  resource: ResourceWithNonOptionalMetadata
): resource is Activation<T> {
  return isActivation(resource) && hasAnnotation(resource, 'kind', 'sequence')
}

export type Invokeable = Action | Trigger | Activation<Dict>

export function isInvokeable(resource: ResourceWithNonOptionalMetadata): resource is Invokeable {
  return isAction(resource) || isTrigger(resource) || isActivation<Dict>(resource)
}

function isPathName(obj: object): obj is PathName {
  const path = obj as PathName
  return path !== undefined && typeof path.path === 'string' && typeof path.name === 'string'
}

function isStatus(obj: Status | object): obj is Status {
  return (
    (typeof obj === 'string' && obj === 'active') ||
    obj === 'inactive' ||
    obj === 'activating' ||
    obj === 'deactivating'
  )
}

export interface WithAction extends ResourceWithNonOptionalMetadata {
  action: PathName
}

export function hasAction(resource: ResourceWithNonOptionalMetadata): resource is WithAction {
  const res = resource as WithAction
  return isPathName(res.action)
}

export interface WithTrigger extends ResourceWithNonOptionalMetadata {
  trigger: PathName
}

export function hasTrigger(resource: ResourceWithNonOptionalMetadata): resource is WithTrigger {
  const res = resource as WithTrigger
  return isPathName(res.trigger)
}

export interface WithStatus extends ResourceWithNonOptionalMetadata {
  status: Status
}

export function hasStatus(resource: ResourceWithNonOptionalMetadata): resource is WithStatus {
  const res = resource as WithStatus
  return isStatus(res.status)
}

export type Rule = OpenWhiskResource &
  WithAction &
  WithTrigger &
  WithStatus & {
    kind: 'Rule'
  }

export function isRule(resource: ResourceWithNonOptionalMetadata): resource is Rule {
  return isOpenWhiskResource(resource) && resource.kind === 'Rule'
}

export type Deleteable = Action | Package | Trigger | Rule

export function isDeleteable(resource: OpenWhiskResource): resource is Deleteable {
  return isAction(resource) || isPackage(resource) || isTrigger(resource) || isRule(resource)
}

export function isWebExported(resource: ResourceWithNonOptionalMetadata): boolean {
  if (hasAnnotations(resource)) {
    const anno = resource.annotations.find(_ => _.key === 'web-export')
    return anno !== undefined && anno.value === true
  } else {
    return false
  }
}

export type Namespace = OpenWhiskResource &
  WithActionDescs &
  WithPackages &
  WithRules &
  WithTriggers & {
    kind: 'Namespace'
  }
