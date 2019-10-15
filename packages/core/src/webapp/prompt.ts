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

import { basename } from 'path'

import { isPopup } from './popup-core'
import { getInitialBlock, getCurrentBlock } from './block'
import { Tab, getCurrentTab, getTabFromTarget } from './tab'

import { getSidecar } from './views/sidecar-core'

import { ExecOptions, DefaultExecOptions } from '../models/execOptions'
import { inElectron } from '../core/capabilities'
import { inBottomInputMode } from '../core/settings'

export interface Prompt extends HTMLInputElement {
  execOptions?: ExecOptions
}

export const getBlockOfPrompt = (prompt: HTMLInputElement): HTMLElement => {
  return prompt.parentElement.parentElement
}

export const getPrompt = (block: HTMLElement): Prompt => {
  return block && block.querySelector && block.querySelector('input')
}

export const getBottomPrompt = (): HTMLInputElement => {
  return getPrompt(document.querySelector('.kui--input-stripe .repl-block'))
}

export const getInitialPrompt = (tab: Tab): HTMLInputElement => {
  return getPrompt(getInitialBlock(tab))
}

export const getCurrentPrompt = (tab = getCurrentTab()): Prompt => {
  if (isPopup()) {
    return getSidecar(tab).querySelector('input')
  } else if (inBottomInputMode) {
    return getPrompt(document.querySelector('.kui--input-stripe'))
  } else {
    return getPrompt(getCurrentBlock(tab))
  }
}

export const getPromptFromTarget = (target: EventTarget): HTMLInputElement => {
  return getCurrentPrompt(getTabFromTarget(target))
}

export const getPromptLeft = (block: Element) => {
  return block.querySelector('.repl-prompt-righty')
}

export const getCurrentPromptLeft = (tab: Tab) => {
  if (inBottomInputMode) {
    return getPromptLeft(document.querySelector('.kui--input-stripe'))
  } else {
    return getPromptLeft(getCurrentBlock(tab))
  }
}

export function installContext(block: HTMLElement) {
  if (inElectron()) {
    const cwd = process.cwd() === process.env.HOME ? '~' : basename(process.cwd())
    const promptContextContainer = block.querySelector('.repl-context') as HTMLElement
    promptContextContainer.innerText = cwd
  }
}

/**
 * Has a plugin taken ownership of the prompt?
 *
 */
export function isUsingCustomPrompt(prompt: HTMLInputElement) {
  return getBlockOfPrompt(prompt).classList.contains('using-custom-prompt')
}

/**
 * Paste a command, but do not eval it
 *
 */
export const partial = (cmd: string, execOptions: ExecOptions = new DefaultExecOptions()) => {
  const prompt = getCurrentPrompt()
  if (prompt) {
    // debug('applying partial', cmd)
    prompt.value = cmd
    prompt.execOptions = execOptions
    prompt.classList.add('repl-partial')
    prompt.focus()
    setTimeout(() => prompt.classList.remove('repl-partial'), 1000)
  } else {
    // debug('retrying partial', cmd)
    setTimeout(() => partial(cmd, execOptions), 100)
  }
}

/**
 * A plugin temporary wishes to manage the prompt, e.g. reverse-i-search
 *
 */
export function setUsingCustomPrompt(block: HTMLElement) {
  block.classList.add('using-custom-prompt')
}

/**
 * A plugin temporary wishes to relinquish management of the prompt
 *
 */
export function unsetUsingCustomPrompt(block: HTMLElement) {
  block.classList.remove('using-custom-prompt')
}
