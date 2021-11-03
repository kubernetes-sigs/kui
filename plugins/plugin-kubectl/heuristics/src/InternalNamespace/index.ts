/*
 * Copyright 2021 The Kubernetes Authors
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
 * This heuristic exports a map from Namespace-as-string to `true`
 * that indicates whether the given-named namespace is a
 * system/internal namespace.
 *
 * To extend, either add a new namespace name to one of the existing
 * files, or create a new file and add it to the `isInternal` array below
 *
 */

import ibm from './ibm'
import kube from './kube'
import istio from './istio'
import calico from './calico'
import knative from './knative'
import rancher from './rancher'
import openshift from './openshift'
import operators from './operators'

/** Make sure to add any new files to this array */
const isInternal: string[] = [...ibm, ...kube, ...istio, ...calico, ...knative, ...rancher, ...openshift, ...operators]

/** Format a regex string from the internal namespaces list e.g. /(kube-node-lease|kube-public)/ */

const internalRegex = new RegExp(
  isInternal.reduce((regex, str, idx, array) => {
    if (idx === 0) {
      regex = `(${str}`
    } else {
      regex = `${regex}|${str}`
    }

    if (idx === array.length - 1) {
      regex += ')'
    }
    return regex
  }, '')
)

export function matchInternalRegex(ns: string) {
  return internalRegex.test(ns)
}

export default matchInternalRegex
