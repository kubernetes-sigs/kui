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

import { inBrowser } from '@kui/core/capabilities'
import { PACKAGE, checkDeploy } from './deploy'

/**
 * Names to use for the deployed action proxy
 *
 */
export const ACTION = 'kubectl'
export const FQN = `${PACKAGE}/${ACTION}`

/** we will need the source code for the action proxy */
const actionProxySource = !inBrowser() ? require('fs-extra').readFile(require('path').join(__dirname, '../../lib/actionProxy/kubectl.sh'))
    : Promise.resolve(require('!!raw-loader!@kui/plugins/k8s/lib/actionProxy/kubectl.sh'))

export const deploy = checkDeploy({ FQN, actionProxySource })
