/*
 * Copyright 2018-19 IBM Corporation
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

import Debug from 'debug'
const debug = Debug('plugins/editor/file-types')

/**
 * What is the monaco "language" for the given kind?
 *    only nodejs and compositions diverge from monaco's notation
 */
export const language = kind => {
  const base = kind.substring(0, kind.indexOf(':')) || kind
  debug('language', kind, base)

  if (base === 'nodejs' || base === 'app' || base === 'composition' || base === 'sequence') {
    return 'javascript'
  } else if (base === 'ts') {
    return 'typescript'
  } else if (base === 'md') {
    return 'markdown'
  } else if (base === 'sh') {
    return 'shell'
  } else if (base === 'yml') {
    return 'yaml'
  } else {
    return base
  }
}

/**
 * What is the filename extension for the given kind?
 *
 */
export const extension = kind => {
  const lang = language(kind)
  debug('extension', kind, lang)

  switch (lang) {
    case 'javascript':
      return '.js'
    case 'typescript':
      return '.js'
    case 'python':
      return '.py'
    default:
      return `.${lang}` // e.g. .php, .go
  }
}
