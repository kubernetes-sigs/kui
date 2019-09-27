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

describe('Tab completion core', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const options = ['core_empty.js', 'core_single_entry_directory/', 'core_test_directory_1/']

  const fileOptions = ['empty1.js', 'empty2.js']

  const tmp1 = tmpDirSync()
  touch(join(tmp1.name, 'foo bar'))

  const tmp2 = tmpDirSync()
  touch(join(tmp2.name, 'foo bar1'))
  touch(join(tmp2.name, 'foo bar2'))

  Common.localIt('should tab complete file with spaces unique', () => {
    return tabby(this.app, `ls ${join(tmp1.name, 'foo')}`, `ls ${join(tmp1.name, 'foo bar')}`)
  })

  Common.localIt('should tab complete file with spaces unique with dash option', () => {
    return tabby(this.app, `ls -l ${join(tmp1.name, 'foo')}`, `ls -l ${join(tmp1.name, 'foo bar')}`)
  })

  Common.localIt('should tab complete file with spaces unique with backslash escape', () => {
    return tabby(this.app, `ls ${join(tmp1.name, 'foo\\ ')}`, `ls ${join(tmp1.name, 'foo bar')}`)
  })

  Common.localIt('should tab complete file with spaces non-unique', () => {
    return tabbyWithOptions(
      this.app,
      `ls ${join(tmp2.name, 'foo')}`,
      ['foo\\ bar1', 'foo\\ bar2'],
      `ls ${join(tmp2.name, 'foo bar1')}`,
      { click: 0 }
    )
  })

  Common.localIt('should tab complete file with spaces non-unique with dash option', () => {
    return tabbyWithOptions(
      this.app,
      `ls -l ${join(tmp2.name, 'foo')}`,
      ['foo\\ bar1', 'foo\\ bar2'],
      `ls -l ${join(tmp2.name, 'foo bar1')}`,
      { click: 0 }
    )
  })

  Common.localIt('should tab complete file with spaces non-unique with backslash escape', () => {
    return tabbyWithOptions(
      this.app,
      `ls ${join(tmp2.name, 'foo\\ ')}`,
      ['foo\\ bar1', 'foo\\ bar2'],
      `ls ${join(tmp2.name, 'foo bar2')}`,
      { click: 1 }
    )
  })

  Common.localIt('should tab complete file with spaces unique with backslash escape variant 2', () => {
    return tabby(this.app, `ls ${join(tmp2.name, 'foo\\ bar1')}`, `ls ${join(tmp2.name, 'foo bar1')}`)
  })

  // tab completion using default file completion handler (i.e. if the
  // command does not register a usage model, then always tab
  // completion local files)
  Common.localIt('should complete on the single-entry directory with git diff', () =>
    tabby(
      this.app,
      `git diff ${ROOT}/data/core/core_single_entry_dir`,
      `git diff ${ROOT}/data/core/core_single_entry_directory/`
    )
  )

  // tab completion of directories
  Common.localIt('should complete on the single-entry directory', () =>
    tabby(this.app, `ls ${ROOT}/data/core/core_single_entry_dir`, `ls ${ROOT}/data/core/core_single_entry_directory/`)
  )

  // tab completion of a directory, auto-completing the single entry in the directory
  Common.localIt('should complete on the single-entry directory', () =>
    tabby(
      this.app,
      `ls ${ROOT}/data/core/core_single_entry_directory/`,
      `ls ${ROOT}/data/core/core_single_entry_directory/only_one_file_here_please.js`
    )
  )

  // tab completion of a dot file
  Common.localIt('should complete on a dot file', () =>
    tabby(this.app, `ls ${ROOT}/data/core/.dot-file-for-`, `ls ${ROOT}/data/core/.dot-file-for-tests`)
  )

  // tab completion with options, then click on the second (idx=1) entry of the expected cmpletion list
  Common.localIt('should tab complete local file path with options', () =>
    tabbyWithOptions(this.app, `lls ${ROOT}/data/core/core_`, options, `lls ${ROOT}/data/core/core_single_entry_dir/`, {
      click: 1
    })
  )

  Common.localIt('should tab complete local file path with options, expect prompt update', () =>
    tabbyWithOptions(this.app, `lls ${ROOT}/data/core/co`, options, `lls ${ROOT}/data/core/core_single_entry_dir/`, {
      click: 1,
      expectedPromptAfterTab: `lls ${ROOT}/data/core_`
    })
  )

  // tab completion with file options, then click on the first (idx=0) entry of the expected cmpletion list
  Common.localIt('should tab complete local file path with options', () =>
    tabbyWithOptions(
      this.app,
      `lls ${ROOT}/data/core/core_test_directory_1/em`,
      fileOptions,
      `lls ${ROOT}/data/core/core_test_directory_1/empty1.js`,
      { click: 0 }
    )
  )

  Common.localIt('should tab complete the data directory', () => tabby(this.app, `lls ${ROOT}/da`, `lls ${ROOT}/data/`))
  Common.localIt('should tab complete the data/core/empty.js file', () =>
    tabby(this.app, `lls ${ROOT}/data/core/empty.js`, `lls ${ROOT}/data/core/empty.json`)
  )
  Common.localIt('should tab complete the ../../packages/core directory', () =>
    tabby(this.app, `lls ${ROOT}/../../../packages/co`, `lls ${ROOT}/../../../packages/core/`)
  )

  // same, but this time tab to cycle through the options
  Common.localIt('should tab complete local file path', () =>
    tabbyWithOptions(this.app, `lls ${ROOT}/data/core/core_`, options, `lls ${ROOT}/data/core/core_single_entry_dir/`, {
      nTabs: 1
    })
  )

  Common.localIt('should tab complete local file path, then options go away on edit', () =>
    tabbyWithOptionsThenCancel(this.app, `lls ${ROOT}/data/core/core_`, options)
  )

  Common.remoteIt('should tab complete version command', () => tabby(this.app, 'vers', 'version'))
})
