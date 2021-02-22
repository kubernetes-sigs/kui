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
import { iter8ServiceStatus } from '../utility/iter8-svc-status'

export async function getConfig(args) {
  const [c, a] = await Promise.all([
    iter8ServiceStatus('iter8-controller', args),
    iter8ServiceStatus('iter8-analytics', args)
  ])
  return (c && a).toString()
}
