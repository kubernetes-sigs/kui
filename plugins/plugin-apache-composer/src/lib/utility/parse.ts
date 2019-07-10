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

/* use wsk utility to parse parameters from a command */
export const parseParams = (argv, wsk) => {
  const { kvOptions: { action: { parameters = [] } = {} } = {} } = wsk.parseOptions(argv, 'action') // eslint-disable-line
  return parameters.reduce(function(params, ele) {
    params[ele.key] = ele.value
    return params
  }, {})
}

/* parse the composition name from a command */
export const parseName = (args, cmd) => args[args.indexOf(cmd) + 1]
