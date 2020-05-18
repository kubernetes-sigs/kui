/*
 * Data models for the state object in React Components
 */

// Model for exprForm.tsx state
enum experimentTypes {
  HIL = 'Human In the Loop',
  automated = 'Automated'
}

interface Metricstate {
  name: string
  type: string
  reward: boolean
  limitType: string
  limitValue: number
}
interface Formstate {
  disableResubmit: boolean
  showMetrics: boolean
  invalidCandidate: boolean
  name: string
  type: experimentTypes
  namespace: string
  service: string
  baseline: string
  candidates: Array<string>
  metric: Array<Metricstate>
  disableReward: boolean
}
// Model for decisionForm.tsx
interface DecisionState {
  notifyTime: string
  selectedAlgo: string
  trafficSplit: Array<any>
  trafficErr: boolean
  notifyUser: boolean
  experimentCreated: boolean
  haveResults: boolean
  experimentRequest?: any
  experimentResult?: any
}

export { Metricstate, Formstate, DecisionState, experimentTypes }
