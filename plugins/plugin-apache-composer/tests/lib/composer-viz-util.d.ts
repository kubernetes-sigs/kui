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

import { Application } from 'spectron'

interface IInput {
  file: string
  path: string
}

interface AppAndCount {
  app: Application
  count: number
}

type AppVerifier = (app: Application) => Promise<Application>

type AppAndCountVerifier = (res: AppAndCount) => Promise<Application>

declare function input (file: string, subdir?: string): IInput
declare function composerInput (file: string): IInput
declare function composerErrorInput (file: string): IInput

declare function expectRule ({ triggerName, actionName }: { triggerName: string, actionName: string }): (app: Application) => Promise<void>

declare function verifyTheBasicStuff (file: string): AppAndCountVerifier
declare function verifyNodeLabelsAreSane (app: Application): Promise<Application> // this is an AppVerifier
declare function verifyNodeExists (name: string, isDeployed?: boolean): AppVerifier
declare function verifyNodeAbsence (name: string, isDeployed?: boolean, timeout?: number): AppVerifier
declare function verifyNodeStatusExists (name: string, status: string): AppVerifier
declare function verifyNodeExistsById (id: string): AppVerifier
declare function verifyEdgeExists (from: string, to: string): AppVerifier
declare function verifyOutgoingEdgeExists (from: string): AppVerifier
