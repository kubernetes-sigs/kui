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

import React from 'react'
import prettyMillis from 'pretty-ms'
import { Profiles } from 'madwizard'
import { Select, SelectOption, SelectOptionObject } from '@patternfly/react-core'

type Props = {
  selectedProfile?: string
  profiles?: Profiles.Profile[]
  onSelect: (profile: string) => void
}

type State = {
  selectIsOpen: boolean
  selectedProfile?: string
  selectDefaultOption?: string | SelectOptionObject
}

export default class ProfileSelect extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = {
      selectIsOpen: false,
      selectedProfile: props.selectedProfile
    }
  }

  private readonly _selectOnToggle = this.selectOnToggle.bind(this)
  private readonly _selectOnSelect = this.selectOnSelect.bind(this)

  private prettyMillis(duration: number) {
    if (duration < 1000) {
      return 'just now'
    } else {
      return prettyMillis(duration, { compact: true }) + ' ago'
    }
  }

  private selectOnToggle(selectIsOpen: boolean) {
    this.setState({ selectIsOpen })
  }

  private selectOnSelect(
    event: React.ChangeEvent<Element> | React.MouseEvent<Element>,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean | undefined
  ) {
    if (isPlaceholder) {
      this.clearSelection()
    } else {
      this.setState({
        selectDefaultOption: selection,
        selectIsOpen: false
      })
      this.props.onSelect(selection.toString())
    }
  }

  private clearSelection() {
    this.setState({
      selectDefaultOption: undefined,
      selectIsOpen: false
    })
  }

  public render() {
    return (
      <Select
        variant="single"
        placeholderText="Select a profile"
        aria-label="Profiles selector with description"
        onToggle={this._selectOnToggle}
        onSelect={this._selectOnSelect}
        selections={this.props.selectedProfile}
        isOpen={this.state.selectIsOpen}
        aria-labelledby="select-profile-label"
      >
        {this.props.profiles?.map((profile, index) => (
          <SelectOption
            key={index}
            value={profile.name}
            description={`Last used ${this.prettyMillis(Date.now() - profile.lastUsedTime)}`}
          />
        ))}
      </Select>
    )
  }
}
