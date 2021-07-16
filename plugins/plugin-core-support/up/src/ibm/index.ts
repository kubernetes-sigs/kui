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

import Checker from '../Checker'

// clis
import IBMCloudCLI from './cli/ibmcloud'

// cli plugins
import IBMCloudCOSCLIPlugin from './cli/cos'
import IBMCloudCodeEngineCLIPlugin from './cli/ce'

// cloud config
import IBMCloudLogin from './base/login'
import IBMCloudTarget from './base/target'
import CodeEngineProject from './ce/project'
import CodeEngineCreds from './ce/creds'

// COS config
import S3IBMCOS from './cos/creds'
import S3IBMCOSDefaultMount from './cos/default-mount'

const checkers: Checker[] = [
  IBMCloudCLI,
  IBMCloudLogin,
  IBMCloudCodeEngineCLIPlugin,
  IBMCloudCOSCLIPlugin,
  IBMCloudTarget,
  CodeEngineProject,
  CodeEngineCreds,
  S3IBMCOS,
  S3IBMCOSDefaultMount
]

export default checkers
