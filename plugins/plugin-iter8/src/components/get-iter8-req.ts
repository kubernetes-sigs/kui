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
					"reward": newMetric.reward,
				})			
			}
			else{
				metricArr.push({
					"id": i,
					"metric_id": newMetric.name,
					"reward": newMetric.reward,
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
		      "id": `${candList[i]}_candidate`,
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
			    "id": `${formstate.base}_base`,
			    "version_labels": {
			      "destination_service_namespace": formstate.ns,
			      "destination_workload": formstate.base
	    		}
			},
			"candidates": this.getCandModel(formstate.ns, formstate.cand)
		};
	}
}
export {
	Metricstate,
	Formstate,
	RequestModel
}
// const state = {
// 	showMetrics: false, //determines the visibility of metric config
// 	invalidCand: false, //determines whether cand values are valid
// 	name: 'rollout-test', ns:'bookinfo-iter8', svc: 'reviews', base:'reviews-v2', cand:['reviews-v2', 'reviews-v3'], //basic expr attributes
// 	metric: [{name: "iter8_request_count", type:"Counter", reward: false, limitType: "absolute", limitValue:20},
// 			{name: "iter8_error_rate", type:"Ratio", reward: true, limitType: '', limitValue:0}
// 			], //metric attributes
// 	disableReward: false, //disables the reward select for other metrics
// }
// var model = new RequestModel();
// var d = new Date();
// var n = d.toISOString();
// var jsonObj = model.getRequestModel(n, state);
// console.log(jsonObj);