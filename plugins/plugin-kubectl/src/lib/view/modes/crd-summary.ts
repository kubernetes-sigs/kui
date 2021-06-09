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

import Debug from 'debug'
import { i18n, Tab, Table, ModeRegistration } from '@kui-shell/core'

import { command } from './show-crd-managed-resources'
import { CustomResourceDefinition, isCustomResourceDefinition } from '../../model/resource'

const strings = i18n('plugin-kubectl')
const debug = Debug('plugin-kubectl/view/modes/crd-summary')

/**
 * Extract the events
 *
 */
async function content(tab: Tab, crd: CustomResourceDefinition, args: { argvNoOptions: string[] }) {
  const { group, version, scope } = crd.spec
  const kind = crd.spec.names.kind

  // safeguarding here, in case some of the fields are undefined;
  // js-yaml does not take kindly to `undefined` values; see
  // https://github.com/kui-shell/plugin-kubeui/issues/330
  const scopeObj = scope ? { Scope: scope } : {}
  const groupObj = group ? { Group: group } : {}
  const versionObj = version ? { Version: version } : {}
  const kindObj = kind ? { Kind: kind } : {}

  const baseResponse = Object.assign({}, scopeObj, groupObj, versionObj, kindObj)
  const jsyaml = import('js-yaml')

  try {
    const { body: resources } = await tab.REPL.qexec<Table>(
      `${command(tab, crd, args)} -o custom-columns=NAME:.metadata.name`
    )

    baseResponse['Resource count'] = resources.length
  } catch (err) {
    // safeguarding here, in case of unexpected errors collecting
    // optional information; see
    // https://github.com/kui-shell/plugin-kubeui/issues/330
    debug('error fetching resource count for crd', err)
  }

  return {
    content: (await jsyaml).dump(baseResponse),
    contentType: 'yaml'
  }
}

/**
 * Add a Events mode button to the given modes model, if called for by
 * the given resource.
 *
 */
const mode: ModeRegistration<CustomResourceDefinition> = {
  when: isCustomResourceDefinition,
  mode: {
    mode: 'summary',
    label: strings('summary'),
    content,
    priority: 10 // override default Summary
  }
}

export default mode
