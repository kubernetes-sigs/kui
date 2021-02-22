/*
 * Copyright 2020 The Kubernetes Authors
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

export const about = `#### Iter8

[Iter8](https://github.com/iter8-tools/iter8) enables statistically robust continuous experimentation of microservices in your CI/CD pipelines

Iter8’s expressive model of cloud experimentation supports a variety of CI/CD scenarios. Using an iter8 experiment, you can:

- Run a **_performance test_** with a single version of a microservice.

- Perform a **_canary release_** with two versions, a baseline and a candidate. Iter8 will shift application traffic safely and gradually to the candidate, if it meets the criteria you specify in the experiment.

- Perform an **_A/B test_** with two versions – a baseline and a candidate. Iter8 will identify and shift application traffic safely and gradually to the winner, where the winning version is defined by the criteria you specify in the experiment.

- Perform an **_A/B/N_** test with multiple versions – a baseline and multiple candidates. Iter8 will identify and shift application traffic safely and gradually to the winner.

[Learn more](https://iter8.tools/)
`

export const commands = `
#### Currently Available Commands:

We have implemented the following commands that can be used once the KUI terminal is up and running:
#### 1. iter8 metrics
This command opens a KUI sidecar where the user can perform CRUD operations on the iter8 metric configmap. Specifically, users can add, edit, delete and restore metrics on the KUI sidecar that is opened.
#### 2. iter8 create experiment
This command also opens a KUI sidecar and is used to create Human-In-The-Loop experiments with iter8. This command opens a sidecar with two tabs- one for creating the experiment and one for viewing the decision and metrics for the experiment from _iter8-analytics_. The sidecar options are interactive and can be experimented with by the user.
#### 2. iter8 config verify
This command verifies if _iter8-analytics_ and _iter8-controller_ service is currently installed in the user's environment

More information on how to use these commands is available [here](http://iter8.tools/integrations/iter8-kui/)
`

export const controller = `
#### Iter8 Controller

A Kubernetes controller that automates canary releases and A/B testing by adjusting the traffic across different versions of a microservice as recommended by _iter8-analytics_ until the canary replaces the baseline (previous) version.
`

export const analytics = `
#### Iter8 Analytics

A service that assesses the behavior of different microservice versions by analyzing metrics associated with each version using robust statistical techniques to determine which version is the winner with respect to the metrics of interest and which versions pass a set of success criteria.

It returns the result of the data analysis along with a recommendation for how the traffic should be split across all microservice versions. The iter8-analytics' REST API is used by _iter8-controller_.
`
