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

// note: this comes preinstalled in OpenWhisk nodejs containers
const { parseString } = require('xml2js')

/**
 * Turn a given XML string (body) into a JSON structure
 *
 */
const main = ({ body }) => new Promise((resolve, reject) => { // eslint-disable-line
  /** something went wrong */
  const oops = err => {
    console.error(err)
    reject(err.toString())
  }

  try {
    console.log('attempting to convert this xml', body.substring(0, 100))

    // here, we use the xml2js npm to do the heavy lifting
    parseString(body, { explicitArray: false }, (err, result) => {
      if (err) {
        oops(err)
      } else {
        resolve(result)
      }
    })
  } catch (err) {
    oops(err)
  }
})
