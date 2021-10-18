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

enum Group {
  Storage,
  Compute,
  Authorization,
  CLI,
  CLIPlugin,
  Operator
}

export const GroupPriority = {
  CLI: 0,
  CLIPlugin: 1,
  Authorization: 2,
  Operator: 3,
  Compute: 4,
  Storage: 4
}

export default Group
