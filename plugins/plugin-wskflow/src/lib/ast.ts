/*
 * Copyright 2019 The Kubernetes Authors
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

export interface ASTNode {
  type: NodeType
}

export interface ValueBearing extends ASTNode {
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Literal extends ValueBearing {
  type: 'literal' | 'value'
}

export function isLiteral(ast: ASTNode): ast is Literal {
  return ast.type === 'literal' || ast.type === 'value'
}

export interface ComponentBearing<ComponentType = ASTNode> extends ASTNode {
  components: ComponentType
}

export interface Conditional extends ASTNode {
  test: ASTNode
  consequent: ASTNode
  alternate: ASTNode
}

export function isConditional(ast: ASTNode): ast is Conditional {
  return ast.type === 'if'
}

export interface BodyBearing extends ASTNode {
  body: ASTNode
}

export interface TestBearing extends BodyBearing {
  test: ASTNode
}

export interface While extends TestBearing {
  type: 'while' | 'while_nosave'
}

export function isWhile(ast: ASTNode): ast is While {
  return ast.type === 'while' || ast.type === 'while_nosave'
}

export interface DoWhile extends TestBearing {
  type: 'dowhile' | 'dowhile_nosave'
}

export function isDoWhile(ast: ASTNode): ast is DoWhile {
  return ast.type === 'dowhile' || ast.type === 'dowhile_nosave'
}

export interface Try extends BodyBearing {
  type: 'try'
  handler: ASTNode
}

export function isTry(ast: ASTNode): ast is Try {
  return ast.type === 'try'
}

export interface Action extends ASTNode {
  type: 'action'
  name: string
  displayLabel?: string
}

export function isAction(ast: ASTNode): ast is Action {
  return ast.type === 'action'
}

export interface Function extends ASTNode {
  function: {
    exec: {
      code: string
      prettyCode?: string
    }
  }
}

export function isFunction(ast: ASTNode): ast is Function {
  return ast.type === 'function'
}

export interface Finally extends BodyBearing {
  type: 'finally'
  finalizer: ASTNode
}

export function isFinally(ast: ASTNode): ast is Finally {
  return ast.type === 'finally'
}

export interface On extends ComponentBearing {
  type: 'on'
  trigger: string
}

export function isOn(ast: ASTNode): ast is On {
  return ast.type === 'on'
}

export interface RetryOrRepeat extends ComponentBearing {
  type: 'retry' | 'repeat'
  count: string
}

export function isRetryOrRepeat(ast: ASTNode): ast is RetryOrRepeat {
  return ast.type === 'retry' || ast.type === 'repeat'
}

export interface Let extends ComponentBearing {
  type: 'let'
  declarations: string
}

export function isLet(ast: ASTNode): ast is Let {
  return ast.type === 'let'
}

export function isSequence(ast: ASTNode): ast is ComponentBearing {
  return ast.type === 'sequence' || ast.type === 'seq'
}

export function isRetain(ast: ASTNode): ast is ComponentBearing {
  return ast.type === 'retain'
}

export function isComponentBearing(ast: ASTNode): ast is ComponentBearing {
  const cb = ast as ComponentBearing
  return typeof cb.components === 'object'
}

export interface ComponentArrayBearing<ComponentType = ASTNode> extends ASTNode {
  components: ComponentType[]
}

export function isComponentArrayBearing(ast: ASTNode): ast is ComponentArrayBearing {
  const cb = ast as ComponentArrayBearing
  return Array.isArray(cb.components) && cb.components.length > 0
}

export interface ParallelLike extends ComponentArrayBearing {
  type: 'parallel' | 'par' | 'map' | 'forall'
  set?: ASTNode
}

export function isParallelLike(ast: ASTNode): ast is ParallelLike {
  return ast.type === 'parallel' || ast.type === 'par' || ast.type === 'map' || ast.type === 'forall'
}

export interface MapLike extends ASTNode {
  type: 'map' | 'forall'
  components?: ASTNode
  body?: ASTNode
}

export function isMapLike(ast: ASTNode): ast is MapLike {
  return ast.type === 'map' || ast.type === 'forall'
}
