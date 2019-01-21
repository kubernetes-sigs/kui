/*
 * Copyright 2018 IBM Corporation
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

export const title = 'Local activations and debugging'

export const overall = 'Run actions in a local Docker container for testing and debugging purposes.'

export const invoke = 'Run an action or activation locally'

export const invoke2 = 'When replaying an activation, the plugin will fetch its previous activation (if available) to get the input data. You can also provide the input data with -p.'

export const debug = 'Run an action or activation locally, and open a debugger in the sidecar (NodeJS only)'

export const init = 'Start a Docker container with the runtime image of an action'

export const kill = `Kill and remove the Docker container this plugin uses`

export const clean = `Remove the local copy of the docker images`

export const stopDebugger = 'Done Debugging'
