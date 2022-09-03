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

/**
 * Name: pi2
 * Completions: 20/20
 * Duration: 55s
 * Age: 7d20h
 * Containers: pi
 * Images: perl
 * Selector: controller-uid=7245023c-0243-4007-a921-b5d087712c59
 */

import { age } from './Generic'
import { Job } from '../../../../model/resource'
import toDescriptionList, { selectorToString } from './convert'

export default function JobSummary(job: Job) {
  const { metadata, spec, status } = job
  const { containers } = spec.template.spec

  return toDescriptionList({
    Name: metadata.name,
    Completions: `${status.succeeded || 0}/${spec.completions}`,
    Duration: age(job, status.completionTime),
    Age: age(job),
    Containers: containers.map(_ => _.image).join(', '),
    Selector: selectorToString(spec.selector)
  })
}
