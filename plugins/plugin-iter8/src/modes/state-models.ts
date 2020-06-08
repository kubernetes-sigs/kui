/*
 * Data models for the state object in React Components
 */

// Model for exprForm.tsx state
enum experimentTypes {
  HIL = 'Human In the Loop',
  automated = 'Automated'
}

interface CriterionState {
  name: string
  type: string
  reward: boolean
  limitType: string
  limitValue: number
}
interface Formstate {
  disableResubmit: boolean
  showCriteria: boolean
  invalidCandidate: boolean
  name: string
  type: experimentTypes
  namespace: string
  service: string
  baseline: string
  candidates: Array<string>
  criteria: Array<CriterionState>
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
  haveAdvancedStatistics: boolean
  haveCriteriaComparison: boolean
  showAdvancedStatistics: boolean
  selectedAdvancedStatistic: string
  advancedStatisticsRows: Array<any>
  hasExperimentEnded: boolean
  experimentDecision: string
  chartData: Array<any>
  chartOptions: any
}

export { CriterionState, Formstate, DecisionState, experimentTypes }
