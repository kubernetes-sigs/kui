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

import { Arguments } from '@kui-shell/core'
import { isUsage, KubeOptions } from '@kui-shell/plugin-kubectl'

/** Check both `helm get -h` and `helm get` */
export default function isHelmUsage(args: Arguments<KubeOptions>, cmd: string) {
  return isUsage(args) || new RegExp(`\\s*helm ${cmd}\\s*$`).test(args.command)
}
