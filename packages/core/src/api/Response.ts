/*
 * Copyright 2023 The Kubernetes Authors
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

export {
  ModeOrButton as Mode,
  Button,
  isButton,
  isViewButton,
  Mode as MultiModalMode,
  MultiModalResponse
} from '../models/mmr/types'

export {
  ScalarResponse,
  isScalarResponse,
  MetadataNamedResource,
  MixedResponse,
  isMixedResponse,
  RawResponse,
  hasSourceReferences,
  WithSourceReferences,
  SourceRef,
  MetadataBearingByReference as ResourceByReference,
  MetadataBearingByReferenceWithContent as ResourceByReferenceWithContent,
  isMetadataBearingByReference as isResourceByReference
} from '../models/entity'

export {
  Breadcrumb,
  NavResponse,
  isNavResponse,
  Link,
  isLink,
  isLinkWithHref,
  isLinkWithCommand,
  Menu
} from '../models/NavResponse'

export { KResponse } from '../models/command'

export { CommentaryResponse, isCommentaryResponse, maybeKuiLink } from '../models/CommentaryResponse'

export { isCodedError } from '../models/errors'

export { isUsageError, UsageError, UsageModel, UsageRow } from '../core/usage-error'
