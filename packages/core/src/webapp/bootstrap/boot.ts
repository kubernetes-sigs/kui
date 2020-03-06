/*
 * Copyright 2018-2020 IBM Corporation
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

/** client-provided renderer of the main content */
type ClientRender = (container: Element) => void

function catastrophe(err: Error) {
  console.error('restart needed')
  console.error(err)
  document.body.classList.add('oops-total-catastrophe')
}

async function initCommandRegistrar() {
  const { init } = await import('../../commands/tree')
  await init()
}

/**
 * Invoked on the domReady event.
 *
 * @param { ClientRender } clientMain client-provided renderer of main content
 *
 */
const domReady = (inSanbox: boolean, renderMain?: ClientRender) => async () => {
  const initializer = import('./init')
  const plugins = import('../../plugins/plugins')
  const events = import('../../core/events')
  // const query = import('../query')

  try {
    const waitForThese: Promise<void>[] = []

    const commands = initCommandRegistrar()

    waitForThese.push(
      plugins.then(async _ => {
        await _.init()
        await commands
        await _.preload()
      })
    )

    waitForThese.push(
      document.body.classList.contains('in-electron')
        ? import(/* webpackChunkName: "electron" */ /* webpackMode: "lazy" */ '../electron-events').then(_ => _.init())
        : Promise.resolve()
    )

    waitForThese.push(waitForThese[1].then(() => initializer).then(_ => _.init(inSanbox)))

    // await query.then(_ => _.init())

    await Promise.all(waitForThese)

    document.body.classList.remove('still-loading')
    events.then(eventBus => {
      eventBus.default.emit('/init/done')
      if (renderMain) {
        renderMain(document.body.querySelector('main'))
      }
    })
  } catch (err) {
    catastrophe(err)
  }
}

/**
 * Usage: clients will invoke this with their main renderer.
 *
 * For reference, the HTML template is to be found in
 * ../../../templates/index.ejs. This template is in turn managed by
 * packages/webpack/webpack.config.js.
 *
 * @param renderer a function that injects its content into the given
 * container
 *
 */
export default async (renderMain: ClientRender) => {
  import('./init').then(_ => _.preinit(false))
  window.addEventListener('load', domReady(false, renderMain), { once: true })
}

/** For booting into an external browser sandbox, such as codesandbox.io */
export async function bootIntoSandbox() {
  const { setMedia, Media } = await import('../../core/capabilities')
  setMedia(Media.Browser)
  await import('./init').then(_ => _.preinit(true))
  await domReady(true)
}
