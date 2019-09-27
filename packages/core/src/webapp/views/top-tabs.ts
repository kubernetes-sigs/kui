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

/**
 * Return the container for the right-hand buttons in the top tab stripe
 *
 */
function rightButtonContainer() {
  return document.getElementById('kui--custom-top-tab-stripe-button-container')
}

/**
 * Is the current button designation present in the UI?
 *
 */
export function buttonExists(designation: string) {
  return rightButtonContainer().querySelector(`.${designation}`) !== null
}

/**
 * Remove the designated button
 *
 */
export function removeIcon(designation: string) {
  const button = rightButtonContainer().querySelector(`.${designation}`)
  if (button) {
    rightButtonContainer().removeChild(button)
  }
}

/**
 * Insert the given icon in the right-hand button container of the top
 * tab stripe
 *
 */
export function addIcon(
  image: SVGElement | HTMLImageElement,
  designation: string,
  position: 'prepend' | 'append' = 'prepend'
) {
  const button = document.createElement('div')

  button.className = 'left-tab-stripe-button smaller-button'
  button.classList.add(designation)
  button.appendChild(image)

  if (position === 'append') {
    rightButtonContainer().appendChild(button)
  } else {
    rightButtonContainer().prepend(button)
  }

  return button
}
