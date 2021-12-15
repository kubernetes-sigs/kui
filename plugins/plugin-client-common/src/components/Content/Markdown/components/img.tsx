/*
 * Copyright 2020 The Kubernetes Authors
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

/* eslint-disable react/prop-types */

import React from 'react'
import { dirname, isAbsolute, join } from 'path'

import { Props } from '../../Markdown'

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  // hack this in there...
  align?: React.CSSProperties['float']
}

function allContentIsRemote(props: Props): boolean {
  return typeof props.baseUrl === 'string'
}

function handleImage(mdprops: Props, props: ImgProps, key?: string) {
  let { src } = props

  const isHttp = /^http/i.test(src)
  const isLocal = !isHttp && !allContentIsRemote(mdprops)
  if (isLocal) {
    const absoluteSrc = isAbsolute(src)
      ? src
      : join(mdprops.fullpath ? dirname(mdprops.fullpath) : mdprops.baseUrl || process.cwd(), src)
    src = absoluteSrc
  } else if (!isHttp && mdprops.baseUrl) {
    // then this is a relative path against
    src = `${mdprops.baseUrl}${!/\/$/.test(mdprops.baseUrl) ? '/' : ''}${src}`
  }

  const style = props ? { float: props.align } : undefined
  return <img key={key} src={src} height={props.height} width={props.width} style={style} data-float={props.align} />
}

export default function img(mdprops: Props) {
  return function Img(props: ImgProps) {
    return handleImage(mdprops, props) || <img {...props} />
  }
}
