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

/**
 * Add quotes if the argument needs it; compare to encodeURIComponent
 *
 */
export default (component: string | number | boolean, quote = '"'): string => {
  if (component === undefined) {
    return ''
  } else if (
    typeof component === 'string' &&
    /\s/.test(component) &&
    component.charAt(0) !== quote &&
    component.charAt(component.length - 1) !== quote
  ) {
    return `${quote}${component}${quote}`
  } else {
    return component.toString()
  }
}
