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

export const s3 = {
  title: {
    command: 'browse s3',
    doc: `Pop open a window to visually browse and preview cloud objects`
  }
}

export const cc = (cc: string) => ({
  title: {
    command: `browse ${cc}`,
    doc: `Pop open a window to visually browse and preview CommonCrawl data`
  },
  intro:
    'CommonCrawl is a repository of 10+ years of mined data about web sites around the world. https://commoncrawl.org/'
})

export const browse = {
  title: { command: 'browse', doc: 'Pop open a window to visually browse and preview files' },
  examples: [
    { command: s3.title.command, doc: s3.title.doc },
    { command: cc('cc').title.command, doc: cc('cc').title.doc }
  ]
}
