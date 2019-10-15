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

import Errors from '@kui-shell/core/api/errors'

/**
 * Some of the kubectl doc strings try to be polite have form
 * sentences with a trailing period. In a visual form, as long as it
 * is a single sentence, this is less necessary.
 *
 */
const removeSolitaryAndTrailingPeriod = (str: string) => str.replace(/^\s*([^.]+)[.]\s*$/, '$1').trim()

/**
 * Pretty-print the kubectl help output
 *
 * @param command e.g. helm versus kubectl
 * @param verb e.g. list versus get
 *
 */
export const renderHelp = (out: string, command: string, verb: string, exitCode: number) => {
  // kube and helm help often have a `Use "this command" to do that operation`
  // let's pick those off and place them into the detailedExample model
  const splitOutUse = out.match(/((Use[^\n]+\n)+)$/)
  const nonUseOut = !splitOutUse ? out : out.substring(0, splitOutUse.index) // having stripped off the Use parts
  const usePart = splitOutUse && splitOutUse[1].split(/\n/) // the Use parts, if any

  const rawSections = nonUseOut.split(/\n([^'\s].*:)\n/) // the non-use sections of the docs
  const header = rawSections[0] // the first section is the top-level doc string

  // form the detailedExample model from the use part we stripped out
  const detailedExampleFromUsePart =
    usePart &&
    usePart
      .filter(x => x)
      .map(line => {
        const [, command, docs] = line.split(/^Use "([^"]+)"\s+(.*)\s*$/)
        return { command, docs }
      })

  // for the remaining sections, form a [{ title, content }] model
  const _allSections: Section[] = rawSections.slice(1).reduce((S, _, idx, sections) => {
    if (idx % 2 === 0) {
      S.push({
        title: sections[idx],
        content: sections[idx + 1].replace(/^\n/, '')
      })
    }

    return S
  }, [])

  interface Section {
    title: string
    content: string
  }
  const allSections: Section[] = [_allSections[0]].concat(
    _allSections.slice(1).sort((a, b) => -a.title.localeCompare(b.title))
  )

  // sometimes, the first section is extra intro docs; sometimes it
  // is a legitimate command/usage section
  // const firstSectionIsCommandLike = /command/i.test(allSections[0].title) && !/to begin/i.test(allSections[0].title)
  const intro = undefined // !firstSectionIsCommandLike && allSections[0]

  // pull off the Usage section and place it into our usage model
  const usageSection = allSections.filter(({ title }) => title === 'Usage:')

  // pull off the Examples section
  const examplesSection = allSections.find(({ title }) => title === 'Examples:')

  const remainingSections = allSections
    // .slice(firstSectionIsCommandLike ? 0 : 1)
    .filter(({ title }) => title !== 'Usage:' && title !== 'Examples:')

  const sections = remainingSections.map(({ title, content }) => {
    return {
      title,
      nRowsInViewport: title.match(/Available Commands/i) ? 8 : undefined,
      rows: content
        .split(/[\n\r]/)
        .filter(x => x)
        .map(line => line.split(/(\t|(\s\s)+\s?)|(?=:\s)/).filter(x => x && !/(\t|\s\s)/.test(x)))
        .map(([thisCommand, docs]) => {
          if (thisCommand) {
            return {
              command: thisCommand.replace(/^\s*-\s+/, '').replace(/:\s*$/, ''),
              docs: docs && docs.replace(/^\s*:\s*/, ''),
              commandPrefix: /Commands/i.test(title) && `${command} ${verb || ''}`,
              noclick: !title.match(/Common actions/i) && !title.match(/Commands/i)
            }
          }
        })
        .filter(x => x)
    }
  })

  const detailedExample = (detailedExampleFromUsePart || []).concat(
    (examplesSection ? examplesSection.content : '')
      .split(/^\s*(?:#\s+)/gm)
      .map(x => x.trim())
      .filter(x => x)
      .map(group => {
        //
        // Explanation: compare `kubectl completion -h` to `kubectl get -h`
        // The former Examples section has a structure of (Summary, MultiLineDetail)
        // while the latter is shaped like (DescriptionLine, CommandLine).
        //
        // The lack of symmetry is a bit odd (detail/description
        // is second versus first), but understandable, given
        // that the former's Detail takes up multiple lines
        // whereas the latter has a pair of lines. Let's
        // introduce some symmetry here.
        //
        const match = group.match(/(.*)[\n\r]([\s\S]+)/)
        if (match && match.length === 3) {
          const [, firstPartFull, secondPartFull] = match

          const firstPart = removeSolitaryAndTrailingPeriod(firstPartFull)
          const secondPart = removeSolitaryAndTrailingPeriod(secondPartFull)

          const secondPartIsMultiLine = secondPart.split(/[\n\r]/).length > 1

          const command = secondPartIsMultiLine ? firstPart : secondPart
          const docs = secondPartIsMultiLine ? secondPart : firstPart

          return {
            command,
            docs
          }
        } else {
          // see kubectl label -h for an example of a multi-line "firstPart"
          return {
            copyToNextLine: group
          }
        }
      })
      .reduce((lines, lineRecord, idx, A) => {
        for (let jdx = idx - 1; jdx >= 0; jdx--) {
          if (A[jdx].copyToNextLine) {
            lineRecord.docs = `${A[jdx].copyToNextLine}\n${lineRecord.docs}`
          } else {
            break
          }
        }

        if (!lineRecord.copyToNextLine) {
          lines.push(lineRecord)
        }
        return lines
      }, [])
      .filter(x => x)
  )

  return new Errors.UsageError({
    exitCode,
    usage: {
      commandPrefix: command, // for onclick handlers, e.g. when clicking on "get", we want to exec "kubectl get"
      commandSuffix: '-h', // we really want "kubectl get -h"
      breadcrumb: verb || command,
      parents: verb ? [command] : [],
      header,
      intro,
      sections,
      detailedExample,
      example: usageSection && usageSection[0] && usageSection[0].content.replace(/\s+$/, '')
    }
  })
}
