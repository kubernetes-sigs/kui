/*
 * Copyright 2021 The Kubernetes Authors
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

type Props = {
  'aria-label'?: string
  autoResize?: boolean
  autoCorrect?: 'on' | 'off'
  autoComplete?: 'on' | 'off'
  spellCheck?: 'true' | 'false'
  autoCapitalize?: 'on' | 'off'
  className?: string
  ref?: React.RefObject<any>
  innerRef?: React.RefObject<any>
  isDisabled?: boolean
  isReadOnly?: boolean
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void
  resizeOrientation?: 'horizontal' | 'vertical' | 'both'
  validated?: 'success' | 'warning' | 'error' | 'default'
  value?: string
  defaultValue?: string

  autoFocus?: boolean
  tabIndex?: number
  onBlur?: (evt: React.FocusEvent<HTMLTextAreaElement>) => void
  onFocus?: (evt: React.FocusEvent<HTMLTextAreaElement>) => void
  onKeyDown?: (evt: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onKeyPress?: (evt: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export default Props
