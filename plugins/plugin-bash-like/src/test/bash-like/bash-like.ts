/*
 * Copyright 2018 The Kubernetes Authors
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

import { v4 as uuid } from 'uuid'
import { writeFileSync } from 'fs'
import { strictEqual } from 'assert'
import { fileSync as tmpFile } from 'tmp'

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

/** expect the given folder within the help tree */
export const header = (folder: string) => folder

const yamlContent = `#
# notes:
#   - hello
#   - you
#   - weird
#   - world
#
# the rest of the file is unchanged from that origin:

# This is a simple example of using a config map to create a single page static site.
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ template "nginx.fullname" . }}
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
    app.kubernetes.io/name: {{ template "nginx.name" . }}
data:
  # When the config map is mounted as a volume, these will be created as files.
  index.html: {{ .Values.index | quote }}
  test.txt: test
`
const ymlFile = tmpFile({ postfix: '.yml' })
writeFileSync(ymlFile.fd, yamlContent)
const yamlFile = tmpFile({ postfix: '.yaml' })
writeFileSync(yamlFile.fd, yamlContent)

const jsonContent = JSON.stringify({ x: 3 })
const jsonFile = tmpFile({ postfix: '.json' })
writeFileSync(jsonFile.fd, jsonContent)

describe(`bash-like commands ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  Common.pit('should give 127 for unknown outer command', () =>
    CLI.command(`ibmcloudo target`, this.app)
      .then(ReplExpect.error(127))
      .catch(Common.oops(this, true))
  )

  it('should cat a json file', () =>
    CLI.command(`cat ${jsonFile.name}`, this.app)
      .then(ReplExpect.okWithPtyOutput('"x"'))
      .catch(Common.oops(this, true)))
  it('should cat a yml file', () =>
    CLI.command(`cat ${ymlFile.name}`, this.app)
      .then(ReplExpect.okWithPtyOutput('notes:'))
      .catch(Common.oops(this, true)))
  it('should cat a yaml file', () =>
    CLI.command(`cat ${yamlFile.name}`, this.app)
      .then(ReplExpect.okWithPtyOutput('notes:'))
      .catch(Common.oops(this, true)))

  // these two are useful as a pair; git usage responds with exit code
  // 1, whereas ibmcloud responds with exit code 0
  Common.pit('should give usage for git', () =>
    CLI.command(`git`, this.app)
      .then(ReplExpect.error(1))
      .catch(Common.oops(this, true))
  )

  Common.pit('should answer which ls with /bin/ls', () =>
    CLI.command(`which -a ls`, this.app) // For some customized bash, `which ls` could show: ls: aliased to ls -G
      .then(ReplExpect.okWithPtyOutput('/bin/ls'))
      .catch(Common.oops(this, true))
  )

  Common.pit('should echo hi', () =>
    CLI.command(`echo hi`, this.app)
      .then(ReplExpect.okWithPtyOutput('hi'))
      .catch(Common.oops(this, true))
  )

  // re: localIt, ~/bin may not exist in browser mode, and we start in
  // with PWD=~ there
  Common.localIt('should change working directory', () =>
    CLI.command(`cd bin`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )

  Common.localIt('should list core/', () =>
    CLI.command(`ls -l`, this.app)
      .then(ReplExpect.okWith('runTest.sh'))
      .catch(Common.oops(this, true))
  )

  /* it('should list directory properly that contains prefix matches', () => CLI.command(`ls -l @demos`, this.app)
    .then(ReplExpect.okWithCustom({ expect: 'try-retain.js' }))
    .catch(Common.oops(this, true)))
  it('should list directory properly that contains prefix matches', () => CLI.command(`ls -l @demos`, this.app)
    .then(ReplExpect.okWithCustom({ expect: 'retain.js' }))
    .catch(Common.oops(this, true)))
  it('should list directory properly that contains prefix matches', () => CLI.command(`ls -l @demos`, this.app)
    .then(ReplExpect.okWithCustom({ expect: 'try.js' }))
    .catch(Common.oops(this, true))) */

  Common.pit('should cd to /tmp', () =>
    CLI.command('cd /tmp', this.app)
      .then(ReplExpect.okWithString('/tmp'))
      .catch(Common.oops(this, true))
  )

  const dirname = `kui__${uuid()} bar`
  Common.pit('should mkdir with spaces', () =>
    CLI.command(`mkdir "${dirname}"`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )
  Common.pit('should fail to mkdir again', () =>
    CLI.command(`mkdir "${dirname}"`, this.app)
      .then(ReplExpect.error(409))
      .catch(Common.oops(this, true))
  )

  Common.pit('should echo ho to a file', async () => {
    try {
      const res = await CLI.command(`echo ho > "${dirname}"/testTmp`, this.app).then(ReplExpect.ok)

      // verify that there is indeed no output in the block
      // see https://github.com/kubernetes-sigs/kui/issues/8089
      const txt = await this.app.client.$(Selectors.OUTPUT_N(res.count, res.splitIndex)).then(_ => _.getText())
      strictEqual(txt.length, 0, 'Expect no output in the block, due to redirect')
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  Common.pit('should cat that file', () =>
    CLI.command(`cat "${dirname}"/testTmp`, this.app)
      .then(ReplExpect.okWithPtyOutput('ho'))
      .catch(Common.oops(this, true))
  )
  Common.pit('should rm that file', () =>
    CLI.command(`rm "${dirname}"/testTmp`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )

  Common.pit('should kuiecho ho and redirect the output to a file', () =>
    CLI.command(`kuiecho ho > "${dirname}"/testTmp2`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )
  Common.pit('should cat that file', () =>
    CLI.command(`cat "${dirname}"/testTmp2`, this.app)
      .then(ReplExpect.okWithPtyOutput('ho'))
      .catch(Common.oops(this, true))
  )
  Common.pit('should kuiecho yo and append the output to that file', () =>
    CLI.command(`kuiecho yo >> "${dirname}"/testTmp2`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )
  Common.pit('should cat that file and expect appended output', () =>
    CLI.command(`cat "${dirname}"/testTmp2`, this.app)
      .then(ReplExpect.okWithPtyOutput('hoyo'))
      .catch(Common.oops(this, true))
  )
  Common.pit('should rm that file', () =>
    CLI.command(`rm "${dirname}"/testTmp2`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )

  Common.pit('should mkdir a subdir with spaces', () =>
    CLI.command(`mkdir "${dirname}"/"foo2 bar2"`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )
  Common.pit('should list the new directory with spaces', () =>
    CLI.command(`ls -l "${dirname}"`, this.app)
      .then(ReplExpect.okWithCustom({ expect: 'foo2 bar2' }))
      .catch(Common.oops(this, true))
  )
  Common.pit('should rmdir a subdir with spaces', () =>
    CLI.command(`rmdir "${dirname}"/"foo2 bar2"`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )
  Common.pit('should rmdir a dir with spaces', () =>
    CLI.command(`rmdir "${dirname}"`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )
})
