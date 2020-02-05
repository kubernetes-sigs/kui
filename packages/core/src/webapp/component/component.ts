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

type KuiComponentContent = DocumentFragment

interface SingletonTrait {
  singleton: true
  viewId: string
}

export interface KuiComponent<Singleton extends Partial<SingletonTrait> = Partial<SingletonTrait>> {
  apiVersion: 'kui-shell/component/v1'
  kind: string
  metadata: {
    namespace: string
  }
  spec: {
    content: KuiComponentContent
    position: 'TabColumn' | 'TabRow'
  } & Singleton
}

export default KuiComponent

export function isSingleton(component: KuiComponent): component is KuiComponent<Required<SingletonTrait>> {
  return component.spec.singleton === true && typeof component.spec.viewId === 'string'
}
