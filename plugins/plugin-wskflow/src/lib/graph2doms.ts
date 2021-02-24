/*
 * Copyright 2017 The Kubernetes Authors
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

import Debug from 'debug'
import { Tab } from '@kui-shell/core'

import ActivationLike from './activation'
import { textualPropertiesOfCode } from './util'
import { FlowNode } from './graph'
import Response from './response'

const debug = Debug('plugins/wskflow/graph2doms')

const defaultMaxLabelLength = 10

const wfColorAct = {
  active: '#81C784',
  failed: '#EC7063',
  activeHovered: '#33a02c',
  failedHovered: 'red',
  inactive: 'lightgrey',
  edgeInactive: 'grey',
  inactiveBorder: 'grey'
}

const containerId = 'wskflowDiv'

export default async function graph2doms(
  tab: Tab,
  JSONgraph: FlowNode,
  ifReuseContainer?: Element,
  activations?: ActivationLike[],
  {
    layoutOptions = {},
    composites = { label: { fontSize: '4px', offset: { x: 0, y: -3 } } }
  }: {
    layoutOptions?: Record<string, string | boolean | number>
    composites?: {
      label: { fontSize: string; offset: { x: number; y: number } }
    }
  } = {}
): Promise<Response> {
  const [d3, { default: $ }, { default: ELK }] = await Promise.all([
    import('d3'),
    import('jquery'),
    import('elkjs/lib/elk.bundled.js')
  ])

  const maxLabelLength: number = (JSONgraph.properties && JSONgraph.properties.maxLabelLength) || defaultMaxLabelLength
  const defaultFontSize: string = (JSONgraph.properties && JSONgraph.properties.fontSize) || '7px'

  const zoom = d3.behavior.zoom().on('zoom', redraw) // eslint-disable-line @typescript-eslint/no-use-before-define

  const containerElement: HTMLElement = ifReuseContainer || $(`<div id="${containerId}"></div>`)
  const wskflowContainer: HTMLElement = $('<div id="wskflowContainer"></div>')
  let enterClickMode = false

  $(containerElement).append(wskflowContainer)

  $(wskflowContainer).addClass('grabbable') // we want to use grab/grabbing cursor

  const ssvg = d3
    .select($(wskflowContainer)[0])
    .append('svg')
    .attr('id', 'wskflowSVG')
    .attr('data-is-session-flow', !!activations)
    .call(zoom)

  const container = ssvg.append('g').on('dblclick.zoom', null)

  const svg = container
    .append('g')
    .attr('id', 'wskflowMainG')
    .attr('class', 'kui--screenshotable')

  const defs = svg.append('svg:defs')

  // a pattern mask for "not deployed"
  defs
    .append('svg:pattern')
    .attr('id', 'pattern-stripe')
    .attr('width', 1.2)
    .attr('height', 1.2)
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('patternTransform', 'rotate(45)')
    .append('svg:rect')
    .attr('width', 0.6)
    .attr('height', 2)
    .attr('transform', 'translate(0,0)')
    .attr('fill', '#aaa') // this will be the opacity of the mask, from #fff (full masking) to #000 (no masking)
  defs
    .append('svg:mask')
    .attr('id', 'mask-stripe')
    .append('svg:rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', 'url(#pattern-stripe)')

  // a heavier pattern mask
  defs
    .append('svg:pattern')
    .attr('id', 'pattern-stripe-heavy')
    .attr('width', 1.2)
    .attr('height', 1.2)
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('patternTransform', 'rotate(45)')
    .append('svg:rect')
    .attr('width', 1)
    .attr('height', 2)
    .attr('transform', 'translate(0,0)')
    .attr('fill', '#aaa') // this will be the opacity of the mask, from #fff (full masking) to #000 (no masking)
  defs
    .append('svg:mask')
    .attr('id', 'mask-stripe-heavy')
    .append('svg:rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', 'url(#pattern-stripe-heavy)')

  // define an arrow head
  const arrowHead = (id: string) => {
    const marker = defs
      .append('svg:marker')
      .attr('id', id)
      .attr('viewBox', '0 -5 10 10')
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('markerWidth', 4.2) // marker settings
      .attr('markerHeight', 7)
      .attr('orient', 'auto')

    marker.append('svg:path').attr('d', 'M0,-5L10,0L0,5')

    return marker
  }

  arrowHead('end')
  arrowHead('forwardingEnd').attr('refX', 10)
  arrowHead('edgeTraversedEnd')
    .attr('markerWidth', 5.25)
    .attr('markerHeight', 8.75)
    .attr('refX', 2.4)
  arrowHead('greenEnd')
  arrowHead('trueEnd')
  arrowHead('falseEnd')

  defs
    .append('svg:g')
    .attr('id', 'retryIconNormal')
    .attr('transform', 'scale(0.02) rotate(90)')
    .append('svg:path')
    .attr(
      'd',
      'M852.8,558.8c0,194.5-158.2,352.8-352.8,352.8c-194.5,0-352.8-158.3-352.8-352.8c0-190.8,152.4-346.7,341.8-352.5v117.4l176.4-156.9L489,10v118C256.3,133.8,68.8,324.8,68.8,558.8C68.8,796.6,262.2,990,500,990c237.8,0,431.2-193.4,431.2-431.2H852.8z'
    )

  if (!$('#qtip')[0]) {
    // add qtip to the document
    $(document.body).append("<div id='qtip'><span id='qtipArrow'>&#9668</span><div id='qtipContent'></div></div>")
  }

  if (activations) {
    $(wskflowContainer).append(
      "<div id='actList' style='position: absolute; display:none; background-color: rgba(0, 0, 0, 0.8); color: white; font-size: 0.75em; padding: 1ex; width:225px; right: 5px; top: 5px;'></div>"
    )
  }

  const root = svg.append('g')
  let elkData

  //
  // After many tests, this is the right way to manually adjust values
  // for `transform` without introducing unwanted behavior when
  // zooming by mouse scrolling using d3's zoom feature.
  //
  // We have to set d3's zoom variable to have the same values as the
  // values we'd like for `transform`. So when d3 calculates the
  // values for event.translate/scale, it takes our manual adjustments
  // into account.
  //
  let applyAutoScale = true // if resizing the window will resize the graph. true by default.
  let customZoom = false

  function resizeToFit(meetOrSlice) {
    // resizeToFit implements a zoom-to-fit behavior using viewBox.
    // it no longer requires knowing the size of the container
    // disadventage is we cannot decide the max zoom level: it will always zoom to fit the entire container
    ssvg.attr('viewBox', `0 0 ${elkData.width} ${elkData.height}`)
    ssvg.attr('preserveAspectRatio', `xMidYMin ${meetOrSlice}`)
    container.attr('transform', '')
    $('#wskflowSVG').removeAttr('transform')
    zoom.translate([0, 0])
    zoom.scale(1)
  }
  const resizeToContain = () => resizeToFit('meet')
  const resizeToCover = () => {
    resizeToFit('slice')
    applyAutoScale = false
  }

  function drawGraph(nodes, links) {
    debug('drawGraph')

    // #1 add the nodes' groups
    const nodeData = root.selectAll('.node').data(nodes, function(d) {
      return d.id
    })

    const node = nodeData
      .enter()
      .append('g')
      .attr('transform', function(d) {
        return 'translate(' + (d.x || 0) + ' ' + (d.y || 0) + ')'
      })
      .attr('class', function(d) {
        // console.log(d);
        let className = 'node'

        if (d.children) {
          className += ' compound'
        } else {
          className += ' leaf'
        }

        if (d.tooltipHeader || d.type === 'function' || d.type === 'action') {
          // e.g. par and map; since these have an explanation (tooltipHeader), note them as such
          className += ' wskflow-node-with-special-meaning'
        }

        if (d.properties && d.properties.compoundNoParents) {
          className += ' no-parents'
        }

        if (d.type !== undefined) {
          className += ' ' + d.type
        } else {
          className += ' ' + d.label
        }

        // for tests, it is helpful to have a single css discriminant for functions and actions
        if (d.type === 'action' || d.type === 'function') {
          className += ' Task'
        }

        if (d.retryCount || d.repeatCount) {
          className += ' repeat'
        }

        return className
      })
      .attr('id', function(d) {
        return d.id
      })
      .attr('data-task-index', d => d.taskIndex) // add a data-task-index for every task. taskIndex is maintained at the graph model level
      .attr('data-name', function(d) {
        // make sure we obey the `/namespace/name` format
        const label =
          d.type === 'Entry' || d.type === 'Exit'
            ? d.type
            : d.multiLineLabel
            ? d.fullFunctionCode.replace(/\n/g, '')
            : d.label
        return label && (label.charAt(0) !== '/' ? `/_/${label}` : label)
      })
      .attr('data-kind', d => d.properties && d.properties.kind) // e.g. 'trigger'
      .attr('data-kind-detail', d => d.properties && d.properties.kindDetail) // e.g. the name of the trigger
      .attr('data-deployed', function(d) {
        if (activations) {
          // empty
        } else {
          // only for preview graphs, not for session graphs
          if (d.type === 'action') {
            if (d.deployed) {
              return 'deployed'
            } else {
              return 'not-deployed'
            }
          } else if (d.deployed === false) {
            return 'not-deployed'
          }
        }
      })
      .attr('data-status', d => {
        if (activations) {
          if (d.visited) {
            let failed = true // assumption: all fail is fail. if one succes, we count it as success
            d.visited.forEach(i => {
              if (activations[i] && activations[i].response.success) {
                failed = false
              }
            })
            if (failed) {
              $(this).attr('failed', true)
              return 'failed'
            } else {
              return 'success'
            }
          } else {
            return 'not-run'
          }
        }
      })

    // add representing boxes for nodes
    const svgns = 'http://www.w3.org/2000/svg'
    node
      .append(d => {
        return document.createElementNS(svgns, d.properties && d.properties.kind === 'trigger' ? 'polygon' : 'rect')
      })
      .attr('class', d => {
        return 'atom' + (d.type === 'action' || d.onclick ? ' clickable' : '') + (d.onclick ? ' has-onclick' : '')
      })
      .attr('points', d => {
        if (d.properties && d.properties.kind === 'trigger') {
          return '0 0, 0 13.5, 12 18, 24 13.5, 24 0, 12 6.25, 0 0'
        }
      })
      .attr('width', function(d) {
        return d.width
      })
      .attr('height', function(d) {
        return d.height
      })
      .attr('rx', function(d) {
        if (d.type === 'Entry' || d.type === 'Exit') {
          return '50%'
        }
      })
      .attr('ry', function(d) {
        if (d.type === 'Entry' || d.type === 'Exit') {
          return '50%'
        }
      })
      .style('fill', function(d) {
        if (d.children) {
          return 'transparent'
        }
      })
      .style('cursor', function(d) {
        if (activations) {
          if (d.visited && d.type === 'action') {
            return 'pointer'
          } else {
            return 'normal'
          }
        } else {
          if (d.type === 'action') {
            return 'pointer'
          } else {
            return 'normal'
          }
        }
      })
      .on('mouseover', function(d) {
        let qtipText = ''
        let qtipPre = false

        if (activations) {
          if (d.children === undefined && d.visited && $('#actList').css('display') !== 'block') {
            if (d.type === 'action') {
              // first, describe # activations if # > 1
              if (d.visited.length > 1) {
                qtipText += "<div style='padding-bottom:2px;'>" + activations.length + ' activations</div>'
              }

              let date
              d.visited.forEach(i => {
                // first part: time
                const a = activations[i]
                const start = new Date(a.start)
                let timeString = ''

                if (date === undefined || date !== start.getMonth() + 1 + '/' + start.getDate()) {
                  date = start.getMonth() + 1 + '/' + start.getDate()
                  timeString += date + ' '
                }

                timeString += start.toLocaleTimeString(undefined, {
                  hour12: false
                })

                let duration = a.duration.toString()
                let unit = 'ms'
                if (a.duration > 1000) {
                  duration = (a.duration / 1000).toFixed(2)
                  unit = 's'
                }
                let c
                if (a.response.success) {
                  c = wfColorAct.active
                } else {
                  c = wfColorAct.failed
                }
                qtipText +=
                  "<span style='color:" + c + "'>" + timeString + '</span> (' + duration + unit + ')<break></break>'
                let result = JSON.stringify(a.response.result)
                if (result.length > 40) {
                  result = result.substring(0, 40) + '... '
                }
                qtipText += result

                qtipText = "<div style='padding-bottom:2px;'>" + qtipText + '</div>'
              })
              // else if(d.type == "Exit" || d.type == 'Entry'){
            } else if (d.type === 'Exit') {
              const act = activations[d.visited[0]]
              const start = new Date(act.start)
              let timeString = start.getMonth() + 1 + '/' + start.getDate() + ' '
              timeString += start.toLocaleTimeString(undefined, {
                hour12: false
              })
              let result = act.response.result ? JSON.stringify(act.response.result, undefined, 4) : ''
              if (result.length > 200) {
                result = result.substring(0, 200) + '\u2026'
              } // horizontal ellipsis

              qtipText += `<div style='padding-bottom:2px'><span class='qtip-prefix'>${d.type}</span> <span style='color:${wfColorAct.active}'>${timeString}</span></div>${result}`
            }
          }
        } else {
          if (d.children) {
            if (d.type === 'try') {
              qtipText = "<span class='qtip-prefix red-text'>Try Block</span>"
            } else if (d.type === 'handler') {
              qtipText = "<span class='qtip-prefix red-text'>Handler Block</span>"
            } else if (d.type === 'try_catch') {
              const label = d.label || d.tooltip || ''
              if (label.indexOf(':') !== -1) {
                qtipText =
                  "<span class='qtip-prefix'>Try-Catch</span> <span style='color: orange'>" +
                  label.substring(label.indexOf(':') + 1) +
                  '</span>'
                // $(this).siblings("use").attr("xlink:href", "#retryIconOrange").attr("href", "#retryIconOrange");
              } else if (label.indexOf('Repeat') !== -1) {
                const num = label.split(' ')[1]
                qtipText =
                  "<span class='qtip-prefix'>Repeat </span>" +
                  "<span style='color: orange'>" +
                  num +
                  ' times</span> then continue'
                // $(this).siblings("use").attr("xlink:href", "#retryIconOrange").attr("href", "#retryIconOrange");
              } else {
                // qtipText = "<span style='color: #E5E8E8'>"+label+"</span>"
                qtipText = `<span class='qtip-prefix'>${label}</span>`
              }
            }
          } else if (d.type === 'action' && $('#' + d.id).attr('data-deployed') === 'not-deployed') {
            qtipText = `<span class='qtip-prefix red-text'>Warning |</span> This action is not deployed`
          } else if (d.type === 'action' || d.type === 'function') {
            const typeForDisplay = d.type === 'function' ? 'Inline Function' : 'Action'
            if (d.type === 'function') {
              qtipPre = true // use white-space: pre for function body
            }
            if (d.multiLineLabel) {
              qtipText = `<span class='qtip-prefix ${d.type}'>${typeForDisplay}</span>`
            } else {
              qtipText = `<span class='qtip-prefix ${
                d.type
              }' style="padding-right:5px; ">${typeForDisplay} |</span> ${d.label || d.tooltip || d.prettyCode}`
            }
          } else if (d.type === 'retain') {
            let edgeId
            const isOrigin = d.id.indexOf('__origin') > -1
            const expectedSrc = isOrigin ? d.id : d.id.replace(/__terminus/, '__origin')
            const expectedTerminus = isOrigin ? d.id.replace(/__origin/, '__terminus') : d.id
            for (let i = 0; i < links.length; i++) {
              if (links[i].source === expectedSrc && links[i].target === expectedTerminus) {
                edgeId = links[i].id
                break
              }
            }

            if (edgeId) {
              if (isOrigin) {
                qtipText = `<span class='qtip-prefix ${d.type}' style='padding-right:5px; color: #85C1E9'>Retain |</span> Data forwarding</span>`
              } else {
                qtipText = `<span class='qtip-prefix ${d.type}' style='padding-right:5px; color: #85C1E9'>Retain |</span> Data merging</span>`
              }

              $(".link[id='" + edgeId + "']").addClass('hover forwarding-edge')
            }
          } else if (d.type === 'Entry') {
            if (d.properties && d.properties.kind === 'trigger') {
              qtipText = `<span class='qtip-prefix ${d.type}' style='padding-right:5px; color: #85C1E9'>Trigger |</span> ${d.properties.kindDetail}`
            } else {
              qtipText = d.properties.title || 'The composition starts here'
            }
          } else if (d.type === 'Exit') {
            qtipText = d.properties.title || 'The composition ends here'
          } else if (d.type === 'let' || d.type === 'literal') {
            qtipText = `<div class='qtip-prefix let' style="margin-bottom:1ex; padding-right:5px; ">${
              d.type
            }</div>${d.label || d.tooltip}`
            qtipPre = true // use white-space: pre
          }

          if (d.properties && d.properties.choice) {
            qtipText +=
              "<div class='top-pad'>This is the <span style='color: orange;'>Y</span>/<span style='color: #DC7633;'>N</span> condition of an if</div>"

            // also highlight the edges
            $(".link[source='" + (d.id + '_ptrue') + "']").addClass('hover')
            $(".link[source='" + (d.id + '_pfalse') + "']").addClass('hover')
          }
        }

        if (!qtipText && d.tooltip) {
          //
          // the above rules are pretty specific to Apache Composer
          // (TODO refactor); this allows for a more modern custom
          // tooltip to be driven by the graph model producer
          //
          qtipText = `<div class='qtip-prefix ${
            d.tooltipColor ? 'color-base' + d.tooltipColor : 'function'
          }' style="margin-bottom:1ex; padding-right:5px; ">${d.tooltipHeader || d.type}</div>${d.tooltip}`
        }

        if (qtipText && qtipText.length !== 0) {
          $('#qtipContent').html(qtipText)

          $('#qtip').addClass('visible')

          if (qtipPre) $('#qtip').addClass('qtip-pre')
          else $('#qtip').removeClass('qtip-pre')

          const rect = $(this)[0].getBoundingClientRect()
          let qtipX = rect.left + rect.width
          let qtipY = rect.top + rect.height / 2 - $('#qtip').height() / 2

          if ($('#wskflowContainer').hasClass('picture-in-picture')) {
            // currentScale: 0.25
            const scaleString = $('#wskflowContainer').css('transform')
            let scale
            try {
              scale = parseFloat(scaleString.substring('matrix('.length, scaleString.indexOf(',')))
            } catch (e) {
              console.log(e)
              console.log(scaleString)
              scale = 0.25
            }

            qtipX /= scale
            qtipY =
              $(this).offset().top +
              $(this)[0].getBoundingClientRect().height / 2 -
              ($('#qtip').height() / 2) * scale -
              $('#wskflowContainer').offset().top
            qtipY /= scale
          }
          $('#qtip').css({
            left: qtipX,
            top: qtipY
          })
        }
      })
      .on('mouseout', function() {
        $('.link').removeClass('hover')
        $('#qtip').removeClass('visible')
      })
      .on('mousedown', () => {
        enterClickMode = true
      })
      .on('click', function(d) {
        if (!enterClickMode) return
        enterClickMode = false

        $('#qtip').removeClass('visible')
        if (d.onclick) {
          tab.REPL.click(d.onclick, d3.event)
        } else if (activations) {
          if (d.visited) {
            if ($('#actList').css('display') !== 'block') {
              $('#listClose').click()
            }

            // if(d.type == "Exit" || d.type == 'Entry'){
            if (d.type === 'Exit') {
              // console.log(fsm.States[d.id].act[0]);
              /* pictureInPicture(
                tab,
                activations[d.visited[0]],
                d3.event.currentTarget.parentNode, // highlight this node
                $('#wskflowContainer')[0],
                'App Visualization' // container to pip
              )(d3.event) */
              /* pictureInPicture(`wsk activation get ${id}`, {echo: true}),
                                            d3.event.currentTarget.parentNode, // highlight this node
                                            $("#wskflowContainer")[0],
                                            'App Visualization'          // container to pip
                                            )(d3.event)               // pass along the raw dom event
                                */
            } else if (d.type === 'action') {
              $('#qtip').removeClass('visible')

              if (d.visited.length === 1) {
                /* pictureInPicture(
                  tab,
                  activations[d.visited[0]],
                  d3.event.currentTarget.parentNode, // highlight this node
                  $('#wskflowContainer')[0],
                  'App Visualization' // container to pip
                )(d3.event) */
                // pass along the raw dom event
              } else {
                // let act = fsm.States[d.id].act;
                let actListContent = "<div style='padding-bottom:5px'>Click on an activation here to view details</div>"
                actListContent += `<div>${d.label}<break</break>${d.visited.length} activations, ordered by start time: </div>`
                actListContent += "<ol style='padding-left: 15px;'>"
                let date
                d.visited.forEach(n => {
                  // first part: time
                  const a = activations[n]
                  const start = new Date(a.start)
                  let timeString = ''
                  let lis = ''
                  if (date === undefined || date !== start.getMonth() + 1 + '/' + start.getDate()) {
                    date = start.getMonth() + 1 + '/' + start.getDate()
                    timeString += date + ' '
                  }

                  timeString += start.toLocaleTimeString(undefined, {
                    hour12: false
                  })

                  let duration = a.duration.toString()
                  let unit = 'ms'
                  if (a.duration > 1000) {
                    duration = (a.duration / 1000).toFixed(2)
                    unit = 's'
                  }
                  let c
                  if (a.response.success) {
                    c = wfColorAct.active
                  } else {
                    c = wfColorAct.failed
                  }

                  lis += `<span class='actItem' style='color:${c}; text-decoration:underline; cursor: pointer;' index=${n}>${timeString}</span> (${duration +
                    unit})<break></break>`

                  let result = a.response ? JSON.stringify(a.response.result) : ''
                  if (result.length > 40) {
                    result = result.substring(0, 40) + '... '
                  }
                  lis += result

                  actListContent += '<li>' + lis + '</li>'
                })

                actListContent += '</ol>'

                actListContent =
                  "<div id='listClose' style='font-size:14px; color:lightgrey; display:inline-block; float:right; cursor:pointer; padding-right:5px;'>✖</div>" +
                  actListContent

                $('#actList')
                  .html(actListContent)
                  .css('display', 'block')

                $('.actItem')
                  .hover(
                    function() {
                      $(this).css('text-decoration', 'none')
                    },
                    function() {
                      $(this).css('text-decoration', 'underline')
                    }
                  )
                  .click(function() {
                    // repl.exec(`wsk action get "${d.name}"`, {sidecarPrevious: 'get myApp', echo: true});
                    // const index = $(this).attr('index')
                    // pictureInPicture(`wsk activation get ${id}`, {echo: true}),
                    /* pictureInPicture(
                      tab,
                      activations[index],
                      $(this).parent()[0], // highlight this node
                      $('#wskflowContainer')[0],
                      'App Visualization' // container to pip
                    )(e) */
                    // pass along the raw dom event
                  })

                $('#listClose').click(function() {
                  $('#actList').css('display', 'none')
                  $('#' + d.id)
                    .children('rect')
                    .css('fill', wfColorAct.active)
                  $(this).css('fill', wfColorAct.activeHovered)
                })

                $('#qtip').removeClass('visible')
              }
            }
          }
        } else {
          if (d.type === 'action' && $('#' + d.id).attr('data-deployed') === 'deployed') {
            if (d.name) {
              // repl.exec(`wsk action get "${d.name}"`, {sidecarPrevious: 'get myApp', echo: true});
              tab.REPL.click(`wsk action get "${d.name}"`, d3.event)
            } else {
              debug(`clicking on an inline function: ${d.label}`)
            }
          }
        }
      })

    // add node labels
    const textElements = node
      .append('text')
      .attr('width', d => d.width)
      .attr('x', function(d) {
        // if(d.type == "try_catch" || d.type == "try" || d.type == "handler")
        if (d.children) {
          return composites.label.offset.x
        } else if (d.multiLineLabel) {
          return d.x
        } else {
          return d.width / 2
        }
      })
      .attr('y', function(d) {
        // if(d.type == "try_catch" || d.type == "try" || d.type == "handler")
        if (d.properties && d.properties.kind === 'trigger') {
          return d.height * 0.675
        }
        if (d.children) {
          return composites.label.offset.y
        } else if (d.multiLineLabel) {
          return (d.height - d.multiLineLabel.length * 6) / 2
        } else {
          return (
            d.height / 2 +
            (d.type === 'Entry' || d.type === 'Exit' ? 1.5 : d.type === 'Dummy' ? 1.5 : d.type === 'let' ? 3.5 : 2)
          )
        }
      })
      .attr('font-size', function(d) {
        if (d.children) {
          return composites.label.fontSize
        } else if (d.properties && d.properties.fontSize) {
          return d.properties.fontSize
        } else if (d.type === 'Entry' || d.type === 'Exit') {
          return '6px'
        } else {
          return defaultFontSize
        }
      })
      .style('text-anchor', function(d) {
        if (!d.children && !d.multiLineLabel) {
          return 'middle'
        }
      })
      .style('pointer-events', 'none')
      .attr('multi-line-label', d => d.multiLineLabel && d.multiLineLabel.join('\n'))
      .text(function(d) {
        if (d.type === 'retain' || (d.type === 'Dummy' && d.label === d.id)) {
          // the === checks for unlabeled Dummy nodes
          return ''
        } else if (d.id === 'root') {
          return ''
        } else if (d.type === 'try') {
          return 'Try'
        } else if (d.type === 'handler') {
          return 'Catch'
          // else if(d.type == "try_catch" || d.type === 'retry'){
        } else if (d.children) {
          // return "Try Catch";
          return d.label
          /* else if(d.type == "if"){
                                        return d.label;
                                }       */
        } else if (d.type === 'let' || d.type === 'literal') {
          const _ = '_'
          const maxLen = 5
          const rest = d.value.length > maxLen ? ['\u2026', _] : []

          if (typeof d.value === 'string') {
            return d.value.substring(0, 10) + (d.value.length > maxLen ? '\u2026' : '')
          } else if (Array.isArray(d.value)) {
            // render array literals
            const array = d.value
              .slice(0, maxLen - 1)
              .map(() => _)
              .concat(rest)
            return `[${array}]` // '\u2026' horizontal ellipsis
          } else {
            // render object literals
            const keys = Object.keys(d.value)
              .slice(0, maxLen)
              .concat(rest)
            return `{${keys}}`
          }
          /* if(d.label.length>30)
                                                return d.label.substring(0, 27)+"...";
                                        else
                                                return d.label; */
        } else if (d.type === 'action' || d.type === 'function') {
          return d.label
        } else {
          let t = d.label
          if (t === undefined) {
            t = d.id
          }

          if (t.length > maxLabelLength && d.type !== 'Dummy') {
            // let dummy nodes use longer labels
            return t.substring(0, maxLabelLength - 1) + '...'
          } else {
            return t
          }
        }
      })

    for (let idx = 0; idx < textElements[0].length; idx++) {
      const textElement = textElements[0][idx]
      const label = textElement.attributes && textElement.attributes.getNamedItem('multi-line-label')
      const width = textElement.attributes && textElement.attributes.getNamedItem('width')

      if (label) {
        const { maxLineLength } = textualPropertiesOfCode(label.value)
        const tabWidth = 2
        const farLeft = (width.value - maxLineLength * 3) / 2

        label.value.split(/\n/).forEach(line => {
          const ws = /^\s+/
          const wsMatch = line.match(ws)
          /* const length = line.length */
          const initialWhitespace = wsMatch ? wsMatch[0].length : 0

          d3.select(textElement)
            .append('tspan')
            .text(line.replace(ws, ''))
            .attr('x', farLeft + initialWhitespace * tabWidth)
            .attr('dy', '1.25em')
        })
      }
    }

    // #2 add paths with arrows for the edges
    root
      .selectAll('.link')
      .data(links, function(d) {
        return d.id
      })
      .enter()
      .append('path')
      .attr('id', function(d) {
        return d.id
      })
      .attr('d', 'M0 0')
      .attr('marker-end', function(d) {
        if (d.visited) {
          return 'url(#greenEnd)'
        } else if (d.source.indexOf('__origin') >= 0 && d.target.indexOf('__terminus') >= 0) {
          return 'url(#forwardingEnd)'
        } else {
          return 'url(#end)'
        }
      })
      .attr('class', function(d) {
        let s = 'link'
        if (d.source.indexOf('try_') === 0 && d.target.indexOf('handler_') === 0) {
          s += ' TryCatchEdge'
        }
        if (d.source.indexOf('__origin') >= 0 && d.target.indexOf('__terminus') >= 0) {
          s += ' forwardingLink has-hover-effect'
        }
        if (d.sourcePort && d.sourcePort.indexOf('_ptrue') !== -1) {
          s += ' true-branch'
        }
        if (d.sourcePort && d.sourcePort.indexOf('_pfalse') !== -1) {
          s += ' false-branch'
        }

        if (d.properties) {
          for (const key in d.properties) {
            s += ` ${key}`
          }
        }

        return s
      })
      .attr('data-visited', d => d.visited) // edge was visited?
      .attr('source', function(d) {
        return d.sourcePort
      })
      .on('mouseout', function() {
        $('#qtip').removeClass('visible')
      })
      .on('mouseover', function(edge) {
        if (edge.properties && edge.properties.type === 'retain') {
          // special handling of mouse hover events for retain edges
          // $(`#${edge.source}`).addClass('hover');
          // $(`#${edge.target}`).addClass('hover');

          const qtipText = `<span class='qtip-prefix ${edge.properties.type}' style='padding-right:5px; color: #85C1E9'>Retain |</span> Data forwarding edge</span>`
          $('#qtipContent').html(qtipText)
          $('#qtip').addClass('visible')

          const rect = $(this)[0].getBoundingClientRect()
          const qtipX = rect.left + rect.width
          const qtipY = rect.top + rect.height / 2 - $('#qtip').height() / 2
          $('#qtip').css({
            left: qtipX,
            top: qtipY
          })
        }
      })
      .attr('d', function(d) {
        let path = ''
        if (d.sourcePoint && d.targetPoint) {
          path += 'M' + d.sourcePoint.x + ' ' + d.sourcePoint.y + ' '
          ;(d.bendPoints || []).forEach(function(bp) {
            path += 'L' + bp.x + ' ' + bp.y + ' '
          })

          const isTryCatchEdge = d.target.endsWith('-handler')
          const isForwardingEdge = d.source.indexOf('__origin') >= 0 && d.target.indexOf('__terminus') >= 0
          const offsetY = isForwardingEdge || isTryCatchEdge ? 0 : 4.2 // arrowhead hacking

          const offsetX = isTryCatchEdge ? -4.2 : 0

          path += 'L' + (d.targetPoint.x + offsetX) + ' ' + (d.targetPoint.y - offsetY) + ' '
        }
        return path
      })

    const addMorePathAttr = () =>
      root
        .selectAll('path')
        .attr('data-from-name', function(d) {
          const fromId = d.source
          const isName = $('#' + fromId).attr('data-name')
          if (isName) {
            return isName
          }
        })
        .attr('data-to-name', function(d) {
          const toId = d.target
          const isName = $('#' + toId).attr('data-name')
          if (isName) {
            return isName
          }
        })

    // edge labels
    const addEdgeLabels = () =>
      links.forEach(edge => {
        if (edge.labels) {
          edge.labels.forEach(({ text }) => {
            d3.select('#' + edge.source)
              .append('text')
              .classed('edge-label', true)
              .attr('x', 10)
              .attr('y', 0)
              .text(text)
          })
        }
        if (
          edge.sourcePort &&
          (edge.sourcePort.indexOf('_ptrue') !== -1 || edge.sourcePort.indexOf('_pfalse') !== -1)
        ) {
          let t
          let d
          let x
          let y
          let reverse
          let cssClass

          if (edge.sourcePort.indexOf('_ptrue') !== -1) {
            // add a text label next to its
            t = 'Y'
            cssClass = 'true-branch'
          } else if (edge.sourcePort.indexOf('_pfalse') !== -1) {
            t = 'N'
            cssClass = 'false-branch'
          }

          if (t !== undefined) {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id === edge.source) {
                let tx
                let fx
                for (let j = 0; j < nodes[i].ports.length; j++) {
                  if (nodes[i].ports[j].id === edge.sourcePort) {
                    d = nodes[i].ports[j].properties.portSide
                    x = nodes[i].ports[j].x
                    y = nodes[i].ports[j].y
                    // break;
                  }
                  if (nodes[i].ports[j].id.indexOf('_ptrue') !== -1) {
                    tx = nodes[i].ports[j].x
                  }
                  if (nodes[i].ports[j].id.indexOf('_pfalse') !== -1) {
                    fx = nodes[i].ports[j].x
                  }
                }

                if (tx && fx) {
                  if (tx > fx) {
                    reverse = true
                  }
                }

                break
              }
            }
          }
          if (t !== undefined && d !== undefined) {
            // add label
            if (d === 'WEST') {
              x -= 7
              y -= 3
            } else if (d === 'EAST') {
              x += 7
              y -= 3
            } else if (d === 'NORTH') {
              y -= 7
              if (reverse) {
                if (t === 'N') {
                  x -= 7
                } else {
                  x += 3
                }
              } else {
                if (t === 'Y') {
                  x -= 7
                } else {
                  x += 3
                }
              }
            } else if (d === 'SOUTH') {
              y += 7
              if (reverse) {
                if (t === 'N') {
                  x -= 7
                } else {
                  x += 3
                }
              } else {
                if (t === 'Y') {
                  x -= 7
                } else {
                  x += 3
                }
              }
            }

            const target = $(`#${edge.target}`)
            const targetStatus = target && (target.attr('data-status') || 'not-run')
            const thisEdgeWasTraversed = targetStatus !== 'not-run'

            d3.select('#' + edge.source)
              .append('text')
              .classed('edge-label', true)
              .attr('x', x)
              .attr('y', y)
              .text(t)
              .classed('edge-was-traversed', thisEdgeWasTraversed)
              .classed(cssClass, true)
          }
        }
      })

    setTimeout(() => {
      d3.select('.repeat')
        .append('use')
        .attr('xlink:href', '#retryIconNormal')
        .attr('href', '#retryIconNormal')
        .attr('x', 10)
        .attr('y', -14)
    }, 0)

    setTimeout(addMorePathAttr, 100) // we aren't properly using d3.select.enter... hacking a bit, for now
    setTimeout(addEdgeLabels, 100)
  } /* drawGraph */

  const elk = new ELK()
  const doneRendering = elk
    .layout(JSONgraph, {
      layoutOptions: Object.assign(
        {
          'elk.algorithm': 'org.eclipse.elk.layered',
          'org.eclipse.elk.direction': 'DOWN',
          'org.eclipse.elk.edgeRouting': 'ORTHOGONAL',
          'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
          'elk.layered.spacing.nodeNodeBetweenLayers': 15, // org.eclipse. prefix doesn't work (elk bug???)
          // 'org.eclipse.elk.layered.cycleBreaking.strategy': "DEPTH_FIRST",
          'org.eclipse.elk.insideSelfLoops.activate': true
        },
        layoutOptions
      )
    })
    .then(data => {
      elkData = data

      // By default, the graph resizes to fit the size
      // of the container i.e. zoom-to-contain, showing
      // the entire graph. This renders larger graphs
      // with tiny nodes on initial load; this check
      // introduces a heuristic to avoid tiny nodes on
      // initial display. This solves #582.
      if (elkData.height > 800) {
        resizeToCover()
      } else {
        resizeToContain()
      }

      const getNodes = function(graph) {
        const queue = [graph]
        const nodes = []
        let parent
        // note that svg z-index is document order, literally
        while ((parent = queue.pop()) != null) {
          nodes.push(parent)
          ;(parent.children || []).forEach(function(c) {
            c.x += parent.x
            c.y += parent.y
            if (c.edges) {
              for (let i = 0; i < c.edges.length; i++) {
                c.edges[i].sections[0].startPoint.x += c.x
                c.edges[i].sections[0].startPoint.y += c.y
                c.edges[i].sections[0].endPoint.x += c.x
                c.edges[i].sections[0].endPoint.y += c.y

                if (c.edges[i].sections[0].bendPoints) {
                  for (let j = 0; j < c.edges[i].sections[0].bendPoints.length; j++) {
                    c.edges[i].sections[0].bendPoints[j].x += c.x
                    c.edges[i].sections[0].bendPoints[j].y += c.y
                  }
                }
              }
            }

            queue.push(c)
          })
        }
        return nodes
      }

      const getLinks = function(nodes) {
        return d3.merge(
          nodes.map(function(n) {
            return n.edges || []
          })
        )
      }
      const nodes = getNodes(data)
      const links = getLinks(nodes)
      const edges = []
      links.forEach(link => {
        // convert new elk edge format into old klay edge format to work with the d3 drawing code
        // TODO: update the d3 drawing code to work with the elk edge format
        // new format doc: http://www.eclipse.org/elk/documentation/tooldevelopers/graphdatastructure/jsonformat.html
        const o = {
          id: link.id,
          labels: link.labels,
          visited: link.visited,
          source: link.source,
          sourcePort: link.sourcePort,
          target: link.target,
          targetPort: link.targetPort,
          sourcePoint: {
            x: link.sections[0].startPoint.x,
            y: link.sections[0].startPoint.y
          },
          targetPoint: {
            x: link.sections[0].endPoint.x,
            y: link.sections[0].endPoint.y
          },
          properties: link.properties,
          bendPoints: []
        }

        if (link.sections[0].bendPoints) {
          link.sections[0].bendPoints.forEach(bp => o.bendPoints.push(bp))
        }

        edges.push(o)
      })

      // console.log(nodes);
      // console.log(links);
      // console.log(edges);
      drawGraph(nodes, edges)
    })
    .catch(err => {
      console.error('[wskflow] error: ', err)
    }) /* end of doneRendering */

  // any interested parties for zoom events
  // and notify interested parties that we entered custom mode
  const handlers = []
  const notify = () => handlers.forEach(_ => _({ applyAutoScale, customZoom }))

  /**
   * Zoom-to-fit button behavior
   *
   * @param useThisValue set a value, otherwise toggle the current value
   *
   */
  const zoomToFit = useThisValue => {
    applyAutoScale = useThisValue !== undefined ? useThisValue : !applyAutoScale // toggle applyAutoScale
    customZoom = false
    notify()
    if (applyAutoScale) {
      // when clicking to switch from inactive to active, it resizes the graph to fit the window. #422
      resizeToContain()
    } else {
      // when clicking to switch from active to inactive, it resizes the graph to zoom in at graph entry by 2x.
      resizeToCover()
    }
  }

  /*
   * from https://github.com/OpenKieler/klayjs-d3/blob/master/examples/interactive/index.js
   *
   * redraw is called by d3. d3.event.translate and
   * d3.event.scale handle moving the graph and zooming. Note
   * that when zooming, both event.translate and event.scale
   * change to let the zoom center be the mouse cursor. Adding
   * ohter values to event.translate and event.scale is likely
   * to cause unwanted behaviors.
   */
  function redraw() {
    // redraw is called when there's mouse scrolling
    if (applyAutoScale || !customZoom) {
      // exit zoom-to-fit mode when the user uses the mouse to move or zoom the graph
      applyAutoScale = false
      customZoom = true
      notify()
    }
    enterClickMode = false
    container.attr(
      'transform',
      `matrix(${d3.event.scale}, 0, 0, ${d3.event.scale}, ${d3.event.translate[0]}, ${d3.event.translate[1]})`
    )
    $('#qtip').removeClass('visible')
  }

  // when zoom-to-fit is active, the graph resizes as the window resizes. #422
  $(window)
    .unbind('resize')
    .resize(() => {
      if (customZoom && $('#wskflowSVG').attr('viewBox') !== undefined) {
        // this code is called when the user is in custom zoom mode but the viewbox still exists
        // remove viewbox here to stop auto-resizing,
        $('#wskflowSVG').removeAttr('viewBox')
        // adjust transform to let the graph be in the same size and location
        const width = $('#wskflowSVG').width()
        const height = $('#wskflowSVG').height()
        const scale = Math.min(width / elkData.width, height / elkData.height)
        const initScale = scale * zoom.scale()
        const initTransX = width / 2 - (elkData.width * scale) / 2 + zoom.translate()[0] * scale
        const initTransY = height / 2 - (elkData.height * scale) / 2 + zoom.translate()[1] * scale
        zoom.translate([initTransX, initTransY])
        zoom.scale(initScale)
        container.attr('transform', `matrix(${initScale}, 0, 0, ${initScale}, ${initTransX}, ${initTransY})`)
      }
    })

  // exported API
  return doneRendering.then(() => ({
    view: $(containerElement)[0],
    controller: {
      register: callback => handlers.push(callback),
      zoomToFit: () => zoomToFit(true),
      zoom1to1: () => zoomToFit(false),
      is1to1: () => !applyAutoScale
    }
  }))
}
