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

import { Registrar } from '@kui-shell/core'
import { defaultFlags, getTransformer as viewTransformer } from '@kui-shell/plugin-kubectl'

import kubeconfig from '../config/kubeconfig'

export default async function(registrar: Registrar) {
  ;['kubectl', 'k'].forEach(kubectl =>
    registrar.listen(
      `/ibmcloud/ce/${kubectl}`,
      async args =>
        args.REPL.qexec(
          args.command.slice(args.command.indexOf(kubectl)) +
            ` --kubeconfig ${args.REPL.encodeComponent(await kubeconfig(args))}`,
          undefined,
          undefined,
          args.execOptions
        ),
      Object.assign({ viewTransformer }, defaultFlags)
    )
  )
}
