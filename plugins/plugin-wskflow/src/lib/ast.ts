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

type NodeType =
  | 'sequence'
  | 'seq'
  | 'on'
  | 'map'
  | 'forall'
  | 'par'
  | 'parallel'
  | 'finally'
  | 'literal'
  | 'value'
  | 'let'
  | 'repeat'
  | 'retain'
  | 'retry'
  | 'dowhile'
  | 'dowhile_nosave'
  | 'while'
  | 'while_nosave'
  | 'try'
  | 'empty'
  | 'if'
  | 'function'
  | 'action'

export interface Node {
  type: NodeType
}

export interface ValueBearing extends Node {
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Literal extends ValueBearing {
  type: 'literal' | 'value'
}

export function isLiteral(ast: Node): ast is Literal {
  return ast.type === 'literal' || ast.type === 'value'
}

export interface ComponentBearing extends Node {
  components: Node
}

export interface Conditional extends Node {
  test: Node
  consequent: Node
  alternate: Node
}

export function isConditional(ast: Node): ast is Conditional {
  return ast.type === 'if'
}

export interface BodyBearing extends Node {
  body: Node
}

export interface TestBearing extends BodyBearing {
  test: Node
}

export interface While extends TestBearing {
  type: 'while' | 'while_nosave'
}

export function isWhile(ast: Node): ast is While {
  return ast.type === 'while' || ast.type === 'while_nosave'
}

export interface DoWhile extends TestBearing {
  type: 'dowhile' | 'dowhile_nosave'
}

export function isDoWhile(ast: Node): ast is DoWhile {
  return ast.type === 'dowhile' || ast.type === 'dowhile_nosave'
}

export interface Try extends BodyBearing {
  type: 'try'
  handler: Node
}

export function isTry(ast: Node): ast is Try {
  return ast.type === 'try'
}

export interface Action extends Node {
  type: 'action'
  name: string
  displayLabel?: string
}

export function isAction(ast: Node): ast is Action {
  return ast.type === 'action'
}

export interface Function extends Node {
  function: {
    exec: {
      code: string
      prettyCode?: string
    }
  }
}

export function isFunction(ast: Node): ast is Function {
  return ast.type === 'function'
}

export interface Finally extends BodyBearing {
  type: 'finally'
  finalizer: Node
}

export function isFinally(ast: Node): ast is Finally {
  return ast.type === 'finally'
}

export interface On extends ComponentBearing {
  type: 'on'
  trigger: string
}

export function isOn(ast: Node): ast is On {
  return ast.type === 'on'
}

export interface RetryOrRepeat extends ComponentBearing {
  type: 'retry' | 'repeat'
  count: string
}

export function isRetryOrRepeat(ast: Node): ast is RetryOrRepeat {
  return ast.type === 'retry' || ast.type === 'repeat'
}

export interface Let extends ComponentBearing {
  type: 'let'
  declarations: string
}

export function isLet(ast: Node): ast is Let {
  return ast.type === 'let'
}

export function isSequence(ast: Node): ast is ComponentBearing {
  return ast.type === 'sequence' || ast.type === 'seq'
}

export function isRetain(ast: Node): ast is ComponentBearing {
  return ast.type === 'retain'
}

export function isComponentBearing(ast: Node): ast is ComponentBearing {
  const cb = ast as ComponentBearing
  return typeof cb.components === 'object'
}

export interface ComponentArrayBearing extends Node {
  components: Node[]
}

export interface ParallelLike extends ComponentArrayBearing {
  type: 'parallel' | 'par' | 'map' | 'forall'
  set?: Node
}

export function isParallelLike(ast: Node): ast is ParallelLike {
  return (
    ast.type === 'parallel' ||
    ast.type === 'par' ||
    ast.type === 'map' ||
    ast.type === 'forall'
  )
}

export interface MapLike extends Node {
  type: 'map' | 'forall'
  components?: Node
  body?: Node
}

export function isMapLike(ast: Node): ast is MapLike {
  return ast.type === 'map' || ast.type === 'forall'
}
