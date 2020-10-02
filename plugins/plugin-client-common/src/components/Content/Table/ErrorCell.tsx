/*
 * Copyright 2020 IBM Corporation
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

export default function ErrorCell() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path fill="var(--color-base0E)" d="M0 0H24V24H0z"></path>
        <path
          fill="var(--color-base00)"
          d="M15.0914286 16L12 12.9085714 8.90857143 16 8 15.0914286 11.0914286 12 8 8.90857143 8.90857143 8 12 11.0914286 15.0914286 8 16 8.90857143 12.9085714 12 16 15.0914286z"
        ></path>
      </g>
    </svg>
  )
}
