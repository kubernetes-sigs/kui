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

enum experimentTypes {
  hil = 'Human In the Loop',
  automated = 'Automated'
}

// Functional Component for Chart Rendering
const criteriaChartDesign = {
  chart: {
    type: 'line',
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true
    },
    toolbar: {
      autoSelected: 'zoom'
    }
  },
  stroke: {
    width: 2,
    curve: 'straight',
    dashArray: [9]
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 3
  },
  title: {
    text: '',
    align: 'left'
  },
  yaxis: {
    labels: {
      formatter: function(val) {
        return (val / 1000000).toFixed(0)
      }
    }
  },
  xaxis: {
    type: 'datetime',
    categories: [],
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: "MMM 'yy",
        day: 'dd MMM',
        hour: 'HH:mm'
      }
    }
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function(val) {
        return (val / 1000000).toFixed(0)
      }
    }
  }
}

export { experimentTypes, criteriaChartDesign }
