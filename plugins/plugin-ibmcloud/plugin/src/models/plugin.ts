/*
 * Copyright 2019 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ResourceWithMetadata } from '@kui-shell/core'
import { WithRawData, WithSummary } from '@kui-shell/plugin-kubectl'
import { WithVersion } from '@kui-shell/plugin-ibmcloud/ks'

import apiVersion from '../controller/apiVersion'

export interface SemVer {
  Major: number
  Minor: number
  Build: number
}

interface Flag {
  Name: string
  Description: string
  HasValue: boolean
  Hidden: boolean
}

interface Namespace {
  ParentName: string
  Name: string
  Aliases: null | string[]
  Description: string
  Stage: string
}

interface Command {
  Namespace: string
  Name: string
  Alias: string
  Aliases: string[]
  Description: string
  Usage: string
  Flags: null | Flag[]
  Hidden: boolean
  Stage: string
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBMCloudInstalledPluginRaw {
  Name: string
  Aliases: string[]
  Version: SemVer
  MinCliVersion: SemVer
  Namespaces: null | Namespace[]
  Commands: Command[]
  SDKVersion: {
    Major: 0
    Minor: 2
    Build: 0
  }
  DelegateBashCompletion: boolean
}

export interface InstalledPluginsRaw {
  Plugins: Record<string, IBMCloudInstalledPluginRaw>
}

interface AvailablePluginVersion {
  version: string
  updated: string
  doc_url: string
  min_cli_version: string
  binaries: {
    platform: string
    url: string
    checksum: string
  }[]
  api_versions: null | string[]
  release_notes_link: string
}

export interface AvailablePluginRaw {
  name: string
  aliases: null | string[]
  description: string
  created: string
  updated: string
  company: string
  homepage: string
  authors: string[]
  versions: AvailablePluginVersion[]
  tags: null | string[]
}

export type PluginStatus = 'Ready' | 'Update Available' | 'Available' | 'Deprecated'

export function trafficLight(status: PluginStatus): string {
  return status === 'Ready'
    ? 'green-background'
    : status === 'Update Available'
    ? 'yellow-background'
    : status === 'Deprecated'
    ? 'red-background'
    : 'gray-background'
}

export type IBMCloudPlugin = ResourceWithMetadata<IBMCloudInstalledPluginRaw> &
  WithSummary &
  WithVersion<IBMCloudInstalledPluginRaw> &
  WithRawData<IBMCloudInstalledPluginRaw> & {
    apiVersion
    kind: 'Plugin'
    isSimulacrum: true
    spec: {
      updateAvailable: boolean
      status: PluginStatus
    }
  }

/**
 * Is the given resource an instance of a Kui ibmcloud plugin?
 *
 */
export function isIBMCloudPlugin(resource: ResourceWithMetadata): resource is IBMCloudPlugin {
  const plugin = resource as IBMCloudPlugin
  return plugin.apiVersion === apiVersion && plugin.kind === 'Plugin'
}

export function isIBMCloudPluginWithAvailableUpdates(resource: ResourceWithMetadata): resource is IBMCloudPlugin {
  return isIBMCloudPlugin(resource) && resource.spec.updateAvailable
}

export function isIBMCloudPluginWithCommands(resource: ResourceWithMetadata): resource is IBMCloudPlugin {
  return isIBMCloudPlugin(resource) && resource.content.Commands.length > 0
}

export type IBMCloudPluginCommand = ResourceWithMetadata<IBMCloudInstalledPluginRaw> &
  WithSummary & {
    apiVersion
    kind: 'Command'
    isSimulacrum: true
    spec: {
      usage: string
    }
  }

/**
 * Is the given resource an instance of a Kui ibmcloud plugin command?
 *
 */
export function isIBMCloudPluginCommand(resource: ResourceWithMetadata): resource is IBMCloudPluginCommand {
  const command = resource as IBMCloudPluginCommand
  return command.apiVersion === apiVersion && command.kind === 'Command'
}
