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

import { v4 as uuid } from 'uuid'
import { basename } from 'path'
import { exec } from 'child_process'
import { fileSync as tmpFile } from 'tmp'
import { writeFileSync } from 'fs'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'

const { cli, selectors, sidecar } = ui
const { localIt, pit } = common

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

/**
 * Check to see if the given executable is available
 *
 */
const hasExe = (exe: string): Promise<boolean> =>
  new Promise(resolve => {
    exec(exe, err => resolve(!err))
  })

describe(`bash-like commands ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  pit('should give 404 for unknown outer command', () =>
    cli
      .do(`ibmcloudo target`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this, true))
  )

  pit('should cat a json file', () =>
    cli
      .do(`cat ${jsonFile.name}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(basename(jsonFile.name)))
      .catch(common.oops(this, true))
  )
  pit('should cat a yml file', () =>
    cli
      .do(`cat ${ymlFile.name}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(basename(ymlFile.name)))
      .catch(common.oops(this, true))
  )
  pit('should cat a yaml file', () =>
    cli
      .do(`cat ${yamlFile.name}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(basename(yamlFile.name)))
      .catch(common.oops(this, true))
  )

  // these two are useful as a pair; git usage responds with exit code
  // 1, whereas ibmcloud responds with exit code 0
  pit('should give usage for git', () =>
    cli
      .do(`git`, this.app)
      .then(cli.expectError(1))
      .catch(common.oops(this, true))
  )

  // TODO: Disabled for now. See https://github.com/IBM/kui/issues/1977
  it.skip('should give usage for ibmcloud', () =>
    cli
      .do(`ibmcloud`, this.app)
      .then(cli.expectError(500, header('ibmcloud')))
      .catch(common.oops(this, true)))

  if (!process.env.LOCAL_OPENWHISK) {
    pit('should give ok for known outer command: ibmcloud target', () =>
      cli
        .do(`ibmcloud target`, this.app)
        .then(cli.expectOK)
        .catch(common.oops(this, true))
    )
  }

  if (hasExe('ibmcloud')) {
    // TODO: Disabled for now. See https://github.com/IBM/kui/issues/1977
    it.skip('should give usage for ibmcloud config', () =>
      cli
        .do(`ibmcloud config`, this.app)
        .then(cli.expectError(2, undefined))
        .catch(common.oops(this, true)))

    // TODO: Disabled for now. See https://github.com/IBM/kui/issues/1977
    it.skip('should give usage for ibmcloud app', () =>
      cli
        .do(`ibmcloud app`, this.app)
        .then(cli.expectErrorWithPassthrough(500))
        .then(N =>
          Promise.all([
            this.app.client.waitForExist(`${selectors.OUTPUT_N(N)} h4.usage-error-title[data-title="commands"]`),
            this.app.client.waitForExist(
              `${selectors.OUTPUT_N(N)} .bx--breadcrumb-item .bx--no-link[data-label="app"]`
            ),
            this.app.client.waitForExist(
              `${selectors.OUTPUT_N(N)} .bx--breadcrumb-item .bx--link[data-label="ibmcloud"]`
            )
          ])
        )
        .catch(common.oops(this, true)))
  }

  pit('should answer which ls with /bin/ls', () =>
    cli
      .do(`which -a ls`, this.app) // For some customized bash, `which ls` could show: ls: aliased to ls -G
      .then(cli.expectOKWithCustom({ expect: '/bin/ls', exact: false }))
      .catch(common.oops(this, true))
  )

  pit('should echo hi', () =>
    cli
      .do(`echo hi`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'hi' }))
      .catch(common.oops(this, true))
  )

  pit('should change working directory', () =>
    cli
      .do(`cd bin`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this, true))
  )

  localIt('should list core/', () =>
    cli
      .do(`ls`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'runTest.sh' }))
      .catch(common.oops(this, true))
  )

  /* it('should list directory properly that contains prefix matches', () => cli.do(`ls @demos`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'try-retain.js' }))
    .catch(common.oops(this, true)))
  it('should list directory properly that contains prefix matches', () => cli.do(`ls @demos`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'retain.js' }))
    .catch(common.oops(this, true)))
  it('should list directory properly that contains prefix matches', () => cli.do(`ls @demos`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'try.js' }))
    .catch(common.oops(this, true))) */

  pit('should cd to /tmp', () =>
    cli
      .do('cd /tmp', this.app)
      .then(cli.expectOKWithString('/tmp'))
      .catch(common.oops(this, true))
  )

  const dirname = `kui__${uuid()} bar`
  pit('should mkdir with spaces', () =>
    cli
      .do(`mkdir "${dirname}"`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this, true))
  )
  pit('should fail to mkdir again', () =>
    cli
      .do(`mkdir "${dirname}"`, this.app)
      .then(cli.expectError(409))
      .catch(common.oops(this, true))
  )

  pit('should echo ho to a file', () =>
    cli
      .do(`echo ho > "${dirname}"/testTmp`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this, true))
  )
  pit('should cat that file', () =>
    cli
      .do(`cat "${dirname}"/testTmp`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'ho' }))
      .catch(common.oops(this, true))
  )
  pit('should rm that file', () =>
    cli
      .do(`rm "${dirname}"/testTmp`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this, true))
  )

  pit('should mkdir a subdir with spaces', () =>
    cli
      .do(`mkdir "${dirname}"/"foo2 bar2"`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this, true))
  )
  pit('should list the new directory with spaces', () =>
    cli
      .do(`ls "${dirname}"`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'foo2 bar2' }))
      .catch(common.oops(this, true))
  )
  pit('should rmdir a subdir with spaces', () =>
    cli
      .do(`rmdir "${dirname}"/"foo2 bar2"`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this, true))
  )
  pit('should rmdir a dir with spaces', () =>
    cli
      .do(`rmdir "${dirname}"`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this, true))
  )
})
