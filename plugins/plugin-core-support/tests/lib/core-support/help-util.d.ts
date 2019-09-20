/*
 * Copyright 2017-19 IBM Corporation
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

/** expect the given folder within the help tree */
// NOTE: Mengting Yan: webdriverio getText in linux chromium seems to return all texts of a heading element in a single line, fix me if it's not true
export declare function header(folder: string): string

/** expect the given sub-folder */
export declare function header2(folder1: string, folder2: string): string

/** helper method, used in the tests below: ask for help */
export declare function doHelp(cmd: string, opts?: { code?: number, expect?: string }): void
