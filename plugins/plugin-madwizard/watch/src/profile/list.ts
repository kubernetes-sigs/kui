/*
 * Copyright 2022 The Kubernetes Authors
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

import chokidar from 'chokidar'
import { basename } from 'path'
import { Profiles } from 'madwizard'

import UpdateFunction from '../update'

/** Watch for new, removed, and renamed profiles */
export default class ProfileWatcher {
  /** Our model */
  private _profiles: Profiles.Profile[] = []

  /** Have we already performed the on-time init? */
  private _initDone = false

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly updateFn: UpdateFunction,
    private readonly profilesPath: string,
    private readonly watcher = chokidar.watch(profilesPath, { depth: 1 })
  ) {}

  public async close() {
    await this.watcher.close()
  }

  /** Initialize `this._profiles` model */
  public async init(): Promise<ProfileWatcher> {
    if (!this._initDone) {
      // await this.readOnce() no need, since chokidar gives us an initial read
      this.initWatcher()
      this._initDone = true
    }

    return this
  }

  /** Options we will pass to the madwizard API */
  private get madwizardOptions() {
    return { profilesPath: this.profilesPath }
  }

  private readonly onAddOrChange = async (path: string) => {
    try {
      const profile = basename(path)
      if (Profiles.isTemporary(profile)) {
        // skip any write-file-atomic temps
        return
      }

      const profileObj = await Profiles.restore(this.madwizardOptions, basename(path)).then(_ => _.profile)
      const idx = this.profiles.findIndex(_ => _.name === profile)
      if (idx < 0) {
        this._profiles.push(profileObj)
      } else {
        this._profiles[idx] = profileObj
      }
      this.updateFn()
    } catch (err) {
      console.error('Error loading new profile', path, err)
    }
  }

  /** Initialize the filesystem watcher to notify us of new or removed profiles */
  private initWatcher() {
    this.watcher.on('add', this.onAddOrChange)
    this.watcher.on('change', this.onAddOrChange)

    this.watcher.on('unlink', path => {
      const profile = basename(path)
      if (Profiles.isTemporary(profile)) {
        // skip any write-file-atomic temps
        return
      }

      const idx = this.profiles.findIndex(_ => _.name === profile)
      if (idx >= 0) {
        this._profiles.splice(idx, 1)
        this.updateFn()
      }
    })
  }

  /** @return the current profiles model */
  public get profiles() {
    return this._profiles
  }

  /** Update the profiles model */
  private set profiles(profiles: Profiles.Profile[]) {
    this._profiles = profiles
  }

  /** Read the full list of profiles */
  private async readOnce() {
    this.profiles = (await Profiles.list(this.madwizardOptions)).map(_ => _.profile)
  }
}
