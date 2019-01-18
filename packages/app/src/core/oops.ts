/*
 * Copyright 2017-18 IBM Corporation
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
 * Try to pull out some meaningful message from the given error
 *
 */
export const oopsMessage = err => {
  try {
    return (err.error && err.error.response && err.error.response.result && err.error.response.result.error && err.error.response.result.error.error) || // feed creation error. nice
                (err.error && err.error.response && err.error.response.result && err.error.response.result.error) ||
                (err.error && err.error.error) ||
                err.message ||
                err.error ||
                err ||
                'Internal Error'
  } catch (err) {
    console.error(err)
    return 'Internal Error'
  }
}
