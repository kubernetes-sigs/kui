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

/* eslint-disable */
import { GetMetricConfig } from '../components/metric-config'
import { CriterionState, Formstate } from '../modes/state-models'
//Convert the list of criteria in API request format
function getCriteriaModel(definedCriteria: Array<CriterionState>): Array<Object> {
  let criteriaArr = []
  for (let i = 0; i < definedCriteria.length; i++) {
    let newMetric = definedCriteria[i]
    if (newMetric.name === '') {
      continue
    } else if (newMetric.limitType === '') {
      criteriaArr.push({
        id: i,
        metric_id: newMetric.name,
        is_reward: newMetric.reward
      })
    } else {
      criteriaArr.push({
        id: i,
        metric_id: newMetric.name,
        is_reward: newMetric.reward,
        threshold: {
          type: newMetric.limitType,
          value: newMetric.limitValue
        }
      })
    }
  }
  return criteriaArr
}
//Convert the list of candidates in API request format
function getCandModel(namespace: string, candList: Array<string>): Array<Object> {
  let candObjs = []
  for (let i = 0; i < candList.length; i++) {
    candObjs.push({
      id: `${candList[i]}`,
      version_labels: {
        destination_workload_namespace: namespace,
        destination_workload: candList[i]
      }
    })
  }
  return candObjs
}
//Converts the current time and form state in API request format
export default function getRequestModel(time: string, formstate: Formstate, args): Object {
  return {
    start_time: time,
    service_name: formstate.service,
    metric_specs: {
      counter_metrics: formstate.countMetricsList,
      ratio_metrics: formstate.ratioMetricsList
    },
    criteria: getCriteriaModel(formstate.criteria),
    baseline: {
      id: `${formstate.baseline}`,
      version_labels: {
        destination_workload_namespace: formstate.namespace,
        destination_workload: formstate.baseline
      }
    },
    candidates: getCandModel(formstate.namespace, formstate.candidates),
    traffic_control: {
      max_increment: 25
    },
    edgeServiceInformation: {
      edgeService: formstate.edgeService,
      hostGateways: formstate.hostGateways
    }
  }
}
