/*
 * Copyright 2018 IBM Corporation
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

const composer = require('@wdpdist/composer')
const http = require('@wdpdist/composer/plugins/http')
const Cloudant = require('@wdpdist/composer/plugins/cloudant')

/** some shorthands */
const { map: Map, seq: Seq, function: Function } = composer

const dbname = 'twc-flu'

function fmtRpt (x) {
  function getColor (x) {
    const map = {
      'No Report': 'white',
      'No Activity': 'green',
      'Sporadic': 'yellow',
      'Local Activity': 'orange',
      'Regional': 'red',
      'Widespread': 'purple'
    }
    return map[x]
  }

  function pad (n, width, z) {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
  }

  const dt = new Date(x.dt)
  dt.setHours(12)
  const dts = dt.toISOString()
  const m = pad(dt.getMonth() + 1, 2)
  const d = pad(dt.getDate(), 2)
  const y = dt.getFullYear()
  const h = pad(dt.getHours(), 2)
  const M = pad(dt.getMinutes(), 2)
  const s = pad(dt.getSeconds(), 2)
  return {
    meta: {
      state: x.state,
      date: parseInt('' + y + m + d)
    },
    rec: {
      FUHdr: {
        FUstCd: x.state,
        FUprsntNm: x.state,
        procTm: parseInt('' + y + m + d + h + M + s),
        procTmISO: dts
      },
      FUData: {
        FUoutBrkCd: getColor(x.color),
        FUdt: '' + m + d + y + h + M + s,
        meaning: x.color,
        FUdtISO: dts
      }
    }
  }
}

/**
 * Process one timeperiod
 *
 */
function parseRpt (x) {
  const dt = x.$.subtitle.match(/Week Ending (.*)- Week .*/)[1]

  return { value: x.state.map(s => (
    {
      year: x.$.year,
      week: x.$.week,
      dt: Date.parse(dt),
      color: s.color,
      state: s.abbrev
    }))
  }
}

/* const logger = composer.action('logger', {
  action: x => {
    return x
  }
}) */

const injectAuth = composer.sequence(
  composer.merge('cloudantnosqldbcredentials/echo', ({ auth }) => auth),
  x => Object.assign(x, ({ auth: Buffer.from(`${x.username}:${x.password}`).toString('base64'), db: x.dbname || x.db || 'twc-flu' }))
)

module.exports = Seq(
  // ingest and parse xml reports into JSON
  http.get({ url: 'https://www.cdc.gov/flu/weekly/flureport.xml' }),
  'xml2json/convert',

  // process each timeperiod in parallel
  x => ({ value: x.flureport.timeperiod.slice(0, 5) }),
  Map(Seq(
    Function(parseRpt), // eslint-disable-line

    // format and store each US state in parallel
    Map(Seq(
      Function(fmtRpt), // eslint-disable-line

      x => ({ key: x.meta.date + '-' + x.meta.state, value: x.rec }),

      injectAuth,
      // logger,

      Cloudant.upsert({ dbname })
    ))
  ))
)
