/*
 * Copyright 2018-19 IBM Corporation
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

import * as Debug from 'debug'

import { basename, dirname } from 'path'

import expandHomeDir from '@kui-shell/core/util/home'
import { isHeadless } from '@kui-shell/core/core/capabilities'
import { encodeComponent, qexec } from '@kui-shell/core/core/repl'
import { Tab } from '@kui-shell/core/webapp/cli'
import { findFile } from '@kui-shell/core/core/find-file'
import { CommandRegistrar } from '@kui-shell/core/models/command'

import markdownify from '../util/markdown'
import { localFilepath } from '../util/usage-helpers'

import i18n from '@kui-shell/core/util/i18n'
const strings = i18n('plugin-bash-like')

const debug = Debug('plugins/bash-like/cmds/open')

/**
 * Decide how to display a given filepath
 *
 */
const open = async (tab: Tab, filepath: string) => {
  debug('open', filepath)

  const fullpath = findFile(expandHomeDir(filepath))
  const suffix = filepath.substring(filepath.lastIndexOf('.') + 1)

  if (
    suffix === 'js' ||
    suffix === 'ts' ||
    suffix === 'go' ||
    suffix === 'txt' ||
    suffix === 'swift' ||
    suffix === 'py' ||
    suffix === 'json'
  ) {
    // open json and javascript files in the editor
    return qexec(`edit "${filepath}"`)
  } else if (suffix === 'yaml' || suffix === 'yml') {
    // use the k8s plugin to edit yamls
    return qexec(`kedit "${filepath}"`)
  } else if (
    suffix === 'png' ||
    suffix === 'jpg' ||
    suffix === 'jpeg' ||
    suffix === 'tiff' ||
    suffix === 'tif' ||
    suffix === 'gif' ||
    suffix === 'icns' ||
    suffix === 'ico' ||
    suffix === 'webp' ||
    suffix === 'bpg' ||
    suffix === 'svg' ||
    suffix === 'mov' ||
    suffix === 'mp4' ||
    suffix === 'ogg' ||
    suffix === 'mp3'
  ) {
    // open binary/imag fields in a separate window
    window.open(fullpath, 'target=_blank')
    return true
  } else if (suffix === 'pkl' || suffix === 'sab') {
    throw new Error('Opening of binary files not supported')
  } else {
    const stats: { isDirectory: boolean; filepath: string; data: string } = await qexec(
      `fstat ${encodeComponent(filepath)} --with-data`
    )

    if (stats.isDirectory) {
      debug('trying to open a directory; delegating to ls')
      return qexec(`ls ${encodeComponent(filepath)}`)
    } else {
      const enclosingDirectory = dirname(filepath)

      let data: string | Element = stats.data
      let name = basename(filepath)
      let packageName = enclosingDirectory === '.' ? undefined : enclosingDirectory

      if ((suffix === 'adoc' || suffix === 'md') && !isHeadless()) {
        const { title, body } = await markdownify(tab, suffix, data, fullpath)

        data = body

        if (title) {
          // use the first <h1> as the sidecar title
          // and use the filename as the "packageName" subtitle
          packageName = name
          name = title.innerText
        }
      }

      return {
        type: 'custom',
        isEntity: true,
        prettyType: 'file',
        name,
        packageName,
        contentType: suffix === 'sh' ? 'shell' : suffix,
        contentTypeProjection: 'data',
        content: {
          data
        }
      }
    }
  }
}

const usage = {
  strict: 'open',
  command: 'open',
  title: strings('openUsageTitle'),
  header: strings('openUsageHeader'),
  optional: localFilepath
}

/**
 * Register command handlers
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen(
    '/open',
    ({ tab, argvNoOptions: argv }) => {
      return open(tab, argv[argv.indexOf('open') + 1])
    },
    { usage, needsUI: true, inBrowserOk: true, noAuthOk: true }
  )
}
