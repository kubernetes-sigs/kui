// iter8 metric config map type definition

type MetricConfigMap = {
  apiVersion: string
  kind: string
  metadata: {
    name: string
    namespace: string
    annotations?: { [name: string]: string }
    creationTimestamp?: string
    resourceVersion?: string
    selfLink?: string
    uid?: string
  }
  data: {
    'counter_metrics.yaml': string
    'ratio_metrics.yaml': string
  }
}

type CounterMetrics = CounterMetric[]

type CounterMetric = {
  name: string
  query_template: string
  preferred_direction: preferredDirections
  units: string
}

type RatioMetrics = RatioMetric[]

type RatioMetric = {
  name: string
  numerator: string
  denominator: string
  preferred_direction: preferredDirections
  zero_to_one?: boolean
}

enum preferredDirections {
  'lower',
  'higher'
}

export { MetricConfigMap, CounterMetrics, CounterMetric, RatioMetrics, RatioMetric, preferredDirections }
