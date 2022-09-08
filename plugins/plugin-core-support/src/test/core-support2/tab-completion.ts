/*
 * Copyright 2019 The Kubernetes Authors
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

import { Common } from '@kui-shell/test'

import {
  tabby,
  tabbyWithOptions,
  tabbyWithOptionsThenCancel,
  touch
} from '@kui-shell/plugin-core-support/tests/lib/core-support/tab-completion-util'
import { dirSync as tmpDirSync } from 'tmp'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/core/tests/package.json'))

describe('Tab completion core', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const options = ['core_empty.js', 'core_single_entry_directory/', 'core_test_directory_1/']

  const fileOptions = ['empty1.js', 'empty2.js']

  const tmp1 = tmpDirSync()
  touch(join(tmp1.name, 'foo bar'))

  const tmp2 = tmpDirSync()
  touch(join(tmp2.name, 'foo bar1'))
  touch(join(tmp2.name, 'foo bar2'))

  Common.localIt('should tab complete the ../../packages/core directory', () =>
    tabby(this, `lls ${ROOT}/../../../packages/co`, `lls ${ROOT}/../../../packages/core/`)
  )

  Common.localIt(`should tab complete file with spaces unique ${tmp1.name}`, () => {
    return tabby(this, `lls ${join(tmp1.name, 'foo')}`, `lls ${join(tmp1.name, 'foo\\ bar ')}`)
  })

  Common.localIt('should tab complete file with spaces unique with dash option', () => {
    return tabby(this, `lls -l ${join(tmp1.name, 'foo')}`, `lls -l ${join(tmp1.name, 'foo\\ bar ')}`)
  })

  Common.localIt('should tab complete file with spaces unique with backslash escape', () => {
    return tabby(this, `lls ${join(tmp1.name, 'foo\\ ')}`, `lls ${join(tmp1.name, 'foo\\ bar ')}`)
  })

  // eslint-disable-next-line no-constant-condition
  if (false) {
    Common.localIt('should tab complete file with spaces non-unique', () => {
      return tabbyWithOptions(
        this,
        `lls ${join(tmp2.name, 'foo')}`,
        ['foo bar1', 'foo bar2'],
        `lls ${join(tmp2.name, 'foo\\ bar1 ')}`,
        { click: 0 }
      )
    })

    Common.localIt('should tab complete file with spaces non-unique with dash option', () => {
      return tabbyWithOptions(
        this,
        `lls -l ${join(tmp2.name, 'foo')}`,
        ['foo bar1', 'foo bar2'],
        `lls -l ${join(tmp2.name, 'foo\\ bar1 ')}`,
        { click: 0 }
      )
    })

    Common.localIt('should tab complete file with spaces non-unique with backslash escape', () => {
      return tabbyWithOptions(
        this,
        `lls ${join(tmp2.name, 'foo\\ ')}`,
        ['foo bar1', 'foo bar2'],
        `lls ${join(tmp2.name, 'foo\\ bar2 ')}`,
        { click: 1 }
      )
    })

    Common.localIt('should tab complete file with spaces unique with backslash escape variant 2', () => {
      return tabby(this, `lls ${join(tmp2.name, 'foo\\ bar1')}`, `lls ${join(tmp2.name, 'foo\\ bar1 ')}`)
    })

    // tab completion of directories
    Common.localIt('should complete on the single-entry directory', () =>
      tabby(this, `lls ${ROOT}/data/core/core_single_entry_dir`, `lls ${ROOT}/data/core/core_single_entry_directory/`)
    )

    // tab completion of a directory, auto-completing the single entry in the directory
    Common.localIt('should complete on the single-entry directory', () =>
      tabby(
        this,
        `lls ${ROOT}/data/core/core_single_entry_directory/`,
        `lls ${ROOT}/data/core/core_single_entry_directory/only_one_file_here_please.js `
      )
    )

    // tab completion of a dot file
    Common.localIt('should complete on a dot file', () =>
      tabby(this, `lls ${ROOT}/data/core/.dot-file-for-`, `lls ${ROOT}/data/core/.dot-file-for-tests `)
    )

    // tab completion with options, then click on the second (idx=1) entry of the expected cmpletion list
    Common.localIt('should tab complete local file path with options then click on second', () =>
      tabbyWithOptions(
        this,
        `lls ${ROOT}/data/core/core_`,
        options,
        `lls ${ROOT}/data/core/core_single_entry_directory/`,
        {
          click: 1
        }
      )
    )

    Common.localIt('should tab complete local file path with options, expect prompt update', () =>
      tabbyWithOptions(
        this,
        `lls ${ROOT}/data/core/co`,
        options,
        `lls ${ROOT}/data/core/core_single_entry_directory/`,
        {
          click: 1,
          expectedPromptAfterTab: `lls ${ROOT}/data/core/core_`
        }
      )
    )

    // tab completion with file options, then click on the first (idx=0) entry of the expected cmpletion list
    Common.localIt('should tab complete local file path with options then click on first', () =>
      tabbyWithOptions(
        this,
        `lls ${ROOT}/data/core/core_test_directory_1/em`,
        fileOptions,
        `lls ${ROOT}/data/core/core_test_directory_1/empty1.js `,
        { click: 0 }
      )
    )

    Common.localIt('should tab complete the data directory', () => tabby(this, `lls ${ROOT}/da`, `lls ${ROOT}/data/`))
    Common.localIt('should tab complete the data/core/empty.js file', () =>
      tabby(this, `lls ${ROOT}/data/core/empty.js`, `lls ${ROOT}/data/core/empty.json `)
    )

    // same, but this time tab to cycle through the options
    Common.localIt('should tab complete local file path', () =>
      tabbyWithOptions(
        this,
        `lls ${ROOT}/data/core/core_`,
        options,
        `lls ${ROOT}/data/core/core_single_entry_directory/`,
        {
          nTabs: 2
        }
      )
    )

    Common.localIt('should tab complete local file path, then options go away on edit', () =>
      tabbyWithOptionsThenCancel(this, `lls ${ROOT}/data/core/core_`, options)
    )

    // not supported right now. see https://github.com/IBM/kui/pull/3717
    // Common.remoteIt('should tab complete version command', () => tabby(this, 'vers', 'version'))
  }
})
