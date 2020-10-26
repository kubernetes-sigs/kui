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

import Debug from 'debug'

import { KeyVal, Limits } from 'openwhisk'
import { isHeadless, Arguments, ParsedOptions, Registrar, MultiModalResponse } from '@kui-shell/core'

import ok from '../ok'
import toDict from '../dict'
import kvOptions from '../key-value'
import respondWith from './as-trigger'
import { Trigger } from '../../models/resource'
import { synonyms } from '../../models/synonyms'
import { clientOptions, getClient } from '../../client/get'
import { trigger, maybeDeployedTrigger, feed, paramsAndAnnotations, withStandardOptions } from '../usage'

const debug = Debug('openwhisk/trigger/create')

const createUsage = {
  command: 'create',
  strict: 'create',
  docs: 'create new trigger',
  example: 'wsk trigger create <trigger>',
  required: trigger,
  optional: feed.concat(paramsAndAnnotations)
}

const updateUsage = {
  command: 'update',
  strict: 'update',
  docs: 'update an existing an trigger, or create one if it does not exist',
  example: 'wsk trigger update <trigger>',
  required: maybeDeployedTrigger,
  optional: feed.concat(paramsAndAnnotations)
}

export interface Options extends ParsedOptions {
  feed?: string
}

interface Spec {
  name: string
  overwrite: boolean
  trigger: {
    name: string
    limits: Limits
    annotations: KeyVal[]
    parameters: KeyVal[]
  }
}

/**
 * We must invoke the CREATE lifecycle event for feed creation
 *
 */
const createTrigger = (verb: string, overwrite: boolean) => async ({
  argv,
  parsedOptions: options,
  execOptions
}: Arguments<Options>): Promise<HTMLElement | MultiModalResponse<Trigger>> => {
  const {
    nameIdx,
    argvNoOptions,
    kv: { annotations, limits, parameters }
  } = kvOptions(argv, verb)
  const name = argvNoOptions[nameIdx]
  const ow = getClient(execOptions)

  const triggerSpec: Spec = Object.assign(
    {
      name: name,
      overwrite,
      trigger: {
        name: name,
        limits,
        annotations,
        parameters
      }
    },
    clientOptions
  )

  if (options.feed) {
    // add the feed annotation
    const annotation = { key: 'feed', value: options.feed }
    debug('adding feed annotation', annotation)
    triggerSpec.trigger.annotations.push(annotation)
  }

  debug('creating trigger', triggerSpec)
  const raw = await ow.triggers.create(triggerSpec).then(trigger => {
    /** remove trigger if something bad happened instantiating the feed */
    const removeTrigger = (err: Error) => {
      console.error(err)
      ow.triggers.delete({ name })
      throw new Error('Internal Error')
    }

    if (options.feed) {
      try {
        // special case of feed: invoke CREATE lifecycle
        const feedName = options.feed

        const params = toDict(parameters)
        debug('create feed', feedName, name, params)
        return ow.feeds
          .create(Object.assign({ name: feedName, trigger: name, params }, clientOptions))
          .then(() => trigger) // return the trigger, not the result of invoking the feed lifecycle
          .catch(removeTrigger) // catastrophe, clean up after ourselves
      } catch (err) {
        // make sure to clean up after ourselves in case of catastrophe
        return removeTrigger(err)
      }
    } else {
      // otherwise, this is a normal trigger, not a feed
      return trigger
    }
  })

  if (isHeadless()) {
    return ok(`updated trigger ${name}`)
  } else {
    return respondWith(raw)
  }
}

export default (registrar: Registrar) => {
  synonyms('triggers').forEach(syn => {
    registrar.listen(`/wsk/${syn}/create`, createTrigger('create', false), withStandardOptions(createUsage))
    registrar.listen(`/wsk/${syn}/update`, createTrigger('update', true), withStandardOptions(updateUsage))
  })
}
