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
	exprCreated: Boolean,
	haveResults: Boolean,
	exprReq?: Formstate,
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
	DecisionState,
	RequestModel
}