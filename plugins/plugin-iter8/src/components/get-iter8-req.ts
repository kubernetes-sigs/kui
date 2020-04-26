import GetMetricConfig from './metric-config'
/*
* Data models for the state object in ExprForm
*/
interface Metricstate {
	name: string,
	type:string,
	reward: Boolean,
	limitType: string,
	limitValue: number
}
interface Formstate {
	disableresubmit: Boolean,
	showMetrics: Boolean,
	invalidCand: Boolean,
	name: string,
	ns:string,
	svc: string,
	base:string,
	cand:Array<string>,
	metric:Array<Metricstate>,
	disableReward: Boolean
}
/*
* Data model for state object in DecisionForm
*/
interface DecisionState {
	selectedAlgo: string,
	trafficSplit: Array<any>,
	exprCreated: Boolean,
	haveResults: Boolean,
	exprReq?: any,
	exprResult?: any
}

class RequestModel {

	//Convert the list of criteria in API request format
	private getCriteriaModel(definedMetrics: Array<Metricstate>): Array<Object>{
		let metricArr = [];
		for(let i = 0; i < definedMetrics.length; i++){
			let newMetric = definedMetrics[i];
			if(newMetric.limitType === ''){
				metricArr.push({
					"id": i,
					"metric_id": newMetric.name,
					"is_reward": newMetric.reward,
				})			
			}
			else{
				metricArr.push({
					"id": i,
					"metric_id": newMetric.name,
					"is_reward": newMetric.reward,
					"threshold": {
				        "type": newMetric.limitType,
				        "value": newMetric.limitValue
		      		}
				})
			}
		}
		return metricArr;
	}
	//Convert the list of candidates in API request format
	private getCandModel(namespace: string, candList: Array<string>):Array<Object>{
		let candObjs = [];
		for(let i = 0; i < candList.length; i++){
			candObjs.push({
		      "id": `${candList[i]}`,
		      "version_labels": {
		        "destination_service_namespace": namespace,
		        "destination_workload": candList[i]
		      }
	    	})
		}
		return candObjs;
	}
	//Converts the current time and form state in API request format
	public getRequestModel(time: string, formstate: Formstate): Object{
		var MetricMethods = new GetMetricConfig();
		var counterRlts = MetricMethods.getCounterMetrics();
		var ratioRlts = MetricMethods.getRatioMetrics();
		return {
			"start_time": time,
			"service_name": formstate.svc,
			"metric_specs": {
				"counter_metrics": counterRlts,
				"ratio_metrics": ratioRlts
			},
			"criteria": this.getCriteriaModel(formstate.metric),
			"baseline": {
			    "id": `${formstate.base}`,
			    "version_labels": {
			      "destination_service_namespace": formstate.ns,
			      "destination_workload": formstate.base
	    		}
			},
			"candidates": this.getCandModel(formstate.ns, formstate.cand),
			"last_state": null
		};
	}

	public updateLastState(lastState:object, reqmodel:any): object{
		var newmodel = reqmodel;
		newmodel["last_state"]= lastState;
		return newmodel;

	}
}
export {
	Metricstate,
	Formstate,
	DecisionState,
	RequestModel
}

// var prevResponse = {
//   "timestamp": "2020-04-03T12:59:50.568000+00:00",
//   "baseline_assessment": {
//     "id": "reviews_base",
//     "request_count": 500,
//     "criterion_assessments": [
//       {
//         "id": "0",
//         "metric_id": "iter8_mean_latency",
//         "statistics": {
//           "value": 0.005,
//           "ratio_statistics": {
//             "improvement_over_baseline": {
//               "lower": 2.3,
//               "upper": 5
//             },
//             "probability_of_beating_baseline": 0.82,
//             "probability_of_being_best_version": 0.1,
//             "credible_interval": {
//               "lower": 22,
//               "upper": 28
//             }
//           }
//         },
//         "threshold_assessment": {
//           "threshold_breached": false,
//           "probability_of_satisfying_threshold": 0.8
//         }
//       }
//     ],
//     "win_probability": 0.1
//   },
//   "candidate_assessments": [
//     {
//       "id": "reviews_candidate",
//       "request_count": 1500,
//       "criterion_assessments": [
//         {
//           "id": "0",
//           "metric_id": "iter8_mean_latency",
//           "statistics": {
//             "value": 0.1005,
//             "ratio_statistics": {
//               "improvement_over_baseline": {
//                 "lower": 12.3,
//                 "upper": 15
//               },
//               "probability_of_beating_baseline": 0.182,
//               "probability_of_being_best_version": 0.1,
//               "credible_interval": {
//                 "lower": 122,
//                 "upper": 128
//               }
//             }
//           },
//           "threshold_assessment": {
//             "threshold_breached": true,
//             "probability_of_satisfying_threshold": 0.18
//           }
//         }
//       ],
//       "win_probability": 0.11,
//       "rollback": false
//     }
//   ],
//   "traffic_split_recommendation": {
//     "unif": {
//       "reviews_base": 50,
//       "reviews_candidate": 50
//     }
//   },
//   "winner_assessment": {
//     "winning_version_found": false,
//     "current_winner": null,
//     "winning_probability": null
//   },
//   "status": [
//     "all_ok"
//   ],
//   "status_interpretations": {
//     "all_ok": "Data from Prometheus available and was utilized without a glitch during this iteration",
//     "no_last_state": "No last state available during this iteration",
//     "no_prom_server": "Prometheus server unavailable",
//     "no_prom_data": "Incomplete Prometheus data during this iteration",
//     "insufficient_data_for_assessment": "Insufficient data available to create an assessment",
//     "invalid_experiment_spec": "Invalid experiment specification"
//   },
//   "last_state": null
// }

// var req = {
//   "start_time": "2020-04-03T12:55:50.568Z",
//   "iteration_number": 1,
//   "service_name": "reviews",
//   "metric_specs": {
//     "counter_metrics": [
//       {
//         "id": "iter8_request_count",
//         "query_template": "sum(increase(istio_requests_total{reporter='source'}[$interval])) by ($entity_labels)"
//       },
//       {
//         "id": "iter8_total_latency",
//         "query_template": "sum(increase(istio_request_duration_seconds_sum{reporter='source'}[$interval])) by ($entity_labels)"
//       },
//       {
//         "id": "iter8_error_count",
//         "query_template": "sum(increase(istio_requests_total{response_code=~'5..',reporter='source'}[$interval])) by ($entity_labels)",
//         "preferred_direction": "lower"
//       },
//       {
//         "id": "conversion_count",
//         "query_template": "sum(increase(newsletter_signups[$interval])) by ($entity_labels)"
//       }
//     ],
//     "ratio_metrics": [
//       {
//         "id": "iter8_mean_latency",
//         "numerator": "iter8_total_latency",
//         "denominator": "iter8_request_count",
//         "preferred_direction": "lower",
//         "zero_to_one": false
//       },
//       {
//         "id": "iter8_error_rate",
//         "numerator": "iter8_error_count",
//         "denominator": "iter8_request_count",
//         "preferred_direction": "lower",
//         "zero_to_one": true
//       },
//       {
//         "id": "conversion_rate",
//         "numerator": "conversion_count",
//         "denominator": "iter8_request_count",
//         "preferred_direction": "higher",
//         "zero_to_one": true
//       }
//     ]
//   },
//   "criteria": [
//     {
//       "id": "0",
//       "metric_id": "iter8_mean_latency",
//       "reward": false,
//       "threshold": {
//         "type": "absolute",
//         "value": 25
//       }
//     }
//   ],
//   "baseline": {
//     "id": "reviews_base",
//     "version_labels": {
//       "destination_service_namespace": "bookinfo_ns",
//       "destination_workload": "reviews-v1"
//     }
//   },
//   "candidates": [
//     {
//       "id": "reviews_candidate",
//       "version_labels": {
//         "destination_service_namespace": "bookinfo_ns",
//         "destination_workload": "reviews-v2"
//       }
//     }
//   ]
// }

// var obj = new RequestModel();
// var x = obj.updateLastState(prevResponse, req);
// let apiModels = new RequestModel();
// let AnalyticsAssess = new GetAnalyticsAssessment(x);
// AnalyticsAssess.getAnalyticsAssessment()
// 	.then((result) => {let jsonrlts = JSON.parse(JSON.parse(result));
// 	  		 				console.log(jsonrlts);
// 	 })
// 	.catch((failure) => {console.log(failure);})  		