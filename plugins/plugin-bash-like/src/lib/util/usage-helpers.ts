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

import { i18n } from '@kui-shell/core'
const strings = i18n('plugin-bash-like')

/**
 * A parameter that is a local file
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const localFilepath: any[] = [{ name: 'path', docs: strings('localFilePath'), file: true, positional: true }]
