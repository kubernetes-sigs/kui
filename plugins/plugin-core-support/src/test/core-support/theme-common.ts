/*
 * Copyright 2019 The Kubernetes Authors
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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

export const defaultTheme = 'PatternFly4 Light'

export const resetTheme = (ctx: Common.ISuite) => {
  it('should reset theme preference', () =>
    CLI.command('theme reset', ctx.app).then(ReplExpect.justOK).catch(Common.oops(ctx, true)))

  it(`should show that we are using the default theme: ${defaultTheme}`, () =>
    CLI.command('theme current', ctx.app)
      .then(ReplExpect.okWithString(defaultTheme))
      .then(() => ctx.app.client.$(`body[kui-theme="${defaultTheme}"]`)) // Dark being the default
      .then(_ => _.waitForExist())
      .catch(Common.oops(ctx, true)))
}
