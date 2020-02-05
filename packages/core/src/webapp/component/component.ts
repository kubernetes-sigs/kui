/*
 * Copyright 2020 IBM Corporation
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

import Presentation from '../views/presentation'

type KuiComponentContent = DocumentFragment

interface SingletonTrait {
  singleton: true
  viewId: string
}

interface NamespaceOnclick {
  onclick: {
    namespace: string
  }
}

interface FrameTrait {
  frame: {
    presentation: Presentation
  }
}

export type KuiComponent<
  Singleton extends Partial<SingletonTrait> = Partial<SingletonTrait>,
  Frame extends Partial<FrameTrait> = Partial<FrameTrait>
> = {
  apiVersion: 'kui-shell/component/v1'
  kind: string
  metadata: {
    namespace: string
  }
  spec: {
    content: KuiComponentContent
    position: 'TabColumn' | 'TabRow'
  } & Singleton &
    Partial<NamespaceOnclick>
} & Frame

export default KuiComponent

export function isSingleton(component: KuiComponent): component is KuiComponent<Required<SingletonTrait>> {
  return component.spec.singleton === true && typeof component.spec.viewId === 'string'
}

export type KuiFramedComponent = KuiComponent<Partial<SingletonTrait>, Required<FrameTrait>>

export function isKuiFramedComponent(component: KuiComponent): component is KuiFramedComponent {
  return component.frame !== undefined
}
