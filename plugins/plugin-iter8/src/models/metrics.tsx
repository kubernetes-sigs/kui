import { ModeRegistration } from '@kui-shell/core'
import { KubeResource } from '@kui-shell/plugin-kubectl'
import { deleteMetrics, getMetricsYaml, getMetricDetailsMode } from '../modes/get-metrics'

function verifyMetricResponse(resource: KubeResource): boolean {
  return resource.kind === 'Command' && resource.metadata.name === 'Metric Command'
}

const metricListMode: ModeRegistration<KubeResource> = {
  when: verifyMetricResponse,
  mode: {
    mode: 'Metric List',
    react: getMetricDetailsMode
  }
}

const metricYamlMode: ModeRegistration<KubeResource> = {
  when: verifyMetricResponse,
  mode: {
    mode: 'Metric Yaml',
    label: 'Config Map',
    content: getMetricsYaml(),
    contentType: 'yaml'
  }
}

function metricDeleteCommand(metricName) {
  return deleteMetrics(metricName.argv.splice(3))
}

export { metricListMode, metricYamlMode, metricDeleteCommand }
