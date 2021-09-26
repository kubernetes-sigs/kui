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

import Debug from 'debug'
const debug = Debug('core/plugins/preloader')
debug('loading')

/* eslint-disable @typescript-eslint/camelcase */

import { PrescanModel } from './prescan'

import { Tab } from '../webapp/tab'
import { mainPath, webpackPath } from './path'
import { isHeadless } from '../core/capabilities'
import { MetadataBearing } from '../models/entity'
import { ImplForPlugins } from '../core/command-tree'
import { registerSidecarBadge as registerBadge, BadgeRegistration } from '../webapp/views/registrar/badges'
import { registerSidecarMode as registerMode, ModeRegistration } from '../webapp/views/registrar/modes'
import { PreloadRegistration, PreloadRegistrar, CapabilityRegistration } from '../models/plugin'
import { SessionInitializer, registerSessionInitializer } from '../session/registrar'

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

  /** session initializers */
  public registerSessionInitializer(init: SessionInitializer): void {
    registerSessionInitializer(init)
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
            ? await import(/* webpackIgnore: true */ module.path)
            : isHeadless() && !process.env.KUI_HEADLESS_WEBPACK
            ? await import(/* webpackIgnore: true */ mainPath(module.path))
            : module.route === 'client'
            ? require(/* webpackMode: "lazy" */ '@kui-shell/client/' + 'mdist/preload')
            : await import(
                /* webpackChunkName: "kui-plugin" */ /* webpackMode: "lazy" */ '@kui-shell/plugin-' +
                  webpackPath(module.route) +
                  '/mdist/preload'
              )
        debug('preloading capabilities.2 %s', module.path)
        const registration: CapabilityRegistration = registrationRef.registerCapability
        if (registration && typeof registration === 'function') {
          await registration(new PreloaderRegistrarImpl(module.route))
          debug('registered capabilities %s', module.path)
        } else {
          debug('no registered capabilities %s', module.path)
        }
      } catch (err) {
        debug('error registering capabilities', module.path, err)
        console.error(err)
      }
    })
  )
    .then(async () => {
      await import('../core/events').then(({ eventBus }) => {
        eventBus.once('/tab/new', (tab: Tab) => {
          if (tab._kui_session === undefined) {
            tab._kui_session = Promise.resolve()
          }
        })
      })
    })
    .then(() =>
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
                ? await import(/* webpackIgnore: true */ module.path)
                : isHeadless() && !process.env.KUI_HEADLESS_WEBPACK
                ? await import(/* webpackIgnore: true */ mainPath(module.path))
                : module.route === 'client'
                ? require(/* webpackMode: "lazy" */ '@kui-shell/client/' + 'mdist/preload')
                : await import(
                    /* webpackMode: "lazy" */ '@kui-shell/plugin-' + webpackPath(module.route) + '/mdist/preload'
                  )
            const registration: PreloadRegistration = registrationRef.default || registrationRef
            if (registration && typeof registration === 'function') {
              await registration(new PreloaderRegistrarImpl(module.route))
            }
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
