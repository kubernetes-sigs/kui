/*
 * Copyright 2020 IBM Corporation
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

import React from 'react'
import '../../src/web/scss/static/metrics.scss'

type ErrorDisplayProps = {
  errorString: string
}

export class ErrorDisplay extends React.Component<ErrorDisplayProps, any> {
  public render() {
    const { errorString } = this.props

    return (
      <div className="infotext">
        <p>Error Message:</p>
        <div className="box">
          <kbd>
            <pre>{JSON.stringify(errorString, null, 2)}</pre>
          </kbd>
        </div>
      </div>
    )
  }
}
