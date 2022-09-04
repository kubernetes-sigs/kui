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

import { join } from 'path'
import { app } from 'electron'

import bug from '@kui-shell/client/icons/png/bugTemplate.png'
import grid from '@kui-shell/client/icons/png/gridTemplate.png'
import powerOff from '@kui-shell/client/icons/png/powerOffTemplate.png'

// these our are tray menu icons; the electron api specifies that if
// the files are named fooTemplate, then it will take care of
// rendering them as a "template icon" via underlying platform apis
// HOWTO (e.g. using imagemagick):
// magick kui.png -alpha off -auto-threshold otsu z.png
// convert z.png -resize 18x18 trayIconTemplate.png
// convert z.png -resize 36x36 trayIconTemplate@2x.png
import tray from '@kui-shell/client/icons/png/trayIconTemplate.png'
import tray2x from '@kui-shell/client/icons/png/trayIconTemplate@2x.png'

// convert kui.png -resize 12x12 productIconTemplate.png
// convert kui.png -resize 24x24 productIconTemplate@2x.png
import product from '@kui-shell/client/icons/png/productIconTemplate.png'
import product2x from '@kui-shell/client/icons/png/productIconTemplate@2x.png'

/** @return absolute path to icons directory */
export function iconHome() {
  return join(app.getAppPath(), 'dist/headless')
}

/** Resize and templatize, so that the icon morphs with platform color themes */
function iconFor(filepath: string) {
  return join(iconHome(), filepath)
}

export const bugIcon = iconFor(bug)
export const gridIcon = iconFor(grid)
export const powerOffIcon = iconFor(powerOff)
export const trayIcon = iconFor(tray)
export const trayIcon2x = iconFor(tray2x)
export const productIcon = iconFor(product)
export const productIcon2x = iconFor(product2x)
