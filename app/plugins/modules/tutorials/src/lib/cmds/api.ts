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

/**
 * Turn a JSONSchema API into OpenWhisk command line parameter
 * string. An example output might be "-p payload bonjour" if there is
 * a required string parameter "payload" with a default value of
 * "bonjour".
 *
 * @param api a JSONSchema instance
 * @return an OpenWhisk command line parameter string
 */
export const apiToDefaultParams = (api): string => {
  return (api.required || []).reduce((res, param) => {
    const spec = api.properties[param]

    if (spec && spec.default) {
      return res + `-p ${param} ${spec.default}`
    } else {
      return res
    }

  }, '')
}
