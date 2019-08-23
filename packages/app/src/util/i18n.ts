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

const defaultLocale = 'en_US'

function getLocale() {
  return process.env.LOCALE || (typeof navigator !== 'undefined' && navigator.language)
}

function getLocale2() {
  // protect against navigator.language being undefined
  // https://github.com/IBM/kui/issues/2513
  const locale = getLocale()
  return locale && locale.replace(/-/, '_')
}

export function fromMap(map: Record<string, string>) {
  return map[getLocale()] || map[getLocale2()] || map[defaultLocale]
}

export default (plugin: string, namespace = 'resources'): ((key: string) => string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const defaultStrings: Record<string, string> = require(`@kui-shell/${plugin}/i18n/${namespace}_en_US.json`)

  const locale = getLocale()

  const i18n = (locale: string): Record<string, string> => {
    try {
      return locale && require(`@kui-shell/${plugin}/i18n/${namespace}_${locale.replace(/-/, '_')}.json`)
    } catch (err) {
      try {
        return (
          (locale && require(`@kui-shell/${plugin}/i18n/${namespace}_${locale.replace(/-.*$/, '')}.json`)) ||
          defaultStrings
        )
      } catch (err) {
        console.error('Could not find translation for given locale', plugin, locale)
        return defaultStrings
      }
    }
  }

  const _strings = i18n(locale)

  return function(key: string): string {
    return _strings[key] || defaultStrings[key] || key
  }
}
