/*
 * Copyright 2022 The Kubernetes Authors
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

import { dump as dumpToYaml } from 'js-yaml'

function dump(field: any, language: string): string {
  if (/ya?ml/.test(language)) {
    return dumpToYaml(field)
  } else if (typeof field === 'string') {
    return field
  } else if (field === undefined || field === null) {
    return 'null'
  } else {
    return JSON.stringify(field, undefined, 2)
  }
}

function filterIn(json: Record<string, any>, include: string, language: string) {
  return dump(json[include], language)
}

function filterOut(json: Record<string, any>, exclude: string[], language: string) {
  exclude.forEach(key => {
    delete json[key]
  })
  return dump(json, language)
}

function asFilter(filter: string | string[]): string[] {
  if (typeof filter === 'string') {
    return [filter]
  } else {
    return filter
  }
}

export default function bodyAndLanguage(body: string, language: string, attributes: Record<string, any>) {
  if (language === 'json' && (attributes.include || attributes.exclude || attributes.language)) {
    try {
      const json = JSON.parse(body)

      const languageForView =
        attributes.language || (attributes.languageFrom && json[attributes.languageFrom]) || language

      const bodyForView =
        (attributes.include
          ? filterIn(json, attributes.include, languageForView)
          : attributes.exclude
          ? filterOut(json, asFilter(attributes.exclude), languageForView)
          : body) || ''

      return { bodyForView, languageForView }
    } catch (err) {
      console.error('Error parsing json', body, err)
    }
  }

  return { bodyForView: body, languageForView: language }
}
