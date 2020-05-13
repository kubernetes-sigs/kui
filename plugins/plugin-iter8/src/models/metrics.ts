import { ModeRegistration } from '@kui-shell/core'
import { KubeResource } from '@kui-shell/plugin-kubectl'
import { MetricDetailsMode } from '../modes/get-metrics'

function verifyMetricResponse(resource: KubeResource): boolean {
  return resource.kind === 'Command' && resource.metadata.name === 'Metric Command'
}

const metricListMode: ModeRegistration<KubeResource> = {
  when: verifyMetricResponse,
  mode: {
    mode: 'Metric List',
    react: new MetricDetailsMode().MetricList()
  }
}

const metricYamlMode: ModeRegistration<KubeResource> = {
  when: verifyMetricResponse,
  mode: {
    mode: 'Metric Yaml',
    label: 'Config Map',
    content: new MetricDetailsMode().MetricYaml(),
    contentType: 'yaml'
  }
}

function metricDeleteCommand(metricName) {
  return new MetricDetailsMode().MetricDeleteCommand(metricName.argv.splice(3))
}
export { metricListMode, metricYamlMode, metricDeleteCommand }
