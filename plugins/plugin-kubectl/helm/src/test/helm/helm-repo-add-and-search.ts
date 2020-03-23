/*
 * Copyright 2019 IBM Corporation
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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

const synonyms = ['helm']

// TODO: enable this once proxy can find $HOME on travis
describe(`helm repo add and search ${process.env.MOCHA_RUN_TARGET}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(helm => {
    const addRepo = () => {
      it('should add a helm repo', () => {
        return CLI.command(`${helm} repo add bitnami https://charts.bitnami.com/bitnami`, this.app)
          .then(ReplExpect.okWithAny)
          .catch(Common.oops(this))
      })
    }

    const listRepos = () => {
      it('should list helm repos', () => {
        return CLI.command(`${helm} repo list`, this.app)
          .then(ReplExpect.okWith('bitnami')) // the repo we just added
          .catch(Common.oops(this))
      })
    }

    const searchRepo = (desiredImage: string) => {
      it(`should search for ${desiredImage}`, () => {
        return CLI.command(`${helm} search ${desiredImage}`, this.app)
          .then(ReplExpect.okWith(desiredImage))
          .catch(Common.oops(this))
      })
    }

    const deleteRepo = () => {
      it('should remove a helm repo', () => {
        return CLI.command(`${helm} repo remove bitnami`, this.app)
          .then(ReplExpect.okWithAny)
          .catch(Common.oops(this))
      })
    }

    addRepo()
    listRepos()
    searchRepo('nginx')
    deleteRepo()
  })
})
