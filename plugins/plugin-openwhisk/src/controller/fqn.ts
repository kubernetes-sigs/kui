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

import { Desc, PathName } from 'openwhisk'

/**
 * Extract package name from namespace; intentionally returns
 * undefined if the resource is in the default package.
 *
 */
export function packageName({ namespace }: Desc): string {
  return namespace.match(/[^/]+(\/(.+))?/)[2]
}

/**
 * Turn a `resource` into a fully-qualified name
 *
 */
export function fqn(resource: { metadata: { name: string; namespace?: string } }, currentNamespace?: string): string {
  const ns =
    resource.metadata.namespace && (!currentNamespace || resource.metadata.namespace !== currentNamespace)
      ? `/${resource.metadata.namespace}/`
      : ''
  return `${ns}${resource.metadata.name}`
}

/**
 * Turn a `PathName` into a fully-qualified name
 *
 */
export function fqnOfPath({ path, name }: PathName): string {
  return `/${path}/${name}`
}

/**
 * Turn a `Desc` into a fully-qualified name
 *
 */
export function fqnOfDesc({ namespace, name }: Desc): string {
  return `/${namespace}/${name}`
}

/**
 * Format ns/package
 *
 */
function inPackage(ns: string, pack?: string): string {
  if (pack) {
    return `${ns}/${pack}`
  } else {
    return ns
  }
}

/**
 * Turn a potentially qualified name `fqn` into a metadata pair
 *
 */
export function asMetadata(fqn: string, defaultNS: string, pack?: string): { name: string; namespace: string } {
  const A = fqn.split('/')
  if (A.length === 1) {
    // length === 1: name => [name]
    return { name: A[0], namespace: inPackage(defaultNS, pack) }
  } else if (A.length === 2) {
    // length === 2: package/action => [ns, name]
    return { name: A[1], namespace: `${inPackage(defaultNS, pack)}/${A[0]}` }
  } else {
    // length === 3: /ns/name => ['', ns, name]
    return { name: A[2], namespace: A[1] }
  }
}

/**
 * @return the fully qualified form of the given entity `name`
 *
 */
export function qualify(name: string): string {
  const A = name.split('/')
  if (A.length < 3) {
    // just the action name (length === 1) or just the package/action (length === 2)
    return `/_/${name}`
  } else {
    return name
  }
}

export default qualify
