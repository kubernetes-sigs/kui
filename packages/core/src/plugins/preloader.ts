/*
 * Copyright 2017 IBM Corporation
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

import Debug from 'debug'
const debug = Debug('core/plugins/preloader')
debug('loading')

import { PrescanModel } from './prescan'

import { MetadataBearing } from '../models/entity'
import { ImplForPlugins } from '../core/command-tree'
import { registerBadge, registerMode, BadgeRegistration, ModeRegistration } from '../api/registrars'
import { PreloadRegistration, PreloadRegistrar, CapabilityRegistration } from '../models/plugin'

class PreloaderRegistrarImpl extends ImplForPlugins implements PreloadRegistrar {
  // why does eslint consider this to be a useless constructor??
  // eslint-disable-next-line no-useless-constructor
  public constructor(plugin: string) {
    super(plugin)
  }

  public registerMode<Resource extends MetadataBearing>(registration: ModeRegistration<Resource>): void {
    registerMode(registration)
  }

  public registerModes<Resource extends MetadataBearing>(...registrations: ModeRegistration<Resource>[]): void {
    registrations.forEach(_ => this.registerMode(_))
  }

  public registerBadge<Resource extends MetadataBearing>(registration: BadgeRegistration<Resource>): void {
    registerBadge(registration)
  }

  public registerBadges<Resource extends MetadataBearing>(...registrations: BadgeRegistration<Resource>[]): void {
    registrations.forEach(_ => this.registerBadge(_))
  }
}

/**
 * This module allows for plugins to register themselves to be
 * preloaded at startup, rather than in response to a user command
 *
 */
export default async (prescan: PrescanModel) => {
  debug('init')

  const jobs = Promise.all(
    prescan.preloads.map(async module => {
      // extends the capabilities of Kui
      try {
        debug('preloading capabilities.1 %s', module.path)
        const registrationRef =
          module.path.charAt(0) === '/'
            ? await import(module.path)
            : await import('@kui-shell/plugin-' + module.path.replace(/^plugin-/, ''))
        debug('preloading capabilities.2 %s', module.path)
        const registration: CapabilityRegistration = registrationRef.registerCapability
        if (registration) {
          await registration()
          debug('registered capabilities %s', module.path)
        } else {
          debug('no registered capabilities %s', module.path)
        }
      } catch (err) {
        debug('error registering capabilities', module.path, err)
        console.error(err)
      }
    })
  ).then(() =>
    Promise.all(
      prescan.preloads.map(async module => {
        // FIXME to support field-installed plugin paths
        try {
          debug('preloading misc %s', module.path)
          // NOTE ON @kui-shell relativization: this is important so that
          // webpack can be isntructed to pull in the plugins into the
          // build see the corresponding NOTE in ./assembler.ts and
          // ./plugins.ts
          const registrationRef =
            module.path.charAt(0) === '/'
              ? await import(module.path)
              : await import('@kui-shell/plugin-' + module.path.replace(/^plugin-/, ''))
          const registration: PreloadRegistration = registrationRef.default || registrationRef
          await registration(new PreloaderRegistrarImpl(module.route))
          debug('done preloading %s', module.path)
        } catch (err) {
          debug('error invoking preload', module.path, err)
          console.error(err)
        }
      })
    )
  )

  try {
    await jobs
  } catch (err) {
    console.error(err)
  }

  debug('done')
}
