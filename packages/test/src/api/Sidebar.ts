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

export default class Sidebar {
  /** Sidebar hamburger button that toggles the sidebar when clicked */
  public readonly hamburgerButton = '.kui--top-tab-stripe-header .kui--top-tab-stripe-header--toggle-button'

  /** Sidebar content is inside of this */
  public readonly contentContainer = '.kui--tab-container-sidebar'

  /** Sidebar content container, either visible or not */
  public contentContainerVisible(visible = true) {
    return `${this.contentContainer}[aria-hidden="${!visible}"]`
  }

  /** Sidebar nav item */
  public item(title: string) {
    return `${this.contentContainer} .kui--sidebar-nav-item[data-title="${title}"]`
  }
}
