/*
 * MIT License
 *
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Attribution: https://github.com/patternfly/patternfly-react/blob/%40patternfly/react-core%404.202.25/packages/react-core/src/components/Wizard/WizardFooterInternal.tsx
 * Additions by:
 *   - @starpit 20220412 Added `leftActions` and `rightContent` properties
 */

import React from 'react'
import { css } from '@patternfly/react-styles'
import styles from '@patternfly/react-styles/css/components/Wizard/wizard'
import { WizardStep } from '@patternfly/react-core'

import Button, { Props as ButtonProps } from '../../../../spi/Button'

import '../../../../../../web/scss/components/Wizard/Footer.scss'

export type KuiFooterExtraProps = {
  /** Add a box shadow effect? [default: false] */
  boxShadow?: boolean

  /**
   * Click handlers to be placed in normal button row
   * @author @starpit
   */
  leftButtons?: ButtonProps[]

  /**
   * Click handlers to be placed in normal button row, but right-aligned
   * @author @starpit
   */
  rightButtons?: ButtonProps[]

  /**
   * Extra content to place above the normal button row
   * @author @starpit
   */
  topContent?: React.ReactNode
}

export interface WizardFooterInternalProps extends KuiFooterExtraProps {
  onNext: any
  onBack: any
  onClose: any
  isValid: boolean
  firstStep: boolean
  activeStep: WizardStep
  nextButtonText: React.ReactNode
  backButtonText: React.ReactNode
  cancelButtonText: React.ReactNode
}

export const WizardFooterInternal: React.FunctionComponent<WizardFooterInternalProps> = ({
  onNext,
  onBack,
  onClose,
  isValid,
  firstStep,
  activeStep,
  nextButtonText,
  backButtonText,
  cancelButtonText,

  boxShadow,
  leftButtons,
  rightButtons,
  topContent
}: WizardFooterInternalProps) => (
  <footer className={css(styles.wizardFooter) + ' kui--wizard-footer'} data-has-box-shadow={boxShadow || undefined}>
    {topContent && <span className="kui--wizard-footer--top">{topContent}</span>}

    <span className="kui--wizard-footer--bottom">
      <span className="kui--wizard-footer--bottom-left">
        {leftButtons && leftButtons.map((_, idx) => <Button key={idx} {..._} />)}
        <Button variant="primary" type="submit" onClick={onNext} isDisabled={!isValid}>
          {nextButtonText}
        </Button>
        {!activeStep.hideBackButton && (
          <Button variant="secondary" onClick={onBack} isDisabled={firstStep}>
            {backButtonText}
          </Button>
        )}
        {!activeStep.hideCancelButton && (
          <div className={styles.wizardFooterCancel}>
            <Button variant="link" onClick={onClose}>
              {cancelButtonText}
            </Button>
          </div>
        )}
      </span>
      {rightButtons && (
        <span className="kui--wizard-footer--bottom-right">
          {rightButtons && rightButtons.map((_, idx) => <Button key={idx} {..._} />)}
        </span>
      )}
    </span>
  </footer>
)
WizardFooterInternal.displayName = 'WizardFooterInternal'

export default WizardFooterInternal
