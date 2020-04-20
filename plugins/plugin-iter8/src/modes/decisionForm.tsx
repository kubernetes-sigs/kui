import * as React from 'react'
import { InlineLoading } from 'carbon-components-react'
import 'carbon-components/scss/components/loading/_loading.scss'
import '../../src/web/scss/static/decisionForm.scss'

export class DecisionBase extends React.Component<any, any> {
  public constructor(props) {
    super(props)
    this.state = {
      exprCreated: false // User has finished expr setup
    }
  }

  public render() {
    return (
      <div>
        <InlineLoading
          description={
            !this.state.exprCreated ? 'Waiting for Experiment Creation Completion...' : 'Experiment Created.'
          }
          iconDescription="Active loading indicator"
          status="active"
          onSuccess={this.state.exprCreated}
        />
      </div>
    )
  }
}

export function renderDecisionTab() {
  return {
    react: function renderComponent() {
      return <DecisionBase />
    }
  }
}
