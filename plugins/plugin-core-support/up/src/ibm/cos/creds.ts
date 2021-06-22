/*
 * Copyright 2021 The Kubernetes Authors
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

import colors from 'colors/safe'
import { Arguments, encodeComponent } from '@kui-shell/core'

import Options from '../options'

/** @return a --cos-instance command line option, if specified */
function cosinstance(parsedOptions: Arguments<Options>['parsedOptions']) {
  const cosinstance = parsedOptions['cos-instance']
    ? `--cos-instance ${encodeComponent(parsedOptions['cos-instance'])}`
    : ''
  return cosinstance
}

async function check({ REPL, parsedOptions }: Pick<Arguments<Options>, 'REPL' | 'parsedOptions'>) {
  try {
    return await REPL.qexec<string>(`ibmcloud cos validate --output name ${cosinstance(parsedOptions)}`)
  } catch (err) {
    return false
  }
}

export default {
  label: (checkResult: false | string) =>
    'S3: IBM Cloud Object Storage ' +
    (!checkResult ? colors.red('not configured') : colors.gray('service-instance=') + colors.yellow(checkResult)),
  needsCloudLogin: true,
  fix: async (args: Arguments<Options>) => {
    await args.REPL.qexec(`ibmcloud cos bind ${cosinstance(args.parsedOptions)}`)
    return check(args)
  },
  onFail: 'ibmcloud cos bind',
  check
}
