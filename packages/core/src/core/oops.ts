/*
 * Copyright 2017 The Kubernetes Authors
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

/* eslint-disable no-use-before-define */

interface ErrorWithResultField {
  error: {
    response: {
      result: {
        error: string
      }
    }
  }
}

function isErrorWithResultField(error: ErrorLike): error is ErrorWithResultField {
  const err = error as ErrorWithResultField
  return !!(err.error && err.error.response && err.error.response.result && err.error.response.result.error)
}

interface ErrorWithNestedResultField {
  error: {
    response: {
      result: {
        error: {
          error: string
        }
      }
    }
  }
}

function isErrorWithNestedResultField(error: ErrorLike): error is ErrorWithNestedResultField {
  const err = error as ErrorWithNestedResultField
  return !!(
    err.error &&
    err.error.response &&
    err.error.response.result &&
    err.error.response.result.error &&
    err.error.response.result.error.error
  )
}

interface ErrorWithNestedErrorField {
  error: {
    error: string
  }
}

function isErrorWithNestedErrorField(error: ErrorLike): error is ErrorWithNestedErrorField {
  const err = error as ErrorWithNestedErrorField
  return !!(err.error && err.error.error)
}

interface ErrorWithErrorField {
  message?: string
  error: string
}

function isErrorWithErrorField(error: ErrorLike): error is ErrorWithErrorField {
  const err = error as ErrorWithErrorField
  return !!(err.error && !err.message)
}

type ErrorLike =
  | string
  | Error
  | ErrorWithResultField
  | ErrorWithNestedResultField
  | ErrorWithNestedErrorField
  | ErrorWithErrorField

/**
 * Try to pull out some meaningful message from the given error
 *
 */
export const oopsMessage = (err: ErrorLike): string => {
  try {
    if (typeof err === 'string') {
      return err
    } else if (typeof err === 'undefined') {
      return ''
    } else if (isErrorWithNestedResultField(err)) {
      return err.error.response.result.error.error // feed creation error. nice
    } else if (isErrorWithResultField(err)) {
      return err.error.response.result.error
    } else if (isErrorWithNestedErrorField(err)) {
      return err.error.error
    } else if (isErrorWithErrorField(err)) {
      return err.error
    } else {
      return err.message || 'Internal Error'
    }
  } catch (err) {
    console.error(err)
    return 'Internal Error'
  }
}
