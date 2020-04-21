import * as React from 'react'
import { Form, InlineLoading, Button } from 'carbon-components-react'
import { Renew32 } from '@carbon/icons-react'
// import Chart from 'react-apexcharts'
import 'carbon-components/scss/components/loading/_loading.scss'
import 'carbon-components/scss/components/form/_form.scss'
import 'carbon-components/scss/components/button/_button.scss'
import '../../src/web/scss/static/decisionForm.scss'

// const options = {
// 	labels:['reviews-v1', 'reviews-v2', 'reviews-v3']
// };
// const series = [20, 55, 25];	//add to 100?
// <Chart
// 	type="pie"
// 	options={options}
// 	series={series}
// 	width="500"
// />
export class DecisionBase extends React.Component<any, any> {
  public constructor(props) {
    super(props)
    this.state = {
      exprCreated: false // User has finished expr setup
    }
  }

  public render() {
    return (
      <Form display={'block'}>
        <InlineLoading
          description={
            !this.state.exprCreated ? 'Waiting for Experiment Creation Completion...' : 'Experiment Created.'
          }
          iconDescription="Active loading indicator"
          status="active"
          style={{ width: 350 }}
        />
        <Button size="default" kind="primary" renderIcon={Renew32}>
          {' '}
          Refresh{' '}
        </Button>
      </Form>
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
