/*
 * Copyright 2017,2019 IBM Corporation
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

import * as Debug from 'debug'
import * as parseDuration from 'parse-duration'

import { eventBus, UI } from '@kui-shell/core'

import theme from './theme'
// import { transparent } from './util'
const debug = Debug('wrk/chart')

// from injectScript Chart below
declare let Chart

interface Options {
  noListen: boolean
}

class DefaultOptions implements Options {
  noListen = false // eslint-disable-line @typescript-eslint/explicit-member-accessibility
}

export const init = (graphics, options: Options = new DefaultOptions()) => {
  if (graphics.chart === undefined) {
    // then we weren't asked to make a chart
    return
  }

  if (typeof Chart === 'undefined') {
    UI.injectScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js')

    return setTimeout(() => init(graphics, options), 100)
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  graphics.chart.appendChild(canvas)

  const timeFormat = 'MM/DD/YYYY HH:mm'
  const type = 'line'
  const fill = false
  const yAxisID = 'latency'
  const pointRadius = 0
  const lineTension = 0

  const gridLines = {
    zeroLineWidth: 3,
    zeroLineColor: '#4C4C4C',
    drawTicks: false,
    color: '#D8D8D8'
  }
  const gridLinesTransparent = Object.assign({}, gridLines, {
    color: 'transparent'
  })
  const ticks = { beginAtZero: true, padding: 10, fontStyle: 'bold' }

  /** create a ChartJS chart configuration object */
  const makeChartConfig = () => {
    // pick up the theme choices
    const { fontFamily } = theme()
    debug('theme', fontFamily)

    const chartData = {
      labels: [],
      datasets: [
        {
          type,
          fill,
          label: 'Requests/sec',
          data: [],
          yAxisID: 'rps',
          backgroundColor: 'transparent',
          pointStyle: 'rectRot',
          lineTension
        },
        {
          type,
          fill,
          label: '99% Latency',
          data: [],
          yAxisID,
          lineTension,
          borderDash: [4, 2],
          pointBackgroundColor: 'transparent'
        },
        { type, fill, label: 'Median Latency', data: [], yAxisID, lineTension },
        { type, fill: '+1', label: 'skip', data: [], yAxisID, lineTension },
        {
          type,
          fill: '-1',
          label: '25-75% Band',
          data: [],
          yAxisID,
          lineTension
        },
        { type, fill: '+1', label: 'skip', data: [], yAxisID, lineTension },
        {
          type,
          fill: '-1',
          label: 'Min-Max Band',
          data: [],
          yAxisID,
          lineTension
        }
        // { type, fill: '+1', label: 'skip', data: [], backgroundColor: transparent(area,0.025), borderColor: 'transparent', yAxisID: 'rps', pointRadius, lineTension },
        // { type, fill: '-1', label: 'skip', data: [], backgroundColor: transparent(area,0.025), borderColor: 'transparent', yAxisID: 'rps', pointRadius, lineTension }
      ]
    }

    return {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        /* title: {
          display: true,
          text: 'Load Test Results'
          }, */
        tooltips: {
          mode: 'index',
          intersect: true,
          titleFontFamily: fontFamily,
          bodyFontFamily: fontFamily,
          footerFontFamily: fontFamily
        },
        legend: {
          reverse: true,
          labels: {
            fontFamily,
            usePointStyle: true,
            filter: item => {
              return item.text !== 'skip'
            }
          }
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              display: true,
              // stacked: true,
              ticks: {
                fontFamily,
                padding: 10,
                maxTicksLimit: 4
              },
              gridLines: gridLinesTransparent,
              maxBarThickness: 30,
              time: {
                format: timeFormat
                // round: 'day'
              },
              scaleLabel: {
                display: true,
                fontStyle: 'bold',
                fontFamily,
                fontSize: 13,
                labelString: 'Time'
              }
            }
          ],
          yAxes: [
            {
              id: 'rps',
              position: 'left',
              type: 'linear',
              scaleLabel: {
                display: true,
                fontStyle: 'bold',
                fontFamily,
                fontSize: 13,
                labelString: 'Requests per Second'
              },
              ticks,
              gridLines
            },
            {
              id: 'latency',
              position: 'right',
              type: 'linear',
              scaleLabel: {
                display: true,
                fontStyle: 'bold',
                fontFamily,
                fontSize: 13,
                labelString: 'Latency'
              },
              ticks,
              gridLines: gridLinesTransparent
            }
          ]
        }
      }
    }
  }

  const chart = (graphics.container.chart = new Chart(ctx, makeChartConfig()))

  const labels = chart.data.labels
  const l99 = chart.data.datasets[1]
  const l50 = chart.data.datasets[2]
  const l25 = chart.data.datasets[3]
  const l75 = chart.data.datasets[4]
  const lmin = chart.data.datasets[5]
  const lmax = chart.data.datasets[6]
  const rps = chart.data.datasets[0]
  // const rpsmin = chart.data.datasets[chart.data.datasets.length - 2]
  // const rpsmax = chart.data.datasets[chart.data.datasets.length - 1]

  /** inject the current theme into the chart canvas */
  const injectTheme = (doUpdate = true) => {
    // pick up the theme choices
    const { fontFamily, bar, area, borderWidth = 1, chart: chartStyle } = theme()
    debug('theme', fontFamily, bar)

    if (chartStyle && chartStyle.backgroundColor) {
      graphics.container.style.background = chartStyle.backgroundColor
    }

    const inject = (settings, obj) => {
      obj.borderColor = settings.border
      obj.backgroundColor = settings.bg
      obj.borderWidth = borderWidth
      obj.pointRadius = pointRadius
    }

    inject(bar.latency99, l99)
    inject(bar.latency50, l50)
    inject(bar.latency25, l25)
    inject(bar.latency75, l75)
    inject(bar.latencyMinMax, lmin)
    inject(bar.latencyMinMax, lmax)

    rps.borderColor = area
    rps.borderWidth = borderWidth
    rps.pointRadius = pointRadius
    rps.pointBackgroundColor = area

    if (doUpdate) {
      chart.update()
    }
  }

  //
  // when the theme changes, trigger a chart redraw
  //
  eventBus.on('/theme/change', () => injectTheme(true))

  injectTheme(false)

  const right = document.querySelector('#sidecar .header-right-bits .custom-header-content')
  const label = document.createElement('div')
  const max = document.createElement('div')

  UI.empty(right)

  right.appendChild(label)
  right.appendChild(max)
  max.classList.add('kind')
  max.style.marginTop = '0'
  label.classList.add('deemphasize')
  label.innerText = 'max rps'
  label.title = 'Maximum requests per second achieved during this run'

  let currentMax
  const updateMax = rps => {
    if (!currentMax || rps > currentMax) {
      max.innerText = (~~rps).toString()
      currentMax = rps
    }
  }

  if (!options.noListen) {
    //
    // register as a listener for load test updates, for the chart
    //
    eventBus.on('/wrk/iter', row => {
      const {
        requestsPerSec,
        /* rpsMin, rpsMax, */ latency25,
        latency50,
        latency75,
        latency99,
        latencyMax,
        latencyMin
      } = row

      try {
        // const N = labels.length - 1
        // labels[N] = new Date().getTime()
        // l50[N] = parseDuration(latency50)
        // l99[N] = parseDuration(latency99)
        // lmax[N] = parseDuration(latencyMax)
        // rps[N] = requestsPerSec
        labels.push(row.timestamp)
        lmin.data.push(parseDuration(latencyMin))
        l25.data.push(parseDuration(latency25))
        l50.data.push(parseDuration(latency50))
        l75.data.push(parseDuration(latency75))
        l99.data.push(parseDuration(latency99))
        lmax.data.push(parseDuration(latencyMax))
        rps.data.push(requestsPerSec)
        // rpsmin.push(rpsMin * nThreads)
        // rpsmax.push(rpsMax * nThreads)

        // filler(10000)

        updateMax(requestsPerSec)

        // if (N > 0) {
        chart.update()
        // }
      } catch (err) {
        console.error(err)
      }
    })
  }

  return graphics.container.chart
}
