import { ModeRegistration } from '@kui-shell/core'
import { KubeResource } from '@kui-shell/plugin-kubectl'
import { MetricDetailsMode } from '../modes/get-metrics'
import { deleteMetricCommand } from '../components/delete-metric'
const ob = new MetricDetailsMode()

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

function metricDeleteCommand(metricName) {
  return deleteMetricCommand(metricName.argv.splice(3))
}
export { metricListMode, metricYamlMode, metricDeleteCommand }
