// import * as React from 'react'
// import { ToolbarProps } from '@kui-shell/core'
// import '../../src/web/scss/static/metrics.scss'
//
// import { TrashCan20, Reset20 } from '@carbon/icons-react'
// import GetMetricConfig from '../components/metric-config'
// import deleteMetric from '../components/delete-metric'
// import restoreMetric from '../components/restore-metric'
// import ReactErrorDisplay from './error-react'
// import { DataTable } from 'carbon-components-react';
// const { Table, TableHead, TableHeader, TableBody, TableCell, TableRow, TableContainer, TableSelectRow } = DataTable;
//
// const execSync = require('child_process').execSync
//
//
// class DeletedText extends React.Component {
//   public render() {
//     return (<p className="deletedtext">Deleted</p>)
//   }
// }
//
// class DeleteMetrics extends React.Component<any, any> {
//   private ratio = []
//   private counter = []
//   public state = {ratio: {}, counter: {}}
//   public constructor(props) {
//     super(props)
//     this.ratio = props['params'].metrics.ratio
//     this.counter = props['params'].metrics.counter
//     this.state = {ratio: this.ratio, counter: this.counter}
//   }
//   public updateIsDeleted(metric, type) {
//     if(type === "counter") {
//       if (deleteMetric(metric, type).success === metric) {
//         this.counter[metric].isDeleted = true
//         console.log("Deleted: "+ metric)
//         var alsoDelete = this.counter[metric].alsoDelete
//         for(var j = 0; j < alsoDelete.length; j++) {
//           if (deleteMetric(alsoDelete[j], "ratio").success === alsoDelete[j]) {
//             this.ratio[alsoDelete[j]].isDeleted=true
//             console.log(alsoDelete[j])
//           }
//         }
//       }
//     }
//     else {
//       if (deleteMetric(metric, type).success === metric) {
//       this.ratio[metric].isDeleted = true
//       console.log(metric)
//       }
//     }
//     this.setState({ counter: this.counter, ratio: this.ratio})
//   }
//
//   public restore(metric, type, details) {
//     console.log(metric, type, details)
//     if (type === "counter") {
//       if (restoreMetric(metric, details, type).success === metric) {
//         this.counter[metric].isDeleted = false
//         console.log("Restored: "+ metric)
//       }
//     }
//     else {
//       console.log("Restore ratio metric")
//       //check if numerator is restored
//       //Restore Numerator
//       //check if denominator is restored
//       //Restore denominator
//       //Restore Ratio metric
//       //only then update
//
//     }
//     this.setState({ counter: this.counter, ratio: this.ratio})
//   }
//   public renderOnDelete(metric, type, details) {
//     return (<p>
//               <div className="deletedtext">Deleted</div>
//               <div className="clickableicon" onClick={() => this.restore(metric, type, details)}> <Reset20/> </div>
//             </p>)
//   }
//
//   public render() {
//     return (<div>
//             <DataTable
//               rows={[]}
//               headers={[]}
//               render={({ rows, headers, getHeaderProps }) =>
//                 (<TableContainer title="Counter Metrics">
//                 <Table>
//                   <TableBody>
//                     {Object.entries(this.counter).map(m => (
//                       <TableRow key={m[0]}>
//                           <TableCell>{m[0]}</TableCell>
//                           <TableCell className="width20">
//                             <div>
//                               {m[1].isDeleted ? (this.renderOnDelete(m[1].name, "counter", m[1].details))
//                                 : <div className="clickableicon" onClick={() => this.updateIsDeleted(m[0], "counter")}>
//                                     <TrashCan20/>
//                                     <div className="tooltiptext"> Warning: Will also delete {JSON.stringify(m[1].alsoDelete)}</div>
//                                   </div>
//                                   }
//                             </div>
//                           </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//             />
//           <DataTable
//             rows={[]}
//             headers={[]}
//             render={({ rows, headers, getHeaderProps }) =>
//             (<TableContainer title="Ratio Metrics">
//             <Table>
//               <TableBody>
//                 {Object.entries(this.ratio).map(m => (
//                   <TableRow key={m[0]}>
//                       <TableCell>{m[0]}</TableCell>
//                       <TableCell className="width20">
//                         <div>
//                           {m[1].isDeleted ? (this.renderOnDelete(m[1].name, "ratio", m[1].details))
//                             : <TrashCan20 className="clickableicon" onClick={() => this.updateIsDeleted(m[0], "Ratio")}/>}
//                         </div>
//                       </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             </TableContainer>
//             )}
//             />
//             </div>
//             )
//   }
// }
//
// export class MetricDeleteMode {
//   public ob
//   public constructor() {
//     this.ob = new GetMetricConfig()
//   }
//
//   public getMetricDeleteInfo() {
//     const ratioMetricOutput = this.ob.getRatioMetrics()
//     const counterMetricOutput = this.ob.getCounterMetrics()
//     var rm = {}
//     var cm = {}
//     if ({}.hasOwnProperty.call(ratioMetricOutput, 'error')) {
//       return {error: ratioMetricOutput.error}
//     } else if ({}.hasOwnProperty.call(counterMetricOutput, 'error')) {
//       return {error: counterMetricOutput.error}
//     }
//
//     else {
//       for(var i=0; i<counterMetricOutput.length; i++) {
//         cm[counterMetricOutput[i].name] = {
//           name: counterMetricOutput[i].name,
//           details: counterMetricOutput[i],
//           isDeleted: false,
//           alsoDelete: [],
//           alsoRestore: []
//         }
//       }
//       for(var i=0; i<ratioMetricOutput.length; i++) {
//         rm[ratioMetricOutput[i].name] = {
//           name: ratioMetricOutput[i].name,
//           details: ratioMetricOutput[i],
//           isDeleted: false,
//           alsoDelete: [],
//           alsoRestore: [ratioMetricOutput[i]["numerator"], ratioMetricOutput[i]["denominator"]]
//         }
//         cm[ratioMetricOutput[i]["numerator"]].alsoDelete.push(ratioMetricOutput[i].name)
//         cm[ratioMetricOutput[i]["denominator"]].alsoDelete.push(ratioMetricOutput[i].name)
//       }
//       }
//       return {ratio: rm, counter: cm}
//     }
//   public MetricDelete() {
//     const metrics = this.getMetricDeleteInfo()
//     if ({}.hasOwnProperty.call(metrics, 'error')) {
//       return ReactErrorDisplay(metrics.error)
//     }
//     else {
//       return function GetMetricList(props: ToolbarProps) {
//         return <DeleteMetrics params={{ ...props, metrics: metrics}} />
//       }
//     }
//   }
//   public MetricDeleteCommand() {
//     return this.ob.deleteMetric()
//   }
//
// }
