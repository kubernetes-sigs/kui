/* eslint-disable */
import GetMetricConfig from '../components/metric-config'
import { Metricstate, Formstate } from '../modes/state-models'
//Convert the list of criteria in API request format
function getCriteriaModel(definedMetrics: Array<Metricstate>): Array<Object> {
  let metricArr = []
  for (let i = 0; i < definedMetrics.length; i++) {
    let newMetric = definedMetrics[i]
    if (newMetric.limitType === '') {
      metricArr.push({
        id: i,
        metric_id: newMetric.name,
        is_reward: newMetric.reward
      })
    } else {
      metricArr.push({
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
  return metricArr
}
//Convert the list of candidates in API request format
function getCandModel(namespace: string, candList: Array<string>): Array<Object> {
  let candObjs = []
  for (let i = 0; i < candList.length; i++) {
    candObjs.push({
      id: `${candList[i]}`,
      version_labels: {
        destination_service_namespace: namespace,
        destination_workload: candList[i]
      }
    })
  }
  return candObjs
}
//Converts the current time and form state in API request format
export default function getRequestModel(time: string, formstate: Formstate): Object {
  let MetricMethods = new GetMetricConfig()
  let counterRlts = MetricMethods.getCounterMetrics()
  let ratioRlts = MetricMethods.getRatioMetrics()
  return {
    start_time: time,
    service_name: formstate.service,
    metric_specs: {
      counter_metrics: counterRlts,
      ratio_metrics: ratioRlts
    },
    criteria: getCriteriaModel(formstate.metric),
    baseline: {
      id: `${formstate.baseline}`,
      version_labels: {
        destination_service_namespace: formstate.namespace,
        destination_workload: formstate.baseline
      }
    },
    candidates: getCandModel(formstate.namespace, formstate.candidates)
  }
}
