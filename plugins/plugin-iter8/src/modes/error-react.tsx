import * as React from 'react'
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