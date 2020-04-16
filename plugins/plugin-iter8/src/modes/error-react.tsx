import * as React from 'react'
import { ToolbarProps } from '@kui-shell/core'
import '../../src/web/scss/static/metrics.scss'

class ReactErrorDisplay extends React.Component<any, any> {
  public error = {}
  public constructor(props) {
    super(props)
    this.error = props['params']['error']
  }

  public render() {
    return (
      <div className="infotext">
        <p>Error Message:</p>
        <div className="box">
          <kbd>
            <pre>{JSON.stringify(this.error, null, 2)}</pre>
          </kbd>
        </div>
      </div>
    )
  }
}

export default function(error) {
  console.log(typeof error)
  return function ReactError(props: ToolbarProps) {
    return <ReactErrorDisplay params={{ ...props, error: error }} />
  }
}
