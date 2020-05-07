/*
* Data models for the state object in React Components
*/

// Model for exprForm.tsx state
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
// Model for decisionForm.tsx
interface DecisionState {
	notifyTime: string,
	selectedAlgo: string,
	trafficSplit: Array<any>,
	trafficErr: Boolean,
	notifyUser: Boolean,
	exprCreated: Boolean,
	haveResults: Boolean,
	exprReq?: any,
	exprResult?: any
}

export {
	Metricstate,
	Formstate,
	DecisionState
}