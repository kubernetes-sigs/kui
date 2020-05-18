/*
 * Data models for the state object in React Components
 */

// Model for exprForm.tsx state
interface Metricstate {
  name: string
  type: string
  reward: boolean
  limitType: string
  limitValue: number
}
interface Formstate {
  disableresubmit: boolean
  showMetrics: boolean
  invalidCand: boolean
  name: string
  type: string
  ns: string
  svc: string
  base: string
  cand: Array<string>
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
  exprCreated: boolean
  haveResults: boolean
  exprReq?: any
  exprResult?: any
}

export { Metricstate, Formstate, DecisionState }
