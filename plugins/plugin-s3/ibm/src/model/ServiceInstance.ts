/*
 * Copyright 2021 The Kubernetes Authors
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

import Common from './Common'

type ServiceInstance = Common & {
  region_id: string
  resource_plan_id: string
  create_time: number
  created_by: string
  type: string
  resource_id: string
  dashboard_url: string
  allow_cleanup: boolean
  locked: boolean
  last_operation: { state: string; type: string } | null
  account_url: string
  resource_plan_url: string
  resource_bindings_url: string
  resource_aliases_url: string
  siblings_url: string
  target_crn: string
}

export default ServiceInstance
