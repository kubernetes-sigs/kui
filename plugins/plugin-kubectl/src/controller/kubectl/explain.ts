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

import { Arguments, Breadcrumb, Registrar, i18n } from '@kui-shell/core'

import flags from './flags'
import { split, apiVersionString } from './fqn'
import { doExecWithStdout } from './exec'
import { isUsage, doHelp } from '../../lib/util/help'
import { KubeOptions, withKubeconfigFrom } from './options'

import fastPathCases from './explain-fastpath'
import OpenShiftFasthpathCases from './explain-openshift-fasthpath'

const strings = i18n('plugin-kubectl')

function formatHref(href: string) {
  if (/api-conventions/.test(href) && !/sig-architecture/.test(href)) {
    return href.replace(/api-conventions/, 'sig-architecture/api-conventions')
  } else {
    return href
  }
}

function formatDocumentation(description: string) {
  return description
    .replace(/\n/g, ' ')
    .replace(
      /(More info:\s+)?(https:\/\/.*)/,
      (_, _2, href) => `\n\n[Consult official Kubernetes documentation](${formatHref(href)})`
    )
}

function formatField(cmdline: string, _: string[]) {
  return {
    mode: _[1],
    contentType: 'text/markdown',
    content: `### Type
${_[2]}
### Documentation
${formatDocumentation(_[4])}

[Explain this field](#kuiexec?command=${encodeURIComponent(cmdline + '.' + _[1])})
`
  }
}

/** alternate patterns to match against */
const kvd = /^KIND:\s+(\S+)\nVERSION:\s+(\S+)(\n\nRESOURCE:\s+(\S+).*)?\n\nDESCRIPTION:\n(\s*DEPRECATED - )?([\s\S]+)/
const kvdf =
  /^KIND:\s+(\S+)\nVERSION:\s+(\S+)(\n\nRESOURCE:\s+(\S+).*)?\n\nDESCRIPTION:\n(\s*DEPRECATED - )?([\s\S]+)\n\nFIELDS:\n([\s\S]+)/
const kvfd = /^KIND:\s+(\S+)\nVERSION:\s+(\S+)\n\nFIELD:\s+(\S+)\s+(.*)\n\nDESCRIPTION:\n(\s*DEPRECATED - )?([\s\S]+)/

export const doExplain = (command = 'kubectl') =>
  async function (args: Arguments<KubeOptions>) {
    if (isUsage(args)) {
      // special case: get --help/-h
      return doHelp(command, args)
    }

    // first, we do the raw exec of the given command
    const response = await doExecWithStdout(args, undefined, command)

    try {
      // look first for a full Kind Version Description Fields;
      // otherwise, look for just Kind Version Description
      const match = response.match(kvdf) || response.match(kvd)
      const match2 = !match && response.match(kvfd)

      if (match || match2) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const kind = match ? match[1] : match2[1]
        const version = match ? match[2] : match2[2]
        const resource = match && match[4]
        const field = match2 && match2[3]
        const fieldType = match2 && match2[4]
        const isDeprecated = match ? match[5] : match2[5]
        const description = match ? match[6] : match2[6]
        const fields = match && match[7]
        // const [_, kind, version, _2, resource, isDeprecated, description, fields] = match

        const fieldSections = !fields
          ? []
          : fields
              .split(/\n\n/)
              .filter(_ => _)
              .map(_ => _.match(/\s*(\S+)\s+<(\S+)>( -required-)?\n\s*([\s\S]*)/))
              .filter(_ => _)

        const requiredFields = fieldSections.filter(_ => _[3])
        const notRequiredFields = fieldSections.filter(_ => !_[3])

        const topBreadcrumb: Breadcrumb = { label: 'API Resources', command: 'kubectl api-resources' }

        const apiGroup = version ? version.match(/^([^/]+)\//) : undefined
        const apiGroupBreadcrumb: Breadcrumb[] = !apiGroup
          ? []
          : [{ label: apiGroup[1], command: `kubectl api-resources --api-group ${apiGroup[1]}` }]

        const resourceBreadcrumb: Breadcrumb[] = !resource ? [] : [{ label: resource }]

        const fieldBreadcrumb: Breadcrumb[] = !match2 ? [] : [{ label: field }]

        const format = formatField.bind(undefined, args.command)

        return {
          apiVersion: 'kui-shell/v1',
          kind: 'NavResponse',
          breadcrumbs: [topBreadcrumb]
            .concat(apiGroupBreadcrumb)
            .concat([{ label: kind, command: resource || field ? `kubectl explain ${kind}` : '' }])
            .concat(resourceBreadcrumb)
            .concat(fieldBreadcrumb),
          menus: [
            {
              label: resource || kind,
              items: [
                {
                  mode: 'Overview',
                  contentType: 'text/markdown',
                  content: `### Description
#### ${description.replace(/\n/g, ' ')}
${
  match2
    ? `### Type\n${fieldType
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\[/g, '&#91;')
        .replace(/\]/g, '&#93;')}`
    : ''
}
### Version
${version}
${isDeprecated ? `### Warnings\n${strings('This API Resource is deprecated')}` : ''}
    `
                }
              ]
            }
          ]
            .concat(
              requiredFields.length === 0 ? [] : [{ label: 'Required Fields', items: requiredFields.map(format) }]
            )
            .concat(notRequiredFields.length === 0 ? [] : [{ label: 'Fields', items: notRequiredFields.map(format) }])
        }
      }
    } catch (err) {
      console.error('error parsing explaing', err)
    }

    return response
  }

export interface Explained {
  /** e.g. Deployment */
  kind: string

  /** e.g. apps/v1 */
  version: string

  /** Is this resource kind cluster-scoped (versus namespace-scoped)? */
  isClusterScoped: boolean
}

/**
 * Cache of the getKind() lookup
 *
 */
const cache: Record<string, Promise<Explained>> = {}

const isClusterScoped = {
  cs: true,
  'ComponentStatus.v1': true,
  componentstatus: true,
  componentstatuses: true,

  ns: true,
  namespace: true,
  'Namespace.v1': true,
  namespaces: true,

  no: true,
  'Node.v1': true,
  node: true,
  nodes: true,

  pv: true,
  'PersistentVolume.v1': true,
  persistentvolume: true,
  persistentvolumes: true,

  crd: true,
  crds: true,
  'CustomResourceDefinition.apiextensions.k8s.io/v1': true,
  'customresourcedefinitions.apiextensions.k8s.io': true,

  csr: true,
  'CertificateSigningRequest.certificates.k8s.io/v1': true,
  'certificatesigningrequests.certificates.k8s.io': true,

  psp: true,
  'PodSecurityPolicy.policy/v1': true,
  'podsecuritypolicies.policy': true,

  pc: true,
  'PriorityClass.scheduling.k8s.io/v1': true,
  'priorityclasses.scheduling.k8s.io': true,

  sc: true,
  'StorageClass.storage.k8s.io/v1': true,
  'storageclasses.storage.k8s.io': true,

  'MutatingWebhookConfiguration.admissionregistration.k8s.io/v1': true,
  'mutatingwebhookconfigurations.admissionregistration.k8s.io': true,

  'ValidatingWebhookConfiguration.admissionregistration.k8s.io/v1': true,
  'validatingwebhookconfigurations.admissionregistration.k8s.io': true,

  'APIService.apiregistration.k8s.io/v1': true,
  'apiservices.apiregistration.k8s.io': true,

  'TokenReview.authentication.k8s.io/v1': true,
  'tokenreviews.authentication.k8s.io': true,

  'SelfSubjectAccessReview.authorization.k8s.io/v1': true,
  'selfsubjectaccessreviews.authorization.k8s.io': true,

  'SelfSubjectRulesReview.authorization.k8s.io/v1': true,
  'selfsubjectrulesreviews.authorization.k8s.io': true,

  'SubjectAccessReview.authorization.k8s.io/v1': true,
  'subjectaccessreviews.authorization.k8s.io': true,

  'Node.metrics.k8s.io/v1': true,
  'nodes.metrics.k8s.io': true,

  'ClusterRoleBinding.rbac.authorization.k8s.io/v1': true,
  'clusterrolebindings.rbac.authorization.k8s.io': true,

  'ClusterRole.rbac.authorization.k8s.io/v1': true,
  'clusterroles.rbac.authorization.k8s.io': true,

  'ClusterRbacConfig.rbac.istio.io/v1': true,
  'clusterrbacconfigs.rbac.istio.io': true,

  'CSIDriver.storage.k8s.io/v1': true,
  'csidrivers.storage.k8s.io': true,

  'CSINode.storage.k8s.io/v1': true,
  'csinodes.storage.k8s.io': true,

  'VolumeAttachment.storage.k8s.io/v1': true,
  'volumeattachments.storage.k8s.io': true
}

/** Handle cache miss */
async function fetch(command: string, args: Arguments, kindAsProvidedByUser: string): Promise<Explained> {
  try {
    const { kind, group, version } = split(kindAsProvidedByUser)
    const apiVersion = apiVersionString(version, group)
    const ourArgs = Object.assign({}, args, {
      // Note: explain does not seem to like a FQN such as HorizontalPodAutoscaler.v1.autoscaling
      // hence we split and extract just the kind
      command: withKubeconfigFrom(args, `${command} explain ${kind}${apiVersion ? ` --api-version=${apiVersion}` : ''}`)
    })
    const explained = await doExecWithStdout(ourArgs, undefined, command)

    const match = explained.match(/^KIND:\s+(.*)\nVERSION:\s+(.*)/)
    if (match) {
      const kind = match[1]
      const version = match[2]

      return {
        kind,
        version,
        isClusterScoped: isClusterScoped[`${kind}.${version}`] || false
      }
    } else {
      return {
        kind: kindAsProvidedByUser,
        version: 'v1',
        isClusterScoped: isClusterScoped[kindAsProvidedByUser] || false
      }
    }
  } catch (err) {
    if (
      !/does not exist/i.test(err.message) &&
      !/couldn't find resource/i.test(err.message) &&
      !/resource type/i.test(err.message)
    ) {
      console.error(`error explaining kind ${kindAsProvidedByUser}`, args, err)
      throw err
    } else {
      return { kind: '', version: '', isClusterScoped: undefined }
    }
  }
}

export function getKindAndVersion(command: string, args: Arguments, kindAsProvidedByUser: string): Promise<Explained> {
  if (kindAsProvidedByUser) {
    const fastPath = fastPathCases[kindAsProvidedByUser] || OpenShiftFasthpathCases[kindAsProvidedByUser]
    if (fastPath) {
      // we have precomputed some of the common cases
      return Promise.resolve(fastPath)
    } else if (!cache[kindAsProvidedByUser]) {
      // otherwise, we need to do a more expensive call to `kubectl`
      cache[kindAsProvidedByUser] = fetch(command, args, kindAsProvidedByUser)
    }

    return cache[kindAsProvidedByUser]
  }
}

/**
 * @param kindAsProvidedByUser e.g. pod or po
 * @return e.g. Pod
 *
 */
export async function getKind(command: string, args: Arguments, kindAsProvidedByUser: string): Promise<string> {
  return (await getKindAndVersion(command, args, kindAsProvidedByUser)).kind
}

export default (registrar: Registrar) => {
  const handler = doExplain()
  registrar.listen('/kubectl/explain', handler, flags)
  registrar.listen('/k/explain', handler, flags)
}
