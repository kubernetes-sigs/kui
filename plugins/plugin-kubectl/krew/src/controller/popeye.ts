/*
 * Copyright 2020 IBM Corporation
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

import { Arguments, Row } from '@kui-shell/core'

import { doHelp, isUsage, getNamespace, getKind, doExecWithStdout } from '@kui-shell/plugin-kubectl'

interface PopeyeReport {
  score: number
  grade: string
  sanitizers: Sanitizer[]
}

interface Sanitizer {
  sanitizer: string
  tally: {
    ok: number
    info: number
    warning: number
    error: number
    score: number
  }
  issues: Record<string, Issue[]>
}

interface Issue {
  group: string
  level: number
  message: string
}

function bodyToHeader(body: Row[]) {
  if (body.length > 0) {
    return {
      key: body[0].key,
      name: body[0].key,
      attributes: body[0].attributes.map(({ key }) => ({ key, value: key }))
    }
  }
}

function formatIssueRow(group: string, message: string, level: number) {
  return {
    key: 'Group',
    name: group,
    attributes: [
      {
        key: 'Message',
        value: message,
        tag: 'badge',
        css: level === 3 ? 'red-background' : level === 2 ? 'yellow-background' : 'green-background'
      }
    ]
  }
}

function formatSectionRow(
  displayName: string,
  resourceName: string,
  command: string,
  sanitizer: string,
  maxLevel: number,
  ns: string
) {
  return {
    key: 'Name',
    name: displayName, // e.g. split out the namespace in resourceName
    onclick: `${command} popeye -s ${sanitizer} ${resourceName} -n ${ns}`,
    attributes: [
      {
        key: 'Max Level',
        value: maxLevel.toString(),
        tag: 'badge',
        css: maxLevel === 3 ? 'red-background' : maxLevel === 2 ? 'yellow-background' : 'green-background'
      }
    ]
  }
}

export default (command: string) => async (args: Arguments) => {
  if (isUsage(args)) {
    return doHelp(command, args)
  } else {
    const userAskForSection = (args.parsedOptions['s'] || args.parsedOptions['sections']) as string
    let userAskResourceName

    /**
     * override the popeye command to force json output
     * , and add support for fetching report by resource name
     *
     */
    const prepareArgsForPopeye = (args: Arguments) => {
      userAskResourceName = userAskForSection && args.argvNoOptions[args.argvNoOptions.indexOf('popeye') + 1]

      /** popeye doesn't support showing report for a single resource name
       * e.g. popeye -s pod nginx
       * so we fetch the report of pod and filter the result
       *
       */
      return userAskResourceName
        ? `${args.command.replace(userAskResourceName, '')} -o json`
        : `${args.command} -o json`
    }

    const stdout = await doExecWithStdout(args, prepareArgsForPopeye, command)
    const fullReport = JSON.parse(stdout).popeye as PopeyeReport
    // console.error('fullReport', fullReport)
    const ns = await getNamespace(args)

    const formatTable = (body: Row[], title: string, footer?: string[]) => {
      return {
        header: bodyToHeader(body),
        body,
        statusColumnIdx: 1,
        breadcrumbs: [{ label: 'Popeye' }, { label: ns }],
        title,
        footer
      }
    }

    /**
     * full report issued by command kubectl popeye
     *
     */
    const fullReportTable = () => {
      const body = fullReport.sanitizers.map(({ sanitizer, tally }) => {
        return {
          key: 'Name',
          name: sanitizer,
          onclick: `${command} popeye -s ${sanitizer} -n ${ns}`,
          attributes: [
            {
              key: 'Score',
              value: tally.score.toString(),
              tag: 'badge',
              css: tally.score === 100 ? 'green-background' : 'red-background'
            },
            { key: 'Error', value: tally.error.toString() },
            { key: 'Warning', value: tally.warning.toString() },
            { key: 'Info', value: tally.info.toString() },
            { key: 'Ok', value: tally.ok.toString() }
          ]
        }
      })

      return formatTable(body, 'All resources', [`Overall score: ${fullReport.score} ${fullReport.grade}`])
    }

    /**
     * section report issued by command e.g. kubectl popeye -s pod
     *
     */
    const sectionTable = async () => {
      const body = []
      fullReport.sanitizers.forEach(({ issues, sanitizer }) => {
        if (issues) {
          Object.entries(issues).forEach(([resourceName, issueList]) => {
            if (resourceName) {
              let maxLevel = 0
              issueList.forEach(({ level }) => (maxLevel = level > maxLevel ? level : maxLevel))
              body.push(formatSectionRow(resourceName.split(/\//)[1], resourceName, command, sanitizer, maxLevel, ns))
            } else {
              issueList.forEach(_ => body.push(formatIssueRow(_.group, _.message, _.level)))
            }
          })
        }
      })

      return formatTable(body, await getKind(command, args, userAskForSection), [
        `Overall score: ${fullReport.score} ${fullReport.grade}`
      ])
    }

    /**
     * all issues in e.g. pod nginx
     *
     */
    const resourceNameTable = () => {
      const body = fullReport.sanitizers[0].issues[userAskResourceName].map(({ group, level, message }) =>
        formatIssueRow(group, message, level)
      )
      return formatTable(body, userAskResourceName.split(/\//)[1])
    }

    if (userAskResourceName) {
      return resourceNameTable()
    } else if (userAskForSection) {
      return sectionTable()
    } else {
      return fullReportTable()
    }
  }
}
