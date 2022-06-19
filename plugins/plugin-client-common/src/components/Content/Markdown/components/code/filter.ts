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

function project(json: Record<string, any>, path: string[], idx = 0) {
  const field = json[path[idx]]
  if (idx === path.length - 1) {
    return field
  } else {
    return project(field, path, idx + 1)
  }
}

function asFilter(filter: string | string[]): string[][] {
  return (typeof filter === 'string' ? [filter] : filter).map(filt => filt.split(/\./).slice(1))
}

function filterIn(json: Record<string, any>, include: string[]) {
  return project(json, asFilter(include)[0])
}

function remove(json: Record<string, any>, path: string[], idx = 0) {
  if (idx === path.length - 1) {
    delete json[path[idx]]
  } else {
    return remove(json[path[idx]], path, idx + 1)
  }
}

function filterOut(json: Record<string, any>, exclude: string[][]) {
  exclude.forEach(path => remove(json, path))
  return json
}

export default function bodyAndLanguage(body: string, language: string, attributes: Record<string, any>) {
  if (language === 'json' && (attributes.include || attributes.exclude || attributes.language)) {
    try {
      const json = JSON.parse(body)

      const languageForView =
        attributes.language ||
        (attributes.languageFrom && project(json, asFilter(attributes.languageFrom)[0])) ||
        language

      const json2 = attributes.include ? filterIn(json, attributes.include) : json
      const json3 = attributes.exclude ? filterOut(json2, asFilter(attributes.exclude)) : json2

      const bodyForView = dump(json3, languageForView)

      return { bodyForView, languageForView }
    } catch (err) {
      console.error('Error parsing json', body, err)
    }
  }

  return { bodyForView: body, languageForView: language }
}
