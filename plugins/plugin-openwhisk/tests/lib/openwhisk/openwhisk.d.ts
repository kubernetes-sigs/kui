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

import { HookFunction, Suite } from 'mocha'
import { Application } from 'spectron'

import { Common } from '@kui-shell/test'

interface OpenWhiskBeforeOptions extends Common.BeforeOptions {
  fuzz?: Record<string, any>
}

declare function before (ctx: Suite, opts?: OpenWhiskBeforeOptions): HookFunction
declare function after (ctx: Suite, f?: () => void): HookFunction

declare var entities: string[]

declare var apihost: string
declare var apihostIsLocal: boolean

declare function cleanAll (noDefault?: boolean | string, api_key?: string): Promise<void>

declare var aliases: Record<string, string[]>

declare const expectValidActivationId: () => (activationId: string) => RegExpMatchArray;

export declare const waitForActivation: (app: Application, activationId: string, { name }?: {
    name?: string;
}) => any;
export declare const waitForSession: (app: Application, activationId: string, { name }?: {
    name?: string;
}) => any;

/**
 * @return the expected namespace string for this test
 *
 */
export declare const expectedNamespace: (space?: string, org?: string) => string;

/**
 * Normalize data for conformance testing of an HTML file
 *
 */
declare function normalizeHTML (str: string | Buffer): string

declare function validateNamespace (observedNamespace: string): void

declare function rp (opts: Object): any
