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
 * Map a asynchronous function to an array sequentially from front to
 * back.
 *
 */
export async function promiseEach<T, R>(arr: T[], fn: (t: T) => Promise<R>): Promise<R[]> {
  const result = []
  for (const item of arr) {
    result.push(await fn(item))
  }
  return result
}
