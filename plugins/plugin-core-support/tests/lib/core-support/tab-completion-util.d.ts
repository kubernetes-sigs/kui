/*
 * Copyright 2019 The Kubernetes Authors
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

import { Common } from '@kui-shell/test'

/** touch the given filepath */
export declare const touch: (filepath: string) => void;
/** execute the given async task n times */
export declare const doTimes: (n: any, task: any) => any;
export declare const tabby: (ctx: Common.ISuite, partial: any, full: any, expectOK?: boolean) => any;
export declare const tabbyWithOptions: (ctx: Common.ISuite, partial: any, expected?: any, full?: any, { click, nTabs, expectOK, expectedPromptAfterTab }?: {
    click?: any;
    nTabs?: any;
    expectOK?: boolean;
    expectedPromptAfterTab?: any;
}) => any;
export declare const tabbyWithOptionsThenCancel: (ctx: Common.ISuite, partial: any, expected: any) => any;
