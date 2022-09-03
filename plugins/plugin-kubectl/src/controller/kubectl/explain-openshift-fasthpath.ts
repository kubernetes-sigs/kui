/*
 * Copyright 2022 The Kubernetes Authors
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

/* eslint-disable @typescript-eslint/camelcase,@typescript-eslint/no-unused-vars */

import { Explained } from './explain'

/**
 * kubectl api-resources | grep openshift.io | awk '{if (NF == 4) { isNamespaceScoped=$3; version=$2; } else { isNamespaceScoped=$4; version=$3; } name=sprintf("%s.%s", $1, version); gsub("/", "_", name); gsub("\\.", "_", name); if (isNamespaceScoped == "true") isClusterScoped = "false"; else isClusterScoped = "true"; print "const " name " = { kind: \"" $NF "\", version: \"" version "\", isClusterScoped: " isClusterScoped " }" }'
 */
const apirequestcounts_apiserver_openshift_io_v1 = {
  kind: 'APIRequestCount',
  version: 'apiserver.openshift.io/v1',
  isClusterScoped: true
}
const deploymentconfigs_apps_openshift_io_v1 = {
  kind: 'DeploymentConfig',
  version: 'apps.openshift.io/v1',
  isClusterScoped: false
}
const clusterrolebindings_authorization_openshift_io_v1 = {
  kind: 'ClusterRoleBinding',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: true
}
const clusterroles_authorization_openshift_io_v1 = {
  kind: 'ClusterRole',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: true
}
const localresourceaccessreviews_authorization_openshift_io_v1 = {
  kind: 'LocalResourceAccessReview',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: false
}
const localsubjectaccessreviews_authorization_openshift_io_v1 = {
  kind: 'LocalSubjectAccessReview',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: false
}
const resourceaccessreviews_authorization_openshift_io_v1 = {
  kind: 'ResourceAccessReview',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: true
}
const rolebindingrestrictions_authorization_openshift_io_v1 = {
  kind: 'RoleBindingRestriction',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: false
}
const rolebindings_authorization_openshift_io_v1 = {
  kind: 'RoleBinding',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: false
}
const roles_authorization_openshift_io_v1 = {
  kind: 'Role',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: false
}
const selfsubjectrulesreviews_authorization_openshift_io_v1 = {
  kind: 'SelfSubjectRulesReview',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: false
}
const subjectaccessreviews_authorization_openshift_io_v1 = {
  kind: 'SubjectAccessReview',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: true
}
const subjectrulesreviews_authorization_openshift_io_v1 = {
  kind: 'SubjectRulesReview',
  version: 'authorization.openshift.io/v1',
  isClusterScoped: false
}
const buildconfigs_build_openshift_io_v1 = {
  kind: 'BuildConfig',
  version: 'build.openshift.io/v1',
  isClusterScoped: false
}
const builds_build_openshift_io_v1 = { kind: 'Build', version: 'build.openshift.io/v1', isClusterScoped: false }
const credentialsrequests_cloudcredential_openshift_io_v1 = {
  kind: 'CredentialsRequest',
  version: 'cloudcredential.openshift.io/v1',
  isClusterScoped: false
}
const apiservers_config_openshift_io_v1 = {
  kind: 'APIServer',
  version: 'config.openshift.io/v1',
  isClusterScoped: true
}
const authentications_config_openshift_io_v1 = {
  kind: 'Authentication',
  version: 'config.openshift.io/v1',
  isClusterScoped: true
}
const builds_config_openshift_io_v1 = { kind: 'Build', version: 'config.openshift.io/v1', isClusterScoped: true }
const clusteroperators_config_openshift_io_v1 = {
  kind: 'ClusterOperator',
  version: 'config.openshift.io/v1',
  isClusterScoped: true
}
const clusterversions_config_openshift_io_v1 = {
  kind: 'ClusterVersion',
  version: 'config.openshift.io/v1',
  isClusterScoped: true
}
const consoles_config_openshift_io_v1 = { kind: 'Console', version: 'config.openshift.io/v1', isClusterScoped: true }
const dnses_config_openshift_io_v1 = { kind: 'DNS', version: 'config.openshift.io/v1', isClusterScoped: true }
const featuregates_config_openshift_io_v1 = {
  kind: 'FeatureGate',
  version: 'config.openshift.io/v1',
  isClusterScoped: true
}
const images_config_openshift_io_v1 = { kind: 'Image', version: 'config.openshift.io/v1', isClusterScoped: true }
const infrastructures_config_openshift_io_v1 = {
  kind: 'Infrastructure',
  version: 'config.openshift.io/v1',
  isClusterScoped: true
}
const ingresses_config_openshift_io_v1 = { kind: 'Ingress', version: 'config.openshift.io/v1', isClusterScoped: true }
const networks_config_openshift_io_v1 = { kind: 'Network', version: 'config.openshift.io/v1', isClusterScoped: true }
const oauths_config_openshift_io_v1 = { kind: 'OAuth', version: 'config.openshift.io/v1', isClusterScoped: true }
const operatorhubs_config_openshift_io_v1 = {
  kind: 'OperatorHub',
  version: 'config.openshift.io/v1',
  isClusterScoped: true
}
const projects_config_openshift_io_v1 = { kind: 'Project', version: 'config.openshift.io/v1', isClusterScoped: true }
const proxies_config_openshift_io_v1 = { kind: 'Proxy', version: 'config.openshift.io/v1', isClusterScoped: true }
const schedulers_config_openshift_io_v1 = {
  kind: 'Scheduler',
  version: 'config.openshift.io/v1',
  isClusterScoped: true
}
const consoleclidownloads_console_openshift_io_v1 = {
  kind: 'ConsoleCLIDownload',
  version: 'console.openshift.io/v1',
  isClusterScoped: true
}
const consoleexternalloglinks_console_openshift_io_v1 = {
  kind: 'ConsoleExternalLogLink',
  version: 'console.openshift.io/v1',
  isClusterScoped: true
}
const consolelinks_console_openshift_io_v1 = {
  kind: 'ConsoleLink',
  version: 'console.openshift.io/v1',
  isClusterScoped: true
}
const consolenotifications_console_openshift_io_v1 = {
  kind: 'ConsoleNotification',
  version: 'console.openshift.io/v1',
  isClusterScoped: true
}
const consoleplugins_console_openshift_io_v1alpha1 = {
  kind: 'ConsolePlugin',
  version: 'console.openshift.io/v1alpha1',
  isClusterScoped: true
}
const consolequickstarts_console_openshift_io_v1 = {
  kind: 'ConsoleQuickStart',
  version: 'console.openshift.io/v1',
  isClusterScoped: true
}
const consoleyamlsamples_console_openshift_io_v1 = {
  kind: 'ConsoleYAMLSample',
  version: 'console.openshift.io/v1',
  isClusterScoped: true
}
const podnetworkconnectivitychecks_controlplane_operator_openshift_io_v1alpha1 = {
  kind: 'PodNetworkConnectivityCheck',
  version: 'controlplane.operator.openshift.io/v1alpha1',
  isClusterScoped: false
}
const helmchartrepositories_helm_openshift_io_v1beta1 = {
  kind: 'HelmChartRepository',
  version: 'helm.openshift.io/v1beta1',
  isClusterScoped: true
}
const images_image_openshift_io_v1 = { kind: 'Image', version: 'image.openshift.io/v1', isClusterScoped: true }
const imagesignatures_image_openshift_io_v1 = {
  kind: 'ImageSignature',
  version: 'image.openshift.io/v1',
  isClusterScoped: true
}
const imagestreamimages_image_openshift_io_v1 = {
  kind: 'ImageStreamImage',
  version: 'image.openshift.io/v1',
  isClusterScoped: false
}
const imagestreamimports_image_openshift_io_v1 = {
  kind: 'ImageStreamImport',
  version: 'image.openshift.io/v1',
  isClusterScoped: false
}
const imagestreammappings_image_openshift_io_v1 = {
  kind: 'ImageStreamMapping',
  version: 'image.openshift.io/v1',
  isClusterScoped: false
}
const imagestreams_image_openshift_io_v1 = {
  kind: 'ImageStream',
  version: 'image.openshift.io/v1',
  isClusterScoped: false
}
const imagestreamtags_image_openshift_io_v1 = {
  kind: 'ImageStreamTag',
  version: 'image.openshift.io/v1',
  isClusterScoped: false
}
const imagetags_image_openshift_io_v1 = { kind: 'ImageTag', version: 'image.openshift.io/v1', isClusterScoped: false }
const configs_imageregistry_operator_openshift_io_v1 = {
  kind: 'Config',
  version: 'imageregistry.operator.openshift.io/v1',
  isClusterScoped: true
}
const imagepruners_imageregistry_operator_openshift_io_v1 = {
  kind: 'ImagePruner',
  version: 'imageregistry.operator.openshift.io/v1',
  isClusterScoped: true
}
const dnsrecords_ingress_operator_openshift_io_v1 = {
  kind: 'DNSRecord',
  version: 'ingress.operator.openshift.io/v1',
  isClusterScoped: false
}
const containerruntimeconfigs_machineconfiguration_openshift_io_v1 = {
  kind: 'ContainerRuntimeConfig',
  version: 'machineconfiguration.openshift.io/v1',
  isClusterScoped: true
}
const kubeletconfigs_machineconfiguration_openshift_io_v1 = {
  kind: 'KubeletConfig',
  version: 'machineconfiguration.openshift.io/v1',
  isClusterScoped: true
}
const machineconfigpools_machineconfiguration_openshift_io_v1 = {
  kind: 'MachineConfigPool',
  version: 'machineconfiguration.openshift.io/v1',
  isClusterScoped: true
}
const machineconfigs_machineconfiguration_openshift_io_v1 = {
  kind: 'MachineConfig',
  version: 'machineconfiguration.openshift.io/v1',
  isClusterScoped: true
}
const egressrouters_network_operator_openshift_io_v1 = {
  kind: 'EgressRouter',
  version: 'network.operator.openshift.io/v1',
  isClusterScoped: false
}
const operatorpkis_network_operator_openshift_io_v1 = {
  kind: 'OperatorPKI',
  version: 'network.operator.openshift.io/v1',
  isClusterScoped: false
}
const oauthaccesstokens_oauth_openshift_io_v1 = {
  kind: 'OAuthAccessToken',
  version: 'oauth.openshift.io/v1',
  isClusterScoped: true
}
const oauthauthorizetokens_oauth_openshift_io_v1 = {
  kind: 'OAuthAuthorizeToken',
  version: 'oauth.openshift.io/v1',
  isClusterScoped: true
}
const oauthclientauthorizations_oauth_openshift_io_v1 = {
  kind: 'OAuthClientAuthorization',
  version: 'oauth.openshift.io/v1',
  isClusterScoped: true
}
const oauthclients_oauth_openshift_io_v1 = {
  kind: 'OAuthClient',
  version: 'oauth.openshift.io/v1',
  isClusterScoped: true
}
const tokenreviews_oauth_openshift_io_v1 = {
  kind: 'TokenReview',
  version: 'oauth.openshift.io/v1',
  isClusterScoped: true
}
const useroauthaccesstokens_oauth_openshift_io_v1 = {
  kind: 'UserOAuthAccessToken',
  version: 'oauth.openshift.io/v1',
  isClusterScoped: true
}
const authentications_operator_openshift_io_v1 = {
  kind: 'Authentication',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const cloudcredentials_operator_openshift_io_v1 = {
  kind: 'CloudCredential',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const clustercsidrivers_operator_openshift_io_v1 = {
  kind: 'ClusterCSIDriver',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const configs_operator_openshift_io_v1 = { kind: 'Config', version: 'operator.openshift.io/v1', isClusterScoped: true }
const consoles_operator_openshift_io_v1 = {
  kind: 'Console',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const csisnapshotcontrollers_operator_openshift_io_v1 = {
  kind: 'CSISnapshotController',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const dnses_operator_openshift_io_v1 = { kind: 'DNS', version: 'operator.openshift.io/v1', isClusterScoped: true }
const etcds_operator_openshift_io_v1 = { kind: 'Etcd', version: 'operator.openshift.io/v1', isClusterScoped: true }
const imagecontentsourcepolicies_operator_openshift_io_v1alpha1 = {
  kind: 'ImageContentSourcePolicy',
  version: 'operator.openshift.io/v1alpha1',
  isClusterScoped: true
}
const ingresscontrollers_operator_openshift_io_v1 = {
  kind: 'IngressController',
  version: 'operator.openshift.io/v1',
  isClusterScoped: false
}
const kubeapiservers_operator_openshift_io_v1 = {
  kind: 'KubeAPIServer',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const kubecontrollermanagers_operator_openshift_io_v1 = {
  kind: 'KubeControllerManager',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const kubeschedulers_operator_openshift_io_v1 = {
  kind: 'KubeScheduler',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const kubestorageversionmigrators_operator_openshift_io_v1 = {
  kind: 'KubeStorageVersionMigrator',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const networks_operator_openshift_io_v1 = {
  kind: 'Network',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const openshiftapiservers_operator_openshift_io_v1 = {
  kind: 'OpenShiftAPIServer',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const openshiftcontrollermanagers_operator_openshift_io_v1 = {
  kind: 'OpenShiftControllerManager',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const servicecas_operator_openshift_io_v1 = {
  kind: 'ServiceCA',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const storages_operator_openshift_io_v1 = {
  kind: 'Storage',
  version: 'operator.openshift.io/v1',
  isClusterScoped: true
}
const knativekafkas_operator_serverless_openshift_io_v1alpha1 = {
  kind: 'KnativeKafka',
  version: 'operator.serverless.openshift.io/v1alpha1',
  isClusterScoped: false
}
const projectrequests_project_openshift_io_v1 = {
  kind: 'ProjectRequest',
  version: 'project.openshift.io/v1',
  isClusterScoped: true
}
const projects_project_openshift_io_v1 = { kind: 'Project', version: 'project.openshift.io/v1', isClusterScoped: true }
const appliedclusterresourcequotas_quota_openshift_io_v1 = {
  kind: 'AppliedClusterResourceQuota',
  version: 'quota.openshift.io/v1',
  isClusterScoped: false
}
const clusterresourcequotas_quota_openshift_io_v1 = {
  kind: 'ClusterResourceQuota',
  version: 'quota.openshift.io/v1',
  isClusterScoped: true
}
const routes_route_openshift_io_v1 = { kind: 'Route', version: 'route.openshift.io/v1', isClusterScoped: false }
const configs_samples_operator_openshift_io_v1 = {
  kind: 'Config',
  version: 'samples.operator.openshift.io/v1',
  isClusterScoped: true
}
const rangeallocations_security_internal_openshift_io_v1 = {
  kind: 'RangeAllocation',
  version: 'security.internal.openshift.io/v1',
  isClusterScoped: true
}
const podsecuritypolicyreviews_security_openshift_io_v1 = {
  kind: 'PodSecurityPolicyReview',
  version: 'security.openshift.io/v1',
  isClusterScoped: false
}
const podsecuritypolicyselfsubjectreviews_security_openshift_io_v1 = {
  kind: 'PodSecurityPolicySelfSubjectReview',
  version: 'security.openshift.io/v1',
  isClusterScoped: false
}
const podsecuritypolicysubjectreviews_security_openshift_io_v1 = {
  kind: 'PodSecurityPolicySubjectReview',
  version: 'security.openshift.io/v1',
  isClusterScoped: false
}
const rangeallocations_security_openshift_io_v1 = {
  kind: 'RangeAllocation',
  version: 'security.openshift.io/v1',
  isClusterScoped: true
}
const securitycontextconstraints_security_openshift_io_v1 = {
  kind: 'SecurityContextConstraints',
  version: 'security.openshift.io/v1',
  isClusterScoped: true
}
const brokertemplateinstances_template_openshift_io_v1 = {
  kind: 'BrokerTemplateInstance',
  version: 'template.openshift.io/v1',
  isClusterScoped: true
}
const processedtemplates_template_openshift_io_v1 = {
  kind: 'Template',
  version: 'template.openshift.io/v1',
  isClusterScoped: false
}
const templateinstances_template_openshift_io_v1 = {
  kind: 'TemplateInstance',
  version: 'template.openshift.io/v1',
  isClusterScoped: false
}
const templates_template_openshift_io_v1 = {
  kind: 'Template',
  version: 'template.openshift.io/v1',
  isClusterScoped: false
}
const profiles_tuned_openshift_io_v1 = { kind: 'Profile', version: 'tuned.openshift.io/v1', isClusterScoped: false }
const tuneds_tuned_openshift_io_v1 = { kind: 'Tuned', version: 'tuned.openshift.io/v1', isClusterScoped: false }
const groups_user_openshift_io_v1 = { kind: 'Group', version: 'user.openshift.io/v1', isClusterScoped: true }
const identities_user_openshift_io_v1 = { kind: 'Identity', version: 'user.openshift.io/v1', isClusterScoped: true }
const useridentitymappings_user_openshift_io_v1 = {
  kind: 'UserIdentityMapping',
  version: 'user.openshift.io/v1',
  isClusterScoped: true
}
const users_user_openshift_io_v1 = { kind: 'User', version: 'user.openshift.io/v1', isClusterScoped: true }

/** kubectl api-resources | grep openshift.io | awk 'BEGIN { print "const fastPathCases: Record<string, Explained> = {" } END { print "}" } {if (NF == 4) {shortnames=""; version=$2; } else { shortnames=$2; version=$3 } name=sprintf("%s.%s", $1, version); gsub("/", "_", name); gsub("\\.", "_", name); if (! ($1 in already)) { already[$1]=1; singular=sprintf("%s", $1); sub(/s$/, "", singular); print "    " $1 ": " name ",";  print "    " singular ": " name ","; } split(shortnames, S, ","); if (! ($NF in already)) { already[$NF]=1; print "    " $NF ": " name ","; print "    " $NF "s: " name ","; } for (i=1; i<=length(S); i++) print "    " S[i] ": " name ","; }' */
const fastPathCases: Record<string, Explained> = {
  apirequestcounts: apirequestcounts_apiserver_openshift_io_v1,
  apirequestcount: apirequestcounts_apiserver_openshift_io_v1,
  APIRequestCount: apirequestcounts_apiserver_openshift_io_v1,
  APIRequestCounts: apirequestcounts_apiserver_openshift_io_v1,
  deploymentconfigs: deploymentconfigs_apps_openshift_io_v1,
  deploymentconfig: deploymentconfigs_apps_openshift_io_v1,
  DeploymentConfig: deploymentconfigs_apps_openshift_io_v1,
  DeploymentConfigs: deploymentconfigs_apps_openshift_io_v1,
  dc: deploymentconfigs_apps_openshift_io_v1,
  clusterrolebindings: clusterrolebindings_authorization_openshift_io_v1,
  clusterrolebinding: clusterrolebindings_authorization_openshift_io_v1,
  ClusterRoleBinding: clusterrolebindings_authorization_openshift_io_v1,
  ClusterRoleBindings: clusterrolebindings_authorization_openshift_io_v1,
  clusterroles: clusterroles_authorization_openshift_io_v1,
  clusterrole: clusterroles_authorization_openshift_io_v1,
  ClusterRole: clusterroles_authorization_openshift_io_v1,
  ClusterRoles: clusterroles_authorization_openshift_io_v1,
  localresourceaccessreviews: localresourceaccessreviews_authorization_openshift_io_v1,
  localresourceaccessreview: localresourceaccessreviews_authorization_openshift_io_v1,
  LocalResourceAccessReview: localresourceaccessreviews_authorization_openshift_io_v1,
  LocalResourceAccessReviews: localresourceaccessreviews_authorization_openshift_io_v1,
  localsubjectaccessreviews: localsubjectaccessreviews_authorization_openshift_io_v1,
  localsubjectaccessreview: localsubjectaccessreviews_authorization_openshift_io_v1,
  LocalSubjectAccessReview: localsubjectaccessreviews_authorization_openshift_io_v1,
  LocalSubjectAccessReviews: localsubjectaccessreviews_authorization_openshift_io_v1,
  resourceaccessreviews: resourceaccessreviews_authorization_openshift_io_v1,
  resourceaccessreview: resourceaccessreviews_authorization_openshift_io_v1,
  ResourceAccessReview: resourceaccessreviews_authorization_openshift_io_v1,
  ResourceAccessReviews: resourceaccessreviews_authorization_openshift_io_v1,
  rolebindingrestrictions: rolebindingrestrictions_authorization_openshift_io_v1,
  rolebindingrestriction: rolebindingrestrictions_authorization_openshift_io_v1,
  RoleBindingRestriction: rolebindingrestrictions_authorization_openshift_io_v1,
  RoleBindingRestrictions: rolebindingrestrictions_authorization_openshift_io_v1,
  rolebindings: rolebindings_authorization_openshift_io_v1,
  rolebinding: rolebindings_authorization_openshift_io_v1,
  RoleBinding: rolebindings_authorization_openshift_io_v1,
  RoleBindings: rolebindings_authorization_openshift_io_v1,
  roles: roles_authorization_openshift_io_v1,
  role: roles_authorization_openshift_io_v1,
  Role: roles_authorization_openshift_io_v1,
  Roles: roles_authorization_openshift_io_v1,
  selfsubjectrulesreviews: selfsubjectrulesreviews_authorization_openshift_io_v1,
  selfsubjectrulesreview: selfsubjectrulesreviews_authorization_openshift_io_v1,
  SelfSubjectRulesReview: selfsubjectrulesreviews_authorization_openshift_io_v1,
  SelfSubjectRulesReviews: selfsubjectrulesreviews_authorization_openshift_io_v1,
  subjectaccessreviews: subjectaccessreviews_authorization_openshift_io_v1,
  subjectaccessreview: subjectaccessreviews_authorization_openshift_io_v1,
  SubjectAccessReview: subjectaccessreviews_authorization_openshift_io_v1,
  SubjectAccessReviews: subjectaccessreviews_authorization_openshift_io_v1,
  subjectrulesreviews: subjectrulesreviews_authorization_openshift_io_v1,
  subjectrulesreview: subjectrulesreviews_authorization_openshift_io_v1,
  SubjectRulesReview: subjectrulesreviews_authorization_openshift_io_v1,
  SubjectRulesReviews: subjectrulesreviews_authorization_openshift_io_v1,
  buildconfigs: buildconfigs_build_openshift_io_v1,
  buildconfig: buildconfigs_build_openshift_io_v1,
  BuildConfig: buildconfigs_build_openshift_io_v1,
  BuildConfigs: buildconfigs_build_openshift_io_v1,
  bc: buildconfigs_build_openshift_io_v1,
  builds: builds_build_openshift_io_v1,
  build: builds_build_openshift_io_v1,
  Build: builds_build_openshift_io_v1,
  Builds: builds_build_openshift_io_v1,
  credentialsrequests: credentialsrequests_cloudcredential_openshift_io_v1,
  credentialsrequest: credentialsrequests_cloudcredential_openshift_io_v1,
  CredentialsRequest: credentialsrequests_cloudcredential_openshift_io_v1,
  CredentialsRequests: credentialsrequests_cloudcredential_openshift_io_v1,
  apiservers: apiservers_config_openshift_io_v1,
  apiserver: apiservers_config_openshift_io_v1,
  APIServer: apiservers_config_openshift_io_v1,
  APIServers: apiservers_config_openshift_io_v1,
  authentications: authentications_config_openshift_io_v1,
  authentication: authentications_config_openshift_io_v1,
  Authentication: authentications_config_openshift_io_v1,
  Authentications: authentications_config_openshift_io_v1,
  clusteroperators: clusteroperators_config_openshift_io_v1,
  clusteroperator: clusteroperators_config_openshift_io_v1,
  ClusterOperator: clusteroperators_config_openshift_io_v1,
  ClusterOperators: clusteroperators_config_openshift_io_v1,
  co: clusteroperators_config_openshift_io_v1,
  clusterversions: clusterversions_config_openshift_io_v1,
  clusterversion: clusterversions_config_openshift_io_v1,
  ClusterVersion: clusterversions_config_openshift_io_v1,
  ClusterVersions: clusterversions_config_openshift_io_v1,
  consoles: consoles_config_openshift_io_v1,
  console: consoles_config_openshift_io_v1,
  Console: consoles_config_openshift_io_v1,
  Consoles: consoles_config_openshift_io_v1,
  dnses: dnses_config_openshift_io_v1,
  dnse: dnses_config_openshift_io_v1,
  DNS: dnses_config_openshift_io_v1,
  DNSs: dnses_config_openshift_io_v1,
  featuregates: featuregates_config_openshift_io_v1,
  featuregate: featuregates_config_openshift_io_v1,
  FeatureGate: featuregates_config_openshift_io_v1,
  FeatureGates: featuregates_config_openshift_io_v1,
  images: images_config_openshift_io_v1,
  image: images_config_openshift_io_v1,
  Image: images_config_openshift_io_v1,
  Images: images_config_openshift_io_v1,
  infrastructures: infrastructures_config_openshift_io_v1,
  infrastructure: infrastructures_config_openshift_io_v1,
  Infrastructure: infrastructures_config_openshift_io_v1,
  Infrastructures: infrastructures_config_openshift_io_v1,
  ingresses: ingresses_config_openshift_io_v1,
  ingresse: ingresses_config_openshift_io_v1,
  Ingress: ingresses_config_openshift_io_v1,
  Ingresss: ingresses_config_openshift_io_v1,
  networks: networks_config_openshift_io_v1,
  network: networks_config_openshift_io_v1,
  Network: networks_config_openshift_io_v1,
  Networks: networks_config_openshift_io_v1,
  oauths: oauths_config_openshift_io_v1,
  oauth: oauths_config_openshift_io_v1,
  OAuth: oauths_config_openshift_io_v1,
  OAuths: oauths_config_openshift_io_v1,
  operatorhubs: operatorhubs_config_openshift_io_v1,
  operatorhub: operatorhubs_config_openshift_io_v1,
  OperatorHub: operatorhubs_config_openshift_io_v1,
  OperatorHubs: operatorhubs_config_openshift_io_v1,
  projects: projects_config_openshift_io_v1,
  project: projects_config_openshift_io_v1,
  Project: projects_config_openshift_io_v1,
  Projects: projects_config_openshift_io_v1,
  proxies: proxies_config_openshift_io_v1,
  proxie: proxies_config_openshift_io_v1,
  Proxy: proxies_config_openshift_io_v1,
  Proxys: proxies_config_openshift_io_v1,
  schedulers: schedulers_config_openshift_io_v1,
  scheduler: schedulers_config_openshift_io_v1,
  Scheduler: schedulers_config_openshift_io_v1,
  Schedulers: schedulers_config_openshift_io_v1,
  consoleclidownloads: consoleclidownloads_console_openshift_io_v1,
  consoleclidownload: consoleclidownloads_console_openshift_io_v1,
  ConsoleCLIDownload: consoleclidownloads_console_openshift_io_v1,
  ConsoleCLIDownloads: consoleclidownloads_console_openshift_io_v1,
  consoleexternalloglinks: consoleexternalloglinks_console_openshift_io_v1,
  consoleexternalloglink: consoleexternalloglinks_console_openshift_io_v1,
  ConsoleExternalLogLink: consoleexternalloglinks_console_openshift_io_v1,
  ConsoleExternalLogLinks: consoleexternalloglinks_console_openshift_io_v1,
  consolelinks: consolelinks_console_openshift_io_v1,
  consolelink: consolelinks_console_openshift_io_v1,
  ConsoleLink: consolelinks_console_openshift_io_v1,
  ConsoleLinks: consolelinks_console_openshift_io_v1,
  consolenotifications: consolenotifications_console_openshift_io_v1,
  consolenotification: consolenotifications_console_openshift_io_v1,
  ConsoleNotification: consolenotifications_console_openshift_io_v1,
  ConsoleNotifications: consolenotifications_console_openshift_io_v1,
  consoleplugins: consoleplugins_console_openshift_io_v1alpha1,
  consoleplugin: consoleplugins_console_openshift_io_v1alpha1,
  ConsolePlugin: consoleplugins_console_openshift_io_v1alpha1,
  ConsolePlugins: consoleplugins_console_openshift_io_v1alpha1,
  consolequickstarts: consolequickstarts_console_openshift_io_v1,
  consolequickstart: consolequickstarts_console_openshift_io_v1,
  ConsoleQuickStart: consolequickstarts_console_openshift_io_v1,
  ConsoleQuickStarts: consolequickstarts_console_openshift_io_v1,
  consoleyamlsamples: consoleyamlsamples_console_openshift_io_v1,
  consoleyamlsample: consoleyamlsamples_console_openshift_io_v1,
  ConsoleYAMLSample: consoleyamlsamples_console_openshift_io_v1,
  ConsoleYAMLSamples: consoleyamlsamples_console_openshift_io_v1,
  podnetworkconnectivitychecks: podnetworkconnectivitychecks_controlplane_operator_openshift_io_v1alpha1,
  podnetworkconnectivitycheck: podnetworkconnectivitychecks_controlplane_operator_openshift_io_v1alpha1,
  PodNetworkConnectivityCheck: podnetworkconnectivitychecks_controlplane_operator_openshift_io_v1alpha1,
  PodNetworkConnectivityChecks: podnetworkconnectivitychecks_controlplane_operator_openshift_io_v1alpha1,
  helmchartrepositories: helmchartrepositories_helm_openshift_io_v1beta1,
  helmchartrepositorie: helmchartrepositories_helm_openshift_io_v1beta1,
  HelmChartRepository: helmchartrepositories_helm_openshift_io_v1beta1,
  HelmChartRepositorys: helmchartrepositories_helm_openshift_io_v1beta1,
  imagesignatures: imagesignatures_image_openshift_io_v1,
  imagesignature: imagesignatures_image_openshift_io_v1,
  ImageSignature: imagesignatures_image_openshift_io_v1,
  ImageSignatures: imagesignatures_image_openshift_io_v1,
  imagestreamimages: imagestreamimages_image_openshift_io_v1,
  imagestreamimage: imagestreamimages_image_openshift_io_v1,
  ImageStreamImage: imagestreamimages_image_openshift_io_v1,
  ImageStreamImages: imagestreamimages_image_openshift_io_v1,
  isimage: imagestreamimages_image_openshift_io_v1,
  imagestreamimports: imagestreamimports_image_openshift_io_v1,
  imagestreamimport: imagestreamimports_image_openshift_io_v1,
  ImageStreamImport: imagestreamimports_image_openshift_io_v1,
  ImageStreamImports: imagestreamimports_image_openshift_io_v1,
  imagestreammappings: imagestreammappings_image_openshift_io_v1,
  imagestreammapping: imagestreammappings_image_openshift_io_v1,
  ImageStreamMapping: imagestreammappings_image_openshift_io_v1,
  ImageStreamMappings: imagestreammappings_image_openshift_io_v1,
  imagestreams: imagestreams_image_openshift_io_v1,
  imagestream: imagestreams_image_openshift_io_v1,
  ImageStream: imagestreams_image_openshift_io_v1,
  ImageStreams: imagestreams_image_openshift_io_v1,
  is: imagestreams_image_openshift_io_v1,
  imagestreamtags: imagestreamtags_image_openshift_io_v1,
  imagestreamtag: imagestreamtags_image_openshift_io_v1,
  ImageStreamTag: imagestreamtags_image_openshift_io_v1,
  ImageStreamTags: imagestreamtags_image_openshift_io_v1,
  istag: imagestreamtags_image_openshift_io_v1,
  imagetags: imagetags_image_openshift_io_v1,
  imagetag: imagetags_image_openshift_io_v1,
  ImageTag: imagetags_image_openshift_io_v1,
  ImageTags: imagetags_image_openshift_io_v1,
  itag: imagetags_image_openshift_io_v1,
  configs: configs_imageregistry_operator_openshift_io_v1,
  config: configs_imageregistry_operator_openshift_io_v1,
  Config: configs_imageregistry_operator_openshift_io_v1,
  Configs: configs_imageregistry_operator_openshift_io_v1,
  imagepruners: imagepruners_imageregistry_operator_openshift_io_v1,
  imagepruner: imagepruners_imageregistry_operator_openshift_io_v1,
  ImagePruner: imagepruners_imageregistry_operator_openshift_io_v1,
  ImagePruners: imagepruners_imageregistry_operator_openshift_io_v1,
  dnsrecords: dnsrecords_ingress_operator_openshift_io_v1,
  dnsrecord: dnsrecords_ingress_operator_openshift_io_v1,
  DNSRecord: dnsrecords_ingress_operator_openshift_io_v1,
  DNSRecords: dnsrecords_ingress_operator_openshift_io_v1,
  containerruntimeconfigs: containerruntimeconfigs_machineconfiguration_openshift_io_v1,
  containerruntimeconfig: containerruntimeconfigs_machineconfiguration_openshift_io_v1,
  ContainerRuntimeConfig: containerruntimeconfigs_machineconfiguration_openshift_io_v1,
  ContainerRuntimeConfigs: containerruntimeconfigs_machineconfiguration_openshift_io_v1,
  ctrcfg: containerruntimeconfigs_machineconfiguration_openshift_io_v1,
  kubeletconfigs: kubeletconfigs_machineconfiguration_openshift_io_v1,
  kubeletconfig: kubeletconfigs_machineconfiguration_openshift_io_v1,
  KubeletConfig: kubeletconfigs_machineconfiguration_openshift_io_v1,
  KubeletConfigs: kubeletconfigs_machineconfiguration_openshift_io_v1,
  machineconfigpools: machineconfigpools_machineconfiguration_openshift_io_v1,
  machineconfigpool: machineconfigpools_machineconfiguration_openshift_io_v1,
  MachineConfigPool: machineconfigpools_machineconfiguration_openshift_io_v1,
  MachineConfigPools: machineconfigpools_machineconfiguration_openshift_io_v1,
  mcp: machineconfigpools_machineconfiguration_openshift_io_v1,
  machineconfigs: machineconfigs_machineconfiguration_openshift_io_v1,
  machineconfig: machineconfigs_machineconfiguration_openshift_io_v1,
  MachineConfig: machineconfigs_machineconfiguration_openshift_io_v1,
  MachineConfigs: machineconfigs_machineconfiguration_openshift_io_v1,
  mc: machineconfigs_machineconfiguration_openshift_io_v1,
  egressrouters: egressrouters_network_operator_openshift_io_v1,
  egressrouter: egressrouters_network_operator_openshift_io_v1,
  EgressRouter: egressrouters_network_operator_openshift_io_v1,
  EgressRouters: egressrouters_network_operator_openshift_io_v1,
  operatorpkis: operatorpkis_network_operator_openshift_io_v1,
  operatorpki: operatorpkis_network_operator_openshift_io_v1,
  OperatorPKI: operatorpkis_network_operator_openshift_io_v1,
  OperatorPKIs: operatorpkis_network_operator_openshift_io_v1,
  oauthaccesstokens: oauthaccesstokens_oauth_openshift_io_v1,
  oauthaccesstoken: oauthaccesstokens_oauth_openshift_io_v1,
  OAuthAccessToken: oauthaccesstokens_oauth_openshift_io_v1,
  OAuthAccessTokens: oauthaccesstokens_oauth_openshift_io_v1,
  oauthauthorizetokens: oauthauthorizetokens_oauth_openshift_io_v1,
  oauthauthorizetoken: oauthauthorizetokens_oauth_openshift_io_v1,
  OAuthAuthorizeToken: oauthauthorizetokens_oauth_openshift_io_v1,
  OAuthAuthorizeTokens: oauthauthorizetokens_oauth_openshift_io_v1,
  oauthclientauthorizations: oauthclientauthorizations_oauth_openshift_io_v1,
  oauthclientauthorization: oauthclientauthorizations_oauth_openshift_io_v1,
  OAuthClientAuthorization: oauthclientauthorizations_oauth_openshift_io_v1,
  OAuthClientAuthorizations: oauthclientauthorizations_oauth_openshift_io_v1,
  oauthclients: oauthclients_oauth_openshift_io_v1,
  oauthclient: oauthclients_oauth_openshift_io_v1,
  OAuthClient: oauthclients_oauth_openshift_io_v1,
  OAuthClients: oauthclients_oauth_openshift_io_v1,
  tokenreviews: tokenreviews_oauth_openshift_io_v1,
  tokenreview: tokenreviews_oauth_openshift_io_v1,
  TokenReview: tokenreviews_oauth_openshift_io_v1,
  TokenReviews: tokenreviews_oauth_openshift_io_v1,
  useroauthaccesstokens: useroauthaccesstokens_oauth_openshift_io_v1,
  useroauthaccesstoken: useroauthaccesstokens_oauth_openshift_io_v1,
  UserOAuthAccessToken: useroauthaccesstokens_oauth_openshift_io_v1,
  UserOAuthAccessTokens: useroauthaccesstokens_oauth_openshift_io_v1,
  cloudcredentials: cloudcredentials_operator_openshift_io_v1,
  cloudcredential: cloudcredentials_operator_openshift_io_v1,
  CloudCredential: cloudcredentials_operator_openshift_io_v1,
  CloudCredentials: cloudcredentials_operator_openshift_io_v1,
  clustercsidrivers: clustercsidrivers_operator_openshift_io_v1,
  clustercsidriver: clustercsidrivers_operator_openshift_io_v1,
  ClusterCSIDriver: clustercsidrivers_operator_openshift_io_v1,
  ClusterCSIDrivers: clustercsidrivers_operator_openshift_io_v1,
  csisnapshotcontrollers: csisnapshotcontrollers_operator_openshift_io_v1,
  csisnapshotcontroller: csisnapshotcontrollers_operator_openshift_io_v1,
  CSISnapshotController: csisnapshotcontrollers_operator_openshift_io_v1,
  CSISnapshotControllers: csisnapshotcontrollers_operator_openshift_io_v1,
  etcds: etcds_operator_openshift_io_v1,
  etcd: etcds_operator_openshift_io_v1,
  Etcd: etcds_operator_openshift_io_v1,
  Etcds: etcds_operator_openshift_io_v1,
  imagecontentsourcepolicies: imagecontentsourcepolicies_operator_openshift_io_v1alpha1,
  imagecontentsourcepolicie: imagecontentsourcepolicies_operator_openshift_io_v1alpha1,
  ImageContentSourcePolicy: imagecontentsourcepolicies_operator_openshift_io_v1alpha1,
  ImageContentSourcePolicys: imagecontentsourcepolicies_operator_openshift_io_v1alpha1,
  ingresscontrollers: ingresscontrollers_operator_openshift_io_v1,
  ingresscontroller: ingresscontrollers_operator_openshift_io_v1,
  IngressController: ingresscontrollers_operator_openshift_io_v1,
  IngressControllers: ingresscontrollers_operator_openshift_io_v1,
  kubeapiservers: kubeapiservers_operator_openshift_io_v1,
  kubeapiserver: kubeapiservers_operator_openshift_io_v1,
  KubeAPIServer: kubeapiservers_operator_openshift_io_v1,
  KubeAPIServers: kubeapiservers_operator_openshift_io_v1,
  kubecontrollermanagers: kubecontrollermanagers_operator_openshift_io_v1,
  kubecontrollermanager: kubecontrollermanagers_operator_openshift_io_v1,
  KubeControllerManager: kubecontrollermanagers_operator_openshift_io_v1,
  KubeControllerManagers: kubecontrollermanagers_operator_openshift_io_v1,
  kubeschedulers: kubeschedulers_operator_openshift_io_v1,
  kubescheduler: kubeschedulers_operator_openshift_io_v1,
  KubeScheduler: kubeschedulers_operator_openshift_io_v1,
  KubeSchedulers: kubeschedulers_operator_openshift_io_v1,
  kubestorageversionmigrators: kubestorageversionmigrators_operator_openshift_io_v1,
  kubestorageversionmigrator: kubestorageversionmigrators_operator_openshift_io_v1,
  KubeStorageVersionMigrator: kubestorageversionmigrators_operator_openshift_io_v1,
  KubeStorageVersionMigrators: kubestorageversionmigrators_operator_openshift_io_v1,
  openshiftapiservers: openshiftapiservers_operator_openshift_io_v1,
  openshiftapiserver: openshiftapiservers_operator_openshift_io_v1,
  OpenShiftAPIServer: openshiftapiservers_operator_openshift_io_v1,
  OpenShiftAPIServers: openshiftapiservers_operator_openshift_io_v1,
  openshiftcontrollermanagers: openshiftcontrollermanagers_operator_openshift_io_v1,
  openshiftcontrollermanager: openshiftcontrollermanagers_operator_openshift_io_v1,
  OpenShiftControllerManager: openshiftcontrollermanagers_operator_openshift_io_v1,
  OpenShiftControllerManagers: openshiftcontrollermanagers_operator_openshift_io_v1,
  servicecas: servicecas_operator_openshift_io_v1,
  serviceca: servicecas_operator_openshift_io_v1,
  ServiceCA: servicecas_operator_openshift_io_v1,
  ServiceCAs: servicecas_operator_openshift_io_v1,
  storages: storages_operator_openshift_io_v1,
  storage: storages_operator_openshift_io_v1,
  Storage: storages_operator_openshift_io_v1,
  Storages: storages_operator_openshift_io_v1,
  knativekafkas: knativekafkas_operator_serverless_openshift_io_v1alpha1,
  knativekafka: knativekafkas_operator_serverless_openshift_io_v1alpha1,
  KnativeKafka: knativekafkas_operator_serverless_openshift_io_v1alpha1,
  KnativeKafkas: knativekafkas_operator_serverless_openshift_io_v1alpha1,
  projectrequests: projectrequests_project_openshift_io_v1,
  projectrequest: projectrequests_project_openshift_io_v1,
  ProjectRequest: projectrequests_project_openshift_io_v1,
  ProjectRequests: projectrequests_project_openshift_io_v1,
  appliedclusterresourcequotas: appliedclusterresourcequotas_quota_openshift_io_v1,
  appliedclusterresourcequota: appliedclusterresourcequotas_quota_openshift_io_v1,
  AppliedClusterResourceQuota: appliedclusterresourcequotas_quota_openshift_io_v1,
  AppliedClusterResourceQuotas: appliedclusterresourcequotas_quota_openshift_io_v1,
  clusterresourcequotas: clusterresourcequotas_quota_openshift_io_v1,
  clusterresourcequota: clusterresourcequotas_quota_openshift_io_v1,
  ClusterResourceQuota: clusterresourcequotas_quota_openshift_io_v1,
  ClusterResourceQuotas: clusterresourcequotas_quota_openshift_io_v1,
  clusterquota: clusterresourcequotas_quota_openshift_io_v1,
  routes: routes_route_openshift_io_v1,
  route: routes_route_openshift_io_v1,
  Route: routes_route_openshift_io_v1,
  Routes: routes_route_openshift_io_v1,
  rangeallocations: rangeallocations_security_internal_openshift_io_v1,
  rangeallocation: rangeallocations_security_internal_openshift_io_v1,
  RangeAllocation: rangeallocations_security_internal_openshift_io_v1,
  RangeAllocations: rangeallocations_security_internal_openshift_io_v1,
  podsecuritypolicyreviews: podsecuritypolicyreviews_security_openshift_io_v1,
  podsecuritypolicyreview: podsecuritypolicyreviews_security_openshift_io_v1,
  PodSecurityPolicyReview: podsecuritypolicyreviews_security_openshift_io_v1,
  PodSecurityPolicyReviews: podsecuritypolicyreviews_security_openshift_io_v1,
  podsecuritypolicyselfsubjectreviews: podsecuritypolicyselfsubjectreviews_security_openshift_io_v1,
  podsecuritypolicyselfsubjectreview: podsecuritypolicyselfsubjectreviews_security_openshift_io_v1,
  PodSecurityPolicySelfSubjectReview: podsecuritypolicyselfsubjectreviews_security_openshift_io_v1,
  PodSecurityPolicySelfSubjectReviews: podsecuritypolicyselfsubjectreviews_security_openshift_io_v1,
  podsecuritypolicysubjectreviews: podsecuritypolicysubjectreviews_security_openshift_io_v1,
  podsecuritypolicysubjectreview: podsecuritypolicysubjectreviews_security_openshift_io_v1,
  PodSecurityPolicySubjectReview: podsecuritypolicysubjectreviews_security_openshift_io_v1,
  PodSecurityPolicySubjectReviews: podsecuritypolicysubjectreviews_security_openshift_io_v1,
  securitycontextconstraints: securitycontextconstraints_security_openshift_io_v1,
  securitycontextconstraint: securitycontextconstraints_security_openshift_io_v1,
  SecurityContextConstraints: securitycontextconstraints_security_openshift_io_v1,
  SecurityContextConstraintss: securitycontextconstraints_security_openshift_io_v1,
  scc: securitycontextconstraints_security_openshift_io_v1,
  brokertemplateinstances: brokertemplateinstances_template_openshift_io_v1,
  brokertemplateinstance: brokertemplateinstances_template_openshift_io_v1,
  BrokerTemplateInstance: brokertemplateinstances_template_openshift_io_v1,
  BrokerTemplateInstances: brokertemplateinstances_template_openshift_io_v1,
  processedtemplates: processedtemplates_template_openshift_io_v1,
  processedtemplate: processedtemplates_template_openshift_io_v1,
  Template: processedtemplates_template_openshift_io_v1,
  Templates: processedtemplates_template_openshift_io_v1,
  templateinstances: templateinstances_template_openshift_io_v1,
  templateinstance: templateinstances_template_openshift_io_v1,
  TemplateInstance: templateinstances_template_openshift_io_v1,
  TemplateInstances: templateinstances_template_openshift_io_v1,
  templates: templates_template_openshift_io_v1,
  template: templates_template_openshift_io_v1,
  profiles: profiles_tuned_openshift_io_v1,
  profile: profiles_tuned_openshift_io_v1,
  Profile: profiles_tuned_openshift_io_v1,
  Profiles: profiles_tuned_openshift_io_v1,
  tuneds: tuneds_tuned_openshift_io_v1,
  tuned: tuneds_tuned_openshift_io_v1,
  Tuned: tuneds_tuned_openshift_io_v1,
  Tuneds: tuneds_tuned_openshift_io_v1,
  groups: groups_user_openshift_io_v1,
  group: groups_user_openshift_io_v1,
  Group: groups_user_openshift_io_v1,
  Groups: groups_user_openshift_io_v1,
  identities: identities_user_openshift_io_v1,
  identitie: identities_user_openshift_io_v1,
  Identity: identities_user_openshift_io_v1,
  Identitys: identities_user_openshift_io_v1,
  useridentitymappings: useridentitymappings_user_openshift_io_v1,
  useridentitymapping: useridentitymappings_user_openshift_io_v1,
  UserIdentityMapping: useridentitymappings_user_openshift_io_v1,
  UserIdentityMappings: useridentitymappings_user_openshift_io_v1,
  users: users_user_openshift_io_v1,
  user: users_user_openshift_io_v1,
  User: users_user_openshift_io_v1,
  Users: users_user_openshift_io_v1
}

export default fastPathCases
