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

const debug = require('debug')('k8s/util/help')

import UsageError from '@kui/core/usage-error'

/**
 * Pretty-print the kubectl help output
 *
 * @param command e.g. helm versus kubectl
 * @param verb e.g. list versus get
 * @param entityType? e.g. crd
 */
export const renderHelp = (out: string, command: string, verb: string, entityType?: string) => {
  debug('renderHelp')

  // kube and helm help often have a `Use "this command" to do that operation`
  // let's pick those off and place them into the detailedExample model
  const splitOutUse = out.match(/((Use[^\n]+\n)+)$/)
  const nonUseOut = !splitOutUse ? out : out.substring(0, splitOutUse.index) // having stripped off the Use parts
  const usePart = splitOutUse && splitOutUse[1].split(/\n/) // the Use parts, if any

  const rawSections = nonUseOut.split(/\n([^'\s].*:)\n/) // the non-use sections of the docs
  const header = rawSections[0] // the first section is the top-level doc string

  // form the detailedExample model from the use part we stripped out
  const detailedExample = usePart && usePart.filter(x => x).map(line => {
    const [ _, command, docs ] = line.split(/^Use "([^"]+)"\s+(.*)\s*$/)
    return { command, docs }
  })

  // for the remaining sections, form a [{ title, content }] model
  const _allSections = rawSections.slice(1).reduce((S, _, idx, sections) => {
    if (idx % 2 === 0) {
      S.push({
        title: sections[idx],
        content: sections[idx + 1].replace(/^\n/, '')
      })
    }

    return S
  }, [])
  const allSections = [_allSections[0]].concat(_allSections.slice(1).sort((a, b) => -a.title.localeCompare(b.title)))

  // sometimes, the first section is extra intro docs; sometimes it
  // is a legitimate command/usage section
  const firstSectionIsCommandLike = allSections[0].title.match(/command/i) && !allSections[0].title.match(/to begin/i)
  const intro = !firstSectionIsCommandLike && allSections[0]

  // pull off the Usage section and place it into our usage model
  const usageSection = allSections.filter(({ title }) => title === 'Usage:')

  const sections = allSections
    .slice(firstSectionIsCommandLike ? 0 : 1)
    .filter(({ title }) => title !== 'Usage:')
    .map(({ title, content }) => ({
      title,
      nRowsInViewport: title.match(/Available Commands/i) ? 8 : undefined,
      rows: content
        .split(/\n/)
        .filter(x => x)
        .map(line => line.split(/(\t|(\s\s)+\s?)|(?=:\s)/)
             .filter(x => x && !x.match(/(\t|\s\s)/)))
        .map(([ thisCommand, docs ]) => ({
          command: thisCommand
            .replace(/^\s*-\s+/, '')
            .replace(/:\s*$/, ''),
          docs: docs && docs.replace(/^\s*:\s*/, ''),
          commandPrefix: title.match(/Available Commands/i) && command,
          noclick: !title.match(/Common actions/i) &&
            !title.match(/Available Commands/i)
        }))
    }))

  return new UsageError({
    breadcrumb: verb || command,
    parents: verb ? [command] : [],
    header,
    intro,
    sections,
    detailedExample,
    example: usageSection && usageSection[0] && usageSection[0].content.replace(/\s+$/, '')
  })

  /*const outer = document.createElement('div');
    outer.className = 'usage-error-wrapper';

    const dom = document.createElement('div');
    dom.className = 'hideable'; // hideable: to work with the usage error styling
    dom.style.whiteSpace = 'normal';
    outer.appendChild(dom);

    const title = document.createElement('h1');
    title.className = 'bx--breadcrumb bx--breadcrumb--no-trailing-slash';
    dom.appendChild(title);
    const commandCrumb = document.createElement('span');
    commandCrumb.className = 'bx--breadcrumb-item capitalize';
    const commandCrumbLink = document.createElement('span');
    commandCrumbLink.className = 'bx--no-link bx--link';
    commandCrumbLink.innerText = command;
    const commandCrumbLinkSlash = document.createElement('span');
    commandCrumbLinkSlash.className = 'bx--breadcrumb-item--slash';
    commandCrumbLinkSlash.innerText = '/';
    commandCrumb.appendChild(commandCrumbLink);
    commandCrumb.appendChild(commandCrumbLinkSlash);
    title.appendChild(commandCrumb);
    if (verb) {
    const verbCrumb = document.createElement('div');
    verbCrumb.className = 'bx--breadcrumb-item capitalize';
    verbCrumb.innerText = verb;
    title.appendChild(verbCrumb);
    }

    const introDom = document.createElement('div');
    dom.appendChild(introDom);

    const titlePart = introPart[0];
    const titleDom = document.createElement('div');
    titleDom.innerText = titlePart;
    introDom.appendChild(titleDom);

    introPart.slice(1).forEach(paragraph => {
    const paraDom = document.createElement('p');
    paraDom.classList.add('pre-wrap');
    paraDom.innerText = paragraph;
    introDom.appendChild(paraDom);
    });

    for (let idx = 1; idx < sections.length; idx += 2) {
    const sectionDom = document.createElement('div');
    dom.appendChild(sectionDom);

    const title = document.createElement('h4');
    title.innerText = sections[idx];
    sectionDom.appendChild(title);

    const content = document.createElement('div');
    content.classList.add('pre-wrap');
    content.innerText = sections[idx + 1].replace(/^\n/, '');
    sectionDom.appendChild(content);
    }

    return outer;*/
}
