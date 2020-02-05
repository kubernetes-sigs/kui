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

/** the ultimate content of a view */
type KuiComponentContent = DocumentFragment

interface NamespaceOnclick {
  onclick: {
    namespace: string
  }
}

interface TitleTraits {
  kind: string
  metadata: {
    namespace: string
  }
}

interface PresentationTraits {
  presentation: Presentation
  position: 'TabColumn' | 'TabRow'
}

/**
 * For view providers that desire to have only a single instance in
 * existence in a specified position.
 *
 */
interface SingletonTraits {
  singleton: true
  viewId: string
}

/**
 * Some views might need a frame. Some of those might want to be
 * singletons, i.e. so that only one instance of that type of view
 * exists in the specified position.
 *
 */
interface FrameTrait<Singleton extends Partial<SingletonTraits> = Partial<SingletonTraits>> {
  frame: PresentationTraits & TitleTraits & Singleton
}

type SingletonFrameTrait = FrameTrait<Required<SingletonTraits>>

function isSingletonFrameTrait(trait: FrameTrait): trait is SingletonFrameTrait {
  const traits = trait.frame as SingletonTraits
  return typeof traits.singleton === 'boolean' && typeof traits.viewId === 'string'
}

/**
 * Instances of Kui view components can be framed or unframed; framed
 * components can be singleton views or not.
 *
 */
export type KuiComponent<Frame extends Partial<FrameTrait> = Partial<FrameTrait>> = {
  apiVersion: 'kui-shell/component/v1'
  spec: {
    content: KuiComponentContent
  } & Partial<NamespaceOnclick>
} & Frame

/**
 * Subset of KuiComponents that need a frame to be provided by Kui
 *
 */
export type KuiFramedComponent<Frame extends FrameTrait = FrameTrait> = KuiComponent<Required<Frame>>

/**
 * Is this a component that needs a frame to be provided by Kui?
 *
 */
export function isKuiFramedComponent<Frame extends FrameTrait>(
  component: KuiComponent<Partial<FrameTrait>>
): component is KuiFramedComponent<Frame> {
  return component.frame !== undefined
}

/**
 * Is this a framed component that should only exist once in the given position?
 *
 */
export function isSingleton(component: KuiComponent): component is KuiFramedComponent<Required<SingletonFrameTrait>> {
  return isKuiFramedComponent(component) && isSingletonFrameTrait(component)
}

export default KuiComponent
