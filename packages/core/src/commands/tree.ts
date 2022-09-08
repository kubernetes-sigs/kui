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

import {
  CatchAllHandler,
  Command,
  CommandTree,
  CommandTreeResolution,
  Disambiguator,
  KResponse,
  ParsedOptions
} from '../models/command'

import { ExecOptions } from '../models/execOptions'

/**
 * The exported interface around the internal command model
 * implementation.
 *
 */
interface CommandModel {
  catchalls: CatchAllHandler<KResponse, ParsedOptions>[]

  /**
   * Look up a command handler for the given `argv`. This is the main
   * Read part of a REPL.
   *
   */
  read<T extends KResponse, O extends ParsedOptions>(
    argv: string[],
    execOptions: ExecOptions,
    tryCatchalls?: boolean
  ): Promise<CommandTreeResolution<T, O>>

  /**
   * Call the given callback function `fn` for each node in the command tree
   *
   */
  forEachNode(fn: (command: Command<KResponse, ParsedOptions>) => void): void
}

/**
 * The internal implementation of the command tree
 *
 */
export class CommandModelImpl implements CommandModel {
  /** root of the tree model */
  private readonly _root: CommandTree = this.newTree()
  public get root(): CommandTree {
    return this._root
  }

  /** map from command name to disambiguations */
  private readonly _disambiguator: Disambiguator = {}
  public get disambiguator(): Disambiguator {
    return this._disambiguator
  }

  /** handlers for command not found */
  private readonly _catchalls: CatchAllHandler<KResponse, ParsedOptions>[] = []
  public get catchalls(): CatchAllHandler<KResponse, ParsedOptions>[] {
    return this._catchalls
  }

  /**
   * Look up a command handler for the given `argv`. This is the main
   * Read part of a REPL.
   *
   */
  public async read<T extends KResponse, O extends ParsedOptions>(
    argv: string[],
    execOptions: ExecOptions,
    tryCatchalls = true
  ): Promise<CommandTreeResolution<T, O>> {
    const { read: readImpl } = await import('../core/command-tree')
    return readImpl(this.root, argv, undefined, execOptions, tryCatchalls)
  }

  /**
   * Call the given callback function `fn` for each node in the command tree
   *
   */
  public forEachNode(fn: (command: Command<KResponse, ParsedOptions>) => void) {
    const iter = (root: Command<KResponse, ParsedOptions>) => {
      if (root) {
        fn(root)
        if (root.children) {
          for (const cmd in root.children) {
            iter(root.children[cmd])
          }
        }
      }
    }

    iter(this.root)
  }

  private newTree(): CommandTree {
    return {
      $: undefined,
      key: '/',
      route: '/',
      children: {},
      parent: undefined
    }
  }
}

interface WindowWithModel extends Window {
  _kuiCommandModel: CommandModelImpl
}

function isWindowWithModel(win: Window): win is WindowWithModel {
  return win && (win as WindowWithModel)._kuiCommandModel !== undefined
}

/**
 * Global state representing the current tree of registered commands
 *
 */
let theCommandModel: CommandModelImpl

/**
 * @return the command tree model for internal consumption within this
 * file
 *
 */
export function getModelInternal(): CommandModelImpl {
  return (typeof window !== 'undefined' && isWindowWithModel(window) && window._kuiCommandModel) || theCommandModel
}

/**
 * @return the command tree model for public consumption within the
 * rest of @kui-shell/core. For the model we present to plugins, see
 * `ImplForPlugins` in command-tree.ts
 *
 */
export function getModel(): CommandModel {
  return getModelInternal()
}

interface WindowWithModel extends Window {
  _kuiCommandModel: CommandModelImpl
}

export function init() {
  theCommandModel = new CommandModelImpl()

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any as WindowWithModel)._kuiCommandModel = theCommandModel
  }
}

export function initIfNeeded() {
  if (!theCommandModel) {
    init()
  }
}
