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

import { CreateWindowFunction } from '@kui-shell/core'
import openWindowWith from './open'

export default function storageMenu(createWindow: CreateWindowFunction): import('electron').MenuItemConstructorOptions {
  return {
    label: 'Storage',
    submenu: [
      { label: 'PersistentVolumes', click: openWindowWith(['kubectl', 'get', 'pv'], createWindow) },
      { label: 'PersistentVolumeClaims', click: openWindowWith(['kubectl', 'get', 'pvc'], createWindow) },
      { label: 'StorageClasses', click: openWindowWith(['kubectl', 'get', 'sc'], createWindow) },
      { label: 'VolumeSnapshots', click: openWindowWith(['kubectl', 'get', 'volumesnapshots'], createWindow) },
      {
        label: 'VolumeSnapshotClasses',
        click: openWindowWith(['kubectl', 'get', 'volumesnapshotClassess'], createWindow)
      },
      {
        label: 'VolumeSnapshotContents',
        click: openWindowWith(['kubectl', 'get', 'volumesnapshotcontents'], createWindow)
      }
    ]
  }
}
