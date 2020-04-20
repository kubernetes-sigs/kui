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

interface IResponse {
  code: number
  output: string
  stderr?: string
}

interface IOutput {
  code: number
  output: string
}

export declare class CLI {
  constructor(exec: string, pathEnv: string, teeToFile?: boolean);
  command: (cmd: string, env?: object, options?: object) => Promise<IResponse>;
  exitCode: (statusCode: number) =>  number;
  expectJustOK: () => any;
  expectOK: (expectedOutput?: string | object, options?) => (actual: IOutput) => string;
  expectError: (expectedCode: number, expectedOutput?: string | object) => (actual: IOutput) => string;
}

export var cli: CLI
export var ibmcloudKui: CLI

/**
 * @return a CLI impl for the given executable `exe`, located in the given `bindir`.
 *
 */
export function makeCLI(exe: string, bindir: string): CLI
