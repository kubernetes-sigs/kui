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

type NodeType = 'sequence' | 'seq' | 'on' | 'map' | 'forall' | 'par' | 'parallel' | 'finally' | 'literal' | 'value' | 'let' | 'repeat' | 'retain' | 'retry' | 'dowhile' | 'dowhile_nosave' | 'while' | 'while_nosave' | 'try' | 'empty' | 'if' | 'function' | 'action'

export interface Node {
  type: NodeType
}

export interface IValueBearing extends Node {
  value: any
}

export interface ILiteral extends IValueBearing {
  type: 'literal' | 'value'
}

export function isLiteral (ast: Node): ast is ILiteral {
  return ast.type === 'literal' || ast.type === 'value'
}

export interface IComponentBearing extends Node {
  components: Node
}

export interface IConditional extends Node {
  test: Node
  consequent: Node
  alternate: Node
}

export function isConditional (ast: Node): ast is IConditional {
  return ast.type === 'if'
}

export interface IBodyBearing extends Node {
  body: Node
}

export interface ITestBearing extends IBodyBearing {
  test: Node
}

export interface IWhile extends ITestBearing {
  type: 'while' | 'while_nosave'
}

export function isWhile (ast: Node): ast is IWhile {
  return ast.type === 'while' || ast.type === 'while_nosave'
}

export interface IDoWhile extends ITestBearing {
  type: 'dowhile' | 'dowhile_nosave'
}

export function isDoWhile (ast: Node): ast is IDoWhile {
  return ast.type === 'dowhile' || ast.type === 'dowhile_nosave'
}

export interface ITry extends IBodyBearing {
  type: 'try'
  handler: Node
}

export function isTry (ast: Node): ast is ITry {
  return ast.type === 'try'
}

export interface IAction extends Node {
  type: 'action'
  name: string
  displayLabel?: string
}

export function isAction (ast: Node): ast is IAction {
  return ast.type === 'action'
}

export interface IFunction extends Node {
  function: {
    exec: {
      code: string
      prettyCode?: string
    }
  }
}

export function isFunction (ast: Node): ast is IFunction {
  return ast.type === 'function'
}

export interface IFinally extends IBodyBearing {
  type: 'finally'
  finalizer: Node
}

export function isFinally (ast: Node): ast is IFinally {
  return ast.type === 'finally'
}

export interface IOn extends IComponentBearing {
  type: 'on'
  trigger: string
}

export function isOn (ast: Node): ast is IOn {
  return ast.type === 'on'
}

export interface IRetryOrRepeat extends IComponentBearing {
  type: 'retry' | 'repeat'
  count: string
}

export function isRetryOrRepeat (ast: Node): ast is IRetryOrRepeat {
  return ast.type === 'retry' || ast.type === 'repeat'
}

export interface ILet extends IComponentBearing {
  type: 'let'
  declarations: string
}

export function isLet (ast: Node): ast is ILet {
  return ast.type === 'let'
}

export function isSequence (ast: Node): ast is IComponentBearing {
  return ast.type === 'sequence' || ast.type === 'seq'
}

export function isRetain (ast: Node): ast is IComponentBearing {
  return ast.type === 'retain'
}

export function isComponentBearing (ast: Node): ast is IComponentBearing {
  const cb = ast as IComponentBearing
  return typeof cb.components === 'object'
}

export interface IComponentArrayBearing extends Node {
  components: Node[]
}

export interface IParallelLike extends IComponentArrayBearing {
  type: 'parallel' | 'par' | 'map' | 'forall'
  set?: Node
}

export function isParallelLike (ast: Node): ast is IParallelLike {
  return ast.type === 'parallel' || ast.type === 'par' || ast.type === 'map' || ast.type === 'forall'
}

export interface IMapLike extends Node {
  type: 'map' | 'forall'
  components?: Node
  body?: Node
}

export function isMapLike (ast: Node): ast is IMapLike {
  return ast.type === 'map' || ast.type === 'forall'
}
