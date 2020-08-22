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

/*
 * Data models for the state object in React Components
 */
import { experimentTypes } from '../utility/variables'

interface CriterionState {
  name: string
  type: string
  reward: boolean
  limitType: string
  limitValue: number
}
interface HostGateway {
  name: string
  gateway: string
}
interface Formstate {
  showCriteria: boolean
  invalidCandidate: boolean
  name: string
  type: experimentTypes
  namespace: string
  service: string
  baseline: string
  candidates: Array<string>
  edgeService: boolean
  hostGateways: Array<HostGateway>
  invalidHostGateways: boolean
  criteria: Array<CriterionState>
  disableReward: boolean
  nsList: Array<{ id: string; text: string }>
  svcList: Array<{ id: string; text: string }>
  deployList: Array<{ id: string; text: string }>
  countMetricsList: Array<any>
  ratioMetricsList: Array<any>
  totalMetricsList: Array<any>
}
// Model for decisionForm.tsx
interface DecisionState {
  notifyTime: string
  selectedAlgo: string
  trafficSplit: Array<any>
  currentSplit: Array<any>
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
  endExperimentWinner: string
  edgeService: boolean
  hostGateways: Array<HostGateway>
}

export { CriterionState, Formstate, DecisionState }
