/*
 * Copyright 2017,2019 IBM Corporation
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

// sigh. this global comes from the injectScript of ChartJs in ./chart.ts
declare let Color

/**
 * Turn a given color transparent.
 *
 * Notes. The color.trim() is needed e.g. if we get the colors via a
 * call to
 * getComputedStyle(document.body).getPropertyValue('--color-red').
 * For some reason the return value is not a trimmed string, and
 * Color(thatString) fails!
 *
 */
export const transparent = (color: string, alpha = 0.6) => Color(color.trim()).alpha(alpha).rgbString()

/** clean up a url for display */
export const prettyUrl = (x: string): string => {
  const host = new URL(x).hostname
  const firstBit = host.split('.')[0]

  if (!isNaN(parseInt(firstBit, 10))) {
    // probably an ip address
    return host
  } else {
    // probably a host.domain, so return just the host part
    return firstBit
  }
}
