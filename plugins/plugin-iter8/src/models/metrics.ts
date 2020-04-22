/*
 * Copyright 2019 IBM Corporation
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
 * This file introduces a "modes" command that opens the sidecar with
 * three modes.
 *
 */
/**
 * Command handler that constructs a MultiModalResponse with the given
 * set of modes. The core Kui presentation engine will take care of
 * adding any pre-registered modes on top of the default ones returned
 * by this command.
 *
 * After executing the command, you should see the various parts of
 * the metadata decorate the resulting view.
 *
 */

/**
 * Here is where we register our command. The modes of a
 * `MultiModalResponse` can either be manifested by the command
 * handler (as is the case with "sample modes"), or can be
 * pre-registered (as is the case with "sample modes2").
 *
 * The pre-registration approach allows you to decorate resources
 * managed by other plugins. For example, `pluginA` might offer a
 * command to fetch and display a set of default modes associated with
 * a resource type; then, `pluginB` may register a set of modes that
 * decorate that resource type with additional mode tabs. In that
 * scenario, `pluginB` need not even add commands; it suffices, in
 * that scenario, for `pluginB` only to register its new modes.
 *
 */
import { ModeRegistration } from '@kui-shell/core'
import { KubeResource } from '@kui-shell/plugin-kubectl'
import { MetricDetailsMode } from '../modes/get-metrics'
const ob = new MetricDetailsMode()
export const kind = 'Metric Config'
/** A Kui response needs some metadata to describe the resource */

function verifyMetricResponse(resource: KubeResource): boolean {
  return resource.kind === 'Command' && resource.metadata.name === 'Metric Command'
}

const metricListMode: ModeRegistration<KubeResource> = {
  when: verifyMetricResponse,
  mode: {
    mode: 'Metric List',
    react: ob.MetricList()
  }
}

const metricYamlMode: ModeRegistration<KubeResource> = {
  when: verifyMetricResponse,
  mode: {
    mode: 'Metric Yaml',
    label: 'Config Map',
    content: ob.MetricYaml(),
    contentType: 'yaml'
  }
}
export { metricListMode, metricYamlMode }
