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

export default class Wizard {
  public readonly wizard = '.kui--wizard'
  private readonly title = '.pf-c-wizard__title'
  private readonly _description = '.pf-c-wizard__description'
  private readonly _navItem = '.pf-c-wizard__nav-item'
  private readonly _navItemTitle = '.pf-c-wizard__nav-link'
  public readonly isCurrentStep = 'pf-m-current'
  private readonly _navItemDescription = '.kui--wizard-nav-item-description'
  private readonly _navItemProgressStepper = '.kui--progress-stepper'
  private readonly _navItemProgressStep = '.kui--progress-step'
  private readonly _body = '.pf-c-wizard__main-body'
  private readonly _wizardProgressMeasure = '.pf-c-progress__measure'

  public withTitle(title: string) {
    return `${this.wizard} ${this.title}[aria-label="${title}"]`
  }

  public get description() {
    return `${this.wizard} ${this._description}`
  }

  public get body() {
    return `${this.wizard} ${this._body}`
  }

  public navItem(idx: number) {
    return `${this.wizard} ${this._navItem}:nth-child(${idx + 1})`
  }

  public navItemSwitchToButton(idx: number) {
    return `${this.navItem(idx)} > button`
  }

  public navItemTitle(idx: number) {
    return `${this.navItem(idx)} ${this._navItemTitle}`
  }

  public navItemDescription(idx: number) {
    return `${this.navItem(idx)} ${this._navItemDescription}`
  }

  public navItemProgressStepper(idx: number) {
    return `${this.navItem(idx)} ${this._navItemProgressStepper}`
  }

  public navItemProgressSteps(idx: number) {
    return `${this.navItemProgressStepper(idx)} ${this._navItemProgressStep}`
  }

  public navItemProgressStep(navIdx: number, stepIdx: number) {
    return `${this.navItemProgressSteps(navIdx)}:nth-child(${stepIdx + 1})`
  }

  public get progressMeasure() {
    return `${this.wizard} ${this._wizardProgressMeasure}`
  }
}
