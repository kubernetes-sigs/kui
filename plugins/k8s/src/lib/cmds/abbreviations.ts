/*
 * Copyright 2018 IBM Corporation
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

/**
 * Processed output:
 *
 * kubectl api-resources |  awk 'BEGIN { print "{" } length($2) < 4 {print "  " $2 ": \"" $1 "\","} END { print "}"}'
 *
 */
const abbreviations = {
  cs: 'componentstatuses',
  cm: 'configmaps',
  ep: 'endpoints',
  ev: 'events',
  ns: 'namespaces',
  no: 'nodes',
  pvc: 'persistentvolumeclaims',
  pv: 'persistentvolumes',
  po: 'pods',
  rc: 'replicationcontrollers',
  sa: 'serviceaccounts',
  svc: 'services',
  ds: 'daemonsets',
  sts: 'statefulsets',
  hpa: 'horizontalpodautoscalers',
  cj: 'cronjobs',
  csr: 'certificatesigningrequests',
  ing: 'ingresses',
  rs: 'replicasets',
  owc: 'compositions',
  owf: 'functions',
  owp: 'packages',
  owr: 'rules',
  owt: 'triggers',
  pdb: 'poddisruptionbudgets',
  psp: 'podsecuritypolicies',
  sc: 'storageclasses'
}

export default abbreviations
