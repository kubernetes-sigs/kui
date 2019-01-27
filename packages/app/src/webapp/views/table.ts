/*
 * Copyright 2017-18 IBM Corporation
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
const debug = Debug('webapp/views/table')

import { pexec, qexec } from '../../core/repl'

/**
 * Format one row in the table
 *
 */
export const formatOneListResult = (options?) => (entity, idx, A) => {
  const dom = document.createElement('div')
  dom.className = `entity ${entity.prettyType || ''} ${entity.type}`
  dom.setAttribute('data-name', entity.name)

  // row selection
  entity.setSelected = () => {
    const currentSelection = dom.parentNode.querySelector('.selected-row') as HTMLElement
    if (currentSelection) {
      currentSelection.classList.remove('selected-row')
    }
    dom.querySelector('.row-selection-context').classList.add('selected-row')
  }
  entity.setUnselected = () => {
    dom.querySelector('.row-selection-context').classList.remove('selected-row')
  }

  if (entity.packageName) {
    dom.setAttribute('data-package-name', entity.packageName)
  }

  const entityName = document.createElement('div')
  entityName.className = 'entity-attributes row-selection-context'
  dom.appendChild(entityName)

  if (entity.rowCSS) {
    if (Array.isArray(entity.rowCSS)) {
      entity.rowCSS.forEach(_ => _ && entityName.classList.add(_))
    } else {
      entityName.classList.add(entity.rowCSS)
    }
  }

  /** add a cell to the current row of the list view we] are generating. "entityName" is the current row */
  const addCell = (className, value, innerClassName = '', parent = entityName, onclick?, watch?, key?, fontawesome?, css?, watchLimit = 120, tag = 'span') => {
    const cell = document.createElement('span')
    const inner = document.createElement(tag)

    cell.className = className
    inner.className = innerClassName
    inner.classList.add('cell-inner')

    if (key) {
      inner.setAttribute('data-key', key)
    }

    if (css) {
      inner.classList.add(css)
    }

    if (fontawesome) {
      const icon = document.createElement('i')
      inner.appendChild(icon)
      icon.className = fontawesome
      icon.classList.add('cell-inner')
      inner.setAttribute('data-value', value) // in case tests need the actual value, not the icon
    } else if (Array.isArray(value) && value[0] && value[0].nodeName) {
      // array of dom elements
      const container = value.reduce((container, node) => {
        container.appendChild(node)
        return container
      }, document.createElement('div'))

      inner.appendChild(container)
    } else if (value) {
      Promise.resolve(value)
            .then(value => inner.appendChild(value.nodeName ? value : document.createTextNode(value.toString())))
    } else {
      console.error('Invalid cell model, no value field')
    }
    cell.appendChild(inner)
    parent.appendChild(cell)

    if (cell.classList.contains('header-cell')) {
      parent.classList.add('header-row');
      (parent.parentNode as HTMLElement).classList.add('header-row')
    }

    if (onclick) {
      cell.classList.add('clickable')
      cell.onclick = evt => {
        evt.stopPropagation() // don't trickle up to the row click handler
        onclick(evt)
      }
    }

    if (watch) {
      const pulse = 'repeating-pulse'
      cell.classList.add(pulse)

      // we'll ping the watcher at most watchLimit times
      let count = watchLimit

      const stopWatching = interval => {
        clearInterval(interval)
        cell.classList.remove(pulse)
      }

      const interval = setInterval(() => {
        if (--count < 0) {
          debug('watchLimit exceeded', value)
          stopWatching(interval)
          return
        }

        try {
          Promise.resolve(watch(watchLimit - count - 1))
            .then(({ value, done = false, css, onclick, others = [], unchanged = false, outerCSS }) => {
              if (unchanged) {
                // nothing to do, yet
                return
              }

              // debug('watch update', done)

              // are we done polling for updates?
              if (!value || done) {
                stopWatching(interval)
              }

              // update onclick
              if (onclick) {
                // debug('updating onclick')
                dom.onclick = entityNameClickable.onclick = onclick
                entityNameClickable.classList.add('clickable')
              }

              // update the styling
              if (css) {
                inner.className = css
              }

              // update the outer styling i.e. of the table cell
              if (outerCSS !== undefined && outerCSS !== false) {
                const isPulsing = cell.classList.contains(pulse)
                cell.className = outerCSS
                if (isPulsing) {
                  cell.classList.add(pulse)
                }
              }

              // update the text
              if (value) {
                inner.innerText = ''
                inner.appendChild(value.nodeName ? value : document.createTextNode(value.toString()))
              }

              // any other cells to update?
              others.forEach(({ key, value }) => {
                const otherInner = parent.querySelector(`.cell-inner[data-key="${key}"]`) as HTMLElement
                if (otherInner) {
                  otherInner.innerText = ''
                  otherInner.appendChild(value.nodeName ? value : document.createTextNode(value.toString()))
                }
              })
            })
        } catch (err) {
          console.error('Error watching value', err)
          clearInterval(interval)
          cell.classList.remove(pulse)
        }
      }, 1000 + ~~(1000 * Math.random()))
    }

    return cell
  }

  // add any attributes that should appear *before* the name column
  if (entity.beforeAttributes) {
    entity.beforeAttributes.forEach(({ key, value, css = '', outerCSS = '', onclick, fontawesome }) => addCell(outerCSS, value, css, undefined, onclick, undefined, key, fontawesome))
  }

  // now add the clickable name
  const entityNameGroup = document.createElement('span')
  entityNameGroup.className = `entity-name-group ${entity.outerCSS}`
  if (entityNameGroup.classList.contains('header-cell')) {
    entityName.classList.add('header-row');
    (entityName.parentNode as HTMLElement).classList.add('header-row')
  }
  if ((!options || !options.excludePackageName) && entity.packageName) {
    const packagePrefix = document.createElement('span')
    packagePrefix.className = 'package-prefix'
    packagePrefix.innerText = entity.packageName + '/'
    entityNameGroup.appendChild(packagePrefix)
  }
  const entityNameClickable = document.createElement('span')
  entityNameClickable.className = 'entity-name'
  if (!entityNameGroup.classList.contains('header-cell')) {
    entityNameClickable.classList.add('clickable')
  }
  if (entity.nameCss) {
    if (Array.isArray(entity.nameCss)) {
      entity.nameCss.forEach(_ => entityNameClickable.classList.add(_))
    } else {
      entityNameClickable.classList.add(entity.nameCss)
    }
  }
  entityNameGroup.appendChild(entityNameClickable)
  entityName.appendChild(entityNameGroup)

  if (entity.key) {
    entityNameClickable.setAttribute('data-key', entity.key)
  }

  // name of the entity
  let name = entity.prettyName || entity.name

  // click handler for the list result
  if (entity.fontawesome) {
    const icon = document.createElement('i')
    entityNameClickable.appendChild(icon)
    icon.className = entity.fontawesome
    icon.classList.add('cell-inner')
  } else if (typeof name === 'string') {
    entityNameClickable.innerText = name
  } else {
    entityNameClickable.appendChild(name)
  }

  entityNameClickable.setAttribute('data-value', name) // in case tests need the actual value, not the icon
  if (entity.fullName) {
    entityNameClickable.setAttribute('title', entity.fullName)
  }

  if (entity.css) {
    if (Array.isArray(entity.css)) {
      entity.css.forEach(_ => entityNameClickable.classList.add(_))
    } else {
      entityNameClickable.classList.add(entity.css)
    }
  }

  if (entity.onclick === false) {
    // the provider has told us the entity name is not clickable
    entityNameClickable.classList.remove('clickable')
  } else if (typeof entity.onclick === 'string') {
    entityNameClickable.onclick = () => pexec(entity.onclick)
  } else {
    entityNameClickable.onclick = entity.onclick
  }

  //
  // case-specific cells
  //
  if (entity.attributes) {
    // the entity provider wants to take complete control
    entity.attributes.forEach(({ key, value, css = '', outerCSS = '', watch, watchLimit, onclick, fontawesome, tag }) => {
      addCell(outerCSS, value, css, undefined, onclick, watch, key, fontawesome, undefined, watchLimit, tag)
    })
  } else {
    // otherwise, we have some generic attribute handlers, here
    const addKind = () => {
      if (entity.kind || entity.prettyKind) {
        addCell('entity-kind green-text',
                entity.prettyKind || entity.kind,
                'deemphasize deemphasize-partial')
      }
    }
    const addStatus = () => {
      if (entity.status) {
        const cell = addCell(`entity-rule-status`,
                             entity.status,
                             'deemphasize deemphasize-partial')

        Promise.resolve(entity.status).then(status => {
          cell.classList.add(status === 'active' ? 'green-text' : 'red-text')
        })
      }
    }
    const addVersion = () => {
      if (entity.version || entity.prettyVersion) {
        addCell('entity-version hide-with-sidecar',
                entity.prettyVersion || entity.version,
                'deemphasize')
      }
    }

    addKind()
    addStatus()
    addVersion()
  }

  return dom
}

/**
 * Format a tabular view
 *
 */
export const formatListResult = response => {
  debug('formatListResult', response)

  // sort the list, then format each element, then add the results to the resultDom
  // (don't sort lists of activations. i wish there were a better way to do this)
  const sort = () => {
    if (response[0] && response[0].noSort) {
      return response
    } else {
      return response.sort((a, b) =>
        (a.prettyType || a.type).localeCompare(b.prettyType || b.type) ||
        (a.packageName || '').localeCompare(b.packageName || '') ||
        a.name.localeCompare(b.name))
    }
  }

  return sort().map(formatOneListResult())
}

/**
 * Format a table of tables view
 *
 */
export const formatMultiListResult = (response, resultDom) => {
  debug('formatMultiListResult', response)

  response.filter(x => x.length > 0).forEach(async (table, idx, tables) => {
    const tableDom = document.createElement('div')
    tableDom.classList.add('result-table')

    let container
    if (table[0].title) {
      const tableOuterWrapper = document.createElement('div')
      const tableOuter = document.createElement('div')
      const titleOuter = document.createElement('div')
      const titleInner = document.createElement('div')

      tableOuterWrapper.classList.add('result-table-outer-wrapper')
      if (tables.length > 1) {
        tableOuterWrapper.classList.add('row-selection-context')
      }

      tableOuter.appendChild(titleOuter)
      titleOuter.appendChild(titleInner)
      tableOuterWrapper.appendChild(tableOuter)
      resultDom.appendChild(tableOuterWrapper)

      if (table[0].flexWrap) {
        const tableScroll = document.createElement('div')
        tableScroll.classList.add('scrollable-auto')
        tableScroll.setAttribute('data-table-max-rows', typeof table[0].flexWrap === 'number' ? table[0].flexWrap : 4)
        tableScroll.appendChild(tableDom)
        tableOuter.appendChild(tableScroll)
      } else {
        tableOuter.appendChild(tableDom)
      }

      tableOuter.classList.add('result-table-outer')
      titleOuter.classList.add('result-table-title-outer')
      titleInner.classList.add('result-table-title')
      titleInner.innerText = table[0].title

      if (table[0].tableCSS) {
        tableOuterWrapper.classList.add(table[0].tableCSS)
      }

      if (table[0].fontawesome) {
        const awesomeWrapper = document.createElement('div')
        const awesome = document.createElement('i')
        awesomeWrapper.appendChild(awesome)
        titleOuter.appendChild(awesomeWrapper)

        awesome.className = table[0].fontawesome

        if (table[0].fontawesomeCSS) {
          awesomeWrapper.classList.add(table[0].fontawesomeCSS)
          delete table[0].fontawesomeCSS
        }

        if (table[0].fontawesomeBalloon) {
          awesomeWrapper.setAttribute('data-balloon', table[0].fontawesomeBalloon)
          awesomeWrapper.setAttribute('data-balloon-pos', 'left')
          delete table[0].fontawesomeBalloon
        }

        // otherwise, the header row renderer will pick this up
        delete table[0].fontawesome
      }

      container = tableOuterWrapper
    } else {
      resultDom.appendChild(tableDom)
      container = tableDom
    }

    container.classList.add('big-top-pad')

    // render(table, { echo: false, resultDom: tableDom })
    const rows = await formatListResult(table)
    rows.map(row => tableDom.appendChild(row))

    const rowSelection = tableDom.querySelector('.selected-row')
    if (rowSelection) {
      tableDom.classList.add('has-row-selection')
    }
  })
}
