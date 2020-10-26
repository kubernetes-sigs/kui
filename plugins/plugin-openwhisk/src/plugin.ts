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

import { Registrar } from '@kui-shell/core'

// namespaces
import namespaceGet from './controller/namespace/get'
import namespaceList from './controller/namespace/list'
import {
  namespaceListActions,
  namespaceListPackages,
  namespaceListRules,
  namespaceListTriggers
} from './controller/namespace/list-innards'

// actions
import actionGet from './controller/action/get'
import actionList from './controller/action/list'
import actionAsync from './controller/action/async'
import actionCreate from './controller/action/create'
import actionDelete from './controller/action/delete'
import actionInvoke from './controller/action/invoke'

// triggers
import triggerGet from './controller/trigger/get'
import triggerFire from './controller/trigger/fire'
import triggerList from './controller/trigger/list'
import triggerCreate from './controller/trigger/create'
import triggerDelete from './controller/trigger/delete'

// packages
import packageGet from './controller/package/get'
import packageBind from './controller/package/bind'
import packageList from './controller/package/list'
import packageCreate from './controller/package/create'
import packageDelete from './controller/package/delete'
import { packageListActions, packageListFeeds } from './controller/package/list-innards'

// activations
import activationGet from './controller/activation/get'
import activationGrid from './controller/activation/grid'
import activationList from './controller/activation/list'
import activationLogs from './controller/activation/logs'
import activationAwait from './controller/activation/await'
import activationTrace from './controller/activation/trace'
import activationResult from './controller/activation/result'

// rules
import ruleGet from './controller/rule/get'
import ruleList from './controller/rule/list'
import ruleCreate from './controller/rule/create'
import ruleDelete from './controller/rule/delete'
import ruleStatus from './controller/rule/status'

// oui value-add commands
import listAll from './controller/generic/list-all'
import wipeAll from './controller/generic/wipe'
import cp from './controller/generic/cp'
import mv from './controller/generic/mv'
import rm from './controller/generic/rm'
import loadTest from './controller/generic/load-test'
import auth from './controller/generic/auth'
import actionLet from './controller/action/let/let'
import actionWebbify from './controller/action/webbify'
import ruleOn from './controller/rule/on'
import ruleEvery from './controller/rule/every'
import activationLast from './controller/activation/last'
import namespaceCurrent from './controller/namespace/current'

export default async (registrar: Registrar) => {
  // oui value-add commands, on top of the basic openwhisk commands
  listAll(registrar)
  wipeAll(registrar)
  cp(registrar)
  mv(registrar)
  rm(registrar)
  loadTest(registrar)
  auth(registrar)
  actionLet(registrar)
  actionWebbify(registrar)
  ruleOn(registrar)
  ruleEvery(registrar)
  activationLast(registrar)
  namespaceCurrent(registrar)

  // basic openwhisk namespace commands
  namespaceGet(registrar)
  namespaceList(registrar)
  namespaceListActions(registrar)
  namespaceListPackages(registrar)
  namespaceListRules(registrar)
  namespaceListTriggers(registrar)

  // basic openwhisk action commands
  actionGet(registrar)
  actionList(registrar)
  actionAsync(registrar)
  actionCreate(registrar)
  actionDelete(registrar)
  actionInvoke(registrar)

  // basic openwhisk trigger commands
  triggerGet(registrar)
  triggerFire(registrar)
  triggerList(registrar)
  triggerCreate(registrar)
  triggerDelete(registrar)

  // basic openwhisk package commands
  packageGet(registrar)
  packageBind(registrar)
  packageList(registrar)
  packageCreate(registrar)
  packageDelete(registrar)
  packageListActions(registrar)
  packageListFeeds(registrar)

  // basic openwhisk activation commands
  activationGet(registrar)
  activationGrid(registrar)
  activationList(registrar)
  activationLogs(registrar)
  activationAwait(registrar)
  activationTrace(registrar)
  activationResult(registrar)

  // basic openwhisk rule commands
  ruleGet(registrar)
  ruleList(registrar)
  ruleCreate(registrar)
  ruleDelete(registrar)
  ruleStatus(registrar)
}
